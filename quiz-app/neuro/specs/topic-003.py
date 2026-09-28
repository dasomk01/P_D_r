from fixlib import Q,S,vis
CBL=('test the gait\nrebound phenomenon\nfinger to nose test\nheel to shin test\nrapid alternating movements\nspeech, nystagmus\nhypotonia\npendular reflexes\ntremors')
CBL_B='서만욱 교수님 신경학의 개요 강의록 3-2-8 소뇌기능검사: test the gait, rebound phenomenon, finger to nose, heel to shin, rapid alternating movements, speech, nystagmus, hypotonia, pendular reflexes, tremors. 19·20·21·22년 반복 출제된 킹야.'
auto='자율신경 기능검사: 기립성 저혈압, 발한 등.'; sens='감각계 검사: 통각·온도·촉각·위치·진동감각.'; cn='뇌신경 검사: 12쌍 뇌신경 기능.'; mot='운동계 검사: power와 tone.'; cb='정답. 소뇌기능 검사.'
SD='척수 반절 손상(Brown-Séquard): 동측 운동·고유감각(위치·진동) 소실 + 반대측 통각·온도감각 소실 → 감각해리(sensory dissociation).'
sdx=['국소 감각 이상: 말초신경 한 가지 분포 영역의 감각 이상.','방사성 감각 이상: 신경근(dermatome)을 따라 방사되는 감각 이상.','대칭성 사지 원위부 감각 이상: 다발신경병증(glove-stocking).','정답. 감각해리.','감각실조증: 고유감각 소실로 인한 실조.']
CRPS='복합지역통증증후군: 손상 후 통증이 교감신경계를 자극하고 혈관연축 등으로 통증이 다시 증가하는 cycle → burning pain, swelling (서만욱 교수님 신경학의 개요, 킹야).'
pain=['국소통: 손상 부위 자체의 통증.','방사통: 신경근을 따라 퍼지는 통증.','연관통: 내장 통증이 다른 체표 부위에서 느껴지는 것.','정답. 복합지역통증증후군(CRPS).','시상통: 시상 병변 후 반대측의 중추성 통증.']
LIS='Locked-in syndrome(다리뇌 증후군): 의식은 있으나 vertical eye movement와 blinking을 제외한 거의 모든 수의근 마비. pyramidal tract와 PPRF(horizontal gaze) 손상.'
lis=['Parinaud syndrome(dorsal midbrain): vertical gaze palsy, sunset sign.','정답. Locked-in syndrome.','Lateral medullary syndrome: 동측 얼굴·반대측 사지 감각 이상, 마비 없음.','Sensory dissociation: 척수 반절 손상의 감각 양상.']
LISD='This is a condition in which a patient is aware but cannot move or communicate verbally due to complete paralysis of nearly all voluntary muscles in the body except for vertical eye movement and blinking.'
SPECS={
 'q-001':Q(3,'상위운동신경원 징후(DTR 증가, Babinski 양성) + 이마 주름·눈 감기가 보존된 하안면 위약(중추성 안면마비) → 반대측(좌측) 대뇌피질/피질척수로 병변.',
   '말초성 안면마비는 이마까지 침범하고 상위운동신경원 징후가 없다.','pons facial nucleus 병변은 말초형 안면마비 양상이다.','정답. 좌측 대뇌피질/피질척수로.','우측 경수 병변은 안면 위약을 설명하지 못한다.','소뇌 병변은 위약·Babinski가 아니라 실조를 일으킨다.'),
 'q-002':Q(2,'awakeness(각성)와 awareness(의식 내용)를 구분한다. 자발적으로 눈을 뜨고 있으므로 alert, 지남력 저하·횡설수설·변동은 confusion → Alert, confused (황윤수 교수님 신경학적 검사).',
   'intelligent: 의식 내용이 정상인 경우.','정답. Alert, confused.','Drowsiness: 자꾸 자려고 하나 지시에 반응.','Stupor: 지시에 따르지 못하고 통증에 소리 정도만 냄.','Coma: 반응 없음.'),
 'q-003':Q(3,'묻는 말에 대답은 못하지만 행동으로 이해·실행 → 언어 이해 보존, 표현 장애 = Broca(운동성) 실어증 → 우세반구 하전두회. 우측 상하지 약화도 좌측 전두엽(운동피질) 침범으로 설명된다.',
   '측두엽(Wernicke): 이해 장애가 두드러진다.','두정엽: 감각·시공간 장애.','정답. 전두엽.','후두엽: 시각 장애.','병변은 전두엽에 국한해 설명된다.',
   stem='의사소통이 되지 않았다. 묻는말에 대답을 제대로 하지 못했지만 행동에 대해서는 이해하고 행동하였다. 우측 상하지가 좌측에 비해 약화가 나타났다. (가장 가능성이 높은 병변 부위는?)',tail='야마 2025 객40 · 학습지 175쪽 원문대조 (질문 문장 복원 보완)'),
 'q-004':Q(4,'따라 말하기(복창) 가능 → 초피질성 실어증, 질문에 동문서답(이해 장애) → 감각성 → 초피질성 감각실어증(Wernicke 주변).',
   '운동성 실어증: 자발언어·복창 장애.','감각성 실어증: 이해·복창 모두 장애.','초피질성 운동실어증: 자발언어 장애, 복창 가능, 이해 보존.','정답. 이해 장애 + 복창 보존.','전도성 실어증: 유창·이해 보존, 복창 장애(arcuate fasciculus).'),
 'q-005':Q(2,'그림: 좌측 팔다리가 flaccid·externally rotated(좌측 편마비). 대뇌 병변에서는 안구가 병변 쪽으로 편위(병변 쪽 미는 힘 약화) → 우측 대뇌 병변. 뇌간 병변이면 편마비 반대쪽을 본다. 첫 공개 정답 ④에서 이의제기 후 ②로 정정.',
   '좌측 대뇌 병변이면 우측 편마비 + 좌측 편위.','정답. 오른쪽 대뇌 병변.','뇌간 병변은 편마비 반대편(병변 반대쪽)으로 안구 편위.','우측 뇌간 병변이면 좌측 편마비와 함께 안구는 좌측을 본다.','소뇌 병변은 편마비·안구 편위를 설명하지 못한다.',
   visual=vis('원본 그림 (학습지 176쪽)','t003_2023_6.jpg')),
 'q-006':Q(4,'우측 하사분맹(homonymous inferior quadrantanopia) → 반대측 두정엽 병변 → constructional apraxia. 교수님 코멘트: 좌우 표기가 불명확했으나 출제 의도는 하사분맹 = 두정엽 국소화.',
   'coma: ARAS 병변.','bradykinesia·rigidity·tremor: 기저핵(파킨슨증).','표현언어 장애: 전두엽(Broca).','정답. 구성실행증: 두정엽.','얼굴실인증(prosopagnosia): 후두-측두엽.',
   visual=vis('원본 그림 (학습지 177쪽)','t003_2023_7.jpg')),
 'q-007':Q(3,'그림은 Brown-Séquard(척수 반절) 손상. spinothalamic tract는 들어오자마자 교차하므로 병변측 하부의 온도감각은 정상 전달된다. ※ 정답 미공개, 복원자 사견으로 ③.',
   '척수 반절 손상의 전형적 소견으로 제시되지 않는다(복원자도 불확실).','위치·진동감각(후색)은 동측에서 소실된다.','정답(복원자 사견). 병변측 온도감각은 보존.','운동 마비는 동측에서 나타난다.','fine touch(후색)는 병변측에서 소실되므로 물체 구별(입체인지)이 어렵다.',
   choices=['병변부위 이하로 초기에 강직성 마비가 나타나고 후에 이완성 마비로 진행한다','반대측에 위치감각, 진동감각이 소실된다','병변측에서 온도감각을 정상적으로 인지한다','반대측에서 이완성마비가 관찰된다','병변측에서 물체를 만져서 구별해내는 것은 가능하다'],
   tail='야마 2023 객8 · 학습지 177–178쪽 원문대조',caveat='정답 미공개 · 복원자 사견 정답 (해설 참고)',visual=vis('원본 그림 (학습지 178쪽)','t003_2023_8.jpg')),
 'q-008':Q(5,CBL_B,auto,sens,cn,mot,cb,stem='다음 검사들은 무슨 기능을 알아보기 위한 검사들인가?\n'+CBL),
 'q-009':Q(4,SD,*sdx),
 'q-010':Q(4,CRPS,*pain),
 'q-011':Q(3,'꿈을 행동화(고함, 발길질) → REM sleep behavior disorder(REM-related parasomnia). REM 수면 중 근긴장 소실이 없어진다.',
   '하지불안증후군: 저녁·안정 시 다리의 불편감.','주기성 사지운동증: 수면 중 반복적 다리 움직임.','정답. 렘수면 행동장애.','기면증: 주간 과다수면, 탈력발작.','수면 간대성근경련: 입면 시 근육 경련(hypnic jerk).'),
 'q-012':Q(5,CBL_B,auto,sens,cn,mot,cb),
 'q-013':Q(4,SD,*sdx),
 'q-014':Q(4,CRPS,*pain,choices=['국소통','연관통','방사통','복합지역통증증후군','시상통'],tail='야마 2021 객22 · 학습지 182–183쪽 원문대조'),
 'q-015':Q(5,CBL_B,auto,sens,cn,mot,cb,stem='다음의 검사들은 무슨 기능을 알아보기 위한 검사들인가?\n'+CBL),
 'q-016':Q(4,CRPS,*pain),
 'q-017':Q(2,LIS+' 원문 5번 선지는 복원실패로 4지선다로 제공.',*lis,stem='다음 설명에 해당하는 질환은?\n'+LISD,tail='야마 2020 객91 · 학습지 184쪽 원문대조'),
 'q-018':Q(3,CBL_B,auto,'운동계 검사: power와 tone.','정답. 소뇌기능 검사.',cn.replace('뇌신경 검사','뇌신경검사'),'정신 및 고위기능 검사: 지남력·기억·언어 등.',stem='다음의 검사들은 무슨 기능을 알아보기 위한 검사들인가?\n'+CBL),
 'q-019':Q(4,SD,*sdx),
 'q-020':Q(2,LIS+' 13·15·17·18년 주관식 야마, 19년 객관식.',*lis,stem='다음 설명에 해당하는 질환은?\n'+LISD.replace('movement','movements'),tail='야마 2019 객30 · 학습지 186–187쪽 원문대조'),
 'q-021':Q(4,CRPS,*pain),
 # 주관식 — 학습지에 답이 있음
 'q-022':S('Visual and body perception (시지각·신체지각)','고위기능 검사 중 visual and body perception: 유명한 배우 얼굴 알아보기, "왼손 검지로 우측 귀 만지세요" (서만욱 교수님, 티야).',tail='야마 2018 주2 · 학습지 188쪽'),
 'q-023':S('Test the gait, rebound phenomenon, finger to nose, heel to shin, rapid alternating movements, speech, nystagmus, hypotonia, pendular reflexes, tremors 중 3개 이상',CBL_B,tail='야마 2018 주3 · 학습지 188–189쪽'),
 'q-024':S('Test the gait, rebound phenomenon, finger to nose, heel to shin, rapid alternating movements, speech, nystagmus, hypotonia, pendular reflexes, tremors',CBL_B,tail='야마 2017 주14 · 학습지 189–190쪽'),
 'q-025':S('2+','Reflex grading: 0 absent, ± reinforcement 시에만, 1+ 감소, 2+ 정상, 3+ 증가, 4+ clonus.',tail='야마 2017 주15 · 학습지 190쪽'),
 'q-026':S('Power(근력), Tone(긴장도)','Motor 검사 시 power와 tone을 본다 — 수업시간 TY (복원자 김은혜). ※ 이전 버전의 정답 "2+"는 2017 주15의 답이 잘못 들어간 것이어서 수정함.',tail='야마 2016 주15 · 학습지 190쪽'),
 'q-027':S('근육과 연결된 힘줄에 급작스런 폄 자극 → muscle spindle 자극 → 척수 내 alpha motor neuron 연결 → 근육의 반사수축','교수님 해설 답안: 근육과 연결된 인대와 관절주위 조직에 급작스런 폄 자극을 주면 muscle spindle이 자극되고, 척수 내에서 알파 신경세포에 연결되어 근육의 반사수축을 일으키는 일련의 과정.',tail='야마 2016 주16 · 학습지 190쪽'),
 'q-028':S('소뇌','Finger to nose test는 소뇌기능검사(slide 61·62).',tail='야마 2016 주18 · 학습지 190–191쪽'),
 'q-029':S('추체외로계 (striatopallidonigral system = basal ganglia, cerebellum)','이상운동질환은 추체외로계, 즉 striatopallidonigral system(basal ganglia)과 cerebellum의 기능 이상으로 발생. 아세틸콜린·도파민이 대표적.',tail='야마 2016 주19 · 학습지 191쪽'),
 'q-030':S('5','Grading power(MRC) 정상 = 5 (복원자 오현석).',tail='야마 2015 주16 · 학습지 191쪽'),
 'q-031':S('2+','Reflex grading: 0 absent, ± reinforcement 시에만, 1+ 감소, 2+ 정상, 3+ 증가, 4+ clonus.',stem='Deep tendon reflex의 정상 등급은 ( ) 이다.',tail='야마 2015 주17 · 학습지 191–192쪽'),
 'q-032':S('Test the gait, rebound phenomenon, finger to nose, heel to shin, rapid alternating movements, speech, nystagmus, hypotonia, pendular reflexes, tremors',CBL_B,tail='야마 2015 주18 · 학습지 192쪽'),
 'q-033':S('신경계(뇌, 척수, 말초신경)의 질환을 진단하고 치료하는 의학의 한 전문분야','복원자 김화평.',tail='야마 2014 주29 · 학습지 192쪽'),
 'q-034':S('뇌졸중, 어지럼증, 두통, 이상운동질환, 치매, 수면장애, 경련성 질환, 다발경화증, 퇴행성 질환, 척수 질환, 말초신경질환, 신경근육접합질환, 근육질환 중 5가지 이상','서만욱 교수님 강의록 5장 신경학적 증후군 목록.',stem='신경학적 증후군의 종류에 대해 아는대로 쓰시오. (5가지 이상 정답)',tail='야마 2014 주32 · 학습지 192–193쪽'),
 'q-035':S('설인신경(CN IX)과 미주신경(CN X)','Glossopharyngeal & vagus nerve 검사: vocal cord palsy, swallowing, gag reflex, palatal palsy (강의록 p42).',tail='야마 2013 주45 · 학습지 193쪽'),
 'q-036':S('Tone(긴장도)','Motor 검사: power와 tone.',tail='야마 2013 주46 · 학습지 193쪽'),
 'q-037':S('국소 감각 이상, 방사성 감각 이상, 대칭성 사지 원위부 감각 이상, 감각 해리, 감각 실조증, 피질성 감각 이상 중 2개 이상','신경학 개요 ppt 77.',tail='야마 2013 주47 · 학습지 193–194쪽'),
 'q-038':dict(keep_excluded=True),
 'q-039':S('GCS = Eye opening(1–4) + Best verbal response(1–5) + Best motor response(1–6), 총 3–15점. 경도 13↑, 중등도 9–12, 중증 8↓','의식 수준을 수치화하여 파악하고 예후를 추정. 최하점은 0점이 아니라 3점.',stem='Glasgow coma scale에 대해 설명하시오.',tail='야마 2011 주3 · 학습지 194쪽'),
}
