import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { STUDY_MATERIAL_BUCKET } from "@/lib/study-materials";
import { SESSION_FILE_CONFIG, type LectureSession } from "@/lib/lecture-sessions";
import { extractPdfPageRange, getPdfPageCount } from "@/lib/pdf-utils";
import { SUMMARY_PROMPT_ADAPTER_NOTE, SUMMARY_PROMPT_V3_6 } from "./summary-prompt";

// Stay safely under Claude's 100-page-per-request PDF limit, shared across
// every document (lecture PDFs + worksheet excerpts) in one call — a
// combined summary can pull in several sessions at once.
const TOTAL_PAGE_BUDGET = 90;

interface SessionMaterial {
  session: Pick<LectureSession, "id" | "date" | "period" | "professor" | "part_name">;
  lecturePdf?: Buffer;
  sttText?: string;
  worksheetExcerpt?: Buffer;
}

async function gatherSessionMaterial(
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
        .select("page_start, page_end")
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
              pageBudget.remaining -= pagesToUse;
            } catch {
              // malformed page range on the mapping — skip the excerpt, summary still works without it
            }
          }
        }
      }
    }
  }

  return material;
}

function sessionLabel(session: SessionMaterial["session"]): string {
  const parts = [`${session.date} ${session.period}교시`];
  if (session.professor) parts.push(session.professor);
  if (session.part_name) parts.push(session.part_name);
  return parts.join(" · ");
}

function buildContentBlocks(materials: SessionMaterial[]) {
  const blocks: Array<
    | { type: "text"; text: string }
    | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string }; title: string }
  > = [];

  let truncated = false;

  for (const m of materials) {
    blocks.push({ type: "text", text: `--- 수업: ${sessionLabel(m.session)} ---` });

    if (m.lecturePdf) {
      blocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: m.lecturePdf.toString("base64") },
        title: "강의록",
      });
    } else {
      truncated = true;
    }

    if (m.sttText) {
      blocks.push({ type: "text", text: `[STT 텍스트]\n${m.sttText}` });
    }

    if (m.worksheetExcerpt) {
      blocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: m.worksheetExcerpt.toString("base64") },
        title: "학습지 관련 부분",
      });
    }
  }

  if (truncated) {
    blocks.push({
      type: "text",
      text: "(참고: 자료 분량이 많아 일부 강의록 페이지가 생략되었습니다. 생략된 부분은 STT로 보완하세요.)",
    });
  }

  return blocks;
}

export interface GenerateSummaryOptions {
  subject: string;
  combined: boolean;
}

/**
 * Calls Claude with the v3.6 prompt and the gathered source materials for
 * one or more lecture sessions, returning the tagged plain text it produces
 * (see src/lib/summary/parse.ts for the tag grammar).
 */
export async function generateSummaryText(
  supabase: SupabaseClient,
  sessions: LectureSession[],
  options: GenerateSummaryOptions,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY가 설정되지 않았습니다.");
  }
  if (sessions.length === 0) {
    throw new Error("정리본을 생성할 수업이 없습니다.");
  }

  const pageBudget = { remaining: TOTAL_PAGE_BUDGET };
  const materials: SessionMaterial[] = [];
  for (const session of sessions) {
    materials.push(await gatherSessionMaterial(supabase, session, pageBudget));
  }

  if (materials.every((m) => !m.lecturePdf && !m.sttText)) {
    throw new Error("강의록 또는 STT가 하나도 업로드되지 않았습니다. 먼저 자료를 업로드하세요.");
  }

  const directive = options.combined
    ? `위는 ${materials.length}개 수업 세션의 원본 자료입니다. 이 자료들을 하나로 통합한 정리본을 생성하세요. 과목: ${options.subject}.`
    : `위는 한 수업의 원본 자료입니다. 이 자료를 바탕으로 정리본을 생성하세요. 과목: ${options.subject}.`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8192,
    system: `${SUMMARY_PROMPT_ADAPTER_NOTE}\n\n${SUMMARY_PROMPT_V3_6}`,
    messages: [
      {
        role: "user",
        content: [...buildContentBlocks(materials), { type: "text", text: directive }],
      },
    ],
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}
