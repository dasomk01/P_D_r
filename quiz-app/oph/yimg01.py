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
    # 굴절·광학 단원(학습지 20–21쪽)
    'y-ref-pic-2018': ['img/ref-2018.jpg'],          # 2018 주20 – 20쪽
    'y-dof-2017': ['img/ref-2017a.jpg'],             # 2017 주12 해바라기(심도) – 21쪽
    'y-ref-pic-2017': ['img/ref-2017b.jpg'],         # 2017 주13 – 21쪽
    # 외안근·사시 단원(학습지 38–41쪽)
    'y-acc-et-2018': ['img/eom-acc-2018.jpg'],       # 2018 주21 – 38쪽
    'y-acc-et-2017': ['img/eom-acc-2018.jpg'],       # 2017 주14 – 39쪽(같은 사진)
    'y-rec-2018': ['img/eom-rec-2018.jpg'],          # 2018 주22 – 38쪽 (빨간 손글씨 잘라냄)
    'y-rec-2017': ['img/eom-rec-2018.jpg'],          # 2017 주15 – 39쪽(같은 강의록 사진)
    'y-iet-case-2016': ['img/eom-iet-2016.jpg'],     # 2016 객8 – 41쪽 (2015 객23 사진은 비슷한 영아내사시 사진)
    # 신경안과 단원(학습지 56–64쪽)
    'y-rapd-2020': ['img/neuro-rapd.jpg'],           # 2020 객29 – 56쪽
    'y-rapd-w-2019': ['img/neuro-rapd.jpg'],         # 2019 주1 – 57쪽은 정답(왼쪽 눈)에 주황 표시가 있어 같은 그림인 56쪽 걸로
    'y-chiasm-2018': ['img/neuro-vf-2018.jpg'],      # 2018 객13 – 57쪽
    'y-vf-quad-2016': ['img/neuro-vf-2016.jpg'],     # 2016 객12 – 59쪽
    'y-chiasm-2015': ['img/neuro-vf-2015.jpg'],      # 2015 객24 – 60쪽
    'y-vpath-2012': ['img/neuro-path-2012.jpg'],     # 2012 주11 – 64쪽
    # 11/16 이행진 형성평가(시신경 신경안과 강의록 100쪽)
    'fh-1116-4': ['img/fh-1116-4.jpg'],
    # 수정체 단원(학습지 294–299쪽)
    'y-black-2022': ['img/lens-black-2022.jpg'],     # 2022 객17 – 294쪽
    'y-phaco-2021': ['img/lens-phaco-2021.jpg'],     # 2021 객29 – 295쪽
    'y-phaco-2020': ['img/lens-phaco-2020.jpg'],     # 2020 객35 – 296쪽
    'y-phaco-2019': ['img/lens-phaco-2019.jpg'],     # 2019 객19 – 297쪽
    'y-mature-2018': ['img/lens-mature-2018.jpg'],   # 2018 R9·10 – 297쪽
    'y-pco-2018': ['img/lens-pco-2018.jpg'],         # 2018 R11 – 298쪽
    'y-mature-2017': ['img/lens-mature-2017.jpg'],   # 2017 R9 – 298쪽
    'y-pco-2017': ['img/lens-pco-2017.jpg'],         # 2017 R10 – 299쪽
    'y-pco-2016': ['img/lens-pco-2016.jpg'],         # 2016 주8 – 299쪽
    # 녹내장 단원(학습지 91–98쪽)
    'y-acg-dx-2021': ['img/glc-acg-2021.jpg'],       # 2021 객5 – 91쪽
    'y-disc-2021': ['img/glc-disc-2021.jpg'],        # 2021 객38 – 91쪽
    'y-rt-acg-2020': ['img/glc-acg-2020.jpg'],       # 2020 객36 – 92쪽
    'y-rt-ntg-2020': ['img/glc-ntg-2020.jpg'],       # 2020 객37 안저·시야 – 92쪽
    'y-rt-cong-2020': ['img/glc-cong-2020.jpg'],     # 2020 객38 – 93쪽
    'y-nvg-case-2019': ['img/glc-nvg-2019.jpg'],     # 2019 객11 – 93쪽
    'y-acg-tx-2017': ['img/glc-acg-2017.jpg'],       # 2017 객17 – 94쪽
    'y-cong-2017': ['img/glc-cong-2017.jpg'],        # 2017 객18 – 95쪽
    'y-acg-tx-2016': ['img/glc-acg-2016.jpg'],       # 2016 객13 – 96쪽
    'y-dh-2015': ['img/glc-dh-2015.jpg'],            # 2015 객20 – 98쪽
    # 포도막·유리체 단원(학습지 140–147쪽)
    'y-uv-as-2021': ['img/uv-as-2021.jpg'],          # 2021 객7 천장관절 X선 + 앞방 – 140쪽
    'y-uv-rd-2021': ['img/uv-rd-2021.jpg'],          # 2021 객13 안저 + 수술 – 140쪽
    'y-uv-ppv-2020': ['img/uv-ppv-2020.jpg'],        # 2020 객17 – 141쪽
    'y-uv-vkh-2019': ['img/uv-vkh-2019.jpg'],        # 2019 객22(= 2018 객2) 안저·OCT – 143쪽
    'y-uv-behcet2-2019': ['img/uv-behcet-2019.jpg'], # 2019 객23 – 142쪽
    'y-b27-fill-2018': ['img/uv-asxray-2018.jpg'],   # 2018 주2 – 143쪽
    'y-uv-ppv-2018': ['img/uv-ppv-2018.jpg'],        # 2018 주5 – 144쪽
    'y-b27-fill-2017': ['img/uv-asxray-2017.jpg'],   # 2017 주17 – 145쪽
    'y-uv-ppvdraw-2017': ['img/uv-ppvdraw-2017.jpg'],# 2017 주18 – 146쪽
    'y-uv-vkh-2016': ['img/uv-vkh-2016.jpg'],        # 2016 객18 – 147쪽
    'y-uv-vkh-2018': ['img/uv-vkh-2019.jpg'],        # 2018 객2 – 2019 객22와 같은 사진(143쪽)
    # 망막 단원(학습지 162–192쪽)
    'y-nvd-2022': ['img/ret-nvd-2022.jpg'],          # 2022 객36 – 162쪽
    'y-crao-2022': ['img/ret-crao-2022.jpg'],        # 2022 객37 – 162쪽
    'y-dr-2022': ['img/ret-dr-2022.jpg'],            # 2022 객38 그림1·2 – 163쪽
    'y-uv-rd-2022': ['img/ret-rd-2022.jpg'],         # 2022 객39 안저 + 수술 – 163쪽
    'y-armd-2022': ['img/ret-armd-2022.jpg'],        # 2022 객40 – 164쪽
    'y-ret-hem-2021': ['img/ret-prh-2021.jpg'],      # 2021 객8 – 164쪽
    'y-crao-2021': ['img/ret-crao-2021.jpg'],        # 2021 객10 – 165쪽
    'y-dr-2021': ['img/ret-dr-2021.jpg'],            # 2021 객11 – 165쪽
    'y-armd-2021': ['img/ret-armd-2021.jpg'],        # 2021 객12 – 166쪽
    'y-ret-hem-2020': ['img/ret-srh-2020.jpg'],      # 2020 객13 – 167쪽
    'y-crao-2020': ['img/ret-crao-2020.jpg'],        # 2020 객14 – 168쪽
    'y-dr-2020': ['img/ret-dr-2020.jpg'],            # 2020 객15 – 168쪽
    'y-armd-2020': ['img/ret-armd-2020.jpg'],        # 2020 객16 우안·좌안 – 169쪽
    'y-ret-hem-2019': ['img/ret-prh-2019.jpg'],      # 2019 객25(학습지는 비슷한 사진) – 170쪽
    'y-crao-2019': ['img/ret-crao-2019.jpg'],        # 2019 객27 – 170쪽
    'y-armd-2019': ['img/ret-armd-2019.jpg'],        # 2019 객28 – 171쪽
    'y-ret-hem-2018': ['img/ret-hem5-2018.jpg'],     # 2018 객4 사진 ①~⑤ – 171쪽
    'y-brvo-2018': ['img/ret-brvo-2018.jpg'],        # 2018 객5 – 172쪽
    'y-armd-2018': ['img/ret-armd-2019.jpg'],        # 2018 객7 – 2019 객28과 같은 사진(173쪽)
    'y-crao-2018': ['img/ret-crao-2018.jpg'],        # 2018 주3 화살표 – 174쪽
    'y-ret-hem-2017': ['img/ret-hem5-2017.jpg'],     # 2017 객5 사진 ①~⑤ – 175쪽
    'y-brvo-2017': ['img/ret-brvo-2017a.jpg', 'img/ret-brvo-2017b.jpg'],  # 2017 객6 안저·OCT – 175–176쪽
    'y-crao-2017': ['img/ret-crao-2017.jpg'],        # 2017 객7 – 176쪽
    'y-dr-2017': ['img/ret-dr-2017.jpg'],            # 2017 객8 그림1·2 – 177쪽
    'y-csc-2017': ['img/ret-csc-2017a.jpg', 'img/ret-csc-2017b.jpg'],     # 2017 객10 안저·형광·OCT – 178쪽
    'y-ret-hem-2017-6': ['img/ret-hem5r-2017.jpg'],  # 2017 R6 사진 ①~⑤ – 179쪽
    'y-crvo-2016': ['img/ret-crvo-2016.jpg'],        # 2016 객20 안저·OCT – 180쪽
    'y-crao-2016': ['img/ret-crao-2016.jpg'],        # 2016 객22 – 181쪽
    'y-crvo-2015': ['img/ret-crvo-2015.jpg'],        # 2015 객27 안저·OCT – 182쪽
    'y-crao-2014': ['img/ret-crao-2014.jpg'],        # 2014 객23 – 183쪽
    'y-crvo-2014': ['img/ret-crvo-2014.jpg'],        # 2014 객24 안저 – 184쪽
    'y-csc-2014': ['img/ret-csc-2014.jpg'],          # 2014 객26 – 185쪽
    'y-armd-2014': ['img/ret-armd-2014.jpg'],        # 2014 객27 안저·OCT – 185쪽
    'y-armd-2013': ['img/ret-armd-2013.jpg'],        # 2013 객25 안저·OCT – 186쪽
    'y-armd-2012': ['img/ret-armd-2012.jpg'],        # 2012 객38 – 188쪽
    'y-crao-2012': ['img/ret-crvo-2012.jpg'],        # 2012 객39 – 188쪽
    'y-crvo-2011': ['img/ret-crvo-2011.jpg'],        # 2011 객32 – 191쪽
    'y-armd-2011': ['img/ret-armd-2011.jpg'],        # 2011 객34 – 192쪽
    # 눈꺼풀 단원(학습지 208–214쪽)
    'y-entropion-photo-2018': ['img/lid-entro-2018.jpg'],   # 2018 주11 강의록 그림(= 2017 주3) – 208쪽
    'y-epib-photo-2018': ['img/lid-epib-2018.jpg'],         # 2018 주12(학습지는 비슷한 사진) – 208쪽
    'y-ectropion-photo-2018': ['img/lid-ectro-2018.jpg'],   # 2018 주13(비슷한 사진) – 208쪽
    'y-bell-photo-2018': ['img/lid-bell-2018.jpg'],         # 2018 주14(= 2017 주6) – 209쪽
    'y-frontalis-2018': ['img/lid-frontalis-2018.jpg', 'img/lid-frontalis-2017.jpg'],  # 2018 주15 사진 + 2017 주7 강의록 그림 – 209·211쪽
    'y-chalazion-photo-2017': ['img/lid-chal-2017.jpg'],    # 2017 주2(교과서 사진 대체) – 209쪽
    'y-lid-margin-2016': ['img/lid-margin-2016.jpg'],       # 2016 주3 – 212쪽
    'y-bell-photo-2016': ['img/lid-bell-2016.jpg'],         # 2016 주6 – 213쪽
    'y-asian-lid-2016-15': ['img/lid-asian-2016.jpg'],      # 2016 주15 – 213쪽
    'y-meibom-2015': ['img/lid-meibom-2015.jpg'],           # 2015 객6 – 213쪽
    'y-epiblepharon-2015': ['img/lid-epib-2015.jpg'],       # 2015 객7 – 214쪽
    'fh-1119-1': ['img/fh-1119-1.jpg'],   # 11/19 안외상 퀴즈 – 강의록 41쪽
    'fh-1119-4': ['img/fh-1119-4.jpg'],   # 11/19 전신 퀴즈 – 강의록 58쪽
    # 눈물·안와 단원(학습지 227–237쪽)
    'y-dacryo-photo-2018': ['img/lac-dacryo-2018.jpg'],    # 2018 주16 – 227쪽
    'y-dcg-2018': ['img/lac-dcg-2018.jpg', 'img/lac-dcg-2017.jpg'],    # 2018 주17 + 2017 주9 – 227·228쪽
    'y-silicone-photo-2018': ['img/lac-silicone-2017.jpg'],    # 2018 주18 + 2017 주10 – 228쪽
    'y-dacryo-chronic-2017': ['img/lac-chronic-2017.jpg'],    # 2017 주8 – 228쪽
    'y-dacryo-seq-2016': ['img/lac-dacryo-2016.jpg'],    # 2016 주7 – 229쪽(비슷한 사진)
    'y-dacryo-seq-2015': ['img/lac-dacryo-2015.jpg'],    # 2015 객10 – 229쪽
    'y-cellulitis-photo-2018': ['img/orb-cell-2018.jpg', 'img/orb-cell-2017.jpg'],    # 2018 주19 + 2017 주11 – 235·236쪽
    'y-cellulitis-cause-2016': ['img/orb-cell-2016.jpg'],    # 2016 주10 – 236쪽(비슷한 사진)
    'y-ted-dx-2015': ['img/orb-ted-2015.jpg'],    # 2015 객9 – 237쪽
    # 전신·외상 단원(학습지 108–130쪽)
    'y-sys-kf-2022': ['img/sys-kf-2022.jpg'],
    'y-sys-sarc-2022': ['img/sys-sarc-2022.jpg'],
    'y-sys-sarc-2021': ['img/sys-sarc-2021.jpg'],
    'y-sys-kf-2020': ['img/sys-kf-2020.jpg'],
    'y-sys-as-2020': ['img/sys-as-2020.jpg'],
    'y-sys-sarc-2020': ['img/sys-sarc-2020.jpg'],
    'y-sys-kf-2018': ['img/sys-kf-2018.jpg'],
    'y-sys-kf-2016': ['img/sys-kf-2016.jpg'],
    'y-sys-case-2015': ['img/sys-marfan-2015.jpg'],
    'y-iofb-2022': ['img/trm-iofb-2022.jpg'],
    'y-orbit-fx-2021': ['img/trm-orbit-2021.jpg'],
    'y-lac-desc-2018': ['img/trm-lac-2018.jpg'],
    'y-trm-hyph-2011': ['img/trm-hyph-2011.jpg'],
}
