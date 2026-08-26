-- 문제풀이(야마그대로/야마변형/티야/탈야) 생성 작업 추적용.
-- 정리본과 동일한 이유로(60초 요청 제한) 브라우저가 라운드를 하나씩 진행시키는
-- 구조를 그대로 재사용한다 — status/round/error_message가 그 상태를 담는다.

create table if not exists question_batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  status text not null default 'generating' check (status in ('generating', 'done', 'error')),
  round integer not null default 0,
  -- 라운드 사이에 이어붙이는 원본 태그 텍스트 ([Q]...[/Q] 누적본). 완료 후
  -- questions 행으로 파싱·저장되고 나면 더는 필요 없지만 디버깅용으로 남겨둔다.
  content text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists question_batch_sessions (
  question_batch_id uuid not null references question_batches (id) on delete cascade,
  lecture_session_id uuid not null references lecture_sessions (id) on delete cascade,
  primary key (question_batch_id, lecture_session_id)
);

alter table questions
  add column if not exists question_batch_id uuid references question_batches (id) on delete cascade;

create index if not exists question_batches_course_id_idx on question_batches (course_id);
create index if not exists question_batch_sessions_session_id_idx on question_batch_sessions (lecture_session_id);
create index if not exists questions_question_batch_id_idx on questions (question_batch_id);
