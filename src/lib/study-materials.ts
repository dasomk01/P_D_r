export interface StudyMaterial {
  id: string;
  course_id: string;
  storage_path: string;
  version: number;
  is_active: boolean;
  created_at: string;
  url: string | null;
}

export interface StudyMaterialMapping {
  id: string;
  study_material_id: string;
  professor: string | null;
  part_name: string;
  page_start: number | null;
  page_end: number | null;
  problem_start: number | null;
  problem_end: number | null;
  order_index: number;
  is_ai_generated: boolean;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export const STUDY_MATERIAL_BUCKET = "worksheet-pdf";

function toNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

export function parseMappingInput(body: Record<string, unknown>) {
  const part_name = typeof body.part_name === "string" ? body.part_name.trim() : "";
  const professor = typeof body.professor === "string" ? body.professor.trim() || null : null;

  return {
    part_name,
    professor,
    page_start: toNullableInt(body.page_start),
    page_end: toNullableInt(body.page_end),
    problem_start: toNullableInt(body.problem_start),
    problem_end: toNullableInt(body.problem_end),
  };
}
