-- MED SCHOOL TOON 제작 개선: 컷별 피드/릴스 이미지, 이미지 검수 결과, 그림체 대표 이미지.
-- 기존 데이터는 지우거나 바꾸지 않고 컬럼·함수만 추가합니다. 여러 번 실행해도 안전합니다.

alter table public.assets add column if not exists variant text check (variant in ('feed', 'reels'));
alter table public.assets add column if not exists qc jsonb;
alter table public.assets add column if not exists pinned boolean not null default false;
alter table public.assets add column if not exists sort_order int not null default 0;

create index if not exists assets_pinned_idx on public.assets (project_id) where pinned;

-- 컷 이미지 한 칸을 원자적으로 지정합니다 (여러 장을 동시에 올려도 덮어쓰기 경합 없음).
-- 현재 버전이 승인되어 잠겨 있으면 승인본은 그대로 두고 새 버전을 만들어 반영합니다.
create or replace function public.set_toon_cut_image(
  p_content_id uuid, p_cut_no int, p_variant text, p_asset_id uuid)
returns int
language plpgsql
as $$
declare
  v_c    public.contents;
  v_ver  public.content_versions;
  v_data jsonb;
  v_no   int;
  v_key  text;
  v_n    int;
begin
  if not (public.is_member() or coalesce(auth.role(), '') = 'service_role') then
    raise exception 'not a member';
  end if;
  if p_variant not in ('feed', 'reels') then raise exception 'variant must be feed or reels'; end if;
  v_key := case when p_variant = 'feed' then 'asset_id' else 'reel_asset_id' end;

  select * into v_c from public.contents where id = p_content_id for update;
  if not found then raise exception 'content not found'; end if;
  select * into v_ver from public.content_versions
   where content_id = p_content_id and version_no = v_c.current_version_no;

  v_data := v_ver.data;
  if coalesce(v_data->>'kind', '') <> 'toon' then raise exception 'not a toon content'; end if;
  v_n := jsonb_array_length(coalesce(v_data->'cuts', '[]'::jsonb));
  if p_cut_no < 1 or p_cut_no > v_n then
    raise exception '컷 %번이 대본에 없습니다 (현재 %컷). 먼저 대본을 저장하세요.', p_cut_no, v_n;
  end if;
  v_data := jsonb_set(v_data, array['cuts', (p_cut_no - 1)::text, v_key], to_jsonb(p_asset_id::text));

  if v_ver.locked then
    v_no := v_ver.version_no + 1;
    insert into public.content_versions (content_id, version_no, data, change_note, created_by)
    values (p_content_id, v_no, v_data, '승인 후 컷 이미지 교체', coalesce(auth.uid(), v_c.updated_by));
    update public.contents set current_version_no = v_no, status = 'revising' where id = p_content_id;
  else
    v_no := v_ver.version_no;
    update public.content_versions set data = v_data where id = v_ver.id;
    update public.contents set updated_at = now() where id = p_content_id;
  end if;
  return v_no;
end;
$$;
