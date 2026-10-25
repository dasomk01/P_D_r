import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { aiErrorMessage, jsonCall } from "@/lib/ai/claude";
import { TOON_PLAN_SCHEMA, TOON_SYSTEM, TRAVEL_PLAN_SCHEMA, TRAVEL_SYSTEM, charactersForAi, placeForAi } from "@/lib/ai/prompts";
import { matchArchive } from "@/lib/archive-match";
import { emptyToon, emptyTravel } from "@/lib/content-template";
import type { Asset, Character, Content, ContentData, Idea, Place, PlaceResearch, Project, ToonData, TravelData } from "@/lib/types";

export const maxDuration = 300;

interface TravelOut {
  summary: string;
  format: string;
  concept: string;
  route: { name: string; place_id: string | null; transport: string; duration: string; note: string }[];
  pages: { role: string; headline: string; body: string; notes: string }[];
  caption: string;
  hashtags: string[];
  facts: { item: string; value: string; source_url: string }[];
}

interface ToonOut {
  summary: string;
  synopsis: string;
  cuts: { scene: string; notes: string; lines: { speaker: string; text: string }[] }[];
  caption: string;
  hashtags: string[];
}

/**
 * 아이디어(ideaId) 또는 제작 중 콘텐츠(contentId)에 대한 AI 기획안.
 * 결과는 ai_runs 에 저장되고, 콘텐츠에 바로 덮어쓰지 않습니다(사용자가 저장해야 반영).
 */
export async function POST(req: NextRequest) {
  const auth = await apiMember({ needAi: true });
  if ("error" in auth) return auth.error;
  const { sb } = auth;
  const body = (await req.json()) as { ideaId?: string; contentId?: string; current?: ContentData };

  let idea: Idea | null = null;
  let content: Content | null = null;
  if (body.ideaId) idea = (await sb.from("ideas").select("*").eq("id", body.ideaId).maybeSingle()).data as Idea | null;
  if (body.contentId) {
    content = (await sb.from("contents").select("*").eq("id", body.contentId).maybeSingle()).data as Content | null;
    if (content?.idea_id) idea = (await sb.from("ideas").select("*").eq("id", content.idea_id).maybeSingle()).data as Idea | null;
  }
  const projectId = content?.project_id ?? idea?.project_id;
  if (!projectId) return NextResponse.json({ error: "대상을 찾을 수 없습니다." }, { status: 404 });
  const topic = content?.title ?? idea!.title;
  const memo = idea?.memo ?? "";
  const keywords = [...(content?.keywords ?? []), ...(idea?.tags ?? [])];

  try {
    let plan: ContentData;
    let summary: string;
    let model: string;

    if (projectId === "korea-trip") {
      const [places, assets, research, contents] = await Promise.all([
        sb.from("places").select("*").then((r) => (r.data ?? []) as Place[]),
        sb.from("assets").select("id,place_id,origin,usage_allowed,mime_type").eq("project_id", "korea-trip").then((r) => (r.data ?? []) as Asset[]),
        sb.from("place_research").select("*").then((r) => (r.data ?? []) as PlaceResearch[]),
        sb.from("contents").select("id,title,keywords,status,scheduled_date,created_at").eq("project_id", "korea-trip").then((r) => (r.data ?? []) as Content[]),
      ]);
      const current = body.current?.kind === "travel" ? body.current : null;
      const linkedIds = new Set([...(idea?.place_ids ?? []), ...(current?.place_ids ?? [])]);
      const m = matchArchive(`${topic} ${keywords.join(" ")}`, { places, assets, research, contents: contents.filter((c) => c.id !== content?.id) });
      const chosen = [...places.filter((p) => linkedIds.has(p.id)), ...m.places.filter((p) => !linkedIds.has(p.id))].slice(0, 14);
      const usable = (p: Place) => assets.filter((a) => a.place_id === p.id && a.usage_allowed && a.origin === "own_photo" && a.mime_type.startsWith("image/")).length;
      const prompt = `Topic: ${topic}
Format hint: ${current?.format ?? (/2박/.test(topic) ? "2박 3일" : /1박/.test(topic) ? "1박 2일" : "당일치기")}
Creators' memo (Korean): ${memo || "(none)"}
Keywords: ${keywords.join(", ") || "(none)"}

Archive places (prioritise [OUR EXPERIENCE]; linked/first ones are most relevant):
${chosen.map((p) => placeForAi(p, research, usable(p))).join("\n") || "(no matching archive places — plan from general knowledge and mark facts for verification)"}

Recently made contents (avoid repeating the same angle): ${m.pastContents.map((c) => c.title).join(" / ") || "(none)"}
${current ? `\nCurrent draft to improve (keep good parts):\n${JSON.stringify({ pages: current.pages.map(({ role, headline, body }) => ({ role, headline, body })), caption: current.caption, hashtags: current.hashtags })}` : ""}

Return the full 7-slide plan.`;
      const out = await jsonCall<TravelOut>({ system: TRAVEL_SYSTEM, content: prompt, schema: TRAVEL_PLAN_SCHEMA, effort: "medium" });
      model = out.model;
      summary = out.data.summary;
      const t = emptyTravel(out.data.format);
      const placeIds = new Set(places.map((p) => p.id));
      t.concept = out.data.concept;
      t.route = out.data.route.map((r) => ({ ...r, place_id: r.place_id && placeIds.has(r.place_id) ? r.place_id : null }));
      t.pages = t.pages.map((p, i) => {
        const o = out.data.pages[i];
        return o ? { ...p, role: o.role || p.role, headline: o.headline, body: o.body, notes: o.notes } : p;
      });
      t.caption = out.data.caption;
      const tags = out.data.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`).replace(/\s/g, ""));
      t.hashtags = [...tags.slice(0, 5), ...Array(Math.max(0, 5 - tags.length)).fill("")];
      t.facts = out.data.facts.map((f) => ({ ...f, verified: false }));
      t.place_ids = [...new Set([...linkedIds, ...t.route.map((r) => r.place_id).filter((x): x is string => !!x)])];
      plan = t satisfies TravelData;
    } else {
      const [chars, proj] = await Promise.all([
        sb.from("characters").select("*").order("sort_order").then((r) => (r.data ?? []) as Character[]),
        sb.from("projects").select("*").eq("id", "med-toon").single().then((r) => r.data as Project),
      ]);
      const current = body.current?.kind === "toon" ? body.current : null;
      const prompt = `소재: ${topic}
메모: ${memo || "(없음)"}
캐릭터 설정집:
${charactersForAi(chars, proj?.settings.style ?? "")}
${current ? `\n현재 초안 (좋은 부분은 살려서 다듬기):\n${JSON.stringify({ synopsis: current.synopsis, cuts: current.cuts.map(({ scene, lines }) => ({ scene, lines })) })}` : ""}

에피소드 줄거리, 컷별 스토리보드, 대사, 캡션, 해시태그를 만들어 주세요.`;
      const out = await jsonCall<ToonOut>({ system: TOON_SYSTEM, content: prompt, schema: TOON_PLAN_SCHEMA, effort: "medium" });
      model = out.model;
      summary = out.data.summary;
      const t: ToonData = emptyToon(0);
      t.synopsis = out.data.synopsis;
      t.cuts = out.data.cuts.map((c, i) => ({ no: i + 1, scene: c.scene, lines: c.lines, asset_id: null, notes: c.notes }));
      t.caption = out.data.caption;
      t.hashtags = out.data.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`));
      plan = t;
    }

    await sb.from("ai_runs").insert({
      project_id: projectId,
      kind: body.ideaId ? "idea_plan" : "content_draft",
      target_id: body.ideaId ?? body.contentId,
      input: { topic, keywords },
      output: { plan, summary },
      model,
    });
    if (idea && body.ideaId && idea.status === "idea") await sb.from("ideas").update({ status: "ai_planning" }).eq("id", idea.id);
    return NextResponse.json({ plan, summary, model });
  } catch (e) {
    const message = aiErrorMessage(e);
    await sb.from("ai_runs").insert({ project_id: projectId, kind: "plan", target_id: body.ideaId ?? body.contentId, status: "error", error: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
