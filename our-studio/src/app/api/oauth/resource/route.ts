import { NextResponse } from "next/server";
import { cors, mcpResource, originOf } from "@/lib/mcp/oauth";

// RFC 9728 — /.well-known/oauth-protected-resource
export function GET(req: Request) {
  const o = originOf(req);
  return cors(
    NextResponse.json({
      resource: mcpResource(o),
      authorization_servers: [o],
      bearer_methods_supported: ["header"],
      scopes_supported: ["studio"],
      resource_name: "OUR STUDIO",
    }),
  );
}

export function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
