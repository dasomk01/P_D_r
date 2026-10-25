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

export type RecommendationSource = "next" | "shared_idea" | "archive_place" | "past_idea";

export interface Recommendation {
  source: RecommendationSource;
  rank: number;
  title: string;
  reason: string;
  idea?: Idea;
  place?: Place;
}

const UNSTARTED = new Set(["idea", "ai_planning", "ready"]);

export function recommendNext(opts: {
  projectKind: "travel" | "toon";
  ideas: Idea[];
  votes: Record<string, number>;
  places?: Place[];
  contents?: Content[];
  limit?: number;
}): Recommendation[] {
  const { ideas, votes, projectKind } = opts;
  const out: Recommendation[] = [];
  const used = new Set<string>();

  const open = ideas.filter((i) => UNSTARTED.has(i.status));

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
    const contentText = (opts.contents ?? []).map((c) => `${c.title} ${c.keywords.join(" ")}`);
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
