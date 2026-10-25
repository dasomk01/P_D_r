"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={`text-xs tracking-wider text-muted hover:text-navy ${className}`}
      onClick={async () => {
        await supabase().auth.signOut();
        router.replace("/login");
        router.refresh();
      }}
    >
      로그아웃
    </button>
  );
}
