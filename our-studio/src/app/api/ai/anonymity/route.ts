import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { aiErrorMessage, jsonCall } from "@/lib/ai/claude";

export const maxDuration = 60;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "issues"],
  properties: {
    verdict: { type: "string", enum: ["ok", "review"] },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["quote", "reason", "suggestion"],
        properties: { quote: { type: "string" }, reason: { type: "string" }, suggestion: { type: "string" } },
      },
    },
  },
} as const;

/** 인스타툰 공개 문구의 익명성 AI 검수 (규칙 기반 검수와 별개로 보조) */
export async function POST(req: NextRequest) {
  const auth = await apiMember({ needAi: true });
  if ("error" in auth) return auth.error;
  const { text } = (await req.json()) as { text: string };
  try {
    const out = await jsonCall<{ verdict: "ok" | "review"; issues: { quote: string; reason: string; suggestion: string }[] }>({
      system: `익명 인스타툰의 공개 문구를 검수합니다. 다음이 드러나면 지적하세요: 실명·별명, 학교·병원·동아리 이름, 학번·학년+반처럼 특정 가능한 정보, 구체적 날짜·장소, 실제 연애 시작 시점이나 시간 순서를 짐작하게 하는 표현, 해부학을 함께 공부하던 시기를 연애 중이었던 것처럼 묘사하는 부분. 일반적인 '의대생', '해부학 실습' 같은 표현은 문제 없음. 한국어로 답하세요.`,
      content: text.slice(0, 20000),
      schema: SCHEMA,
      effort: "low",
      maxTokens: 4000,
    });
    const report =
      out.data.issues.length === 0
        ? "AI 검수: 특정 가능한 정보가 보이지 않습니다."
        : `AI 검수: ${out.data.issues.length}건 확인 필요\n` + out.data.issues.map((i) => `· “${i.quote}” — ${i.reason} → ${i.suggestion}`).join("\n");
    return NextResponse.json({ report, ...out.data });
  } catch (e) {
    return NextResponse.json({ error: aiErrorMessage(e) }, { status: 502 });
  }
}
