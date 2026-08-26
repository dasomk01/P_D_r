import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import type { LectureSession } from "@/lib/lecture-sessions";
import { generateSummaryRound } from "@/lib/ai/generate-summary";
import { renderAndUploadSummary } from "./generate-and-store";
import { individualSummaryPath, combinedSummaryPath } from "./storage";

// Vercel Hobby caps one function invocation (including background after()
// work) at ~60s, so a full v3.6-style summary is built one bounded round at
// a time across many separate invocations, chained by each round firing an
// HTTP call to the next before it exits. MAX_ROUNDS is a safety ceiling on
// total cost/latency if Claude somehow never reaches a natural stop.
const MAX_ROUNDS = 20;
const INTERNAL_ROUND_PATH = "/api/internal/summary-round";

export type SummaryKind = "individual" | "combined";

interface RoundContext {
  table: "summaries" | "combined_summaries";
  sessions: LectureSession[];
  subject: string;
  buildPaths: (id: string) => { docxPath: string; pdfPath: string };
  title: string;
}

async function loadContext(
  supabase: ReturnType<typeof createServiceClient>,
  kind: SummaryKind,
  id: string,
): Promise<RoundContext | null> {
  if (kind === "individual") {
    const { data: row } = await supabase.from("summaries").select("lecture_session_id, course_id").eq("id", id).maybeSingle();
    if (!row) return null;

    const { data: session } = await supabase.from("lecture_sessions").select("*").eq("id", row.lecture_session_id).maybeSingle();
    const { data: course } = await supabase.from("courses").select("subject").eq("id", row.course_id).maybeSingle();
    if (!session || !course) return null;

    return {
      table: "summaries",
      sessions: [session],
      subject: course.subject,
      buildPaths: (summaryId) => ({
        docxPath: individualSummaryPath(row.course_id, summaryId, "docx"),
        pdfPath: individualSummaryPath(row.course_id, summaryId, "pdf"),
      }),
      title: `${course.subject}_솜리본`,
    };
  }

  const { data: row } = await supabase.from("combined_summaries").select("course_id").eq("id", id).maybeSingle();
  if (!row) return null;

  const { data: links } = await supabase.from("combined_summary_sessions").select("lecture_session_id").eq("combined_summary_id", id);
  const sessionIds = (links ?? []).map((l) => l.lecture_session_id);
  if (sessionIds.length === 0) return null;

  const { data: sessions } = await supabase.from("lecture_sessions").select("*").in("id", sessionIds);
  const { data: course } = await supabase.from("courses").select("subject").eq("id", row.course_id).maybeSingle();
  if (!sessions || sessions.length === 0 || !course) return null;

  return {
    table: "combined_summaries",
    sessions,
    subject: course.subject,
    buildPaths: (combinedId) => ({
      docxPath: combinedSummaryPath(row.course_id, combinedId, "docx"),
      pdfPath: combinedSummaryPath(row.course_id, combinedId, "pdf"),
    }),
    title: `${course.subject}_통합솜리본`,
  };
}

/**
 * Runs one bounded round of generation for the given summary/combined-summary
 * row. If Claude hasn't actually finished (and MAX_ROUNDS hasn't been hit),
 * persists the accumulated text and fires an HTTP call to this same logic
 * running in a fresh invocation — see docs/README for why a fresh HTTP call
 * (not an in-process loop) is required to escape the per-invocation time cap.
 * If the row was deleted or already left "generating" (finished/failed by
 * another path), this is a silent no-op.
 */
export async function runSummaryRound(kind: SummaryKind, id: string, baseUrl: string): Promise<void> {
  const supabase = createServiceClient();
  const table = kind === "individual" ? "summaries" : "combined_summaries";

  const { data: row } = await supabase.from(table).select("content, round, status").eq("id", id).maybeSingle();
  if (!row || row.status !== "generating") return;

  const context = await loadContext(supabase, kind, id);
  if (!context) {
    await supabase.from(table).update({ status: "error", error_message: "정리본 대상 수업/강의를 찾을 수 없습니다." }).eq("id", id);
    return;
  }

  const priorText = row.content ?? "";
  const currentRound = row.round ?? 0;

  let result;
  try {
    result = await generateSummaryRound(supabase, context.sessions, { subject: context.subject, combined: kind === "combined" }, priorText);
  } catch (err) {
    const message = err instanceof Error ? err.message : "정리본 생성에 실패했습니다.";
    await supabase.from(table).update({ status: "error", error_message: message }).eq("id", id);
    return;
  }

  const newText = priorText + result.chunkText;
  const newRound = currentRound + 1;

  if (result.done || newRound >= MAX_ROUNDS) {
    try {
      const { docxPath, pdfPath } = context.buildPaths(id);
      await renderAndUploadSummary(supabase, newText, context.title, docxPath, pdfPath);
      await supabase.from(table).update({ content: newText, docx_path: docxPath, pdf_path: pdfPath, round: newRound, status: "done" }).eq("id", id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Word/PDF 생성에 실패했습니다.";
      await supabase.from(table).update({ content: newText, round: newRound, status: "error", error_message: message }).eq("id", id);
    }
    return;
  }

  await supabase.from(table).update({ content: newText, round: newRound }).eq("id", id);

  // Fire the next round as a genuinely separate invocation — awaiting only
  // its fast 202 ack (its own after() carries the real work), so this
  // invocation can exit well within the time limit. A silently-lost hop
  // here previously left rows stuck at "generating" forever with no
  // visible error — a fetch() promise only rejects on network failure, it
  // resolves normally even for a 401/500 response, so the status must be
  // checked explicitly, not just whether the call threw.
  let chainOk = false;
  let chainDetail = "";
  try {
    const chainRes = await fetch(`${baseUrl}${INTERNAL_ROUND_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id }),
    });
    chainOk = chainRes.ok;
    if (!chainOk) chainDetail = `HTTP ${chainRes.status}`;
  } catch (err) {
    chainDetail = err instanceof Error ? err.message : "네트워크 오류";
  }

  if (!chainOk) {
    await supabase
      .from(table)
      .update({ status: "error", error_message: `다음 라운드 호출에 실패했습니다 (${chainDetail}).` })
      .eq("id", id);
  }
}
