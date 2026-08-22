"use client";

import { useEffect, useRef, useState } from "react";
import type { Course } from "@/lib/courses";

interface CourseCardProps {
  course: Course;
  onOpen: (course: Course) => void;
  onEdit: (course: Course) => void;
  onArchive?: (course: Course) => void;
  onRestore?: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CourseCard({ course, onOpen, onEdit, onArchive, onRestore, onDelete }: CourseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{course.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {course.subject}
            {course.professor ? ` · ${course.professor}` : ""}
          </p>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full px-2 py-1 text-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(course);
                }}
                className="block w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ✏️ 편집
              </button>
              {course.status === "active" && onArchive && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onArchive(course);
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  📦 보관
                </button>
              )}
              {course.status === "archived" && onRestore && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRestore(course);
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  ↩️ 복원
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(course);
                }}
                className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                🗑 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(course)}
        className="mt-2 self-start rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        열기
      </button>
    </div>
  );
}
