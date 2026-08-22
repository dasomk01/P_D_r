import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseSummaryText } from "./parse";
import { generateSummaryDocx } from "./docx-generator";
import { generateSummaryPdf } from "./pdf-generator";
import { SUMMARY_DOCX_BUCKET, SUMMARY_PDF_BUCKET } from "./storage";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

/** Parses the tagged text, renders docx+pdf, and uploads both to Storage. */
export async function renderAndUploadSummary(
  supabase: SupabaseClient,
  taggedText: string,
  title: string,
  docxPath: string,
  pdfPath: string,
): Promise<{ docxUrl: string | null; pdfUrl: string | null }> {
  const blocks = parseSummaryText(taggedText);
  const [docxBuffer, pdfBuffer] = await Promise.all([
    generateSummaryDocx(title, blocks),
    generateSummaryPdf(title, blocks),
  ]);

  const [docxUpload, pdfUpload] = await Promise.all([
    supabase.storage.from(SUMMARY_DOCX_BUCKET).upload(docxPath, docxBuffer, {
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      upsert: true,
    }),
    supabase.storage.from(SUMMARY_PDF_BUCKET).upload(pdfPath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    }),
  ]);

  if (docxUpload.error) throw new Error(docxUpload.error.message);
  if (pdfUpload.error) throw new Error(pdfUpload.error.message);

  const [docxSigned, pdfSigned] = await Promise.all([
    supabase.storage.from(SUMMARY_DOCX_BUCKET).createSignedUrl(docxPath, SIGNED_URL_TTL_SECONDS),
    supabase.storage.from(SUMMARY_PDF_BUCKET).createSignedUrl(pdfPath, SIGNED_URL_TTL_SECONDS),
  ]);

  return {
    docxUrl: docxSigned.data?.signedUrl ?? null,
    pdfUrl: pdfSigned.data?.signedUrl ?? null,
  };
}
