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
_D.update({'fh1104-02':'fh1104-2','fh1104-04':'fh1104-4','fh1104-08':'fh1104-8','fh1104-09':'fh1104-9'})   # 11/4 중간평가 원문 캡처
_D.update({  # 11/22 그림 누락 보충 – 학습지 쪽에서 자름(같은 문제·같은 그림이면 재사용)
 'y-fun-2021':'fun-2021',                                   # p82
 'y-moe-2022':'moe-a', 'y-moe-2021':'moe-2021', 'y-moe-2020':'moe-2021', 'y-moe-2019':'moe-2021',  # p83·85·86 (같은 사진)
 'y-ssbil-2014':'ssbil-2014', 'y-ssbil-2015':'ssbil-2014',  # p168 (2015는 학습지에 그림 없음 – 같은 문제 2014 그림)
 'y-ssnhl-2025':'ssnhl-2025',                               # p174
 'y-menidx-2022':'menidx-2023',                             # 2022 원 그림 없음 → 같은 주제 2023 청력도(p195)
 'y-ci-2020':'ci-2019',                                     # 같은 문제 2019 그림(p39)
 'y-hroll-2019':'hroll',                                    # 같은 문제 2021 그림(p201)
 'y-hroll13-2013':'hroll13-2013',                           # p211
 'y-hroll11-2011':'hroll11-2011', 'y-epleyord-2012':'epleyord-2012',  # p213
 # 학습지에도 그림이 없는 문항 → 학습지 해설 설명대로 그린 재구성 청력도(audg.py)
 'y-presby-2016':'aud-presby-2016', 'y-comhl-2019':'aud-comhl-2019', 'y-nihl-2013':'aud-nihl-2013',
 # 🔥 차동뿌시기
 'cd-01':'aud-cd-01', 'cd-07':'aud-cd-07', 'cd-13':'aud-cd-13', 'cd-20':'aud-cd-20', 'cd-28':'aud-cd-28',
 'cd-30':'fh1104-2', 'cd-31':'fh1104-8', 'cd-32':'fh1104-9', 'cd-33':'moe-2021',
})
IMG = {k: ['img/'+v+'.jpg'] for k, v in _D.items()}

# 그림 출처 메모(카드 노트에 붙음)
_R='🖼 학습지에 이 해의 원 그림이 없어 '
NOTE = {'y-ssbil-2015':_R+'같은 문제 2014 그림을 넣음', 'y-menidx-2022':_R+'같은 주제(메니에르) 2023 청력도를 넣음',
 'y-ci-2020':_R+'같은 문제 2019 그림을 넣음', 'y-hroll-2019':_R+'같은 문제 2021 그림을 넣음',
 'y-moe-2022':'🖼 같은 사진(2023 그림)', 'y-presby-2016':_R+'학습지 해설(양측 대칭 고음역 감각신경성) 그대로 그린 재구성 청력도',
 'y-comhl-2019':_R+'학습지 해설(좌측 정상, 우측 골도 정상·기도 저하 전음성) 그대로 그린 재구성 청력도',
 'y-nihl-2013':_R+'학습지 해설(교과서 그림 12-2, 4 kHz dip) 그대로 그린 재구성 청력도',
 'cd-30':'🖼 실제 사진(11/4 중간평가 2번 좌측 고막)', 'cd-31':'🖼 실제 사진(11/4 중간평가 8번 좌측 고막)',
 'cd-32':'🖼 실제 사진(11/4 중간평가 9번 우측 이경)', 'cd-33':'🖼 실제 사진(학습지 2021 객7 좌측 외이도·CT)'}
