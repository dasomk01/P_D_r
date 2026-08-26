import { isQuestionCategory, type QuestionCategory } from "../questions";

export interface ParsedQuestion {
  category: QuestionCategory;
  stem: string;
  choices: string[];
  /** 0-based index into choices, or null if the model's answer line couldn't be read. */
  answerIndex: number | null;
  explanation: string;
  sourceNote: string | null;
  outOfScope: boolean;
  needsReview: boolean;
  reviewReason: string | null;
}

const FIELD_RE = {
  category: /^카테고리\s*[:：]\s*(.*)$/,
  outOfScope: /^범위밖\s*[:：]\s*(.*)$/,
  needsReview: /^확인필요\s*[:：]\s*(.*)$/,
  reviewReason: /^확인사유\s*[:：]\s*(.*)$/,
  stem: /^문제\s*[:：]\s*(.*)$/,
  choice: /^([1-5])\)\s*(.*)$/,
  answer: /^정답\s*[:：]\s*(.*)$/,
  explanation: /^해설\s*[:：]\s*(.*)$/,
  source: /^출처\s*[:：]\s*(.*)$/,
};

function truthy(value: string): boolean {
  return /^(예|true|yes|y|참)$/i.test(value.trim());
}

type ActiveField = "stem" | "explanation" | "source" | "reviewReason" | "choice" | null;

/**
 * Parses the [Q]...[/Q] tagged plain text Gemini produces from the
 * question-generation prompt (see src/lib/ai/question-prompt.ts) into
 * structured question objects. Never throws on malformed input — a block
 * that's missing a stem or has fewer than 2 usable choices (most commonly
 * a trailing block cut off mid-round-boundary) is silently dropped rather
 * than surfaced as a broken question; the caller re-requests it in the
 * next generation round.
 */
export function parseQuestionsText(text: string): ParsedQuestion[] {
  const results: ParsedQuestion[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() !== "[Q]") {
      i++;
      continue;
    }
    i++;

    let category = "";
    let outOfScope = false;
    let needsReview = false;
    let answerIndex: number | null = null;
    let active: ActiveField = null;
    let activeChoiceIdx = -1;

    const stemLines: string[] = [];
    const explanationLines: string[] = [];
    const sourceLines: string[] = [];
    const reviewReasonLines: string[] = [];
    const choiceLines: string[][] = [[], [], [], [], []];

    let foundClose = false;
    while (i < lines.length) {
      if (lines[i].trim() === "[/Q]") {
        foundClose = true;
        break;
      }

      const raw = lines[i];
      const line = raw.trim();
      i++;

      let m: RegExpMatchArray | null;
      if ((m = line.match(FIELD_RE.category))) {
        category = m[1].trim();
        active = null;
        continue;
      }
      if ((m = line.match(FIELD_RE.outOfScope))) {
        outOfScope = truthy(m[1]);
        active = null;
        continue;
      }
      if ((m = line.match(FIELD_RE.needsReview))) {
        needsReview = truthy(m[1]);
        active = null;
        continue;
      }
      if ((m = line.match(FIELD_RE.reviewReason))) {
        if (m[1]) reviewReasonLines.push(m[1]);
        active = "reviewReason";
        continue;
      }
      if ((m = line.match(FIELD_RE.stem))) {
        if (m[1]) stemLines.push(m[1]);
        active = "stem";
        continue;
      }
      if ((m = line.match(FIELD_RE.choice))) {
        const idx = Number(m[1]) - 1;
        if (m[2]) choiceLines[idx].push(m[2]);
        active = "choice";
        activeChoiceIdx = idx;
        continue;
      }
      if ((m = line.match(FIELD_RE.answer))) {
        const digit = m[1].match(/[1-5]/)?.[0];
        answerIndex = digit ? Number(digit) - 1 : null;
        active = null;
        continue;
      }
      if ((m = line.match(FIELD_RE.explanation))) {
        if (m[1]) explanationLines.push(m[1]);
        active = "explanation";
        continue;
      }
      if ((m = line.match(FIELD_RE.source))) {
        if (m[1]) sourceLines.push(m[1]);
        active = "source";
        continue;
      }

      if (!line) continue;
      if (active === "stem") stemLines.push(line);
      else if (active === "explanation") explanationLines.push(line);
      else if (active === "source") sourceLines.push(line);
      else if (active === "reviewReason") reviewReasonLines.push(line);
      else if (active === "choice") choiceLines[activeChoiceIdx].push(line);
      // else: stray line outside any recognized field — drop
    }
    if (foundClose) i++; // consume [/Q]

    if (!foundClose) break; // ran out of input mid-block — incomplete, don't emit it

    const stem = stemLines.join(" ").trim();
    const choices = choiceLines.map((c) => c.join(" ").trim()).filter((c) => c.length > 0);

    if (stem && choices.length >= 2 && isQuestionCategory(category)) {
      results.push({
        category,
        stem,
        choices,
        answerIndex,
        explanation: explanationLines.join(" ").trim(),
        sourceNote: sourceLines.join(" ").trim() || null,
        outOfScope,
        needsReview,
        reviewReason: reviewReasonLines.join(" ").trim() || null,
      });
    }
  }

  return results;
}
