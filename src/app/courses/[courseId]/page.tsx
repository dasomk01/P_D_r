"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Course } from "@/lib/courses";
import { CourseFormDialog, type CourseFormValues } from "@/components/course-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { StudyMaterialSection } from "@/components/study-material-section";
import { LectureSessionsSection } from "@/components/lecture-sessions-section";

type DialogState = "edit" | "archive" | "restore" | "delete" | null;

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/courses/${courseId}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "강의 정보를 불러오지 못했습니다.");
        return body as { course: Course };
      })
      .then((body) => {
        setCourse(body.course);
        setLoadError(null);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "강의 정보를 불러오지 못했습니다.");
      });
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleEdit(values: CourseFormValues) {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
    setDialog(null);
    load();
  }

  async function handleSetStatus(status: "active" | "archived") {
    setActionSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "처리에 실패했습니다.");
      setDialog(null);
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "처리에 실패했습니다.");
    } finally {
      setActionSubmitting(false);
    }
  }

  async function handleDelete() {
    setActionSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      router.push("/");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setActionSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 강의 목록
        </Link>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {loadError}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-12">
        <p className="text-sm text-zinc-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">
          ← 강의 목록
        </Link>

        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              📚 {course.name}
              {course.status === "archived" && (
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  보관됨
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {course.subject}
              {course.professor ? ` · ${course.professor}` : ""}
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
            {course.status === "active" ? (
              <button
                type="button"
                onClick={() => setDialog("archive")}
                className="rounded-full border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                📦 보관
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDialog("restore")}
                className="rounded-full border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ↩️ 복원
              </button>
            )}
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

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">📖 학습지</h2>
        <StudyMaterialSection courseId={course.id} />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">📅 수업 기록</h2>
        <LectureSessionsSection courseId={course.id} />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">🧠 학습</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Link
            href={`/courses/${course.id}/summary`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            📝 정리본
          </Link>
          <Link
            href={`/courses/${course.id}/questions`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            🧩 문제풀이
          </Link>
          <Link
            href={`/courses/${course.id}/tutor`}
            className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            👩🏻‍🏫 과외
          </Link>
        </div>
      </section>

      {dialog === "edit" && (
        <CourseFormDialog
          open
          title="강의 편집"
          submitLabel="저장"
          initial={{ name: course.name, subject: course.subject, professor: course.professor ?? "" }}
          onSubmit={handleEdit}
          onClose={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={dialog === "archive"}
        title="강의 보관"
        message={`"${course.name}"을(를) 보관할까요?\n보관된 강의는 진행 중인 목록에서 숨겨지지만 자료는 그대로 유지되고, 언제든 다시 열어볼 수 있습니다.`}
        confirmLabel="보관"
        submitting={actionSubmitting}
        onConfirm={() => handleSetStatus("archived")}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "restore"}
        title="강의 복원"
        message={`"${course.name}"을(를) 진행 중인 강의로 복원할까요?`}
        confirmLabel="복원"
        submitting={actionSubmitting}
        onConfirm={() => handleSetStatus("active")}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        title="강의 영구 삭제"
        message={`"${course.name}"의 학습지, 수업 기록, 정리본, 문제 및 오답노트 등이 함께 삭제될 수 있습니다.\n정말 삭제하시겠습니까?${actionError ? `\n\n${actionError}` : ""}`}
        confirmLabel="영구 삭제"
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
