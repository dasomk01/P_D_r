"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { parseSummaryText } from "@/lib/summary/parse";
import { SummaryViewer } from "@/components/summary-viewer";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface CombinedSummaryDetail {
  id: string;
  version: number;
  content: string;
  docx_url: string | null;
  pdf_url: string | null;
  combined_summary_sessions: {
    lecture_session: { date: string; period: number; part_name: string | null } | null;
  }[];
}

function sessionLabel(s: { date: string; period: number; part_name: string | null }) {
  const [, m, d] = s.date.split("-").map(Number);
  return `${m}/${d} ${s.period}교시${s.part_name ? ` · ${s.part_name}` : ""}`;
}

export default function CombinedSummaryPage() {
  const { courseId, combinedId } = useParams<{ courseId: string; combinedId: string }>();
  const router = useRouter();

  const [summary, setSummary] = useState<CombinedSummaryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/combined-summaries/${combinedId}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "통합 정리본을 불러오지 못했습니다.");
        return body as { combinedSummary: CombinedSummaryDetail };
      })
      .then((body) => setSummary(body.combinedSummary))
      .catch((err) => setError(err instanceof Error ? err.message : "통합 정리본을 불러오지 못했습니다."));
  }, [combinedId]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/combined-summaries/${combinedId}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      router.push(`/courses/${courseId}/summary`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  if (error && !summary) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <Link href={`/courses/${courseId}/summary`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 정리본 목록
        </Link>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {error}
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <p className="text-sm text-zinc-400">불러오는 중...</p>
      </div>
    );
  }

  const blocks = parseSummaryText(summary.content);
  const sessionLabels = summary.combined_summary_sessions
    .map((s) => s.lecture_session && sessionLabel(s.lecture_session))
    .filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <Link href={`/courses/${courseId}/summary`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 정리본 목록
        </Link>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">통합 정리본</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{sessionLabels.join(" + ")}</p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            🗑 삭제
          </button>
        </div>

        <div className="mt-3 flex gap-3 text-sm">
          {summary.docx_url && (
            <a href={summary.docx_url} className="text-zinc-600 underline dark:text-zinc-300">
              Word 다운로드
            </a>
          )}
          {summary.pdf_url && (
            <a href={summary.pdf_url} className="text-zinc-600 underline dark:text-zinc-300">
              PDF 다운로드
            </a>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <SummaryViewer blocks={blocks} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="통합 정리본 삭제"
        message="이 통합 정리본을 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        submitting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
