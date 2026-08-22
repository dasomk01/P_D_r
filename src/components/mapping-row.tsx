"use client";

import { useState } from "react";
import type { StudyMaterialMapping } from "@/lib/study-materials";

export interface MappingFormValues {
  part_name: string;
  professor: string;
  page_start: string;
  page_end: string;
  problem_start: string;
  problem_end: string;
}

function toFormValues(mapping?: StudyMaterialMapping): MappingFormValues {
  return {
    part_name: mapping?.part_name ?? "",
    professor: mapping?.professor ?? "",
    page_start: mapping?.page_start?.toString() ?? "",
    page_end: mapping?.page_end?.toString() ?? "",
    problem_start: mapping?.problem_start?.toString() ?? "",
    problem_end: mapping?.problem_end?.toString() ?? "",
  };
}

function rangeLabel(start: number | null, end: number | null): string {
  if (start === null && end === null) return "-";
  if (start !== null && end !== null) return `${start}~${end}`;
  return `${start ?? end}`;
}

export function MappingRow({
  mapping,
  startEditing,
  onSave,
  onDelete,
  onToggleConfirmed,
  onCancelNew,
}: {
  mapping?: StudyMaterialMapping;
  startEditing?: boolean;
  onSave: (values: MappingFormValues) => Promise<void>;
  onDelete?: () => void;
  onToggleConfirmed?: (confirmed: boolean) => void;
  onCancelNew?: () => void;
}) {
  const [editing, setEditing] = useState(Boolean(startEditing));
  const [values, setValues] = useState<MappingFormValues>(toFormValues(mapping));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!values.part_name.trim()) {
      setError("파트명을 입력하세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(values);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <tr className="border-b border-zinc-100 dark:border-zinc-800">
        <td colSpan={6} className="p-3">
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              placeholder="파트명 (예: AKI)"
              value={values.part_name}
              onChange={(e) => setValues((v) => ({ ...v, part_name: e.target.value }))}
              className="w-32 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              placeholder="교수"
              value={values.professor}
              onChange={(e) => setValues((v) => ({ ...v, professor: e.target.value }))}
              className="w-24 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              placeholder="시작 p."
              inputMode="numeric"
              value={values.page_start}
              onChange={(e) => setValues((v) => ({ ...v, page_start: e.target.value }))}
              className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              placeholder="끝 p."
              inputMode="numeric"
              value={values.page_end}
              onChange={(e) => setValues((v) => ({ ...v, page_end: e.target.value }))}
              className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              placeholder="시작 문제#"
              inputMode="numeric"
              value={values.problem_start}
              onChange={(e) => setValues((v) => ({ ...v, problem_start: e.target.value }))}
              className="w-24 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              placeholder="끝 문제#"
              inputMode="numeric"
              value={values.problem_end}
              onChange={(e) => setValues((v) => ({ ...v, problem_end: e.target.value }))}
              className="w-24 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={() => (mapping ? setEditing(false) : onCancelNew?.())}
              className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              취소
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </td>
      </tr>
    );
  }

  if (!mapping) return null;

  return (
    <tr className="border-b border-zinc-100 text-sm dark:border-zinc-800">
      <td className="p-3 font-medium text-zinc-900 dark:text-zinc-50">{mapping.part_name}</td>
      <td className="p-3 text-zinc-600 dark:text-zinc-400">{mapping.professor ?? "-"}</td>
      <td className="p-3 text-zinc-600 dark:text-zinc-400">
        {rangeLabel(mapping.page_start, mapping.page_end)}
      </td>
      <td className="p-3 text-zinc-600 dark:text-zinc-400">
        {rangeLabel(mapping.problem_start, mapping.problem_end)}
      </td>
      <td className="p-3">
        <label className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={mapping.confirmed}
            onChange={(e) => onToggleConfirmed?.(e.target.checked)}
          />
          확인됨
        </label>
      </td>
      <td className="p-3 text-right">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mr-2 text-zinc-500 hover:underline dark:text-zinc-400"
        >
          편집
        </button>
        <button type="button" onClick={onDelete} className="text-red-600 hover:underline dark:text-red-400">
          삭제
        </button>
      </td>
    </tr>
  );
}
