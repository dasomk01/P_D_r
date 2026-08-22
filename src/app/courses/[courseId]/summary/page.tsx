"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { LectureSession } from "@/lib/lecture-sessions";

interface SummaryListItem {
  id: string;
  version: number;
  created_at: string;
  lecture_session: { id: string; date: string; period: number; part_name: string | null } | null;
}

interface CombinedSummaryListItem {
  id: string;
  version: number;
  created_at: string;
  combined_summary_sessions: {
    lecture_session: { id: string; date: string; period: number; part_name: string | null } | null;
  }[];
}

function sessionLabel(s: { date: string; period: number; part_name: string | null }) {
  const [, m, d] = s.date.split("-").map(Number);
  return `${m}/${d} ${s.period}교시${s.part_name ? ` · ${s.part_name}` : ""}`;
}

export default function CourseSummaryHubPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [sessions, setSessions] = useState<LectureSession[] | null>(null);
  const [individual, setIndividual] = useState<SummaryListItem[]>([]);
  const [combined, setCombined] = useState<CombinedSummaryListItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null); // sessionId or "combined"

  const loadSessions = useCallback(() => {
    fetch(`/api/courses/${courseId}/lecture-sessions`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "수업 목록을 불러오지 못했습니다.");
        return body as { sessions: LectureSession[] };
      })
      .then((body) => setSessions(body.sessions))
      .catch((err) => setError(err instanceof Error ? err.message : "수업 목록을 불러오지 못했습니다."));
  }, [courseId]);

  const loadSummaries = useCallback(() => {
    fetch(`/api/courses/${courseId}/summaries`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "정리본 목록을 불러오지 못했습니다.");
        return body as { individual: SummaryListItem[]; combined: CombinedSummaryListItem[] };
      })
      .then((body) => {
        setIndividual(body.individual);
        setCombined(body.combined);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "정리본 목록을 불러오지 못했습니다."));
  }, [courseId]);

  useEffect(() => {
    loadSessions();
    loadSummaries();
  }, [loadSessions, loadSummaries]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerateIndividual(sessionId: string) {
    setGenerating(sessionId);
    setError(null);
    try {
      const res = await fetch(`/api/lecture-sessions/${sessionId}/summary`, { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "정리본 생성에 실패했습니다.");
      router.push(`/courses/${courseId}/summary/${body.summary.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "정리본 생성에 실패했습니다.");
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateCombined() {
    setGenerating("combined");
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/combined-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureSessionIds: [...selected] }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "통합 정리본 생성에 실패했습니다.");
      router.push(`/courses/${courseId}/summary/combined/${body.combinedSummary.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "통합 정리본 생성에 실패했습니다.");
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
        >
          ← 강의로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">📝 정리본</h1>
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">수업 선택</h2>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          체크한 수업들로 통합 정리본을 만들거나, 각 수업 옆 버튼으로 개별 정리본을 만들 수 있습니다.
        </p>

        {sessions !== null && sessions.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">등록된 수업이 없습니다.</p>
        )}

        <ul className="flex flex-col gap-2">
          {sessions?.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(session.id)}
                  onChange={() => toggle(session.id)}
                />
                <span>{sessionLabel(session)}</span>
              </label>
              <button
                type="button"
                disabled={generating !== null}
                onClick={() => handleGenerateIndividual(session.id)}
                className="shrink-0 rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {generating === session.id ? "생성 중..." : "개별 정리본 만들기"}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={selected.size === 0 || generating !== null}
          onClick={handleGenerateCombined}
          className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {generating === "combined" ? "생성 중... (시간이 걸릴 수 있어요)" : `선택한 ${selected.size}개로 통합 정리본 만들기`}
        </button>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">생성된 정리본</h2>

        {individual.length === 0 && combined.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">아직 생성된 정리본이 없습니다.</p>
        )}

        <div className="flex flex-col gap-2">
          {combined.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${courseId}/summary/combined/${c.id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">통합 정리본</span>
              <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                {c.combined_summary_sessions
                  .map((s) => s.lecture_session && sessionLabel(s.lecture_session))
                  .filter(Boolean)
                  .join(" + ")}
              </span>
            </Link>
          ))}
          {individual.map((s) => (
            <Link
              key={s.id}
              href={`/courses/${courseId}/summary/${s.id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">개별 정리본</span>
              <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                {s.lecture_session ? sessionLabel(s.lecture_session) : "삭제된 수업"}
              </span>
              <span className="ml-2 text-zinc-400 dark:text-zinc-600">v{s.version}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
