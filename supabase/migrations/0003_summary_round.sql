-- 정리본 생성을 "60초 안에 끝나는 한 라운드씩, 스스로 다음 라운드를 호출하는 체인"으로
-- 재설계하기 위한 진행 라운드 카운터. round는 지금까지 완료된 라운드 수(누적 텍스트가
-- 몇 번째 이어쓰기까지 반영됐는지)를 추적해 무한 루프를 방지하는 안전장치로 쓰인다.

alter table summaries add column if not exists round integer not null default 0;
alter table combined_summaries add column if not exists round integer not null default 0;
