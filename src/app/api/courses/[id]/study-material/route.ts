import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { STUDY_MATERIAL_BUCKET } from "@/lib/study-materials";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/study-material">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();

  const { data: material, error: materialError } = await supabase
    .from("study_materials")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_active", true)
    .maybeSingle();

  if (materialError) return NextResponse.json({ error: materialError.message }, { status: 500 });
  if (!material) return NextResponse.json({ material: null, mappings: [] });

  const [{ data: signed }, { data: mappings, error: mappingsError }] = await Promise.all([
    supabase.storage.from(STUDY_MATERIAL_BUCKET).createSignedUrl(material.storage_path, SIGNED_URL_TTL_SECONDS),
    supabase
      .from("study_material_mappings")
      .select("*")
      .eq("study_material_id", material.id)
      .order("order_index"),
  ]);

  if (mappingsError) return NextResponse.json({ error: mappingsError.message }, { status: 500 });

  return NextResponse.json({
    material: { ...material, url: signed?.signedUrl ?? null },
    mappings: mappings ?? [],
  });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/study-material">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const supabase = createServiceClient();

  const { data: material, error: materialError } = await supabase
    .from("study_materials")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_active", true)
    .maybeSingle();
  if (materialError) return NextResponse.json({ error: materialError.message }, { status: 500 });
  if (!material) return NextResponse.json({ error: "등록된 학습지가 없습니다." }, { status: 404 });

  const { error: removeError } = await supabase.storage
    .from(STUDY_MATERIAL_BUCKET)
    .remove([material.storage_path]);
  if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 });

  const { error: deleteError } = await supabase.from("study_materials").delete().eq("id", material.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
