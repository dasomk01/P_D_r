-- 정리본 생성을 동기 요청(60초 제한에 걸림) 대신 백그라운드 작업으로 전환하기 위한 상태 컬럼.
-- API가 즉시 'generating' 행을 만들고, 실제 생성은 응답 이후 백그라운드에서 진행한 뒤 이 행을 업데이트한다.

alter table summaries
  add column if not exists status text not null default 'done'
    check (status in ('pending', 'generating', 'done', 'error')),
  add column if not exists error_message text;

alter table combined_summaries
  add column if not exists status text not null default 'done'
    check (status in ('pending', 'generating', 'done', 'error')),
  add column if not exists error_message text;

-- 기존 행(있다면) 실제 완성 여부에 맞춰 상태를 보정.
update summaries set status = 'error' where docx_path is null and status = 'done';
update combined_summaries set status = 'error' where docx_path is null and status = 'done';

-- 새로 만드는 행은 기본값을 'generating'으로 — API가 생성 시작과 동시에 삽입한다.
alter table summaries alter column status set default 'generating';
alter table combined_summaries alter column status set default 'generating';
