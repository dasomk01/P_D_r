# 정신의학 문풀앱 – 이어서 작업하기

- 앱 주소(같은 주소로 계속 업데이트): https://claude.ai/artifact/UkJMWku7h4tYTkBWZtxyid
  - 새 채팅에서는 Artifact 도구로 이 URL을 먼저 `read` 한 뒤, `url`을 넘겨 publish 해야 같은 주소가 유지된다.
  - capabilities(계정 저장)는 publish 때 생략하면 그대로 유지된다: db 규칙 `st`, `st/{self}`, `memo`, `memo/{self}` + `user`.
- 브랜치: `claude/yama-subjective-talya-objective-yl7zj5`

## 파일
| 파일 | 역할 |
|---|---|
| `app.html` | 앱 화면·동작 템플릿 (`__TITLE__`, `__APPKEY__`, `__DATA__` 자리표시) |
| `mk.py` | 문제 목록 → 플래그 계산 → `app.html`에 데이터 넣어 HTML 생성 |
| `build_psy.py` | `q*.py` 모아서 `psy-app.html` 생성 (선지 섞기, 길이 점검, 티야방 표시) |
| `q1_intro.py` … `q7_ocd.py` | 수업별 문제. 튜플 `(영역, 키, 문제, [선지5], 정답번호, 해설, [선지별해설5], 근거)` |
| `fix_choices.py` | 답 선지가 길이로 티 나지 않게 다시 쓴 선지(`FIX`)·해설(`EXPFIX`) |
| `tyb.py` | 티야방(공유 문서) 표시: 키 → (담당자, 멘트) |
| `psy-app.html` | 빌드 결과 (이것을 publish) |

빌드: `cd quiz-app/psy && python3 build_psy.py` → `psy-app.html`

## 규칙(사용자 지정)
- 영역: 야마(기출 원문·정답 그대로, 임의 수정 금지) / 야마 변형 / 티야(STT 강조 + 티야방) / 탈야(강의록 내용).
- 키는 고정(`psy-<키>`) – 기록·메모가 키에 저장되므로 바꾸지 않는다.
- 객관식 5지선다, 답 선지만 길지 않게(`build_psy.py`가 1.6배 넘으면 경고).
- 교수님 발언·강조는 STT 근거가 있을 때만.
- 보고는 한국어로.

## 자료
- 솜에드(Somed): 강의록·STT는 `get_lesson_materials(date, period)`, 학습지는 `정신의학` 학습지(id `7a75f08e-b3c8-403f-aa4e-e58fe479b837`, 목차 확정, 380쪽).
- 티야방: Google Docs `1icF0qNtNhgyGeGOSWDEDr6FCsZ1SBKwGgyH4zj0upSo` (수업별 표, 담당자가 채움).

## 현재 상태 (10/18)
- 185문제: 10/13 박태원·정영철, 10/14 정영철(조현병)·양종철(불안·강박).
- 야마 아직 없음 → 학습지에서 해당 수업 범위(예: 면담 243–251, 진단분류 256–267, 조현병 268–301, 불안 166–188, 강박 189–195) 기출을 넣고 반복(킹야) 표시.
- 박태원 「정신장애 소개」 강의록은 한글 글꼴이 빠져 있음(영어+STT로만 출제).
- 티야방 갈등설/부족-결핍설이 강의록과 반대로 적혀 있음 – 앱은 강의록·STT 기준.
