import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendNext } from "../src/lib/recommend.ts";
import { imageInfo, slotStatus, structuralCheck, toonReport, validateToonScript } from "../src/lib/toon-spec.ts";

const idea = (o: Record<string, unknown>) =>
  ({
    project_id: "med-toon", memo: "", tags: [], links: [], priority: 2, status: "idea", is_next: false,
    place_ids: [], source: "manual", sort_order: 0, created_by: null, updated_by: null,
    created_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z", ...o,
  }) as never;
const content = (o: Record<string, unknown>) =>
  ({ project_id: "med-toon", keywords: [], scheduled_date: null, created_at: "2026-10-20T00:00:00Z", updated_at: "2026-10-20T00:00:00Z", ...o }) as never;

test("get_next_up 빈 배열 버그: 다음 제작 아이디어는 상태가 바뀌어도 사라지지 않는다", () => {
  // 사이트에서 '제작 시작'만 눌러 상태가 in_production 이 됐지만 콘텐츠는 아직 없음
  const ideas = [idea({ id: "a", title: "해부학 시험 전날", is_next: true, status: "in_production" })];
  const r = recommendNext({ projectKind: "toon", ideas, votes: {}, contents: [] });
  assert.equal(r.length, 1);
  assert.equal(r[0].source, "next");
});

test("제작 중인 콘텐츠는 새로 만들지 않고 '이어서 작업'으로 먼저 나온다", () => {
  const ideas = [
    idea({ id: "a", title: "해부학 시험 전날", is_next: true, status: "in_production" }),
    idea({ id: "b", title: "실습 첫날" }),
    idea({ id: "c", title: "검토 중인 것", status: "in_review" }),
  ];
  const contents = [
    content({ id: "x", idea_id: "a", title: "해부학 시험 전날", status: "in_production" }),
    content({ id: "y", idea_id: "c", title: "검토 중인 것", status: "in_review" }),
  ];
  const r = recommendNext({ projectKind: "toon", ideas, votes: {}, contents });
  assert.deepEqual(r.map((x) => x.source), ["continue", "shared_idea"]);
  assert.equal(r[0].content?.id, "x");
  assert.ok(!r.some((x) => x.idea?.id === "c"), "검토 대기(사람 차례)는 다시 만들지 않음");
  assert.ok(!r.some((x) => x.source === "next" && x.idea?.id === "a"), "제작 중 아이디어를 새로 시작하지 않음");
});

function png(w: number, h: number, apng = false): Uint8Array {
  const b = new Uint8Array(64);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  const dv = new DataView(b.buffer);
  dv.setUint32(8, 13);
  b.set([...("IHDR" as string)].map((c) => c.charCodeAt(0)), 12);
  dv.setUint32(16, w);
  dv.setUint32(20, h);
  if (apng) {
    dv.setUint32(33, 8);
    b.set([..."acTL"].map((c) => c.charCodeAt(0)), 37);
    dv.setUint32(41, 3);
  }
  return b;
}

test("이미지 규격 검사: 피드 1080×1350 / 릴스 1080×1920 PNG, 움직이는 이미지 거부", () => {
  assert.deepEqual(imageInfo(png(1080, 1350)), { format: "png", width: 1080, height: 1350, frames: 1 });
  assert.equal(structuralCheck(imageInfo(png(1080, 1350)), "feed").ok, true);
  assert.equal(structuralCheck(imageInfo(png(1080, 1920)), "reels").ok, true);
  assert.equal(structuralCheck(imageInfo(png(1080, 1350)), "reels").ok, false);
  assert.equal(structuralCheck(imageInfo(png(1024, 1024)), "feed").ok, false);
  assert.equal(structuralCheck(imageInfo(png(1080, 1920, true)), "reels").ok, false);
  const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xc0, 0, 17, 8, 0x05, 0x46, 0x04, 0x38, 0, 0, 0]);
  const info = imageInfo(jpg);
  assert.equal(info.format, "jpeg");
  assert.equal(structuralCheck(info, "feed").ok, false, "JPEG 는 PNG 가 아니므로 실패");
});

test("칸 상태: 실패 우선, 자동 검사+판독 통과면 통과", () => {
  assert.equal(slotStatus(null), "missing");
  assert.equal(slotStatus({ qc: { structural: { ok: true, issues: [] } } }), "review");
  assert.equal(slotStatus({ qc: { structural: { ok: true, issues: [] }, vision: { ok: true, issues: [] } } }), "pass");
  assert.equal(slotStatus({ qc: { structural: { ok: true, issues: [] }, model_review: { ok: false, issues: ["글자 잘림"] } } }), "fail");
  assert.equal(slotStatus({ qc: { structural: { ok: false, issues: ["크기"] }, human: { ok: true, issues: [] } } }), "fail", "크기 불량은 사람이 통과시켜도 실패");
});

test("검수 보고서: 컷 수 자유, 실패·누락 칸만 다시 제작 목록에", () => {
  const d = {
    kind: "toon" as const,
    synopsis: "s",
    caption: "캡션",
    hashtags: ["#a", "#b", "#c", "#d", "#e"],
    anonymity_checked: false,
    anonymity_notes: "",
    cuts: [1, 2, 3].map((no) => ({ no, scene: `장면 ${no}`, lines: [], notes: "", asset_id: `f${no}`, reel_asset_id: no === 3 ? null : `r${no}` })),
  };
  const ok = { qc: { structural: { ok: true, issues: [] }, vision: { ok: true, issues: [] } } };
  const assets = new Map<string, { id: string; qc: unknown }>([
    ["f1", { id: "f1", ...ok }],
    ["f2", { id: "f2", qc: { structural: { ok: true, issues: [] }, vision: { ok: false, issues: ["콜라주를 자른 흔적"] } } }],
    ["f3", { id: "f3", ...ok }],
    ["r1", { id: "r1", ...ok }],
    ["r2", { id: "r2", ...ok }],
  ]) as never;
  const rep = toonReport(d, assets);
  assert.equal(rep.cuts, 3);
  assert.deepEqual(rep.redo.map((x) => `${x.cut_no}-${x.variant}`), ["2-feed", "3-reels"]);
  assert.equal(rep.complete, false);
  assert.deepEqual(validateToonScript({ ...d, hashtags: ["#a"] }).length, 1);
});
