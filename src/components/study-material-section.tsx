"use client";

import { useEffect, useRef, useState } from "react";
import { STUDY_MATERIAL_BUCKET, type StudyMaterial, type StudyMaterialMapping } from "@/lib/study-materials";
import { createClient } from "@/lib/supabase/client";
import { MappingRow, type MappingFormValues } from "@/components/mapping-row";

export function StudyMaterialSection({ courseId }: { courseId: string }) {
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [mappings, setMappings] = useState<StudyMaterialMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/study-material`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "학습지 정보를 불러오지 못했습니다.");
        return body as { material: StudyMaterial | null; mappings: StudyMaterialMapping[] };
      })
      .then((body) => {
        setMaterial(body.material);
        setMappings(body.mappings);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "학습지 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    setNote(null);
    try {
      // Step 1: ask our server for a place to upload — this request carries
      // no file bytes, so it's unaffected by Vercel's ~4.5MB function body
      // limit that broke large (e.g. 800-page) PDFs going through the API.
      const initRes = await fetch(`/api/courses/${courseId}/study-material/init`, { method: "POST" });
      const initBody = await initRes.json();
      if (!initRes.ok) throw new Error(initBody.error ?? "업로드 준비에 실패했습니다.");

      // Step 2: upload the file straight from the browser to Supabase
      // Storage using the signed URL — never passes through our server.
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(STUDY_MATERIAL_BUCKET)
        .uploadToSignedUrl(initBody.path, initBody.token, file, { contentType: "application/pdf" });
      if (uploadError) throw new Error(uploadError.message ?? "업로드에 실패했습니다.");

      // Step 3: tell our server the upload finished so it can activate the
      // new version and (if an AI key is configured) analyze it.
      const completeRes = await fetch(`/api/courses/${courseId}/study-material/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyMaterialId: initBody.studyMaterialId }),
      });
      const body = await completeRes.json();
      if (!completeRes.ok) throw new Error(body.error ?? "업로드 마무리에 실패했습니다.");

      setMaterial(body.material as StudyMaterial);
      setMappings((body.mappings ?? []) as StudyMaterialMapping[]);

      if (body.aiSkipped) {
        setNote("AI 키가 설정되지 않아 자동 분석은 건너뛰었습니다. 아래에서 파트를 직접 추가해주세요.");
      } else if (!body.aiAnalyzed) {
        setNote("AI가 목차 구조를 인식하지 못했습니다. 아래에서 파트를 직접 추가해주세요.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMaterial() {
    if (!material) return;
    setUploading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/study-material`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "삭제에 실패했습니다.");
      setMaterial(null);
      setMappings([]);
      setNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveMapping(values: MappingFormValues, existing?: StudyMaterialMapping) {
    const payload = {
      study_material_id: material?.id,
      part_name: values.part_name,
      professor: values.professor,
      page_start: values.page_start,
      page_end: values.page_end,
      problem_start: values.problem_start,
      problem_end: values.problem_end,
    };

    if (existing) {
      const res = await fetch(`/api/study-material-mappings/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
      setMappings((prev) => prev.map((m) => (m.id === existing.id ? body.mapping : m)));
    } else {
      const res = await fetch("/api/study-material-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "저장에 실패했습니다.");
      setMappings((prev) => [...prev, body.mapping]);
      setAddingRow(false);
    }
  }

  async function handleDeleteMapping(mapping: StudyMaterialMapping) {
    const res = await fetch(`/api/study-material-mappings/${mapping.id}`, { method: "DELETE" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "삭제에 실패했습니다.");
      return;
    }
    setMappings((prev) => prev.filter((m) => m.id !== mapping.id));
  }

  async function handleToggleConfirmed(mapping: StudyMaterialMapping, confirmed: boolean) {
    const res = await fetch(`/api/study-material-mappings/${mapping.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "저장에 실패했습니다.");
      return;
    }
    setMappings((prev) => prev.map((m) => (m.id === mapping.id ? body.mapping : m)));
  }

  if (loading) {
    return <p className="text-sm text-zinc-400 dark:text-zinc-600">불러오는 중...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {note && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {note}
        </p>
      )}

      {material ? (
        <div className="flex items-center justify-between text-sm">
          <a
            href={material.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 underline dark:text-zinc-300"
          >
            학습지 PDF 보기 (v{material.version})
          </a>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="text-zinc-600 hover:underline disabled:opacity-50 dark:text-zinc-400"
            >
              {uploading ? "처리 중..." : "교체"}
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleDeleteMaterial}
              className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="self-start rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {uploading ? "업로드 중... (AI 분석에 시간이 걸릴 수 있어요)" : "학습지 업로드"}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      {material && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-400 dark:border-zinc-800">
                <th className="p-3 font-medium">파트</th>
                <th className="p-3 font-medium">교수</th>
                <th className="p-3 font-medium">페이지</th>
                <th className="p-3 font-medium">문제#</th>
                <th className="p-3 font-medium">검수</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <MappingRow
                  key={mapping.id}
                  mapping={mapping}
                  onSave={(values) => handleSaveMapping(values, mapping)}
                  onDelete={() => handleDeleteMapping(mapping)}
                  onToggleConfirmed={(confirmed) => handleToggleConfirmed(mapping, confirmed)}
                />
              ))}
              {addingRow && (
                <MappingRow
                  startEditing
                  onSave={(values) => handleSaveMapping(values)}
                  onCancelNew={() => setAddingRow(false)}
                />
              )}
            </tbody>
          </table>
          {!addingRow && (
            <button
              type="button"
              onClick={() => setAddingRow(true)}
              className="mt-2 text-sm text-zinc-500 hover:underline dark:text-zinc-400"
            >
              ＋ 파트 추가
            </button>
          )}
          {mappings.length === 0 && !addingRow && (
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600">
              아직 목차 구간이 없습니다. 위에서 직접 추가할 수 있어요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
