export const QUESTION_CATEGORIES = ["야마그대로", "야마변형", "티야", "탈야"] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export function isQuestionCategory(value: unknown): value is QuestionCategory {
  return typeof value === "string" && (QUESTION_CATEGORIES as readonly string[]).includes(value);
}

export interface QuestionContent {
  stem: string;
  choices: string[];
  /** 0-based index into choices. */
  answerIndex: number;
  explanation: string;
  sourceNote: string | null;
  /** true if this item (a 야마 item, typically) doesn't actually match the selected lecture session(s)' scope. */
  outOfScope: boolean;
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
  selected: number[];
  correct: boolean;
  is_wrong: boolean;
  attempted_at: string;
}
