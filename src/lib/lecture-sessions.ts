export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Period = (typeof PERIODS)[number];

export interface LectureSession {
  id: string;
  course_id: string;
  date: string;
  period: number;
  professor: string | null;
  part_name: string | null;
  lecture_pdf_path: string | null;
  stt_path: string | null;
  created_at: string;
  updated_at: string;
}

export const SESSION_FILE_TYPES = ["lecture_pdf", "stt_txt"] as const;
export type SessionFileType = (typeof SESSION_FILE_TYPES)[number];

export const SESSION_FILE_CONFIG: Record<
  SessionFileType,
  { label: string; bucket: string; extension: string; contentType: string; pathColumn: "lecture_pdf_path" | "stt_path" }
> = {
  lecture_pdf: {
    label: "강의록",
    bucket: "lecture-pdf",
    extension: "pdf",
    contentType: "application/pdf",
    pathColumn: "lecture_pdf_path",
  },
  stt_txt: {
    label: "STT",
    bucket: "stt-txt",
    extension: "txt",
    contentType: "text/plain",
    pathColumn: "stt_path",
  },
};

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateKey(value: string): boolean {
  return DATE_KEY_RE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function isValidPeriod(value: number): value is Period {
  return Number.isInteger(value) && value >= 1 && value <= 8;
}

export function isSessionFileType(value: unknown): value is SessionFileType {
  return typeof value === "string" && (SESSION_FILE_TYPES as readonly string[]).includes(value);
}
