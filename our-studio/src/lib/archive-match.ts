import type { Asset, Content, Place, PlaceResearch } from "./types";
import { tokenize } from "./similarity.ts";

/**
 * 콘텐츠 주제(예: "강릉 2박 3일")에 맞는 아카이브 자료를 찾습니다 (요구사항 6-4).
 * 직접 경험(방문 장소·후기·직접 찍은 사진)과 AI/수동 조사 자료를 분리해 돌려줍니다.
 */
export interface ArchiveMatch {
  places: Place[];
  ownPhotos: Asset[];
  otherUsablePhotos: Asset[];
  research: PlaceResearch[];
  pastContents: Content[];
}

function placeScore(topic: Set<string>, p: Place): number {
  const fields = [p.region, p.name, p.address, ...p.tags];
  let score = 0;
  for (const f of fields) {
    const t = tokenize(f);
    for (const tok of t) if (topic.has(tok)) score += f === p.region ? 3 : 1;
  }
  return score;
}

export function matchArchive(
  topic: string,
  data: { places: Place[]; assets: Asset[]; research: PlaceResearch[]; contents: Content[] },
): ArchiveMatch {
  const t = tokenize(topic);
  const places = data.places
    .map((p) => ({ p, s: placeScore(t, p) + (p.status === "visited" ? 0.5 : 0) }))
    .filter((x) => x.s >= 1)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
  const ids = new Set(places.map((p) => p.id));
  const photos = data.assets.filter((a) => a.place_id && ids.has(a.place_id) && a.mime_type.startsWith("image/"));
  return {
    places,
    ownPhotos: photos.filter((a) => a.origin === "own_photo"),
    otherUsablePhotos: photos.filter((a) => a.origin !== "own_photo" && a.usage_allowed && a.origin !== "ai_generated"),
    research: data.research.filter((r) => ids.has(r.place_id)),
    pastContents: data.contents.filter((c) => {
      const ct = tokenize(`${c.title} ${c.keywords.join(" ")}`);
      for (const tok of ct) if (t.has(tok)) return true;
      return false;
    }),
  };
}
