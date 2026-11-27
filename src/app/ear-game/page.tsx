import type { Metadata } from "next";
import { EarGame } from "@/components/ear-game";

export const metadata: Metadata = {
  title: "귀찢기 게임",
  description: "귀를 최대한 늘리되, 찢어지기 전에 놓으세요!",
};

export default function EarGamePage() {
  return <EarGame />;
}
