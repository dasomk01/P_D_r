import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { aiConfigured } from "./ai/config";
import { jsonCall } from "./ai/claude";
import { STORAGE_BUCKET } from "./supabase/env";
import { publicText } from "./content-template";
import { scanPrivacy } from "./privacy";
import { imageInfo, structuralCheck, styleGuideText, toonReport, VARIANTS, type ToonQcReport, type Variant } from "./toon-spec";
import type { Asset, Character, Content, ContentVersion, ImageQc, Project, QcPart, ToonCut, ToonData } from "./types";

export async function downloadBytes(sb: SupabaseClient, path: string): Promise<Uint8Array> {
  const { data, error } = await sb.storage.from(STORAGE_BUCKET).download(path);
  if (error || !data) throw new Error(`파일을 읽지 못했습니다: ${error?.message ?? path}`);
  return new Uint8Array(await data.arrayBuffer());
}

export interface StyleRefs {
  guide: string;
  characters: string;
  images: { media: "image/png" | "image/jpeg" | "image/webp"; data: string }[];
}

/** 그림체 판독에 쓸 대표 이미지(최대 3장, 썸네일 우선)와 설정 텍스트 */
export async function loadStyleRefs(sb: SupabaseClient): Promise<StyleRefs> {
  const [proj, chars, pinned] = await Promise.all([
    sb.from("projects").select("settings").eq("id", "med-toon").single(),
    sb.from("characters").select("*").order("sort_order"),
    sb.from("assets").select("*").eq("project_id", "med-toon").eq("pinned", true).order("sort_order").limit(3),
  ]);
  const settings = (proj.data?.settings ?? {}) as Project["settings"];
  const images: StyleRefs["images"] = [];
  for (const a of (pinned.data ?? []) as Asset[]) {
    try {
      const bytes = await downloadBytes(sb, a.thumb_path ?? a.storage_path);
      if (bytes.length > 3_500_000) continue;
      const fmt = imageInfo(bytes).format;
      const media = fmt === "png" ? "image/png" : fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : null;
      if (media) images.push({ media, data: Buffer.from(bytes).toString("base64") });
    } catch {
      // 대표 이미지 하나를 못 읽어도 판독은 계속
    }
  }
  return {
    guide: styleGuideText(settings.style_guide, settings.style ?? ""),
    characters: ((chars.data ?? []) as Character[]).map((c) => `- ${c.name} (${c.species}, ${c.role}): ${c.appearance}`).join("\n"),
    images,
  };
}

const VISION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["single_panel", "collage_crop_suspected", "text_cut_off", "style_match", "identifying_info", "issues"],
  properties: {
    single_panel: { type: "boolean", description: "이미지 전체가 컷 하나인가 (여러 컷이 한 장에 있으면 false)" },
    collage_crop_suspected: { type: "boolean", description: "여러 컷 콜라주를 잘라낸 흔적(가장자리에 다른 컷의 일부, 잘린 테두리)이 있는가" },
    text_cut_off: { type: "boolean", description: "말풍선·글자가 이미지 밖으로 잘렸는가" },
    style_match: { type: "boolean", description: "대표 이미지·설정의 그림체(얼굴, 비율, 색감, 선, 말풍선, 글씨체)와 일치하는가" },
    identifying_info: { type: "boolean", description: "실명, 학교·병원 이름, 학번, 로고 등 개인 식별 정보가 보이는가" },
    issues: { type: "array", items: { type: "string" }, description: "한국어로 구체적인 문제점" },
  },
} as const;

/** Claude 로 이미지 한 장 판독 (ANTHROPIC_API_KEY 가 있을 때만) */
export async function visionCheck(bytes: Uint8Array, variant: Variant, cut: ToonCut, refs: StyleRefs): Promise<QcPart | undefined> {
  if (!aiConfigured() || bytes.length > 4_800_000) return undefined;
  type Out = { single_panel: boolean; collage_crop_suspected: boolean; text_cut_off: boolean; style_match: boolean; identifying_info: boolean; issues: string[] };
  const content = [
    ...refs.images.map((r) => ({ type: "image" as const, source: { type: "base64" as const, media_type: r.media, data: r.data } })),
    { type: "text" as const, text: `위 ${refs.images.length}장은 그림체 대표 이미지입니다. 아래 이미지는 검수할 ${VARIANTS[variant].label} 컷입니다.` },
    { type: "image" as const, source: { type: "base64" as const, media_type: "image/png" as const, data: Buffer.from(bytes).toString("base64") } },
    {
      type: "text" as const,
      text: `그림체 설정:\n${refs.guide || "(없음)"}\n캐릭터:\n${refs.characters}\n\n이 컷의 대본 — 장면: ${cut.scene}\n대사: ${cut.lines.map((l) => `${l.speaker}: ${l.text}`).join(" / ") || "(없음)"}\n\n규칙: 한 컷 = 독립된 이미지 한 장, 콜라주를 만든 뒤 자르기 금지, 글자가 잘리면 안 됨, 그림체 일관성, 개인 식별 정보 금지. 검사하세요.`,
    },
  ];
  const out = await jsonCall<Out>({
    system: "You are a strict QA reviewer for a Korean webtoon. Judge only what is visible. Answer issues in Korean.",
    content,
    schema: VISION_SCHEMA,
    effort: "low",
    maxTokens: 3000,
  });
  const d = out.data;
  const issues = [...d.issues];
  if (!d.single_panel) issues.unshift("한 장에 여러 컷이 들어 있습니다");
  if (d.collage_crop_suspected) issues.unshift("콜라주를 잘라낸 흔적이 있습니다");
  if (d.text_cut_off) issues.unshift("글자·말풍선이 잘렸습니다");
  if (!d.style_match) issues.unshift("그림체가 설정집과 다릅니다");
  if (d.identifying_info) issues.unshift("개인 식별 정보가 보입니다");
  const ok = d.single_panel && !d.collage_crop_suspected && !d.text_cut_off && d.style_match && !d.identifying_info;
  return { ok, issues: ok ? [] : [...new Set(issues)], at: new Date().toISOString(), by: out.model };
}

/** 이미지 한 장 검수 → assets.qc 갱신 (사람·ChatGPT 판정은 보존) */
export async function qcAsset(
  sb: SupabaseClient,
  asset: Asset,
  variant: Variant,
  opts: { cut?: ToonCut; refs?: StyleRefs; vision?: boolean; bytes?: Uint8Array } = {},
): Promise<ImageQc> {
  const bytes = opts.bytes ?? (await downloadBytes(sb, asset.storage_path));
  const info = imageInfo(bytes);
  const structural = { ...structuralCheck(info, variant), at: new Date().toISOString(), by: "auto" };
  let vision = asset.qc?.vision;
  if (opts.vision && opts.cut && structural.ok) {
    try {
      vision = (await visionCheck(bytes, variant, opts.cut, opts.refs ?? (await loadStyleRefs(sb)))) ?? vision;
    } catch (e) {
      vision = { ok: false, issues: [`판독 오류: ${e instanceof Error ? e.message : e}`], at: new Date().toISOString(), by: "vision" };
    }
  }
  const qc: ImageQc = { ...(asset.qc ?? {}), width: info.width, height: info.height, format: info.format, structural, ...(vision ? { vision } : {}) };
  const { error } = await sb.from("assets").update({ qc, variant, width: info.width || asset.width, height: info.height || asset.height }).eq("id", asset.id);
  if (error) throw new Error(error.message);
  return qc;
}

export interface ToonState {
  content: Content;
  version: ContentVersion;
  data: ToonData;
  assets: Map<string, Asset>;
}

export async function loadToon(sb: SupabaseClient, contentId: string): Promise<ToonState> {
  const { data: content, error } = await sb.from("contents").select("*").eq("id", contentId).maybeSingle();
  if (error || !content) throw new Error("콘텐츠를 찾을 수 없습니다.");
  if (content.project_id !== "med-toon") throw new Error("MED SCHOOL TOON 콘텐츠가 아닙니다.");
  const { data: version } = await sb.from("content_versions").select("*").eq("content_id", contentId).eq("version_no", content.current_version_no).single();
  const data = version!.data as ToonData;
  const ids = data.cuts.flatMap((c) => [c.asset_id, c.reel_asset_id]).filter(Boolean) as string[];
  const { data: rows } = ids.length ? await sb.from("assets").select("*").in("id", ids) : { data: [] };
  return { content: content as Content, version: version as ContentVersion, data, assets: new Map(((rows ?? []) as Asset[]).map((a) => [a.id, a])) };
}

/** 전체 검수: 검수 안 된(또는 recheck) 칸을 검사하고 보고서를 돌려줌 */
export async function runToonQc(
  sb: SupabaseClient,
  contentId: string,
  opts: { recheck?: boolean; vision?: boolean; promote?: boolean } = {},
): Promise<ToonQcReport & { version: number; vision_available: boolean; moved_to_review?: boolean }> {
  const st = await loadToon(sb, contentId);
  const vision = (opts.vision ?? true) && aiConfigured();
  let refs: StyleRefs | undefined;
  for (const cut of st.data.cuts) {
    for (const variant of ["feed", "reels"] as Variant[]) {
      const id = variant === "feed" ? cut.asset_id : cut.reel_asset_id;
      const a = id ? st.assets.get(id) : undefined;
      if (!a) continue;
      const needs = opts.recheck || !a.qc?.structural || (vision && !a.qc?.vision);
      if (!needs) continue;
      if (vision && !refs) refs = await loadStyleRefs(sb);
      a.qc = await qcAsset(sb, a, variant, { cut, refs, vision });
    }
  }
  const proj = await sb.from("projects").select("settings").eq("id", "med-toon").single();
  const terms = ((proj.data?.settings ?? {}) as Project["settings"]).sensitive_terms ?? [];
  const privacy = scanPrivacy(publicText(st.data), terms).map((f) => `익명성: ${f.message} — “${f.match}”`);
  const report = toonReport(st.data, st.assets, privacy);
  // 두 세트가 완성되고 검수를 통과하면 사람 검토 단계로 넘김
  let moved = false;
  if (opts.promote && report.complete && ["ai_planning", "ready", "in_production", "revising"].includes(st.content.status)) {
    const { error } = await sb.from("contents").update({ status: "in_review" }).eq("id", contentId);
    moved = !error;
  }
  return { ...report, version: st.version.version_no, vision_available: aiConfigured(), moved_to_review: moved || undefined };
}
