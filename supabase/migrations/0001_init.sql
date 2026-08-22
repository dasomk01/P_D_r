-- SOM STUDY initial schema (Phase 1)
-- Single-user app: all reads/writes go through Next.js server API routes using
-- the Supabase service-role key, so RLS is enabled with no public policies —
-- the anon key alone cannot read or write any of these tables.

create extension if not exists "pgcrypto";

create table if not exists lectures (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  period smallint not null check (period between 1 and 8),
  subject text not null,
  title text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, period)
);

create table if not exists lecture_files (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid not null references lectures (id) on delete cascade,
  type text not null check (type in ('yachek', 'lecture_pdf', 'stt_txt', 'worksheet_pdf')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid not null references lectures (id) on delete cascade,
  content text,
  docx_path text,
  pdf_path text,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid not null references lectures (id) on delete cascade,
  category text not null check (category in ('야마그대로', '야마변형', '티야', '탈야')),
  content_json jsonb not null,
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  review_notes text,
  created_at timestamptz not null default now()
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
  lecture_id uuid not null references lectures (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tutor_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists lecture_files_lecture_id_idx on lecture_files (lecture_id);
create index if not exists summaries_lecture_id_idx on summaries (lecture_id);
create index if not exists questions_lecture_id_idx on questions (lecture_id);
create index if not exists attempts_question_id_idx on attempts (question_id);
create index if not exists tutor_sessions_lecture_id_idx on tutor_sessions (lecture_id);
create index if not exists tutor_messages_session_id_idx on tutor_messages (session_id);

alter table lectures enable row level security;
alter table lecture_files enable row level security;
alter table summaries enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table tutor_sessions enable row level security;
alter table tutor_messages enable row level security;
