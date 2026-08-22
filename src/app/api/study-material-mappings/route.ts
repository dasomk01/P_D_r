import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { parseMappingInput } from "@/lib/study-materials";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const body = await request.json().catch(() => null);
  const studyMaterialId = body?.study_material_id;
  if (typeof studyMaterialId !== "string" || !studyMaterialId) {
    return NextResponse.json({ error: "study_material_id가 필요합니다." }, { status: 400 });
  }

  const fields = parseMappingInput(body ?? {});
  if (!fields.part_name) {
    return NextResponse.json({ error: "강의 파트명을 입력하세요." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { count } = await supabase
    .from("study_material_mappings")
    .select("id", { count: "exact", head: true })
    .eq("study_material_id", studyMaterialId);

  const { data, error } = await supabase
    .from("study_material_mappings")
    .insert({
      study_material_id: studyMaterialId,
      ...fields,
      order_index: count ?? 0,
      is_ai_generated: false,
      confirmed: true,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ mapping: data }, { status: 201 });
}
