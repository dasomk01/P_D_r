export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function nearby<T extends { id: string; lat: number | null; lng: number | null }>(
  origin: T,
  items: T[],
  maxKm = 15,
): { item: T; km: number }[] {
  if (origin.lat == null || origin.lng == null) return [];
  const o = { lat: origin.lat, lng: origin.lng };
  return items
    .filter((p) => p.id !== origin.id && p.lat != null && p.lng != null)
    .map((p) => ({ item: p, km: haversineKm(o, { lat: p.lat!, lng: p.lng! }) }))
    .filter((x) => x.km <= maxKm)
    .sort((a, b) => a.km - b.km);
}
