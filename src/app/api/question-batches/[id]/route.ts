import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/question-batches/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("question_batches")
    .select("id, status, round, error_message, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "문제 생성 배치를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ batch: data });
}

/** Deletes a batch and (via FK cascade) every question/attempt it produced. */
export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/question-batches/[id]">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { error } = await supabase.from("question_batches").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
