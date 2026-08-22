export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

export function isValidMonthKey(value: string): boolean {
  return MONTH_KEY_RE.test(value);
}

const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** Weeks (arrays of 7 dates, Sunday-first) covering the full calendar grid for a month. */
export function buildMonthGrid(year: number, month0: number): Date[][] {
  const firstOfMonth = new Date(year, month0, 1);
  const lastOfMonth = new Date(year, month0 + 1, 0);
  const gridStart = new Date(year, month0, 1 - firstOfMonth.getDay());
  const gridEnd = new Date(year, month0, lastOfMonth.getDate() + (6 - lastOfMonth.getDay()));

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export { WEEKDAY_LABELS_KO };
