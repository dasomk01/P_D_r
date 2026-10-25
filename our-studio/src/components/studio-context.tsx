"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLive, must } from "@/lib/live";
import { supabase } from "@/lib/supabase/client";
import type { Member, Project, ProjectId } from "@/lib/types";

export interface AiStatus {
  configured: boolean;
  model: string | null;
  features: Record<string, boolean>;
}

interface StudioCtx {
  me: Member;
  members: Member[];
  memberById: (id: string | null | undefined) => Member | undefined;
  projects: Project[];
  project: (id: ProjectId) => Project | undefined;
  ai: AiStatus;
}

const Ctx = createContext<StudioCtx | null>(null);

export function StudioProvider({
  me,
  initialMembers,
  initialProjects,
  ai,
  children,
}: {
  me: Member;
  initialMembers: Member[];
  initialProjects: Project[];
  ai: AiStatus;
  children: ReactNode;
}) {
  const { data: members } = useLive(
    "members",
    async () => must(await supabase().from("members").select("*").order("created_at")) as Member[],
    [],
  );
  const { data: projects } = useLive(
    "projects",
    async () => must(await supabase().from("projects").select("*").order("id")) as Project[],
    ["projects"],
  );
  const value = useMemo<StudioCtx>(() => {
    const ms = members ?? initialMembers;
    const ps = projects ?? initialProjects;
    return {
      me: ms.find((m) => m.user_id === me.user_id) ?? me,
      members: ms,
      memberById: (id) => ms.find((m) => m.user_id === id),
      projects: ps,
      project: (id) => ps.find((p) => p.id === id),
      ai,
    };
  }, [members, projects, initialMembers, initialProjects, me, ai]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudio(): StudioCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStudio outside StudioProvider");
  return v;
}
