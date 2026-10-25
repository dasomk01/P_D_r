import "server-only";

import { jwtVerify, SignJWT, type JWTPayload } from "jose";

/**
 * ChatGPT(및 MCP 클라이언트)용 최소 OAuth 2.1 서버.
 * 상태를 DB 에 두지 않도록 클라이언트 ID·인가 코드·토큰을 모두 서명된 JWT 로 만듭니다.
 * MCP_AUTH_SECRET 을 바꾸면 모든 연결이 끊깁니다(전체 로그아웃).
 */

export const ACCESS_TTL_S = 60 * 60;
export const REFRESH_TTL_S = 60 * 60 * 24 * 60;
const CODE_TTL_S = 5 * 60;

export function mcpConfigured(): boolean {
  return Boolean((process.env.MCP_AUTH_SECRET ?? "").length >= 32 && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function key() {
  const s = process.env.MCP_AUTH_SECRET ?? "";
  if (s.length < 32) throw new Error("MCP_AUTH_SECRET 이 설정되지 않았거나 32자보다 짧습니다.");
  return new TextEncoder().encode(s);
}

/** 요청 기준 공개 주소 (Vercel 프록시 헤더 반영). MCP_PUBLIC_URL 로 고정 가능 */
export function originOf(req: Request): string {
  if (process.env.MCP_PUBLIC_URL) return process.env.MCP_PUBLIC_URL.replace(/\/$/, "");
  const h = req.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? new URL(req.url).host;
  const proto = h.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export const mcpResource = (origin: string) => `${origin}/api/mcp`;

// 기본으로 허용하는 리다이렉트 호스트 (ChatGPT, Claude). 피싱 앱이 동의 화면을 악용하지 못하게 제한합니다.
const DEFAULT_REDIRECT_HOSTS = ["chatgpt.com", "chat.openai.com", "openai.com", "claude.ai", "claude.com"];

export function redirectAllowed(uri: string): boolean {
  let u: URL;
  try {
    u = new URL(uri);
  } catch {
    return false;
  }
  const extra = (process.env.MCP_ALLOWED_REDIRECT_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const hosts = [...DEFAULT_REDIRECT_HOSTS, ...extra];
  const hostOk = hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
  if (local) return extra.includes(u.hostname);
  return hostOk && u.protocol === "https:";
}

async function sign(payload: JWTPayload, ttl: number): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttl)
    .setJti(crypto.randomUUID())
    .sign(key());
}

async function verify<T extends JWTPayload>(token: string, typ: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload.typ === typ ? (payload as T) : null;
  } catch {
    return null;
  }
}

// ── 클라이언트 (동적 등록 / 메타데이터 문서) ─────────────────────
export interface ClientInfo {
  client_id: string;
  client_name: string;
  redirect_uris: string[];
}

export async function registerClient(name: string, redirectUris: string[]): Promise<string> {
  return sign({ typ: "client", name, ru: redirectUris }, 60 * 60 * 24 * 365 * 5);
}

export async function resolveClient(clientId: string): Promise<ClientInfo | null> {
  if (/^https:\/\//.test(clientId)) {
    // Client ID Metadata Document (CIMD)
    try {
      const res = await fetch(clientId, { signal: AbortSignal.timeout(5000), headers: { accept: "application/json" } });
      if (!res.ok) return null;
      const doc = (await res.json()) as { client_id?: string; client_name?: string; redirect_uris?: string[] };
      if (doc.client_id && doc.client_id !== clientId) return null;
      return { client_id: clientId, client_name: doc.client_name ?? new URL(clientId).hostname, redirect_uris: doc.redirect_uris ?? [] };
    } catch {
      return null;
    }
  }
  const p = await verify<{ name: string; ru: string[] }>(clientId, "client");
  return p ? { client_id: clientId, client_name: p.name, redirect_uris: p.ru } : null;
}

// ── 인가 코드 / 토큰 ─────────────────────────────────────
export interface CodeClaims extends JWTPayload {
  cid: string;
  ru: string;
  cc: string;
  res: string;
}

export const issueCode = (c: { sub: string; cid: string; ru: string; cc: string; res: string }) =>
  sign({ typ: "code", ...c }, CODE_TTL_S);
export const readCode = (code: string) => verify<CodeClaims>(code, "code");

export async function issueTokens(sub: string, cid: string, res: string) {
  return {
    access_token: await sign({ typ: "access", sub, cid, aud: res }, ACCESS_TTL_S),
    refresh_token: await sign({ typ: "refresh", sub, cid, res }, REFRESH_TTL_S),
    token_type: "Bearer",
    expires_in: ACCESS_TTL_S,
  };
}
export const readRefresh = (t: string) => verify<JWTPayload & { cid: string; res: string }>(t, "refresh");
export const readAccess = (t: string) => verify<JWTPayload & { cid: string }>(t, "access");

/** PKCE S256 */
export async function pkceOk(verifier: string, challenge: string): Promise<boolean> {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  const b64 = Buffer.from(digest).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return b64 === challenge;
}

export function cors(res: Response): Response {
  res.headers.set("access-control-allow-origin", "*");
  res.headers.set("access-control-allow-headers", "authorization, content-type, mcp-protocol-version, mcp-session-id");
  res.headers.set("access-control-allow-methods", "GET, POST, DELETE, OPTIONS");
  res.headers.set("access-control-expose-headers", "www-authenticate, mcp-session-id");
  return res;
}
