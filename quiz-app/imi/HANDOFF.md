# 임상의학입문(임의입) 문풀 – 인수인계

- 앱 주소(같은 주소로 계속 업데이트): https://claude.ai/artifact/H9YxqRiyHJMVoDns3DrNLD
  - 앱 키 `imi-app` (문제 키 `imi-…`). **이과 앱(`quiz-app/ent`, 브랜치 claude/ent-quiz-app-7995rr)과 같은 템플릿·기능**: 👑킹야/👑👑킹킹야, 🤍형성평가 칩, 야마 선지별 해설(🎓/📚/🧠), 여러 개 고르기 채점, 👀 정답 다 보기(localStorage `imi-rv`), 💬 메모 답 보라 상자, 오답노트·다회독·주관식 자가채점.
  - 저장 경로: 기록 `st/<UID>`, 메모 `memo/<UID>` + `~1..~3`, 로그 `st/<UID>~log`.
  - capabilities: db 규칙 `st`/`memo`(owner), `st/{self}`/`memo/{self}`(interact) + `user`. 다시 publish 할 때 생략하면 유지.
- 범위: **임상의학입문 1-2** (사용자 확인 11/25). Somed 과목명이 「2-2」지만 학습지·수업은 1-2. 캘린더의 2-2(의료면담·OSCE 실습)는 자료가 없어 제외.
- 빌드: `python3 build_imi.py` → `imi-app.html` (errs·dup·구역누락·answer-much-longer 모두 비어야 함)

## 지금 상태 (11/25)
- 반영된 단원(`done.txt`): u01_la(9/2 정연준) 티야 40·야마 6·출제경향 6 / u12_cxr(10/21 진공용) 티야 24·야마 44(그림 25, 채점 제외 3: 2019 객57·2018 객21·2016 객81). 연도 2000 = 학습지 「20??」(앱엔 「연도 미상」). / u16_foley(10/22 신유섭) 티야 24·야마 4·출제경향 4(채점 제외: 2025 객32 – 학습지 정답 「?」, 두 해석 노트). u13_preop(10/22 하기원) 티야 26·야마 7·출제경향 5 / u14_splint(10/22 권태영) 티야 25·야마 6(그림 4) / u04_blood(10/8 8교시, 강의자 이승엽 추정 – STT 제목 박준홍은 오기로 봄) 티야 22·야마 4·출제경향 6. u07_labintro(10/1 조용곤 진검 총론) 티야 25·야마 4(채혈관 순서는 교수님 정정 50:22 반영) / 빌드는 파일이 덜 된 단원을 「⏳ 작업 중 단원 건너뜀」으로 건너뜀. 나머지 단원은 단원별 에이전트가 작업 중(`BRIEF.md` 기준).
- 빌드: 개발 중 `python3 build_imi.py`(모든 단원 파일), publish 용 `PUBLISH=1 python3 build_imi.py`(done.txt 단원만).
- 수업·자료: `NOTES_src.md` (u01–u20 slug·code·STT·강의록 fileId, 빠진 자료).

## 파일
| 파일 | 역할 |
|---|---|
| `app.html`, `mk.py` | 이과 앱 템플릿(👀 키만 `imi-rv`)·빌더 |
| `build_imi.py`, `order.py`, `done.txt` | 빌드. 단원별 `sec_<slug>.py`(MODS·YMODS·YSEC·YSRC)를 order.py 순서로 모음. 보조 파일은 glob 으로 합침: `yx_*`, `yimg_*`(IMG·NOTE), `yexp_*`, `fq_*`(FQ), `fix_*`(FIX), `tq_*`(TQ), `ansfix_*`(F), `memo_ans*`(A) |
| `q00_trend.py`, `trend_<slug>.py`, `출제경향_<slug>.md` | 📈 출제경향: 교수님 STT 원문·시각(md) → 예상문제(영역 「출제경향」, 📈 칩) |
| `BRIEF.md` | 단원 작업 규칙(형식·근거 우선순위·검증·보고) |
| `q*_*.py` | 티야: `SEC=(섹션,교수)`, `Q=[(영역,키,문제,[선지5],정답번호,해설,[선지별해설5],근거)]` 정답은 1번 자리, 빌드에서 md5 시드로 섞음 |
| `y_*.py` / `yx_*.py` | 야마 원문·정답 / 선지별 해설 (이과 앱과 같은 형식) |
| `fq_<slug>.py` | 🤍 형성평가 원문 `FQ={수업모듈:[튜플]}` |
| `tyb.py`, `crop.py` | 📌 티야방(비어 있음) / 학습지 쪽 이미지에서 그림 자르기 |

## 남은 일
- 수업별 티야·야마 채우기(10/21 진공용부터).
- 캘린더에 없는 학습지 단원(신현백 등 11개) 자료 위치 확인.
- 출제경향.md, 그림 문항 자르기, 형성평가.
