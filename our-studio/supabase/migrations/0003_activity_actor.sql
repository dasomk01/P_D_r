-- ChatGPT(MCP) 처럼 로그인 세션 없이 저장된 변경도 활동 기록에 작성자가 남도록,
-- auth.uid() 가 없으면 행의 updated_by / created_by 등을 작성자로 씁니다.

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
  values (v_proj,
          coalesce(auth.uid(), (rec->>'updated_by')::uuid, (rec->>'created_by')::uuid, (rec->>'author')::uuid,
                   (rec->>'approved_by')::uuid, (rec->>'uploaded_by')::uuid),
          v_act, tg_table_name, (rec->>'id')::uuid, coalesce(v_title, ''));
  return null;
end;
$$;
