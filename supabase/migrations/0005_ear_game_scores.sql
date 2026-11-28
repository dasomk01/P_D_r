-- 귀찢기 게임(/ear-game) 친구 랭킹용 점수 기록.
-- 서버 API(service role)로만 읽고 쓴다 — RLS를 켜고 정책을 두지 않아 anon 키로는 접근 불가.

create table if not exists ear_game_scores (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 12),
  score integer not null check (score between 1 and 1000000),
  created_at timestamptz not null default now()
);

alter table ear_game_scores enable row level security;

create index if not exists ear_game_scores_score_idx on ear_game_scores (score desc);
