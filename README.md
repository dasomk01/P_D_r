# SOM STUDY

개인용 의대 AI 공부 웹앱. iPad에서 웹으로 사용(설치 X).

핵심 흐름: **자료 업로드 → 정리본 생성(Claude) → 문제 생성(Gemini) → 문제풀이 → 오답 축적 → AI 과외(GPT)**

**첫 화면은 "📚 현재 진행 중인 강의" 목록입니다.** 정리본 / 문제풀이 / 과외는 최상위 메뉴가 아니라, 강의를 열었을 때 그 강의의 자료를 기반으로 사용하는 하위 학습 기능입니다.

**자료 관리는 "강의(Course)" 중심**으로 이루어집니다: 강의 → 학습지(강의당 1개) / 수업 기록(날짜·교시별 세션, 각각 강의록+STT) → 정리본·문제풀이·과외. 날짜 기준 달력 View는 전체 수업을 빠르게 훑어보는 보조 화면으로 별도 제공될 예정입니다(Phase D).

**배포**: https://p-d-r.vercel.app (Vercel, `main` 브랜치 자동배포 + Supabase 연결 완료)

## 기술 스택

- **Next.js** (App Router, TypeScript, Tailwind CSS) — GitHub + Vercel
- **Supabase**: DB(Postgres) + Storage
- **AI**: Claude(정리본) / Gemini(문제 생성) / OpenAI(과외) — 모두 서버사이드에서만 호출

## 현재 상태 — Phase D 완료 (달력 View)

**Phase A — 강의 관리**
- **DB 스키마를 강의(Course) 중심으로 전면 재설계**했습니다 (`supabase/migrations/0001_init.sql`): `courses`, `study_materials`, `study_material_mappings`, `lecture_sessions`, `summaries`, `combined_summaries`, `combined_summary_sessions`, `questions`, `question_lecture_sessions`, `attempts`, `tutor_sessions`, `tutor_messages`. 이전의 날짜 중심 `lectures`/`lecture_files` 테이블은 제거했습니다 (아직 실제 배포 데이터가 없어 무중단 마이그레이션 없이 교체).
- **"야첵" 개념은 완전히 제거**했습니다 — 파일 타입, 라벨, DB 구조 어디에도 없습니다. 학습지는 강의당 1개(`study_materials`, 교체 시 이전 버전 보존), 수업 세션 파일은 강의록 PDF + STT 텍스트 2개뿐입니다.
- `/` (홈) — 현재 진행 중인 강의 카드 목록 + `＋ 강의 추가` + `📦 보관된 강의` 섹션 (최상위 navigation은 "강의"뿐, 정리본/문제풀이/과외는 여기 없음)
- `/courses/[courseId]` — 강의 상세 페이지 (편집/보관·복원/영구 삭제, 🧠 학습 섹션은 아래 세 경로로 연결되는 실제 링크)
- `/courses/[courseId]/summary`, `/questions`, `/tutor` — 정리본/문제풀이/과외는 강의 안에서만 접근 가능 (지금은 Phase E/F/G placeholder)
- `/api/courses` (GET `?status=active|archived`, POST 생성), `/api/courses/[id]` (GET/PATCH/DELETE) — 영구 삭제는 `confirm:true` 필수 + 관련 Storage 파일을 먼저 정리한 뒤 DB row를 cascade 삭제
- 재사용 가능한 컴포넌트: `CourseCard`, `CourseFormDialog`, `ConfirmDialog`

**Phase B — 학습지 관리**
- 강의 상세 페이지의 📖 학습지 섹션에서 PDF 업로드 → `study_materials`(버전 관리, 교체해도 이전 버전+매핑 보존) → `worksheet-pdf` 버킷에 저장
- **업로드는 브라우저에서 Supabase Storage로 직접**(signed upload URL) 이루어집니다 — 처음엔 파일을 우리 서버로 통째로 보내는 방식이었는데, Vercel 서버리스 함수의 요청 본문 크기 제한(~4.5MB) 때문에 800페이지짜리 같은 큰 학습지가 실패했습니다. `/api/courses/[id]/study-material/init`(업로드 자리 마련) → 브라우저가 Supabase로 직접 PUT → `/complete`(활성화 + 분석 트리거) 3단계로 우회.
- `ANTHROPIC_API_KEY`가 설정되어 있으면 업로드 완료 시 Claude가 목차 부분(앞 10페이지, `pdf-lib`으로 추출)만 읽어 교수/파트/페이지/문제 구간을 분석해 `study_material_mappings`에 저장 — Claude PDF 입력은 100페이지 제한이 있어서 전체를 보내지 않고, 어차피 구조 정보가 목차에 다 있음 (AI 키가 없으면 조용히 건너뛰고 안내 문구만 표시 — 수동 입력으로 대체 가능)
- 매핑 표에서 파트별로 편집/삭제/검수 체크(`confirmed`) 가능, "＋ 파트 추가"로 수동 입력도 가능
- `/api/courses/[id]/study-material` (GET/DELETE), `/study-material/init`+`/complete` (POST, 업로드), `/api/study-material-mappings` (POST), `/api/study-material-mappings/[id]` (PATCH/DELETE)

**Phase C — 수업 세션 관리**
- 강의 상세 페이지의 📅 수업 기록 섹션 — 날짜별로 그룹핑되어 교시 목록 표시, "＋ 수업 추가"로 날짜/교시/교수/강의 파트 입력 (같은 날짜+교시는 전체에서 유일해야 함)
- `/courses/[courseId]/sessions/[sessionId]` — 수업 상세: 교수/파트 편집, 삭제, 📄 강의록 + 📝 STT 업로드/교체/삭제 (학습지와 동일하게 브라우저→Supabase 직접 업로드 방식), 🧠 이 수업으로 학습(정리본/문제풀이/과외, 강의 전체 자료를 쓰므로 강의 레벨 페이지로 연결)
- 동일 강의록을 여러 날짜에 나눠 듣거나 같은 파트를 여러 날 반복해도 각 세션은 독립 행으로 저장 (통합 정리본은 Phase E에서 여러 세션을 선택해 생성)
- `/api/lecture-sessions` (POST), `/api/courses/[id]/lecture-sessions` (GET 목록), `/api/lecture-sessions/[id]` (GET/PATCH/DELETE), `/api/lecture-sessions/[id]/files/init`+`/complete` (업로드), `/api/lecture-sessions/[id]/files` (DELETE `?type=`)
- Supabase/AI 환경변수가 없어도 UI는 전부 렌더링되고, 호출 시에만 안내 메시지를 보여줌 — 환경변수만 연결하면 바로 동작

**Phase D — 달력 View**
- `/calendar` — 월 이동 가능한 달력, 수업이 있는 날짜에 점 표시. 강의별 View(기본 자료 관리)와 달리 이건 전체 강의를 가로질러 날짜 기준으로 훑어보는 보조 화면
- `/calendar/[date]` — 그 날짜의 모든 수업을 "N교시 — 강의명 · 파트명" 형태로 나열, 각 항목이 해당 수업 상세로 연결
- 홈(강의 목록) 우상단에 "📅 달력 보기" 링크로만 연결 — 최상위 navigation은 여전히 "강의"뿐
- `/api/calendar` (GET `?month=` 날짜별 카운트, `?date=` 그 날짜 수업 목록 + 강의명 join)

## 다음 Phase

| Phase | 내용 |
|---|---|
| E | 정리본 — 개별/통합, Claude API, v3.6 프롬프트 적용 |
| F | 문제풀이 — 야마그대로/야마변형/티야/탈야, Gemini API, 즉시 채점 + 오답노트 |
| G | 과외 — 채팅형 1:1, OpenAI API, 기존 과외 프롬프트 적용 |

## 로컬 개발

```bash
npm install
cp .env.example .env.local   # 아래 "환경변수" 참고해 값 채우기
npm run dev
```

`http://localhost:3000` 에서 확인. `http://localhost:3000/api/health` 로 Supabase 연결 상태 확인 가능.

## Supabase 설정

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성 (무료 플랜)
2. SQL Editor에서 `supabase/migrations/0001_init.sql` 내용을 실행해 테이블 생성
3. Storage에서 아래 버킷 생성 (모두 private):
   - `lecture-pdf`
   - `stt-txt`
   - `worksheet-pdf`
   - `summary-docx`
   - `summary-pdf`
4. Project Settings → API 에서 URL, `anon` key, `service_role` key 확인

이 앱은 1인 사용을 전제로 모든 테이블에 RLS를 켜두고 공개 정책은 추가하지 않았습니다. 즉 anon key만으로는 테이블을 읽거나 쓸 수 없고, 모든 DB 접근은 Next.js 서버(API route)의 service-role 클라이언트를 통해서만 이루어집니다.

## 환경변수

`.env.example` 참고. Vercel 배포 시 Project Settings → Environment Variables 에 동일하게 등록합니다.

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (서버 전용, 절대 노출 금지) |
| `ANTHROPIC_API_KEY` | Claude API key |
| `GEMINI_API_KEY` | Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `SUMMARY_PROVIDER` | 정리본 생성에 사용할 벤더 (`claude` \| `gemini` \| `openai`, 기본 `claude`) |
| `QUESTION_PROVIDER` | 문제 생성에 사용할 벤더 (기본 `gemini`) |
| `TUTOR_PROVIDER` | 과외에 사용할 벤더 (기본 `openai`) |

## Vercel 배포

1. GitHub 저장소를 Vercel에 Import
2. 위 환경변수를 Vercel 프로젝트에 등록
3. Deploy — Next.js 프로젝트라 별도 빌드 설정 불필요

## 프로젝트 구조

```
src/
  app/
    page.tsx                            # 홈 = 📚 현재 진행 중인 강의 목록 (최상위 navigation)
    calendar/
      page.tsx                          # 월 달력 (보조 View)
      [date]/page.tsx                   # 그 날짜의 전체 강의 수업 목록
    courses/[courseId]/
      page.tsx                          # 강의 상세 (학습지/수업 기록/학습)
      summary/page.tsx                  # 정리본 (Phase E placeholder)
      questions/page.tsx                # 문제풀이 (Phase F placeholder)
      tutor/page.tsx                    # 과외 (Phase G placeholder)
      sessions/[sessionId]/page.tsx     # 수업 상세 (강의록/STT, 이 수업으로 학습)
    api/
      health/                           # Supabase 연결 확인
      calendar/                         # 달력용 월별 카운트 / 날짜별 수업 목록
      courses/                          # 강의 CRUD (GET/POST, GET/PATCH/DELETE [id])
      courses/[id]/study-material/      # 학습지 조회/삭제 + init/complete 업로드
      courses/[id]/lecture-sessions/    # 강의의 수업 세션 목록 (GET)
      study-material-mappings/          # 매핑 수동 추가/편집/삭제
      lecture-sessions/                 # 수업 세션 CRUD + files/init·complete 업로드
  components/
    course-card.tsx                     # 강의 카드 (열기/편집/보관·복원/삭제 메뉴)
    course-form-dialog.tsx              # 강의 추가/편집 폼 모달
    session-form-dialog.tsx             # 수업 추가/편집 폼 모달
    confirm-dialog.tsx                  # 보관/복원/삭제 확인 모달
    coming-soon.tsx                     # placeholder 화면 (backHref로 강의로 돌아가기 지원)
    study-material-section.tsx          # 학습지 업로드/교체/삭제 + 매핑 표
    mapping-row.tsx                     # 매핑 표 한 행(읽기/인라인 편집)
    lecture-sessions-section.tsx        # 수업 기록 목록(날짜별 그룹) + 수업 추가
  lib/
    supabase/                           # 브라우저/서버 Supabase 클라이언트 + upload-client(직접 업로드 헬퍼)
    ai/                                 # Claude/Gemini/OpenAI provider 추상화 + 학습지 목차 분석
    courses.ts                          # Course 타입/상태
    lecture-sessions.ts                 # LectureSession 타입/검증/파일 설정
    study-materials.ts                  # StudyMaterial/Mapping 타입
supabase/
  migrations/                           # DB 스키마 (강의 중심)
```
