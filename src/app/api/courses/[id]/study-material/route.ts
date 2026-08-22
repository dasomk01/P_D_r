import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { STUDY_MATERIAL_BUCKET } from "@/lib/study-materials";
import { analyzeStudyMaterial } from "@/lib/ai/analyze-study-material";

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

export async function POST(request: NextRequest, ctx: RouteContext<"/api/courses/[id]/study-material">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file 필드가 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .maybeSingle();
  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const { data: current, error: currentError } = await supabase
    .from("study_materials")
    .select("id, version")
    .eq("course_id", courseId)
    .eq("is_active", true)
    .maybeSingle();
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data: newMaterial, error: insertError } = await supabase
    .from("study_materials")
    .insert({ course_id: courseId, storage_path: "", version: (current?.version ?? 0) + 1, is_active: false })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const storagePath = `${courseId}/${newMaterial.id}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(STUDY_MATERIAL_BUCKET)
    .upload(storagePath, buffer, { contentType: "application/pdf", upsert: true });
  if (uploadError) {
    await supabase.from("study_materials").delete().eq("id", newMaterial.id);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Deactivate the previous version only after the new upload succeeds, and
  // keep its row (and mappings) around so existing questions built from it
  // stay intact — see study_material_mapping_id on_delete set null.
  if (current) {
    const { error: deactivateError } = await supabase
      .from("study_materials")
      .update({ is_active: false })
      .eq("id", current.id);
    if (deactivateError) return NextResponse.json({ error: deactivateError.message }, { status: 500 });
  }

  const { data: activated, error: activateError } = await supabase
    .from("study_materials")
    .update({ storage_path: storagePath, is_active: true })
    .eq("id", newMaterial.id)
    .select("*")
    .single();
  if (activateError) return NextResponse.json({ error: activateError.message }, { status: 500 });

  const drafts = await analyzeStudyMaterial(buffer);
  let mappings: unknown[] = [];
  if (drafts.length > 0) {
    const { data: insertedMappings, error: mappingsError } = await supabase
      .from("study_material_mappings")
      .insert(
        drafts.map((d) => ({
          study_material_id: newMaterial.id,
          professor: d.professor,
          part_name: d.part_name,
          page_start: d.page_start,
          page_end: d.page_end,
          problem_start: d.problem_start,
          problem_end: d.problem_end,
          order_index: d.order_index,
          is_ai_generated: true,
          confirmed: false,
        })),
      )
      .select("*");
    if (mappingsError) return NextResponse.json({ error: mappingsError.message }, { status: 500 });
    mappings = insertedMappings ?? [];
  }

  const { data: signed } = await supabase.storage
    .from(STUDY_MATERIAL_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  return NextResponse.json({
    material: { ...activated, url: signed?.signedUrl ?? null },
    mappings,
    aiAnalyzed: drafts.length > 0,
    aiSkipped: !process.env.ANTHROPIC_API_KEY,
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
