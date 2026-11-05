# 야마 그림 문항: 카드키 → 학습지(2026 이과학 학습지) 쪽에서 잘라낸 그림(img/). crop.py 로 잘랐다.
_D = {  # 카드키: 파일 이름(img/ 안)  – 학습지 쪽
 'y-cough-2025':'cough-2025',      # p6
 'y-amp3-2025':'amp3-2025',        # p30
 'y-fork-2023':'fork-2023',        # p32
 'y-ssnhl-2022':'ssnhl-2022', 'y-pta78-2022':'pta78-2022',   # p33
 'y-pta70-2021':'pta70-2021', 'y-pta70-2020':'pta70-2020',   # p36–37
 'y-ci-2019':'ci-2019',            # p39
 'y-pta19-2017':'pta19-2017',      # p42
 'y-pta11-2016':'pta11-2016',      # p45
 'y-pet-2025':'pet-2025',          # p71
 'y-moe-2023':'moe-a', 'y-fun-2022':'fun-a', 'y-hema-2022':'hema-a',  # p79–81
 'y-aoe-2020':'aoe-2020',          # p86
 'y-pinna-2025':'pinna-2025', 'y-pinna-2023':'pinna-2023', 'y-pinna-2022':'pinna-2022',  # p99–100
 'y-paf-2021':'paf-2021', 'y-paf-2020':'paf-2020',  # p101
 'y-atr-2020':'cong-2020', 'y-baha-2018':'baha-2018',  # p102–103
 'y-omeobs-2025':'omeobs-2025', 'y-omedown-2025':'omedown-2025',  # p106
 'y-aomtx-2025':'aomtx-2025', 'y-aoe23-2023':'aoe23-2023',  # p107
 'y-ome5m-2022':'ome5m-2022', 'y-aombug-2022':'aombug-2022', 'y-ome2m-2021':'ome2m-2021',  # p110–112
 'y-aom2y-2018':'aom2y-2018',      # p113
 'y-mastx-2025':'mastx-2025', 'y-midmass-2023':'midmass-2023', 'y-congc-2023':'congc-2023',  # p127–129
 'y-mastx-2023':'mastx-2023', 'y-congc-2022':'congc-2022', 'y-cholotos-2021':'cholotos-2021',  # p130–132
 'y-cholotos-2019':'cholotos-2019', 'y-csom-2018':'csom-2018',  # p134–135
 'y-tmpslap-2023':'tmpslap-2023', 'y-tbf-2022':'tbf-2022', 'y-tbf-2021':'tbf-2021',  # p144–145
 'y-ots-2022':'ots-2022', 'y-ots-2021':'ots-2021',  # p150
 'y-ssnhl-2023':'ssnhl-2023',      # p153
 'y-ssbil-2017':'ssbil-2017',      # p161
 'y-ctd-2016':'ctd-2016',          # p164
 'y-weber-2013':'weber-2013',      # p169
 'y-cielec-2025':'cielec-2025', 'y-surgaid-2025':'surgaid-2025', 'y-surgaid-2025-객24':'surgaid-2025-24', 'y-surgaid-2025-객25':'surgaid-2025-25',  # p181–183
 'y-cielec-2023':'cielec-2023', 'y-cielec-2022':'cielec-2022', 'y-ci2-2021':'ci2-2021',  # p184–185
 'y-aidpic-2019':'aidpic', 'y-aidpic-2018':'aidpic', 'y-aidpic-2019-주4':'aidpic',  # p186
 'y-dhleft-2025':'dhleft-2025', 'y-menigen-2023':'menigen-2023', 'y-menidx-2023':'menidx-2023', 'y-dhleft-2022':'dhleft-2022',  # p192–197
 'y-menitx-2022':'menitx-2022', 'y-vntx-2022':'vntx-2022',  # p198–199
 'y-epleyord-2022':'epleyord-2022', 'y-epleyord-2019':'epleyord-2022',  # p200 (2019는 같은 그림으로 출제)
 'y-hroll-2021':'hroll',           # p201
 'y-epleyord-2018':'epleyord-2018', 'y-epleypic-2016':'epleypic-2016',  # p208–209
 'y-rhs-2023':'rhs-2023',          # p217
}
_D['fh1105-2']='fh1105-2'   # 11/5 형성평가 2번 청력도(원문 캡처)
IMG = {k: ['img/'+v+'.jpg'] for k, v in _D.items()}
