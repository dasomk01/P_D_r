export const QUESTION_CATEGORIES = ["야마그대로", "야마변형", "티야", "탈야"] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export function isQuestionCategory(value: unknown): value is QuestionCategory {
  return typeof value === "string" && (QUESTION_CATEGORIES as readonly string[]).includes(value);
}

/**
 * 객관식(5지선다)이 기본. 주관식은 원본 기출이 주관식이었던 야마그대로 문제에만
 * 허용된다 — 야마변형/티야/탈야는 항상 객관식.
 */
export type QuestionFormat = "objective" | "subjective";

/** Categories that may keep a 주관식 format (only when the original 기출 was 주관식). */
export const SUBJECTIVE_ALLOWED_CATEGORIES: readonly QuestionCategory[] = ["야마그대로"];

export interface QuestionContent {
  /** Missing on rows created before 주관식 support — treat as "objective". */
  format?: QuestionFormat;
  stem: string;
  /** Empty for 주관식. */
  choices: string[];
  /** 0-based index into choices. Unused (0) for 주관식. */
  answerIndex: number;
  /** 주관식 모범답안. */
  answerText?: string | null;
  explanation: string;
  sourceNote: string | null;
  /** true if this item (a 야마 item, typically) doesn't actually match the selected lecture session(s)' scope. */
  outOfScope: boolean;
}

export function isSubjective(content: QuestionContent): boolean {
  return content.format === "subjective";
}

export type QuestionReviewStatus = "pending" | "approved" | "rejected";

export interface Question {
  id: string;
  course_id: string;
  category: QuestionCategory;
  content_json: QuestionContent;
  review_status: QuestionReviewStatus;
  review_notes: string | null;
  study_material_mapping_id: string | null;
  question_batch_id: string | null;
  created_at: string;
}

export type QuestionBatchStatus = "generating" | "done" | "error";

export interface QuestionBatch {
  id: string;
  course_id: string;
  status: QuestionBatchStatus;
  round: number;
  error_message: string | null;
  created_at: string;
}

export interface Attempt {
  id: string;
  question_id: string;
  /** 객관식: 고른 선지 index. 주관식: [작성한 답안]. */
  selected: number[] | string[];
  correct: boolean;
  is_wrong: boolean;
  attempted_at: string;
}
