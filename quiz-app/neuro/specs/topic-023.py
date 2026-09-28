from fixlib import Q,S,vis,last
T='topic-023'
SAH='갑작스러운 심한 두통 + CT에서 기저조(basal cistern)를 따라 불가사리 모양 고음영 → 지주막하출혈(SAH). 외상이 없으면 자발성 SAH이며 가장 흔한 원인은 뇌동맥류 파열. 동맥류 확인은 CT 혈관조영, MR 혈관조영, 뇌혈관조영술. 뇌동맥류 호발 3부위: ACom, MCA 분지부, ICA–PCom 분지부.'
AVM='외상 기왕력 없는 소아·젊은 성인의 뇌실질내 출혈 → 뇌동정맥기형(AVM)을 의심(수업 강조). 혈관조영에서 덩어리 모양의 nidus.'
OCC='곽효성 교수님 강조: 우측 편마비(± 구음장애) + 심방세동 → 심인성 색전에 의한 좌측 MCA 폐색, 좌측 편마비 → 우측 MCA, 혼수(의식 변화) → 기저동맥(basilar) 폐색. 혈관영상은 사진의 왼쪽이 환자의 오른쪽.'
TX='급성 뇌경색의 중재적 치료: IV tPA는 발병 3시간(수업에서는 4.5시간) 이내. 문제점 — 시간이 짧음, 혈전과 접촉하는 tPA 양이 적음, 효과가 적음, 출혈이 많음. 그 이후나 대혈관 폐색에는 동맥 내 기계적 혈전제거술(stent retriever 등; FDA: MERCI 2004년경 9시간 이내, Penumbra 2008, stent-assisted 2012).'
NI='신경중재 시술(내과적 약물치료와 외과적 수술의 중간): 급성 뇌경색 — 동맥내 혈전용해·혈전제거, 동맥경화성 협착 — 두개내·경동맥 스텐트, 뇌동맥류 — 코일 색전술, 뇌혈관기형 색전술(AVM, 경동맥-해면정맥동루, 경막 동정맥루), 과혈관성 종양 색전술(수술 전). 동맥류 클립 결찰은 외과적 수술.'
VN='혈관 이름(곽효성 교수님 강의록): 가 — common carotid a., 나 — middle cerebral a., 다 — vertebral a., 라 — basilar a., 마 — anterior cerebral a.'
SPECS={
 'q-002':Q(4,SAH,'틀림. 고혈압성 출혈은 대개 뇌실질(기저핵·시상) 출혈이다.','틀림. 경막외출혈은 외상·중경막동맥 손상이 원인이다.','틀림.','정답.','틀림. 뇌실질 출혈이 아니다.',visual=vis('뇌 CT (학습지 632쪽)','v25_66.jpg')),
 'q-003':Q(1,SAH+' 첫 번째 lateral view에서 ICA와 PCom이 만나는 부위에 동맥류가 잘 보인다(복원자가 비슷한 사진으로 대체).','정답. ICA–PCom 분지부.','틀림.','틀림.','틀림.','틀림.',visual=vis('뇌혈관 영상 (학습지 632쪽 — 복원자가 유사 사진으로 대체)','v25_67.jpg')),
 'q-004':Q(4,SAH+' 복원자: ①만 원문 그대로이고 나머지는 내용만 같음.','틀림. 출혈이다.','틀림. 경동맥 폐쇄는 원인이 아니다.','틀림(선지 복원 불완전 — 지주막하 출혈이 아닌 다른 진단의 보기).','정답.','틀림(선지 복원 불완전).',visual=vis('뇌 CT (학습지 633쪽)','v23_19.jpg'),caveat='선지 ③⑤ 복원 불완전'),
 'q-005':Q(3,AVM,'틀림. 출혈이다.','틀림.','정답.','틀림. 소아이며 고혈압이 없다.','틀림.',visual=vis('뇌 CT (학습지 634쪽)','v23_20.jpg')),
 'q-006':Q(1,OCC+' 이 문항은 좌측 편마비 → 우측 MCA(가).','정답. 가 = Rt. MCA.','틀림. 나 = Lt. MCA(우측 편마비일 때).','틀림.','틀림.','틀림.',visual=vis('MR 혈관조영 (학습지 634쪽)','v23_21.jpg'),caveat='시험 중 21·22번 그림이 바뀌었다는 안내가 있었고, 복원자는 가~마 위치가 기억나지 않아 2022년 사진을 첨부함'),
 'q-007':dict(keep_excluded=True,ans=[5],answer_note='정답 없음 — 문제 오류로 전원 정답 처리',basis='학습부 코멘트: 문제 오류로 전원 정답 처리된 문항. '+VN,
   exps=['다는 vertebral a.이다.','나는 middle cerebral a., 라는 basilar a.이다.','마는 anterior cerebral a.이다.','나는 middle cerebral a.이다.','라는 basilar a.이다.'],
   choices=['가-common carotid artery, 다-anterior inferior cerebellar artery','나-anterior cerebral artery, 라-basilar artery','가-common carotid artery, 마-anterior cerebellar artery','다-vertebral artery, 나-anterior cerebral artery','라-posterior cerebral artery, 가-common carotid artery'],
   visual=vis('CT 혈관조영 (학습지 634쪽)','v23_22.jpg'),tail='야마 2023 객22 · 학습지 634–635쪽 (문제 오류·전원 정답)'),
 'q-008':Q(4,SAH,'틀림. 출혈에 tPA는 금기이다.','틀림.','틀림. 경막하 출혈이 아니다.','정답(학습지). 동맥류 확인을 위해 조영증강 CT(CT 혈관조영)를 시행한다.','틀림. 혈관 폐쇄로 인한 출혈이 아니다.',
   choices=last(T,'q-008','뇌혈관 폐쇄로 인한 출혈이 의심되어 조영증강 뇌 컴퓨터단층촬영검사 촬영이나 뇌 자기공명영상 검사 촬영을 시행한다.'),visual=vis('뇌 CT (학습지 635쪽)','v22_39.jpg'),caveat='복원자: 선지 내용이 강의록에 없어 정확한 답이 아닐 수 있음'),
 'q-009':Q(3,AVM+' 조영전 CT에서 뇌실질 출혈, 혈관조영에서 nidus.','틀림.','틀림.','정답.','틀림. 고혈압 병력이 없다.','틀림.',visual=vis('조영전 CT와 혈관조영 (학습지 635쪽)','v22_40.jpg')),
 'q-010':Q(2,OCC+' 우측 편마비 + 구음장애 → 좌측 MCA(나).','틀림. 가 = 우측 MCA.','정답. 나 = 좌측 MCA.','틀림.','틀림.','틀림.',visual=vis('MR 혈관조영 (학습지 636쪽)','v22_41.jpg')),
 'q-011':Q(1,VN,'정답.','틀림. 나는 MCA, 라는 basilar.','틀림. 가는 CCA.','틀림. 나는 MCA.','틀림. 가는 CCA.',
   choices=['가: Common carotid artery, 다: Vertebral artery','나: Anterior cerebral artery, 라: Posterior cerebral artery','가: External carotid artery, 마: Anterior cerebral artery','다: Vertebral artery, 나: Anterior cerebral artery','라: Basilar artery, 가: External carotid artery'],visual=vis('MR 혈관조영 (학습지 636쪽)','v22_42.jpg')),
 'q-012':Q(2,OCC+' 가 = 우측 MCA, 나 = 좌측 MCA, 다 = ACA, 라 = basilar, 마 = AICA 또는 PICA(추정).','틀림.','정답. 좌측 MCA.','틀림.','틀림.','틀림.',visual=vis('MR 혈관조영 (학습지 637쪽)','v21_44.jpg')),
 'q-013':Q(3,OCC+' A = ACA, B = 우측 MCA, C = 좌측 MCA, D = basilar, E = 좌측 vertebral.','틀림.','틀림. 우측 MCA.','정답. 좌측 MCA.','틀림.','틀림.',visual=vis('MR 혈관조영 (학습지 637쪽)','v20_60.jpg')),
 'q-014':Q(5,TX+' 이 환자: 3시간, 출혈 없음 → IV tPA.','틀림.','틀림. IV tPA가 먼저이다.','틀림.','틀림.','정답.',visual=None),
 'q-015':Q(4,OCC+' 이 문항은 코마 → 기저동맥(D).','틀림.','틀림.','틀림.','정답. 기저동맥.','틀림.',visual=vis('MR 혈관조영 (학습지 638쪽)','v19_78.jpg')),
 'q-016':Q(2,TX+' 5시간이 지났으므로 IV tPA 시간 창을 넘음 → 동맥 내 기계적 혈전제거술.','틀림(시험 중 감독 안내로 ①은 답이 아님이 확실했다고 함).','정답.','틀림.','틀림.','틀림. 3시간이 지났다.',visual=None),
 'q-017':Q(2,OCC+' 우측 편마비 + 구음장애 → 좌측 MCA(나). 사진 왼쪽이 환자의 오른쪽.','틀림.','정답.','틀림.','틀림.','틀림.',visual=vis('MR 혈관조영 (학습지 639쪽 — 복원자 첨부 사진, 번호 표시는 실제 가~마와 다름)','v18_51.jpg'),caveat='발문 일부 복원 누락, 사진의 표시가 실제 시험과 다름'),
 'q-018':S('가 — common carotid a., 나 — middle cerebral a., 다 — vertebral a., 라 — basilar a., 마 — anterior cerebral a. (학습지 정답: ④ 다-vertebral artery, 나-middle cerebral artery)','박정수 교수님 티야. 시험에는 대동맥궁부터 머리 꼭대기까지 1장, 목 위부터 머리 꼭대기까지 1장이 나왔고 화살표로 혈관을 표시함(복원자가 비슷한 사진 첨부).',
   subj=True,stem='다음은 병원에 내원한 환자의 혈관 사진이다. 표시된 혈관(가~마)의 이름을 쓰시오. (원문 객관식, 정답 ④ 외 선지 복원 실패)',visual=vis('혈관 사진 (학습지 639쪽 — 복원자 첨부 유사 사진)','v18_52.jpg'),tail='야마 2018 객52 · 학습지 639쪽 (선지 복원 실패 → 주관식으로 전환)'),
 'q-019':Q(4,OCC+' 교수님 예시: 85세 semicoma → basilar. 이 문항은 우측 편마비 + 심방세동 → 좌측 MCA(4).','틀림.','틀림.','틀림.','정답. 좌측 MCA.','틀림.',visual=vis('MR 혈관조영 (학습지 640쪽)','v16_12.jpg'),tail='야마 2016 객12 · 학습지 640쪽 원문대조'),
 'q-020':Q(5,TX+' 2시간 → IV tPA.','틀림(IV 혈전용해와 tPA가 겹치지만 학습지 정답은 ⑤).','틀림.','틀림.','틀림.','정답.',tail='야마 2016 객13 · 학습지 640쪽 원문대조'),
 'q-021':Q(2,TX+' 5시간 → 동맥 내 기계적 혈전제거술.','논란(감독 교수님이 ①을 intra venous로 고치라고 함; 원래 intra-arterial이었다면 6시간 이내 urokinase로 답이 될 수도 있음).','정답(학습지).','틀림.','틀림. 혈전이 동맥에 있다.','틀림. 3시간이 지났다.',
   stem='64세 여자가 5시간 전부터 말이 어눌해지고 행동에 불편함이 있어서 내원하였다. 영상확인 결과 중대뇌동맥에 혈전이 보였고, NIHSS가 12점이었다. 처음으로 해야하는 치료는?',visual=None,caveat='시험 중 ① 선지 영문 수정 안내가 있어 논란이 있었던 문항',tail='야마 2015 객7 · 학습지 640–641쪽 원문대조'),
 'q-022':Q(4,OCC+' 혼수이지만 우측 편마비 + 심방세동 → 복원자는 좌측 MCA를 답으로 선택(사진은 2014 객21 사진 사용).','틀림(혼수만 있었다면 basilar).','(선지 복원 실패)','틀림.','정답.','틀림.',
   choices=['Basilar artery','(선지 복원 실패)','Anterior cerebral artery','Middle cerebral artery','Vertebral artery'],visual=vis('MR 혈관조영 (학습지 641쪽 — 2014 객21 사진 사용)','v15_8.jpg'),tail='야마 2015 객8 · 학습지 641쪽 원문대조'),
 'q-023':Q(3,OCC+' 사진에서 4 = 좌측 MCA.','틀림.','틀림.','정답. 4번 혈관(좌측 MCA).','틀림.','(선지 ③과 중복 — 원문 그대로)',visual=vis('MR 혈관조영 (학습지 641쪽)','v14_21.jpg'),caveat='원문 선지가 3, 2, 4, 5, 4로 중복되어 있음'),
 'q-024':Q(5,TX+' 1시간, 출혈 없음 → IV tPA.','틀림.','틀림.','틀림.','틀림.','정답.'),
 'q-025':Q(3,NI+' 과혈관성 종양 색전술은 수술 전에 시행하며(수술 접근이 어렵거나 너무 크거나 부작용이 예측될 때), 수술 후 재발한 종양의 치료에는 쓰지 않는 것으로 해석(복원자).','적응증.','적응증(경동맥 스텐트).','정답(적응증 아님).','적응증(코일 색전술).','적응증.',
   choices=['초급성 뇌경색 (Hyperacute cerebral infarct) 환자의 혈전 제거','심한 경동맥 협착 (Severe carotid artery stenosis)','수술후 재발한 과혈관성 종양의 치료','비파열성 뇌동맥류 (Unruptured intracranial aneurysm)','경동맥-해면정맥동루 (Carotid-cavernous fistula)']),
 'q-026':Q(4,'사진: 동맥류 속을 코일이 꽉 채워 혈류가 들어가지 않게 함(강의록 ppt 38과 동일). 뇌동맥류 치료: direct neck clipping(수술) 또는 coiling(중재).','틀림.','틀림.','틀림. 수술적 결찰.','정답.','틀림.',visual=vis('뇌혈관조영 (학습지 643쪽)','v12_12.jpg')),
 'q-027':Q(1,NI,'정답. 동맥류 클립은 외과적 수술이다.','신경중재 시술.','신경중재 시술.','신경중재 시술.','신경중재 시술.',
   choices=['뇌동맥류 클립 (Aneurysmal clipping)','경동맥 스텐트 삽입술 (Carotid stent)','동맥내 혈전용해술 (intraarterial thrombolysis)','뇌동맥류의 혈관내 코일 색전술 (Endovascular aneurysm coiling)','동맥 풍선확장술 및 스텐트 삽입술 (intracranial arterial balloon angioplasty or stenting)'],tail='야마 2011 객39 · 학습지 643쪽 원문대조'),
 'q-028':Q(5,'혈관내 코일 색전술: 비교적 비침습적, 일상 복귀가 빠름(입원 짧음), 재발률 10–20%(수술 약 5%), 합병증은 clipping과 비슷, 전신마취 하에 시행.','틀림. 전신마취 하에 시행한다.','틀림. 입원기간이 짧다.','틀림. 재발률이 더 높다.','틀림. 수술이 더 오래된 방법이다.','정답.',tail='야마 2011 객40 · 학습지 643–644쪽 원문대조'),
}
