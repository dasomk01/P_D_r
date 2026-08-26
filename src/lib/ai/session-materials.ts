import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { STUDY_MATERIAL_BUCKET } from "@/lib/study-materials";
import { SESSION_FILE_CONFIG, type LectureSession } from "@/lib/lecture-sessions";
import { extractPdfPageRange, getPdfPageCount } from "@/lib/pdf-utils";

// Stay safely under a conservative per-request PDF page budget, shared
// across every document (lecture PDFs + worksheet excerpts) in one call —
// used by both the Claude (summary) and Gemini (question) pipelines since
// neither vendor's exact document-input ceiling is worth gambling on.
export const TOTAL_PAGE_BUDGET = 90;

export interface SessionMaterial {
  session: Pick<LectureSession, "id" | "date" | "period" | "professor" | "part_name">;
  lecturePdf?: Buffer;
  sttText?: string;
  worksheetExcerpt?: Buffer;
  /** page_start/page_end of the worksheet excerpt actually fetched, if any — lets callers reason about problem-number ranges via study_material_mappings. */
  worksheetMapping?: { page_start: number; page_end: number; problem_start: number | null; problem_end: number | null };
}

/** Downloads and page-budgets a lecture session's source materials (강의록 PDF, STT, matching 학습지 발췌). */
export async function gatherSessionMaterial(
  supabase: SupabaseClient,
  session: LectureSession,
  pageBudget: { remaining: number },
): Promise<SessionMaterial> {
  const material: SessionMaterial = { session };

  if (session.lecture_pdf_path && pageBudget.remaining > 0) {
    const { data } = await supabase.storage
      .from(SESSION_FILE_CONFIG.lecture_pdf.bucket)
      .download(session.lecture_pdf_path);
    if (data) {
      const buf = Buffer.from(await data.arrayBuffer());
      const pageCount = await getPdfPageCount(buf).catch(() => 0);
      if (pageCount > pageBudget.remaining) {
        material.lecturePdf = await extractPdfPageRange(buf, 1, pageBudget.remaining);
        pageBudget.remaining = 0;
      } else {
        material.lecturePdf = buf;
        pageBudget.remaining -= pageCount;
      }
    }
  }

  if (session.stt_path) {
    const { data } = await supabase.storage.from(SESSION_FILE_CONFIG.stt_txt.bucket).download(session.stt_path);
    if (data) material.sttText = await data.text();
  }

  if (session.part_name && pageBudget.remaining > 0) {
    const { data: activeMaterial } = await supabase
      .from("study_materials")
      .select("id, storage_path")
      .eq("course_id", session.course_id)
      .eq("is_active", true)
      .maybeSingle();

    if (activeMaterial) {
      const { data: mapping } = await supabase
        .from("study_material_mappings")
        .select("page_start, page_end, problem_start, problem_end")
        .eq("study_material_id", activeMaterial.id)
        .ilike("part_name", session.part_name)
        .maybeSingle();

      if (mapping?.page_start != null && mapping?.page_end != null) {
        const { data: fileData } = await supabase.storage
          .from(STUDY_MATERIAL_BUCKET)
          .download(activeMaterial.storage_path);
        if (fileData) {
          const buf = Buffer.from(await fileData.arrayBuffer());
          const rangePages = mapping.page_end - mapping.page_start + 1;
          const pagesToUse = Math.min(rangePages, pageBudget.remaining);
          if (pagesToUse > 0) {
            try {
              material.worksheetExcerpt = await extractPdfPageRange(
                buf,
                mapping.page_start,
                mapping.page_start + pagesToUse - 1,
              );
              material.worksheetMapping = {
                page_start: mapping.page_start,
                page_end: mapping.page_start + pagesToUse - 1,
                problem_start: mapping.problem_start,
                problem_end: mapping.problem_end,
              };
              pageBudget.remaining -= pagesToUse;
            } catch {
              // malformed page range on the mapping — skip the excerpt, generation still works without it
            }
          }
        }
      }
    }
  }

  return material;
}

export function sessionLabel(session: SessionMaterial["session"]): string {
  const parts = [`${session.date} ${session.period}교시`];
  if (session.professor) parts.push(session.professor);
  if (session.part_name) parts.push(session.part_name);
  return parts.join(" · ");
}

export async function gatherAllSessionMaterials(
  supabase: SupabaseClient,
  sessions: LectureSession[],
): Promise<SessionMaterial[]> {
  const pageBudget = { remaining: TOTAL_PAGE_BUDGET };
  const materials: SessionMaterial[] = [];
  for (const session of sessions) {
    materials.push(await gatherSessionMaterial(supabase, session, pageBudget));
  }
  return materials;
}
