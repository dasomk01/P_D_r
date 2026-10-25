# OUR STUDIO

커플이 함께 운영하는 두 인스타그램 계정 — **KOREA TRIP** (`@korea_trip_always`, 외국인 대상 영어 여행 캐러셀)과 **MED SCHOOL TOON** (익명 의대생 인스타툰) — 을 위한 비공개 공동 콘텐츠 작업실입니다.

아이디어 수집 → 여행 자료 축적 → AI 기획 → 제작 → 공동 검토 → 승인 → 완성본 보관까지 한 곳에서 관리합니다. 이 폴더는 저장소 루트의 SOM STUDY 앱과 **완전히 독립된 Next.js 앱**입니다(별도 Vercel 프로젝트·별도 Supabase 프로젝트).

---

## 1. 사이트 구조

| 경로 | 화면 | 주요 기능 |
|---|---|---|
| `/login` | 로그인 | 초대된 2명만. 공개 회원가입 없음 |
| `/` | 대시보드 | 프로젝트별 아이디어 수·제작 대기·오늘 예정·검토 대기·승인 완료, 다음 제작 추천, 2주 캘린더, 최근 업로드, 최근 댓글·수정 내역 |
| `/ideas?p=` | 아이디어 보드 | 한 줄 저장, 유사 아이디어·최근 30일 콘텐츠 중복 경고, 검색·상태·태그 필터, 정렬, 공감(투표), 다음 제작 지정, 추천 목록, 가져오기(붙여넣은 내용만), AI 주제 제안 |
| `/ideas/[id]` | 아이디어 상세 | 메모·태그·링크·우선순위·상태 편집, 사진·파일 첨부, 아카이브 장소 연결, 댓글, AI 기획, 제작 시작 |
| `/archive` | 여행 아카이브 | 한국 지도(방문/미방문 추천/사진 유무), 목록, 지역별 보기 + 지역별 제작 이력, 여행 기록, 코스 담기 → 바로 제작 |
| `/archive/new`, `/archive/places/[id]/edit` | 장소 등록·수정 | 주소 검색(OSM) 또는 지도 클릭으로 위치, 후기·추천 메뉴·가격·좋았던/아쉬웠던 점·외국인 추천 이유·재방문 의사 |
| `/archive/places/[id]` | 장소 상세 | 사진 보관함(사진별 출처·권리·사용 허가·AI 태그), **우리의 실제 경험**과 **조사 자료(AI/직접)** 분리, 근처 장소, 관련 콘텐츠, 댓글, AI 주변 자료 조사 |
| `/archive/upload` | 사진 일괄 업로드 | 여행 단위로 여러 장 올리고 사진마다/여러 장 한꺼번에 장소 연결 |
| `/studio?p=` | 제작실 | 상태별 콘텐츠, 새 콘텐츠(중복 경고 + 아카이브 자동 연결 미리보기) |
| `/studio/[id]` | 콘텐츠 | **제작**(여행: 구성·코스·정보 확인·7장·캡션·해시태그 5개 / 툰: 줄거리·컷·대사), 규칙·익명성 검수, **검토·승인**(전체 미리보기, 페이지 확대, 페이지별 댓글, 수정 요청, 승인), **버전**(이력·비교), **다운로드**(ZIP) |
| `/calendar` | 캘린더 | 월간 일정, 날짜별 목록, 제작 순서 변경(날짜 교환), 하루 하나씩 자동 배치 |
| `/library?p=` | 자료 보관함 | 프로젝트별 자료(종류·출처·사용 허가 필터), 완성 콘텐츠를 날짜·주제·키워드로 검색 |
| `/characters` | 캐릭터 설정집 | 흰 토끼·갈색 곰 설정, 원본·표정/포즈 레퍼런스, 그림체 설정 |
| `/settings` | 설정·백업 | 프로필, 인스타툰 금지어(실명 등), 연동 상태, 전체 JSON 백업, 프로젝트별 원본 파일 ZIP(+권리 manifest) |

모바일: 하단 탭(대시보드·아이디어·아카이브·제작실·캘린더) + 메뉴, 사진 여러 장 선택 업로드, 가로 스크롤 없음.

## 2. 데이터 구조 (`supabase/migrations/0001_our_studio.sql`)

- `members` — 초대된 사용자(표시 이름·색). **모든 테이블 RLS 가 `is_member()` 로 보호**됩니다.
- `projects` — `korea-trip`(17:00), `med-toon`(23:00), `settings`(금지어·그림체 등)
- `ideas`, `idea_votes`, `comments`(아이디어/콘텐츠 페이지별/장소, 수정 요청 포함)
- `trips`, `places`(방문/미방문 추천, 내부용 방문일·방문자), `place_research`(provenance `ai|manual`, 검증 여부, 사진 후보는 `reference_only` 기본)
- `assets` — 모든 파일·사진. 출처(`own_photo|licensed|official|ai_generated|reference_only|other`), 권리자, 라이선스, 원본 URL, **공개 사용 허가**, AI 태그, 장소/여행/아이디어/콘텐츠/캐릭터 연결. `reference_only` 는 DB 제약으로 사용 허가 불가.
- `characters` — 툰 설정집
- `contents`, `content_versions`(JSON 데이터), `approvals` — 승인된 버전은 **DB 트리거로 수정·삭제 불가**, 승인 후 수정은 새 버전으로만.
- `ai_runs` — AI 결과 자동 저장, `activity` — 트리거로 기록되는 최근 활동
- RPC: `create_content`, `save_content_version`, `approve_content`(한 명 승인 = 최종 승인, 승인자·시각·버전 기록 + 잠금), `request_revision`
- Storage: 비공개 버킷 `studio` (멤버만, 서명 URL 로 표시, 썸네일 자동 생성)
- Realtime: 주요 테이블 구독 → 두 사람 화면이 자동으로 갱신

상태 흐름: 아이디어 → AI 기획 → 제작 대기 → 제작 중 → 검토 대기 → (수정 중) → 승인 완료. 콘텐츠 상태가 바뀌면 연결된 아이디어 상태도 따라갑니다.

## 3. 기술 스택과 비용

| 구성 | 선택 | 비용 |
|---|---|---|
| 웹앱 | Next.js 16 (App Router) + React 19 + Tailwind 4 | — |
| 호스팅 | Vercel | Hobby 무료로 충분 (AI 조사 함수는 최대 300초) |
| DB·로그인·파일·실시간 | Supabase (Postgres + Auth + Storage + Realtime) | Free: DB 500MB, 파일 1GB. 사진이 많아지면 Pro($25/월, 100GB) |
| 지도 | Leaflet + OpenStreetMap 타일, 주소 검색은 Nominatim | 무료 (저빈도 사용 전제). 카카오맵으로 바꾸려면 키 필요 |
| AI 텍스트·조사·사진 분석 | Claude API (`claude-opus-5-5`, 웹 검색 도구) | **사용량 과금** (입력 $4 / 출력 $20 per 1M 토큰 + 웹 검색 건당 과금). 기획 1회 대략 수십 원~수백 원 수준, 장소 조사는 검색 횟수만큼 추가 |
| ZIP 생성 | 브라우저에서 JSZip | — |

## 4. 설치 · 배포

1. **Supabase 프로젝트 생성** → SQL Editor 에서 `supabase/migrations/0001_our_studio.sql`, 이어서 `0002_auto_member.sql` 을 실행.
2. **Authentication → Sign In / Providers → Email** 에서 *Allow new users to sign up* 끄기 (초대 전용).
3. **두 사람 계정 만들기**: **Authentication → Users → Add user → Create new user** (비밀번호 입력 + *Auto Confirm User* 체크).
   `0002_auto_member.sql` 덕분에 여기서 만든 계정은 **자동으로 멤버**가 됩니다. 표시 이름은 이메일 앞부분으로 시작하니 사이트의 *설정·백업* 에서 바꾸세요.
   - *Invite user* (초대 메일)는 쓰지 마세요 — 비밀번호를 정하는 화면이 없어 로그인할 수 없습니다.
   - 터미널을 쓴다면 `node scripts/invite-user.mjs <email> <password> <이름>` 도 같은 일을 합니다.
   - 비밀번호를 잊었을 때 (SQL Editor):
     ```sql
     update auth.users set encrypted_password = extensions.crypt('새비밀번호', extensions.gen_salt('bf'))
     where email = '이메일';
     ```
4. **Vercel 새 프로젝트** → 같은 저장소, **Root Directory = `our-studio`**, 환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, (선택) `ANTHROPIC_API_KEY`.
5. (선택) 샘플 데이터: `SEED_EMAIL=... SEED_PASSWORD=... NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/seed-sample.mjs`

로컬 개발: `cp .env.example .env.local` 후 값 입력 → `npm run dev`.

## 4-1. ChatGPT 에서 쓰기 (MCP 커넥터)

ChatGPT(유료 플랜) 대화창에서 OUR STUDIO 의 아이디어·아카이브를 읽고, 콘텐츠 **초안**을 제작실에 저장할 수 있습니다. 승인·삭제·게시는 할 수 없습니다.

1. Supabase SQL Editor 에서 `0003_activity_actor.sql` 실행 (ChatGPT 로 저장한 변경에도 작성자가 남도록)
2. Vercel 환경변수 추가 후 Redeploy
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API Keys 의 **secret / service_role** 키 (서버 전용)
   - `MCP_AUTH_SECRET` — 32자 이상 임의 문자열. 바꾸면 모든 ChatGPT 연결이 끊깁니다
3. ChatGPT → 설정 → 앱(Apps) → 고급 설정 → **개발자 모드** 켜기 → 새 앱 만들기
   - MCP 서버 URL: `https://<사이트 주소>/api/mcp` (사이트 *설정·백업* 화면에서 복사)
   - 인증: OAuth → 연결하면 이 사이트의 로그인·허용 화면이 뜹니다
4. 대화 예시: "OUR STUDIO 에서 korea-trip 다음 제작 추천 가져와서 7장 캐러셀 초안 만들고 저장해줘"

도구: `get_project_rules`, `get_next_up`, `list_ideas`, `get_idea`, `search_archive`, `get_place`, `list_contents`, `get_content`, `search`, `fetch`, `create_idea`, `save_content_draft`, `add_place_research`

- 인증: OAuth 2.1 (자동 발견 RFC 9728/8414, 동적 등록, PKCE S256). 토큰은 서명된 JWT(1시간, 리프레시 60일)이고 매 요청마다 멤버 여부를 다시 확인합니다.
- 리다이렉트는 ChatGPT·Claude 도메인만 허용 (`MCP_ALLOWED_REDIRECT_HOSTS` 로 추가 가능).
- 방문 날짜·방문자·금지어 목록은 전달하지 않습니다. 직접 경험(OUR_EXPERIENCE)과 조사 자료(RESEARCHED)를 구분해 전달합니다.
- 초안은 `검토 대기` 로 저장되고, 승인된 버전은 덮어쓰지 않고 새 버전으로 추가됩니다. 툰 초안은 저장 시 익명성 검사 결과를 돌려줍니다.
- ChatGPT 예약 작업(Scheduled tasks) 안에서 이 커넥터를 쓸 수 있는지는 ChatGPT 쪽 기능이라 직접 시험해 봐야 합니다. 쓰기 도구는 ChatGPT 가 실행 전에 확인을 요청할 수 있습니다.

## 5. 검증

- `npm test` — 유사도·익명성 스캔·추천 우선순위·30일 중복·아카이브 매칭·KST 날짜·거리·캐러셀 규칙 단위 테스트
- `tests/mcp-e2e.cjs` — 공식 MCP SDK 클라이언트로 ChatGPT 와 같은 OAuth 흐름(발견 → 동적 등록 → 브라우저 동의 → PKCE 토큰 → 도구 호출)을 수행하는 21개 시나리오 (비멤버 차단, 거부, 초안 저장·버전, 규칙·익명성 검사, 조사 자료, 401, 리프레시, 리다이렉트 제한). 서버에 `MCP_ALLOWED_REDIRECT_HOSTS=localhost` 필요
- `tests/e2e.cjs` — 로컬 Supabase(Docker) + `next dev` 에 대해 두 브라우저(토끼·곰)로 실제 동작을 검증하는 49개 시나리오: 비멤버 차단·RLS, 실시간 동기화(아이디어·투표·댓글·승인), 사진 업로드·권리 편집·일괄 연결, 7장 제작·해시태그 규칙, 페이지별 댓글·수정 요청, 1인 승인, 승인본 DB 잠금, 승인 후 v2, 버전 비교, ZIP 내용, 30일 중복 경고, 익명성 검수, 캘린더 순서 변경, JSON 백업, 모바일 가로 스크롤.
  ```bash
  npx supabase start            # 별도 폴더에서, Docker 필요
  psql ... -f supabase/migrations/0001_our_studio.sql
  node scripts/invite-user.mjs ...   # bunny@ourstudio.test / bear@ourstudio.test / stranger@ourstudio.test(비멤버)
  node tests/make-photos.cjs && node tests/e2e.cjs
  ```

## 6. AI · 자동화 — 현재 상태

| 기능 | 상태 | 비고 |
|---|---|---|
| 아이디어 구체화 / 여행 7장 기획·영어 문구·해시태그 / 툰 줄거리·컷·대사 | **구현됨, 키 설정 시 작동** | 아카이브의 `[OUR EXPERIENCE]` 와 `[RESEARCHED]` 를 구분해 전달, 방문일·방문자는 보내지 않음. 결과는 `ai_runs` 저장, 사용자가 저장해야 반영 |
| AI 주변 자료 조사 | **구현됨, 키 설정 시 작동** | Claude 웹 검색. 검색 결과에 실제로 나온 URL 만 저장, 사진은 링크·라이선스 메모만(다운로드 안 함), 모두 '미확인'으로 저장 |
| 사진 내용 태그 | **구현됨, 키 설정 시 작동** | 썸네일로 분석 |
| AI 익명성 검수 | **구현됨, 키 설정 시 작동** | 규칙 기반 검수(금지어·학교·학번·날짜·연애 시점 표현)는 키 없이도 항상 작동. 금지어 목록은 AI 에 보내지 않음 |
| AI 주제 제안 | **구현됨, 키 설정 시 작동** | 추천 우선순위 1~4단계는 AI 없이 동작 |
| 콘텐츠 이미지 생성 | **연동 준비 중** | 연결된 서비스 없음. 완성 이미지는 업로드 |
| 자동 제작 스케줄 (17:00/23:00) | **연동 준비 중** | ChatGPT 예약과 연결되어 있지 않음 — 캘린더는 목표 시간 표시만 |
| Instagram / Metricool 게시 | **구현하지 않음 (요구사항)** | ZIP 으로 내려받아 직접 게시 |
| ChatGPT 에서 아이디어 기반 초안 만들기 | **구현됨 (MCP 커넥터)** | 4-1 참고. 실제 ChatGPT 연결은 배포 후 확인 필요 |
| ChatGPT 대화 기록 | 자동 접근 없음 | 사용자가 붙여넣은 내용만 공동 아이디어로 저장 |

> 이 저장소 작업 환경에는 Claude API 키가 없어 AI 경로는 실제 호출로 검증하지 못했습니다(타입 검사·빌드만 통과). 키를 넣은 뒤 아이디어 하나로 'AI 기획 받기'를 먼저 시험해 보세요.

### 다음 단계 제안
- 이미지 생성: 캐릭터 일관성이 중요한 툰은 레퍼런스 이미지 기반 생성 API 를 붙이고, 결과는 `origin = ai_generated` 로 저장(이미 구분 표시·ZIP credits 에 반영됨).
- 자동 제작: Vercel Cron → 다음 제작 아이디어로 AI 초안 생성까지만(게시는 하지 않음). 실행 결과 검증 후 활성화.
- 지도: 한국 주소 정확도가 더 필요하면 카카오 로컬 API 로 교체.
