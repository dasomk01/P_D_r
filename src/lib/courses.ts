export const COURSE_STATUSES = ["active", "archived"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export interface Course {
  id: string;
  name: string;
  subject: string;
  professor: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export function isCourseStatus(value: unknown): value is CourseStatus {
  return typeof value === "string" && (COURSE_STATUSES as readonly string[]).includes(value);
}
