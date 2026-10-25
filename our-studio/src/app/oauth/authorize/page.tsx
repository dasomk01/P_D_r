import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireMember } from "@/lib/supabase/server";
import { issueCode, mcpConfigured, mcpResource, redirectAllowed, resolveClient } from "@/lib/mcp/oauth";

/**
 * OAuth 동의 화면. ChatGPT 등에서 "연결"을 누르면 이 화면으로 옵니다.
 * OUR STUDIO 에 로그인한 멤버가 허용해야만 인가 코드가 발급됩니다.
 */

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function origin() {
  if (process.env.MCP_PUBLIC_URL) return process.env.MCP_PUBLIC_URL.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}

function back(redirectUri: string, params: Record<string, string>) {
  const u = new URL(redirectUri);
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  return u.toString();
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ivory px-6 py-16">
      <div className="w-full max-w-md">
        <p className="display mb-8 text-center text-3xl text-navy">
          OUR <em className="text-rose-deep">Studio</em>
        </p>
        <div className="card p-7">{children}</div>
      </div>
    </main>
  );
}

function Problem({ message }: { message: string }) {
  return (
    <Shell>
      <p className="eyebrow mb-2">Connection error</p>
      <h1 className="display mb-3 text-2xl text-navy">연결할 수 없습니다</h1>
      <p className="text-sm text-muted">{message}</p>
    </Shell>
  );
}

export default async function AuthorizePage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const q = {
    client_id: one(sp.client_id),
    redirect_uri: one(sp.redirect_uri),
    response_type: one(sp.response_type),
    state: one(sp.state),
    code_challenge: one(sp.code_challenge),
    code_challenge_method: one(sp.code_challenge_method),
    resource: one(sp.resource),
  };

  if (!mcpConfigured()) return <Problem message="서버에 MCP 연동 설정(MCP_AUTH_SECRET, SUPABASE_SERVICE_ROLE_KEY)이 아직 없습니다." />;
  const client = q.client_id ? await resolveClient(q.client_id) : null;
  if (!client) return <Problem message="알 수 없는 앱입니다. ChatGPT 에서 커넥터를 다시 추가해 주세요." />;
  if (!q.redirect_uri || !client.redirect_uris.includes(q.redirect_uri) || !redirectAllowed(q.redirect_uri))
    return <Problem message="허용되지 않은 리다이렉트 주소입니다." />;
  if (q.response_type !== "code" || !q.code_challenge || q.code_challenge_method !== "S256")
    return <Problem message="지원하지 않는 요청 형식입니다 (PKCE S256 필요)." />;

  const o = await origin();
  const resource = q.resource || mcpResource(o);
  if (resource !== mcpResource(o)) return <Problem message="요청한 리소스 주소가 이 사이트와 다릅니다." />;

  const { user, member } = await requireMember();
  if (!user) {
    const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v)).toString();
    redirect(`/login?next=${encodeURIComponent(`/oauth/authorize?${qs}`)}`);
  }
  if (!member) return <Problem message={`${user.email} 계정은 OUR STUDIO 멤버가 아닙니다.`} />;

  async function approve() {
    "use server";
    const { user: u, member: m } = await requireMember();
    if (!u || !m) redirect("/login");
    const code = await issueCode({ sub: u.id, cid: q.client_id, ru: q.redirect_uri, cc: q.code_challenge, res: resource });
    redirect(back(q.redirect_uri, { code, state: q.state }));
  }

  async function deny() {
    "use server";
    redirect(back(q.redirect_uri, { error: "access_denied", state: q.state }));
  }

  const host = new URL(q.redirect_uri).hostname;
  return (
    <Shell>
      <p className="eyebrow mb-2">Connect an app</p>
      <h1 className="display mb-4 text-3xl leading-tight text-navy">
        <span className="text-rose-deep">{client.client_name}</span> 연결을 허용할까요?
      </h1>
      <p className="mb-5 text-sm text-muted">
        <b className="text-navy">{member.display_name}</b> 님 계정으로 연결되며, 요청한 곳은 <b className="text-navy">{host}</b> 입니다.
      </p>
      <ul className="mb-6 space-y-2 text-sm">
        <li>· 아이디어 보드, 여행 아카이브(후기·조사 자료), 콘텐츠, 캐릭터 설정을 읽습니다</li>
        <li>· 아이디어, 콘텐츠 <b>초안</b>, 장소 조사 자료를 저장할 수 있습니다</li>
        <li className="text-muted">· 승인·삭제·인스타그램 게시는 할 수 없습니다</li>
        <li className="text-muted">· 방문 날짜·방문자·금지어 목록은 전달하지 않습니다</li>
      </ul>
      <div className="flex gap-2">
        <form action={deny} className="flex-1">
          <button className="w-full rounded-[3px] border border-line px-4 py-2.5 text-sm text-muted hover:text-navy">거부</button>
        </form>
        <form action={approve} className="flex-1">
          <button className="w-full rounded-[3px] bg-navy px-4 py-2.5 text-sm text-ivory hover:bg-navy-soft" data-testid="oauth-approve">
            허용
          </button>
        </form>
      </div>
      <p className="mt-5 text-[0.7rem] leading-relaxed text-muted">연결을 끊으려면 ChatGPT 설정에서 커넥터를 삭제하세요.</p>
    </Shell>
  );
}
