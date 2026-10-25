/**
 * 아이디어·콘텐츠 주제 유사도. 한국어는 띄어쓰기·조사가 불규칙하므로
 * 단어 토큰 + 한글 2-gram 을 함께 써서 Jaccard 유사도를 계산합니다.
 */

const STOPWORDS = new Set([
  "the", "a", "an", "of", "in", "to", "for", "and", "with", "on", "korea", "korean",
  "콘텐츠", "제작", "여행", "추천", "코스", "이야기", "생긴", "일", "하는", "있는", "위한",
]);

const PARTICLES = /(은|는|이|가|을|를|의|에|에서|으로|로|와|과|도|만|까지|부터)$/;

export function tokenize(text: string): Set<string> {
  const out = new Set<string>();
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/([가-힣a-z])(\d)/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
  for (let w of words) {
    if (/^[가-힣]+$/.test(w) && w.length > 2) w = w.replace(PARTICLES, "");
    if (STOPWORDS.has(w)) continue;
    if (/^\d+$/.test(w)) continue;
    out.add(w);
    if (/^[가-힣]{3,}$/.test(w)) {
      for (let i = 0; i < w.length - 1; i++) out.add(`#${w.slice(i, i + 2)}`);
    }
  }
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

export function similarity(a: string, b: string): number {
  return jaccard(tokenize(a), tokenize(b));
}

export interface SimilarHit<T> {
  item: T;
  score: number;
}

export function findSimilar<T>(
  query: string,
  items: T[],
  text: (item: T) => string,
  threshold = 0.3,
): SimilarHit<T>[] {
  const q = tokenize(query);
  if (q.size === 0) return [];
  return items
    .map((item) => ({ item, score: jaccard(q, tokenize(text(item))) }))
    .filter((h) => h.score >= threshold)
    .sort((x, y) => y.score - x.score);
}
