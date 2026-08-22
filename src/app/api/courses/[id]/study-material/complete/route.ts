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

/**
 * Step 2: called after the browser finishes PUTting the file to the signed
 * URL from /init. Activates the new study material (deactivating the old
 * one without deleting it) and, if an AI key is configured, downloads the
 * file server-side to run table-of-contents analysis.
 */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/courses/[id]/study-material/complete">,
) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();
  const { id: courseId } = await ctx.params;

  const body = await request.json().catch(() => null);
  const studyMaterialId = body?.studyMaterialId;
  if (typeof studyMaterialId !== "string" || !studyMaterialId) {
    return NextResponse.json({ error: "studyMaterialId가 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: newMaterial, error: newMaterialError } = await supabase
    .from("study_materials")
    .select("*")
    .eq("id", studyMaterialId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (newMaterialError) return NextResponse.json({ error: newMaterialError.message }, { status: 500 });
  if (!newMaterial) return NextResponse.json({ error: "업로드 정보를 찾을 수 없습니다." }, { status: 404 });

  const { data: current, error: currentError } = await supabase
    .from("study_materials")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_active", true)
    .neq("id", studyMaterialId)
    .maybeSingle();
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });

  // Deactivate the previous version without deleting it, so existing
  // questions built from its mappings stay intact.
  if (current) {
    const { error: deactivateError } = await supabase
      .from("study_materials")
      .update({ is_active: false })
      .eq("id", current.id);
    if (deactivateError) return NextResponse.json({ error: deactivateError.message }, { status: 500 });
  }

  const { data: activated, error: activateError } = await supabase
    .from("study_materials")
    .update({ is_active: true })
    .eq("id", studyMaterialId)
    .select("*")
    .single();
  if (activateError) return NextResponse.json({ error: activateError.message }, { status: 500 });

  let drafts: Awaited<ReturnType<typeof analyzeStudyMaterial>> = [];
  if (process.env.ANTHROPIC_API_KEY) {
    const { data: downloaded } = await supabase.storage
      .from(STUDY_MATERIAL_BUCKET)
      .download(activated.storage_path);
    if (downloaded) {
      const buffer = Buffer.from(await downloaded.arrayBuffer());
      drafts = await analyzeStudyMaterial(buffer);
    }
  }

  let mappings: unknown[] = [];
  if (drafts.length > 0) {
    const { data: insertedMappings, error: mappingsError } = await supabase
      .from("study_material_mappings")
      .insert(
        drafts.map((d) => ({
          study_material_id: studyMaterialId,
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
    .createSignedUrl(activated.storage_path, SIGNED_URL_TTL_SECONDS);

  return NextResponse.json({
    material: { ...activated, url: signed?.signedUrl ?? null },
    mappings,
    aiAnalyzed: drafts.length > 0,
    aiSkipped: !process.env.ANTHROPIC_API_KEY,
  });
}
