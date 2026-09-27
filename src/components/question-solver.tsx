"use client";

import { useState } from "react";
import { isSubjective, type QuestionCategory, type QuestionContent, type QuestionReviewStatus } from "@/lib/questions";

export interface SolvableQuestion {
  id: string;
  category: QuestionCategory;
  content_json: QuestionContent;
  review_status: QuestionReviewStatus;
  review_notes: string | null;
}

export function QuestionSolver({ questions }: { questions: SolvableQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // 주관식: 작성 답안 + 모범답안 공개 여부 (채점은 공개 후 본인이 매김)
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<{ correct: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  if (questions.length === 0) {
    return <p className="text-sm text-zinc-400 dark:text-zinc-600">아직 문제가 없습니다.</p>;
  }

  if (index >= questions.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          다 풀었습니다 — {stats.correct} / {stats.total} 정답
        </p>
      </div>
    );
  }

  const q = questions[index];
  const content = q.content_json;
  const subjective = isSubjective(content);

  async function submitAttempt(payload: { selected: number[] | string[]; selfCorrect?: boolean }) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, ...payload }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "채점에 실패했습니다.");
      setResult({ correct: body.correct });
      setStats((s) => ({ correct: s.correct + (body.correct ? 1 : 0), total: s.total + 1 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "채점에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    if (selected === null) return;
    void submitAttempt({ selected: [selected] });
  }

  function handleSelfGrade(selfCorrect: boolean) {
    void submitAttempt({ selected: [draft.trim()], selfCorrect });
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setSelected(null);
    setDraft("");
    setRevealed(false);
    setResult(null);
  }

  const primaryButtonClass =
    "rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-400 dark:text-zinc-600">
        {index + 1} / {questions.length}
      </p>

      {(q.review_status === "pending" || content.outOfScope || subjective) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {subjective && (
            <span className="rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              ✍️ 주관식
            </span>
          )}
          {q.review_status === "pending" && (
            <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              ⚠ 확인 필요{q.review_notes ? `: ${q.review_notes}` : ""}
            </span>
          )}
          {content.outOfScope && (
            <span className="rounded-full bg-zinc-100 px-2 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              📍 이번 수업 범위 밖
            </span>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="whitespace-pre-wrap text-base font-medium text-zinc-900 dark:text-zinc-50">{content.stem}</p>

        {subjective ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={revealed}
            rows={3}
            placeholder="답안을 작성하세요"
            className="mt-4 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 disabled:opacity-70 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-100"
          />
        ) : (
        <div className="mt-4 flex flex-col gap-2">
          {content.choices.map((choice, i) => {
            const isAnswer = i === content.answerIndex;
            const isPicked = i === selected;
            let stateClass = "border-zinc-200 dark:border-zinc-700";
            if (result) {
              if (isAnswer) stateClass = "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950";
              else if (isPicked) stateClass = "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950";
            } else if (isPicked) {
              stateClass = "border-zinc-900 dark:border-zinc-100";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={!!result}
                onClick={() => setSelected(i)}
                className={`rounded-xl border px-4 py-2 text-left text-sm transition ${stateClass} disabled:cursor-default`}
              >
                {i + 1}) {choice}
              </button>
            );
          })}
        </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {(result || (subjective && revealed)) && (
          <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800">
            {result && (
              <p className={`font-semibold ${result.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {subjective ? (result.correct ? "맞음으로 기록했습니다." : "틀림으로 기록했습니다 — 오답노트에 추가됩니다.") : result.correct ? "정답입니다!" : "오답입니다."}
              </p>
            )}
            {subjective && (
              <p className="mt-2 whitespace-pre-wrap font-medium text-zinc-900 dark:text-zinc-50">
                모범답안: {content.answerText || "학습지에 제공된 답 없음"}
              </p>
            )}
            <p className="mt-2 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">{content.explanation}</p>
            {content.sourceNote && (
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">출처: {content.sourceNote}</p>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          {result ? (
            <button type="button" onClick={handleNext} className={primaryButtonClass}>
              다음 문제
            </button>
          ) : subjective && !revealed ? (
            <button type="button" onClick={() => setRevealed(true)} className={primaryButtonClass}>
              답안 확인
            </button>
          ) : subjective ? (
            <>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSelfGrade(false)}
                className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                틀렸어요
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSelfGrade(true)}
                className="rounded-full border border-green-300 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
              >
                맞았어요
              </button>
            </>
          ) : (
            <button type="button" disabled={selected === null || submitting} onClick={handleSubmit} className={primaryButtonClass}>
              {submitting ? "채점 중..." : "제출"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
