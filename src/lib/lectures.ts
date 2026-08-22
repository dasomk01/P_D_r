export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Period = (typeof PERIODS)[number];

export const FILE_TYPES = ["yachek", "lecture_pdf", "stt_txt", "worksheet_pdf"] as const;
export type FileType = (typeof FILE_TYPES)[number];

export const FILE_TYPE_CONFIG: Record<
  FileType,
  { label: string; bucket: string; accept: string; extension: string; contentType: string }
> = {
  yachek: {
    label: "야첵",
    bucket: "lecture-pdf",
    accept: "application/pdf",
    extension: "pdf",
    contentType: "application/pdf",
  },
  lecture_pdf: {
    label: "강의록",
    bucket: "lecture-pdf",
    accept: "application/pdf",
    extension: "pdf",
    contentType: "application/pdf",
  },
  stt_txt: {
    label: "STT 텍스트",
    bucket: "stt-txt",
    accept: ".txt,text/plain",
    extension: "txt",
    contentType: "text/plain",
  },
  worksheet_pdf: {
    label: "학습지",
    bucket: "worksheet-pdf",
    accept: "application/pdf",
    extension: "pdf",
    contentType: "application/pdf",
  },
};

export interface Lecture {
  id: string;
  date: string;
  period: number;
  subject: string;
  title: string;
  status: string;
}

export interface LectureFile {
  id: string;
  lecture_id: string;
  type: FileType;
  storage_path: string;
  created_at: string;
  url: string | null;
}

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

export function isValidDateKey(value: string): boolean {
  return DATE_KEY_RE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function isValidMonthKey(value: string): boolean {
  return MONTH_KEY_RE.test(value);
}

export function isValidPeriod(value: number): value is Period {
  return Number.isInteger(value) && value >= 1 && value <= 8;
}
