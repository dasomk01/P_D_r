# SOM STUDY

개인용 의대 AI 공부 웹앱. iPad에서 웹으로 사용(설치 X).

핵심 흐름: **자료 업로드 → 정리본 생성(Claude) → 문제 생성(Gemini) → 문제풀이 → 오답 축적 → AI 과외(GPT)**

첫 화면 3개 카드: 📚 정리본 / 🧠 문제풀이 / 👩🏻‍🏫 과외 — 서로 데이터 공유.

**자료 관리는 "강의(Course)" 중심**으로 이루어집니다: 강의 → 학습지(강의당 1개) / 수업 기록(날짜·교시별 세션, 각각 강의록+STT) → 정리본·문제풀이·과외. 날짜 기준 달력 View는 전체 수업을 빠르게 훑어보는 보조 화면으로 별도 제공될 예정입니다(Phase D).

## 기술 스택

- **Next.js** (App Router, TypeScript, Tailwind CSS) — GitHub + Vercel
- **Supabase**: DB(Postgres) + Storage
- **AI**: Claude(정리본) / Gemini(문제 생성) / OpenAI(과외) — 모두 서버사이드에서만 호출

## 현재 상태 — Phase A 완료 (강의 관리)

- **DB 스키마를 강의(Course) 중심으로 전면 재설계**했습니다 (`supabase/migrations/0001_init.sql`): `courses`, `study_materials`, `study_material_mappings`, `lecture_sessions`, `summaries`, `combined_summaries`, `combined_summary_sessions`, `questions`, `question_lecture_sessions`, `attempts`, `tutor_sessions`, `tutor_messages`. 이전의 날짜 중심 `lectures`/`lecture_files` 테이블은 제거했습니다 (아직 실제 배포 데이터가 없어 무중단 마이그레이션 없이 교체).
- **"야첵" 개념은 완전히 제거**했습니다 — 파일 타입, 라벨, DB 구조 어디에도 없습니다. 학습지는 강의당 1개(`study_materials`, 교체 시 이전 버전 보존), 수업 세션 파일은 강의록 PDF + STT 텍스트 2개뿐입니다.
- `/summary` — 현재 진행 중인 강의 카드 목록 + `＋ 강의 추가` + `📦 보관된 강의` 섹션
- `/summary/[courseId]` — 강의 상세 페이지 (편집/보관·복원/영구 삭제, 학습지·수업 기록·학습 섹션은 이후 Phase에서 채울 placeholder)
- `/api/courses` (GET `?status=active|archived`, POST 생성), `/api/courses/[id]` (GET/PATCH/DELETE) — 영구 삭제는 `confirm:true` 필수 + 관련 Storage 파일(학습지/강의록/STT/정리본)을 먼저 정리한 뒤 DB row를 cascade 삭제
- 재사용 가능한 컴포넌트: `CourseCard`, `CourseFormDialog`, `ConfirmDialog`
- Supabase 환경변수가 없어도 UI는 전부 렌더링되고, DB 호출 시에만 안내 메시지를 보여줌 — 환경변수만 연결하면 바로 동작

## 다음 Phase

| Phase | 내용 |
|---|---|
| B | 강의별 학습지 1회 업로드 + AI 목차 분석(교수/파트/페이지/문제 mapping) + 사용자 검수 |
| C | 수업 세션 관리(날짜/1~8교시/교수/파트/강의록·STT 업로드) |
| D | 달력 View (월 이동, 날짜 선택 시 해당 날짜 수업 확인) |
| E | 정리본 — 개별/통합, Claude API (기존 정리본 프롬프트 적용 예정, 구현 시점에 요청) |
| F | 문제풀이 — 야마그대로/야마변형/티야/탈야, Gemini API, 즉시 채점 + 오답노트 |
| G | 과외 — 채팅형 1:1, OpenAI API (기존 과외 프롬프트 적용 예정, 구현 시점에 요청) |

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
    page.tsx                    # 홈 (3개 카드)
    summary/                    # 정리본 — 강의 목록/상세 (Phase A 완료, E는 예정)
      page.tsx                  # 현재 진행 중인 강의 / 보관된 강의
      [courseId]/page.tsx       # 강의 상세 (학습지/수업 기록/학습 섹션)
    questions/                  # 문제풀이 (Phase F)
    tutor/                      # 과외 (Phase G)
    api/
      health/                   # Supabase 연결 확인
      courses/                  # 강의 CRUD (GET/POST, GET/PATCH/DELETE [id])
  components/
    course-card.tsx             # 강의 카드 (열기/편집/보관·복원/삭제 메뉴)
    course-form-dialog.tsx      # 강의 추가/편집 폼 모달
    confirm-dialog.tsx          # 보관/복원/삭제 확인 모달
  lib/
    supabase/                   # 브라우저/서버 Supabase 클라이언트
    ai/                         # Claude/Gemini/OpenAI provider 추상화
    courses.ts                  # Course 타입/상태
supabase/
  migrations/                   # DB 스키마 (강의 중심)
```
