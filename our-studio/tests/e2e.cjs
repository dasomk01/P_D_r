// OUR STUDIO 종단 간 검증 (로컬 Supabase + next dev 필요)
// 실행: BASE=http://localhost:3100 node tests/e2e.cjs
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:3100";
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ART = path.join(__dirname, ".artifacts");
const PHOTOS = path.join(ART, "photos");
const SHOTS = path.join(ART, "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const STEPS = (process.env.STEPS || "all").split(",");
const run = (s) => STEPS.includes("all") || STEPS.includes(s);

let passed = 0;
const results = [];
function ok(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
  passed++;
  results.push("✓ " + msg);
  console.log("✓", msg);
}

async function login(browser, email, viewport = { width: 1360, height: 900 }) {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true, locale: "ko-KR", timezoneId: "Asia/Seoul" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[pageerror ${email}]`, e.message));
  await page.goto(BASE + "/");
  await page.waitForURL(/\/login/);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', "test-pass-1234");
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30000 });
  return { ctx, page };
}

async function shot(page, name, full = true) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: full });
}

(async () => {
  const browser = await chromium.launch();
  try {
    // ── 1. 권한: 초대되지 않은 계정 / RLS ────────────────────
    if (run("auth")) {
      const s = await login(browser, "stranger@ourstudio.test");
      await s.page.waitForSelector("text=초대되지 않은 계정입니다");
      ok(true, "초대되지 않은 계정은 작업실에 들어갈 수 없음");
      await s.ctx.close();
      const sb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
      await sb.auth.signInWithPassword({ email: "stranger@ourstudio.test", password: "test-pass-1234" });
      const { data: rows } = await sb.from("ideas").select("id");
      ok(rows.length === 0, "RLS: 비멤버는 아이디어를 읽을 수 없음 (0건)");
      const ins = await sb.from("ideas").insert({ project_id: "korea-trip", title: "hack" });
      ok(!!ins.error, "RLS: 비멤버는 아이디어를 쓸 수 없음");
      const up = await sb.storage.from("studio").upload("korea-trip/x.txt", new Blob(["x"]));
      ok(!!up.error, "Storage RLS: 비멤버는 파일을 올릴 수 없음");
      const anonSb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
      const { data: anonRows } = await anonSb.from("places").select("id");
      ok(anonRows.length === 0, "RLS: 로그인 안 한 요청은 장소를 읽을 수 없음");
    }

    const A = await login(browser, "bunny@ourstudio.test");
    const B = await login(browser, "bear@ourstudio.test");

    // ── 2. 대시보드 ───────────────────────────────────────
    if (run("dashboard")) {
      await A.page.waitForSelector("text=Good to see you");
      await A.page.waitForSelector("text=Next up · 다음 제작 추천");
      ok(await A.page.isVisible("text=부산 해운대 당일치기"), "대시보드: '다음 제작' 아이디어가 추천 1순위로 표시");
      await shot(A.page, "01-dashboard");
    }

    // ── 3. 아이디어: 한 줄 저장, 유사 감지, 실시간 동기화, 투표, 댓글 ─
    if (run("ideas")) {
      await B.page.goto(BASE + "/ideas?p=korea-trip");
      await B.page.waitForSelector('[data-testid="idea-card"]');
      await A.page.goto(BASE + "/ideas?p=korea-trip");
      const input = A.page.locator('input[aria-label="아이디어 한 줄"]');
      await input.fill("해운대 당일치기 코스");
      await A.page.waitForSelector('[data-testid="similar-warning"]');
      ok(true, "아이디어 입력 중 유사 아이디어 경고 표시");
      await input.fill("전주 한옥마을 당일치기");
      await A.page.click('button:has-text("저장")');
      await A.page.waitForSelector("text=전주 한옥마을 당일치기");
      ok(true, "한 줄짜리 아이디어 저장");
      await B.page.waitForSelector("text=전주 한옥마을 당일치기", { timeout: 15000 });
      ok(true, "실시간: 상대방(곰) 화면에 새 아이디어가 자동으로 나타남");
      const card = B.page.locator('[data-testid="idea-card"]', { hasText: "전주 한옥마을 당일치기" });
      await card.locator('[data-testid="vote"]').click();
      await A.page.locator('[data-testid="idea-card"]', { hasText: "전주 한옥마을 당일치기" }).locator('[data-testid="vote"]:has-text("1")').waitFor({ timeout: 15000 });
      ok(true, "투표가 상대방 화면에 실시간 반영");
      await A.page.locator('[data-testid="idea-card"]', { hasText: "전주 한옥마을 당일치기" }).locator("a").first().click();
      await A.page.waitForURL(/\/ideas\/[0-9a-f-]+/);
      const ideaUrl = A.page.url();
      await A.page.fill('textarea[placeholder="의견을 남겨주세요"]', "한옥마을 + 전주 비빔밥 코스로!");
      await A.page.click('button:has-text("등록")');
      await B.page.goto(ideaUrl);
      await B.page.waitForSelector("text=한옥마을 + 전주 비빔밥 코스로!");
      ok(true, "댓글이 상대방에게 보임");
      await B.page.fill('textarea[placeholder="의견을 남겨주세요"]', "좋아 다음 제작으로 하자");
      await B.page.click('button:has-text("등록")');
      await A.page.waitForSelector("text=좋아 다음 제작으로 하자", { timeout: 15000 });
      ok(true, "상대방 댓글이 실시간으로 내 화면에 나타남");
      await A.page.click('button:has-text("다음 제작으로")');
      await A.page.waitForSelector("text=★ 다음 제작");
      ok(true, "다음 제작으로 지정");
      await shot(A.page, "02-idea-detail");
      await A.page.goto(BASE + "/ideas?p=korea-trip");
      await A.page.click('button:has-text("AI 주제 제안")');
      await A.page.waitForSelector("text=연동 준비 중");
      ok(true, "AI 키가 없으면 AI 주제 제안은 '연동 준비 중'으로 표시 (가짜 동작 없음)");
      await A.page.keyboard.press("Escape");
      await A.page.click('button:has-text("가져오기")');
      await A.page.fill("textarea", "- 경주 1박 2일\n- 외국인을 위한 KTX 예매 팁");
      await A.page.click('button:has-text("공동 아이디어로 저장")');
      await A.page.waitForSelector("text=외국인을 위한 KTX 예매 팁");
      ok(true, "직접 붙여넣은 아이디어만 가져오기");
      await A.page.fill('input[placeholder="검색 (제목·메모·태그)"]', "KTX");
      ok((await A.page.locator('[data-testid="idea-card"]').count()) === 1, "아이디어 검색");
      await A.page.fill('input[placeholder="검색 (제목·메모·태그)"]', "");
      await shot(A.page, "03-ideas");
    }

    // ── 4. 여행 아카이브: 장소 사진 업로드, 권리 정보, 일괄 업로드 ───
    if (run("archive")) {
      await A.page.goto(BASE + "/archive");
      await A.page.waitForSelector(".leaflet-container");
      ok(true, "지도 기반 아카이브 표시");
      await shot(A.page, "04-archive-map");
      await A.page.click('button:has-text("목록")');
      await A.page.locator('[data-testid="place-card"]', { hasText: "초당순두부마을" }).locator("a").nth(1).click();
      await A.page.waitForURL(/\/archive\/places\//);
      const placeUrl = A.page.url();
      await A.page.waitForSelector('[data-testid="our-experience"]');
      await A.page.setInputFiles('[data-testid="file-input"]', [path.join(PHOTOS, "tofu.jpg"), path.join(PHOTOS, "sea.jpg"), path.join(PHOTOS, "street.jpg")]);
      await A.page.waitForSelector("text=사진 보관함 · 3", { timeout: 30000 });
      ok(true, "장소에 사진 여러 장 업로드 (썸네일 생성 포함)");
      await B.page.goto(placeUrl);
      await B.page.waitForSelector("text=사진 보관함 · 3", { timeout: 15000 });
      ok(true, "업로드한 사진이 상대방에게도 보임");
      ok(await A.page.isVisible("text=우리의 실제 경험") && (await A.page.isVisible("text=조사 자료")), "직접 경험과 조사 자료가 분리 표시");
      ok(await A.page.isVisible("text=AI 주변 자료 수집"), "AI 조사 미연결 시 '연동 준비 중' 표시");
      // 사진 정보 편집
      await A.page.locator("section:has-text('사진 보관함') button:has(img)").first().click();
      const dlg = A.page.locator('[role="dialog"]');
      await dlg.locator("text=출처 · 권리").waitFor();
      await dlg.locator("textarea").first().fill("아침 순두부 한 상");
      await dlg.locator('label:has-text("촬영자·권리자") input').fill("토끼 (직접 촬영)");
      await dlg.locator('button:has-text("저장")').click();
      await dlg.waitFor({ state: "detached" });
      await A.page.waitForSelector("section:has-text('사진 보관함') >> text=아침 순두부 한 상", { timeout: 15000 });
      {
        const sb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
        await sb.auth.signInWithPassword({ email: "bunny@ourstudio.test", password: "test-pass-1234" });
        const { data } = await sb.from("assets").select("caption,rights_holder").eq("caption", "아침 순두부 한 상");
        ok(data.length === 1 && data[0].rights_holder === "토끼 (직접 촬영)", "사진 설명·권리자 편집이 DB 에 저장");
      }
      await shot(A.page, "05-place-detail");
      // 근처 장소
      ok(await A.page.isVisible("text=안목해변 커피거리"), "근처 장소(거리 기반) 탐색");

      // 일괄 업로드 → 장소 연결
      await A.page.goto(BASE + "/archive?");
      await A.page.getByRole("button", { name: /^여행 기록 \d+$/ }).click();
      await A.page.click('a:has-text("사진 올리기·정리")');
      await A.page.waitForURL(/\/archive\/upload\?trip=/);
      await A.page.setInputFiles('[data-testid="file-input"]', [path.join(PHOTOS, "cafe.jpg"), path.join(PHOTOS, "hotel.jpg")]);
      await A.page.waitForFunction(() => document.querySelectorAll('[data-testid="bulk-photo"]').length >= 2, null, { timeout: 30000 });
      const sel = A.page.locator('[data-testid="bulk-photo"] select').first();
      await sel.selectOption({ label: "안목해변 커피거리" });
      await A.page.waitForTimeout(1500);
      const { count } = await (async () => {
        const sb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
        await sb.auth.signInWithPassword({ email: "bunny@ourstudio.test", password: "test-pass-1234" });
        const { data: pl } = await sb.from("places").select("id").eq("name", "안목해변 커피거리").single();
        return sb.from("assets").select("id", { count: "exact", head: true }).eq("place_id", pl.id);
      })();
      ok(count === 1, "일괄 업로드한 사진을 장소에 연결");
      await shot(A.page, "06-bulk-upload");
    }

    // ── 5. 콘텐츠 제작 → 검토 → 승인 → 새 버전 → ZIP ─────────
    let contentUrl;
    if (run("content")) {
      await A.page.goto(BASE + "/studio?p=korea-trip");
      await A.page.click('button:has-text("+ 새 콘텐츠")');
      await A.page.fill('input[placeholder="예: 강릉 2박 3일"]', "강릉 2박 3일");
      await A.page.waitForSelector('[data-testid="archive-match"]');
      ok(true, "새 콘텐츠 주제 입력 시 아카이브 자료 자동 연결 미리보기");
      await A.page.click('button:has-text("제작 시작")');
      await A.page.waitForURL(/\/studio\/[0-9a-f-]+$/);
      contentUrl = A.page.url();
      await A.page.waitForSelector('[data-testid="archive-panel"]');
      ok(await A.page.locator('[data-testid="archive-panel"]').isVisible() && (await A.page.isVisible("text=직접 경험 · 우리 후기")), "제작실: 직접 경험/AI 조사 구분된 아카이브 패널");
      ok(await A.page.locator('[data-testid="page-editor"]').count() === 7, "여행 캐러셀 7장 템플릿");
      await A.page.waitForSelector('[data-testid="issues"]');
      ok(await A.page.isVisible("text=정확히 5개여야"), "해시태그 5개 규칙 검수");
      const pages = A.page.locator('[data-testid="page-editor"]');
      const headlines = ["Gangneung in 3 Days", "Your Route at a Glance", "Chodang Soft Tofu Village", "Anmok Coffee Street", "Gyeongpo Beach", "Getting Around", "Save for Your Trip"];
      for (let i = 0; i < 7; i++) {
        await pages.nth(i).locator('input[placeholder="Headline (English)"]').fill(headlines[i]);
        await pages.nth(i).locator('textarea[placeholder="Body copy (English)"]').fill(`Body copy for slide ${i + 1}.`);
      }
      await pages.nth(0).locator("button").first().click();
      await A.page.locator('[data-testid="pick-photo"]').first().click();
      await A.page.fill("text=Instagram caption (English) >> xpath=.. >> textarea", "Three slow days on Korea's east coast.");
      const tagInputs = A.page.locator('input[placeholder^="#tag"]');
      for (const [i, t] of ["gangneung", "koreatravel", "eastsea", "visitkorea", "tofu"].entries()) await tagInputs.nth(i).fill(t);
      await A.page.waitForSelector("text=정확히 5개여야", { state: "detached" });
      ok(true, "해시태그 5개 입력 시 검수 통과");
      await A.page.click('button:has-text("v1 저장")');
      await A.page.waitForSelector("text=저장 안 됨", { state: "detached" });
      ok(true, "콘텐츠 v1 저장");
      await shot(A.page, "07-studio-editor");
      await A.page.click('button:has-text("검토 요청")');
      await A.page.waitForSelector('[data-testid="page-tile"]');
      ok((await A.page.locator('[data-testid="page-tile"]').count()) === 7, "전체 페이지 미리보기 7장");

      // 곰: 페이지별 댓글 + 수정 요청
      await B.page.goto(contentUrl);
      await B.page.click('button:has-text("검토 · 승인")');
      await B.page.locator('[data-testid="page-tile"]').nth(2).click();
      await B.page.waitForSelector("text=3번 페이지 댓글");
      await B.page.locator('[role="dialog"] textarea').fill("가격 정보 넣어줘");
      await B.page.locator('[role="dialog"] button:has-text("등록")').click();
      await B.page.waitForSelector('[role="dialog"] >> text=가격 정보 넣어줘');
      ok(true, "페이지별 댓글 (확대 화면)");
      await B.page.keyboard.press("Escape");
      await B.page.selectOption('select[aria-label="수정 요청 페이지"]', "3");
      await B.page.fill('textarea[placeholder="무엇을 고치면 좋을까요?"]', "3번 페이지 제목을 더 짧게");
      await B.page.click('button:has-text("수정 요청 보내기")');
      await A.page.waitForSelector("text=수정 중", { timeout: 15000 });
      ok(true, "수정 요청 → 상태 '수정 중' 실시간 반영");

      // 토끼: 수정 후 저장
      await A.page.click('button:has-text("제작")');
      await pages.nth(2).locator('input[placeholder="Headline (English)"]').fill("Soft Tofu Village");
      await A.page.click('button:has-text("v1 저장")');
      await A.page.waitForSelector("text=저장 안 됨", { state: "detached" });

      // 곰: 승인 (한 명만 승인해도 완료)
      await B.page.reload();
      await B.page.click('button:has-text("검토 · 승인")');
      B.page.once("dialog", (d) => d.accept());
      await B.page.click('[data-testid="approve"]');
      await B.page.waitForSelector("text=✓ v1 승인 완료");
      await B.page.waitForSelector('[data-testid="approval-history"] >> text=곰');
      ok(true, "한 명(곰) 승인으로 최종 승인 완료, 승인자·버전 기록");
      await shot(B.page, "08-review-approved");
      await A.page.waitForSelector("text=승인본 v1", { timeout: 15000 });
      ok(true, "승인 상태가 토끼 화면에도 실시간 반영");

      // DB 수준: 승인 버전은 수정 불가
      const sb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
      await sb.auth.signInWithPassword({ email: "bunny@ourstudio.test", password: "test-pass-1234" });
      const cid = contentUrl.split("/").pop();
      const { data: v1 } = await sb.from("content_versions").select("*").eq("content_id", cid).eq("version_no", 1).single();
      const tamper = await sb.from("content_versions").update({ data: { ...v1.data, caption: "tampered" } }).eq("id", v1.id);
      ok(!!tamper.error, "DB: 승인된 버전은 직접 수정해도 거부됨");

      // 승인 후 수정 → v2
      await A.page.reload();
      await A.page.waitForSelector("text=승인되어 잠겨 있습니다");
      await pages.nth(5).locator('textarea[placeholder="Body copy (English)"]').fill("Take the KTX from Seoul Station — about 2 hours.");
      await A.page.click('button:has-text("v2 로 저장")');
      await A.page.waitForSelector("text=v2", { timeout: 15000 });
      await A.page.waitForSelector("header >> text=수정 중");
      ok(true, "승인본 수정 시 v2 새 버전 생성 + 재승인 필요(수정 중)");
      await A.page.click('button:has-text("버전 2")');
      await A.page.waitForSelector('[data-testid="compare-row"]');
      ok((await A.page.locator('[data-testid="compare-row"]:has-text("변경됨")').count()) >= 1, "이전 버전 비교에서 변경된 페이지 표시");
      await shot(A.page, "09-versions");

      // ZIP 다운로드
      await A.page.click('button:has-text("다운로드")');
      const [dl] = await Promise.all([A.page.waitForEvent("download"), A.page.click('button:has-text("ZIP 다운로드")')]);
      const zipPath = path.join(ART, "export.zip");
      await dl.saveAs(zipPath);
      const zip = await JSZip.loadAsync(fs.readFileSync(zipPath));
      const names = Object.keys(zip.files);
      ok(names.includes("01.jpg") && names.includes("preview.jpg") && names.includes("caption.txt") && names.includes("credits.txt"), `ZIP 구성: ${names.join(", ")}`);
      const cap = await zip.file("caption.txt").async("string");
      ok(cap.includes("#gangneung") && cap.includes("Three slow days"), "ZIP caption.txt 에 승인본 캡션·해시태그 포함");
      fs.writeFileSync(path.join(SHOTS, "preview-from-zip.jpg"), await zip.file("preview.jpg").async("nodebuffer"));
      await shot(A.page, "10-download");

      // 중복 경고
      await A.page.goto(BASE + "/studio?p=korea-trip");
      await A.page.click('button:has-text("+ 새 콘텐츠")');
      await A.page.fill('input[placeholder="예: 강릉 2박 3일"]', "강릉 2박3일 여행");
      await A.page.waitForSelector('[data-testid="dupe-warning"]');
      ok(true, "최근 30일 중복 주제 경고");
      await A.page.keyboard.press("Escape");
    }

    // ── 6. 인스타툰: 금지어 등록 → 익명성 검수 ─────────────────
    if (run("toon")) {
      await A.page.goto(BASE + "/settings");
      const ti = A.page.locator("section:has-text('인스타툰 금지어') input");
      await ti.fill("김철수");
      await ti.press("Enter");
      await A.page.click('button:has-text("금지어 저장")');
      await A.page.waitForSelector("text=금지어를 저장했습니다");
      await A.page.goto(BASE + "/ideas?p=med-toon");
      await A.page.locator('[data-testid="idea-card"]', { hasText: "해부학 시험 전날 생긴 일" }).locator("a").first().click();
      await A.page.click('button:has-text("빈 템플릿으로 제작 시작"), button:has-text("새 콘텐츠 하나 더 만들기")');
      await A.page.waitForURL(/\/studio\//);
      await A.page.waitForSelector('[data-testid="cut-editor"]');
      const cut = A.page.locator('[data-testid="cut-editor"]').first();
      await cut.locator("textarea").first().fill("도서관, 토끼와 곰이 뼈 모형을 들고 있다");
      await cut.locator('button:has-text("+ 대사")').click();
      await cut.locator('input[placeholder="대사"]').fill("김철수 선배가 한국의과대학 20241234 학번이래");
      await A.page.waitForSelector('[data-testid="issues"] >> text=등록된 금지어');
      ok(await A.page.isVisible('[data-testid="issues"] >> text=학교'), "익명성 검수: 금지어·학교명·학번 감지");
      await cut.locator('input[placeholder="대사"]').fill("오늘 밤새면 다 외울 수 있어!");
      await A.page.waitForFunction(() => !document.querySelector('[data-testid="issues"]')?.textContent?.includes("익명성"));
      ok(true, "익명성 문제 해결 시 익명성 경고 사라짐");
      ok(await A.page.isVisible('[data-testid="issues"] >> text=정확히 5개'), "툰도 해시태그 정확히 5개 규칙 검수");
      await A.page.click('button:has-text("v1 저장")');
      await A.page.waitForSelector("text=저장 안 됨", { state: "detached" });
      await shot(A.page, "11-toon-editor");
      await A.page.goto(BASE + "/characters");
      await A.page.waitForSelector('[data-testid="character"]');
      ok((await A.page.locator('[data-testid="character"]').count()) === 2, "캐릭터 설정집: 흰 토끼·갈색 곰");
      await shot(A.page, "12-characters");
    }

    // ── 7. 캘린더 · 자료 보관함 · 백업 ───────────────────────
    if (run("calendar")) {
      const sb = createClient(SB_URL, ANON, { auth: { persistSession: false } });
      await sb.auth.signInWithPassword({ email: "bunny@ourstudio.test", password: "test-pass-1234" });
      await sb.rpc("create_content", { p_project_id: "korea-trip", p_title: "서울 야경 명소 (e2e)", p_data: { kind: "travel", format: "당일치기", concept: "", route: [], pages: [], caption: "", hashtags: [], facts: [], place_ids: [] } });
      await A.page.goto(BASE + "/calendar");
      await A.page.waitForSelector('[data-testid="queue"] li a');
      A.page.once("dialog", (d) => d.accept());
      await A.page.click('button:has-text("오늘부터 하루 하나씩 배치")');
      await A.page.waitForFunction(() => !document.querySelector('[data-testid="queue"]').innerText.includes("미정"), null, { timeout: 15000 });
      const titles = async () => A.page.locator('[data-testid="queue"] li a').allInnerTexts();
      const before = await titles();
      await A.page.locator('[data-testid="queue"] li').nth(1).locator('button[aria-label="위로"]').click();
      await A.page.waitForFunction((t) => document.querySelector('[data-testid="queue"] li a').innerText === t, before[1], { timeout: 15000 });
      const after = await titles();
      ok(after[0] === before[1] && after[1] === before[0], "캘린더: 제작 순서 변경 (날짜 교환)");
      ok(await A.page.isVisible("text=자동 제작 스케줄 실행"), "자동 제작 미연동 명시");
      await shot(A.page, "13-calendar");
      await A.page.goto(BASE + "/library?p=korea-trip");
      await A.page.waitForSelector('[data-testid="library-item"]');
      ok((await A.page.locator('[data-testid="library-item"]').count()) >= 5, "자료 보관함에 업로드 자료 표시");
      await shot(A.page, "14-library");
      await A.page.goto(BASE + "/settings");
      const [dl] = await Promise.all([A.page.waitForEvent("download"), A.page.click('button:has-text("전체 데이터 JSON")')]);
      const p = path.join(ART, "backup.json");
      await dl.saveAs(p);
      const backup = JSON.parse(fs.readFileSync(p, "utf8"));
      ok(backup.tables.ideas.length >= 5 && backup.tables.approvals.length >= 1 && backup.tables.content_versions.length >= 2, "전체 데이터 JSON 백업");
      await shot(A.page, "15-settings");
    }

    // ── 8. 모바일 화면 ───────────────────────────────────
    if (run("mobile")) {
      const M = await login(browser, "bunny@ourstudio.test", { width: 390, height: 844 });
      await M.page.waitForSelector("text=Good to see you");
      await shot(M.page, "m1-dashboard");
      await M.page.goto(BASE + "/ideas");
      await M.page.waitForSelector('[data-testid="idea-card"]');
      await shot(M.page, "m2-ideas");
      await M.page.goto(BASE + "/archive");
      await M.page.waitForSelector(".leaflet-container");
      await shot(M.page, "m3-archive");
      const sw = await M.page.evaluate(() => document.documentElement.scrollWidth);
      ok(sw <= 391, `모바일: 가로 스크롤 없음 (scrollWidth ${sw})`);
      await M.ctx.close();
    }
    console.log(`\nALL PASSED (${passed})`);
    fs.writeFileSync(path.join(ART, "results.txt"), results.join("\n") + `\n\nALL PASSED (${passed})\n`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
