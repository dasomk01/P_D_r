"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildMonthGrid, toDateKey, toMonthKey, WEEKDAY_LABELS_KO } from "@/lib/date";

export function Calendar() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month0 = viewDate.getMonth();
  const monthKey = toMonthKey(viewDate);
  const weeks = useMemo(() => buildMonthGrid(year, month0), [year, month0]);
  const todayKey = toDateKey(today);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/lectures?month=${monthKey}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "달력 정보를 불러오지 못했습니다.");
        return body as { counts: Record<string, number> };
      })
      .then((body) => {
        if (cancelled) return;
        setCounts(body.counts);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "달력 정보를 불러오지 못했습니다.");
      });

    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  function goToMonth(delta: number) {
    setViewDate(new Date(year, month0 + delta, 1));
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="이전 달"
          className="rounded-full px-3 py-2 text-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {year}년 {month0 + 1}월
        </h2>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="다음 달"
          className="rounded-full px-3 py-2 text-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          ›
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-400">
        {WEEKDAY_LABELS_KO.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week) =>
          week.map((date) => {
            const key = toDateKey(date);
            const inMonth = date.getMonth() === month0;
            const isToday = key === todayKey;
            const count = counts[key] ?? 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => router.push(`/summary/${key}`)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                  inMonth ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-300 dark:text-zinc-700"
                } ${isToday ? "ring-2 ring-inset ring-zinc-900 dark:ring-zinc-100" : ""}`}
              >
                <span>{date.getDate()}</span>
                {count > 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
