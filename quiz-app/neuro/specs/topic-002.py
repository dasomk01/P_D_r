from fixlib import Q,S,vis
CDST='반복되는 세균성 수막염 + midline(L1)의 작은 구멍 → congenital dermal sinus tract(incomplete dysjunction). 감별: sacrococcygeal dimple은 벌렸을 때 바닥에 정상 피부가 보이지만 CDST는 바닥이 보이지 않는다. 고은정 교수님 야마이자 티야(14~23년 매년 출제).'
MMC='myelomeningocele: 출생 시부터 신경조직이 노출된 개방성 병변으로, 작은 구멍 + 반복 수막염 양상이 아니다.'
TFT='thickened filum terminale: secondary neurulation 장애로 tethered cord를 일으키며, 반복 수막염의 원인이 아니다.'
LMMC='lipomyelomeningocele: 피하 지방종을 동반한 secondary neurulation 장애이다.'
DIM='sacrococcygeal dimple: 감별 대상. 벌리면 바닥에 정상 피부가 보인다.'
MEN='meningocele: 수막이 돌출된 낭성 병변으로, 작은 구멍의 누관이 아니다.'
CR='Craniosynostosis: sagittal → 장두증/주상두(scaphocephaly·dolichocephaly), 양측 coronal → 단두증(brachycephaly), 편측 coronal → 사두증(plagiocephaly), metopic → 삼각두(trigonocephaly).'
cor='coronal suture: 양측이면 단두증(짧고 넓은 머리), 편측이면 사두증.'
met='metopic suture: 삼각두(이마가 뾰족한 삼각형 머리).'
sag='sagittal suture: 앞뒤로 길어진 머리(장두증/주상두).'
lam='lambdoid suture: 후두부 편평(후사두증).'
SPECS={
 'q-001':Q(2,'두개골조기봉합증 수술: suture line을 따라 절개(suturectomy)하고 두개골을 잘게 나누어(morcellation) remodeling을 유도한다(2011 주8 야마와 같은 개념).',
   'VP shunt: 수두증 치료.','정답. suturectomy + morcellation → remodeling.','Coiling: 뇌동맥류 혈관내 치료.','Laminectomy: 척추관 감압술.','DBS: 이상운동질환 수술.'),
 'q-002':Q(3,'양측(bilateral) coronal suture 조기유합 → brachycephaly(단두증). 2012·2014 야마의 "Both coronal"을 bilateral로 바꿔 출제. '+CR,
   'Trigonocephaly(삼각두): metopic suture.','Scaphocephaly(주상두): sagittal suture.','정답. Brachycephaly(단두증): 양측 coronal suture.','Plagiocephaly(사두증): 편측 coronal suture.','Dolichocephaly(장두증): sagittal suture.'),
 'q-003':Q(5,CDST,MMC,'정답 아님. '+DIM,LMMC,TFT,'정답. Congenital dermal sinus tract.'),
 'q-004':Q(1,'Chiari type 1: 소뇌 tonsil이 foramen magnum 아래로 5mm 이상 하방 전위. type 2: vermis·brainstem·4th ventricle 전위, type 3: encephalocele, type 4: 소뇌 저형성.',
   '정답. tonsil(type 1).','vermis: type 2.','brainstem: type 2.','대뇌반구는 Chiari 기형의 하방 전위 구조가 아니다.','4th ventricle: type 2.'),
 'q-005':Q(5,CDST,MMC,TFT,DIM,LMMC,'정답. Congenital dermal sinus tract.'),
 'q-006':Q(3,'강의록 사진 그대로 출제(복원자 이윤석). 앞뒤로 길어진 머리 = sagittal suture 조기유합. '+CR,met.replace('metopic','x') and cor,met,'정답. '+sag,lam,
   visual=vis('원본 사진 (학습지 333쪽)','t002_2022_10.jpg')),
 'q-007':Q(3,'강의록 사진 출제(복원자 김용현). sagittal suture가 일찍 닫혀 머리가 앞뒤로 길어진 모습. '+CR,met,cor,'정답. '+sag,lam,
   visual=vis('원본 사진 (학습지 334쪽, 복원자 표시 가림)','t002_2021_19.jpg')),
 'q-008':Q(5,CDST,MEN,'Dandy-Walker malformation: 4th ventricle 낭성 확장·소뇌충부 저형성.',LMMC,TFT,'정답. Congenital dermal sinus tract.'),
 'q-009':Q(2,CDST,MEN,'정답. Congenital dermal sinus (tract).','Thickened filum: tethered cord, 반복 수막염 원인 아님.','Cord compression: 수막염·피부 구멍과 무관.','Myasthenia gravis: 신경근접합부 질환.'),
 'q-010':Q(2,'이마가 뾰족한 삼각형 머리(trigonocephaly) → metopic suture 조기유합(복원자 송태진). '+CR,cor,'정답. '+met,sag,lam,
   visual=vis('원본 사진 (학습지 335쪽)','t002_2020_65.jpg')),
 'q-011':Q(2,'사진 소견은 trigonocephaly → metopic suture 조기유합(복원자 소병찬). 원문 5번 선지는 비어 있어 4지선다로 제공. '+CR,cor,'정답. '+met,sag,lam,
   choices=['coronal suture','metopic suture','sagittal suture','lambdoid suture'],
   visual=vis('원본 사진 (학습지 335쪽)','t002_2019_70.jpg')),
 'q-012':Q(3,'반복 세균성 수막염 + L1 구멍 → CDST 의심. 수업 PPT와 문헌에서 MRI로 누관의 깊이·척수 연결을 확인한다(복원자 추정: L-spine MRI).',
   'Brain CT: 병변은 요추부이며 누관 확인에 부적합.','Urine culture: 무관.','정답. L-spine MRI로 누관 깊이와 척수 연결 확인.','Blood chemistry: 진단 불가.','Lumbosacral puncture: 감염 경로가 될 수 있어 부적절.',
   caveat='복원자도 정답을 추정으로 표기 (해설 참고)'),
 'q-017':Q(3,CR,'장두증: sagittal.','단두증: 양측 coronal.','정답. 삼각두: metopic.','사각두(사두증): 편측 coronal.'),
 'q-019':Q(1,'sagittal suture 조기유합 → 장두증(dolichocephaly), 복원자 조경원 정답 ①. '+CR,'정답. 장두증: sagittal.','단두증: 양측 coronal.','삼각두: metopic.','사각두: 편측 coronal.',tail='야마 2015 객6 · 학습지 338쪽 원문대조'),
 'q-021':Q(3,CR,'삼각두: metopic.','장두증: sagittal.','정답. 단두증: 양측(both) coronal.','사두증: 편측 coronal.'),
 'q-023':Q(4,'Disorders of secondary neurulation: thickened filum terminale, lipomyelomeningocele, terminal myelocystocele, caudal regression syndrome (2013 통합강의록).',
   'Meningomyelocele: primary neurulation 장애.','Encephalocele: postneurulation 장애.','Spinal split malformation: secondary neurulation 장애가 아니다(발생 초기 척삭 형성 이상).','정답. Thickened filum terminale.','Dermal sinus tract: incomplete dysjunction.'),
 'q-024':Q(2,CR,'Brachycephaly: 양측 coronal.','정답. Scaphocephaly(주상두): sagittal.','Trigonocephaly: metopic.','Plagiocephaly: 편측 coronal.'),
 'q-025':Q(1,CR,'정답. Brachycephaly: 양측(both) coronal.','Scaphocephaly: sagittal.','Trigonocephaly: metopic.','Plagiocephaly: 편측 coronal.','Dolichocephaly: sagittal.'),
 'q-026':Q([3,4,7],'학습지 정답 3,4,7 (복원자 강혜진). Neuronal migration disorders: lissencephaly, schizencephaly, pachygyria/macrogyria, heterotopia, polymicrogyria, hemimegalencephaly, focal cortical dysplasia.',
   'Encephalocele: postneurulation disorder.','Dermal sinus tract: incomplete dysjunction.','정답. Heterotopia(신경세포 이소증).','정답. Schizencephaly(뇌열).','Porencephaly(뇌구멍증): 피질 결손 낭포. schizencephaly와 MRI상 유사하나 이주이상질환은 아니다.','Holoprosencephaly: telencephalic cleavage disorder.','정답. Pachygyria(뇌회비대).',
   tail='야마 2011 객29 · 학습지 341쪽 원문대조 · 복수정답(3개)',stem='다음 중 이주이상질환에 해당하는 질환을 모두 고르시오.',
   choices=['Encephalocele','Dermal sinus tract','Heterotopia','Schizencephaly','Porencephaly','Holoprosencephaly','Pachygyria']),
 'q-029':Q(5,'소뇌·제4뇌실·뇌간이 대후두공으로 하방 전위 → Arnold-Chiari 기형(type 2). 갑작스런 호흡부전 가능.',
   '척수이분증(diastematomyelia): 척수가 둘로 나뉘는 기형.','종사비후: tethered cord 원인.','거미막낭종: 거미막 내 낭종.','Dandy-Walker: 4th ventricle 낭성 확장·충부 저형성.','정답. Arnold-Chiari 기형.'),
 # 주관식: 학습지에 답이 있는데 "미기재"로 표시되어 있던 문항
 'q-013':S('MRI로 확인 후 병변(누관·pus 등) 근치적 절제','congenital dermal sinus tract. 반복되는 이유 없는 세균성 수막염이 있으면 midline을 따라 구멍을 찾고, MRI로 확인한 뒤 끝까지 찾아 완전히 제거한다(복원자 오현).',tail='야마 2018 주13 · 학습지 336쪽'),
 'q-014':S('metopic suture','사진은 trigonocephaly(삼각두) → metopic suture 조기유합(복원자 온채련). 거의 매년 출제.',tail='야마 2018 주14 · 학습지 336–337쪽',
   stem='다음과 같은 소견을 보이는 소아 환자에서 조기 유합된 suture는?',visual=vis('원본 사진 (학습지 337쪽)','t002_2018_14.jpg')),
 'q-015':S('검사: Sonography, MRI / 처치: 근치적 제거술','Sonography 또는 MRI로 깊이를 확실히 파악하여 근치적으로 제거한다고 수업에서 언급(복원자 정한준).',tail='야마 2017 주10 · 학습지 337쪽'),
 'q-016':S('metopic suture','환아는 craniosynostosis 중 삼각두(trigonocephaly) → metopic suture 조기유합(복원자 조상원).',tail='야마 2017 주11 · 학습지 337쪽',
   visual=vis('참고 사진 (학습지 337쪽)','t002_2017_11.jpg',note='복원자가 시험 사진과 최대한 비슷한 것을 찾아 첨부한 사진')),
 'q-018':S('Congenital dermal sinus tract','incomplete dysjunction 질환 중 하나. 반복되는 meningitis가 특징(복원자 최소윤, 14년 주52와 동일).',tail='야마 2016 주2 · 학습지 338쪽'),
 'q-020':S('(Congenital) Dermal sinus tract','고은정 교수님 티야(복원자 김호림).',tail='야마 2015 주2 · 학습지 339쪽'),
 'q-022':S('Congenital dermal sinus tract','incomplete dysjunction(dermal sinus tract, dermoid·epidermoid tumor, meningocele manqué). 치료: sono·MR로 깊이를 파악해 근치적 제거.',tail='야마 2014 주52 · 학습지 339–340쪽'),
 'q-027':S('Suturectomy (suture line 절개 후 remodeling)','Craniosynostosis 치료: suture line을 따라 절개한 후 리모델링을 거치면 정상 모양으로 다시 융합(복원자 김수연A).',tail='야마 2011 주8 · 학습지 341–342쪽'),
 'q-028':S('Disorders of secondary neurulation (tethered cord)','thickened filum terminale, lipoma·lipomyelomeningocele이 conus의 상방이동을 막는 질환(복원자 김수연). 복원자도 "문제가 요구하는 것이 정확히 무엇인지 모르겠다"고 적음 → tethered cord syndrome도 가능한 답.',
   tail='야마 2011 주9 · 학습지 342쪽',caveat='복원자도 정답 불확실로 표기 (해설 참고)'),
}
