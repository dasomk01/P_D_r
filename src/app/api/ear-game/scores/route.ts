import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const TOP_N = 10;
const MAX_SCORE = 1_000_000;

type Row = { name: string; score: number; created_at: string };

function notConfigured() {
  return NextResponse.json({ error: "랭킹 서버가 아직 준비되지 않았어요." }, { status: 503 });
}

/** 사람(이름)마다 최고 점수 하나씩만 남긴 상위 랭킹 */
async function topRanking() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ear_game_scores")
    .select("name, score, created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(300);
  if (error) throw new Error(error.message);
  const seen = new Set<string>();
  const ranking: { name: string; score: number }[] = [];
  for (const row of (data ?? []) as Row[]) {
    if (seen.has(row.name)) continue;
    seen.add(row.name);
    ranking.push({ name: row.name, score: row.score });
    if (ranking.length >= TOP_N) break;
  }
  return ranking;
}

export async function GET() {
  if (!isSupabaseConfigured()) return notConfigured();
  try {
    return NextResponse.json({ ranking: await topRanking() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "랭킹을 불러오지 못했어요." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const score = body?.score;
  if (name.length < 1 || [...name].length > 12) {
    return NextResponse.json({ error: "이름은 1~12글자로 적어 주세요." }, { status: 400 });
  }
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) {
    return NextResponse.json({ error: "점수가 올바르지 않아요." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("ear_game_scores").insert({ name, score });
  if (error) {
    console.error("ear_game_scores insert failed:", error.message);
    return NextResponse.json({ error: "등록하지 못했어요. 잠시 후 다시 해 주세요." }, { status: 500 });
  }

  try {
    return NextResponse.json({ ranking: await topRanking() });
  } catch {
    return NextResponse.json({ ranking: null });
  }
}
