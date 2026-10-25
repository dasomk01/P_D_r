import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { aiErrorMessage, normalizeUrl, researchCall } from "@/lib/ai/claude";
import type { Place, ResearchKind } from "@/lib/types";

export const maxDuration = 300;

interface Item {
  title: string;
  body: string;
  url: string;
  source_name: string;
}
interface Out {
  location: { address: string; lat: number | null; lng: number | null; url: string; source_name: string };
  nearby_attractions: Item[];
  nearby_food: Item[];
  routes: { title: string; body: string }[];
  official_info: Item[];
  photo_candidates: (Item & { license_note: string })[];
  content_topics: { title: string; body: string }[];
}

const SYSTEM = `You research Korean travel spots for two creators who run an English Instagram account for foreign tourists.
Use web search. Prefer official sources (venue sites, city/provincial tourism sites, Korea Tourism Organization VisitKorea, transit operators).
Rules:
- Every factual item must cite a URL you actually found in search results. Do not invent URLs, opening hours or prices.
- Photo candidates: only list pages where a usable photo exists (e.g. official press/media galleries, Korea Tourism Organization photo gallery, Wikimedia Commons) and describe the license / usage conditions as stated on that page. NEVER claim a photo is free to use unless the page says so. The creators will not download anything; these are reference links.
- Write titles and bodies in Korean (they are internal notes). Keep bodies to 1–3 sentences.
- Nearby means within roughly 30 minutes by public transport or a short walk.
Finish with a single \`\`\`json code block matching:
{"location":{"address":"","lat":null,"lng":null,"url":"","source_name":""},
 "nearby_attractions":[{"title":"","body":"","url":"","source_name":""}],
 "nearby_food":[{"title":"","body":"","url":"","source_name":""}],
 "routes":[{"title":"","body":""}],
 "official_info":[{"title":"","body":"","url":"","source_name":""}],
 "photo_candidates":[{"title":"","body":"","url":"","source_name":"","license_note":""}],
 "content_topics":[{"title":"","body":""}]}`;

/** 방문 장소 주변 정보 조사 → place_research 에 'AI 조사' 로 저장 (바로 콘텐츠로 만들지 않음) */
export async function POST(req: NextRequest) {
  const auth = await apiMember({ needAi: true });
  if ("error" in auth) return auth.error;
  const { sb } = auth;
  const { placeId } = (await req.json()) as { placeId: string };
  const place = (await sb.from("places").select("*").eq("id", placeId).maybeSingle()).data as Place | null;
  if (!place) return NextResponse.json({ error: "장소를 찾을 수 없습니다." }, { status: 404 });

  const prompt = `Place: ${place.name}
Region: ${place.region}
Address: ${place.address || "(unknown)"}
Category: ${place.category}
${place.lat != null ? `Coordinates: ${place.lat}, ${place.lng}` : ""}
Our note (first-hand, for context only): ${[place.review, place.recommended].filter(Boolean).join(" / ").slice(0, 400) || "(none)"}

Research: 1) exact location 2) nearby attractions 3) nearby cafés & other restaurants 4) feasible recommended routes 5) official website & operating info 6) photo candidates with license notes 7) future content topics for foreign tourists.`;

  try {
    const { data, model, seenUrls } = await researchCall<Out>({ system: SYSTEM, prompt, maxSearches: 10 });
    const verifiedUrl = (u: string | undefined | null) => (u && seenUrls.has(normalizeUrl(u)) ? u : null);
    const rows: Record<string, unknown>[] = [];
    const push = (kind: ResearchKind, it: Partial<Item> & { title: string; license_note?: string }, extra: Record<string, unknown> = {}) => {
      const url = verifiedUrl(it.url);
      rows.push({
        place_id: place.id,
        kind,
        title: it.title.slice(0, 200),
        body: (it.body ?? "") + (it.url && !url ? `\n(AI 가 제시한 링크가 검색 결과에서 확인되지 않아 제외: ${it.url})` : ""),
        url,
        source_name: it.source_name ?? "",
        license_note: it.license_note ?? "",
        provenance: "ai",
        verified: false,
        ai_model: model,
        ...extra,
      });
    };
    const loc = data.location;
    if (loc?.address || loc?.lat != null)
      push("location", {
        title: loc.address || place.name,
        body: loc.lat != null ? `좌표 ${loc.lat}, ${loc.lng}` : "",
        url: loc.url,
        source_name: loc.source_name,
      });
    for (const it of data.nearby_attractions ?? []) push("nearby_attraction", it);
    for (const it of data.nearby_food ?? []) push("nearby_food", it);
    for (const it of data.routes ?? []) push("route", it);
    for (const it of data.official_info ?? []) push("official_info", it);
    for (const it of data.photo_candidates ?? []) push("photo_candidate", it, { usage_status: "reference_only" });
    for (const it of data.content_topics ?? []) push("content_topic", it);

    if (rows.length) {
      const { error } = await sb.from("place_research").insert(rows, { defaultToNull: false });
      if (error) throw new Error(error.message);
    }
    if (place.lat == null && loc?.lat != null && loc.lng != null && Math.abs(loc.lat - 36) < 4 && Math.abs(loc.lng - 128) < 4) {
      await sb.from("places").update({ lat: loc.lat, lng: loc.lng, address: place.address || loc.address }).eq("id", place.id);
    }
    await sb.from("ai_runs").insert({ project_id: "korea-trip", kind: "place_research", target_id: place.id, output: data, model });
    return NextResponse.json({ saved: rows.length });
  } catch (e) {
    const message = aiErrorMessage(e);
    await sb.from("ai_runs").insert({ project_id: "korea-trip", kind: "place_research", target_id: place.id, status: "error", error: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
