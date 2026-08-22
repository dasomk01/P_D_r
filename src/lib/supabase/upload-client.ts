"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file straight from the browser to Supabase Storage using a
 * signed upload URL (from createSignedUploadUrl on the server) — never
 * passes through our own API, so it isn't subject to Vercel's serverless
 * function request body size limit.
 */
export async function uploadFileDirect(
  bucket: string,
  path: string,
  token: string,
  file: File,
  contentType: string,
) {
  const supabase = createClient();
  return supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, { contentType });
}
