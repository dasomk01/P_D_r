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
  status: "pending" | "generating" | "done" | "error";
  round: number;
  error_message: string | null;
  content: string | null;
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

// Vercel blocks a function calling back into its own deployment (508 Loop
// Detected), so rounds can't chain server-side — this page itself drives
// each round by calling /api/summary-round and waiting for it, then
// re-fetching state, in a loop. That means generation only progresses while
// this page is open; closing the tab just pauses it (progress so far is
// saved), and reopening resumes from where it left off.
//
// A large summary can legitimately need many rounds (each up to ~40s), so
// total elapsed time isn't a reliable "is this stuck" signal on its own —
// flag it only once the round counter itself stops advancing, since any
// real failure (a tick request erroring) already surfaces as `error`
// instead of a silent hang.
const STALL_THRESHOLD_MS = 90_000;

export default function CombinedSummaryPage() {
  const { courseId, combinedId } = useParams<{ courseId: string; combinedId: string }>();
  const router = useRouter();

  const [summary, setSummary] = useState<CombinedSummaryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFull(): Promise<CombinedSummaryDetail> {
      const res = await fetch(`/api/combined-summaries/${combinedId}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "통합 정리본을 불러오지 못했습니다.");
      return (body as { combinedSummary: CombinedSummaryDetail }).combinedSummary;
    }

    async function tickOnce() {
      const res = await fetch("/api/summary-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "combined", id: combinedId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "통합 정리본 생성에 실패했습니다.");
    }

    async function run() {
      try {
        let current = await loadFull();
        if (cancelled) return;
        setSummary(current);

        let lastRound = current.round;
        let lastProgressAt = Date.now();

        while (!cancelled && current.status === "generating") {
          if (Date.now() - lastProgressAt > STALL_THRESHOLD_MS) {
            setStale(true);
            break;
          }
          await tickOnce();
          if (cancelled) return;
          current = await loadFull();
          if (cancelled) return;
          setSummary(current);
          if (current.round !== lastRound) {
            lastRound = current.round;
            lastProgressAt = Date.now();
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "통합 정리본을 불러오지 못했습니다.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
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

  const blocks = summary.status === "done" && summary.content ? parseSummaryText(summary.content) : null;
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

        {summary.status === "done" && (
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
        )}
      </div>

      {summary.status === "generating" && !stale && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          ⏳ 통합 정리본을 생성하고 있습니다 (라운드 {summary.round + 1} 진행 중). 여러 단계로 나눠 이어서 작성하는 방식이라 수업 개수/분량에 따라 몇 분 정도 걸릴 수 있어요. <strong>이 화면을 열어둔 채로 기다려주세요</strong> — 탭을 닫으면 진행이 멈추지만, 지금까지 쓴 내용은 저장돼 있어서 다시 열면 이어서 진행됩니다.
        </div>
      )}

      {summary.status === "generating" && stale && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          생성이 예상보다 오래 걸리고 있습니다. 페이지를 새로고침해서 이어서 시도해보고, 계속 이 상태면 삭제 후 다시 시도해 주세요.
        </div>
      )}

      {summary.status === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          통합 정리본 생성에 실패했습니다{summary.error_message ? `: ${summary.error_message}` : "."}
        </div>
      )}

      {blocks && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryViewer blocks={blocks} />
        </div>
      )}

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
