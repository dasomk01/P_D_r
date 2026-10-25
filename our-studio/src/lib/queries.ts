"use client";

import { supabase } from "./supabase/client";
import { must } from "./live";
import type {
  Activity,
  Approval,
  Asset,
  Character,
  Comment,
  Content,
  ContentVersion,
  Idea,
  IdeaVote,
  Place,
  PlaceResearch,
  ProjectId,
  Trip,
} from "./types";

const sb = () => supabase();

export async function getIdeas(project?: ProjectId): Promise<Idea[]> {
  let q = sb().from("ideas").select("*").order("is_next", { ascending: false }).order("sort_order");
  if (project) q = q.eq("project_id", project);
  return must(await q) as Idea[];
}

export async function getVotes(): Promise<IdeaVote[]> {
  return must(await sb().from("idea_votes").select("idea_id,user_id")) as IdeaVote[];
}

export function voteCounts(votes: IdeaVote[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of votes) out[v.idea_id] = (out[v.idea_id] ?? 0) + 1;
  return out;
}

export async function getPlaces(): Promise<Place[]> {
  return must(await sb().from("places").select("*").order("created_at", { ascending: false })) as Place[];
}

export async function getTrips(): Promise<Trip[]> {
  return must(await sb().from("trips").select("*").order("start_date", { ascending: false, nullsFirst: false })) as Trip[];
}

export async function getResearch(placeId?: string): Promise<PlaceResearch[]> {
  let q = sb().from("place_research").select("*").order("created_at", { ascending: false });
  if (placeId) q = q.eq("place_id", placeId);
  return must(await q) as PlaceResearch[];
}

export async function getAssets(filter: Partial<Record<"project_id" | "place_id" | "trip_id" | "idea_id" | "content_id" | "character_id", string>> = {}): Promise<Asset[]> {
  let q = sb().from("assets").select("*").order("created_at", { ascending: false });
  for (const [k, v] of Object.entries(filter)) if (v) q = q.eq(k, v);
  return must(await q) as Asset[];
}

export async function getContents(project?: ProjectId): Promise<Content[]> {
  let q = sb().from("contents").select("*").order("scheduled_date", { ascending: true, nullsFirst: false }).order("sort_order");
  if (project) q = q.eq("project_id", project);
  return must(await q) as Content[];
}

export async function getVersions(contentId: string): Promise<ContentVersion[]> {
  return must(
    await sb().from("content_versions").select("*").eq("content_id", contentId).order("version_no", { ascending: false }),
  ) as ContentVersion[];
}

export async function getApprovals(contentId?: string): Promise<Approval[]> {
  let q = sb().from("approvals").select("*").order("approved_at", { ascending: false });
  if (contentId) q = q.eq("content_id", contentId);
  return must(await q) as Approval[];
}

export async function getComments(targetType: Comment["target_type"], targetId: string): Promise<Comment[]> {
  return must(
    await sb().from("comments").select("*").eq("target_type", targetType).eq("target_id", targetId).order("created_at"),
  ) as Comment[];
}

export async function getActivity(limit = 20): Promise<Activity[]> {
  return must(await sb().from("activity").select("*").order("created_at", { ascending: false }).limit(limit)) as Activity[];
}

export async function getCharacters(): Promise<Character[]> {
  return must(await sb().from("characters").select("*").order("sort_order")) as Character[];
}
