import {
  isQuestionCategory,
  SUBJECTIVE_ALLOWED_CATEGORIES,
  type QuestionCategory,
  type QuestionFormat,
} from "../questions";

export interface ParsedQuestion {
  category: QuestionCategory;
  format: QuestionFormat;
  stem: string;
  /** Empty for 주관식. */
  choices: string[];
  /** 0-based index into choices, or null if the model's answer line couldn't be read (always null for 주관식). */
  answerIndex: number | null;
  /** 주관식 모범답안 (null for 객관식, or if the answer line was empty). */
  answerText: string | null;
  explanation: string;
  sourceNote: string | null;
  outOfScope: boolean;
  needsReview: boolean;
  reviewReason: string | null;
}

const FIELD_RE = {
  category: /^카테고리\s*[:：]\s*(.*)$/,
  format: /^형식\s*[:：]\s*(.*)$/,
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

/** The prompt calls the 4th category "탈야대비"; stored/displayed as "탈야". */
function normalizeCategory(value: string): string {
  const v = value.replace(/\s+/g, "");
  return v === "탈야대비" ? "탈야" : v;
}

type ActiveField = "stem" | "explanation" | "source" | "reviewReason" | "choice" | "answer" | null;

/**
 * Parses the [Q]...[/Q] tagged plain text Gemini produces from the
 * question-generation prompt (see src/lib/ai/question-prompt.ts) into
 * structured question objects. Never throws on malformed input — a block
 * that's missing a stem or (unless it's a 주관식 야마그대로) has fewer than 2
 * usable choices (most commonly a trailing block cut off mid-round-boundary,
 * or a 탈야/티야/야마변형 wrongly written as 주관식) is silently dropped rather
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
    let subjectiveDeclared = false;
    let outOfScope = false;
    let needsReview = false;
    let active: ActiveField = null;
    let activeChoiceIdx = -1;

    const stemLines: string[] = [];
    const explanationLines: string[] = [];
    const sourceLines: string[] = [];
    const reviewReasonLines: string[] = [];
    const answerLines: string[] = [];
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
        category = normalizeCategory(m[1].trim());
        active = null;
        continue;
      }
      if ((m = line.match(FIELD_RE.format))) {
        subjectiveDeclared = /주관/.test(m[1]);
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
        if (m[1]) answerLines.push(m[1]);
        active = "answer";
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
      else if (active === "answer") answerLines.push(line);
      // else: stray line outside any recognized field — drop
    }
    if (foundClose) i++; // consume [/Q]

    if (!foundClose) break; // ran out of input mid-block — incomplete, don't emit it

    const stem = stemLines.join(" ").trim();
    const choices = choiceLines.map((c) => c.join(" ").trim()).filter((c) => c.length > 0);
    const answerRaw = answerLines.join(" ").trim();

    if (!stem || !isQuestionCategory(category)) continue;

    // 주관식은 원본이 주관식인 야마그대로에만 허용. 그 외 카테고리가 선지 없이
    // 나오면(예: 탈야를 빈칸 채우기로 만든 경우) 객관식 규칙 위반이라 버린다.
    const subjective =
      SUBJECTIVE_ALLOWED_CATEGORIES.includes(category) && (subjectiveDeclared || choices.length === 0);

    if (subjective) {
      results.push({
        category,
        format: "subjective",
        stem,
        choices: [],
        answerIndex: null,
        answerText: answerRaw || null,
        explanation: explanationLines.join(" ").trim(),
        sourceNote: sourceLines.join(" ").trim() || null,
        outOfScope,
        needsReview,
        reviewReason: reviewReasonLines.join(" ").trim() || null,
      });
    } else if (choices.length >= 2) {
      const digit = answerRaw.match(/[1-5]/)?.[0];
      const answerIndex = digit && Number(digit) <= choices.length ? Number(digit) - 1 : null;
      results.push({
        category,
        format: "objective",
        stem,
        choices,
        answerIndex,
        answerText: null,
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
