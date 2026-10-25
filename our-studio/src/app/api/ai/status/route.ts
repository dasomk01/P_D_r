import { NextResponse } from "next/server";
import { aiStatus } from "@/lib/ai/config";
import { apiMember } from "@/lib/api-auth";

export async function GET() {
  const auth = await apiMember();
  if ("error" in auth) return auth.error;
  return NextResponse.json(aiStatus());
}
