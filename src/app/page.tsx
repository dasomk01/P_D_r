"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/courses";
import { CourseCard } from "@/components/course-card";
import { CourseFormDialog, type CourseFormValues } from "@/components/course-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";

type DialogState =
  | { type: "add" }
  | { type: "edit"; course: Course }
  | { type: "archive"; course: Course }
  | { type: "restore"; course: Course }
  | { type: "delete"; course: Course }
  | null;

export default function Home() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/courses")
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "강의 목록을 불러오지 못했습니다.");
        return body as { courses: Course[] };
      })
      .then((body) => {
        setCourses(body.courses);
        setError(null);
      })
      .catch((err) => {
        setCourses([]);
        setError(err instanceof Error ? err.message : "강의 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCourses = (courses ?? []).filter((c) => c.status === "active");
  const archivedCourses = (courses ?? []).filter((c) => c.status === "archived");

  async function handleCreate(values: CourseFormValues) {
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
    setDialog(null);
    load();
  }

  async function handleEdit(values: CourseFormValues, course: Course) {
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
    setDialog(null);
    load();
  }

  async function handleSetStatus(course: Course, status: "active" | "archived") {
    setActionSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
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

  async function handleDelete(course: Course) {
    setActionSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      setDialog(null);
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setActionSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="relative text-center">
        <Link
          href="/calendar"
          className="absolute right-0 top-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          📅 달력 보기
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          📚 현재 진행 중인 강의
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          강의를 열면 학습지 · 수업 기록과 정리본 · 문제풀이 · 과외에 접근할 수 있습니다.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {error}
        </p>
      )}

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpen={(c) => router.push(`/courses/${c.id}`)}
              onEdit={(c) => setDialog({ type: "edit", course: c })}
              onArchive={(c) => setDialog({ type: "archive", course: c })}
              onDelete={(c) => setDialog({ type: "delete", course: c })}
            />
          ))}

          <button
            type="button"
            onClick={() => setDialog({ type: "add" })}
            className="flex min-h-[7.5rem] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-zinc-300 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
          >
            <span className="text-2xl">＋</span>
            <span className="text-sm font-medium">강의 추가</span>
          </button>
        </div>
        {courses !== null && activeCourses.length === 0 && (
          <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-600">
            진행 중인 강의가 없습니다. 위에서 강의를 추가하세요.
          </p>
        )}
      </section>

      {archivedCourses.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            📦 보관된 강의
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {archivedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpen={(c) => router.push(`/courses/${c.id}`)}
                onEdit={(c) => setDialog({ type: "edit", course: c })}
                onRestore={(c) => setDialog({ type: "restore", course: c })}
                onDelete={(c) => setDialog({ type: "delete", course: c })}
              />
            ))}
          </div>
        </section>
      )}

      <CourseFormDialog
        open={dialog?.type === "add"}
        title="강의 추가"
        submitLabel="추가"
        onSubmit={handleCreate}
        onClose={() => setDialog(null)}
      />

      {dialog?.type === "edit" && (
        <CourseFormDialog
          open
          title="강의 편집"
          submitLabel="저장"
          initial={{
            name: dialog.course.name,
            subject: dialog.course.subject,
            professor: dialog.course.professor ?? "",
          }}
          onSubmit={(values) => handleEdit(values, dialog.course)}
          onClose={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={dialog?.type === "archive"}
        title="강의 보관"
        message={
          dialog?.type === "archive"
            ? `"${dialog.course.name}"을(를) 보관할까요?\n보관된 강의는 진행 중인 목록에서 숨겨지지만 자료는 그대로 유지되고, 언제든 다시 열어볼 수 있습니다.`
            : ""
        }
        confirmLabel="보관"
        submitting={actionSubmitting}
        onConfirm={() => dialog?.type === "archive" && handleSetStatus(dialog.course, "archived")}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "restore"}
        title="강의 복원"
        message={dialog?.type === "restore" ? `"${dialog.course.name}"을(를) 진행 중인 강의로 복원할까요?` : ""}
        confirmLabel="복원"
        submitting={actionSubmitting}
        onConfirm={() => dialog?.type === "restore" && handleSetStatus(dialog.course, "active")}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="강의 영구 삭제"
        message={
          dialog?.type === "delete"
            ? `"${dialog.course.name}"의 학습지, 수업 기록, 정리본, 문제 및 오답노트 등이 함께 삭제될 수 있습니다.\n정말 삭제하시겠습니까?${actionError ? `\n\n${actionError}` : ""}`
            : ""
        }
        confirmLabel="영구 삭제"
        danger
        submitting={actionSubmitting}
        onConfirm={() => dialog?.type === "delete" && handleDelete(dialog.course)}
        onCancel={() => {
          setActionError(null);
          setDialog(null);
        }}
      />
    </div>
  );
}
