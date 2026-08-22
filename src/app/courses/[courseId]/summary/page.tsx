import { ComingSoon } from "@/components/coming-soon";

export default async function CourseSummaryPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <ComingSoon
      emoji="📝"
      title="정리본"
      phase="개별/통합 정리본 생성(Claude API)은 Phase E에서 구현됩니다."
      backHref={`/courses/${courseId}`}
      backLabel="강의로 돌아가기"
    />
  );
}
