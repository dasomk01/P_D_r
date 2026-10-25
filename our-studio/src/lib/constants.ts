import type { AssetKind, AssetOrigin, IdeaStatus, PlaceCategory, ProjectId, ResearchKind } from "./types";

export const PROJECTS: Record<ProjectId, { short: string; accent: string; kind: "travel" | "toon" }> = {
  "korea-trip": { short: "KOREA TRIP", accent: "var(--navy)", kind: "travel" },
  "med-toon": { short: "MED SCHOOL TOON", accent: "var(--rose-deep)", kind: "toon" },
};

export const PROJECT_IDS: ProjectId[] = ["korea-trip", "med-toon"];

export const STATUS_FLOW: IdeaStatus[] = [
  "idea",
  "ai_planning",
  "ready",
  "in_production",
  "in_review",
  "revising",
  "approved",
];

export const STATUS_LABEL: Record<IdeaStatus, string> = {
  idea: "아이디어",
  ai_planning: "AI 기획",
  ready: "제작 대기",
  in_production: "제작 중",
  in_review: "검토 대기",
  revising: "수정 중",
  approved: "승인 완료",
};

export const PRIORITY_LABEL: Record<1 | 2 | 3, string> = { 1: "높음", 2: "보통", 3: "낮음" };

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  restaurant: "음식점",
  cafe: "카페",
  attraction: "관광지",
  hotel: "숙소",
  nature: "자연",
  shopping: "쇼핑",
  activity: "액티비티",
  transport: "교통",
  other: "기타",
};

export const RESEARCH_LABEL: Record<ResearchKind, string> = {
  location: "정확한 위치",
  nearby_attraction: "주변 관광지",
  nearby_food: "주변 카페·음식점",
  route: "추천 동선",
  official_info: "공식 정보·운영시간",
  photo_candidate: "사진 후보 (참고용)",
  content_topic: "콘텐츠 주제 후보",
  note: "메모",
};

export const ASSET_KIND_LABEL: Record<AssetKind, string> = {
  photo: "사진",
  file: "파일",
  character_ref: "캐릭터 원본",
  pose_ref: "표정·포즈 레퍼런스",
  style_ref: "그림체 설정",
  storyboard: "스토리보드",
  page_image: "페이지 이미지",
  final: "완성 이미지",
  other: "기타",
};

export const ORIGIN_LABEL: Record<AssetOrigin, string> = {
  own_photo: "직접 촬영",
  licensed: "라이선스 확보",
  official: "공식 제공(허가 확인)",
  ai_generated: "AI 생성 이미지",
  reference_only: "참고용 (사용 불가)",
  other: "기타",
};

export const USAGE_STATUS_LABEL = {
  reference_only: "참고용 링크만",
  permission_needed: "허가 필요",
  licensed: "라이선스 확인됨",
  public_domain: "퍼블릭 도메인",
} as const;

export const TRAVEL_FORMATS = ["당일치기", "1박 2일", "2박 3일", "교통·여행 팁", "장소 단독 소개"] as const;

export const TRAVEL_PAGE_ROLES = [
  "Cover",
  "Overview / Route",
  "Spot 1",
  "Spot 2",
  "Spot 3",
  "Tips & Transport",
  "Save & Follow",
];
