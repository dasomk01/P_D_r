export function SetupNotice() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <p className="eyebrow mb-3">Setup required</p>
      <h1 className="display mb-6 text-5xl text-navy">OUR STUDIO 설정이 필요합니다</h1>
      <div className="card space-y-3 p-6 text-sm leading-relaxed">
        <p>Supabase 환경변수가 설정되지 않았습니다. 배포 환경(Vercel)에 아래 값을 추가하세요.</p>
        <pre className="overflow-x-auto rounded bg-cream p-3 text-xs">
          {`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# 선택 — AI 기능 (없으면 '연동 준비 중'으로 표시)
ANTHROPIC_API_KEY=...`}
        </pre>
        <p className="text-muted">자세한 순서는 our-studio/README.md 를 참고하세요.</p>
      </div>
    </main>
  );
}
