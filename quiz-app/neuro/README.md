# 신경학 문풀앱 (neuro)

배포 주소(Artifact): https://claude.ai/artifact/1Hc4jiqbWcBXmF1ox3PcDS — 수정할 땐 이 URL로 다시 publish해서 같은 주소를 유지한다.

## 빌드
```
python3 build.py && python3 features.py && python3 mkart.py   # → neuro-app.html (16MB 한도 주의)
```
- `work.html` : 원본 카드 데이터(모든 수정은 여기에 적용). `fixlib.build(cid,f)`로 카드 생성.
- `fh_apply.py` / `fhv_apply.py` : 9/28 중간 형성평가 20문항(야마 맨 앞) / 변형 40문항(야마 변형 맨 앞). 재실행해도 교체만 됨.
- `features.py` : 출제교수 태그, 연도 정렬·번호 재부여, 복습 표시(localStorage `neuro-app-marks-v5`, 카드 순서가 바뀌어도 `data-k`로 고정).
- `specs/` : 주제별 야마·티야·탈야 원고.
