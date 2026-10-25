import { NextResponse, type NextRequest } from "next/server";
import { apiMember } from "@/lib/api-auth";

interface NominatimHit {
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
}

/** OpenStreetMap Nominatim 주소 검색 (무료, API 키 불필요, 저빈도 사용 전제) */
export async function GET(req: NextRequest) {
  const auth = await apiMember();
  if ("error" in auth) return auth.error;
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=kr&accept-language=ko&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "OUR-STUDIO/1.0 (private two-person workspace)" }, cache: "no-store" });
    if (!res.ok) return NextResponse.json({ error: `geocoder ${res.status}` }, { status: 502 });
    const hits = (await res.json()) as NominatimHit[];
    return NextResponse.json({
      results: hits.map((h) => ({
        name: h.name || h.display_name.split(",")[0],
        address: h.display_name,
        lat: Number(h.lat),
        lng: Number(h.lon),
        region: h.address?.city || h.address?.county || h.address?.town || h.address?.province || h.address?.state || "",
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
