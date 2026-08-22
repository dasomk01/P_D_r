import "server-only";

import fs from "node:fs";
import path from "node:path";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { InlineRun, SummaryBlock } from "./parse";

// Read as a plain file, not `require.resolve`/`import` — Turbopack/webpack
// try to bundle anything they can statically see as a module import, and
// neither knows how to handle a raw .otf as one.
// .ttf (TrueType glyf outlines), not .otf (CFF) — pdf-lib's font embedding
// has had trouble with CFF-flavored OpenType fonts.
const FONT_DIR = path.join(process.cwd(), "node_modules/pretendard/dist/public/static/alternative");
const REGULAR_FONT_PATH = path.join(FONT_DIR, "Pretendard-Regular.ttf");
const BOLD_FONT_PATH = path.join(FONT_DIR, "Pretendard-Bold.ttf");

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 10.5;
const HEADING_SIZE = 14;
const LINE_GAP = 5;

function hexToRgb(hex: string) {
  const n = parseInt(hex, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const GRAY = hexToRgb("999999");
const BLACK = rgb(0.1, 0.1, 0.1);

const COLORS: Record<string, ReturnType<typeof rgb>> = {
  normal: BLACK,
  yama: hexToRgb("7030A0"),
  yamaBold: hexToRgb("7030A0"),
  emphasis: hexToRgb("CC0000"),
  professorNote: hexToRgb("0070C0"),
};

interface Segment {
  text: string;
  bold: boolean;
  color: ReturnType<typeof rgb>;
}

interface Line {
  segments: { text: string; bold: boolean; color: ReturnType<typeof rgb>; width: number }[];
  width: number;
}

class PdfWriter {
  doc!: PDFDocument;
  regular!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  y = 0;

  async init() {
    this.doc = await PDFDocument.create();
    this.doc.registerFontkit(fontkit);
    this.regular = await this.doc.embedFont(fs.readFileSync(REGULAR_FONT_PATH));
    this.bold = await this.doc.embedFont(fs.readFileSync(BOLD_FONT_PATH));
    this.addPage();
  }

  addPage() {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensureSpace(height: number) {
    if (this.y - height < MARGIN) this.addPage();
  }

  fontFor(bold: boolean) {
    return bold ? this.bold : this.regular;
  }

  wrap(segments: Segment[], size: number, maxWidth: number): Line[] {
    const lines: Line[] = [];
    let current: Line = { segments: [], width: 0 };

    for (const seg of segments) {
      const font = this.fontFor(seg.bold);
      const words = seg.text.split(/(\s+)/).filter((w) => w.length > 0);

      for (const word of words) {
        const width = font.widthOfTextAtSize(word, size);
        if (current.width + width > maxWidth && current.segments.length > 0) {
          lines.push(current);
          current = { segments: [], width: 0 };
        }
        current.segments.push({ text: word, bold: seg.bold, color: seg.color, width });
        current.width += width;
      }
    }
    if (current.segments.length > 0) lines.push(current);
    return lines;
  }

  drawLines(lines: Line[], size: number, x: number) {
    const lineHeight = size + LINE_GAP;
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      let cursorX = x;
      for (const seg of line.segments) {
        if (seg.text.trim().length === 0) {
          cursorX += seg.width;
          continue;
        }
        this.page.drawText(seg.text, {
          x: cursorX,
          y: this.y - size,
          size,
          font: this.fontFor(seg.bold),
          color: seg.color,
        });
        cursorX += seg.width;
      }
      this.y -= lineHeight;
    }
  }

  paragraph(runsToSegments: Segment[], options?: { boxFill?: ReturnType<typeof rgb> }) {
    const inset = options?.boxFill ? 8 : 0;
    const lines = this.wrap(runsToSegments, BODY_SIZE, CONTENT_WIDTH - inset * 2);
    if (lines.length === 0) return;

    if (options?.boxFill) {
      const height = lines.length * (BODY_SIZE + LINE_GAP) + inset * 2;
      this.ensureSpace(height);
      this.page.drawRectangle({
        x: MARGIN,
        y: this.y - height + LINE_GAP,
        width: CONTENT_WIDTH,
        height,
        color: options.boxFill,
      });
      this.y -= inset;
      this.drawLines(lines, BODY_SIZE, MARGIN + inset);
      this.y -= inset;
    } else {
      this.drawLines(lines, BODY_SIZE, MARGIN);
    }
    this.y -= 4;
  }

  heading(text: string) {
    this.ensureSpace(HEADING_SIZE + LINE_GAP + 10);
    this.y -= 6;
    this.page.drawText(text, { x: MARGIN, y: this.y - HEADING_SIZE, size: HEADING_SIZE, font: this.bold, color: BLACK });
    this.y -= HEADING_SIZE + LINE_GAP + 4;
  }
}

function toSegments(runs: InlineRun[], overrideColor?: ReturnType<typeof rgb>, forceBold = false): Segment[] {
  if (runs.length === 0) return [{ text: "", bold: forceBold, color: overrideColor ?? BLACK }];
  return runs.map((r) => ({
    text: r.text,
    bold: forceBold || r.style === "yamaBold",
    color: overrideColor ?? COLORS[r.style] ?? BLACK,
  }));
}

export async function generateSummaryPdf(title: string, blocks: SummaryBlock[]): Promise<Buffer> {
  const writer = new PdfWriter();
  await writer.init();
  writer.heading(title);

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        writer.heading(block.text);
        break;
      case "image":
        writer.paragraph(toSegments([{ text: `[이미지: ${block.label}]`, style: "normal" }], GRAY));
        break;
      case "yamaOnly":
        writer.paragraph(toSegments([{ text: "[YAMA-ONLY]", style: "normal" }], COLORS.yama, true));
        for (const item of block.items) {
          writer.paragraph(toSegments([{ text: `- ${item}`, style: "normal" }]));
        }
        break;
      case "tyBox": {
        const runs: InlineRun[] = block.quote
          ? [{ text: `"${block.quote}" - `, style: "normal" }, ...block.runs]
          : block.runs;
        writer.paragraph(toSegments(runs, COLORS.emphasis, true), { boxFill: hexToRgb("FFD7D7") });
        break;
      }
      case "case":
        writer.paragraph(toSegments(block.runs), { boxFill: hexToRgb("EBF3FB") });
        break;
      case "example":
        writer.paragraph(toSegments(block.runs), { boxFill: hexToRgb("F0FFF0") });
        break;
      case "lectureOnly":
      case "unconfirmed":
        writer.paragraph(toSegments(block.runs, GRAY));
        break;
      case "lectureEmphasis":
        writer.paragraph(toSegments(block.runs, hexToRgb("FF6600")));
        break;
      case "paragraph":
      default:
        writer.paragraph(toSegments(block.runs));
        break;
    }
  }

  return Buffer.from(await writer.doc.save());
}
