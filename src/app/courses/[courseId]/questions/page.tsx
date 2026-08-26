"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { LectureSession } from "@/lib/lecture-sessions";
import { QUESTION_CATEGORIES, type QuestionCategory } from "@/lib/questions";

interface BatchListItem {
  id: string;
  status: "generating" | "done" | "error";
  round: number;
  error_message: string | null;
  created_at: string;
  question_batch_sessions: { lecture_session: { id: string; date: string; period: number; part_name: string | null } | null }[];
}

function sessionLabel(s: { date: string; period: number; part_name: string | null }) {
  const [, m, d] = s.date.split("-").map(Number);
  return `${m}/${d} ${s.period}교시${s.part_name ? ` · ${s.part_name}` : ""}`;
}

const CATEGORY_INFO: Record<QuestionCategory, { emoji: string; desc: string }> = {
  야마그대로: { emoji: "📌", desc: "기출 그대로" },
  야마변형: { emoji: "🔄", desc: "기출 변형" },
  티야: { emoji: "🔥", desc: "교수님 강조 (전체)" },
  탈야: { emoji: "🧭", desc: "기출 외 심화" },
};

export default function CourseQuestionsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [sessions, setSessions] = useState<LectureSession[] | null>(null);
  const [batches, setBatches] = useState<BatchListItem[]>([]);
  const [counts, setCounts] = useState<Record<QuestionCategory, number> | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [displayRound, setDisplayRound] = useState(0);
  const [staleBatch, setStaleBatch] = useState(false);

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

  const loadBatches = useCallback(() => {
    fetch(`/api/courses/${courseId}/question-batches`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "생성 기록을 불러오지 못했습니다.");
        return body as { batches: BatchListItem[] };
      })
      .then((body) => {
        setBatches(body.batches);
        setActiveBatchId((current) => {
          if (current) return current;
          const generating = body.batches.find((b) => b.status === "generating");
          return generating ? generating.id : current;
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "생성 기록을 불러오지 못했습니다."));
  }, [courseId]);

  const loadCounts = useCallback(() => {
    Promise.all(
      QUESTION_CATEGORIES.map((c) =>
        fetch(`/api/courses/${courseId}/questions?category=${encodeURIComponent(c)}`)
          .then((res) => res.json())
          .then((body) => [c, (body.questions ?? []).length] as const),
      ),
    ).then((pairs) => setCounts(Object.fromEntries(pairs) as Record<QuestionCategory, number>));
  }, [courseId]);

  useEffect(() => {
    loadSessions();
    loadBatches();
    loadCounts();
  }, [loadSessions, loadBatches, loadCounts]);

  // Drives the active batch's rounds one at a time — same reason as the
  // summary pages' tick loop: Vercel blocks a server calling back into its
  // own deployment, so the browser has to be the one advancing each round.
  useEffect(() => {
    if (!activeBatchId) return;
    let cancelled = false;

    async function tickOnce(): Promise<{ status: "generating" | "done" | "error"; round: number }> {
      const res = await fetch("/api/question-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeBatchId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "문제 생성에 실패했습니다.");
      return body;
    }

    async function run() {
      try {
        let status: "generating" | "done" | "error" = "generating";
        let lastRound = -1;
        let lastProgressAt = Date.now();

        while (!cancelled && status === "generating") {
          if (Date.now() - lastProgressAt > 90_000) {
            setStaleBatch(true);
            break;
          }
          const result = await tickOnce();
          if (cancelled) return;
          status = result.status;
          setDisplayRound(result.round);
          if (result.round !== lastRound) {
            lastRound = result.round;
            lastProgressAt = Date.now();
          }
        }

        if (!cancelled && status !== "generating") {
          setActiveBatchId(null);
          setStaleBatch(false);
          loadBatches();
          loadCounts();
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "문제 생성에 실패했습니다.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [activeBatchId, loadBatches, loadCounts]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerate() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/question-batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureSessionIds: [...selected] }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "문제 생성에 실패했습니다.");
      setSelected(new Set());
      setDisplayRound(0);
      setStaleBatch(false);
      setActiveBatchId(body.batch.id);
      loadBatches();
    } catch (err) {
      setError(err instanceof Error ? err.message : "문제 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  }

  const latestFailed = batches.find((b) => b.status === "error");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link href={`/courses/${courseId}`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 강의로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">🧩 문제풀이</h1>
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">{error}</p>
      )}

      {activeBatchId && !staleBatch && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          ⏳ 문제를 생성하고 있습니다 (라운드 {displayRound + 1} 진행 중). 티야는 개수 제한이 없어서 자료가 많으면 시간이 걸릴 수 있어요. <strong>이 화면을 열어둔 채로 기다려주세요.</strong>
        </div>
      )}
      {activeBatchId && staleBatch && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          생성이 예상보다 오래 걸리고 있습니다. 페이지를 새로고침해서 이어서 시도해보고, 계속 이 상태면 아래 생성 기록에서 삭제 후 다시 시도해 주세요.
        </div>
      )}
      {!activeBatchId && latestFailed && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          최근 문제 생성 실패: {latestFailed.error_message ?? "알 수 없는 오류"}
        </p>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">수업 선택</h2>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          체크한 수업의 강의록·STT·학습지(기출)를 바탕으로 야마그대로/야마변형/티야/탈야 문제를 한 번에 생성합니다.
        </p>

        {sessions !== null && sessions.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">등록된 수업이 없습니다.</p>
        )}

        <ul className="flex flex-col gap-2">
          {sessions?.map((session) => (
            <li key={session.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.has(session.id)} onChange={() => toggle(session.id)} />
              <span>{sessionLabel(session)}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={selected.size === 0 || creating || activeBatchId !== null}
          onClick={handleGenerate}
          className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {creating ? "생성 시작 중..." : `선택한 ${selected.size}개 수업으로 문제 생성`}
        </button>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">카테고리별 풀이</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUESTION_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/courses/${courseId}/questions/${encodeURIComponent(c)}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-2xl">{CATEGORY_INFO[c].emoji}</div>
              <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{c}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{CATEGORY_INFO[c].desc}</div>
              <div className="mt-2 text-sm text-zinc-400 dark:text-zinc-600">{counts ? `${counts[c]}문제` : "…"}</div>
            </Link>
          ))}
        </div>

        <Link
          href={`/courses/${courseId}/questions/wrong`}
          className="mt-3 block rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          📕 오답노트
        </Link>
      </section>

      {batches.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">생성 기록</h2>
          <div className="flex flex-col gap-2">
            {batches.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-zinc-500 dark:text-zinc-400">
                  {b.question_batch_sessions
                    .map((s) => s.lecture_session && sessionLabel(s.lecture_session))
                    .filter(Boolean)
                    .join(" + ") || "삭제된 수업"}
                </span>
                {b.status === "generating" && (
                  <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">⏳ 생성 중</span>
                )}
                {b.status === "error" && (
                  <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">⚠ 실패</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
