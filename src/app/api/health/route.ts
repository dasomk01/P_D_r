import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (!hasSupabaseEnv) {
    return NextResponse.json(
      { ok: false, supabase: "env vars not set" },
      { status: 200 },
    );
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("courses").select("id").limit(1);

    if (error) {
      return NextResponse.json({ ok: false, supabase: error.message }, { status: 200 });
    }

    return NextResponse.json({ ok: true, supabase: "connected" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, supabase: err instanceof Error ? err.message : "unknown error" },
      { status: 200 },
    );
  }
}
