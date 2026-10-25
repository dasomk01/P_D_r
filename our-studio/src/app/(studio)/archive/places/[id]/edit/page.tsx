"use client";

import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useLive, must } from "@/lib/live";
import { getTrips } from "@/lib/queries";
import type { Place } from "@/lib/types";
import { PlaceForm } from "@/components/place-form";
import { Loading, PageHeader } from "@/components/ui";

export default function EditPlacePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data } = useLive(
    `place-edit:${id}`,
    async () => {
      const [place, trips] = await Promise.all([
        supabase().from("places").select("*").eq("id", id).single().then((r) => must(r) as Place),
        getTrips(),
      ]);
      return { place, trips };
    },
    [],
  );
  if (!data) return <Loading />;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip server-managed columns
  const { id: _id, created_at: _c, updated_at: _u, created_by: _cb, updated_by: _ub, ...initial } = data.place;
  return (
    <div>
      <PageHeader eyebrow="Travel archive" title={`${data.place.name} 수정`} />
      <PlaceForm initial={initial} trips={data.trips} placeId={id} onSaved={() => router.push(`/archive/places/${id}`)} />
    </div>
  );
}
