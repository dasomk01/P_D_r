"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CalendarSession {
  id: string;
  period: number;
  professor: string | null;
  part_name: string | null;
  course: { id: string; name: string; subject: string } | null;
}

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function CalendarDatePage() {
  const { date } = useParams<{ date: string }>();
  const [sessions, setSessions] = useState<CalendarSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/calendar?date=${date}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "수업 정보를 불러오지 못했습니다.");
        return body as { sessions: CalendarSession[] };
      })
      .then((body) => {
        setSessions(body.sessions);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "수업 정보를 불러오지 못했습니다."));
  }, [date]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <Link href="/calendar" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 달력으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatDateLabel(date)}</h1>
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {error}
        </p>
      )}

      {sessions !== null && sessions.length === 0 && !error && (
        <p className="text-sm text-zinc-400 dark:text-zinc-600">이 날짜에 등록된 수업이 없습니다.</p>
      )}

      <div className="flex flex-col gap-2">
        {sessions?.map((session) => (
          <Link
            key={session.id}
            href={session.course ? `/courses/${session.course.id}/sessions/${session.id}` : "#"}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {session.period}교시
              </span>
              <span className="ml-2 font-medium text-zinc-900 dark:text-zinc-50">
                {session.course?.name ?? "삭제된 강의"}
              </span>
              {session.part_name && (
                <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{session.part_name}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
