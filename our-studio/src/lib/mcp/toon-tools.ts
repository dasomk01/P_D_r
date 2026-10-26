import "server-only";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { STORAGE_BUCKET } from "../supabase/env";
import { recommendNext } from "../recommend";
import { imageInfo, slotStatus, structuralCheck, styleGuideText, VARIANTS, type Variant } from "../toon-spec";
import { loadStyleRefs, loadToon, qcAsset, runToonQc } from "../toon-qc";
import { aiConfigured } from "../ai/config";
import type { Asset, Character, Content, Idea, IdeaVote, ImageQc, Project } from "../types";

type Ctx = { sb: SupabaseClient; userId: string; link: (p: string) => string };

const VARIANT = z.enum(["feed", "reels"]).describe("feed = 피드 4:5 1080×1350 PNG, reels = 릴스 9:16 1080×1920 PNG (동영상 아님)");

function text(data: unknown) {
  return { type: "text" as const, text: JSON.stringify(data, null, 2) };
}

async function signed(sb: SupabaseClient, path: string, sec = 60 * 60 * 24) {
  const { data } = await sb.storage.from(STORAGE_BUCKET).createSignedUrl(path, sec);
  return data?.signedUrl ?? null;
}

async function imageBlock(sb: SupabaseClient, a: Asset) {
  const { data } = await sb.storage.from(STORAGE_BUCKET).download(a.thumb_path ?? a.storage_path);
  if (!data) return null;
  const buf = Buffer.from(await data.arrayBuffer());
  if (buf.length > 4_000_000) return null;
  const fmt = imageInfo(new Uint8Array(buf)).format;
  const mimeType = fmt === "png" ? "image/png" : fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : null;
  return mimeType ? { type: "image" as const, data: buf.toString("base64"), mimeType } : null;
}

/** ChatGPT 파일 파라미터({download_url,...}) · URL · base64 중 하나에서 이미지 바이트를 얻습니다. */
async function readImageInput(input: { image?: unknown; image_url?: string; image_base64?: string }): Promise<Uint8Array> {
  if (input.image_base64) return new Uint8Array(Buffer.from(input.image_base64.replace(/^data:[^;]+;base64,/, ""), "base64"));
  let url = input.image_url;
  const img = input.image as { download_url?: string } | string | undefined;
  if (!url && img && typeof img === "object" && typeof img.download_url === "string") url = img.download_url;
  if (!url && typeof img === "string" && /^https?:\/\//.test(img)) url = img;
  if (!url) {
    throw new Error(
      typeof img === "string"
        ? `이미지 파일이 링크 없이 '${img.slice(0, 40)}' 형태로만 전달됐습니다 (ChatGPT 모바일·일부 호출에서 생기는 문제). PC 웹에서 다시 시도하거나, 사이트의 제작실에서 해당 컷 칸에 직접 업로드하세요.`
        : "이미지가 전달되지 않았습니다. image(파일), image_url, image_base64 중 하나가 필요합니다.",
    );
  }
  const u = new URL(url);
  const localOk = (process.env.MCP_ALLOWED_REDIRECT_HOSTS ?? "").split(",").includes(u.hostname);
  if (u.protocol !== "https:" && !localOk) throw new Error("https 주소만 받을 수 있습니다.");
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`이미지를 내려받지 못했습니다 (${res.status}). 링크가 만료됐을 수 있습니다.`);
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.length > 20_000_000) throw new Error("이미지가 20MB 를 넘습니다.");
  return buf;
}

export function registerToonTools(server: McpServer, { sb, userId, link }: Ctx) {
  const toonContents = async () => (await sb.from("contents").select("*").eq("project_id", "med-toon")).data as Content[];

  server.registerTool(
    "get_style_bible",
    {
      title: "그림체 설정집",
      description:
        "MED SCHOOL TOON style bible: fixed rules for the white rabbit and brown bear (face, proportions, palette, line, speech bubbles, font), the character sheet, and the pinned reference images from the existing account. Call this before drawing ANY cut and match it exactly. Returns the reference images themselves plus temporary URLs.",
      inputSchema: { include_images: z.boolean().optional().describe("대표 이미지 자체를 함께 받기 (기본 true)") },
      annotations: { readOnlyHint: true },
    },
    async ({ include_images }) => {
      const [proj, chars, pinned] = await Promise.all([
        sb.from("projects").select("*").eq("id", "med-toon").single(),
        sb.from("characters").select("*").order("sort_order"),
        sb.from("assets").select("*").eq("project_id", "med-toon").eq("pinned", true).order("sort_order"),
      ]);
      const settings = (proj.data as Project).settings;
      const refs = (pinned.data ?? []) as Asset[];
      const characters = ((chars.data ?? []) as Character[]).map((c) => ({
        id: c.id,
        name: c.name,
        species: c.species,
        role: c.role,
        appearance: c.appearance,
        personality: c.personality,
        speech_style: c.speech_style,
        rules: c.rules,
      }));
      const list = await Promise.all(
        refs.map(async (a) => ({
          asset_id: a.id,
          kind: a.kind,
          character: characters.find((c) => c.id === a.character_id)?.name ?? null,
          caption: a.caption,
          url: await signed(sb, a.storage_path),
        })),
      );
      const blocks = include_images === false ? [] : (await Promise.all(refs.slice(0, 6).map((a) => imageBlock(sb, a)))).filter(Boolean);
      return {
        content: [
          text({
            style_guide: settings.style_guide ?? {},
            style_guide_text: styleGuideText(settings.style_guide, settings.style ?? ""),
            characters,
            reference_images: list,
            note: refs.length
              ? "아래 이미지가 기존 계정의 대표 그림체입니다. 모든 컷을 이 그림체와 동일하게 그리세요."
              : "고정된 대표 이미지가 아직 없습니다. 사이트의 캐릭터 설정집에서 대표 이미지를 올리고 📌 고정해 달라고 사용자에게 알려주세요.",
          }),
          ...(blocks as { type: "image"; data: string; mimeType: string }[]),
        ],
      };
    },
  );

  server.registerTool(
    "get_next_toon_task",
    {
      title: "다음 인스타툰 작업",
      description:
        "Returns exactly ONE MED SCHOOL TOON task in priority order. If an episode is already in production it returns action=resume with its content_id and the cut images still missing or failed — continue that one, do NOT start a new content. Otherwise action=start with the next idea (save the script with save_content_draft using idea_id).",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      const [ideas, votes, contents] = await Promise.all([
        sb.from("ideas").select("*").eq("project_id", "med-toon").then((r) => r.data as Idea[]),
        sb.from("idea_votes").select("idea_id,user_id").then((r) => r.data as IdeaVote[]),
        toonContents(),
      ]);
      const counts: Record<string, number> = {};
      for (const v of votes) counts[v.idea_id] = (counts[v.idea_id] ?? 0) + 1;
      const rec = recommendNext({ projectKind: "toon", ideas, votes: counts, contents, limit: 1 })[0];
      if (!rec) {
        const waiting = contents.filter((c) => c.status === "in_review").map((c) => c.title);
        return { content: [text({ action: "none", message: "만들 아이디어가 없습니다.", waiting_for_human_review: waiting })] };
      }
      if (rec.content) {
        const report = await runToonQc(sb, rec.content.id, { vision: false });
        return {
          content: [
            text({
              action: "resume",
              content_id: rec.content.id,
              title: rec.content.title,
              reason: rec.reason,
              idea: rec.idea ? { id: rec.idea.id, title: rec.idea.title, memo: rec.idea.memo } : null,
              cuts: report.cuts,
              script_issues: report.script_issues,
              redo: report.redo,
              needs_review: report.needs_review,
              next_steps: report.cuts === 0
                ? ["get_style_bible", "save_content_draft(content_id) 로 대본 저장", "컷마다 upload_cut_image(feed, reels)", "run_toon_qc"]
                : ["get_style_bible", "redo 목록의 칸만 새로 그려서 upload_cut_image", "run_toon_qc"],
              url: link(`/studio/${rec.content.id}`),
            }),
          ],
        };
      }
      const idea = rec.idea!;
      const comments = (await sb.from("comments").select("body").eq("target_type", "idea").eq("target_id", idea.id)).data ?? [];
      return {
        content: [
          text({
            action: "start",
            reason: rec.reason,
            idea: { id: idea.id, title: idea.title, memo: idea.memo, tags: idea.tags, comments: comments.map((c) => c.body) },
            next_steps: [
              "get_project_rules(med-toon), get_style_bible",
              "save_content_draft(project=med-toon, idea_id, title, synopsis, cuts, caption, hashtags×5) — 컷 수는 이야기에 맞게",
              "컷마다 피드·릴스 이미지를 각각 독립된 PNG 로 그려 upload_cut_image",
              "run_toon_qc → redo 칸만 다시",
            ],
          }),
        ],
      };
    },
  );

  server.registerTool(
    "upload_cut_image",
    {
      title: "컷 이미지 저장",
      description:
        "Save ONE finished cut image (a single independent panel, not a collage and not cropped from one) to the site and attach it to cut_no of the episode. variant=feed needs exactly 1080×1350 PNG, variant=reels exactly 1080×1920 PNG (still image, not video). Pass the generated image file as `image`. Images that fail the size/format check are rejected (not stored) with the reason. Replacing an existing image of that slot is fine — use it to redo failed cuts.",
      inputSchema: {
        content_id: z.string().uuid(),
        cut_no: z.number().int().min(1),
        variant: VARIANT,
        image: z.any().optional().describe("이미지 파일 (ChatGPT 파일 파라미터)"),
        image_url: z.string().optional().describe("이미지를 받을 수 있는 https 주소 (파일 대신)"),
        image_base64: z.string().optional().describe("base64 PNG (작은 이미지용, 파일 대신)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
      _meta: { "openai/fileParams": ["image"] },
    },
    async (a) => {
      try {
        const st = await loadToon(sb, a.content_id);
        const cut = st.data.cuts.find((c) => c.no === a.cut_no);
        if (!cut) return { content: [text({ saved: false, error: `컷 ${a.cut_no}번이 대본에 없습니다 (현재 ${st.data.cuts.length}컷). save_content_draft 로 대본부터 저장하세요.` })] };
        const bytes = await readImageInput(a);
        const info = imageInfo(bytes);
        const structural = structuralCheck(info, a.variant);
        if (!structural.ok) {
          return {
            content: [text({ saved: false, cut_no: a.cut_no, variant: a.variant, rejected: structural.issues, required: VARIANTS[a.variant] })],
          };
        }
        const path = `med-toon/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.png`;
        const up = await sb.storage.from(STORAGE_BUCKET).upload(path, bytes, { contentType: "image/png" });
        if (up.error) throw new Error(up.error.message);
        const qc: ImageQc = { width: info.width, height: info.height, format: "png", structural: { ...structural, at: new Date().toISOString(), by: "auto" } };
        const { data: asset, error } = await sb
          .from("assets")
          .insert({
            project_id: "med-toon",
            storage_path: path,
            file_name: `cut-${String(a.cut_no).padStart(2, "0")}-${a.variant}.png`,
            mime_type: "image/png",
            size_bytes: bytes.length,
            width: info.width,
            height: info.height,
            kind: "page_image",
            variant: a.variant,
            caption: `컷 ${a.cut_no} · ${VARIANTS[a.variant].label}`,
            origin: "ai_generated",
            usage_allowed: true,
            rights_holder: "OUR STUDIO (ChatGPT 생성)",
            license: "자체 제작 (AI 생성 일러스트)",
            content_id: a.content_id,
            uploaded_by: userId,
            qc,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        const { data: versionNo, error: rpcErr } = await sb.rpc("set_toon_cut_image", {
          p_content_id: a.content_id,
          p_cut_no: a.cut_no,
          p_variant: a.variant,
          p_asset_id: asset.id,
        });
        if (rpcErr) throw new Error(rpcErr.message);
        await sb.from("contents").update({ updated_by: userId }).eq("id", a.content_id);

        let finalQc = qc;
        if (aiConfigured()) finalQc = await qcAsset(sb, asset as Asset, a.variant, { cut, vision: true, refs: await loadStyleRefs(sb), bytes });
        const report = await runToonQc(sb, a.content_id, { vision: false });
        return {
          content: [
            text({
              saved: true,
              asset_id: asset.id,
              version: versionNo,
              cut_no: a.cut_no,
              variant: a.variant,
              status: slotStatus({ qc: finalQc }),
              vision_check: finalQc.vision ?? (aiConfigured() ? null : "서버 이미지 판독 미연결 — get_cut_images 로 직접 확인 후 report_cut_review 로 보고하세요"),
              remaining: report.redo,
              url: link(`/studio/${a.content_id}`),
            }),
          ],
        };
      } catch (e) {
        return { content: [text({ saved: false, error: e instanceof Error ? e.message : String(e) })], isError: true };
      }
    },
  );

  server.registerTool(
    "get_cut_images",
    {
      title: "컷 이미지 보기",
      description:
        "Read back the saved cut images of an episode (the images themselves, plus temporary URLs and QC status), e.g. to check consistency or continue work. Use cut_nos to page through (max 4 images returned per call).",
      inputSchema: {
        content_id: z.string().uuid(),
        variant: VARIANT.optional(),
        cut_nos: z.array(z.number().int().min(1)).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ content_id, variant, cut_nos }) => {
      const st = await loadToon(sb, content_id);
      const wanted = st.data.cuts.filter((c) => !cut_nos || cut_nos.includes(c.no));
      const items: { cut_no: number; variant: Variant; asset: Asset | null }[] = [];
      for (const c of wanted) {
        for (const v of (variant ? [variant] : ["feed", "reels"]) as Variant[]) {
          const id = v === "feed" ? c.asset_id : c.reel_asset_id;
          items.push({ cut_no: c.no, variant: v, asset: id ? (st.assets.get(id) ?? null) : null });
        }
      }
      const listing = await Promise.all(
        items.map(async (it) => ({
          cut_no: it.cut_no,
          variant: it.variant,
          asset_id: it.asset?.id ?? null,
          status: slotStatus(it.asset),
          qc: it.asset?.qc ?? null,
          url: it.asset ? await signed(sb, it.asset.storage_path) : null,
        })),
      );
      const withImg = items.filter((it) => it.asset).slice(0, 4);
      const blocks = (await Promise.all(withImg.map((it) => imageBlock(sb, it.asset!)))).filter(Boolean) as { type: "image"; data: string; mimeType: string }[];
      return {
        content: [
          text({
            images_attached_in_order: withImg.map((it) => `${it.cut_no}-${it.variant}`),
            more: items.filter((it) => it.asset).length > withImg.length ? "cut_nos 로 나머지를 요청하세요" : null,
            slots: listing,
          }),
          ...blocks,
        ],
      };
    },
  );

  server.registerTool(
    "run_toon_qc",
    {
      title: "인스타툰 자동 검수",
      description:
        "Check the whole episode: image count per set (feed and reels must both have one image per cut), exact size/ratio/PNG, cut order, script (caption 1, exactly 5 hashtags), anonymity; plus visual checks (style match, cut-off text, collage crops, identifying info) when the server has image review enabled. Returns `redo` = only the slots to make again.",
      inputSchema: { content_id: z.string().uuid(), recheck: z.boolean().optional().describe("이미 검사한 이미지도 다시 검사") },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ content_id, recheck }) => {
      const report = await runToonQc(sb, content_id, { recheck, vision: true, promote: true });
      return {
        content: [
          text({
            ...report,
            summary: report.complete
              ? "완료 — 검토 대기로 넘어갔습니다. 두 사람이 사이트에서 검토·승인하면 됩니다."
              : `다시 만들 칸 ${report.redo.length}개, 대본 문제 ${report.script_issues.length}개, 확인 필요 ${report.needs_review.length}개`,
            visual_review: report.vision_available
              ? "서버 이미지 판독 사용"
              : "서버 이미지 판독 미연결 — needs_review 칸은 get_cut_images 로 직접 보고 report_cut_review 로 결과를 보고하세요",
            url: link(`/studio/${content_id}`),
          }),
        ],
      };
    },
  );

  server.registerTool(
    "report_cut_review",
    {
      title: "컷 검토 결과 보고",
      description:
        "After looking at a saved cut image yourself (get_cut_images), record whether it passes: style matches the style bible, single independent panel (not a collage crop), no cut-off text, correct dialogue, no identifying info. ok=false puts the slot on the redo list.",
      inputSchema: {
        content_id: z.string().uuid(),
        cut_no: z.number().int().min(1),
        variant: VARIANT,
        ok: z.boolean(),
        issues: z.array(z.string()).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ content_id, cut_no, variant, ok, issues }) => {
      const st = await loadToon(sb, content_id);
      const cut = st.data.cuts.find((c) => c.no === cut_no);
      const id = cut ? (variant === "feed" ? cut.asset_id : cut.reel_asset_id) : null;
      const asset = id ? st.assets.get(id) : undefined;
      if (!asset) return { content: [text({ saved: false, error: "그 칸에 이미지가 없습니다." })] };
      const qc: ImageQc = { ...(asset.qc ?? {}), model_review: { ok, issues: ok ? [] : (issues ?? ["모델 검토 실패"]), at: new Date().toISOString(), by: "chatgpt" } };
      await sb.from("assets").update({ qc }).eq("id", asset.id);
      return { content: [text({ saved: true, cut_no, variant, status: slotStatus({ qc }) })] };
    },
  );
}
