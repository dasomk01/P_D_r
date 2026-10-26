import type { Asset, ImageQc, QcPart, StyleGuide, ToonData } from "./types";

/**
 * MED SCHOOL TOON 제작 규격과 검수 규칙 (서버·브라우저·테스트 공용, 순수 함수).
 * - 컷 수는 자유. 한 컷 = 독립된 이미지 한 장 (콜라주를 만들어 자르는 것 금지)
 * - 같은 대본으로 피드 4:5 1080×1350 PNG 세트 + 릴스 9:16 1080×1920 PNG 세트 (릴스도 동영상 아님)
 * - 캡션 1개, 해시태그 정확히 5개
 */

export const VARIANTS = {
  feed: { label: "피드 4:5", width: 1080, height: 1350 },
  reels: { label: "릴스 9:16", width: 1080, height: 1920 },
} as const;
export type Variant = keyof typeof VARIANTS;

export const MAX_CUTS = 30;

export const STYLE_FIELDS: { key: keyof StyleGuide; label: string; hint: string }[] = [
  { key: "face", label: "얼굴", hint: "눈·코·입 모양, 볼터치, 표정 그리는 법 (토끼 / 곰 각각)" },
  { key: "proportions", label: "비율", hint: "머리:몸 비율, 키 차이, 귀 길이 등" },
  { key: "palette", label: "색감", hint: "HEX 로 적기 — 토끼 흰색 #FFFFFF, 곰 갈색 #8B5E3C, 배경 …" },
  { key: "line", label: "선", hint: "선 굵기·색, 손그림/벡터 느낌, 채색 방식(플랫/그라데이션)" },
  { key: "bubble", label: "말풍선", hint: "모양, 테두리 굵기, 꼬리 방향, 배치 규칙" },
  { key: "font", label: "글씨체", hint: "폰트 이름(예: 나눔손글씨), 크기, 색, 줄 수 제한" },
  { key: "background", label: "배경·여백", hint: "배경 단순도, 안전 여백(글자가 잘리지 않게 가장자리 60px 등)" },
  { key: "account", label: "기존 계정 그림체", hint: "기존 인스타 계정 링크·특징 — 대표 이미지는 아래에 고정" },
  { key: "dont", label: "하지 말 것", hint: "콜라주 후 자르기, 실사풍, 다른 동물로 바뀜, 동영상 등" },
];

export function styleGuideText(g: Partial<StyleGuide> | undefined, legacy = ""): string {
  const lines = STYLE_FIELDS.map((f) => (g?.[f.key] ? `- ${f.label}: ${g[f.key]}` : null)).filter(Boolean);
  if (legacy) lines.push(`- 기타: ${legacy}`);
  return lines.join("\n");
}

/** 대본(텍스트) 수준 검사 — 이미지와 별개 */
export function validateToonScript(d: ToonData): string[] {
  const issues: string[] = [];
  if (d.cuts.length === 0) issues.push("컷이 없습니다 — 이야기에 맞게 컷을 1개 이상 만드세요.");
  if (d.cuts.length > MAX_CUTS) issues.push(`컷이 ${d.cuts.length}개입니다 — 최대 ${MAX_CUTS}컷.`);
  const empty = d.cuts.filter((c) => !c.scene.trim() && c.lines.every((l) => !l.text.trim())).map((c) => c.no);
  if (empty.length) issues.push(`장면·대사가 비어 있는 컷: ${empty.join(", ")}`);
  if (!d.caption.trim()) issues.push("캡션이 비어 있습니다 (캡션 1개 필요).");
  const tags = d.hashtags.map((h) => h.trim()).filter(Boolean);
  if (tags.length !== 5) issues.push(`해시태그가 ${tags.length}개입니다 — 정확히 5개여야 합니다.`);
  if (tags.some((t) => !/^#[\p{L}\p{N}_]+$/u.test(t))) issues.push("해시태그는 공백 없이 #으로 시작해야 합니다.");
  if (new Set(tags.map((t) => t.toLowerCase())).size !== tags.length) issues.push("중복된 해시태그가 있습니다.");
  return issues;
}

// ── 이미지 헤더 판독 ─────────────────────────────────────
export interface ImageInfo {
  format: "png" | "jpeg" | "webp" | "gif" | "unknown";
  width: number;
  height: number;
  frames?: number;
}

export function imageInfo(b: Uint8Array): ImageInfo {
  const u32 = (o: number) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    // APNG(움직이는 PNG) 은 acTL 청크가 있음
    let frames = 1;
    for (let o = 8; o + 8 < b.length && o < 4096; ) {
      const len = u32(o);
      const type = String.fromCharCode(b[o + 4], b[o + 5], b[o + 6], b[o + 7]);
      if (type === "acTL") frames = u32(o + 8);
      if (type === "IDAT") break;
      o += 12 + len;
    }
    return { format: "png", width: u32(16), height: u32(20), frames };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o + 9 < b.length) {
      if (b[o] !== 0xff) {
        o++;
        continue;
      }
      const m = b[o + 1];
      const len = (b[o + 2] << 8) | b[o + 3];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { format: "jpeg", height: (b[o + 5] << 8) | b[o + 6], width: (b[o + 7] << 8) | b[o + 8] };
      }
      o += 2 + len;
    }
    return { format: "jpeg", width: 0, height: 0 };
  }
  if (b.length > 30 && String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") {
    const chunk = String.fromCharCode(...b.slice(12, 16));
    if (chunk === "VP8X") return { format: "webp", width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (chunk === "VP8 ") return { format: "webp", width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
    return { format: "webp", width: 0, height: 0 };
  }
  if (b.length > 10 && String.fromCharCode(...b.slice(0, 3)) === "GIF") return { format: "gif", width: b[6] | (b[7] << 8), height: b[8] | (b[9] << 8) };
  return { format: "unknown", width: 0, height: 0 };
}

/** 크기·비율·형식 자동 검사 */
export function structuralCheck(info: ImageInfo, variant: Variant): QcPart {
  const spec = VARIANTS[variant];
  const issues: string[] = [];
  if (info.format !== "png") issues.push(`PNG 가 아닙니다 (${info.format}). ${spec.label} 컷은 PNG 이미지여야 합니다.`);
  if (info.frames && info.frames > 1) issues.push("움직이는 이미지입니다 — 릴스용도 정지 이미지(PNG)여야 합니다.");
  if (info.width !== spec.width || info.height !== spec.height) {
    const ratio = info.height ? (info.width / info.height).toFixed(3) : "?";
    issues.push(`크기가 ${info.width}×${info.height} (비율 ${ratio}) 입니다 — ${spec.label} 는 정확히 ${spec.width}×${spec.height} 여야 합니다.`);
  }
  return { ok: issues.length === 0, issues };
}

export type SlotStatus = "missing" | "pass" | "fail" | "review";

/** 한 칸의 최종 상태: 하나라도 실패면 fail, 자동 검사 통과 + (판독/모델/사람 중 하나 통과)면 pass */
export function slotStatus(asset: Pick<Asset, "qc"> | null | undefined): SlotStatus {
  if (!asset) return "missing";
  const q: ImageQc = asset.qc ?? {};
  const parts = [q.structural, q.vision, q.model_review, q.human].filter(Boolean) as QcPart[];
  if (parts.some((p) => !p.ok)) {
    // 사람이 나중에 통과시켰으면 그 판단을 우선 (판독 오탐 대비)
    if (q.human?.ok && q.structural?.ok !== false) return "pass";
    return "fail";
  }
  if (q.structural?.ok && (q.vision?.ok || q.model_review?.ok || q.human?.ok)) return "pass";
  return "review";
}

export const SLOT_LABEL: Record<SlotStatus, string> = {
  missing: "없음",
  pass: "통과",
  fail: "다시 제작",
  review: "확인 필요",
};

export interface SlotReport {
  cut_no: number;
  variant: Variant;
  asset_id: string | null;
  status: SlotStatus;
  issues: string[];
}

export interface ToonQcReport {
  cuts: number;
  slots: SlotReport[];
  script_issues: string[];
  /** 다시 만들어야 하는 칸 (없음 + 실패) */
  redo: { cut_no: number; variant: Variant; reason: string }[];
  needs_review: { cut_no: number; variant: Variant }[];
  complete: boolean;
}

export function toonReport(d: ToonData, assets: Map<string, Pick<Asset, "id" | "qc">>, privacyIssues: string[] = []): ToonQcReport {
  const slots: SlotReport[] = [];
  for (const c of d.cuts) {
    for (const v of ["feed", "reels"] as Variant[]) {
      const id = (v === "feed" ? c.asset_id : c.reel_asset_id) ?? null;
      const a = id ? assets.get(id) : undefined;
      const status = slotStatus(id ? (a ?? { qc: { structural: { ok: false, issues: ["이미지 파일을 찾을 수 없습니다"] } } }) : null);
      const q = a?.qc ?? {};
      const issues = [q.structural, q.vision, q.model_review, q.human].flatMap((p) => (p && !p.ok ? p.issues : []));
      slots.push({ cut_no: c.no, variant: v, asset_id: id, status, issues });
    }
  }
  const script_issues = [...validateToonScript(d), ...privacyIssues];
  const redo = slots
    .filter((s) => s.status === "missing" || s.status === "fail")
    .map((s) => ({ cut_no: s.cut_no, variant: s.variant, reason: s.status === "missing" ? "이미지 없음" : s.issues.join(" / ") || "검수 실패" }));
  const needs_review = slots.filter((s) => s.status === "review").map((s) => ({ cut_no: s.cut_no, variant: s.variant }));
  return {
    cuts: d.cuts.length,
    slots,
    script_issues,
    redo,
    needs_review,
    complete: d.cuts.length > 0 && redo.length === 0 && script_issues.length === 0,
  };
}
