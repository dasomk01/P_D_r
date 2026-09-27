import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { generateQuestionsRound } from "@/lib/ai/generate-questions";
import { parseQuestionsText } from "./parse";

// Same reasoning as src/lib/summary/run-round.ts: Vercel caps one function
// invocation at ~60s and blocks a server calling back into its own
// deployment (508 Loop Detected), so rounds are driven by the browser
// (see /api/question-round and the questions hub page's tick loop), not
// chained server-side. MAX_ROUNDS is a safety ceiling — 티야's "no count
// limit" rule means a dense lecture could legitimately need many rounds.
const MAX_ROUNDS = 30;

/**
 * Runs exactly one bounded round of question generation for the given
 * batch, then returns — it does not chain to the next round itself. On the
 * finishing round (Gemini actually done, or MAX_ROUNDS hit), parses the
 * full accumulated text and inserts the resulting `questions` rows. If the
 * batch was deleted or already left "generating", this is a silent no-op.
 */
export async function runOneQuestionRound(batchId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: batch } = await supabase
    .from("question_batches")
    .select("course_id, status, round, content")
    .eq("id", batchId)
    .maybeSingle();
  if (!batch || batch.status !== "generating") return;

  const { data: links } = await supabase
    .from("question_batch_sessions")
    .select("lecture_session_id")
    .eq("question_batch_id", batchId);
  const sessionIds = (links ?? []).map((l) => l.lecture_session_id);
  if (sessionIds.length === 0) {
    await supabase.from("question_batches").update({ status: "error", error_message: "대상 수업이 없습니다." }).eq("id", batchId);
    return;
  }

  const { data: sessions } = await supabase.from("lecture_sessions").select("*").in("id", sessionIds);
  if (!sessions || sessions.length === 0) {
    await supabase.from("question_batches").update({ status: "error", error_message: "수업을 찾을 수 없습니다." }).eq("id", batchId);
    return;
  }

  const priorText = batch.content ?? "";
  const currentRound = batch.round ?? 0;

  let result;
  try {
    result = await generateQuestionsRound(supabase, sessions, priorText);
  } catch (err) {
    const message = err instanceof Error ? err.message : "문제 생성에 실패했습니다.";
    await supabase.from("question_batches").update({ status: "error", error_message: message }).eq("id", batchId);
    return;
  }

  const newText = priorText + result.chunkText;
  const newRound = currentRound + 1;

  if (!result.done && newRound < MAX_ROUNDS) {
    await supabase.from("question_batches").update({ content: newText, round: newRound }).eq("id", batchId);
    return;
  }

  try {
    const parsed = parseQuestionsText(newText);
    if (parsed.length === 0) {
      await supabase
        .from("question_batches")
        .update({ content: newText, round: newRound, status: "error", error_message: "생성된 문제를 하나도 읽어들이지 못했습니다." })
        .eq("id", batchId);
      return;
    }

    const rows = parsed.map((q) => {
      const answerUnparsed = q.format === "subjective" ? !q.answerText : q.answerIndex === null;
      const needsReview = q.needsReview || answerUnparsed;
      const reviewNotes = answerUnparsed
        ? [q.reviewReason, "정답 파싱 실패 — 직접 확인 필요"].filter(Boolean).join(" / ")
        : q.reviewReason;

      return {
        course_id: batch.course_id,
        category: q.category,
        content_json: {
          format: q.format,
          stem: q.stem,
          choices: q.choices,
          answerIndex: q.answerIndex ?? 0,
          answerText: q.answerText,
          explanation: q.explanation,
          sourceNote: q.sourceNote,
          outOfScope: q.outOfScope,
        },
        review_status: needsReview ? "pending" : "approved",
        review_notes: reviewNotes,
        question_batch_id: batchId,
      };
    });

    const { data: inserted, error: insertError } = await supabase.from("questions").insert(rows).select("id");
    if (insertError) throw new Error(insertError.message);

    const linkRows = (inserted ?? []).flatMap((row) =>
      sessionIds.map((lectureSessionId) => ({ question_id: row.id, lecture_session_id: lectureSessionId })),
    );
    if (linkRows.length > 0) {
      const { error: linkError } = await supabase.from("question_lecture_sessions").insert(linkRows);
      if (linkError) throw new Error(linkError.message);
    }

    await supabase.from("question_batches").update({ content: newText, round: newRound, status: "done" }).eq("id", batchId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "문제 저장에 실패했습니다.";
    await supabase.from("question_batches").update({ content: newText, round: newRound, status: "error", error_message: message }).eq("id", batchId);
  }
}
