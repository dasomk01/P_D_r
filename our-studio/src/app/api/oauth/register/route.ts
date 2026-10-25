import { NextResponse } from "next/server";
import { cors, mcpConfigured, redirectAllowed, registerClient } from "@/lib/mcp/oauth";

// RFC 7591 동적 클라이언트 등록 — 허용된 호스트(ChatGPT·Claude)의 리다이렉트만 받습니다.
export async function POST(req: Request) {
  if (!mcpConfigured()) return cors(NextResponse.json({ error: "server_error", error_description: "MCP not configured" }, { status: 503 }));
  let body: { redirect_uris?: string[]; client_name?: string };
  try {
    body = await req.json();
  } catch {
    return cors(NextResponse.json({ error: "invalid_client_metadata" }, { status: 400 }));
  }
  const uris = (body.redirect_uris ?? []).filter((u) => typeof u === "string");
  if (!uris.length || !uris.every(redirectAllowed)) {
    return cors(NextResponse.json({ error: "invalid_redirect_uri", error_description: "redirect_uri not allowed" }, { status: 400 }));
  }
  const name = (body.client_name ?? "MCP client").slice(0, 80);
  const client_id = await registerClient(name, uris);
  return cors(
    NextResponse.json(
      {
        client_id,
        client_name: name,
        redirect_uris: uris,
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        client_id_issued_at: Math.floor(Date.now() / 1000),
      },
      { status: 201 },
    ),
  );
}

export function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
