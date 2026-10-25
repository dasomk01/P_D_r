/** Asia/Seoul 기준 날짜 유틸 (브라우저 시간대와 무관하게 동작) */

const KST_OFFSET_MIN = 9 * 60;

export function kstNow(now: Date = new Date()): Date {
  return new Date(now.getTime() + (KST_OFFSET_MIN + now.getTimezoneOffset()) * 60_000);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function kstToday(now: Date = new Date()): string {
  return toISODate(kstNow(now));
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return toISODate(dt);
}

export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

/** 달력 표시용: 월요일 시작 6주 그리드 */
export function monthGrid(year: number, month0: number): string[] {
  const first = new Date(year, month0, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month0, 1 - offset);
  return Array.from({ length: 42 }, (_, i) =>
    toISODate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)),
  );
}

export function formatKDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][new Date(y, m - 1, d).getDay()];
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")} (${wd})`;
}

export function formatDateTime(ts: string | null | undefined): string {
  if (!ts) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function timeAgo(ts: string, now: Date = new Date()): string {
  const s = Math.max(0, (now.getTime() - new Date(ts).getTime()) / 1000);
  if (s < 60) return "방금";
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}일 전`;
  return formatDateTime(ts).slice(0, 12);
}
