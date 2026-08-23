import { NextRequest, NextResponse, after } from "next/server";
import { runSummaryRound, type SummaryKind } from "@/lib/summary/run-round";

// Each hop in the round chain gets its own full budget — see run-round.ts
// for why this has to be a separate HTTP-triggered invocation rather than a
// loop inside one function call.
export const maxDuration = 60;

/**
 * Internal worker: runs one more bounded round of summary generation for an
 * already-"generating" row, called by the previous round (see run-round.ts)
 * rather than by the browser. Not authenticated — same posture as the rest
 * of this single-user app's API, which has no end-user auth layer at all.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const kind = body?.kind as SummaryKind | undefined;
  const id = body?.id as string | undefined;
  if ((kind !== "individual" && kind !== "combined") || typeof id !== "string") {
    return NextResponse.json({ error: "kind/id가 필요합니다." }, { status: 400 });
  }

  const baseUrl = new URL(request.url).origin;
  after(() => runSummaryRound(kind, id, baseUrl));

  return NextResponse.json({ ok: true }, { status: 202 });
}
