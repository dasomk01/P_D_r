def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
LOC='강의록 2–8쪽: Localization — brain → spinal cord → nerve root → plexus → peripheral nerve → NMJ → muscle (예: CNS, C8/T1 root, lower trunk, medial cord, median nerve, NMJ, muscle). EDX 종류 — NCS, late responses(H, F), needle EMG, RNS, blink reflex, evoked potentials. 모든 EDX 검사의 주된 목표는 병변의 국소화(localize).'
CMAP='강의록 11–17쪽 운동신경전도(CMAP): Latency — 자극부터 CMAP 첫 편위까지; ① 자극점→NMJ 신경전도시간 ② NMJ 통과 지연 ③ 근육 탈분극 시간 포함; 가장 빠른 섬유 반영. Amplitude — 기저선→음성 정점, 탈분극하는 근섬유 수 반영; 저하 원인: 축삭 소실(axonal neuropathy) 또는 전도차단(demyelination). Area — 기저선 위 음성 정점 면적, 역시 근섬유 수 반영. Duration — 첫 편위부터 첫 기저선 교차(CMAP), 동시성(synchrony) 지표; 일부 섬유만 느려지는 탈수초 병변에서 특징적으로 증가. Conduction velocity = 거리 / (PL − DL); DL 단독으로는 MCV 계산 불가.'
SNAP='강의록 18–25쪽: 감각신경전도 — SNAP(예: ulnar sensory). Late responses — F response, H reflex: 근위부(신경근 등) 평가. Axonal loss vs demyelination — axonal loss, focal demyelination, diffuse demyelination, conduction block.'
EMG='강의록 26–32쪽 EMG: 자발전위 — fibrillation potential, positive sharp wave(탈신경). Motor unit — 운동신경세포, 축삭, NMJ들, 근섬유(PNS 기본 단위); MUAP — 운동단위의 세포외 침근전도 기록; 요소 — duration, amplitude, major spike, serrations, satellite potential, polyphasic MUAP. Neuropathy — 운동단위 수 감소·재신경지배 → large, long MUAP(동원 감소). Myopathy — 근섬유 소실 → small, short MUAP, early recruitment.'
RNS='강의록 33–35쪽: RNS — NMJ 질환 의심 시; 운동신경을 supramaximal 전기자극으로 초당 2–5회 반복자극하며 해당 근육 CMAP 진폭 변화 관찰(Normal, MG, LEMS 비교). Blink reflex — 전기자극 반사로 trigeminal, facial nerve, pons, medulla 병터 평가. Cardinal rules — NCS/EMG는 임상 진찰의 연장; 소견이 임상 문제와 관련 있는지 의심; 의심스러우면 기술적 요인 고려·환자 재진찰; 항상 임상-전기생리 상관; 의심스러우면 과진단하지 말 것. 형성평가 — 축삭성 신경병증을 가장 잘 시사: CMAP 진폭 감소.'
OFF=[
Q('강의록','강의록이 제시한 모든 전기진단(EDX) 검사의 주된 목표는?',['병변의 국소화(localization)','치료 효과 판정','예후 예측','근력 정량화','유전자 진단'],1,LOC,['정답.','부수적.','부수적.','틀리다.','틀리다.']),
Q('강의록','강의록에 열거된 전기진단 검사에 해당하지 않는 것은?',['뇌파(EEG)','Late responses(H, F)','Repetitive nerve stimulation','Blink reflex','Evoked potentials'],1,LOC,['정답.','해당.','해당.','해당.','해당.']),
Q('강의록','운동신경전도검사의 원위 잠복기(distal latency)에 포함되지 않는 것은?',['감각신경 활동전위 전도시간','자극점에서 NMJ까지의 신경전도시간','NMJ 통과 지연시간','근육 탈분극 시간','—'],1,CMAP,['정답.','포함.','포함.','포함.','—'],fixed=True),
Q('강의록','운동신경전도속도를 원위 잠복기만으로 계산할 수 없는 이유는?',['원위 잠복기에 NMJ 지연과 근육 탈분극 시간이 포함되기 때문','거리를 측정할 수 없기 때문','CMAP 진폭이 변하기 때문','감각섬유가 섞이기 때문','온도의 영향을 받지 않기 때문'],1,CMAP,['정답. 따라서 거리/(PL−DL).','틀리다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','팔꿈치 자극 잠복기 8.0 ms, 손목 자극 잠복기 3.0 ms, 두 자극점 거리 250 mm이다. 운동신경전도속도는?',['50 m/s','31 m/s','83 m/s','25 m/s','100 m/s'],1,CMAP+' 계산: 250 mm / (8.0 − 3.0) ms = 50 mm/ms = 50 m/s.',['정답.','250/8.','250/3.','틀리다.','틀리다.']),
Q('강의록','CMAP 진폭이 반영하는 것은?',['탈분극하는 근섬유의 수','가장 빠른 섬유의 전도속도','근섬유 발화의 동시성','NMJ 통과 시간','감각섬유 수'],1,CMAP,['정답.','latency·CV.','duration.','latency 일부.','SNAP.']),
Q('강의록','CMAP 진폭 저하를 일으킬 수 있는 두 기전으로 강의록에 제시된 것은?',['축삭 소실과 전도차단','근육 비대와 고온','NMJ 과흥분과 경직','감각신경 손상과 통증','상부운동신경원 병변과 경직'],1,CMAP,['정답.','틀리다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','CMAP duration이 특징적으로 증가하는 상황은?',['일부 운동섬유만 느려지는 탈수초 병변','순수 축삭 소실','정상 신경','근육병','NMJ 질환'],1,CMAP,['정답. 동시성 저하(시간분산).','진폭 저하.','정상.','틀리다.','틀리다.']),
Q('강의록','CMAP의 동시성(synchrony) 지표로 강의록에 설명된 매개변수는?',['Duration','Amplitude','Area','Latency','Conduction velocity'],1,CMAP,['정답.','근섬유 수.','근섬유 수.','빠른 섬유.','빠른 섬유.']),
Q('강의록','감각신경전도검사에서 기록하는 전위는?',['SNAP(sensory nerve action potential)','CMAP','MUAP','F wave','Fibrillation potential'],1,SNAP,['정답.','운동.','EMG.','late response.','EMG 자발전위.']),
Q('강의록','신경근 등 말초신경의 근위부 병변 평가에 도움이 되는 검사로 강의록에 제시된 것은?',['F response와 H reflex(late responses)','원위 감각전도만','Blink reflex','CMAP area','근생검'],1,SNAP,['정답.','원위부.','뇌신경·뇌간.','원위부.','EDX 아님.']),
Q('강의록','말초신경병증 환자의 NCS에서 원위 잠복기와 전도속도는 거의 정상이나 CMAP 진폭이 현저히 감소했다. 가장 적절한 해석은?',['축삭성 신경병증','미만성 탈수초 신경병증','국소 탈수초','정상 소견','근육병'],1,CMAP+' '+RNS,['정답.','CV·잠복기 이상.','전도차단·국소 지연.','틀리다.','EMG에서 판단.']),
Q('강의록','침근전도에서 탈신경을 시사하는 자발전위는?',['Fibrillation potential과 positive sharp wave','정상 MUAP','Early recruitment','Satellite potential만','F wave'],1,EMG,['정답.','틀리다.','근육병.','MUAP 요소.','NCS.']),
Q('강의록','운동단위(motor unit)의 구성 요소가 아닌 것은?',['감각신경 절','운동신경세포','운동 축삭','신경근접합부','근섬유'],1,EMG,['정답.','구성.','구성.','구성.','구성.']),
Q('강의록','만성 신경병증성 병변에서 재신경지배 후 관찰되는 MUAP 양상은?',['크고 긴(large, long) MUAP','작고 짧은 MUAP','Early recruitment','정상 MUAP','MUAP 소실 후 정상화'],1,EMG,['정답.','근육병.','근육병.','틀리다.','틀리다.']),
Q('강의록','근육병 환자의 침근전도 소견으로 옳은 것은?',['작고 짧은 MUAP와 조기 동원(early recruitment)','크고 긴 MUAP','동원 감소','CMAP 잠복기 연장','SNAP 소실'],1,EMG,['정답.','신경병증.','신경병증.','틀리다.','감각신경.']),
Q('강의록','반복신경자극검사(RNS)의 방법으로 강의록에 제시된 것은?',['Supramaximal 자극을 초당 2–5회 반복하며 CMAP 진폭 변화 관찰','Submaximal 자극 50 Hz 단발','감각신경 자극 후 SNAP 관찰','침전극으로 자발전위 관찰','안면신경 단일 자극'],1,RNS,['정답.','틀리다.','틀리다.','EMG.','Blink.']),
Q('강의록','Blink reflex로 평가할 수 있는 구조가 아닌 것은?',['척수 전각','삼차신경','안면신경','뇌교','연수'],1,RNS,['정답.','평가.','평가.','평가.','평가.']),
Q('강의록','증상은 없는 부위의 NCS에서 경미한 이상이 나왔다. 강의록의 Cardinal rules에 따른 태도로 옳은 것은?',['임상 문제와의 관련성을 의심하고, 의심스러우면 과진단하지 않는다','NCS 결과만으로 확진한다','임상 진찰은 필요 없다','기술적 요인은 고려하지 않는다','재검사는 금기이다'],1,RNS,['정답.','틀리다.','연장선.','고려.','재진찰.']),
Q('강의록','손 저림·위약 환자에서 병변 부위를 C8/T1 신경근, 하부 신경줄기, 내측 신경다발, 정중신경, NMJ, 근육 중 하나로 좁히는 과정을 강의록은 무엇이라 했는가?',['Localization','Recruitment','Synchrony','Temporal dispersion','Reinnervation'],1,LOC,['정답.','EMG.','CMAP.','탈수초.','EMG.']),
Q('강의록','CMAP area에 대한 설명으로 옳은 것은?',['기저선 위 음성 정점의 면적으로 탈분극하는 근섬유 수를 반영','동시성의 지표','가장 빠른 섬유의 속도','NMJ 지연 시간','감각섬유 수'],1,CMAP,['정답.','duration.','latency.','latency 일부.','SNAP.']),
Q('강의록','중증근무력증(MG)이 의심되는 환자에서 NMJ 기능을 평가하기 위해 강의록이 제시한 검사는?',['반복신경자극검사(RNS)','Blink reflex','H reflex','감각신경전도','Evoked potentials'],1,RNS,['정답.','뇌간.','근위부.','말초.','중추 경로.']),
]
OFF=[q for q in OFF if not any(c.strip()=='—' for c in q['choices'])]
