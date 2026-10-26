import type { Content, Idea, Place } from "./types";
import { findSimilar, jaccard, tokenize } from "./similarity.ts";

/**
 * 다음 제작 추천. 우선순위(요구사항 7):
 *  1. 다음 제작으로 지정한 아이디어
 *  2. 아직 제작하지 않은 공동 아이디어 (투표 많은 순 → 우선순위 → 오래된 순)
 *  3. (여행만) 아카이브의 실제 방문 기록 중 아직 콘텐츠가 없는 장소
 *  4. 기존에 정리·등록한 과거 아이디어 (가져오기/AI 제안으로 저장된 것)
 *  5. AI 새 주제 제안 — 서버 AI 가 연결된 경우에만 별도로 요청
 * 여행과 인스타툰은 별도로 계산합니다.
 */

export type RecommendationSource = "continue" | "next" | "shared_idea" | "archive_place" | "past_idea";

export interface Recommendation {
  source: RecommendationSource;
  rank: number;
  title: string;
  reason: string;
  idea?: Idea;
  place?: Place;
  /** source=continue: 이어서 작업할 콘텐츠 */
  content?: Content;
}

/** 아직 사람 검토로 넘어가지 않은, 이어서 만들 수 있는 콘텐츠 상태 */
const RESUMABLE = new Set(["ai_planning", "ready", "in_production", "revising"]);

/**
 * 아이디어 상태(status)는 콘텐츠 상태를 따라 바뀌므로 그것만 보고 고르면
 * '다음 제작' 아이디어가 제작 시작 직후 목록에서 사라집니다(빈 배열 버그).
 * 그래서 실제 콘텐츠 존재 여부로 판단합니다:
 *  - 승인 안 된 콘텐츠가 있는 아이디어 → 새로 만들지 않음 (제작 중이면 '이어서 작업', 검토 대기면 사람 차례)
 *  - 콘텐츠가 없고 승인 완료도 아닌 아이디어 → 새로 만들 후보
 */
export function recommendNext(opts: {
  projectKind: "travel" | "toon";
  ideas: Idea[];
  votes: Record<string, number>;
  places?: Place[];
  contents?: Content[];
  limit?: number;
}): Recommendation[] {
  const { ideas, votes, projectKind } = opts;
  const contents = opts.contents ?? [];
  const out: Recommendation[] = [];
  const used = new Set<string>();
  const ideaById = new Map(ideas.map((i) => [i.id, i]));

  const active = contents.filter((c) => c.status !== "approved");
  const hasActive = new Set(active.map((c) => c.idea_id).filter(Boolean) as string[]);
  const hasApproved = new Set(contents.filter((c) => c.status === "approved").map((c) => c.idea_id).filter(Boolean) as string[]);

  // 0. 이어서 작업: 다음 제작 지정 아이디어 → 수정 요청 → 최근 작업 순
  const resumable = active
    .filter((c) => RESUMABLE.has(c.status))
    .sort((a, b) => {
      const an = a.idea_id && ideaById.get(a.idea_id)?.is_next ? 0 : 1;
      const bn = b.idea_id && ideaById.get(b.idea_id)?.is_next ? 0 : 1;
      const ar = a.status === "revising" ? 0 : 1;
      const br = b.status === "revising" ? 0 : 1;
      return an - bn || ar - br || b.updated_at.localeCompare(a.updated_at);
    });
  for (const c of resumable) {
    const idea = c.idea_id ? ideaById.get(c.idea_id) : undefined;
    out.push({
      source: "continue",
      rank: 0,
      title: c.title,
      reason: c.status === "revising" ? "수정 요청 — 이어서 작업" : "제작 중 — 새로 만들지 말고 이어서 작업",
      idea,
      content: c,
    });
    if (idea) used.add(idea.id);
  }

  const open = ideas.filter((i) => i.status !== "approved" && !hasActive.has(i.id) && !hasApproved.has(i.id));

  for (const idea of open.filter((i) => i.is_next).sort((a, b) => a.sort_order - b.sort_order)) {
    out.push({ source: "next", rank: 1, title: idea.title, reason: "다음 제작으로 지정됨", idea });
    used.add(idea.id);
  }

  const shared = open
    .filter((i) => !used.has(i.id) && i.source === "manual")
    .sort(
      (a, b) =>
        (votes[b.id] ?? 0) - (votes[a.id] ?? 0) ||
        a.priority - b.priority ||
        a.created_at.localeCompare(b.created_at),
    );
  for (const idea of shared) {
    const v = votes[idea.id] ?? 0;
    out.push({
      source: "shared_idea",
      rank: 2,
      title: idea.title,
      reason: v > 0 ? `공감 ${v} · 아직 제작 전` : "아직 제작하지 않은 공동 아이디어",
      idea,
    });
    used.add(idea.id);
  }

  if (projectKind === "travel" && opts.places) {
    const contentText = contents.map((c) => `${c.title} ${c.keywords.join(" ")}`);
    const ideaText = ideas.map((i) => `${i.title} ${i.tags.join(" ")}`);
    const covered = (p: Place) => {
      const t = tokenize(`${p.name} ${p.region}`);
      return [...contentText, ...ideaText].some((s) => jaccard(t, tokenize(s)) >= 0.34) ||
        ideas.some((i) => i.place_ids.includes(p.id));
    };
    for (const p of opts.places.filter((p) => p.status === "visited" && !covered(p))) {
      out.push({
        source: "archive_place",
        rank: 3,
        title: `${p.region ? p.region + " · " : ""}${p.name}`,
        reason: "직접 방문 기록이 있지만 아직 콘텐츠·아이디어가 없음",
        place: p,
      });
    }
  }

  for (const idea of open.filter((i) => !used.has(i.id))) {
    out.push({
      source: "past_idea",
      rank: 4,
      title: idea.title,
      reason: idea.source === "imported" ? "가져온 과거 아이디어" : "AI 가 제안해 저장한 아이디어",
      idea,
    });
  }

  return out.slice(0, opts.limit ?? 8);
}

export function recommendationHref(r: Recommendation): string {
  if (r.content) return `/studio/${r.content.id}`;
  if (r.idea) return `/ideas/${r.idea.id}`;
  return `/archive/places/${r.place!.id}`;
}

/** 최근 30일 내 제작 콘텐츠와 주제가 겹치는지 검사 (요구사항 11) */
export function recentDuplicates(
  topic: string,
  contents: Content[],
  today: string,
  excludeId?: string,
  days = 30,
) {
  const since = new Date(`${today}T00:00:00Z`).getTime() - days * 86_400_000;
  const recent = contents.filter((c) => {
    if (c.id === excludeId) return false;
    const when = new Date(c.scheduled_date ? `${c.scheduled_date}T00:00:00Z` : c.created_at).getTime();
    return when >= since;
  });
  return findSimilar(topic, recent, (c) => `${c.title} ${c.keywords.join(" ")}`, 0.3);
}
