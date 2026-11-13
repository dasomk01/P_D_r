# 그림 문항: 카드키 → 학습지 3개년 기출 원문에서 잘라낸 그림(img/). 같은 문제로 합쳐진 카드는 2025 사진을 쓴다.
IMG = {
    'y-cn3-2025': ['img/eom-cn3-2025.jpg'],          # 2025 객7 9방향 눈운동 – 305쪽
    'y-cn3-2023': ['img/eom-cn3-2023.jpg'],          # 2023 객7 – 314쪽
    'y-eom-ver-2023': ['img/eom-ver-2023.jpg'],      # 2023 객4 두눈운동 사진 – 313쪽
    'y-eom-ver-2022': ['img/eom-ver-2022.jpg'],      # 2022 객3 화살표 사진 – 323쪽
    'y-eom-tor-2022': ['img/eom-tor-2022.jpg'],      # 2022 객2 한눈운동 그림 – 323쪽
    'y-nvg-2025': ['img/glc-nvg-2025.jpg'],     # 2025 객12 표 + 홍채 신생혈관 – 305–306쪽
    'y-acg-2023': ['img/acg-2023.jpg'],         # 2023 객12 표 + 세극등 – 315쪽
    'y-hsk-2025': ['img/hsk-2025.jpg'],              # 2025 객13 형광염색 – 306쪽
    'y-vkc-2025': ['img/vkc-2025.jpg'],             # 2025 객14 윗눈꺼풀결막·각막 – 306쪽
    'y-scl-2025': ['img/scl-2025.jpg'],              # 2025 객16 – 306쪽
    'y-sch-2023': ['img/sch-2023.jpg'],              # 2023 객17 결막밑출혈 – 316쪽
    'y-cat-2025': ['img/cat-2025.jpg'],              # 2025 객18 백내장 A·B·C – 307쪽
    'y-uv-hlab27-2025': ['img/hlab27-2025.jpg'],     # 2025 객29 천장관절 X선 – 308쪽
    'y-uv-behcet-2025': ['img/behcet-2025.jpg'],     # 2025 객30 앞방축농·안저 – 309쪽
    'y-arn-2023': ['img/arn-2023.jpg'],              # 2023 객32 안저 + 보기 표 – 319쪽
    'y-crao-2025': ['img/crao-2025.jpg'],            # 2025 객31 체리반점 – 309쪽
    'y-pvd-2025': ['img/pvd-2025.jpg'],              # 2025 객32 그림 – 309쪽
    'y-ret-layer-2025': ['img/layer-2025.jpg'],      # 2025 객33 망막층 그림 – 310쪽
    'y-retina-surg-2025': ['img/mh-2025.jpg'],       # 2025 객35 사진 A + 보기 ①~⑤ – 310쪽
    'y-rrd-2025': ['img/rrd-2025.jpg'],              # 2025 객36 – 311쪽
    'y-sys-case-2025': ['img/marfan-2025.jpg'],      # 2025 객38 – 311쪽
    'y-rupture-2025': ['img/rupture-2025.jpg'],      # 2025 객39 세극등·CT – 311쪽
    'y-trauma-er-2025': ['img/trauma-2025.jpg'],     # 2025 객40 보기 표 – 312쪽
    'y-dacryo-2023': ['img/dacryo-2023.jpg'],     # 2023 객26 – 317쪽
    # 11/12 형성평가(사용자 사진, 문제 부분만 · 체크 표시 가림)
    'fh-1112-1': ['img/fh-1112-1.jpg'],
    'fh-1112-2': ['img/fh-1112-2.jpg'],
    'fh-1112-3': ['img/fh-1112-3.jpg'],
    'fh-1112-4': ['img/fh-1112-4.jpg'],
    # 안과 검사법 단원(68–77쪽)
    'y-exam-2022': ['img/exam-2022.jpg'],   # 71쪽 (가)–(마)
    'y-exam-2021': ['img/exam-2021.jpg'],   # 71쪽 (가)–(마)
    'y-exam-2020': ['img/exam-2020.jpg'],   # 72쪽
    'y-exam-2019': ['img/exam-2019.jpg'],   # 73–74쪽 사진 1–5 (복원자 메모 '이시하라' 글씨는 잘라냄)
    'y-exam-2018': ['img/exam-2018.jpg'],   # 75쪽 사진
    'y-exam-2017': ['img/exam-2017.jpg'],   # 76쪽 그림 1–4
    'y-tests-2018': ['img/gonio-2018.jpg'], # 76쪽 주24 – 슬라이드 제목(정답)은 잘라냄
    'y-hyph-2020': ['img/hyph-2020.jpg'],   # 73쪽 (복원자가 구한 비슷한 사진)
    'y-hyph-2019': ['img/hyph-2019.jpg'],   # 74쪽 (복원자가 구한 비슷한 사진)
    # 결막·공막 단원(244–263쪽) – 정답이 드러나는 교과서 그림 캡션은 잘라냄
    'y-vkc-2022': ['img/cj-vkc-2022.jpg'],
    'y-vkc-2021': ['img/cj-vkc-2021.jpg'],
    'y-vkc-2020': ['img/cj-vkc-2020.jpg'],
    'y-vkc-2018': ['img/cj-vkc-2018.jpg'],
    'y-vkc-2017': ['img/cj-vkc-2017.jpg'],
    'y-vkc-2016': ['img/cj-vkc-2016.jpg'],
    'y-sei-2022': ['img/cj-sei-2022.jpg'],
    'y-sei-2021': ['img/cj-sei-2021.jpg'],
    'y-scl-2021': ['img/cj-nsc-2021.jpg'],
    'y-scl-2020': ['img/cj-nsc-2020.jpg'],
    'y-scl-2019': ['img/cj-nsc-2019.jpg'],
    'y-sch-2021': ['img/cj-sch-2021.jpg'],
    'y-sch-2018': ['img/cj-sch-2018.jpg'],
    'y-ekc-2018': ['img/cj-ekc-2018.jpg'],
    'y-ekc-2016': ['img/cj-ekc-2016.jpg'],
    'y-pter-2018': ['img/cj-pter-2018.jpg'],
    'y-pter-2017': ['img/cj-pter-2017.jpg'],
    'y-pter-2016': ['img/cj-pter-2016.jpg'],
    'y-pter-2015': ['img/cj-pter-2015.jpg'],
    'y-lym-2018': ['img/cj-lym-2018.jpg'],
    'y-lym-2017': ['img/cj-lym-2017.jpg'],
    'y-tab-2016': ['img/cj-tab-2016.jpg'],
    'y-cfb-2015': ['img/cj-cfb-2015.jpg'],
    'y-alg-2014': ['img/cj-alg-2014.jpg'],
    'y-pap-2013': ['img/cj-pap-2013.jpg'],
    # 각막 단원(272–284쪽) – 교과서 캡션(정답)은 잘라냄
    'y-hsk-2018': ['img/kr-hsk-2018.jpg'],
    'y-hsk-2015': ['img/kr-hsk-2015.jpg'],
    'y-hsk-2014': ['img/kr-hsk-2014.jpg'],
    'y-hzk-2021': ['img/kr-hzk-2021.jpg'],
    'y-hzk-2020': ['img/kr-hzk-2020.jpg'],
    'y-hzk-2019': ['img/kr-hzk-2019.jpg'],
    'y-psa-2021': ['img/kr-psa-2021.jpg'],
    'y-aca-2020': ['img/kr-aca-2020.jpg'],
    'y-aca-2019': ['img/kr-aca-2019.jpg'],
    'y-aca-2018': ['img/kr-aca-2018.jpg'],
    'y-aca-2017': ['img/kr-aca-2017.jpg'],
    'y-fun-2020': ['img/kr-fun-2020.jpg'],
    'y-fun-2017': ['img/kr-fun-2017.jpg'],
    'y-kc-2022': ['img/kr-kc-2022.jpg'],
    'y-kc-2019': ['img/kr-kc-2019.jpg'],
    'y-kc-2015': ['img/kr-kc-2015.jpg'],
    'y-bk-2016': ['img/kr-bk-2016.jpg'],
    # 11/13 김영은 형성평가(강의록 82쪽, 문제 부분만)
    'fh-1113-1': ['img/fh-1113-1.jpg'],
    'fh-1113-2': ['img/fh-1113-2.jpg'],
    # 11/13 유인천 수업 퀴즈(강의록 158쪽)
    'fh-1113-3': ['img/fh-1113-3.jpg'],
}
