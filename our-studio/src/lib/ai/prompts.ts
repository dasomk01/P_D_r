import "server-only";

import type { Character, Place, PlaceResearch } from "../types";

export const TRAVEL_SYSTEM = `You are the editor of @korea_trip_always, a premium travel-magazine style Instagram account that introduces Korea to foreign tourists in English.

Carousel rules (fixed):
- Exactly 7 slides, 4:5 (1080x1350). Slide roles in order: Cover, Overview / Route, Spot 1, Spot 2, Spot 3, Tips & Transport, Save & Follow (you may rename spot slides to the actual place).
- All public copy (headline, body, caption, hashtags) in natural, concise English for foreigners. Headlines <= 8 words, body <= 45 words.
- Exactly 5 hashtags, each starting with #, no spaces.
- Day trip = only the essential must-see course. 1N2D = the day-trip core plus extra places. 2N3D = a more relaxed, expanded experience. Routes must be physically feasible with realistic transport and timing.
- Give foreigners practical info: transport (lines, stations, bus numbers), booking, opening hours, prices. Put every such fact also into "facts" with the official source URL if you know it; never invent precise hours/prices — if unsure, write "check official site" and leave source_url empty.

Source honesty (very important):
- Material labelled [OUR EXPERIENCE] is what the two creators actually did. You may highlight it ("We loved…").
- Material labelled [RESEARCHED] was collected by AI/web and is NOT first-hand. Never present it as personal experience.
- Never reveal private data: visit dates, who visited, personal names.
- Do not reference or describe any photo as if it were taken on site unless it is listed as our own photo.

Internal fields (summary, notes, concept) are for the two Korean creators — write those in Korean.`;

export const TOON_SYSTEM = `당신은 익명 인스타툰 "MED SCHOOL TOON"의 스토리 작가이자 작화 담당입니다. 의대생의 일상·공부·시험·실습·연애를 다룹니다.

고정 캐릭터와 그림체 설정집을 반드시 따르세요. 흰 토끼(여자 의대생)와 갈색 곰(남자 의대생)의 얼굴, 비율, 색감, 선, 말풍선, 글씨체가 매 컷 같아야 합니다.

제작 규격 (절대 규칙):
- 컷 수는 이야기에 맞게 자유롭게 정한다 (고정 개수 없음).
- 한 컷 = 독립된 이미지 한 장. 여러 컷을 한 장에 그리거나, 콜라주를 만든 뒤 잘라내는 방식은 금지.
- 같은 대본으로 두 세트를 만든다: 피드용 4:5 1080×1350 PNG, 릴스용 9:16 1080×1920 PNG. 두 세트는 컷 수·대사·스토리가 같고, 화면 비율에 맞게 구도만 조정한다.
- 릴스용도 동영상이 아니라 정지 PNG 이미지다.
- 글자·말풍선은 가장자리 안전 여백 안에 둬서 잘리지 않게 한다.
- 최종 결과: 피드 세트 + 릴스 세트 이미지, 캡션 1개, 해시태그 정확히 5개.

개인정보 보호 규칙 (절대 규칙):
- 실명, 학교명, 학번, 병원명, 구체적인 날짜·학기·지역 등 개인을 특정할 수 있는 정보를 쓰지 않는다 (그림 속 글자·간판·명찰 포함).
- 실제 경험을 바탕으로 하되 적절히 각색한다.
- 실제 시간 순서나 연애 시작 시점을 불필요하게 드러내지 않는다.
- 해부학을 함께 공부한 이야기를 그리더라도, 당시 연애 중이었다고 임의로 설정하지 않는다.

대본: 각 컷에 장면 설명(배경·행동·표정)과 대사(화자, 대사). 대사는 짧고 자연스러운 한국어. summary 에는 기획 의도와 주의할 점을 2~4줄로.`;

export const TRAVEL_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "format", "concept", "route", "pages", "caption", "hashtags", "facts"],
  properties: {
    summary: { type: "string", description: "Korean: plan intent and what to verify" },
    format: { type: "string", enum: ["당일치기", "1박 2일", "2박 3일", "교통·여행 팁", "장소 단독 소개"] },
    concept: { type: "string" },
    route: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "place_id", "transport", "duration", "note"],
        properties: {
          name: { type: "string" },
          place_id: { type: ["string", "null"], description: "id from the archive list when the stop is an archive place, else null" },
          transport: { type: "string" },
          duration: { type: "string" },
          note: { type: "string" },
        },
      },
    },
    pages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "headline", "body", "notes"],
        properties: { role: { type: "string" }, headline: { type: "string" }, body: { type: "string" }, notes: { type: "string" } },
      },
    },
    caption: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
    facts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["item", "value", "source_url"],
        properties: { item: { type: "string" }, value: { type: "string" }, source_url: { type: "string" } },
      },
    },
  },
} as const;

export const TOON_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "synopsis", "cuts", "caption", "hashtags"],
  properties: {
    summary: { type: "string" },
    synopsis: { type: "string" },
    cuts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["scene", "lines", "notes"],
        properties: {
          scene: { type: "string" },
          notes: { type: "string" },
          lines: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["speaker", "text"],
              properties: { speaker: { type: "string" }, text: { type: "string" } },
            },
          },
        },
      },
    },
    caption: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
  },
} as const;

export const SUGGEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ideas"],
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "memo", "tags", "why"],
        properties: {
          title: { type: "string" },
          memo: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          why: { type: "string" },
        },
      },
    },
  },
} as const;

/** AI 에 넘기는 장소 정보 — 방문 날짜·방문자 등 내부 정보는 제외 */
export function placeForAi(p: Place, research: PlaceResearch[], photoCount: number): string {
  const own = [
    p.review && `review: ${p.review}`,
    p.recommended && `recommended: ${p.recommended}`,
    p.price_paid && `price we paid: ${p.price_paid}`,
    p.pros && `liked: ${p.pros}`,
    p.cons && `disliked: ${p.cons}`,
    p.why_foreigners && `why for foreigners: ${p.why_foreigners}`,
    p.revisit && `would revisit: ${p.revisit}`,
  ]
    .filter(Boolean)
    .join("; ");
  const res = research
    .filter((r) => r.place_id === p.id)
    .slice(0, 8)
    .map((r) => `  - [RESEARCHED${r.verified ? ", verified" : ", unverified"}] ${r.kind}: ${r.title}${r.body ? ` — ${r.body.slice(0, 200)}` : ""}${r.url ? ` (${r.url})` : ""}`)
    .join("\n");
  return `- id=${p.id} | ${p.name} (${p.region}, ${p.category}) ${p.address}${p.lat != null ? ` @${p.lat.toFixed(4)},${p.lng!.toFixed(4)}` : ""}
  ${p.status === "visited" ? `[OUR EXPERIENCE] ${own || "visited, no notes"} | own usable photos: ${photoCount}` : "[NOT VISITED — wishlist]"}
${res}`;
}

export function charactersForAi(chars: Character[], style: string): string {
  return (
    chars
      .map(
        (c) =>
          `- ${c.name} (${c.species}, ${c.role}) 외형: ${c.appearance} / 성격: ${c.personality} / 말투: ${c.speech_style} / 규칙: ${c.rules}`,
      )
      .join("\n") + (style ? `\n그림체: ${style}` : "")
  );
}
