import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // 저장소 루트에 다른 Next 앱(SOM STUDY)이 있으므로 이 폴더를 루트로 고정
  turbopack: { root: here },
  outputFileTracingRoot: here,
  // MCP(ChatGPT 커넥터) OAuth 메타데이터. 경로 뒤에 리소스 경로가 붙는 형태(RFC 9728)도 처리
  async rewrites() {
    return [
      { source: "/.well-known/oauth-authorization-server", destination: "/api/oauth/metadata" },
      { source: "/.well-known/oauth-authorization-server/:path*", destination: "/api/oauth/metadata" },
      { source: "/.well-known/openid-configuration", destination: "/api/oauth/metadata" },
      { source: "/.well-known/oauth-protected-resource", destination: "/api/oauth/resource" },
      { source: "/.well-known/oauth-protected-resource/:path*", destination: "/api/oauth/resource" },
    ];
  },
};

export default nextConfig;
