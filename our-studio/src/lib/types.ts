export type ProjectId = "korea-trip" | "med-toon";

export type IdeaStatus =
  | "idea"
  | "ai_planning"
  | "ready"
  | "in_production"
  | "in_review"
  | "revising"
  | "approved";

export type ContentStatus = Exclude<IdeaStatus, "idea">;

export interface Member {
  user_id: string;
  display_name: string;
  color: string;
  created_at: string;
}

export interface Project {
  id: ProjectId;
  name: string;
  handle: string;
  kind: "travel" | "toon";
  daily_time: string;
  timezone: string;
  description: string;
  settings: {
    pages?: number;
    hashtags?: number;
    sensitive_terms?: string[];
    style?: string;
    cuts_default?: number;
    [k: string]: unknown;
  };
}

export interface Idea {
  id: string;
  project_id: ProjectId;
  title: string;
  memo: string;
  tags: string[];
  links: string[];
  priority: 1 | 2 | 3;
  status: IdeaStatus;
  is_next: boolean;
  place_ids: string[];
  source: "manual" | "ai_suggested" | "imported";
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IdeaVote {
  idea_id: string;
  user_id: string;
}

export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "attraction"
  | "hotel"
  | "nature"
  | "shopping"
  | "activity"
  | "transport"
  | "other";

export interface Trip {
  id: string;
  title: string;
  region: string;
  start_date: string | null;
  end_date: string | null;
  notes: string;
  created_by: string | null;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  region: string;
  address: string;
  lat: number | null;
  lng: number | null;
  status: "visited" | "wishlist";
  category: PlaceCategory;
  trip_id: string | null;
  visited_on: string | null;
  visitors: string[];
  review: string;
  recommended: string;
  price_paid: string;
  pros: string;
  cons: string;
  why_foreigners: string;
  revisit: "yes" | "maybe" | "no" | null;
  links: string[];
  tags: string[];
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ResearchKind =
  | "location"
  | "nearby_attraction"
  | "nearby_food"
  | "route"
  | "official_info"
  | "photo_candidate"
  | "content_topic"
  | "note";

export interface PlaceResearch {
  id: string;
  place_id: string;
  kind: ResearchKind;
  title: string;
  body: string;
  url: string | null;
  source_name: string;
  usage_status: "reference_only" | "permission_needed" | "licensed" | "public_domain";
  license_note: string;
  provenance: "ai" | "manual";
  verified: boolean;
  ai_model: string | null;
  created_by: string | null;
  created_at: string;
}

export type AssetKind =
  | "photo"
  | "file"
  | "character_ref"
  | "pose_ref"
  | "style_ref"
  | "storyboard"
  | "page_image"
  | "final"
  | "other";

export type AssetOrigin =
  | "own_photo"
  | "licensed"
  | "official"
  | "ai_generated"
  | "reference_only"
  | "other";

export interface Asset {
  id: string;
  project_id: ProjectId;
  storage_path: string;
  thumb_path: string | null;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  kind: AssetKind;
  caption: string;
  location_text: string;
  taken_on: string | null;
  uploaded_by: string | null;
  rights_holder: string;
  origin: AssetOrigin;
  usage_allowed: boolean;
  license: string;
  source_url: string | null;
  ai_tags: string[];
  place_id: string | null;
  trip_id: string | null;
  idea_id: string | null;
  content_id: string | null;
  character_id: string | null;
  created_at: string;
}

export interface Character {
  id: string;
  project_id: ProjectId;
  name: string;
  species: string;
  role: string;
  appearance: string;
  personality: string;
  speech_style: string;
  rules: string;
  sort_order: number;
  updated_at: string;
}

export interface Content {
  id: string;
  project_id: ProjectId;
  idea_id: string | null;
  title: string;
  keywords: string[];
  status: ContentStatus;
  scheduled_date: string | null;
  sort_order: number;
  current_version_no: number;
  approved_version_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

/** 여행 캐러셀 한 장 */
export interface TravelPage {
  no: number;
  role: string;
  headline: string;
  body: string;
  asset_id: string | null;
  photo_credit: string;
  notes: string;
}

export interface RouteStop {
  place_id: string | null;
  name: string;
  transport: string;
  duration: string;
  note: string;
}

export interface FactCheck {
  item: string;
  value: string;
  source_url: string;
  verified: boolean;
}

export interface TravelData {
  kind: "travel";
  format: string;
  concept: string;
  route: RouteStop[];
  pages: TravelPage[];
  caption: string;
  hashtags: string[];
  facts: FactCheck[];
  place_ids: string[];
}

export interface ToonLine {
  speaker: string;
  text: string;
}

export interface ToonCut {
  no: number;
  scene: string;
  lines: ToonLine[];
  asset_id: string | null;
  notes: string;
}

export interface ToonData {
  kind: "toon";
  synopsis: string;
  cuts: ToonCut[];
  caption: string;
  hashtags: string[];
  anonymity_checked: boolean;
  anonymity_notes: string;
}

export type ContentData = TravelData | ToonData;

export interface ContentVersion {
  id: string;
  content_id: string;
  version_no: number;
  data: ContentData;
  change_note: string;
  locked: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  content_id: string;
  version_id: string;
  version_no: number;
  approved_by: string;
  approved_at: string;
  note: string;
}

export interface Comment {
  id: string;
  project_id: ProjectId;
  target_type: "idea" | "content" | "place";
  target_id: string;
  version_no: number | null;
  page_no: number | null;
  kind: "comment" | "revision_request";
  body: string;
  resolved: boolean;
  author: string;
  created_at: string;
}

export interface Activity {
  id: number;
  project_id: string | null;
  actor: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  title: string;
  created_at: string;
}
