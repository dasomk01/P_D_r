import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";
import { aiErrorMessage, jsonCall } from "@/lib/ai/claude";
import { SUGGEST_SCHEMA, TOON_SYSTEM, TRAVEL_SYSTEM, charactersForAi } from "@/lib/ai/prompts";
import { recommendNext } from "@/lib/recommend";
import type { Character, Content, Idea, Place } from "@/lib/types";

export const maxDuration = 120;

/** 추천 우선순위 5단계: 기존 아이디어·아카이브와 겹치지 않는 새 주제 제안 (여행/툰 분리) */
export async function POST(req: NextRequest) {
  const auth = await apiMember({ needAi: true });
  if ("error" in auth) return auth.error;
  const { sb } = auth;
  const { project } = (await req.json()) as { project: "korea-trip" | "med-toon" };
  const [ideas, contents] = await Promise.all([
    sb.from("ideas").select("*").eq("project_id", project).then((r) => (r.data ?? []) as Idea[]),
    sb.from("contents").select("*").eq("project_id", project).order("created_at", { ascending: false }).limit(60).then((r) => (r.data ?? []) as Content[]),
  ]);
  try {
    let system: string;
    let prompt: string;
    if (project === "korea-trip") {
      const places = (await sb.from("places").select("*")).data as Place[];
      const archive = recommendNext({ projectKind: "travel", ideas, votes: {}, places, contents, limit: 30 })
        .filter((r) => r.source === "archive_place")
        .map((r) => r.title);
      system = TRAVEL_SYSTEM;
      prompt = `Suggest 6 NEW carousel topics for foreign tourists in Korea (titles and memo in Korean for the creators).
Mix: day trips, 1N2D / 2N3D, transport & travel tips. Prefer topics that can use our archive places we visited but have not covered yet:
${archive.join("\n") || "(none)"}
Existing ideas (do not duplicate): ${ideas.map((i) => i.title).join(" / ") || "(none)"}
Recent contents (do not duplicate): ${contents.map((c) => c.title).join(" / ") || "(none)"}
"why" = one short Korean sentence on why this topic now.`;
    } else {
      const chars = (await sb.from("characters").select("*")).data as Character[];
      system = TOON_SYSTEM;
      prompt = `새 인스타툰 소재 6개를 제안해 주세요 (의대생 일상·공부·시험·실습·연애 골고루).
캐릭터: ${charactersForAi(chars, "")}
기존 아이디어(중복 금지): ${ideas.map((i) => i.title).join(" / ") || "(없음)"}
최근 콘텐츠(중복 금지): ${contents.map((c) => c.title).join(" / ") || "(없음)"}
title 은 한 줄, memo 는 2~3문장 전개, tags 2~3개, why 는 한 문장.`;
    }
    const out = await jsonCall<{ ideas: { title: string; memo: string; tags: string[]; why: string }[] }>({
      system,
      content: prompt,
      schema: SUGGEST_SCHEMA,
      effort: "low",
      maxTokens: 8000,
    });
    await sb.from("ai_runs").insert({ project_id: project, kind: "idea_suggest", output: out.data, model: out.model });
    return NextResponse.json({ ideas: out.data.ideas.slice(0, 8) });
  } catch (e) {
    return NextResponse.json({ error: aiErrorMessage(e) }, { status: 502 });
  }
}
