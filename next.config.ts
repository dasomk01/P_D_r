import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The summary PDF generator reads these Korean font files off disk at
  // runtime (fs.readFileSync with a computed path, not an import) so the
  // bundler doesn't try to parse them as JS modules — but that also means
  // Next.js's automatic serverless file tracing can miss them. Force them in.
  outputFileTracingIncludes: {
    "/api/*": [
      "./node_modules/pretendard/dist/public/static/alternative/Pretendard-Regular.ttf",
      "./node_modules/pretendard/dist/public/static/alternative/Pretendard-Bold.ttf",
    ],
  },
};

export default nextConfig;
