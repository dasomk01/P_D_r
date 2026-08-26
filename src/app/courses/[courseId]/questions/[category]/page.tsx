"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuestionSolver, type SolvableQuestion } from "@/components/question-solver";
import { isQuestionCategory } from "@/lib/questions";

export default function QuestionCategoryPage() {
  const { courseId, category } = useParams<{ courseId: string; category: string }>();
  const decodedCategory = decodeURIComponent(category);
  const categoryValid = isQuestionCategory(decodedCategory);

  const [questions, setQuestions] = useState<SolvableQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryValid) return;
    fetch(`/api/courses/${courseId}/questions?category=${encodeURIComponent(decodedCategory)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "문제를 불러오지 못했습니다.");
        return body as { questions: SolvableQuestion[] };
      })
      .then((body) => setQuestions(body.questions))
      .catch((err) => setError(err instanceof Error ? err.message : "문제를 불러오지 못했습니다."));
  }, [courseId, decodedCategory, categoryValid]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <Link href={`/courses/${courseId}/questions`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 문제풀이
        </Link>
        <h1 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">{decodedCategory}</h1>
      </div>

      {!categoryValid && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          알 수 없는 카테고리입니다.
        </p>
      )}
      {categoryValid && error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">{error}</p>
      )}

      {categoryValid && !error && questions === null && <p className="text-sm text-zinc-400">불러오는 중...</p>}
      {categoryValid && !error && questions !== null && <QuestionSolver questions={questions} />}
    </div>
  );
}
