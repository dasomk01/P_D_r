import { notFound } from "next/navigation";
import {
  FILE_TYPE_CONFIG,
  FileType,
  type Lecture,
  type LectureFile,
  isValidDateKey,
  isValidPeriod,
} from "@/lib/lectures";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { LectureEditor } from "@/components/lecture-editor";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export default async function LecturePage({
  params,
}: {
  params: Promise<{ date: string; period: string }>;
}) {
  const { date, period: periodParam } = await params;
  const period = Number(periodParam);

  if (!isValidDateKey(date) || !isValidPeriod(period)) notFound();

  const configured = isSupabaseConfigured();
  let lecture: Lecture | null = null;
  let files: LectureFile[] = [];
  let loadError: string | null = null;

  if (configured) {
    const supabase = createServiceClient();
    const { data: lectureRow, error: lectureError } = await supabase
      .from("lectures")
      .select("*")
      .eq("date", date)
      .eq("period", period)
      .maybeSingle();

    if (lectureError) {
      loadError = lectureError.message;
    } else {
      lecture = lectureRow as Lecture | null;

      if (lecture) {
        const { data: fileRows, error: filesError } = await supabase
          .from("lecture_files")
          .select("*")
          .eq("lecture_id", lecture.id);

        if (filesError) {
          loadError = filesError.message;
        } else {
          files = await Promise.all(
            (fileRows ?? []).map(async (row) => {
              const config = FILE_TYPE_CONFIG[row.type as FileType];
              const { data: signed } = await supabase.storage
                .from(config.bucket)
                .createSignedUrl(row.storage_path, SIGNED_URL_TTL_SECONDS);

              return { ...row, url: signed?.signedUrl ?? null } as LectureFile;
            }),
          );
        }
      }
    }
  }

  return (
    <LectureEditor
      date={date}
      period={period}
      initialLecture={lecture}
      initialFiles={files}
      configured={configured}
      initialError={loadError}
    />
  );
}
