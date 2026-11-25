# 임상의학입문(임의입) 문풀 – 인수인계

- 앱 주소(같은 주소로 계속 업데이트): https://claude.ai/artifact/H9YxqRiyHJMVoDns3DrNLD
  - 앱 키 `imi-app` (문제 키 `imi-…`). **이과 앱(`quiz-app/ent`, 브랜치 claude/ent-quiz-app-7995rr)과 같은 템플릿·기능**: 👑킹야/👑👑킹킹야, 🤍형성평가 칩, 야마 선지별 해설(🎓/📚/🧠), 여러 개 고르기 채점, 👀 정답 다 보기(localStorage `imi-rv`), 💬 메모 답 보라 상자, 오답노트·다회독·주관식 자가채점.
  - 저장 경로: 기록 `st/<UID>`, 메모 `memo/<UID>` + `~1..~3`, 로그 `st/<UID>~log`.
  - capabilities: db 규칙 `st`/`memo`(owner), `st/{self}`/`memo/{self}`(interact) + `user`. 다시 publish 할 때 생략하면 유지.
- 범위: **임상의학입문 1-2** (사용자 확인 11/25). Somed 과목명이 「2-2」지만 학습지·수업은 1-2. 캘린더의 2-2(의료면담·OSCE 실습)는 자료가 없어 제외.
- 빌드: `python3 build_imi.py` → `imi-app.html` (errs·dup·구역누락·answer-much-longer 모두 비어야 함)

## 지금 상태 (11/25)
- 빈 앱 publish. 티야 0 · 야마 0.
- 자료 목록: `NOTES_src.md` (수업 10칸, 빠진 자료 명시).

## 파일
| 파일 | 역할 |
|---|---|
| `app.html`, `mk.py` | 이과 앱 템플릿(👀 키만 `imi-rv`)·빌더 |
| `build_imi.py` | 빌드. 구역 표(MODS·YMODS·YSEC·YSRC·PRE·PREFAM)는 `sections.py` 에 둔다(없으면 빈 앱) |
| `q*_*.py` | 티야: `SEC=(섹션,교수)`, `Q=[(영역,키,문제,[선지5],정답번호,해설,[선지별해설5],근거)]` 정답은 1번 자리, 빌드에서 md5 시드로 섞음 |
| `y_*.py` / `yx_*.py` | 야마 원문·정답 / 선지별 해설 (이과 앱과 같은 형식) |
| `fq_fh.py` | 🤍 형성평가 원문 `FQ={수업모듈:[튜플]}` |
| `tq_tyb.py`, `tyb.py`, `fix_choices*.py`, `ansfix.py`, `memo_ans.py`, `yimg_imi.py`, `yexp_imi.py` | 이과 앱과 같은 역할(지금은 비어 있음) |

## 남은 일
- 수업별 티야·야마 채우기(10/21 진공용부터).
- 캘린더에 없는 학습지 단원(신현백 등 11개) 자료 위치 확인.
- 출제경향.md, 그림 문항 자르기, 형성평가.
