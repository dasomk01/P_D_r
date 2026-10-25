import { test } from "node:test";
import assert from "node:assert/strict";
import { findSimilar, similarity } from "../src/lib/similarity.ts";
import { scanPrivacy } from "../src/lib/privacy.ts";
import { recommendNext, recentDuplicates } from "../src/lib/recommend.ts";
import { matchArchive } from "../src/lib/archive-match.ts";
import { addDays, kstToday, monthGrid } from "../src/lib/dates.ts";
import { haversineKm } from "../src/lib/geo.ts";
import { validateTravel } from "../src/lib/content-template.ts";

const baseIdea = {
  project_id: "korea-trip", memo: "", tags: [], links: [], priority: 2, status: "idea", is_next: false,
  place_ids: [], source: "manual", sort_order: 0, created_by: null, updated_by: null,
  created_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z",
} as const;

test("similar ideas are detected across spacing/particles", () => {
  assert.ok(similarity("부산 해운대 당일치기", "해운대 당일치기 코스") > 0.3);
  assert.ok(similarity("부산 해운대 당일치기", "해부학 시험 전날 생긴 일") < 0.1);
  const hits = findSimilar("강릉 2박 3일", [{ t: "강릉 2박3일 여행" }, { t: "서울 야경" }], (x) => x.t);
  assert.equal(hits.length, 1);
});

test("privacy scan flags names, schools, student ids, dates", () => {
  const f = scanPrivacy("김철수랑 한국의과대학 도서관에서 20241234 학번, 2024.03.02에 사귄 지 100일", ["김철수"]);
  const kinds = new Set(f.map((x) => x.kind));
  for (const k of ["sensitive_term", "school", "student_id", "exact_date", "relationship_timeline"]) {
    assert.ok(kinds.has(k as never), `missing ${k}`);
  }
  assert.equal(scanPrivacy("의대생 토끼와 곰이 해부학 시험을 준비한다").length, 0);
});

test("recommendation priority: next → shared → archive place → past", () => {
  const ideas = [
    { ...baseIdea, id: "a", title: "외국인을 위한 교통 앱", source: "imported" },
    { ...baseIdea, id: "b", title: "부산 해운대 당일치기" },
    { ...baseIdea, id: "c", title: "전주 한옥마을", is_next: true },
    { ...baseIdea, id: "d", title: "done", status: "approved" },
  ] as never[];
  const places = [
    { id: "p1", name: "초당순두부", region: "강릉", status: "visited", address: "", tags: [] },
    { id: "p2", name: "해운대", region: "부산", status: "visited", address: "", tags: [] },
  ] as never[];
  const rec = recommendNext({ projectKind: "travel", ideas, votes: { b: 2 }, places, contents: [] });
  assert.deepEqual(rec.map((r) => r.source), ["next", "shared_idea", "archive_place", "past_idea"]);
  assert.equal(rec[2].place?.id, "p1");
  const toon = recommendNext({ projectKind: "toon", ideas, votes: {}, places });
  assert.ok(!toon.some((r) => r.source === "archive_place"));
});

test("30-day duplicate warning", () => {
  const contents = [
    { id: "x", title: "강릉 2박 3일 여행", keywords: ["강릉"], scheduled_date: "2026-10-10", created_at: "2026-10-01T00:00:00Z" },
    { id: "y", title: "강릉 2박 3일 여행", keywords: [], scheduled_date: "2026-07-01", created_at: "2026-06-01T00:00:00Z" },
  ] as never[];
  const d = recentDuplicates("강릉 2박3일", contents, "2026-10-25");
  assert.deepEqual(d.map((h) => (h.item as { id: string }).id), ["x"]);
});

test("archive match separates own photos and research", () => {
  const places = [
    { id: "p1", name: "초당순두부", region: "강릉", status: "visited", address: "강원 강릉시", tags: [] },
    { id: "p2", name: "광안리", region: "부산", status: "visited", address: "", tags: [] },
  ] as never[];
  const assets = [
    { id: "a1", place_id: "p1", origin: "own_photo", usage_allowed: true, mime_type: "image/jpeg" },
    { id: "a2", place_id: "p1", origin: "reference_only", usage_allowed: false, mime_type: "image/jpeg" },
    { id: "a3", place_id: "p1", origin: "licensed", usage_allowed: true, mime_type: "image/jpeg" },
  ] as never[];
  const research = [{ id: "r1", place_id: "p1" }, { id: "r2", place_id: "p2" }] as never[];
  const m = matchArchive("강릉 2박 3일 콘텐츠 제작", { places, assets, research, contents: [] });
  assert.deepEqual(m.places.map((p) => p.id), ["p1"]);
  assert.deepEqual(m.ownPhotos.map((a) => a.id), ["a1"]);
  assert.deepEqual(m.otherUsablePhotos.map((a) => a.id), ["a3"]);
  assert.deepEqual(m.research.map((r) => r.id), ["r1"]);
});

test("dates in KST", () => {
  assert.equal(kstToday(new Date("2026-10-25T16:00:00Z")), "2026-10-26");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  const g = monthGrid(2026, 9);
  assert.equal(g.length, 42);
  assert.equal(g[0], "2026-09-28");
});

test("geo distance", () => {
  const km = haversineKm({ lat: 37.5665, lng: 126.978 }, { lat: 35.1796, lng: 129.0756 });
  assert.ok(km > 320 && km < 330);
});

test("travel validation enforces 7 pages and exactly 5 hashtags", () => {
  const issues = validateTravel({
    kind: "travel", format: "당일치기", concept: "", route: [], facts: [], place_ids: [],
    pages: [{ no: 1, role: "Cover", headline: "", body: "", asset_id: null, photo_credit: "", notes: "" }],
    caption: "", hashtags: ["#a", "#b"],
  });
  assert.ok(issues.some((i) => i.includes("7장")));
  assert.ok(issues.some((i) => i.includes("5개")));
});
