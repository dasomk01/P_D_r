import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { extractLeadingPages } from "@/lib/pdf-utils";

export interface StudyMaterialMappingDraft {
  professor: string | null;
  part_name: string;
  page_start: number | null;
  page_end: number | null;
  problem_start: number | null;
  problem_end: number | null;
  order_index: number;
}

// The professor/page breakdown lives in the table of contents at the front
// of the study material, not spread across the whole document — so we only
// ever need to show Claude the first few pages. This also keeps every
// analysis well under the Claude API's 100-page PDF input limit regardless
// of how long the full study material is (some run 800+ pages).
const TOC_PAGE_COUNT = 10;

const ANALYSIS_PROMPT = `이 PDF는 의과대학 과목 학습지(기출문제 모음집)의 앞부분(목차/색인 페이지)입니다.
전체 문서가 아니라 목차만 보고 있다는 점을 감안하세요.

목차에는 보통 "OOO 교수님 - 4~109페이지"처럼 교수님별(또는 파트별) 페이지 범위가 나열되어 있습니다.
목차에 적힌 항목마다 아래 정보를 추출하세요:

- professor: 교수명
- part_name: 강의/파트명. 목차에 별도 파트명이 없고 교수명만 있으면 professor와 동일한 값을 사용하세요.
- page_start / page_end: 그 교수/파트가 시작·끝나는 PDF 페이지 번호
- problem_start / problem_end: 문제 번호 범위 (목차에 없으면 null)

다른 설명 없이 아래 형식의 JSON 배열만 응답하세요:
[{"professor": "홍길동", "part_name": "홍길동", "page_start": 4, "page_end": 109, "problem_start": null, "problem_end": null}]

목차를 찾을 수 없거나 항목을 구분할 수 없으면 빈 배열 []만 응답하세요.`;

/**
 * Best-effort structural analysis of a study material PDF's table of
 * contents. Returns an empty array (never throws) when no API key is
 * configured, the PDF can't be read, or the model output can't be parsed —
 * the user can always add/edit mappings by hand.
 */
export async function analyzeStudyMaterial(pdfBuffer: Buffer): Promise<StudyMaterialMappingDraft[]> {
  if (!process.env.ANTHROPIC_API_KEY) return [];

  try {
    const tocExcerpt = await extractLeadingPages(pdfBuffer, TOC_PAGE_COUNT);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: tocExcerpt.toString("base64"),
              },
            },
            { type: "text", text: ANALYSIS_PROMPT },
          ],
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, index): StudyMaterialMappingDraft | null => {
        const professor = typeof item?.professor === "string" ? item.professor.trim() || null : null;
        const partName = typeof item?.part_name === "string" ? item.part_name.trim() : "";
        if (!partName && !professor) return null;

        return {
          professor,
          part_name: partName || professor!,
          page_start: Number.isInteger(item?.page_start) ? item.page_start : null,
          page_end: Number.isInteger(item?.page_end) ? item.page_end : null,
          problem_start: Number.isInteger(item?.problem_start) ? item.problem_start : null,
          problem_end: Number.isInteger(item?.problem_end) ? item.problem_end : null,
          order_index: index,
        };
      })
      .filter((v): v is StudyMaterialMappingDraft => v !== null);
  } catch {
    return [];
  }
}
