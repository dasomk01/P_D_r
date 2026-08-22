"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LectureSession } from "@/lib/lecture-sessions";
import { SessionFormDialog, type SessionFormValues } from "@/components/session-form-dialog";

function formatDateLabel(dateKey: string): string {
  const [, m, d] = dateKey.split("-").map(Number);
  return `${m}/${d}`;
}

export function LectureSessionsSection({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<LectureSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/courses/${courseId}/lecture-sessions`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "수업 기록을 불러오지 못했습니다.");
        return body as { sessions: LectureSession[] };
      })
      .then((body) => {
        setSessions(body.sessions);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "수업 기록을 불러오지 못했습니다."));
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(values: SessionFormValues) {
    const res = await fetch("/api/lecture-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: courseId,
        date: values.date,
        period: values.period,
        professor: values.professor,
        part_name: values.part_name,
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
    setDialogOpen(false);
    load();
  }

  const groups = new Map<string, LectureSession[]>();
  for (const session of sessions ?? []) {
    const list = groups.get(session.date) ?? [];
    list.push(session);
    groups.set(session.date, list);
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {sessions !== null && groups.size === 0 && (
        <p className="text-sm text-zinc-400 dark:text-zinc-600">아직 등록된 수업이 없습니다.</p>
      )}

      {[...groups.entries()].map(([date, dateSessions]) => (
        <div key={date} className="text-sm">
          <div className="font-medium text-zinc-900 dark:text-zinc-50">{formatDateLabel(date)}</div>
          <ul className="mt-1 flex flex-col gap-1 pl-4">
            {dateSessions
              .sort((a, b) => a.period - b.period)
              .map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/courses/${courseId}/sessions/${session.id}`)}
                    className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {session.period}교시
                    {session.part_name ? ` · ${session.part_name}` : ""}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="mt-1 self-start rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        ＋ 수업 추가
      </button>

      <SessionFormDialog
        open={dialogOpen}
        title="수업 추가"
        submitLabel="저장"
        onSubmit={handleCreate}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
