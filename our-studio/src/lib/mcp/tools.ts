import "server-only";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { adminClient } from "./admin";
import { recommendNext, recentDuplicates } from "../recommend";
import { matchArchive } from "../archive-match";
import { emptyToon, emptyTravel, validateTravel, publicText } from "../content-template";
import { scanPrivacy } from "../privacy";
import { kstToday } from "../dates";
import { TOON_SYSTEM, TRAVEL_SYSTEM } from "../ai/prompts";
import type {
  Asset,
  Character,
  Comment,
  Content,
  ContentData,
  ContentVersion,
  Idea,
  IdeaVote,
  Place,
  PlaceResearch,
  Project,
  ToonData,
  TravelData,
} from "../types";

const PROJECT = z.enum(["korea-trip", "med-toon"]).describe("korea-trip = KOREA TRIP 여행 캐러셀, med-toon = MED SCHOOL TOON 인스타툰");

const INSTRUCTIONS = `OUR STUDIO is the private workspace of two creators who run two Instagram accounts:
- korea-trip: English 7-slide travel carousels for foreign tourists (@korea_trip_always)
- med-toon: an anonymous Korean webtoon about two medical students (white rabbit girl, brown bear boy)

Typical flow when asked to make content:
1. get_project_rules(project) — always read the rules first.
2. get_next_up(project) — what to make next (respect the order), or get_idea / list_ideas.
3. For korea-trip: search_archive(region or topic) and get_place for details. Material marked OUR_EXPERIENCE is first-hand; RESEARCHED is not — never present researched facts as personal experience. Never reveal visit dates or who visited.
4. save_content_draft — saves a DRAFT for the two creators to review in the studio. It never publishes anything. Fix any issues it returns and save again with content_id.
Write tools change shared data; only call them when the user asked for it.`;

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function trimPlace(p: Place, research: PlaceResearch[], assets: Asset[]) {
  const photos = assets.filter((a) => a.place_id === p.id && a.mime_type.startsWith("image/"));
  return {
    id: p.id,
    name: p.name,
    region: p.region,
    address: p.address,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    status: p.status === "visited" ? "visited_by_us" : "not_visited_wishlist",
    OUR_EXPERIENCE:
      p.status === "visited"
        ? {
            review: p.review,
            recommended: p.recommended,
            price_we_paid: p.price_paid,
            liked: p.pros,
            disliked: p.cons,
            why_for_foreigners: p.why_foreigners,
            would_revisit: p.revisit,
          }
        : null,
    RESEARCHED: research
      .filter((r) => r.place_id === p.id)
      .map((r) => ({ kind: r.kind, title: r.title, body: r.body, url: r.url, verified: r.verified, source: r.provenance })),
    tags: p.tags,
    links: p.links.filter(Boolean),
    photos: {
      own_usable: photos.filter((a) => a.origin === "own_photo" && a.usage_allowed).length,
      other_licensed_usable: photos.filter((a) => a.origin !== "own_photo" && a.usage_allowed && a.origin !== "ai_generated").length,
      not_usable: photos.filter((a) => !a.usage_allowed).length,
    },
  };
}

const pageSchema = z.object({
  role: z.string().optional(),
  headline: z.string(),
  body: z.string(),
  notes: z.string().optional().describe("내부 메모 (한국어, 공개 안 됨)"),
});

const cutSchema = z.object({
  scene: z.string().describe("장면 설명"),
  lines: z.array(z.object({ speaker: z.string(), text: z.string() })),
  notes: z.string().optional(),
});

export function buildServer(userId: string, origin: string): McpServer {
  const sb = adminClient();
  const server = new McpServer({ name: "OUR STUDIO", version: "1.0.0" }, { instructions: INSTRUCTIONS });
  const link = (path: string) => `${origin}${path}`;

  const load = async <T>(q: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T> => {
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data as T;
  };

  // ── 읽기 ───────────────────────────────────────────
  server.registerTool(
    "get_project_rules",
    {
      title: "제작 규칙 확인",
      description: "Rules, format and privacy constraints for a project. For med-toon also returns the character bible and drawing style. Call this before writing any content.",
      inputSchema: { project: PROJECT },
      annotations: { readOnlyHint: true },
    },
    async ({ project }) => {
      const proj = await load<Project>(sb.from("projects").select("*").eq("id", project).single());
      const base = {
        project: proj.name,
        handle: proj.handle,
        daily_target_time_kst: proj.daily_time.slice(0, 5),
        rules: project === "korea-trip" ? TRAVEL_SYSTEM : TOON_SYSTEM,
      };
      if (project === "korea-trip") return json(base);
      const chars = await load<Character[]>(sb.from("characters").select("*").order("sort_order"));
      return json({
        ...base,
        characters: chars.map(({ name, species, role, appearance, personality, speech_style, rules }) => ({
          name,
          species,
          role,
          appearance,
          personality,
          speech_style,
          rules,
        })),
        drawing_style: proj.settings.style ?? "",
        note: "등록된 실명·금지어 목록은 보안상 공개하지 않습니다. save_content_draft 가 자동으로 검사합니다.",
      });
    },
  );

  server.registerTool(
    "get_next_up",
    {
      title: "다음 제작 추천",
      description:
        "What to make next, in the creators' priority order: (1) ideas marked 'next', (2) shared ideas not yet made (most votes first), (3) korea-trip only: places we actually visited that have no content yet, (4) older imported/AI ideas.",
      inputSchema: { project: PROJECT, limit: z.number().int().min(1).max(20).optional() },
      annotations: { readOnlyHint: true },
    },
    async ({ project, limit }) => {
      const [ideas, votes, contents, places] = await Promise.all([
        load<Idea[]>(sb.from("ideas").select("*").eq("project_id", project)),
        load<IdeaVote[]>(sb.from("idea_votes").select("idea_id,user_id")),
        load<Content[]>(sb.from("contents").select("*").eq("project_id", project)),
        project === "korea-trip" ? load<Place[]>(sb.from("places").select("*")) : Promise.resolve([] as Place[]),
      ]);
      const counts: Record<string, number> = {};
      for (const v of votes) counts[v.idea_id] = (counts[v.idea_id] ?? 0) + 1;
      const rec = recommendNext({ projectKind: project === "korea-trip" ? "travel" : "toon", ideas, votes: counts, places, contents, limit: limit ?? 8 });
      return json(
        rec.map((r, i) => ({
          order: i + 1,
          source: r.source,
          reason: r.reason,
          title: r.title,
          idea_id: r.idea?.id,
          idea_memo: r.idea?.memo,
          idea_tags: r.idea?.tags,
          place_id: r.place?.id,
        })),
      );
    },
  );

  server.registerTool(
    "list_ideas",
    {
      title: "아이디어 목록",
      description: "List ideas on the shared board. Optional text query and status filter.",
      inputSchema: {
        project: PROJECT,
        query: z.string().optional(),
        status: z.enum(["idea", "ai_planning", "ready", "in_production", "in_review", "revising", "approved"]).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ project, query, status }) => {
      let q = sb.from("ideas").select("id,title,memo,tags,priority,status,is_next,source,created_at").eq("project_id", project).order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      let rows = await load<Idea[]>(q);
      if (query) {
        const n = query.toLowerCase();
        rows = rows.filter((i) => `${i.title} ${i.memo} ${i.tags.join(" ")}`.toLowerCase().includes(n));
      }
      return json(rows.slice(0, 50));
    },
  );

  server.registerTool(
    "get_idea",
    {
      title: "아이디어 상세",
      description: "One idea with its memo, links, comments from the two creators, and linked archive places.",
      inputSchema: { idea_id: z.string().uuid() },
      annotations: { readOnlyHint: true },
    },
    async ({ idea_id }) => {
      const idea = await load<Idea | null>(sb.from("ideas").select("*").eq("id", idea_id).maybeSingle());
      if (!idea) return json({ error: "not found" });
      const [comments, places, research, assets] = await Promise.all([
        load<Comment[]>(sb.from("comments").select("body,created_at,kind").eq("target_type", "idea").eq("target_id", idea_id).order("created_at")),
        idea.place_ids.length ? load<Place[]>(sb.from("places").select("*").in("id", idea.place_ids)) : Promise.resolve([] as Place[]),
        idea.place_ids.length ? load<PlaceResearch[]>(sb.from("place_research").select("*").in("place_id", idea.place_ids)) : Promise.resolve([] as PlaceResearch[]),
        idea.place_ids.length ? load<Asset[]>(sb.from("assets").select("*").in("place_id", idea.place_ids)) : Promise.resolve([] as Asset[]),
      ]);
      return json({
        id: idea.id,
        project: idea.project_id,
        title: idea.title,
        memo: idea.memo,
        tags: idea.tags,
        links: idea.links.filter(Boolean),
        status: idea.status,
        is_next: idea.is_next,
        comments: comments.map((c) => c.body),
        linked_places: places.map((p) => trimPlace(p, research, assets)),
        url: link(`/ideas/${idea.id}`),
      });
    },
  );

  server.registerTool(
    "search_archive",
    {
      title: "여행 아카이브 검색",
      description:
        "Search the KOREA TRIP travel archive (places the creators visited, wishlist places, researched info) by topic or region, e.g. '강릉 2박 3일' or 'Busan'. Returns places with OUR_EXPERIENCE vs RESEARCHED kept separate, plus related past contents.",
      inputSchema: { query: z.string().min(1) },
      annotations: { readOnlyHint: true },
    },
    async ({ query }) => {
      const [places, assets, research, contents] = await Promise.all([
        load<Place[]>(sb.from("places").select("*")),
        load<Asset[]>(sb.from("assets").select("*").eq("project_id", "korea-trip")),
        load<PlaceResearch[]>(sb.from("place_research").select("*")),
        load<Content[]>(sb.from("contents").select("*").eq("project_id", "korea-trip")),
      ]);
      const m = matchArchive(query, { places, assets, research, contents });
      const needle = query.toLowerCase();
      const extra = m.places.length ? [] : places.filter((p) => `${p.name} ${p.region} ${p.address}`.toLowerCase().includes(needle));
      return json({
        places: [...m.places, ...extra].slice(0, 15).map((p) => trimPlace(p, research, assets)),
        past_contents: m.pastContents.map((c) => ({ id: c.id, title: c.title, status: c.status, date: c.scheduled_date })),
      });
    },
  );

  server.registerTool(
    "get_place",
    {
      title: "장소 상세",
      description: "Full details of one archive place including our review, researched info and nearby research.",
      inputSchema: { place_id: z.string().uuid() },
      annotations: { readOnlyHint: true },
    },
    async ({ place_id }) => {
      const [place, research, assets] = await Promise.all([
        load<Place | null>(sb.from("places").select("*").eq("id", place_id).maybeSingle()),
        load<PlaceResearch[]>(sb.from("place_research").select("*").eq("place_id", place_id)),
        load<Asset[]>(sb.from("assets").select("*").eq("place_id", place_id)),
      ]);
      if (!place) return json({ error: "not found" });
      return json({ ...trimPlace(place, research, assets), url: link(`/archive/places/${place.id}`) });
    },
  );

  server.registerTool(
    "list_contents",
    {
      title: "콘텐츠 목록",
      description: "Contents in the studio (drafts, in review, approved) with schedule date. Use to avoid repeating recent topics.",
      inputSchema: { project: PROJECT, status: z.enum(["ai_planning", "ready", "in_production", "in_review", "revising", "approved"]).optional() },
      annotations: { readOnlyHint: true },
    },
    async ({ project, status }) => {
      let q = sb.from("contents").select("id,title,keywords,status,scheduled_date,current_version_no,updated_at").eq("project_id", project).order("updated_at", { ascending: false });
      if (status) q = q.eq("status", status);
      return json((await load<Content[]>(q)).slice(0, 60).map((c) => ({ ...c, url: link(`/studio/${c.id}`) })));
    },
  );

  server.registerTool(
    "get_content",
    {
      title: "콘텐츠 상세",
      description: "Current version of a content (pages/cuts, caption, hashtags) plus open revision requests and comments from the creators.",
      inputSchema: { content_id: z.string().uuid() },
      annotations: { readOnlyHint: true },
    },
    async ({ content_id }) => {
      const content = await load<Content | null>(sb.from("contents").select("*").eq("id", content_id).maybeSingle());
      if (!content) return json({ error: "not found" });
      const [ver, comments] = await Promise.all([
        load<ContentVersion>(sb.from("content_versions").select("*").eq("content_id", content_id).eq("version_no", content.current_version_no).single()),
        load<Comment[]>(sb.from("comments").select("*").eq("target_type", "content").eq("target_id", content_id).order("created_at")),
      ]);
      return json({
        id: content.id,
        project: content.project_id,
        title: content.title,
        status: content.status,
        version: ver.version_no,
        approved_and_locked: ver.locked,
        data: ver.data,
        open_revision_requests: comments.filter((c) => c.kind === "revision_request" && !c.resolved).map((c) => ({ page: c.page_no, request: c.body })),
        comments: comments.filter((c) => c.kind === "comment").map((c) => ({ page: c.page_no, comment: c.body })),
        url: link(`/studio/${content.id}`),
      });
    },
  );

  // 표준 search / fetch (ChatGPT 검색·딥리서치 호환)
  server.registerTool(
    "search",
    {
      title: "검색",
      description: "Search ideas, archive places and contents across OUR STUDIO. Returns ids usable with fetch.",
      inputSchema: { query: z.string() },
      annotations: { readOnlyHint: true },
    },
    async ({ query }) => {
      const n = query.toLowerCase();
      const [ideas, places, contents] = await Promise.all([
        load<Idea[]>(sb.from("ideas").select("id,title,memo,tags,project_id")),
        load<Place[]>(sb.from("places").select("id,name,region,address,review,tags")),
        load<Content[]>(sb.from("contents").select("id,title,keywords,project_id")),
      ]);
      const results = [
        ...ideas.filter((i) => `${i.title} ${i.memo} ${i.tags.join(" ")}`.toLowerCase().includes(n)).map((i) => ({ id: `idea:${i.id}`, title: `[아이디어 · ${i.project_id}] ${i.title}`, url: link(`/ideas/${i.id}`) })),
        ...places.filter((p) => `${p.name} ${p.region} ${p.address} ${p.review} ${p.tags.join(" ")}`.toLowerCase().includes(n)).map((p) => ({ id: `place:${p.id}`, title: `[장소] ${p.region} ${p.name}`, url: link(`/archive/places/${p.id}`) })),
        ...contents.filter((c) => `${c.title} ${c.keywords.join(" ")}`.toLowerCase().includes(n)).map((c) => ({ id: `content:${c.id}`, title: `[콘텐츠 · ${c.project_id}] ${c.title}`, url: link(`/studio/${c.id}`) })),
      ];
      return json({ results: results.slice(0, 30) });
    },
  );

  server.registerTool(
    "fetch",
    {
      title: "가져오기",
      description: "Fetch one item returned by search (id like 'idea:…', 'place:…', 'content:…').",
      inputSchema: { id: z.string() },
      annotations: { readOnlyHint: true },
    },
    async ({ id }) => {
      const [kind, rid] = id.split(":");
      const table = kind === "idea" ? "ideas" : kind === "place" ? "places" : kind === "content" ? "contents" : null;
      if (!table || !rid) return json({ error: "unknown id" });
      const row = await load<Record<string, unknown> | null>(sb.from(table).select("*").eq("id", rid).maybeSingle());
      if (!row) return json({ error: "not found" });
      if (kind === "place") {
        const r = { ...row };
        delete r.visited_on;
        delete r.visitors;
        return json({ id, title: String(r.name), text: JSON.stringify(r), url: link(`/archive/places/${rid}`) });
      }
      return json({ id, title: String(row.title), text: JSON.stringify(row), url: link(`/${kind === "idea" ? "ideas" : "studio"}/${rid}`) });
    },
  );

  // ── 쓰기 ───────────────────────────────────────────
  server.registerTool(
    "create_idea",
    {
      title: "아이디어 추가",
      description: "Add a new idea to the shared board (marked as suggested by AI). Use when the user asks to save a topic for later.",
      inputSchema: { project: PROJECT, title: z.string().min(1).max(200), memo: z.string().optional(), tags: z.array(z.string()).optional() },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ project, title, memo, tags }) => {
      const idea = await load<Idea>(
        sb
          .from("ideas")
          .insert({ project_id: project, title, memo: memo ?? "", tags: tags ?? [], source: "ai_suggested", created_by: userId, updated_by: userId })
          .select()
          .single(),
      );
      return json({ id: idea.id, url: link(`/ideas/${idea.id}`) });
    },
  );

  server.registerTool(
    "save_content_draft",
    {
      title: "콘텐츠 초안 저장",
      description:
        "Save a content DRAFT to the studio for the creators to review (status: 검토 대기). Never publishes. Without content_id a new content is created; with content_id a new version is added (approved versions are never overwritten). " +
        "korea-trip: pass exactly 7 pages (English headline/body), English caption, exactly 5 hashtags, optional route and facts with official source URLs. " +
        "med-toon: pass synopsis and cuts with dialogue (Korean). Returns rule/privacy issues to fix — if any, fix them and save again with the same content_id.",
      inputSchema: {
        project: PROJECT,
        title: z.string().min(1).max(200),
        content_id: z.string().uuid().optional().describe("기존 콘텐츠에 새 버전으로 저장할 때"),
        idea_id: z.string().uuid().optional().describe("이 아이디어에서 시작한 콘텐츠라면"),
        keywords: z.array(z.string()).optional(),
        change_note: z.string().optional(),
        format: z.enum(["당일치기", "1박 2일", "2박 3일", "교통·여행 팁", "장소 단독 소개"]).optional(),
        concept: z.string().optional(),
        route: z
          .array(z.object({ name: z.string(), place_id: z.string().uuid().optional(), transport: z.string().optional(), duration: z.string().optional(), note: z.string().optional() }))
          .optional(),
        pages: z.array(pageSchema).optional(),
        facts: z.array(z.object({ item: z.string(), value: z.string(), source_url: z.string().optional() })).optional(),
        place_ids: z.array(z.string().uuid()).optional(),
        synopsis: z.string().optional(),
        cuts: z.array(cutSchema).optional(),
        caption: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (a) => {
      let content: Content | null = null;
      let prev: ContentVersion | null = null;
      if (a.content_id) {
        content = await load<Content | null>(sb.from("contents").select("*").eq("id", a.content_id).maybeSingle());
        if (!content) return json({ error: "content not found" });
        if (content.project_id !== a.project) return json({ error: "project mismatch" });
        prev = await load<ContentVersion>(sb.from("content_versions").select("*").eq("content_id", content.id).eq("version_no", content.current_version_no).single());
      }

      let data: ContentData;
      if (a.project === "korea-trip") {
        const base: TravelData = prev?.data.kind === "travel" ? structuredClone(prev.data) : emptyTravel(a.format);
        const t = base;
        if (a.format) t.format = a.format;
        if (a.concept !== undefined) t.concept = a.concept;
        if (a.route) t.route = a.route.map((r) => ({ name: r.name, place_id: r.place_id ?? null, transport: r.transport ?? "", duration: r.duration ?? "", note: r.note ?? "" }));
        if (a.pages) {
          t.pages = a.pages.map((p, i) => ({
            no: i + 1,
            role: p.role || t.pages[i]?.role || `Slide ${i + 1}`,
            headline: p.headline,
            body: p.body,
            notes: p.notes ?? "",
            asset_id: t.pages[i]?.asset_id ?? null,
            photo_credit: t.pages[i]?.photo_credit ?? "",
          }));
        }
        if (a.facts) t.facts = a.facts.map((f) => ({ item: f.item, value: f.value, source_url: f.source_url ?? "", verified: false }));
        if (a.caption !== undefined) t.caption = a.caption;
        if (a.hashtags) t.hashtags = a.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`).replace(/\s/g, ""));
        t.place_ids = [...new Set([...t.place_ids, ...(a.place_ids ?? []), ...t.route.map((r) => r.place_id).filter((x): x is string => !!x)])];
        data = t;
      } else {
        const t: ToonData = prev?.data.kind === "toon" ? structuredClone(prev.data) : emptyToon(0);
        if (a.synopsis !== undefined) t.synopsis = a.synopsis;
        if (a.cuts) t.cuts = a.cuts.map((c, i) => ({ no: i + 1, scene: c.scene, lines: c.lines, notes: c.notes ?? "", asset_id: t.cuts[i]?.asset_id ?? null }));
        if (a.caption !== undefined) t.caption = a.caption;
        if (a.hashtags) t.hashtags = a.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`));
        t.anonymity_checked = false;
        data = t;
      }

      const note = a.change_note || "ChatGPT 초안";
      if (!content) {
        content = await load<Content>(
          sb
            .from("contents")
            .insert({
              project_id: a.project,
              title: a.title,
              idea_id: a.idea_id ?? null,
              keywords: a.keywords ?? [],
              status: "in_review",
              current_version_no: 1,
              created_by: userId,
              updated_by: userId,
            })
            .select()
            .single(),
        );
        await load(sb.from("content_versions").insert({ content_id: content.id, version_no: 1, data, change_note: note, created_by: userId }).select("id"));
      } else {
        const no = content.current_version_no + 1;
        await load(sb.from("content_versions").insert({ content_id: content.id, version_no: no, data, change_note: note, created_by: userId }).select("id"));
        await load(
          sb
            .from("contents")
            .update({
              current_version_no: no,
              title: a.title,
              ...(a.keywords ? { keywords: a.keywords } : {}),
              status: content.status === "approved" ? "revising" : "in_review",
              updated_by: userId,
            })
            .eq("id", content.id)
            .select("id"),
        );
      }

      // 검수: 여행 규칙 / 툰 익명성, 30일 중복
      let issues: string[];
      if (data.kind === "travel") {
        issues = validateTravel(data).filter((i) => !i.includes("출처 확인이 안 된"));
      } else {
        const proj = await load<Project>(sb.from("projects").select("settings").eq("id", "med-toon").single());
        issues = scanPrivacy(publicText(data), proj.settings.sensitive_terms ?? []).map((f) => `익명성: ${f.message} — “${f.match}”`);
      }
      const siblings = await load<Content[]>(sb.from("contents").select("*").eq("project_id", a.project));
      const dupes = recentDuplicates(`${a.title} ${(a.keywords ?? []).join(" ")}`, siblings, kstToday(), content.id).map((d) => d.item.title);

      return json({
        saved: true,
        content_id: content.id,
        version: a.content_id ? content.current_version_no + 1 : 1,
        status: "검토 대기 — 두 사람이 사이트에서 검토·승인합니다 (게시되지 않음)",
        issues_to_fix: issues,
        similar_recent_contents: dupes,
        url: link(`/studio/${content.id}`),
      });
    },
  );

  server.registerTool(
    "add_place_research",
    {
      title: "장소 조사 자료 저장",
      description:
        "Save researched info about an archive place (nearby attractions, food, routes, official info, photo candidate links, content topics). Stored as AI research, unverified, kept separate from the creators' own experience. Photo candidates are links only — never claim a photo is free to use unless the page says so.",
      inputSchema: {
        place_id: z.string().uuid(),
        items: z
          .array(
            z.object({
              kind: z.enum(["location", "nearby_attraction", "nearby_food", "route", "official_info", "photo_candidate", "content_topic", "note"]),
              title: z.string(),
              body: z.string().optional(),
              url: z.string().url().optional(),
              source_name: z.string().optional(),
              license_note: z.string().optional(),
            }),
          )
          .min(1)
          .max(30),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ place_id, items }) => {
      const rows = items.map((it) => ({
        place_id,
        kind: it.kind,
        title: it.title.slice(0, 200),
        body: it.body ?? "",
        url: it.url ?? null,
        source_name: it.source_name ?? "ChatGPT",
        license_note: it.license_note ?? "",
        usage_status: "reference_only",
        provenance: "ai",
        verified: false,
        ai_model: "chatgpt",
        created_by: userId,
      }));
      await load(sb.from("place_research").insert(rows).select("id"));
      return json({ saved: rows.length, url: link(`/archive/places/${place_id}`) });
    },
  );

  return server;
}
