def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
ICH='강의록 ICH 진단: 비조영 CT — 급성 혈종 고음영, 혈종량·위치·IVH·mass effect·수두증 즉시 평가; CTA/MRA — spot sign, 동맥류·AVM·모야모야·혈관염; TFCA — 젊은 환자, 엽상 출혈, Sylvian fissure 인접 혈종, 비전형 소견에서 적극 고려. 깊은 ICH + 오래된 고혈압은 hypertensive pattern이나 비전형이면 원인 혈관병변 배제. 의식저하 진행 시 혈종 확장·IVH·수두증·herniation을 반복 CT로 확인.'
ICHT='강의록 ICH 치료 선택: 정위적 흡인/배액 — 절개 작고 회복 빠름, 두개골에 구멍만 뚫고 뇌항법장치로 도관을 혈종 중앙에 위치, 출혈 혈관 직접 지혈이 어려워 재출혈 위험; 개두술 — 시야 확보·직접 지혈, 침습적·적응증 신중; 내시경 보조 — 최소침습과 시야 확보 절충, 숙련도 필요.'
SAHR='강의록 SAH 위험인자: 다낭성 신질환, 섬유근성 형성이상·결체조직질환, 대뇌동맥류 기왕력, 고혈압, 흡연, 알코올중독, 에스트로겐 결핍, 동맥류 가족력.'
SAHC='강의록 SAH 합병증: 재출혈 — 가장 치명적, early securing과 혈압 관리; 혈관연축/DCI — 대개 수일 후, 신경학적 악화, TCD/CTA/DSA, nimodipine·rescue therapy; 수두증 — 의식저하·보행/인지 악화, 급성기 EVD·만성기 shunt.'
SAHT='강의록 SAH 치료: clipping — 개두술로 neck 직접 결찰, 내구성 좋고 혈종 제거·감압 동시 가능; coiling — 미세도관으로 coil로 sac 폐색, 고령·후순환·개두 위험 큰 경우 장점; stent-assisted — 넓은 neck·복잡 동맥류, 급성 파열에서는 항혈소판 전략 고려.'
SM='강의록 Spetzler–Martin: 크기 <3 cm=1, 3–6 cm=2, >6 cm=3; eloquent area +1; deep venous drainage +1 (총 I–V). 수술 위험과 치료전략의 기본 틀.'
AVMT='강의록 AVM 치료: microsurgical resection — 가장 즉각적·확실, 낮은 grade·표재성 non-eloquent에 유리; endovascular embolization — 수술 전 혈류 감소, high-risk feeder/aneurysm target, 일부 definitive; Gamma Knife — 심부·eloquent·소형 AVM, 폐색까지 latency가 있어 그동안 출혈 위험 지속.'
MM='강의록 모야모야병: 진행성·특발성 협착-폐쇄 질환, 양측 원위 ICA·근위 ACA/MCA, 비정상 혈관망. 분류 — moyamoya disease, probable moyamoya, moyamoya syndrome(quasi-moyamoya). 소아는 뇌경색, 성인은 비정상 동맥 파열로 뇌출혈이 많음. 진단 CTA/MRA/TFCA + SPECT/CTP/MRP로 관류 예비능. 치료 — 허혈 증상·관류저하 시 bypass: 직접 STA-MCA/STA-ACA, 간접 EDAS/EMS/EDAMS, encephalo-galeo-synangiosis, multiple burr holes, omental graft.'
SUZ='강의록 Suzuki staging: I 경동맥 분지 협착; II 모야모야 시작(ACA·MCA 확장, ICA 분지 협착); III 모야모야 강화(ACA·MCA 협착); IV 모야모야 감소(ICA 폐쇄성 변화); V 모야모야 감소 진행(ICA·ACA·MCA 폐쇄); VI 모야모야 소실(ICA 소실, ECA에서 뇌 공급).'
OFF=[
Q('강의록','출혈의 종류에 대한 설명으로 옳은 것은?',['정맥출혈과 모세관출혈은 출혈압이 낮아 가벼운 압박으로 자연 지혈된다.','동맥출혈은 가벼운 압박으로 쉽게 지혈된다.','모세관출혈의 출혈압이 가장 높다.','정맥출혈은 압박으로 지혈되지 않는다.','출혈은 부위와 무관하게 동일하다.'],1,'강의록: 출혈은 동맥·정맥·모세관출혈로 나뉘며 정맥·모세관출혈은 출혈압이 낮아 짧은 압박으로 지혈, 동맥출혈은 어렵다.',['정답.','어렵다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','강의록에 제시된 뇌출혈의 원인별 분류가 아닌 것은?',['뇌경색의 출혈성 변환만을 뜻하는 분류','자발성(고혈압성) 뇌실질내 출혈','뇌동맥류 파열에 의한 지주막하 출혈','뇌동정맥기형','모야모야병'],1,'강의록: A 자발성(고혈압성) ICH, B 뇌동맥류 파열 SAH, C 뇌동정맥기형, D 모야모야병 (외상성 SAH도 위치별로 제시).',['정답.','분류.','분류.','분류.','분류.']),
Q('강의록','뇌출혈 환자의 초기 평가에 가장 먼저 시행하는 검사는?',['비조영 CT','카테터 혈관조영술','SPECT','뇌파','요추천자'],1,ICH,['정답.','원인 평가.','모야모야 관류.','틀리다.','틀리다.']),
Q('강의록','ICH 환자의 CTA에서 혈종 확장을 시사하는 소견은?',['Spot sign','Empty delta sign','String of beads','Dawson fingers','Halo sign'],1,ICH,['정답.','CVT.','RCVS.','MS.','GCA.']),
Q('강의록','원인 혈관병변 확인을 위해 TFCA를 적극 고려해야 하는 ICH는?',['25세, 엽상 출혈, Sylvian fissure 인접 혈종','70세, 오랜 고혈압, 기저핵 출혈','65세, 고혈압, 시상 출혈','75세, 고혈압, 교뇌 출혈','80세, 고혈압, 전형적 피각 출혈'],1,ICH,['정답.','hypertensive pattern.','hypertensive pattern.','hypertensive pattern.','hypertensive pattern.']),
Q('강의록','기저핵 ICH 환자가 입원 후 의식이 빠르게 저하되었다. 가장 먼저 확인할 것은?',['반복 CT로 혈종 확장·IVH·수두증·탈출 확인','뇌파','EMG','SPECT','요추천자'],1,ICH,['정답.','틀리다.','틀리다.','틀리다.','탈출 위험.']),
Q('강의록','정위수술에 의한 혈종 제거의 한계로 옳은 것은?',['출혈 혈관을 직접 소작하지 못해 재출혈 위험이 있다.','절개가 크다.','회복이 느리다.','시야 확보가 가장 좋다.','뇌항법장치를 쓸 수 없다.'],1,ICHT,['정답.','작다.','빠르다.','개두술.','이용한다.']),
Q('강의록','시야 확보와 직접 지혈이 가능하나 침습적이어서 적응증을 신중히 선택해야 하는 ICH 수술은?',['개두술 혈종 제거','정위적 흡인·배액','내시경 보조 제거','EVD 단독','감마나이프'],1,ICHT,['정답.','직접 지혈 어려움.','절충.','수두증.','AVM.']),
Q('강의록','뇌동맥류의 형성 기전으로 옳은 것은?',['혈역학적 부담과 죽상경화 변성으로 내탄력층 손상·중막 결손이 생겨 벽이 얇아져 부푼다.','정맥이 모세혈관 없이 동맥과 연결된다.','ICA 원위부의 진행성 협착이다.','외상으로 경막이 찢어진다.','외막만 두꺼워진다.'],1,'강의록: 동맥분지의 hemodynamic stress + atherosclerotic degeneration → 내탄력층 손상·중막 결손 → 벽이 얇아지고 풍선처럼 부풀어 터짐.',['정답.','AVM.','모야모야.','틀리다.','틀리다.']),
Q('강의록','동맥류성 SAH의 위험인자가 아닌 것은?',['에스트로겐 과다','다낭성 신질환','결체조직질환','흡연','동맥류 가족력'],1,SAHR,['정답. 에스트로겐 결핍.','위험.','위험.','위험.','위험.']),
Q('강의록','동맥류성 SAH의 임상증상으로 강의록에 제시되지 않은 것은?',['서서히 진행하는 원위부 감각저하','생애 처음 느끼는 극심한 두통','짧은 의식소실','목과 어깨가 뻣뻣해짐','복시·갑작스러운 한쪽 시력 소실'],1,'강의록: 생애 최악의 두통, 짧은 의식소실, 뇌전증발작, 오심·구토, 편측 마비, 이상감각, 언어장애, 복시·시야 검은 점·한쪽 시력 소실, 목·어깨 뻣뻣, 혼돈·혼수. 중증도 Hunt and Hess grade.',['정답.','증상.','증상.','증상.','증상.']),
Q('강의록','SAH 환자의 임상 중증도를 평가하는 척도로 강의록에 제시된 것은?',['Hunt and Hess grade','Spetzler–Martin grade','Suzuki stage','NIHSS만','Osserman 분류'],1,'강의록: 임상증상 + Hunt and Hess Grade; CT 출혈량은 Fisher/modified Fisher scale.',['정답.','AVM.','모야모야.','틀리다.','MG.']),
Q('강의록','CT에서 SAH의 출혈량·양상과 IVH 유무로 혈관연축 위험을 평가하는 척도는?',['(Modified) Fisher scale','Hunt and Hess grade','Spetzler–Martin grade','Glasgow Coma Scale','Suzuki stage'],1,'강의록: Fisher scale — no SAH, diffuse thin <1 mm, thick/localized clot, ICH/IVH; modified Fisher — thin/thick SAH × IVH 유무, 등급이 높을수록 혈관연축 위험↑.',['정답.','임상 중증도.','AVM.','의식.','모야모야.']),
Q('강의록','Modified Fisher scale에서 가장 높은 등급(4)에 해당하는 CT 소견은?',['두꺼운 SAH + IVH','출혈 없음','얇은 SAH, IVH 없음','얇은 SAH + IVH','두꺼운 SAH, IVH 없음'],1,'강의록 modified Fisher: 0 no blood, 1 thin SAH·no IVH, 2 thin SAH + IVH, 3 thick SAH·no IVH, 4 thick SAH + IVH(가장 위험).',['정답.','0.','1.','2.','3.']),
Q('강의록','개두술로 동맥류 neck을 직접 결찰하는 clipping의 장점은?',['내구성이 좋고 혈종 제거·감압을 동시에 고려할 수 있다.','개두 위험이 큰 고령에서 가장 유리하다.','미세도관만으로 시행한다.','넓은 neck에서 stent가 필요하다.','항혈소판제가 필수다.'],1,SAHT,['정답.','coiling.','coiling.','stent-assisted.','stent.']),
Q('강의록','80세, 후순환 동맥류 파열로 개두 위험이 큰 SAH 환자에게 장점이 있는 치료는?',['Coil 색전술','Clipping','감마나이프','STA-MCA bypass','EDAS'],1,SAHT,['정답.','개두 위험.','AVM.','모야모야.','모야모야.']),
Q('강의록','넓은 neck의 복잡 동맥류에서 사용하는 보조기법과 급성 파열 시 고려사항은?',['Stent-assisted coil embolization – 항혈소판 전략 고려','Clipping – 항응고 필수','EVD – 항생제','감마나이프 – 방사선량','EDAS – 관류 검사'],1,SAHT,['정답.','틀리다.','수두증.','AVM.','모야모야.']),
Q('강의록','동맥류성 SAH의 합병증 중 가장 치명적이며 early securing과 혈압 관리가 핵심인 것은?',['재출혈','혈관연축','수두증','저나트륨혈증','경련'],1,SAHC,['정답.','수일 후.','EVD.','강의록 외.','틀리다.']),
Q('강의록','SAH 발병 5일째 신경학적 악화가 생겼다. 가장 가능성 높은 합병증과 약물은?',['혈관연축/DCI – nimodipine','재출혈 – 항응고제','수두증 – 스테로이드','경련 – 즉시 clipping','뇌부종 – 헤파린'],1,SAHC,['정답.','초기·항응고 금기.','EVD.','틀리다.','틀리다.']),
Q('강의록','SAH 후 의식저하와 보행·인지 악화가 나타나고 CT에서 뇌실 확장이 보인다. 급성기 처치는?',['뇌실외배액술(EVD)','즉시 VP shunt만','Nimodipine 단독','감마나이프','관찰'],1,SAHC,['정답.','만성기.','연축.','틀리다.','틀리다.']),
Q('강의록','두개내 혈관기형의 종류가 아닌 것은?',['모야모야병','동정맥기형','해면혈관종','정맥기형(venous angioma)','모세혈관확장증'],1,'강의록: intracranial vascular malformation — AVM, cavernous hemangioma, venous malformation(venous angioma), capillary telangiectasia.',['정답.','기형.','기형.','기형.','기형.']),
Q('강의록','뇌동정맥기형(AVM)의 병태생리로 옳은 것은?',['태생기에 동맥이 모세혈관을 거치지 않고 정맥으로 바로 연결된다.','후천성 죽상경화로 생긴다.','양측 원위 ICA의 진행성 협착이다.','정맥동 혈전이 원인이다.','성장하면서 저절로 작아진다.'],1,'강의록: 선천 기형, 동맥→정맥 직접 연결, 성장하며 커지고 과도한 압력의 정맥 또는 비정상 동맥이 터져 출혈, 정상 뇌조직 산소 공급 부족으로 뇌전증.',['정답.','틀리다.','모야모야.','CVT.','커진다.']),
Q('강의록','AVM의 구성으로 옳은 조합은?',['유입동맥(feeder) – nidus – 유출정맥(draining vein)','Neck – sac – dome','Feeder – sac – neck','Nidus – 정상 모세혈관층 – 정맥','정맥동 – 혈전 – 피질정맥'],1,'강의록: AVM = feeder, nidus, draining vein. 동맥이 모세혈관을 거치지 않고 정맥으로 연결.',['정답.','동맥류.','혼합.','모세혈관을 거치지 않음.','CVT.']),
Q('강의록','AVM의 증상으로 강의록에 제시되지 않은 것은?',['양측 원위 ICA 폐쇄에 의한 반복 TIA','뇌출혈','뇌자극에 의한 뇌전증','두통','혈류 탈취현상(steal)에 의한 신경학적 증상'],1,'강의록 AVM 증상: 출혈, 간질발작, 두통, cerebral blood flow steal phenomenon.',['정답. 모야모야.','증상.','증상.','증상.','증상.']),
Q('강의록','Spetzler–Martin grade의 구성 요소 조합으로 옳은 것은?',['크기, eloquent area, deep venous drainage','크기, 환자 나이, 출혈 여부','Nidus 수, feeder 수, 위치','나이, 증상, 크기','출혈량, IVH, 의식'],1,SM,['정답.','틀리다.','틀리다.','틀리다.','Fisher·GCS.']),
Q('강의록','4 cm 크기, 운동피질(eloquent) 위치, 표재성 정맥으로만 배출되는 AVM의 Spetzler–Martin grade는?',['III','I','II','IV','V'],1,SM+' 계산: 3–6 cm 2 + eloquent 1 + superficial 0 = 3.',['정답.','틀리다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','7 cm, eloquent 위치, 심부 정맥 배출 AVM의 Spetzler–Martin grade는?',['V','III','IV','II','VI'],1,SM+' 계산: >6 cm 3 + 1 + 1 = 5.',['정답.','틀리다.','틀리다.','틀리다.','없음.']),
Q('강의록','2 cm, non-eloquent 전두엽 표면, 표재성 정맥 배출 AVM에 가장 즉각적이고 확실한 치료는?',['Microsurgical resection','Gamma Knife','Coil embolization','STA-MCA bypass','관찰만'],1,SM+' '+AVMT,['정답(grade I).','심부·eloquent 소형.','동맥류.','모야모야.','틀리다.']),
Q('강의록','심부·eloquent 부위의 소형 AVM에서 고려하며, 폐색까지 latency가 있어 그동안 출혈 위험이 지속되는 치료는?',['Gamma Knife','Microsurgical resection','Clipping','EVD','EDAS'],1,AVMT,['정답.','즉각적.','동맥류.','수두증.','모야모야.']),
Q('강의록','AVM에서 혈관내 색전술의 역할이 아닌 것은?',['모든 AVM의 유일한 완치 치료','수술 전 혈류 감소','High-risk feeder/동반 동맥류 표적','일부 병변의 definitive therapy','수술·방사선수술과 병합'],1,AVMT,['정답.','역할.','역할.','역할.','역할.']),
Q('강의록','모야모야병의 병태생리로 옳은 것은?',['양측 원위 ICA와 근위 ACA·MCA의 진행성 특발성 협착-폐쇄와 비정상 혈관망','단일 동맥의 선천성 동정맥 단락','정맥동 혈전','경동맥 박리','소혈관 지방유리질증'],1,MM,['정답.','AVM.','CVT.','박리.','틀리다.']),
Q('강의록','모야모야병의 연령별 임상 양상으로 옳은 것은?',['소아는 뇌경색, 성인은 뇌출혈이 많다.','소아는 뇌출혈, 성인은 뇌경색이 많다.','연령과 무관하게 뇌출혈만 발생한다.','소아에서는 무증상이다.','성인은 항상 경련으로만 발현한다.'],1,MM,['정답.','반대.','틀리다.','틀리다.','틀리다.']),
Q('강의록','모야모야병에서 치료 결정에 필요한 관류 예비능 평가 검사는?',['SPECT/CTP/MRP','비조영 CT만','뇌파','요추천자','EMG'],1,MM,['정답.','틀리다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','모야모야병의 직접문합법은?',['STA-MCA bypass','EDAS','EMS','Multiple burr holes','Omental graft'],1,MM,['정답.','간접.','간접.','간접.','간접.']),
Q('강의록','모야모야병의 간접문합법이 아닌 것은?',['STA-ACA bypass','EDAS','EDAMS','Encephalo-galeo-synangiosis','Multiple burr holes'],1,MM,['정답. 직접.','간접.','간접.','간접.','간접.']),
Q('강의록','Suzuki stage에서 ICA가 사실상 사라지고 ECA에서 뇌로 혈액이 공급되는 단계는?',['VI','I','III','IV','V'],1,SUZ,['정답.','협착 시작.','강화.','감소.','폐쇄.']),
Q('강의록','Suzuki stage III "intensification of the moyamoya"의 소견은?',['ICA 분지의 모야모야 변화 증가와 ACA·MCA 협착','경동맥 분지 협착만','ICA 소실 후 ECA 공급','모야모야 변화 감소와 ICA 폐쇄성 변화','ICA·ACA·MCA 폐쇄'],1,SUZ,['정답.','I.','VI.','IV.','V.']),
Q('강의록','모야모야 증후군(quasi-moyamoya)에 대한 설명으로 옳은 것은?',['기저 질환에 동반되어 모야모야 양상의 혈관 변화를 보이는 경우','특발성 양측 병변','편측만 있는 probable moyamoya와 동일','AVM의 한 형태','정맥 기형'],1,MM+' (moyamoya syndrome은 다른 질환에 동반된 이차성 모야모야 양상)',['정답.','moyamoya disease.','다르다.','틀리다.','틀리다.']),
Q('강의록','출혈성 뇌혈관질환의 치료 원칙으로 강의록에 제시되지 않은 것은?',['즉시 혈전용해제 투여','출혈 확장 억제','원인 병변 차단','뇌압·수두증 관리','재출혈·혈관연축 예방'],1,'강의록 기본 프레임: 출혈 → 국소 압박, ICP 상승, 이차 허혈; 치료 원칙 — 출혈 확장 억제, 원인 병변 차단, 뇌압/수두증 관리, 재출혈·혈관연축 예방.',['정답. 금기.','원칙.','원칙.','원칙.','원칙.']),
]
