import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { parseMappingInput } from "@/lib/study-materials";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/study-material-mappings/[id]">,
) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "요청 본문이 필요합니다." }, { status: 400 });

  const update: Record<string, unknown> = {};

  if (
    body.part_name !== undefined ||
    body.professor !== undefined ||
    body.page_start !== undefined ||
    body.page_end !== undefined ||
    body.problem_start !== undefined ||
    body.problem_end !== undefined
  ) {
    const fields = parseMappingInput(body);
    if (!fields.part_name) {
      return NextResponse.json({ error: "강의 파트명을 입력하세요." }, { status: 400 });
    }
    Object.assign(update, fields);
  }
  if (typeof body.confirmed === "boolean") update.confirmed = body.confirmed;
  if (typeof update.part_name !== "undefined" || typeof body.confirmed === "boolean") {
    update.updated_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 필드가 없습니다." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("study_material_mappings")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "매핑을 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({ mapping: data });
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/study-material-mappings/[id]">,
) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id } = await ctx.params;

  const supabase = createServiceClient();
  const { error } = await supabase.from("study_material_mappings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
