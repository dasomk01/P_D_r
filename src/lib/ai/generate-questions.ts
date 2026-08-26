import "server-only";

import { GoogleGenerativeAI, type Content, type Part } from "@google/generative-ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LectureSession } from "@/lib/lecture-sessions";
import { gatherAllSessionMaterials, sessionLabel } from "./session-materials";
import { QUESTION_PROMPT } from "./question-prompt";

export interface QuestionRoundResult {
  /** Text produced in this round only — caller appends it to prior rounds' text. */
  chunkText: string;
  /** True if Gemini actually finished (not just this round's budget). */
  done: boolean;
}

// Same reasoning as generate-summary.ts's ROUND_WALL_CLOCK_BUDGET_MS: bound
// by elapsed time (not just token count), since throughput isn't guaranteed
// and this runs inside a Vercel function with a hard duration cap. 티야
// specifically has no count limit by design, so a single lecture can need
// several rounds — see src/lib/questions/run-round.ts for the chain.
const ROUND_WALL_CLOCK_BUDGET_MS = 40_000;
const ROUND_MAX_TOKENS = 16_000;

function buildParts(materials: Awaited<ReturnType<typeof gatherAllSessionMaterials>>): Part[] {
  const parts: Part[] = [];
  let truncated = false;

  for (const m of materials) {
    parts.push({ text: `--- 수업: ${sessionLabel(m.session)} ---` });

    if (m.lecturePdf) {
      parts.push({ inlineData: { mimeType: "application/pdf", data: m.lecturePdf.toString("base64") } });
    } else {
      truncated = true;
    }

    if (m.sttText) {
      parts.push({ text: `[STT 텍스트]\n${m.sttText}` });
    }

    if (m.worksheetExcerpt) {
      const range = m.worksheetMapping
        ? ` (문제 번호 ${m.worksheetMapping.problem_start ?? "?"}~${m.worksheetMapping.problem_end ?? "?"} 부근)`
        : "";
      parts.push({ text: `[학습지 발췌 — 이 파트의 기출문제집${range}. 여기서 야마(기출 문제)를 식별하세요.]` });
      parts.push({ inlineData: { mimeType: "application/pdf", data: m.worksheetExcerpt.toString("base64") } });
    }
  }

  if (truncated) {
    parts.push({ text: "(참고: 자료 분량이 많아 일부 강의록 페이지가 생략되었습니다. 생략된 부분은 STT로 보완하세요.)" });
  }

  return parts;
}

/**
 * Runs ONE bounded round of question-set generation against the fixed
 * category prompt and the gathered source materials for one or more
 * lecture sessions. Streams internally and force-stops at
 * ROUND_WALL_CLOCK_BUDGET_MS regardless of whether Gemini was mid-question —
 * the caller treats `done: false` as "needs another round" and resends
 * `priorText` next time (see src/lib/questions/parse.ts — an incomplete
 * trailing [Q] block is simply dropped and re-requested, never emitted).
 */
export async function generateQuestionsRound(
  supabase: SupabaseClient,
  sessions: LectureSession[],
  priorText: string,
): Promise<QuestionRoundResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }
  if (sessions.length === 0) {
    throw new Error("문제를 생성할 수업이 없습니다.");
  }

  const materials = await gatherAllSessionMaterials(supabase, sessions);
  if (materials.every((m) => !m.lecturePdf && !m.sttText)) {
    throw new Error("강의록 또는 STT가 하나도 업로드되지 않았습니다. 먼저 자료를 업로드하세요.");
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: "gemini-2.5-pro", systemInstruction: QUESTION_PROMPT });

  const contents: Content[] = [{ role: "user", parts: buildParts(materials) }];
  if (priorText) {
    contents.push(
      { role: "model", parts: [{ text: priorText }] },
      {
        role: "user",
        parts: [
          {
            text: "계속 이어서 작성하세요. 이미 완성한 [Q]...[/Q] 문제는 다시 만들지 말고, 마지막으로 완성된 문제 다음부터 이어서 작성하세요. 아직 안 만든 카테고리(및 티야의 남은 항목)를 끝까지 완성하세요.",
          },
        ],
      },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ROUND_WALL_CLOCK_BUDGET_MS);

  let chunkText = "";
  let done = false;
  try {
    const result = await model.generateContentStream(
      { contents, generationConfig: { maxOutputTokens: ROUND_MAX_TOKENS } },
      { signal: controller.signal },
    );
    for await (const chunk of result.stream) {
      chunkText += chunk.text();
    }
    const final = await result.response;
    done = final.candidates?.[0]?.finishReason !== "MAX_TOKENS";
  } catch (err) {
    if (!controller.signal.aborted) throw err;
    // Our own wall-clock budget fired mid-stream — `chunkText` already has
    // whatever text arrived before the abort.
  } finally {
    clearTimeout(timer);
  }

  return { chunkText, done };
}
