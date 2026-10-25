import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // 저장소 루트에 다른 Next 앱(SOM STUDY)이 있으므로 이 폴더를 루트로 고정
  turbopack: { root: here },
  outputFileTracingRoot: here,
};

export default nextConfig;
