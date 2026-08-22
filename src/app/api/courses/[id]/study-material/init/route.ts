import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { STUDY_MATERIAL_BUCKET } from "@/lib/study-materials";

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

/**
 * Step 1 of the upload flow: creates the (still inactive) study_materials
 * row and a Supabase Storage signed upload URL. The browser then PUTs the
 * PDF straight to Supabase (see /complete) — this endpoint's own request/
 * response never carries the file, so it isn't subject to Vercel's ~4.5MB
 * serverless function body limit that broke large study material uploads.
 */
export async function POST(_request: NextRequest, ctx: RouteContext<"/api/courses/[id]/study-material/init">) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

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
    .select("version")
    .eq("course_id", courseId)
    .eq("is_active", true)
    .maybeSingle();
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });

  const { data: newMaterial, error: insertError } = await supabase
    .from("study_materials")
    .insert({ course_id: courseId, storage_path: "", version: (current?.version ?? 0) + 1, is_active: false })
    .select("*")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const storagePath = `${courseId}/${newMaterial.id}.pdf`;

  const { data: signed, error: signError } = await supabase.storage
    .from(STUDY_MATERIAL_BUCKET)
    .createSignedUploadUrl(storagePath);
  if (signError) {
    await supabase.from("study_materials").delete().eq("id", newMaterial.id);
    return NextResponse.json({ error: signError.message }, { status: 500 });
  }

  const { error: pathError } = await supabase
    .from("study_materials")
    .update({ storage_path: storagePath })
    .eq("id", newMaterial.id);
  if (pathError) return NextResponse.json({ error: pathError.message }, { status: 500 });

  return NextResponse.json({
    studyMaterialId: newMaterial.id,
    path: storagePath,
    token: signed.token,
  });
}
