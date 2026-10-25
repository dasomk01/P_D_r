import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { cors, mcpConfigured, mcpResource, originOf, readAccess } from "@/lib/mcp/oauth";
import { memberById } from "@/lib/mcp/admin";
import { buildServer } from "@/lib/mcp/tools";

export const maxDuration = 60;

function unauthorized(origin: string, description: string) {
  return cors(
    new Response(JSON.stringify({ error: "invalid_token", error_description: description }), {
      status: 401,
      headers: {
        "content-type": "application/json",
        "www-authenticate": `Bearer realm="OUR STUDIO", resource_metadata="${origin}/.well-known/oauth-protected-resource", error="invalid_token"`,
      },
    }),
  );
}

async function handle(req: Request): Promise<Response> {
  const origin = originOf(req);
  if (!mcpConfigured()) {
    return cors(new Response(JSON.stringify({ error: "MCP 연동 준비 중 (MCP_AUTH_SECRET / SUPABASE_SERVICE_ROLE_KEY 미설정)" }), { status: 503, headers: { "content-type": "application/json" } }));
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const claims = token ? await readAccess(token) : null;
  if (!claims || claims.aud !== mcpResource(origin)) return unauthorized(origin, "로그인이 필요합니다");
  const member = await memberById(claims.sub!);
  if (!member) return unauthorized(origin, "멤버가 아닙니다");

  // 무상태(stateless) 모드 — 요청마다 서버를 만들고 JSON 으로 응답
  const server = buildServer(member.user_id, origin);
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  const res = await transport.handleRequest(req);
  return cors(res);
}

export const POST = handle;

// 무상태 서버라 서버→클라이언트 SSE 스트림과 세션 종료가 없습니다 (규격상 405 허용).
// GET 스트림을 열어두면 서버리스 함수가 시간 제한까지 붙잡히므로 바로 거절합니다.
function notAllowed() {
  return cors(new Response(null, { status: 405, headers: { allow: "POST, OPTIONS" } }));
}
export const GET = notAllowed;
export const DELETE = notAllowed;

export function OPTIONS() {
  return cors(new Response(null, { status: 204 }));
}
