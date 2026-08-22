import "server-only";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ShadingType,
  BorderStyle,
} from "docx";
import type { InlineRun, InlineStyle, SummaryBlock } from "./parse";

const COLORS = {
  yama: "7030A0",
  emphasis: "CC0000",
  professorNote: "0070C0",
  lectureOnly: "999999",
  lectureEmphasis: "FF6600",
  unconfirmed: "999999",
  tyText: "CC0000",
  tyBg: "FFD7D7",
  caseBg: "EBF3FB",
  exampleBg: "F0FFF0",
} as const;

function runProps(style: InlineStyle) {
  switch (style) {
    case "yama":
      return { color: COLORS.yama, underline: {} };
    case "yamaBold":
      return { color: COLORS.yama, underline: {}, bold: true };
    case "emphasis":
      return { color: COLORS.emphasis };
    case "professorNote":
      return { color: COLORS.professorNote };
    default:
      return {};
  }
}

function toTextRuns(runs: InlineRun[]): TextRun[] {
  if (runs.length === 0) return [new TextRun("")];
  return runs.map((r) => new TextRun({ text: r.text, ...runProps(r.style) }));
}

function boxParagraph(runs: InlineRun[], fill: string, extra: Partial<{ color: string; bold: boolean }> = {}) {
  const textRuns =
    runs.length > 0
      ? runs.map(
          (r) =>
            new TextRun({
              text: r.text,
              color: extra.color ?? runProps(r.style).color,
              bold: extra.bold,
              underline: runProps(r.style).underline,
            }),
        )
      : [new TextRun("")];

  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: fill },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: fill },
      left: { style: BorderStyle.SINGLE, size: 4, color: fill },
      right: { style: BorderStyle.SINGLE, size: 4, color: fill },
    },
    spacing: { before: 120, after: 120 },
    children: textRuns,
  });
}

function italicGrayParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, color: COLORS.lectureOnly, italics: true })],
  });
}

function blockToParagraphs(block: SummaryBlock): Paragraph[] {
  switch (block.type) {
    case "heading":
      return [new Paragraph({ text: block.text, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } })];

    case "image":
      return [italicGrayParagraph(`[이미지: ${block.label}]`)];

    case "yamaOnly":
      return [
        new Paragraph({
          children: [new TextRun({ text: "[YAMA-ONLY]", color: COLORS.yama, bold: true })],
          spacing: { before: 120 },
        }),
        ...block.items.map(
          (item) =>
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: item })],
            }),
        ),
      ];

    case "tyBox": {
      const runs: InlineRun[] = block.quote
        ? [{ text: `"${block.quote}" - `, style: "normal" }, ...block.runs]
        : block.runs;
      return [boxParagraph(runs, COLORS.tyBg, { color: COLORS.tyText, bold: true })];
    }

    case "case":
      return [boxParagraph(block.runs, COLORS.caseBg)];

    case "example":
      return [boxParagraph(block.runs, COLORS.exampleBg)];

    case "lectureOnly":
      return [
        new Paragraph({
          children: block.runs.length
            ? block.runs.map((r) => new TextRun({ text: r.text, color: COLORS.lectureOnly, italics: true }))
            : [new TextRun("")],
        }),
      ];

    case "unconfirmed":
      return [
        new Paragraph({
          children: [
            new TextRun({ text: "[확인필요] ", color: COLORS.unconfirmed, italics: true }),
            ...block.runs.map((r) => new TextRun({ text: r.text, color: COLORS.unconfirmed, italics: true })),
          ],
        }),
      ];

    case "lectureEmphasis":
      return [
        new Paragraph({
          children: block.runs.length
            ? block.runs.map((r) => new TextRun({ text: r.text, color: COLORS.lectureEmphasis }))
            : [new TextRun("")],
        }),
      ];

    case "paragraph":
    default:
      return [new Paragraph({ children: toTextRuns(block.runs) })];
  }
}

export async function generateSummaryDocx(title: string, blocks: SummaryBlock[]): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE, spacing: { after: 240 } }),
          ...blocks.flatMap(blockToParagraphs),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
