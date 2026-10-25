// MCP + OAuth 종단 간 검증: 공식 MCP SDK 클라이언트가 ChatGPT 처럼
// 자동 발견 → 동적 등록 → 동의 화면(브라우저) → 토큰 → 도구 호출을 수행합니다.
// 실행: BASE=http://localhost:3100 node tests/mcp-e2e.cjs  (서버에 MCP_ALLOWED_REDIRECT_HOSTS=localhost 필요)
const { chromium } = require("playwright");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const { UnauthorizedError } = require("@modelcontextprotocol/sdk/client/auth.js");
const { createClient } = require("@supabase/supabase-js");

const BASE = process.env.BASE || "http://localhost:3100";
const REDIRECT = "http://localhost:9999/callback";
let passed = 0;
function ok(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
  passed++;
  console.log("✓", msg);
}

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

async function consent(browser, authUrl, email, approve = true) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let code = null;
  let error = null;
  await page.route("http://localhost:9999/**", (route) => {
    const u = new URL(route.request().url());
    code = u.searchParams.get("code");
    error = u.searchParams.get("error");
    return route.fulfill({ status: 200, body: "ok" });
  });
  await page.goto(authUrl);
  await page.waitForURL(/\/login/);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', "test-pass-1234");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/oauth\/authorize/, { timeout: 20000 });
  const text = await page.innerText("main");
  if (text.includes("연결할 수 없습니다")) {
    await ctx.close();
    return { problem: text };
  }
  await page.waitForSelector("text=연결을 허용할까요?");
  if (approve) await page.click('[data-testid="oauth-approve"]');
  else await page.click('button:has-text("거부")');
  for (let i = 0; i < 50 && !code && !error; i++) await page.waitForTimeout(200);
  await ctx.close();
  return { code, error };
}

async function connect(store) {
  const transport = new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) });
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(transport);
  return { client, transport };
}

const call = async (client, name, args) => JSON.parse((await client.callTool({ name, arguments: args })).content[0].text);

(async () => {
  const browser = await chromium.launch();
  try {
    // 1) 비멤버는 동의 단계에서 차단
    {
      const store = {};
      const transport = new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) });
      try {
        await new Client({ name: "t", version: "1" }).connect(transport);
      } catch (e) {
        if (!(e instanceof UnauthorizedError)) throw e;
      }
      ok(!!store.client?.client_id && store.authUrl?.includes("/oauth/authorize"), "자동 발견 + 동적 클라이언트 등록 → 동의 화면 주소 생성");
      const r = await consent(browser, store.authUrl, "stranger@ourstudio.test");
      ok(r.problem?.includes("멤버가 아닙니다"), "비멤버 계정은 연결 허용 화면에서 차단");
    }

    // 2) 거부하면 access_denied
    {
      const store = {};
      const transport = new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) });
      await new Client({ name: "t", version: "1" }).connect(transport).catch(() => {});
      const r = await consent(browser, store.authUrl, "bunny@ourstudio.test", false);
      ok(r.error === "access_denied" && !r.code, "거부 시 access_denied 로 돌아감");
    }

    // 3) 멤버가 허용 → 토큰 → 도구 사용
    const store = {};
    {
      const transport = new StreamableHTTPClientTransport(new URL(BASE + "/api/mcp"), { authProvider: provider(store) });
      await new Client({ name: "t", version: "1" }).connect(transport).catch((e) => {
        if (!(e instanceof UnauthorizedError)) throw e;
      });
      const r = await consent(browser, store.authUrl, "bunny@ourstudio.test");
      ok(!!r.code, "멤버가 허용 → 인가 코드 발급");
      await transport.finishAuth(r.code);
      ok(!!store.tokens?.access_token && !!store.tokens?.refresh_token, "PKCE 검증 후 액세스·리프레시 토큰 발급");
    }
    const { client } = await connect(store);
    const tools = (await client.listTools()).tools.map((t) => t.name);
    ok(["get_project_rules", "get_next_up", "search_archive", "save_content_draft", "add_place_research", "search", "fetch"].every((t) => tools.includes(t)), `도구 목록: ${tools.join(", ")}`);
    ok((await client.listTools()).tools.find((t) => t.name === "get_next_up").annotations?.readOnlyHint === true, "읽기 도구는 readOnlyHint 표시");

    const rules = await call(client, "get_project_rules", { project: "med-toon" });
    ok(rules.characters.length === 2 && !JSON.stringify(rules).includes("김철수"), "툰 규칙·캐릭터 제공, 금지어 목록은 노출 안 함");

    const next = await call(client, "get_next_up", { project: "korea-trip" });
    ok(next[0].source === "next", `다음 제작 추천 1순위: ${next[0].title}`);

    const arch = await call(client, "search_archive", { query: "강릉 2박 3일" });
    const p0 = arch.places[0];
    ok(p0 && p0.OUR_EXPERIENCE && Array.isArray(p0.RESEARCHED), "아카이브 검색: 직접 경험/조사 자료 분리");
    ok(!JSON.stringify(arch).includes("visited_on") && !JSON.stringify(arch).includes("2026-09-12"), "방문 날짜 등 내부 정보는 전달하지 않음");

    // 여행 초안 저장 (해시태그 4개 → 문제 반환) → 수정 저장
    const pages = Array.from({ length: 7 }, (_, i) => ({ headline: `Slide ${i + 1}`, body: `Body ${i + 1}` }));
    const s1 = await call(client, "save_content_draft", { project: "korea-trip", title: "Gangneung 2N3D (ChatGPT)", keywords: ["강릉"], format: "2박 3일", pages, caption: "East coast days.", hashtags: ["gangneung", "korea", "eastsea", "travel"], place_ids: [p0.id] });
    ok(s1.saved && s1.issues_to_fix.some((i) => i.includes("5개")), "초안 저장 + 규칙 위반(해시태그 4개) 반환");
    const s2 = await call(client, "save_content_draft", { project: "korea-trip", title: "Gangneung 2N3D (ChatGPT)", content_id: s1.content_id, hashtags: ["#gangneung", "#korea", "#eastsea", "#travel", "#tofu"] });
    ok(s2.version === 2 && s2.issues_to_fix.length === 0, "같은 content_id 로 수정 → v2, 문제 없음");
    const c = await call(client, "get_content", { content_id: s1.content_id });
    ok(c.data.pages.length === 7 && c.data.hashtags.length === 5 && c.status === "in_review", "제작실에 검토 대기 상태로 저장됨");

    // 툰 초안: 익명성 검사
    const t1 = await call(client, "save_content_draft", { project: "med-toon", title: "시험 전날 (ChatGPT)", synopsis: "시험 전날 밤", cuts: [{ scene: "도서관", lines: [{ speaker: "토끼", text: "20241234 학번 선배가 그러는데…" }] }] });
    ok(t1.issues_to_fix.some((i) => i.includes("학번")), "툰 초안 저장 시 익명성 문제 반환");

    // 조사 자료 저장
    const r = await call(client, "add_place_research", { place_id: p0.id, items: [{ kind: "nearby_attraction", title: "경포대", body: "누각, 호수 산책", url: "https://www.gn.go.kr/tour/" }] });
    ok(r.saved === 1, "장소 조사 자료 저장 (AI·미확인)");

    // DB 확인: 작성자·활동 기록
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: res } = await admin.from("place_research").select("provenance,verified,usage_status").eq("title", "경포대").order("created_at", { ascending: false }).limit(1).single();
    ok(res.provenance === "ai" && res.verified === false, "조사 자료는 provenance=ai, verified=false");
    const { data: act } = await admin.from("activity").select("actor").eq("entity_id", s1.content_id).limit(1).single();
    ok(!!act.actor, "ChatGPT 로 만든 콘텐츠도 활동 기록에 작성자가 남음");

    // 토큰 보안
    const bad = await fetch(BASE + "/api/mcp", { method: "POST", headers: { authorization: "Bearer nope", "content-type": "application/json" }, body: "{}" });
    ok(bad.status === 401 && (bad.headers.get("www-authenticate") || "").includes("resource_metadata"), "잘못된 토큰은 401 + 발견 정보 헤더");
    const ref = await fetch(BASE + "/api/oauth/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: store.tokens.refresh_token, client_id: store.client.client_id }),
    });
    const rt = await ref.json();
    ok(ref.ok && rt.access_token, "리프레시 토큰으로 재발급");
    const evil = await fetch(BASE + "/api/oauth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ redirect_uris: ["https://evil.example.com/cb"] }) });
    ok(evil.status === 400, "허용되지 않은 리다이렉트 주소 등록 거부");

    console.log(`\nALL PASSED (${passed})`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
