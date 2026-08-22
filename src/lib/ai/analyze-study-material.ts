import "server-only";

import Anthropic from "@anthropic-ai/sdk";

export interface StudyMaterialMappingDraft {
  professor: string | null;
  part_name: string;
  page_start: number | null;
  page_end: number | null;
  problem_start: number | null;
  problem_end: number | null;
  order_index: number;
}

const ANALYSIS_PROMPT = `이 PDF는 의과대학 과목의 학습지(기출문제 모음집)입니다.
하나의 학습지 안에 교수님별 또는 강의(파트)별로 목차/구간이 나뉘어 있습니다.

문서를 훑어보고, 구분되는 교수/파트 구간마다 아래 정보를 추출하세요:
- professor: 교수명 (파악 안 되면 null)
- part_name: 강의/파트명 (예: "AKI", "CKD")
- page_start / page_end: 해당 구간의 PDF 페이지 범위 (숫자, 모르면 null)
- problem_start / problem_end: 해당 구간의 문제 번호 범위 (숫자, 모르면 null)

다른 설명 없이 아래 형식의 JSON 배열만 응답하세요:
[{"professor": "홍길동", "part_name": "AKI", "page_start": 1, "page_end": 20, "problem_start": 1, "problem_end": 15}]

구간을 전혀 구분할 수 없으면 빈 배열 []만 응답하세요.`;

/**
 * Best-effort structural analysis of a study material PDF. Returns an empty
 * array (never throws) when no API key is configured or the model output
 * can't be parsed — the user can always add/edit mappings by hand.
 */
export async function analyzeStudyMaterial(pdfBuffer: Buffer): Promise<StudyMaterialMappingDraft[]> {
  if (!process.env.ANTHROPIC_API_KEY) return [];

  try {
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
                data: pdfBuffer.toString("base64"),
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
        const partName = typeof item?.part_name === "string" ? item.part_name.trim() : "";
        if (!partName) return null;

        return {
          professor: typeof item?.professor === "string" ? item.professor.trim() || null : null,
          part_name: partName,
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
