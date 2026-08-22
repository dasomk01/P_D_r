export type InlineStyle = "normal" | "yama" | "yamaBold" | "emphasis" | "professorNote";

export interface InlineRun {
  text: string;
  style: InlineStyle;
}

export interface ParagraphBlock {
  type: "paragraph" | "tyBox" | "lectureOnly" | "lectureEmphasis" | "unconfirmed" | "case" | "example";
  runs: InlineRun[];
  quote?: string;
}

export interface ImageBlock {
  type: "image";
  label: string;
}

export interface YamaOnlyBlock {
  type: "yamaOnly";
  items: string[];
}

export interface HeadingBlock {
  type: "heading";
  text: string;
}

export type SummaryBlock = ParagraphBlock | ImageBlock | YamaOnlyBlock | HeadingBlock;

const INLINE_PATTERN =
  /\[YAMA_BOLD\]([\s\S]*?)\[\/YAMA_BOLD\]|\[YAMA\]([\s\S]*?)\[\/YAMA\]|\(강조\s*-\s*"([^"]*)"\)|\(교수님 설명\s*:\s*([^)]*)\)/g;

function parseInline(text: string): InlineRun[] {
  const runs: InlineRun[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, index), style: "normal" });
    }

    const [full, yamaBold, yama, emphasisQuote, professorNote] = match;
    if (yamaBold !== undefined) {
      runs.push({ text: yamaBold, style: "yamaBold" });
    } else if (yama !== undefined) {
      runs.push({ text: yama, style: "yama" });
    } else if (emphasisQuote !== undefined) {
      runs.push({ text: `(강조 - "${emphasisQuote}")`, style: "emphasis" });
    } else if (professorNote !== undefined) {
      runs.push({ text: `(교수님 설명: ${professorNote})`, style: "professorNote" });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex), style: "normal" });
  }

  return runs.filter((r) => r.text.length > 0);
}

const LINE_MARKERS: Array<{
  re: RegExp;
  type: ParagraphBlock["type"];
}> = [
  { re: /^\[TY!!\]\s*/, type: "tyBox" },
  { re: /^\[강의록에만\]\s*/, type: "lectureOnly" },
  { re: /^\[강의록\s*강조\]\s*/, type: "lectureEmphasis" },
  { re: /^\[확인필요\]\s*/, type: "unconfirmed" },
  { re: /^\[증례\]\s*/, type: "case" },
  { re: /^\[예시\]\s*/, type: "example" },
];

const TY_QUOTE_RE = /^"([^"]*)"\s*-\s*([\s\S]*)$/;
// Accept the spec'd English "IMAGE" tag and the Korean "이미지" the model
// sometimes drifts to despite instructions — never drop image references
// just because the model didn't use the exact documented keyword.
const IMAGE_RE = /^\[(?:IMAGE|이미지)\s*[:：]\s*(.+?)\]$/;
const BRACKET_HEADING_RE = /^\[\s*([^[\]]+?)\s*\]$/;
const MARKDOWN_HEADING_RE = /^#{1,3}\s+(.+)$/;
// Defensive fallback: the model occasionally invents HTML-style [H1]/[H2]
// heading tags instead of the instructed markdown headings. Salvage them
// rather than letting the raw tags leak into the rendered output.
const HTML_HEADING_RE = /^\[H[1-3]\]\s*(.+?)\s*(?:\[\/H[1-3]\])?$/;

interface BlockMarkerSpec {
  open: RegExp;
  close: RegExp;
  type: "tyBox" | "case" | "example";
}

// Multi-line form of the box markers: an opening tag alone on its own line,
// free-flowing content, then a closing tag alone on its own line. Used when
// the box content spans more than one sentence/paragraph and can't fit the
// single-line `[TY!!] "quote" - content` shorthand.
const BLOCK_MARKERS: BlockMarkerSpec[] = [
  { open: /^\[TY!!\]$/, close: /^(\[\/TY!!\]|\/TY!!)$/, type: "tyBox" },
  { open: /^\[증례\]$/, close: /^(\[\/증례\]|\/증례)$/, type: "case" },
  { open: /^\[예시\]$/, close: /^(\[\/예시\]|\/예시)$/, type: "example" },
];

function isBlockBoundary(line: string): boolean {
  if (!line) return false;
  if (line === "[YAMA_ONLY_START]" || line === "[YAMA_ONLY_END]") return true;
  if (IMAGE_RE.test(line) || MARKDOWN_HEADING_RE.test(line) || HTML_HEADING_RE.test(line)) return true;
  if (BLOCK_MARKERS.some((m) => m.open.test(line) || m.close.test(line))) return true;
  return false;
}

/**
 * Parses the tagged plain text Claude produces from the v3.6 summary prompt
 * into a structured block/run representation shared by the docx generator,
 * pdf generator, and web viewer. Anything that doesn't match a known tag
 * degrades safely to a plain paragraph — content is never dropped.
 */
export function parseSummaryText(text: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    i++;

    if (!line) continue;

    if (line === "[YAMA_ONLY_START]") {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim() !== "[YAMA_ONLY_END]") {
        const item = lines[i].trim().replace(/^-\s*/, "");
        if (item) items.push(item);
        i++;
      }
      i++; // skip END marker
      blocks.push({ type: "yamaOnly", items });
      continue;
    }

    const imageMatch = line.match(IMAGE_RE);
    if (imageMatch) {
      blocks.push({ type: "image", label: imageMatch[1] });
      continue;
    }

    // Must run before the bracket-heading check below — a bare "[증례]"
    // marker line would otherwise match BRACKET_HEADING_RE (any single
    // "[...]" line with no nested brackets) and get misread as a heading.
    const blockMarker = BLOCK_MARKERS.find((m) => m.open.test(line));
    if (blockMarker) {
      const contentLines: string[] = [];
      while (i < lines.length) {
        const inner = lines[i].trim();
        if (blockMarker.close.test(inner)) {
          i++; // consume the closing tag
          break;
        }
        if (isBlockBoundary(inner)) break; // model forgot to close — auto-close without consuming
        if (inner) contentLines.push(inner);
        i++;
      }
      const combined = contentLines.join(" ");
      if (blockMarker.type === "tyBox") {
        const quoteMatch = combined.match(TY_QUOTE_RE);
        if (quoteMatch) {
          blocks.push({ type: "tyBox", quote: quoteMatch[1], runs: parseInline(quoteMatch[2]) });
        } else {
          blocks.push({ type: "tyBox", runs: parseInline(combined) });
        }
      } else {
        blocks.push({ type: blockMarker.type, runs: parseInline(combined) });
      }
      continue;
    }

    const headingMatch = line.match(MARKDOWN_HEADING_RE) ?? line.match(HTML_HEADING_RE) ?? line.match(BRACKET_HEADING_RE);
    if (headingMatch) {
      blocks.push({ type: "heading", text: headingMatch[1] });
      continue;
    }

    const marker = LINE_MARKERS.find((m) => m.re.test(line));
    if (marker) {
      const rest = line.replace(marker.re, "");
      if (marker.type === "tyBox") {
        const quoteMatch = rest.match(TY_QUOTE_RE);
        if (quoteMatch) {
          blocks.push({ type: "tyBox", quote: quoteMatch[1], runs: parseInline(quoteMatch[2]) });
        } else {
          blocks.push({ type: "tyBox", runs: parseInline(rest) });
        }
      } else {
        blocks.push({ type: marker.type, runs: parseInline(rest) });
      }
      continue;
    }

    blocks.push({ type: "paragraph", runs: parseInline(line) });
  }

  return blocks;
}
