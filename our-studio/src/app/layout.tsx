import type { Metadata, Viewport } from "next";
import "./globals.css";

// next/font 대신 스타일시트 링크 — 빌드 시 폰트 다운로드가 필요 없어 어디서나 동일하게 빌드됩니다.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;600&display=swap";

export const metadata: Metadata = {
  title: "OUR STUDIO",
  description: "둘이 함께 운영하는 콘텐츠 작업실",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf8f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
