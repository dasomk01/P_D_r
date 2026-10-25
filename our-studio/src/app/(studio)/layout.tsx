import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireMember } from "@/lib/supabase/server";
import { aiStatus } from "@/lib/ai/config";
import { SetupNotice } from "@/components/setup-notice";
import { StudioProvider } from "@/components/studio-context";
import { Shell } from "@/components/shell";
import { SignOutButton } from "@/components/sign-out";
import type { Member, Project } from "@/lib/types";

export default async function StudioLayout({ children }: LayoutProps<"/">) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const { sb, user, member } = await requireMember();
  if (!user) redirect("/login");
  if (!member) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="eyebrow mb-3">Invitation only</p>
        <h1 className="display mb-4 text-4xl text-navy">초대되지 않은 계정입니다</h1>
        <p className="mb-8 text-sm text-muted">
          {user.email} 계정은 OUR STUDIO 멤버로 등록되어 있지 않습니다. 관리자에게 초대를 요청하세요.
        </p>
        <SignOutButton />
      </main>
    );
  }
  const [{ data: members }, { data: projects }] = await Promise.all([
    sb.from("members").select("*").order("created_at"),
    sb.from("projects").select("*").order("id"),
  ]);
  return (
    <StudioProvider
      me={member as Member}
      initialMembers={(members ?? []) as Member[]}
      initialProjects={(projects ?? []) as Project[]}
      ai={aiStatus()}
    >
      <Shell>{children}</Shell>
    </StudioProvider>
  );
}
