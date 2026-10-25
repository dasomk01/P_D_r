import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";
import { SetupNotice } from "@/components/setup-notice";

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  return (
    <main className="grid min-h-dvh md:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-navy text-ivory md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,174,176,0.35),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <p className="eyebrow !text-ivory/60">Private Editorial Workspace</p>
          <div>
            <h1 className="display text-7xl leading-[0.95]">
              OUR
              <br />
              <em className="text-rose">Studio</em>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">
              여행의 기억과 작은 아이디어를 모아, 두 계정의 이야기로 엮는 둘만의 작업실.
            </p>
          </div>
          <div className="flex gap-10 text-xs tracking-[0.2em] text-ivory/60">
            <span>KOREA TRIP</span>
            <span>MED SCHOOL TOON</span>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-3">Members only</p>
          <h2 className="display mb-2 text-4xl text-navy md:hidden">OUR STUDIO</h2>
          <h2 className="display mb-8 hidden text-4xl text-navy md:block">로그인</h2>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-8 text-xs leading-relaxed text-muted">
            초대받은 두 사람만 사용할 수 있는 비공개 작업실입니다. 공개 회원가입은 없습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
