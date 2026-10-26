// MED SCHOOL TOON 제작 흐름 종단 간 검증 (ChatGPT 와 같은 MCP 호출 순서)
// 실행: BASE=http://localhost:3100 node tests/mcp-toon-e2e.cjs
//  (서버 환경변수: MCP_AUTH_SECRET, SUPABASE_SERVICE_ROLE_KEY, MCP_ALLOWED_REDIRECT_HOSTS=localhost)
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const { UnauthorizedError } = require("@modelcontextprotocol/sdk/client/auth.js");
const { createClient } = require("@supabase/supabase-js");

const BASE = process.env.BASE || "http://localhost:3100";
const REDIRECT = "http://localhost:9999/callback";
const ART = path.join(__dirname, ".artifacts", "toon");
fs.mkdirSync(ART, { recursive: true });
let passed = 0;
function ok(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
  passed++;
  console.log("✓", msg);
}

// ── 테스트용 PNG (정확한 크기) ────────────────────────
async function makePngs(browser) {
  const page = await browser.newPage();
  const draw = async (name, w, h, label, bg) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(
      `<body style="margin:0"><div style="width:${w}px;height:${h}px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 64px sans-serif;color:#1b2540">
        <div style="width:300px;height:300px;border-radius:50%;background:#fff;border:8px solid #1b2540"></div><p>${label}</p></div></body>`,
    );
    await page.screenshot({ path: path.join(ART, name), type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  };
  for (const n of [1, 2, 3]) {
    await draw(`feed${n}.png`, 1080, 1350, `FEED ${n}`, "#fbf8f2");
    await draw(`reels${n}.png`, 1080, 1920, `REELS ${n}`, "#f4e4e3");
  }
  await draw("feed2b.png", 1080, 1350, "FEED 2 (redo)", "#e6ecf3");
  await draw("square.png", 1024, 1024, "WRONG", "#ddd");
  await draw("ref.png", 800, 800, "STYLE REF", "#fff");
  await page.close();
}

function serveFiles() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const f = path.join(ART, path.basename(req.url));
      if (!fs.existsSync(f)) return res.writeHead(404).end();
      res.writeHead(200, { "content-type": "image/png" });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(9998, () => resolve(srv));
  });
}
const fileParam = (name) => ({ download_url: `http://localhost:9998/${name}`, file_id: `file-${name}`, mime_type: "image/png", file_name: name });

// ── OAuth 연결 (ChatGPT 와 같은 흐름) ────────────────────
function provider(store) {
  return {
    get redirectUrl() {
      return REDIRECT;
    },
    get clientMetadata() {
      return { client_name: "ChatGPT (test)", redirect_uris: [REDIRECT], grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], token_endpoint_auth_method: "none" };
    },
    clientInformation: () => store.client,
    saveClientInformation: (c) => (store.client = c),
    tokens: () => store.tokens,
    saveTokens: (t) => (store.tokens = t),
    redirectToAuthorization: (url) => (store.authUrl = url.toString()),
    saveCodeVerifier: (v) => (store.verifier = v),
    codeVerifier: () => store.verifier,
  };
}
async function connect(browser) {
  const store = {};
  const t1 = new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) });
  await new Client({ name: "t", version: "1" }).connect(t1).catch((e) => {
    if (!(e instanceof UnauthorizedError)) throw e;
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let code = null;
  await page.route("http://localhost:9999/**", (route) => {
    code = new URL(route.request().url()).searchParams.get("code");
    return route.fulfill({ status: 200, body: "ok" });
  });
  await page.goto(store.authUrl);
  await page.waitForURL(/\/login/);
  await page.fill('input[type="email"]', "bunny@ourstudio.test");
  await page.fill('input[type="password"]', "test-pass-1234");
  await page.click('button[type="submit"]');
  await page.click('[data-testid="oauth-approve"]', { timeout: 20000 });
  for (let i = 0; i < 50 && !code; i++) await page.waitForTimeout(200);
  await ctx.close();
  await t1.finishAuth(code);
  const client = new Client({ name: "chatgpt-test", version: "1" });
  await client.connect(new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) }));
  return client;
}
const raw = (client, name, args = {}) => client.callTool({ name, arguments: args });
const call = async (client, name, args) => JSON.parse((await raw(client, name, args)).content[0].text);

(async () => {
  const browser = await chromium.launch();
  const srv = await serveFiles();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  try {
    await makePngs(browser);
    const { data: bunny } = await admin.from("members").select("user_id").eq("display_name", "토끼").single();

    // 로컬 테스트 DB 전용: 이전 실행이 남긴 툰 콘텐츠·아이디어 정리 (운영 DB 에서 실행하지 마세요)
    if (!/127\.0\.0\.1|localhost/.test(process.env.NEXT_PUBLIC_SUPABASE_URL)) throw new Error("로컬 Supabase 에서만 실행하세요");
    await admin.from("contents").delete().eq("project_id", "med-toon");
    await admin.from("ideas").update({ is_next: false }).eq("project_id", "med-toon");

    // 준비: '다음 제작' 아이디어가 이미 '제작 중' 상태로 바뀐 상황 (빈 배열 버그 재현) + 대표 이미지·그림체 규칙
    const { data: idea } = await admin
      .from("ideas")
      .insert({ project_id: "med-toon", title: "해부학 시험 전날 (e2e)", memo: "뼈 이름 퀴즈", is_next: true, status: "in_production", created_by: bunny.user_id })
      .select()
      .single();
    const refPath = `med-toon/test/${Date.now()}-ref.png`;
    await admin.storage.from("studio").upload(refPath, fs.readFileSync(path.join(ART, "ref.png")), { contentType: "image/png" });
    await admin.from("assets").insert({ project_id: "med-toon", storage_path: refPath, file_name: "ref.png", mime_type: "image/png", kind: "style_ref", pinned: true, origin: "own_photo", usage_allowed: true });
    const { data: proj } = await admin.from("projects").select("settings").eq("id", "med-toon").single();
    await admin
      .from("projects")
      .update({ settings: { ...proj.settings, style_guide: { face: "토끼: 점 눈, 분홍 볼 / 곰: 둥근 귀", palette: "토끼 #FFFFFF, 곰 #8B5E3C", font: "나눔손글씨 펜" } } })
      .eq("id", "med-toon");

    const client = await connect(browser);
    const toolNames = (await client.listTools()).tools;
    const up = toolNames.find((t) => t.name === "upload_cut_image");
    ok(up && up._meta?.["openai/fileParams"]?.includes("image"), "upload_cut_image 가 ChatGPT 파일 파라미터(openai/fileParams)를 선언");
    ok(["get_style_bible", "get_next_toon_task", "get_cut_images", "run_toon_qc", "report_cut_review"].every((n) => toolNames.some((t) => t.name === n)), "툰 제작 도구 등록");

    // 1. 다음 제작
    const next = await call(client, "get_next_up", { project: "med-toon" });
    ok(next.items.some((x) => x.idea_id === idea.id && x.source === "next"), "get_next_up: '제작 중' 상태로 바뀐 다음 제작 아이디어도 나옴 (빈 배열 버그 수정)");
    const task1 = await call(client, "get_next_toon_task", {});
    ok(task1.action === "start" && task1.idea.id === idea.id, "get_next_toon_task: 작업 하나만 (start, 다음 제작 아이디어)");

    // 2. 그림체 설정집 (이미지 포함)
    const bible = await raw(client, "get_style_bible", {});
    const bj = JSON.parse(bible.content[0].text);
    ok(bj.style_guide_text.includes("나눔손글씨") && bj.reference_images.length >= 1 && bj.reference_images[0].url, "get_style_bible: 고정 규칙 + 대표 이미지 목록·주소");
    ok(bible.content.some((b) => b.type === "image" && b.mimeType === "image/png" && b.data.length > 100), "get_style_bible: 대표 이미지 자체를 이미지로 전달");

    // 3. 대본 저장 (컷 수 자유: 3컷), 중복 생성 방지
    const cuts = [1, 2, 3].map((n) => ({ scene: `장면 ${n}`, lines: [{ speaker: "토끼", text: `대사 ${n}` }] }));
    const s1 = await call(client, "save_content_draft", { project: "med-toon", idea_id: idea.id, title: "해부학 시험 전날", synopsis: "시험 전날", cuts, caption: "시험 전날 밤", hashtags: ["의대생", "인스타툰", "해부학", "시험기간", "토끼와곰"] });
    ok(s1.saved && s1.issues_to_fix.length === 0, "대본 저장 (3컷, 캡션 1, 해시태그 5) — 문제 없음");
    const s2 = await call(client, "save_content_draft", { project: "med-toon", idea_id: idea.id, title: "해부학 시험 전날", cuts });
    ok(s2.content_id === s1.content_id && s2.continued_existing_content, "같은 아이디어로 다시 저장해도 새 콘텐츠를 만들지 않고 이어서 저장");
    const cid = s1.content_id;
    const { count } = await admin.from("contents").select("id", { count: "exact", head: true }).eq("idea_id", idea.id);
    ok(count === 1, "아이디어당 콘텐츠 1개 (중복 없음)");
    const s3 = await call(client, "save_content_draft", { project: "med-toon", title: "x", content_id: cid, hashtags: ["#a", "#b"] });
    ok(s3.issues_to_fix.some((i) => i.includes("5개")), "툰 해시태그가 5개가 아니면 문제 반환");
    await call(client, "save_content_draft", { project: "med-toon", title: "해부학 시험 전날", content_id: cid, hashtags: ["의대생", "인스타툰", "해부학", "시험기간", "토끼와곰"] });

    const task2 = await call(client, "get_next_toon_task", {});
    ok(task2.action === "resume" && task2.content_id === cid && task2.redo.length === 6, "get_next_toon_task: 제작 중 콘텐츠를 이어서 (resume, 빈 칸 6개)");
    const next2 = await call(client, "get_next_up", { project: "med-toon" });
    ok(next2.items[0].source === "continue" && next2.items[0].content_id === cid && !next2.items.some((x) => x.source === "next" && x.idea_id === idea.id), "get_next_up: 제작 중은 continue 로, 같은 아이디어 새 시작 없음");

    // 4. 이미지 업로드: 규격 불량 거부
    const bad = await call(client, "upload_cut_image", { content_id: cid, cut_no: 1, variant: "feed", image_base64: fs.readFileSync(path.join(ART, "square.png")).toString("base64") });
    ok(bad.saved === false && bad.rejected[0].includes("1080×1350"), "1024×1024 이미지는 저장하지 않고 거부 + 이유 반환");
    const wrongVariant = await call(client, "upload_cut_image", { content_id: cid, cut_no: 1, variant: "reels", image: fileParam("feed1.png") });
    ok(wrongVariant.saved === false, "피드 크기 이미지를 릴스 칸에 넣으면 거부");
    const noCut = await call(client, "upload_cut_image", { content_id: cid, cut_no: 9, variant: "feed", image: fileParam("feed1.png") });
    ok(noCut.saved === false && noCut.error.includes("컷 9번"), "대본에 없는 컷 번호 거부");
    const mobile = await call(client, "upload_cut_image", { content_id: cid, cut_no: 1, variant: "feed", image: "chat_upload" });
    ok(mobile.saved === false && mobile.error.includes("모바일"), "모바일처럼 파일 링크 없이 오면 대안 안내");

    // 5. 정상 업로드 (ChatGPT 파일 파라미터 형식), 동시 업로드 경합 없음
    await Promise.all([1, 2, 3].map((n) => call(client, "upload_cut_image", { content_id: cid, cut_no: n, variant: "feed", image: fileParam(`feed${n}.png`) })));
    const res = await Promise.all([1, 2, 3].map((n) => call(client, "upload_cut_image", { content_id: cid, cut_no: n, variant: "reels", image: fileParam(`reels${n}.png`) })));
    ok(res.every((r) => r.saved), "피드 3장 + 릴스 3장 저장 (동시에 올려도 모두 반영)");
    const content = await call(client, "get_content", { content_id: cid });
    ok(content.image_slots.every((sl) => sl.feed !== "missing" && sl.reels !== "missing"), "get_content: 6칸 모두 이미지 연결됨");

    // 6. 검수
    const qc1 = await call(client, "run_toon_qc", { content_id: cid });
    ok(qc1.redo.length === 0 && qc1.complete && qc1.cuts === 3, "run_toon_qc: 개수·크기·PNG·순서·대본 통과");
    const { data: st1 } = await admin.from("contents").select("status").eq("id", cid).single();
    ok(qc1.moved_to_review && st1.status === "in_review", "두 세트 완성 + 검수 통과 → 자동으로 검토 대기");
    const task3 = await call(client, "get_next_toon_task", {});
    ok(task3.action !== "resume" || task3.content_id !== cid, "검토 대기(사람 차례)인 콘텐츠는 다시 작업하지 않음");
    ok(qc1.needs_review.length === 6 && !qc1.vision_available, "서버 이미지 판독 미연결 → 6칸 '확인 필요' (작동하는 척 안 함)");
    const imgs = await raw(client, "get_cut_images", { content_id: cid, variant: "feed", cut_nos: [1, 2] });
    ok(imgs.content.filter((b) => b.type === "image").length === 2, "get_cut_images: 저장된 컷 이미지를 다시 읽어옴");
    await call(client, "report_cut_review", { content_id: cid, cut_no: 2, variant: "feed", ok: false, issues: ["곰 얼굴이 설정집과 다름"] });
    for (const n of [1, 3]) await call(client, "report_cut_review", { content_id: cid, cut_no: n, variant: "feed", ok: true });
    const qc2 = await call(client, "run_toon_qc", { content_id: cid });
    ok(qc2.redo.length === 1 && qc2.redo[0].cut_no === 2 && qc2.redo[0].variant === "feed", "실패한 칸(컷 2 피드)만 다시 제작 목록에");
    await call(client, "upload_cut_image", { content_id: cid, cut_no: 2, variant: "feed", image: fileParam("feed2b.png") });
    const qc3 = await call(client, "run_toon_qc", { content_id: cid });
    ok(qc3.redo.length === 0, "실패한 컷만 다시 올리면 통과");

    // 7. 사이트 화면: 칸 상태, 사이트 검수, 릴스 미리보기, ZIP
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    await page.goto(BASE + "/login");
    await page.fill('input[type="email"]', "bunny@ourstudio.test");
    await page.fill('input[type="password"]', "test-pass-1234");
    await page.click('button[type="submit"]');
    await page.waitForURL((u) => !u.pathname.startsWith("/login"));
    await page.goto(`${BASE}/studio/${cid}`);
    await page.waitForSelector('[data-testid="slot-3-reels"] img');
    ok((await page.locator('[data-testid^="slot-"] img').count()) === 6, "제작실: 컷마다 피드·릴스 이미지 6칸 표시");
    await page.click('[data-testid="toon-qc"] button:has-text("이미지 검수 실행")');
    await page.waitForSelector('[data-testid="qc-report"]');
    ok(await page.isVisible('[data-testid="qc-report"] >> text=3컷 × 2세트 완료'), "사이트에서 검수 실행 → 3컷 × 2세트 완료");
    await page.screenshot({ path: path.join(ART, "studio-toon.png"), fullPage: true });
    await page.click('button:has-text("검토 · 승인")');
    await page.click('button:has-text("릴스 9:16")');
    await page.waitForSelector('[data-testid="page-tile"] .aspect-\\[9\\/16\\]');
    ok(true, "검토 화면: 릴스 9:16 미리보기 전환");
    await page.screenshot({ path: path.join(ART, "review-reels.png"), fullPage: true });
    await page.click('button:has-text("다운로드")');
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click('button:has-text("ZIP 다운로드")')]);
    const zp = path.join(ART, "toon.zip");
    await dl.saveAs(zp);
    const zip = await JSZip.loadAsync(fs.readFileSync(zp));
    const names = Object.keys(zip.files);
    ok(["feed/01.png", "feed/02.png", "feed/03.png", "reels/01.png", "reels/02.png", "reels/03.png", "caption.txt"].every((n) => names.includes(n)), `ZIP: 피드 3 + 릴스 3 + 캡션 (${names.filter((n) => !n.endsWith("/")).join(", ")})`);
    const cap = await zip.file("caption.txt").async("string");
    ok((cap.match(/#\S+/g) || []).length === 5, "caption.txt: 캡션 1개 + 해시태그 정확히 5개");
    const reelPng = await zip.file("reels/01.png").async("uint8array");
    ok(new DataView(reelPng.buffer, reelPng.byteOffset).getUint32(20) === 1920, "ZIP 의 릴스 이미지는 1080×1920 PNG");

    // 8. 승인 후 교체 → 승인본 보존 + 새 버전
    page.once("dialog", (d) => d.accept());
    await page.click('button:has-text("검토 · 승인")');
    await page.click('[data-testid="approve"]');
    await page.waitForSelector("text=승인 완료");
    const { data: before } = await admin.from("contents").select("current_version_no,status").eq("id", cid).single();
    const re = await call(client, "upload_cut_image", { content_id: cid, cut_no: 1, variant: "reels", image: fileParam("reels1.png") });
    const { data: after } = await admin.from("contents").select("current_version_no,status").eq("id", cid).single();
    const { data: lockedV } = await admin.from("content_versions").select("locked").eq("content_id", cid).eq("version_no", before.current_version_no).single();
    ok(re.saved && after.current_version_no === before.current_version_no + 1 && after.status === "revising" && lockedV.locked, "승인 후 컷 교체 → 승인본은 잠긴 채 보존, 새 버전 + 수정 중");

    // 9. 그림체 설정집 화면
    await page.goto(BASE + "/characters");
    await page.waitForSelector('[data-testid="pinned-refs"] img');
    await page.fill('[data-testid="style-line"]', "검정 2px 손그림 선, 플랫 채색");
    await page.click('button:has-text("고정 규칙 저장")');
    await page.waitForSelector('[data-testid="style-guide"] >> text=저장됨');
    const bible2 = await call(client, "get_style_bible", { include_images: false });
    ok(bible2.style_guide_text.includes("검정 2px"), "사이트에서 저장한 그림체 규칙이 ChatGPT 에 바로 전달");
    await page.screenshot({ path: path.join(ART, "style-bible.png"), fullPage: true });
    await ctx.close();

    console.log(`\nALL PASSED (${passed})`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    srv.close();
    await browser.close();
  }
})();
