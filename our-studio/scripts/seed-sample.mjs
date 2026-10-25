#!/usr/bin/env node
// 샘플 데이터 넣기 (선택). 실제 멤버 계정으로 로그인해 RLS 를 그대로 거칩니다.
// 사용법: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-sample.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.SEED_EMAIL;
const password = process.env.SEED_PASSWORD;
if (!url || !anon || !email || !password) {
  console.error("NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SEED_EMAIL, SEED_PASSWORD 가 필요합니다.");
  process.exit(1);
}
const sb = createClient(url, anon, { auth: { persistSession: false } });
const { data: auth, error: authError } = await sb.auth.signInWithPassword({ email, password });
if (authError) throw authError;
const me = auth.user.id;

function must({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

const trip = must(
  await sb.from("trips").insert({ title: "강릉 1박 2일 (샘플)", region: "강릉", start_date: "2026-09-12", end_date: "2026-09-13", notes: "바다와 순두부" }).select().single(),
);

const places = must(
  await sb
    .from("places")
    .insert([
      {
        name: "초당순두부마을", region: "강릉", address: "강원 강릉시 초당동", lat: 37.7905, lng: 128.9149, status: "visited", category: "restaurant",
        trip_id: trip.id, visited_on: "2026-09-12", visitors: [me],
        review: "아침 일찍 가서 줄 없이 먹었다. 순두부 젤라또까지 코스로 즐기기 좋음.", recommended: "얼큰 순두부, 순두부 젤라또", price_paid: "2인 24,000원",
        pros: "담백하고 고소함, 주차 편함", cons: "주말 점심엔 대기 김", why_foreigners: "Soft tofu is a local specialty made with sea water — mild and vegetarian-friendly.",
        revisit: "yes", tags: ["순두부", "아침"],
      },
      {
        name: "안목해변 커피거리", region: "강릉", address: "강원 강릉시 창해로14번길", lat: 37.7718, lng: 128.9476, status: "visited", category: "cafe",
        trip_id: trip.id, visited_on: "2026-09-12", visitors: [me],
        review: "바다 보이는 카페가 줄지어 있음. 해 질 녘이 제일 예쁨.", pros: "오션뷰", cons: "주차 어려움", revisit: "yes", tags: ["바다", "카페"],
      },
      {
        name: "경포해변", region: "강릉", address: "강원 강릉시 안현동", lat: 37.8055, lng: 128.9087, status: "visited", category: "nature",
        trip_id: trip.id, review: "넓고 깨끗한 해변. 경포호와 함께 산책 코스.", revisit: "maybe", tags: ["바다"],
      },
      { name: "오죽헌", region: "강릉", address: "강원 강릉시 율곡로3139번길 24", lat: 37.7792, lng: 128.8786, status: "wishlist", category: "attraction", tags: ["역사"] },
      {
        name: "해운대해수욕장", region: "부산", address: "부산 해운대구 우동", lat: 35.1587, lng: 129.1604, status: "visited", category: "nature",
        review: "블루라인파크 스카이캡슐과 묶으면 좋다.", why_foreigners: "Easy by subway Line 2; the beach is a 5-min walk from Haeundae Station.", tags: ["바다", "부산"],
      },
    ], { defaultToNull: false })
    .select(),
);

must(
  await sb.from("place_research").insert([
    { place_id: places[0].id, kind: "nearby_attraction", title: "허균·허난설헌 기념공원", body: "초당순두부마을에서 도보 10분.", provenance: "manual", source_name: "샘플" },
    { place_id: places[0].id, kind: "official_info", title: "강릉관광 공식 사이트", url: "https://www.gn.go.kr/tour/", source_name: "강릉시", provenance: "manual" },
    { place_id: places[1].id, kind: "photo_candidate", title: "강릉시 관광 사진 (사용 조건 확인 필요)", url: "https://www.gn.go.kr/tour/", usage_status: "permission_needed", provenance: "manual" },
  ], { defaultToNull: false }),
);

const ideas = must(
  await sb
    .from("ideas")
    .insert([
      { project_id: "korea-trip", title: "부산 해운대 당일치기", tags: ["부산", "바다"], priority: 1, is_next: true },
      { project_id: "korea-trip", title: "외국인을 위한 한국 교통 앱", memo: "카카오맵, 네이버지도, T-money, KTX 앱", tags: ["교통", "팁"] },
      { project_id: "korea-trip", title: "강릉 2박 3일", tags: ["강릉"], place_ids: [places[0].id, places[1].id, places[2].id] },
      { project_id: "med-toon", title: "해부학 시험 전날 생긴 일", memo: "밤새 뼈 이름 외우다 서로 퀴즈 내기", tags: ["시험", "해부학"], priority: 1 },
      { project_id: "med-toon", title: "실습 첫날 가운 사이즈 대참사", tags: ["실습"] },
    ], { defaultToNull: false })
    .select(),
);
must(await sb.from("idea_votes").insert({ idea_id: ideas[0].id }));
must(await sb.from("comments").insert({ project_id: "korea-trip", target_type: "idea", target_id: ideas[0].id, body: "블루라인파크도 같이 넣자!" }));

console.log(`샘플 데이터: 여행 기록 1, 장소 ${places.length}, 조사 자료 3, 아이디어 ${ideas.length}`);
