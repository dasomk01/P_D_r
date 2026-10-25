import { NextResponse } from "next/server";
import { cors, originOf } from "@/lib/mcp/oauth";

// RFC 8414 — /.well-known/oauth-authorization-server (next.config 의 rewrite 로 연결)
export function GET(req: Request) {
  const o = originOf(req);
  return cors(
    NextResponse.json({
      issuer: o,
      authorization_endpoint: `${o}/oauth/authorize`,
      token_endpoint: `${o}/api/oauth/token`,
      registration_endpoint: `${o}/api/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: ["studio"],
      client_id_metadata_document_supported: true,
    }),
  );
}

export function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
