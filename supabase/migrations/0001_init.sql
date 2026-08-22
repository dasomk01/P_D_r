-- SOM STUDY schema — course-centric structure
-- Single-user app: all reads/writes go through Next.js server API routes using
-- the Supabase service-role key, so RLS is enabled with no public policies —
-- the anon key alone cannot read or write any of these tables.

create extension if not exists "pgcrypto";

-- 강의
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  professor text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 학습지 (강의당 "활성" 버전은 항상 1개, 교체 시 이전 버전은 is_active=false로 보존)
create table if not exists study_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  storage_path text not null,
  version integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists study_materials_one_active_per_course
  on study_materials (course_id)
  where is_active;

-- 학습지 목차 매핑 (AI 분석 결과, 사용자 검수/수정 가능)
create table if not exists study_material_mappings (
  id uuid primary key default gen_random_uuid(),
  study_material_id uuid not null references study_materials (id) on delete cascade,
  professor text,
  part_name text not null,
  page_start integer,
  page_end integer,
  problem_start integer,
  problem_end integer,
  order_index integer not null default 0,
  is_ai_generated boolean not null default true,
  confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 수업 세션 (날짜 + 교시)
create table if not exists lecture_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  date date not null,
  period smallint not null check (period between 1 and 8),
  professor text,
  part_name text,
  lecture_pdf_path text,
  stt_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, period)
);

-- 개별 정리본 (세션 1개 기준)
create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  lecture_session_id uuid not null references lecture_sessions (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  content text,
  docx_path text,
  pdf_path text,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

-- 통합 정리본 (여러 세션의 원본을 직접 사용해 생성)
create table if not exists combined_summaries (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  content text,
  docx_path text,
  pdf_path text,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists combined_summary_sessions (
  combined_summary_id uuid not null references combined_summaries (id) on delete cascade,
  lecture_session_id uuid not null references lecture_sessions (id) on delete cascade,
  primary key (combined_summary_id, lecture_session_id)
);

-- 문제 (야마그대로 / 야마변형 / 티야 / 탈야)
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  category text not null check (category in ('야마그대로', '야마변형', '티야', '탈야')),
  content_json jsonb not null,
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  review_notes text,
  study_material_mapping_id uuid references study_material_mappings (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists question_lecture_sessions (
  question_id uuid not null references questions (id) on delete cascade,
  lecture_session_id uuid not null references lecture_sessions (id) on delete cascade,
  primary key (question_id, lecture_session_id)
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  selected jsonb not null,
  correct boolean not null,
  is_wrong boolean not null,
  attempted_at timestamptz not null default now()
);

create table if not exists tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tutor_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists study_materials_course_id_idx on study_materials (course_id);
create index if not exists study_material_mappings_study_material_id_idx on study_material_mappings (study_material_id);
create index if not exists lecture_sessions_course_id_idx on lecture_sessions (course_id);
create index if not exists summaries_lecture_session_id_idx on summaries (lecture_session_id);
create index if not exists summaries_course_id_idx on summaries (course_id);
create index if not exists combined_summaries_course_id_idx on combined_summaries (course_id);
create index if not exists combined_summary_sessions_session_id_idx on combined_summary_sessions (lecture_session_id);
create index if not exists questions_course_id_idx on questions (course_id);
create index if not exists questions_study_material_mapping_id_idx on questions (study_material_mapping_id);
create index if not exists question_lecture_sessions_session_id_idx on question_lecture_sessions (lecture_session_id);
create index if not exists attempts_question_id_idx on attempts (question_id);
create index if not exists tutor_sessions_course_id_idx on tutor_sessions (course_id);
create index if not exists tutor_messages_session_id_idx on tutor_messages (session_id);

alter table courses enable row level security;
alter table study_materials enable row level security;
alter table study_material_mappings enable row level security;
alter table lecture_sessions enable row level security;
alter table summaries enable row level security;
alter table combined_summaries enable row level security;
alter table combined_summary_sessions enable row level security;
alter table questions enable row level security;
alter table question_lecture_sessions enable row level security;
alter table attempts enable row level security;
alter table tutor_sessions enable row level security;
alter table tutor_messages enable row level security;
