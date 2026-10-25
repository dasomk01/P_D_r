import { NextResponse } from "next/server";
import { cors, issueTokens, mcpConfigured, pkceOk, readCode, readRefresh } from "@/lib/mcp/oauth";
import { memberById } from "@/lib/mcp/admin";

function err(error: string, description: string, status = 400) {
  return cors(NextResponse.json({ error, error_description: description }, { status, headers: { "cache-control": "no-store" } }));
}

export async function POST(req: Request) {
  if (!mcpConfigured()) return err("server_error", "MCP not configured", 503);
  const ct = req.headers.get("content-type") ?? "";
  const p = ct.includes("application/json")
    ? new URLSearchParams(Object.entries((await req.json()) as Record<string, string>))
    : new URLSearchParams(await req.text());
  const grant = p.get("grant_type");

  if (grant === "authorization_code") {
    const code = await readCode(p.get("code") ?? "");
    if (!code) return err("invalid_grant", "code expired or invalid");
    if (p.get("client_id") && p.get("client_id") !== code.cid) return err("invalid_grant", "client mismatch");
    if (p.get("redirect_uri") && p.get("redirect_uri") !== code.ru) return err("invalid_grant", "redirect_uri mismatch");
    if (!(await pkceOk(p.get("code_verifier") ?? "", code.cc))) return err("invalid_grant", "PKCE verification failed");
    if (!(await memberById(code.sub!))) return err("invalid_grant", "not a member");
    const tokens = await issueTokens(code.sub!, code.cid, code.res);
    return cors(NextResponse.json({ ...tokens, scope: "studio" }, { headers: { "cache-control": "no-store" } }));
  }

  if (grant === "refresh_token") {
    const r = await readRefresh(p.get("refresh_token") ?? "");
    if (!r) return err("invalid_grant", "refresh token expired or invalid");
    if (p.get("client_id") && p.get("client_id") !== r.cid) return err("invalid_grant", "client mismatch");
    if (!(await memberById(r.sub!))) return err("invalid_grant", "not a member");
    const tokens = await issueTokens(r.sub!, r.cid, r.res);
    return cors(NextResponse.json({ ...tokens, scope: "studio" }, { headers: { "cache-control": "no-store" } }));
  }

  return err("unsupported_grant_type", "use authorization_code or refresh_token");
}

export function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
