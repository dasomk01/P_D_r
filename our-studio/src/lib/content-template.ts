import type { ContentData, ToonData, TravelData } from "./types";

const TRAVEL_PAGE_ROLES = [
  "Cover",
  "Overview / Route",
  "Spot 1",
  "Spot 2",
  "Spot 3",
  "Tips & Transport",
  "Save & Follow",
];

export function emptyTravel(format = "당일치기"): TravelData {
  return {
    kind: "travel",
    format,
    concept: "",
    route: [],
    pages: TRAVEL_PAGE_ROLES.map((role, i) => ({
      no: i + 1,
      role,
      headline: "",
      body: "",
      asset_id: null,
      photo_credit: "",
      notes: "",
    })),
    caption: "",
    hashtags: ["", "", "", "", ""],
    facts: [
      { item: "운영시간 (Opening hours)", value: "", source_url: "", verified: false },
      { item: "가격 (Price)", value: "", source_url: "", verified: false },
      { item: "교통 (Transport)", value: "", source_url: "", verified: false },
    ],
    place_ids: [],
  };
}

export function emptyToon(cuts = 6): ToonData {
  return {
    kind: "toon",
    synopsis: "",
    cuts: Array.from({ length: cuts }, (_, i) => ({ no: i + 1, scene: "", lines: [], asset_id: null, notes: "" })),
    caption: "",
    hashtags: [],
    anonymity_checked: false,
    anonymity_notes: "",
  };
}

export function emptyData(kind: "travel" | "toon"): ContentData {
  return kind === "travel" ? emptyTravel() : emptyToon();
}

/** 인스타 캐러셀 제작 규칙 검증: 7장, 해시태그 정확히 5개, 사진 권리 */
export function validateTravel(d: TravelData, usableAssetIds?: Set<string>): string[] {
  const issues: string[] = [];
  if (d.pages.length !== 7) issues.push(`페이지가 ${d.pages.length}장입니다 — 캐러셀은 7장이어야 합니다.`);
  const tags = d.hashtags.map((h) => h.trim()).filter(Boolean);
  if (tags.length !== 5) issues.push(`해시태그가 ${tags.length}개입니다 — 정확히 5개여야 합니다.`);
  if (tags.some((t) => !/^#[\p{L}\p{N}_]+$/u.test(t))) issues.push("해시태그는 공백 없이 #으로 시작해야 합니다.");
  if (new Set(tags.map((t) => t.toLowerCase())).size !== tags.length) issues.push("중복된 해시태그가 있습니다.");
  const missingText = d.pages.filter((p) => !p.headline.trim()).map((p) => p.no);
  if (missingText.length) issues.push(`제목이 비어 있는 페이지: ${missingText.join(", ")}`);
  if (/[가-힣]/.test(d.pages.map((p) => p.headline + p.body).join(" ") + d.caption))
    issues.push("공개 문구에 한글이 포함되어 있습니다 — KOREA TRIP 은 영어 콘텐츠입니다.");
  if (usableAssetIds) {
    const bad = d.pages.filter((p) => p.asset_id && !usableAssetIds.has(p.asset_id)).map((p) => p.no);
    if (bad.length) issues.push(`사용 허가가 확인되지 않은 사진을 쓴 페이지: ${bad.join(", ")}`);
  }
  const unverified = d.facts.filter((f) => f.value.trim() && !f.verified).length;
  if (unverified) issues.push(`출처 확인이 안 된 정보 ${unverified}건 (운영시간·가격 등)`);
  return issues;
}

/** 공개되는 텍스트만 모읍니다 (내부 메모 제외) — 익명성 검수 대상 */
export function publicText(d: ContentData): string {
  if (d.kind === "travel") {
    return [...d.pages.flatMap((p) => [p.headline, p.body]), d.caption, d.hashtags.join(" ")].join("\n");
  }
  return [d.synopsis, ...d.cuts.flatMap((c) => [c.scene, ...c.lines.map((l) => `${l.speaker}: ${l.text}`)]), d.caption, d.hashtags.join(" ")].join("\n");
}

export function captionFile(title: string, d: ContentData): string {
  if (d.kind === "travel") {
    const pages = d.pages.map((p) => `[${p.no}] ${p.headline}\n${p.body}`).join("\n\n");
    return `${title}\n\n${pages}\n\n— Caption —\n${d.caption}\n\n${d.hashtags.filter(Boolean).join(" ")}\n`;
  }
  const cuts = d.cuts
    .map((c) => `[컷 ${c.no}] ${c.scene}\n${c.lines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}`)
    .join("\n\n");
  return `${title}\n\n${d.synopsis}\n\n${cuts}\n\n— Caption —\n${d.caption}\n\n${d.hashtags.filter(Boolean).join(" ")}\n`;
}

/** 버전 비교용: 페이지/컷 단위 텍스트 */
export function unitTexts(d: ContentData): { label: string; text: string; asset_id: string | null }[] {
  if (d.kind === "travel") {
    return [
      ...d.pages.map((p) => ({ label: `${p.no}. ${p.role}`, text: `${p.headline}\n${p.body}`, asset_id: p.asset_id })),
      { label: "Caption", text: `${d.caption}\n${d.hashtags.join(" ")}`, asset_id: null },
    ];
  }
  return [
    { label: "줄거리", text: d.synopsis, asset_id: null },
    ...d.cuts.map((c) => ({
      label: `컷 ${c.no}`,
      text: `${c.scene}\n${c.lines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}`,
      asset_id: c.asset_id,
    })),
    { label: "Caption", text: `${d.caption}\n${d.hashtags.join(" ")}`, asset_id: null },
  ];
}
