"use client";

import { useState } from "react";
import { PERIODS } from "@/lib/lecture-sessions";

export interface SessionFormValues {
  date: string;
  period: number;
  professor: string;
  part_name: string;
}

interface SessionFormDialogProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initial?: SessionFormValues;
  onSubmit: (values: SessionFormValues) => Promise<void> | void;
  onClose: () => void;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const EMPTY: SessionFormValues = { date: todayKey(), period: 1, professor: "", part_name: "" };

export function SessionFormDialog({
  open,
  title,
  submitLabel,
  initial,
  onSubmit,
  onClose,
}: SessionFormDialogProps) {
  const [values, setValues] = useState<SessionFormValues>(initial ?? EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
      >
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>

        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">날짜</span>
            <input
              type="date"
              value={values.date}
              onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">교시</span>
            <select
              value={values.period}
              onChange={(e) => setValues((v) => ({ ...v, period: Number(e.target.value) }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}교시
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">교수 (선택)</span>
            <input
              value={values.professor}
              onChange={(e) => setValues((v) => ({ ...v, professor: e.target.value }))}
              placeholder="예: 강경표"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">강의 파트 (선택)</span>
            <input
              value={values.part_name}
              onChange={(e) => setValues((v) => ({ ...v, part_name: e.target.value }))}
              placeholder="예: AKI"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {submitting ? "저장 중..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
