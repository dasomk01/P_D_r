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

type ContentBlock =
  | { type: "text"; text: string; cache_control?: { type: "ephemeral" } }
  | {
      type: "document";
      source: { type: "base64"; media_type: "application/pdf"; data: string };
      title: string;
      cache_control?: { type: "ephemeral" };
    };

function buildContentBlocks(materials: SessionMaterial[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];

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

export interface SummaryRoundResult {
  /** Text produced in this round only — caller appends it to prior rounds' text. */
  chunkText: string;
  /** True if Claude actually finished the summary (not just this round's budget). */
  done: boolean;
}

// Vercel Hobby caps a single function invocation (including background
// after() work) at ~60s total. A full v3.6-style summary (본문 + 마인드맵 +
// 출제경향 + 총평) routinely needs several times that much generation time,
// so one round can never be the whole summary — see src/lib/summary/run-round.ts
// for the chain that calls this repeatedly across separate invocations,
// persisting accumulated text in the DB between rounds.
//
// ROUND_WALL_CLOCK_BUDGET_MS bounds this round's own Claude call by elapsed
// time (not just token count) — generation throughput isn't guaranteed, so a
// token cap alone could still blow through the invocation's time limit.
// ROUND_MAX_TOKENS is set high enough that the wall-clock timer is always
// what actually ends a round, not the token count — a low token cap here
// just cuts a round short before its time budget is used, forcing more
// rounds (and more redundant material re-gathering) than necessary.
const ROUND_WALL_CLOCK_BUDGET_MS = 40_000;
const ROUND_MAX_TOKENS = 16_000;

/**
 * Runs ONE bounded round of summary generation against the v3.6 prompt and
 * the gathered source materials for one or more lecture sessions. Streams
 * internally and force-stops at ROUND_WALL_CLOCK_BUDGET_MS regardless of
 * whether Claude was still mid-sentence — the caller treats `done: false`
 * as "needs another round" and resends `priorText` next time.
 */
export async function generateSummaryRound(
  supabase: SupabaseClient,
  sessions: LectureSession[],
  options: GenerateSummaryOptions,
  priorText: string,
): Promise<SummaryRoundResult> {
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

  const contentBlocks = buildContentBlocks(materials);
  // Cache the (large, unchanging) source documents so every later round —
  // each a fresh invocation that re-gathers and resends the same materials —
  // only pays full price once; subsequent rounds mostly hit the cache.
  const lastBlock = contentBlocks[contentBlocks.length - 1];
  if (lastBlock) lastBlock.cache_control = { type: "ephemeral" };

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: [...contentBlocks, { type: "text", text: directive }] },
  ];
  if (priorText) {
    messages.push(
      { role: "assistant", content: priorText },
      {
        role: "user",
        content:
          "계속 이어서 작성하세요. 처음부터 다시 쓰지 말고 방금 멈춘 지점 바로 다음부터 자연스럽게 이어가세요. 아직 못 쓴 본문/계층적 마인드맵/출제경향/총평을 끝까지 완성하세요.",
      },
    );
  }

  // The system prompt (adapter note + full v3.6 text) is identical across
  // every summary generation call the app ever makes — cache it so repeat
  // use within the TTL skips reprocessing it.
  const system: Anthropic.MessageCreateParams["system"] = [
    { type: "text", text: `${SUMMARY_PROMPT_ADAPTER_NOTE}\n\n${SUMMARY_PROMPT_V3_6}`, cache_control: { type: "ephemeral" } },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ROUND_WALL_CLOCK_BUDGET_MS);

  let chunkText = "";
  let done = false;
  try {
    const stream = client.messages.stream({ model: "claude-sonnet-5", max_tokens: ROUND_MAX_TOKENS, system, messages }, {
      signal: controller.signal,
    });
    stream.on("text", (delta) => {
      chunkText += delta;
    });
    const response = await stream.finalMessage();
    done = response.stop_reason !== "max_tokens";
  } catch (err) {
    if (!controller.signal.aborted) throw err;
    // Our own wall-clock budget fired mid-stream — `chunkText` already has
    // whatever text arrived before the abort via the "text" listener above.
  } finally {
    clearTimeout(timer);
  }

  return { chunkText, done };
}
