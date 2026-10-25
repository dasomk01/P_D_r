import { Suspense } from "react";
import { BulkUpload } from "./bulk-upload";

export default function UploadPage() {
  return (
    <Suspense>
      <BulkUpload />
    </Suspense>
  );
}
