import { Suspense } from "react";
import { IdeaBoard } from "./idea-board";

export default function IdeasPage() {
  return (
    <Suspense>
      <IdeaBoard />
    </Suspense>
  );
}
