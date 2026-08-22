import { ComingSoon } from "@/components/coming-soon";

export default async function CourseTutorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <ComingSoon
      emoji="👩🏻‍🏫"
      title="과외"
      phase="채팅형 1:1 AI 과외(OpenAI API)는 Phase G에서 구현됩니다."
      backHref={`/courses/${courseId}`}
      backLabel="강의로 돌아가기"
    />
  );
}
