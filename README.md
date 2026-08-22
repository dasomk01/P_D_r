# SOM STUDY

개인용 의대 AI 공부 웹앱. iPad에서 웹으로 사용(설치 X).

핵심 흐름: **자료 업로드 → 정리본 생성(Claude) → 문제 생성(Gemini) → 문제풀이 → 오답 축적 → AI 과외(GPT)**

첫 화면 3개 카드: 📚 정리본 / 🧠 문제풀이 / 👩🏻‍🏫 과외 — 서로 데이터 공유.

## 기술 스택

- **Next.js** (App Router, TypeScript, Tailwind CSS) — GitHub + Vercel
- **Supabase**: DB(Postgres) + Storage
- **AI**: Claude(정리본) / Gemini(문제 생성) / OpenAI(과외) — 모두 서버사이드에서만 호출

## 현재 상태 — Phase 1 완료

- Next.js 앱 기본 골격, 홈 화면 3개 카드(정리본/문제풀이/과외) + 각 라우트 placeholder 페이지
- Supabase 클라이언트 헬퍼(`src/lib/supabase`) — 브라우저용 anon 클라이언트, 서버 전용 service-role 클라이언트
- Supabase DB 스키마 마이그레이션(`supabase/migrations/0001_init.sql`) — `lectures`, `lecture_files`, `summaries`, `questions`, `attempts`, `tutor_sessions`, `tutor_messages`
- AI provider 추상화(`src/lib/ai`) — Claude/Gemini/OpenAI 구현체 + `SUMMARY_PROVIDER`/`QUESTION_PROVIDER`/`TUTOR_PROVIDER` 환경변수로 역할별 벤더 교체 가능
- `/api/health` — Supabase 연결 확인용 헬스체크

다음 Phase(2~8)는 프로젝트 문서의 개발 순서를 따릅니다: 달력+업로드 → Claude 정리본 → Word/PDF 생성 → Gemini 문제 생성+검수 → 문제풀이 UI → 오답노트 → AI 과외.

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
    page.tsx            # 홈 (3개 카드)
    summary/            # 정리본 (Phase 2~4)
    questions/          # 문제풀이 (Phase 5~6)
    tutor/              # 과외 (Phase 8)
    api/
      health/           # Supabase 연결 확인
  lib/
    supabase/           # 브라우저/서버 Supabase 클라이언트
    ai/                 # Claude/Gemini/OpenAI provider 추상화
supabase/
  migrations/           # DB 스키마
```
