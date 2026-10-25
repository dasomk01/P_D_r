import { Suspense } from "react";
import { Library } from "./library";

export default function LibraryPage() {
  return (
    <Suspense>
      <Library />
    </Suspense>
  );
}
