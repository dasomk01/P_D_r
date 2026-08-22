"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FILE_TYPE_CONFIG, FILE_TYPES, type FileType, type Lecture, type LectureFile } from "@/lib/lectures";

interface LectureEditorProps {
  date: string;
  period: number;
  initialLecture: Lecture | null;
  initialFiles: LectureFile[];
  configured: boolean;
  initialError: string | null;
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

export function LectureEditor({
  date,
  period,
  initialLecture,
  initialFiles,
  configured,
  initialError,
}: LectureEditorProps) {
  const [lecture, setLecture] = useState<Lecture | null>(initialLecture);
  const [subject, setSubject] = useState(initialLecture?.subject ?? "");
  const [title, setTitle] = useState(initialLecture?.title ?? "");
  const [files, setFiles] = useState<LectureFile[]>(initialFiles);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(initialError);
  const [uploadingType, setUploadingType] = useState<FileType | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<FileType, string>>>({});

  const fileByType = new Map(files.map((f) => [f.type, f]));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, period, subject, title }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
      setLecture(body.lecture as Lecture);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(type: FileType, file: File) {
    setUploadingType(type);
    setUploadErrors((prev) => ({ ...prev, [type]: undefined }));

    try {
      const form = new FormData();
      form.set("date", date);
      form.set("period", String(period));
      form.set("type", type);
      form.set("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "업로드에 실패했습니다.");

      const uploaded = body.file as LectureFile;
      setFiles((prev) => [...prev.filter((f) => f.type !== type), uploaded]);
    } catch (err) {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: err instanceof Error ? err.message : "업로드에 실패했습니다.",
      }));
    } finally {
      setUploadingType(null);
    }
  }

  async function handleDelete(fileRow: LectureFile) {
    setUploadingType(fileRow.type);
    setUploadErrors((prev) => ({ ...prev, [fileRow.type]: undefined }));

    try {
      const res = await fetch(`/api/upload?fileId=${fileRow.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      setFiles((prev) => prev.filter((f) => f.id !== fileRow.id));
    } catch (err) {
      setUploadErrors((prev) => ({
        ...prev,
        [fileRow.type]: err instanceof Error ? err.message : "삭제에 실패했습니다.",
      }));
    } finally {
      setUploadingType(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <Link
          href={`/summary/${date}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← {formatDateLabel(date)}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{period}교시</h1>
      </div>

      {!configured && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          Supabase 환경변수가 설정되지 않았습니다. 저장/업로드는 환경변수 연결 후 동작합니다.
        </p>
      )}

      <form
        onSubmit={handleSave}
        className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">과목</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="예: 내과"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">강의명</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 기관지확장증"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>

        {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 self-start rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">파일 업로드</h2>
        {!lecture && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            과목/강의명을 먼저 저장하면 파일을 업로드할 수 있습니다.
          </p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          야첵 또는 강의록 중 하나만 있어도 됩니다.
        </p>

        {FILE_TYPES.map((type) => (
          <FileSlot
            key={type}
            type={type}
            file={fileByType.get(type)}
            disabled={!lecture}
            uploading={uploadingType === type}
            error={uploadErrors[type]}
            onUpload={(file) => handleUpload(type, file)}
            onDelete={(f) => handleDelete(f)}
          />
        ))}
      </div>
    </div>
  );
}

function FileSlot({
  type,
  file,
  disabled,
  uploading,
  error,
  onUpload,
  onDelete,
}: {
  type: FileType;
  file: LectureFile | undefined;
  disabled: boolean;
  uploading: boolean;
  error: string | undefined;
  onUpload: (file: File) => void;
  onDelete: (file: LectureFile) => void;
}) {
  const config = FILE_TYPE_CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{config.label}</span>

        {file ? (
          <div className="flex items-center gap-3 text-sm">
            {file.url ? (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 underline dark:text-zinc-300"
              >
                미리보기
              </a>
            ) : (
              <span className="text-zinc-400">업로드됨</span>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => onDelete(file)}
              className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          hidden
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) onUpload(selected);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
