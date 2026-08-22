import { ComingSoon } from "@/components/coming-soon";

export default async function CourseQuestionsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <ComingSoon
      emoji="🧩"
      title="문제풀이"
      phase="야마 그대로 · 야마 변형 · 티야 · 탈야 문제풀이(Gemini API)는 Phase F에서 구현됩니다."
      backHref={`/courses/${courseId}`}
      backLabel="강의로 돌아가기"
    />
  );
}
