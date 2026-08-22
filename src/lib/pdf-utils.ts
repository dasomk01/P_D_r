import "server-only";

import { PDFDocument } from "pdf-lib";

/** 1-indexed, inclusive page range. Clamped to the document's actual page count. */
export async function extractPdfPageRange(pdfBuffer: Buffer, startPage1: number, endPage1: number): Promise<Buffer> {
  const source = await PDFDocument.load(pdfBuffer);
  const total = source.getPageCount();
  const start = Math.max(1, Math.min(startPage1, total));
  const end = Math.max(start, Math.min(endPage1, total));

  const indices: number[] = [];
  for (let p = start; p <= end; p++) indices.push(p - 1);

  const excerpt = await PDFDocument.create();
  const copiedPages = await excerpt.copyPages(source, indices);
  copiedPages.forEach((page) => excerpt.addPage(page));

  return Buffer.from(await excerpt.save());
}

export async function extractLeadingPages(pdfBuffer: Buffer, pageCount: number): Promise<Buffer> {
  return extractPdfPageRange(pdfBuffer, 1, pageCount);
}

export async function getPdfPageCount(pdfBuffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(pdfBuffer);
  return doc.getPageCount();
}
