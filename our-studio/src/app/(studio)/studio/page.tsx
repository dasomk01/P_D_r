import { Suspense } from "react";
import { StudioList } from "./studio-list";

export default function StudioPage() {
  return (
    <Suspense>
      <StudioList />
    </Suspense>
  );
}
