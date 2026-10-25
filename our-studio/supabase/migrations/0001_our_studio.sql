-- OUR STUDIO — 초기 스키마
-- 2인 비공개 공동 작업실. 모든 테이블은 members 에 등록된 사용자만 읽고 쓸 수 있습니다(RLS).
-- Supabase SQL Editor 에 그대로 붙여 실행하거나 `supabase db push` 로 적용합니다.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- 멤버 (초대된 2명)
-- ─────────────────────────────────────────────────────────────
create table public.members (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  color        text not null default '#1F2A44',
  created_at   timestamptz not null default now()
);

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.members where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if auth.uid() is not null then
    begin
      new.updated_by := auth.uid();
    exception when undefined_column then
      null;
    end;
  end if;
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 프로젝트 (KOREA TRIP / MED SCHOOL TOON)
-- ─────────────────────────────────────────────────────────────
create table public.projects (
  id          text primary key,
  name        text not null,
  handle      text not null,
  kind        text not null check (kind in ('travel', 'toon')),
  daily_time  time not null,
  timezone    text not null default 'Asia/Seoul',
  description text not null default '',
  settings    jsonb not null default '{}'::jsonb
);

insert into public.projects (id, name, handle, kind, daily_time, description, settings) values
  ('korea-trip', 'KOREA TRIP', '@korea_trip_always', 'travel', '17:00',
   '외국인 관광객을 위한 한국 여행 영어 캐러셀 콘텐츠',
   '{"pages": 7, "ratio": "4:5", "size": "1080x1350", "language": "en", "hashtags": 5}'::jsonb),
  ('med-toon', 'MED SCHOOL TOON', 'MED SCHOOL TOON (익명)', 'toon', '23:00',
   '흰 토끼(여자 의대생)와 갈색 곰(남자 의대생)의 익명 인스타툰',
   '{"sensitive_terms": [], "style": "", "cuts_default": 6}'::jsonb);

-- ─────────────────────────────────────────────────────────────
-- 여행 기록 / 방문 장소 (OUR TRAVEL ARCHIVE)
-- ─────────────────────────────────────────────────────────────
create table public.trips (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(trim(title)) > 0),
  region      text not null default '',
  start_date  date,
  end_date    date,
  notes       text not null default '',
  created_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  updated_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.places (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (length(trim(name)) > 0),
  region          text not null default '',
  address         text not null default '',
  lat             double precision,
  lng             double precision,
  -- visited: 우리가 직접 방문 / wishlist: 아직 방문하지 않은 추천 장소
  status          text not null default 'visited' check (status in ('visited', 'wishlist')),
  category        text not null default 'attraction'
                  check (category in ('restaurant', 'cafe', 'attraction', 'hotel', 'nature', 'shopping', 'activity', 'transport', 'other')),
  trip_id         uuid references public.trips (id) on delete set null,
  -- 내부 관리용 — 공개 콘텐츠에 자동으로 노출하지 않음
  visited_on      date,
  visitors        uuid[] not null default '{}',
  review          text not null default '',
  recommended     text not null default '',
  price_paid      text not null default '',
  pros            text not null default '',
  cons            text not null default '',
  why_foreigners  text not null default '',
  revisit         text check (revisit in ('yes', 'maybe', 'no')),
  links           text[] not null default '{}',
  tags            text[] not null default '{}',
  created_by      uuid default auth.uid() references public.members (user_id) on delete set null,
  updated_by      uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index places_region_idx on public.places (region);

-- AI·수동 조사 자료. 우리가 직접 경험한 후기(places.review 등)와 반드시 분리 저장합니다.
create table public.place_research (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references public.places (id) on delete cascade,
  kind          text not null check (kind in (
                  'location', 'nearby_attraction', 'nearby_food', 'route',
                  'official_info', 'photo_candidate', 'content_topic', 'note')),
  title         text not null,
  body          text not null default '',
  url           text,
  source_name   text not null default '',
  -- 사진 후보: 권한이 확인되지 않으면 참고용 링크로만 보관
  usage_status  text not null default 'reference_only'
                check (usage_status in ('reference_only', 'permission_needed', 'licensed', 'public_domain')),
  license_note  text not null default '',
  provenance    text not null default 'manual' check (provenance in ('ai', 'manual')),
  verified      boolean not null default false,
  ai_model      text,
  created_by    uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at    timestamptz not null default now()
);
create index place_research_place_idx on public.place_research (place_id);

-- ─────────────────────────────────────────────────────────────
-- 아이디어 보드
-- ─────────────────────────────────────────────────────────────
create table public.ideas (
  id          uuid primary key default gen_random_uuid(),
  project_id  text not null references public.projects (id),
  title       text not null check (length(trim(title)) > 0),
  memo        text not null default '',
  tags        text[] not null default '{}',
  links       text[] not null default '{}',
  priority    smallint not null default 2 check (priority between 1 and 3),
  status      text not null default 'idea' check (status in (
                'idea', 'ai_planning', 'ready', 'in_production', 'in_review', 'revising', 'approved')),
  is_next     boolean not null default false,
  place_ids   uuid[] not null default '{}',
  source      text not null default 'manual' check (source in ('manual', 'ai_suggested', 'imported')),
  sort_order  double precision not null default extract(epoch from now()),
  created_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  updated_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index ideas_project_idx on public.ideas (project_id, status);

create table public.idea_votes (
  idea_id    uuid not null references public.ideas (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.members (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- 인스타툰 캐릭터 설정집
-- ─────────────────────────────────────────────────────────────
create table public.characters (
  id           uuid primary key default gen_random_uuid(),
  project_id   text not null default 'med-toon' references public.projects (id),
  name         text not null,
  species      text not null default '',
  role         text not null default '',
  appearance   text not null default '',
  personality  text not null default '',
  speech_style text not null default '',
  rules        text not null default '',
  sort_order   int not null default 0,
  updated_by   uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

insert into public.characters (name, species, role, appearance, personality, rules, sort_order) values
  ('토끼', '흰 토끼', '여자 의대생',
   '하얀 털, 긴 귀, 둥근 얼굴. 기본 복장은 흰 가운 또는 후드티.', '',
   '실명·학교·학번 등 개인 식별 정보를 붙이지 않는다. 외형은 설정집 레퍼런스와 일관되게 유지.', 1),
  ('곰', '갈색 곰', '남자 의대생',
   '갈색 털, 둥근 귀, 큰 체형. 기본 복장은 흰 가운 또는 맨투맨.', '',
   '실명·학교·학번 등 개인 식별 정보를 붙이지 않는다. 외형은 설정집 레퍼런스와 일관되게 유지.', 2);

-- ─────────────────────────────────────────────────────────────
-- 콘텐츠 · 버전 · 승인
-- ─────────────────────────────────────────────────────────────
create table public.contents (
  id                  uuid primary key default gen_random_uuid(),
  project_id          text not null references public.projects (id),
  idea_id             uuid references public.ideas (id) on delete set null,
  title               text not null check (length(trim(title)) > 0),
  keywords            text[] not null default '{}',
  status              text not null default 'in_production' check (status in (
                        'ai_planning', 'ready', 'in_production', 'in_review', 'revising', 'approved')),
  scheduled_date      date,
  sort_order          double precision not null default extract(epoch from now()),
  current_version_no  int not null default 1,
  approved_version_id uuid,
  created_by          uuid default auth.uid() references public.members (user_id) on delete set null,
  updated_by          uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index contents_schedule_idx on public.contents (project_id, scheduled_date);

create table public.content_versions (
  id          uuid primary key default gen_random_uuid(),
  content_id  uuid not null references public.contents (id) on delete cascade,
  version_no  int not null,
  data        jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  -- 승인된 버전은 잠금 — 이후 수정은 새 버전으로만 가능
  locked      boolean not null default false,
  created_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (content_id, version_no)
);

alter table public.contents
  add constraint contents_approved_version_fk
  foreign key (approved_version_id) references public.content_versions (id) on delete set null;

create table public.approvals (
  id          uuid primary key default gen_random_uuid(),
  content_id  uuid not null references public.contents (id) on delete cascade,
  version_id  uuid not null references public.content_versions (id) on delete cascade,
  version_no  int not null,
  approved_by uuid not null default auth.uid() references public.members (user_id),
  approved_at timestamptz not null default now(),
  note        text not null default '',
  unique (version_id)
);

-- ─────────────────────────────────────────────────────────────
-- 파일·사진 (출처·권한 관리 포함)
-- ─────────────────────────────────────────────────────────────
create table public.assets (
  id             uuid primary key default gen_random_uuid(),
  project_id     text not null references public.projects (id),
  storage_path   text not null unique,
  thumb_path     text,
  file_name      text not null,
  mime_type      text not null default 'application/octet-stream',
  size_bytes     bigint not null default 0,
  width          int,
  height         int,
  kind           text not null default 'photo' check (kind in (
                   'photo', 'file', 'character_ref', 'pose_ref', 'style_ref',
                   'storyboard', 'page_image', 'final', 'other')),
  caption        text not null default '',
  location_text  text not null default '',
  taken_on       date,
  uploaded_by    uuid default auth.uid() references public.members (user_id) on delete set null,
  rights_holder  text not null default '',
  origin         text not null default 'own_photo' check (origin in (
                   'own_photo', 'licensed', 'official', 'ai_generated', 'reference_only', 'other')),
  usage_allowed  boolean not null default false,
  license        text not null default '',
  source_url     text,
  ai_tags        text[] not null default '{}',
  place_id       uuid references public.places (id) on delete set null,
  trip_id        uuid references public.trips (id) on delete set null,
  idea_id        uuid references public.ideas (id) on delete set null,
  content_id     uuid references public.contents (id) on delete set null,
  character_id   uuid references public.characters (id) on delete set null,
  created_at     timestamptz not null default now(),
  -- 권한 미확인 참고 이미지는 공개 콘텐츠에 사용할 수 없음
  constraint reference_only_not_usable check (origin <> 'reference_only' or usage_allowed = false)
);
create index assets_place_idx on public.assets (place_id);
create index assets_project_idx on public.assets (project_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- 댓글 (아이디어 / 콘텐츠 페이지별 / 장소) · 수정 요청
-- ─────────────────────────────────────────────────────────────
create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  project_id  text not null references public.projects (id),
  target_type text not null check (target_type in ('idea', 'content', 'place')),
  target_id   uuid not null,
  version_no  int,
  page_no     int,
  kind        text not null default 'comment' check (kind in ('comment', 'revision_request')),
  body        text not null check (length(trim(body)) > 0),
  resolved    boolean not null default false,
  author      uuid not null default auth.uid() references public.members (user_id),
  created_at  timestamptz not null default now()
);
create index comments_target_idx on public.comments (target_type, target_id);

-- ─────────────────────────────────────────────────────────────
-- AI 실행 기록 (결과 자동 저장)
-- ─────────────────────────────────────────────────────────────
create table public.ai_runs (
  id          uuid primary key default gen_random_uuid(),
  project_id  text references public.projects (id),
  kind        text not null,
  target_id   uuid,
  input       jsonb not null default '{}'::jsonb,
  output      jsonb,
  model       text,
  status      text not null default 'done' check (status in ('done', 'error')),
  error       text,
  created_by  uuid default auth.uid() references public.members (user_id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 활동 기록 (최근 댓글·수정 내역)
-- ─────────────────────────────────────────────────────────────
create table public.activity (
  id         bigint generated always as identity primary key,
  project_id text,
  actor      uuid,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  title      text not null default '',
  created_at timestamptz not null default now()
);
create index activity_created_idx on public.activity (created_at desc);

create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec     jsonb;
  v_title text;
  v_proj  text;
  v_act   text;
begin
  if tg_op = 'DELETE' then rec := to_jsonb(old); else rec := to_jsonb(new); end if;
  v_act := lower(tg_op);
  v_title := coalesce(rec->>'title', rec->>'name', rec->>'file_name', left(rec->>'body', 80), '');
  v_proj := rec->>'project_id';

  if tg_table_name = 'content_versions' or tg_table_name = 'approvals' then
    select c.project_id, c.title into v_proj, v_title
      from public.contents c where c.id = (rec->>'content_id')::uuid;
    v_title := coalesce(v_title, '') || ' · v' || coalesce(rec->>'version_no', '?');
  elsif tg_table_name in ('places', 'trips') then
    v_proj := 'korea-trip';
  end if;

  if tg_op = 'UPDATE' then
    if tg_table_name in ('ideas', 'contents') and (to_jsonb(old)->>'status') is distinct from (rec->>'status') then
      v_act := 'status:' || (rec->>'status');
    end if;
  end if;

  insert into public.activity (project_id, actor, action, entity, entity_id, title)
  values (v_proj, auth.uid(), v_act, tg_table_name, (rec->>'id')::uuid, coalesce(v_title, ''));
  return null;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 트리거
-- ─────────────────────────────────────────────────────────────
create trigger trips_touch before update on public.trips for each row execute function public.touch_updated_at();
create trigger places_touch before update on public.places for each row execute function public.touch_updated_at();
create trigger ideas_touch before update on public.ideas for each row execute function public.touch_updated_at();
create trigger characters_touch before update on public.characters for each row execute function public.touch_updated_at();
create trigger contents_touch before update on public.contents for each row execute function public.touch_updated_at();

create or replace function public.versions_guard()
returns trigger
language plpgsql
as $$
begin
  if old.locked and (new.data is distinct from old.data or new.version_no <> old.version_no) then
    raise exception '승인된 버전(v%)은 수정할 수 없습니다. 새 버전으로 저장하세요.', old.version_no;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger content_versions_guard before update on public.content_versions
  for each row execute function public.versions_guard();

create or replace function public.versions_no_delete_locked()
returns trigger
language plpgsql
as $$
begin
  if old.locked and exists (select 1 from public.contents c where c.id = old.content_id) then
    raise exception '승인된 버전은 삭제할 수 없습니다.';
  end if;
  return old;
end;
$$;
create trigger content_versions_no_delete before delete on public.content_versions
  for each row execute function public.versions_no_delete_locked();

-- 콘텐츠 상태가 바뀌면 연결된 아이디어 상태도 따라감
create or replace function public.sync_idea_status()
returns trigger
language plpgsql
as $$
begin
  if new.idea_id is not null and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    update public.ideas set status = new.status where id = new.idea_id and status is distinct from new.status;
  end if;
  return null;
end;
$$;
create trigger contents_sync_idea after insert or update of status on public.contents
  for each row execute function public.sync_idea_status();

create trigger ideas_activity after insert or update or delete on public.ideas for each row execute function public.log_activity();
create trigger places_activity after insert or update or delete on public.places for each row execute function public.log_activity();
create trigger trips_activity after insert on public.trips for each row execute function public.log_activity();
create trigger assets_activity after insert on public.assets for each row execute function public.log_activity();
create trigger contents_activity after insert or update of status, title, scheduled_date or delete on public.contents for each row execute function public.log_activity();
create trigger versions_activity after insert on public.content_versions for each row execute function public.log_activity();
create trigger approvals_activity after insert on public.approvals for each row execute function public.log_activity();
create trigger comments_activity after insert on public.comments for each row execute function public.log_activity();

-- ─────────────────────────────────────────────────────────────
-- RPC: 콘텐츠 저장 / 승인 / 수정 요청
-- ─────────────────────────────────────────────────────────────

-- 새 콘텐츠 + v1 생성
create or replace function public.create_content(
  p_project_id text, p_title text, p_idea_id uuid default null,
  p_keywords text[] default '{}', p_scheduled_date date default null, p_data jsonb default '{}'::jsonb)
returns uuid
language plpgsql
as $$
declare v_id uuid;
begin
  if not public.is_member() then raise exception 'not a member'; end if;
  insert into public.contents (project_id, title, idea_id, keywords, scheduled_date)
  values (p_project_id, p_title, p_idea_id, coalesce(p_keywords, '{}'), p_scheduled_date)
  returning id into v_id;
  insert into public.content_versions (content_id, version_no, data, change_note)
  values (v_id, 1, coalesce(p_data, '{}'::jsonb), '초안');
  return v_id;
end;
$$;

-- 현재 버전 저장. 현재 버전이 승인(잠금)되었거나 p_new_version 이면 새 버전을 만든다.
create or replace function public.save_content_version(
  p_content_id uuid, p_data jsonb, p_note text default '', p_new_version boolean default false)
returns int
language plpgsql
as $$
declare
  v_cur  public.content_versions;
  v_no   int;
begin
  if not public.is_member() then raise exception 'not a member'; end if;
  select v.* into v_cur from public.content_versions v
    join public.contents c on c.id = v.content_id and v.version_no = c.current_version_no
   where c.id = p_content_id
   for update;
  if not found then raise exception 'content not found'; end if;

  if v_cur.locked or p_new_version then
    v_no := v_cur.version_no + 1;
    insert into public.content_versions (content_id, version_no, data, change_note)
    values (p_content_id, v_no, p_data, coalesce(p_note, ''));
    update public.contents
       set current_version_no = v_no,
           status = case when status = 'approved' then 'revising' else status end
     where id = p_content_id;
  else
    v_no := v_cur.version_no;
    update public.content_versions
       set data = p_data,
           change_note = case when coalesce(p_note, '') = '' then change_note else p_note end
     where id = v_cur.id;
    update public.contents set updated_at = now() where id = p_content_id;
  end if;
  return v_no;
end;
$$;

-- 한 명만 승인해도 최종 승인. 승인자·시각·버전을 기록하고 해당 버전을 잠근다.
create or replace function public.approve_content(p_content_id uuid, p_note text default '')
returns uuid
language plpgsql
as $$
declare
  v_ver public.content_versions;
  v_id  uuid;
begin
  if not public.is_member() then raise exception 'not a member'; end if;
  select v.* into v_ver from public.content_versions v
    join public.contents c on c.id = v.content_id and v.version_no = c.current_version_no
   where c.id = p_content_id
   for update;
  if not found then raise exception 'content not found'; end if;
  if v_ver.locked then raise exception '이미 승인된 버전입니다 (v%).', v_ver.version_no; end if;

  update public.content_versions set locked = true where id = v_ver.id;
  insert into public.approvals (content_id, version_id, version_no, note)
  values (p_content_id, v_ver.id, v_ver.version_no, coalesce(p_note, ''))
  returning id into v_id;
  update public.contents set status = 'approved', approved_version_id = v_ver.id where id = p_content_id;
  update public.comments set resolved = true
   where target_type = 'content' and target_id = p_content_id and kind = 'revision_request' and not resolved;
  return v_id;
end;
$$;

create or replace function public.request_revision(p_content_id uuid, p_body text, p_page_no int default null)
returns uuid
language plpgsql
as $$
declare
  v_c  public.contents;
  v_id uuid;
begin
  if not public.is_member() then raise exception 'not a member'; end if;
  select * into v_c from public.contents where id = p_content_id;
  if not found then raise exception 'content not found'; end if;
  insert into public.comments (project_id, target_type, target_id, version_no, page_no, kind, body)
  values (v_c.project_id, 'content', p_content_id, v_c.current_version_no, p_page_no, 'revision_request', p_body)
  returning id into v_id;
  update public.contents set status = 'revising' where id = p_content_id;
  return v_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- RLS — members 에 등록된 사용자만 접근
-- ─────────────────────────────────────────────────────────────
alter table public.members enable row level security;
create policy members_read on public.members for select using (public.is_member());
create policy members_update_self on public.members for update using (user_id = auth.uid()) with check (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['projects', 'trips', 'places', 'place_research', 'ideas', 'idea_votes',
                           'characters', 'contents', 'content_versions', 'approvals', 'assets',
                           'comments', 'ai_runs']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for all using (public.is_member()) with check (public.is_member())',
                   t || '_members_all', t);
  end loop;
end $$;

-- 투표·댓글·승인은 본인 이름으로만 작성
drop policy idea_votes_members_all on public.idea_votes;
create policy idea_votes_read on public.idea_votes for select using (public.is_member());
create policy idea_votes_write on public.idea_votes for insert with check (public.is_member() and user_id = auth.uid());
create policy idea_votes_delete on public.idea_votes for delete using (public.is_member() and user_id = auth.uid());

drop policy comments_members_all on public.comments;
create policy comments_read on public.comments for select using (public.is_member());
create policy comments_insert on public.comments for insert with check (public.is_member() and author = auth.uid());
create policy comments_update on public.comments for update using (public.is_member()) with check (public.is_member());
create policy comments_delete on public.comments for delete using (public.is_member() and author = auth.uid());

drop policy approvals_members_all on public.approvals;
create policy approvals_read on public.approvals for select using (public.is_member());
create policy approvals_insert on public.approvals for insert with check (public.is_member() and approved_by = auth.uid());

-- 프로젝트는 추가/삭제하지 않고 설정만 수정
drop policy projects_members_all on public.projects;
create policy projects_read on public.projects for select using (public.is_member());
create policy projects_update on public.projects for update using (public.is_member()) with check (public.is_member());

alter table public.activity enable row level security;
create policy activity_read on public.activity for select using (public.is_member());

-- ─────────────────────────────────────────────────────────────
-- Storage — 비공개 버킷 (멤버만)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('studio', 'studio', false, 52428800)
on conflict (id) do nothing;

create policy studio_read on storage.objects for select using (bucket_id = 'studio' and public.is_member());
create policy studio_insert on storage.objects for insert with check (bucket_id = 'studio' and public.is_member());
create policy studio_update on storage.objects for update using (bucket_id = 'studio' and public.is_member());
create policy studio_delete on storage.objects for delete using (bucket_id = 'studio' and public.is_member());

-- ─────────────────────────────────────────────────────────────
-- Realtime — 두 사람의 화면을 실시간 동기화
-- ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table
  public.ideas, public.idea_votes, public.comments, public.places, public.place_research,
  public.assets, public.contents, public.content_versions, public.approvals, public.activity,
  public.trips, public.characters, public.projects;
