"use client";

import { useRouter } from "next/navigation";
import { useLive } from "@/lib/live";
import { getTrips } from "@/lib/queries";
import { PlaceForm, emptyPlace } from "@/components/place-form";
import { Loading, PageHeader } from "@/components/ui";
import { useStudio } from "@/components/studio-context";

export default function NewPlacePage() {
  const router = useRouter();
  const { me } = useStudio();
  const { data: trips } = useLive("trips", getTrips, ["trips"]);
  if (!trips) return <Loading />;
  return (
    <div>
      <PageHeader eyebrow="Travel archive" title="방문 장소 등록" sub="필요한 칸만 채워도 됩니다. 사진은 저장 후 올릴 수 있어요." />
      <PlaceForm
        initial={{ ...emptyPlace(), visitors: [me.user_id] }}
        trips={trips}
        onSaved={(id) => router.push(`/archive/places/${id}?uploaded=0`)}
      />
    </div>
  );
}
