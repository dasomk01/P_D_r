-- Supabase 대시보드 Authentication → Users → Add user 로 만든 계정을 자동으로 멤버로 등록합니다.
-- (공개 회원가입은 꺼져 있으므로 대시보드에서 직접 만든 계정만 여기에 해당합니다.)
-- 표시 이름은 이메일 앞부분으로 시작하고, 사이트의 설정·백업 화면에서 바꿀 수 있습니다.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (user_id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
