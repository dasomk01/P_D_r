# 신경학 문풀앱 2 (neuro2)

1번 앱(`quiz-app/neuro`, https://claude.ai/artifact/1Hc4jiqbWcBXmF1ox3PcDS)이 16MB 한도에 가까워 **9/28 2교시 수업부터** 이 2번 앱에 넣는다. 1번 앱 폴더와 주소는 건드리지 않는다.

배포 주소(Artifact): https://claude.ai/artifact/PcoxmVy5jnawmgJZ34Lv2u — 수정할 땐 같은 URL로 다시 publish해서 주소를 유지한다.

## 빌드
```
python3 make_work.py && python3 build.py && python3 features.py && python3 mkart.py   # → neuro2-app.html(Artifact용) + 신경학문풀앱2.html(크롬에서 파일로 여는 단독본)
```
- `topics.json` : 앱에 넣을 주제 순서. 새 수업은 `specs/topic-0NN.py`를 만들고 여기에 추가.
- `specs/topic-0NN.py` : 주제 하나의 원고 — `TOPIC`(교수·날짜·교시), `YAMA`(학습지 원문·제공 정답), `VAR`(야마 변형), `TY`(티야, STT 강조), `OFF`(탈야, 강의록 기준). 번호는 1번 앱(topic-001~026) 다음인 027부터.
- `make_work.py` : specs → `work.html`(교수님 → 날짜/주제 → 야마/야마 변형/티야/탈야 구조). 재실행해도 같은 결과.
- `build.py`·`dedup.py` : 중복 야마 병합(👑 킹야/킹킹야). 자동 판정에서 빠지는 같은 case는 `dedup.MANUAL`에 추가.
- `features.py` : 출제교수 태그(`yprof.json`은 make_work가 생성), 연도 정렬·번호 재부여, 복습 표시.
  복습 표시 저장 키는 localStorage `neuro2-app-marks-v1`(1번 앱 `neuro-app-marks-v5`와 분리).
- `img/` : 학습지·강의록에서 잘라 넣은 영상.

## 수록 주제
- topic-027 · 9/28 2교시 전신질환에서 신경계증상 (김고운) — 학습지 222–225쪽, 강의록(스마일 표시), STT
- topic-028 · 9/28 3교시 중추신경계 감염질환 (강진주) — 학습지 300–305쪽, 강의록 21쪽 문제, STT
- topic-029 · 9/28 4교시 자율신경계 질환 (강진주) — 학습지 135–139쪽(실신 단원 기출; 객61·객2는 [수업범위 외]), 강의록 32쪽 문제, STT
