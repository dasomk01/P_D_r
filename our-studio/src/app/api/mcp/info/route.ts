import { NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { mcpConfigured, mcpResource, originOf } from "@/lib/mcp/oauth";
import { buildServer, MCP_VERSION } from "@/lib/mcp/tools";

export const dynamic = "force-dynamic";

/**
 * 배포 확인용 (로그인 불필요, 데이터 없음): 지금 배포된 MCP 서버의 버전과 도구 목록.
 * ChatGPT 에 보이는 도구 수와 다르면 ChatGPT 쪽 목록을 새로고침하면 됩니다.
 */
export async function GET(req: Request) {
  const origin = originOf(req);
  const base = {
    name: "OUR STUDIO",
    version: MCP_VERSION,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    endpoint: mcpResource(origin),
    configured: mcpConfigured(),
  };
  if (!mcpConfigured()) return NextResponse.json({ ...base, tools: [], note: "MCP_AUTH_SECRET / SUPABASE_SERVICE_ROLE_KEY 미설정" });
  // 실제 서버 인스턴스에 메모리 안에서 연결해 tools/list 를 그대로 받아옴 (DB 접근 없음)
  const server = buildServer("00000000-0000-0000-0000-000000000000", origin);
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(a);
  const client = new Client({ name: "info", version: "1" });
  await client.connect(b);
  const { tools } = await client.listTools();
  await client.close();
  return NextResponse.json(
    {
      ...base,
      tool_count: tools.length,
      tools: tools.map((t) => ({ name: t.name, title: t.title, read_only: t.annotations?.readOnlyHint ?? false, file_params: (t._meta?.["openai/fileParams"] as string[]) ?? undefined })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
