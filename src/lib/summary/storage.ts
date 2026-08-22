export const SUMMARY_DOCX_BUCKET = "summary-docx";
export const SUMMARY_PDF_BUCKET = "summary-pdf";

export function individualSummaryPath(courseId: string, summaryId: string, ext: "docx" | "pdf"): string {
  return `${courseId}/individual/${summaryId}.${ext}`;
}

export function combinedSummaryPath(courseId: string, combinedId: string, ext: "docx" | "pdf"): string {
  return `${courseId}/combined/${combinedId}.${ext}`;
}
