import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { FILE_TYPE_CONFIG, FileType, FILE_TYPES, isValidDateKey, isValidPeriod } from "@/lib/lectures";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    { error: "Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인하세요." },
    { status: 503 },
  );
}

function isFileType(value: unknown): value is FileType {
  return typeof value === "string" && (FILE_TYPES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "multipart/form-data 요청이 필요합니다." }, { status: 400 });
  }

  const date = form.get("date");
  const periodRaw = form.get("period");
  const type = form.get("type");
  const file = form.get("file");

  if (typeof date !== "string" || !isValidDateKey(date)) {
    return NextResponse.json({ error: "date는 YYYY-MM-DD 형식이어야 합니다." }, { status: 400 });
  }
  const period = Number(periodRaw);
  if (!isValidPeriod(period)) {
    return NextResponse.json({ error: "period는 1~8 사이의 정수여야 합니다." }, { status: 400 });
  }
  if (!isFileType(type)) {
    return NextResponse.json({ error: "지원하지 않는 파일 종류입니다." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file 필드가 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .select("id")
    .eq("date", date)
    .eq("period", period)
    .maybeSingle();

  if (lectureError) return NextResponse.json({ error: lectureError.message }, { status: 500 });
  if (!lecture) {
    return NextResponse.json(
      { error: "먼저 과목/강의명을 저장한 뒤 파일을 업로드하세요." },
      { status: 400 },
    );
  }

  const config = FILE_TYPE_CONFIG[type];
  const storagePath = `${lecture.id}/${type}.${config.extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(config.bucket)
    .upload(storagePath, buffer, { contentType: config.contentType, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: fileRow, error: dbError } = await supabase
    .from("lecture_files")
    .upsert(
      { lecture_id: lecture.id, type, storage_path: storagePath },
      { onConflict: "lecture_id,type" },
    )
    .select("*")
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  const { data: signed } = await supabase.storage
    .from(config.bucket)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  return NextResponse.json({ file: { ...fileRow, url: signed?.signedUrl ?? null } });
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseNotConfiguredResponse();

  const fileId = request.nextUrl.searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "fileId 쿼리 파라미터가 필요합니다." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: fileRow, error: fetchError } = await supabase
    .from("lecture_files")
    .select("*")
    .eq("id", fileId)
    .maybeSingle();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!fileRow) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  const config = FILE_TYPE_CONFIG[fileRow.type as FileType];

  const { error: removeError } = await supabase.storage
    .from(config.bucket)
    .remove([fileRow.storage_path]);

  if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 });

  const { error: deleteError } = await supabase.from("lecture_files").delete().eq("id", fileId);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
