from fixlib import Q,S
DEL='섬망 vs 치매(강의록 표): 주의력 저하 — 섬망 있음/치매 안정적, 발생 — 섬망은 수시간–수일에 급격히/치매는 수개월–수년에 서서히, 수면-각성 주기 장애 — 섬망 있음/치매 대개 없음, 가역성 — 섬망 대개 가역적/치매 드묾, 지각장애·환각 — 섬망 있을 수 있음/치매 대개 없음. 섬망은 의식 내용 + 의식 수준이 함께 변동한다.'
RESP='호흡 양상과 병변: Cheyne-Stokes — 간뇌·양측 대뇌피질, central neurogenic hyperventilation — 상부 교뇌, apneustic — 하부 교뇌, cluster breathing — 하부 교뇌(상부 연수), ataxic breathing — 연수. Ondine\'s curse: 수의 호흡은 정상이나 자율 호흡이 소실되어 잠들면 호흡이 멈춤(ponto-medullary tegmentum 병변).'
resp5=['Cheyne-Stokes: 간뇌·대뇌피질 병변.','Central neurogenic hyperventilation: 상부 교뇌.','Apneustic: 하부 교뇌.','정답. Ondine\'s curse: 잠들 때만 호흡마비.','Cluster breathing: 하부 교뇌.']
resp5b=['Cheyne-Stokes: 간뇌·대뇌피질 병변.','Apneustic: 교뇌.','Cluster breathing.','Ataxic breathing: 연수.','정답. Ondine\'s curse.']
LOC='의식 = 자신과 환경에 대한 인식. 두 요소: 의식의 내용(awareness: 혼돈, 섬망, 치매, 지속식물상태)과 각성 정도(arousal: alert, drowsy, stupor, semicoma, coma). Drowsy — 말(대화)에 깨어남, stupor — 통증 자극에만 깨어남, coma — 눈을 뜨지 않는 완전한 무반응. Decorticate(대뇌반구·간뇌 병변) vs decerebrate(중뇌 이하 병변). 뇌사: coma + 뇌간반사 소실 + 무호흡(3가지 모두).'
lvl=['Coma(각성 정도).','Drowsy(각성 정도).','Alert(각성 정도).','Stupor(각성 정도).','정답. Confusion — 의식의 내용(awareness) 문제로 성격이 다르다.']
MET='대사성 뇌병증의 의식저하: 저산소, 저혈당(약 50 mg/dL 이하), 심장질환에 의한 뇌혈류 저하, thiamine 결핍(Wernicke) 등은 의식저하를 흔히 일으키지만, K 3.0 정도의 경한 저칼륨혈증은 의식저하를 흔히 일으키지 않는다(류한욱 교수님 티야).'
met=['정답. 경한 저칼륨혈증은 의식저하를 흔히 일으키지 않는다.','맞는 설명. 저산소는 흔한 원인이다.','맞는 설명.','맞는 설명. 저혈당.','맞는 설명. Wernicke encephalopathy.']
SPECS={
 'q-003':Q(5,DEL,'틀림. 섬망이 호전·악화(변동)가 더 심하다.','틀림(복원 문구 기준). 섬망은 대개 가역적이다.','틀림. 섬망에서 수면-각성 주기 장애가 있다.','틀림. 섬망이 대개 가역적이다.','정답.'),
 'q-004':Q(4,RESP,*resp5),
 'q-005':Q(5,LOC,'맞는 설명.','맞는 설명. 내용(awareness)과 각성(arousal).','맞는 설명.','맞는 설명. 치매는 의식 내용의 문제.','정답(틀린 설명). 섬망은 의식의 "내용(awareness)" 문제로 분류된다.',
   choices=['의식이란 스스로와 주변에 대한 인식이 있는 상태를 말한다.','의식은 의식의 내용과 깨어 있는 정도로 구별할 수 있다.','혼수(Coma)는 의식이 없는 상태가 지속되는 것을 뜻한다.','치매는 의식의 내용가 문제가 있는 상태이다.','섬망은 의식의 정도(awakeness)가 문제가 있는 상태이다.']),
 'q-006':Q(4,RESP,*resp5),
 'q-007':Q(3,DEL,'틀림. 상황에 맞지 않는 말(혼돈)은 섬망에서 더 두드러진다.','틀림. 급격한 발생은 섬망이다.','정답. 치매는 수면-각성 주기가 대개 유지된다.','틀림. 섬망이 가역적이다.','틀림. 의식 변화는 섬망이 심하다.'),
 'q-008':Q(5,RESP,*resp5b),
 'q-009':Q(5,RESP,*resp5b),
 'q-010':Q(5,LOC,*lvl,choices=['중환자실에 있는 환자는 뇌간 반사(brain stem reflex)가 없는 혼수상태 이다','환자가 지시에 따라 수행이 가능 하지만 눈을 감고 있다.','환자는 묻는 말에 대답을 안하고 지시를 따르지 않으나 눈을 뜨고 상대와 눈을 맞출 수 있다.','뇌손상이 의심되는 환자에게 통증을 주었을 때, decorticate posture를 취한다.','말을 하면 엉뚱한 말을 하여 알아듣지 못한다.']),
 'q-011':Q(1,MET,*met,choices=['저칼륨혈증 (hypokalemia) 3.0mEq/dL은 의식저하가 자주 나타난다.','혈액 내 pO2, O2농도 이상만으로도 의식의 저하가 자주 나타난다.','심장질환에 의한 뇌혈류 (cerebral blood flow) 저하는 의식저하를 나타낼 수 있다.','혈당이 50mg/dL 이하로 떨어지면 의식저하가 자주 나타난다.','티아민 (비타민 B1 (thiamine)) 결핍만으로도 의식의 저하가 자주 나타날 수 있다.']),
 'q-012':Q(5,LOC,*lvl,choices=['중환자실에 있는 환자는 뇌간 반사(brain stem reflex)가 없는 혼수상태(coma)이다.','환자가 지시에 따라 수행 (obey-command)이 가능하지만 눈을 감고 있다.','환자는 묻는 말에 대답을 안하고 지시를 따르지 않으나 눈을 뜨고 상대와 눈을 맞출 수 있다.','뇌손상이 의심되는 환자에게 통증을 주었을 때, decorticate posture를 취한다.','말을 하면 엉뚱한 말을 하여 알아듣지 못한다.']),
 'q-013':Q(1,MET+' ※ 이전 버전의 정답(⑤)은 학습지 정답(①)과 달라 수정함.',*met,caveat='학습지 해설 칸 번호가 "객28"로 적혀 있으나 내용상 이 문항(객2) 해설임',
   choices=['저칼륨혈증 (hypokalemia) 3.0 mEq/dL은 의식저하가 자주 나타난다.','혈액 내 pO2 , O2농도 이상만으로도 의식의 저하가 자주 나타난다.','심장질환에 의한 뇌혈류 (cerebral blood flow) 저하는 의식저하를 나타낼 수 있다.','혈당이 50mg/dL 이하로 떨어지면 의식저하가 자주 나타난다.','티아민 (비타민 B1 (thiamine)) 결핍만으로도 의식의 저하가 자주 나타날 수 있다.'],tail='야마 2016 객2 · 학습지 218쪽 원문대조'),
 'q-014':Q(1,LOC+' ARAS는 감각 경로에서 섬유를 받아 각성·주의·깨어 있음을 유지한다.','정답(틀린 설명). 뇌사에는 coma + 뇌간반사 소실 + 무호흡 세 가지가 모두 필요하다.','맞는 설명. 자극 없이 눈을 뜨고 눈을 맞추면 alert(단, awareness는 떨어질 수 있음).','맞는 설명.','맞는 설명. 간뇌·대뇌반구 병변 → decorticate.','맞는 설명.',caveat='복원자: ①과 ② 사이에서 답이 갈렸음',
   choices=['Brain stem reflex가 없고 coma 상태라면 뇌사로 정의할 수 있다.','말에 반응하지 않아도 스스로 눈을 뜨고 눈을 맞출 수 있다면 alert 하다고 할 수 있다.','지시사항을 이행 할 수 있다면 자꾸 눈을 감으려 해도 drowsy가 아니다.','Diencephalic 구조에 lesion이 생기면 decorticate rigidity가 나타난다.','Ascending reticular activation system은 consciousness 유지에 중요하다.']),
 'q-015':Q(3,LOC+' Semicoma: 강한 피부 자극에 회피반응, DTR 존재, 실금, 자발운동 없음. Coma: 자발운동 없음, 실금(DTR·각막반사 소실 시 deep coma).','틀림.','틀림. 말(부름)에 반응하지 않는다.','정답. 심한 통증 자극에만 잠시 반응.','틀림. 대답까지 했다.','틀림.',
   stem='57세 남자 환자가 고열에 의한 의식장애를 주소로 내원하였다. 환자는 3일 전부터 고열에 시달리다가 어제 저녁부터는 계속 잠만 자려고 한다고 보호자가 이야기했다. 이학적 검사 상 환자는 불러서는 반응을 보이지 않다가 심한 통증 자극에 잠시 반응 하여 대답하였다가 다시 잠을 자려는 경향을 보였다. 환자의 의식상태로 적절한 것은?',tail='야마 2014 객25 · 학습지 219–220쪽 원문대조'),
 'q-016':Q(1,'ARAS 활동성 증가: 감각 신호(특히 통증), 대뇌피질 신호(감정, 수의운동), 중추신경 흥분제(catecholamine, amphetamine, caffeine). 감소: 감각 경로·대뇌피질 신호 감소, 수면중추 자극, ARAS의 광범위 손상(종양 등), 전신마취제.','정답.','감소시킨다.','감소시킨다(광범위 손상).','감소시킨다.','감소시킨다.',
   choices=['Caffeine','Stimulation of the sleep centers','Tumor','Anesthetics drug','Reduction of signals from either the sensory pathways or the cerebral cortex']),
 'q-017':S('Decerebrate rigidity(제뇌강직) — 중뇌 이하(교뇌 상부) 병변','팔·다리 모두 신전 = decerebrate rigidity. 중뇌 이하 병변에서 pontine reticular formation과 vestibular nucleus는 남아 있고, 억제가 풀린 vestibular nucleus가 신근 긴장도를 높인다. Decorticate rigidity(팔 굴곡·다리 신전)는 대뇌반구·간뇌 병변. 학습지 정답: ⑤번(decerebrate rigidity에 대한 선지).',
   subj=True,stem='혼수 환자가 내원하였다. 신경학적 검진 상 팔, 다리가 모두 extension 된 자세를 보였다. 이 자세의 이름과 병변 위치를 쓰시오. (원문 객관식, 선지 복원 실패)',tail='야마 2014 객27 · 학습지 220–221쪽 (선지 복원 실패 → 주관식으로 전환)'),
}
