"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  SESSION_FILE_CONFIG,
  type LectureSession,
  type SessionFileType,
} from "@/lib/lecture-sessions";
import { uploadFileDirect } from "@/lib/supabase/upload-client";
import { SessionFormDialog, type SessionFormValues } from "@/components/session-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";

type SessionWithUrls = LectureSession & { lecture_pdf_url: string | null; stt_url: string | null };
type DialogState = "edit" | "delete" | null;

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function SessionDetailPage() {
  const { courseId, sessionId } = useParams<{ courseId: string; sessionId: string }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionWithUrls | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/lecture-sessions/${sessionId}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "수업 정보를 불러오지 못했습니다.");
        return body as { session: SessionWithUrls };
      })
      .then((body) => {
        setSession(body.session);
        setLoadError(null);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "수업 정보를 불러오지 못했습니다."));
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleEdit(values: SessionFormValues) {
    const res = await fetch(`/api/lecture-sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
    setDialog(null);
    load();
  }

  async function handleDelete() {
    setActionSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/lecture-sessions/${sessionId}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      router.push(`/courses/${courseId}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setActionSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <Link href={`/courses/${courseId}`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 강의로
        </Link>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {loadError}
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <p className="text-sm text-zinc-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link href={`/courses/${courseId}`} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 강의로
        </Link>

        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatDateLabel(session.date)} · {session.period}교시
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {session.professor ? `교수: ${session.professor}` : "교수 미지정"}
              {session.part_name ? ` · 파트: ${session.part_name}` : ""}
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setDialog("edit")}
              className="rounded-full border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              ✏️ 편집
            </button>
            <button
              type="button"
              onClick={() => setDialog("delete")}
              className="rounded-full border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              🗑 삭제
            </button>
          </div>
        </div>
      </div>

      <SessionFileBlock
        sessionId={session.id}
        type="lecture_pdf"
        emoji="📄"
        path={session.lecture_pdf_path}
        url={session.lecture_pdf_url}
        onUploaded={(s) => setSession((prev) => (prev ? { ...prev, ...s } : prev))}
      />
      <SessionFileBlock
        sessionId={session.id}
        type="stt_txt"
        emoji="📝"
        path={session.stt_path}
        url={session.stt_url}
        onUploaded={(s) => setSession((prev) => (prev ? { ...prev, ...s } : prev))}
      />

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">🧠 이 수업으로 학습</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Link
            href={`/courses/${courseId}/summary`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            📝 정리본
          </Link>
          <Link
            href={`/courses/${courseId}/questions`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            🧩 문제풀이
          </Link>
          <Link
            href={`/courses/${courseId}/tutor`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            👩🏻‍🏫 과외
          </Link>
        </div>
      </section>

      {dialog === "edit" && (
        <SessionFormDialog
          open
          title="수업 편집"
          submitLabel="저장"
          initial={{
            date: session.date,
            period: session.period,
            professor: session.professor ?? "",
            part_name: session.part_name ?? "",
          }}
          onSubmit={handleEdit}
          onClose={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={dialog === "delete"}
        title="수업 삭제"
        message={`이 수업(${formatDateLabel(session.date)} · ${session.period}교시)과 업로드된 강의록/STT가 삭제됩니다.\n정말 삭제하시겠습니까?${actionError ? `\n\n${actionError}` : ""}`}
        confirmLabel="삭제"
        danger
        submitting={actionSubmitting}
        onConfirm={handleDelete}
        onCancel={() => {
          setActionError(null);
          setDialog(null);
        }}
      />
    </div>
  );
}

function SessionFileBlock({
  sessionId,
  type,
  emoji,
  path,
  url,
  onUploaded,
}: {
  sessionId: string;
  type: SessionFileType;
  emoji: string;
  path: string | null;
  url: string | null;
  onUploaded: (session: Partial<SessionWithUrls>) => void;
}) {
  const config = SESSION_FILE_CONFIG[type];
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const initRes = await fetch(`/api/lecture-sessions/${sessionId}/files/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const initBody = await initRes.json();
      if (!initRes.ok) throw new Error(initBody.error ?? "업로드 준비에 실패했습니다.");

      const { error: uploadError } = await uploadFileDirect(
        initBody.bucket,
        initBody.path,
        initBody.token,
        file,
        initBody.contentType,
      );
      if (uploadError) throw new Error(uploadError.message ?? "업로드에 실패했습니다.");

      const completeRes = await fetch(`/api/lecture-sessions/${sessionId}/files/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const completeBody = await completeRes.json();
      if (!completeRes.ok) throw new Error(completeBody.error ?? "업로드 마무리에 실패했습니다.");

      const urlKey = type === "lecture_pdf" ? "lecture_pdf_url" : "stt_url";
      onUploaded({ ...completeBody.session, [urlKey]: completeBody.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lecture-sessions/${sessionId}/files?type=${type}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      onUploaded(body.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {emoji} {config.label}
        </h2>

        {path ? (
          <div className="flex items-center gap-3 text-sm">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-zinc-600 underline dark:text-zinc-300">
                미리보기
              </a>
            ) : (
              <span className="text-zinc-400">업로드됨</span>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="text-zinc-600 hover:underline disabled:opacity-50 dark:text-zinc-400"
            >
              교체
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleDelete}
              className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
            >
              삭제
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={type === "lecture_pdf" ? "application/pdf" : ".txt,text/plain"}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </section>
  );
}
