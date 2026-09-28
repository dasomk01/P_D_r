from fixlib import Q,S,vis,last
T='topic-024'
AX='NCS — axonopathy vs myelinopathy(오선영 교수님 강의록): Myelinopathy(탈수초) — 전도속도 현저 감소(<70%), 원위 잠복기 연장, conduction block, temporal dispersion, F-wave 지연·소실, amplitude는 비교적 유지; wasting 동반·대칭적 원위부→근위부 위약, 발목반사부터 소실, 운동+감각(스타킹·장갑), 회복이 좋음. Axonopathy(축삭) — amplitude(CMAP·SNAP) 감소, 속도·잠복기 정상; 급성·근위부 위약(wasting 없음), 초기 DTR 소실·전신 무반사, 원위근 탈신경, 온도·통증 감각 보존, 회복이 느리고 불완전.'
EMG='EMG — neuropathy vs myopathy: Neuropathic MUAP — amplitude↑(>5 mV)·duration↑(>15 ms)·polyphasic(재신경분포로 한 운동단위가 더 많은 근섬유를 지배), 원위부 위약, 운동+감각 증상, 반사 초기 소실, fasciculation. Myopathic MUAP — amplitude↓(<300 µV)·duration↓(<3 ms)·polyphasic, 근위부 위약, 운동 증상만, 반사는 늦게까지 보존, 구축·심근병증 동반 가능.'
UL='UMN sign: 위약, 운동조절 저하, 근긴장 변화(저·고긴장), 지구력 감소(decreased endurance), DTR 항진, 경직·간대(clonus). LMN sign: 근마비, fibrillation, fasciculation, 저긴장·무긴장(속도 비의존), 무반사·저반사(피부반사도 감소), 분절·국소·신경근 분포의 위약.'
NCSW='NCS 파형: (a) latency — 자극부터 CMAP 시작까지(신경전도 시간 + NMJ 지연 + 근육 탈분극 시간), (b) amplitude — 최종적으로 발화하는 근섬유 수를 반영, (c) duration, 면적(area).'
SPECS={
 'q-002':Q(3,AX,'축삭 손상 소견이다.','근위부(신경근·신경총) 탈수초 소견일 수 있으나 "탈수초성 말초신경병증"의 대표 소견은 아니다.','정답. 전도 지연·시간 분산.','축삭 손상 소견이다.','EMG의 neuropathic MUAP 소견이다(NCS가 아님).'),
 'q-003':Q(1,AX+' '+EMG+' 이 환자: 수년간 진행(만성), EMG fibrillation(+), MUAP amplitude·duration 증가 → 만성 neuropathy. 하지 신경(tibial, peroneal)에서 amplitude 정상·잠복기 연장·속도 저하 → 탈수초. 상지 신경의 amplitude 감소만 보면 axonopathy로 착각할 수 있으니 주의.','정답.','틀림. 하지 신경의 amplitude는 정상이다.','틀림. 수년간 진행했다.','틀림. 여러 신경이 침범된 다발신경병증이다.','(선지 복원 실패)',
   visual=vis('NCS(위)·EMG(아래) 결과 (학습지 307쪽)','e23_13a.jpg','e23_13b.jpg')),
 'q-004':Q(2,'설사(감염) 뒤 며칠에 걸쳐 빠르게 진행하는 대칭적 상행성 하지 위약 + DTR 소실 + 감각 정상 → 길랭-바레 증후군(AIDP, 급성 탈수초성 다발신경병증). 수업 case: 원위 운동 NCS 정상이어도 F-response 소실 → 근위부(신경근) 탈수초.','틀림. 중추신경 질환이며 DTR이 항진된다.','정답.','틀림. 피로성 위약·안구 증상.','틀림. 근위부 위약·자율신경 증상, 반복 자극 시 증가.','틀림. UMN+LMN 징후, 서서히 진행.'),
 'q-005':Q(1,AX,'정답.','틀림. 축삭 손상.','틀림. 축삭 손상(근위부 위약).','틀림. 축삭 손상.','틀림. 축삭 손상.'),
 'q-006':Q(2,EMG,'틀림. Neuropathy.','정답.','틀림. Neuropathy.','틀림. Neuropathy.','틀림. Neuropathy(myopathy는 반사가 늦게까지 보존).'),
 'q-007':Q(1,AX,'정답.','틀림. 축삭 손상.','틀림.','틀림.','틀림.'),
 'q-008':Q(5,UL,'LMN sign.','LMN sign.','LMN sign.','LMN sign.','정답. Ankle clonus는 UMN sign.'),
 'q-009':Q(3,EMG+' 그림: 큰 amplitude·긴 duration·polyphasic → neuropathic MUAP(주변 신경이 손상 신경의 근육까지 지배) → neuropathy는 반사가 초기에 소실된다. 복원자: 시간에 쫓겨 복원이 정확하지 않음.','(선지 복원 실패)','틀림(복원자 판단: 근위축이 뚜렷한 myopathic 소견과 맞지 않음).','정답(학습지).','틀림.','틀림.',
   choices=['(복원 실패)','근위축이 있다.','반사가 소실된다.','근수축이 일어나지 않는다.','심전도를 확인할 필요가 없다.'],visual=vis('EMG (학습지 310쪽)','e20_46.jpg'),caveat='복원자가 정확하지 않다고 적은 문항',tail='야마 2020 객46 · 학습지 310쪽 원문대조'),
 'q-010':Q(4,UL,'LMN sign(근위축).','UMN·LMN 공통.','LMN sign.','정답.','(선지 복원 실패)',choices=['근위축','근위약','fasciculation','Deep Tendon Reflex 항진','(복원실패)'],tail='야마 2020 객47 · 학습지 310–311쪽 원문대조'),
 'q-011':Q(3,'Case(38·39번 연속 문항): 오른쪽 wrist drop — saturday night palsy(radial n. 마비). a·b = median n., c·d = radial n., e·f = ulnar n. 검사 → 이상 소견은 c(right radial n.).','틀림. median n.','틀림. median n.','정답. Right radial n.','틀림.','틀림.',
   stem='(38–39번 case: 오른쪽 wrist drop — saturday night palsy 의심 환자) 아래는 신경전도 검사 결과이다. 다음 중 이상소견이 있는 것을 고르시오.',visual=vis('신경전도 검사 결과 (학습지 311쪽 — 수업 슬라이드 사진)','e19_39.jpg'),caveat='발문의 case 설명 일부 복원 누락'),
 'q-012':Q(4,'DTR 등 중추 징후는 정상이고 단순 근력약화(손목 신근 위약)만 있으므로 말초신경·근육 검사인 NCS/EMG. 나머지는 뇌·척추(CNS) 검사.','틀림.','틀림.','틀림.','정답.','틀림.',tail='야마 2018 객22 · 학습지 311–312쪽 원문대조'),
 'q-013':S('c — right radial nerve (Saturday night palsy)','a·b = median n., c·d = radial n., e·f = ulnar n. 오른쪽 wrist drop + 엄지·검지 쪽 손등 저림 → 요골신경 마비(saturday night palsy). 신현준 교수님이 수업 마지막에 시험에 낸다고 한 문제 그대로.',
   visual=vis('신경전도 검사 결과지 (학습지 311–312쪽 — 수업 슬라이드 사진)','e19_39.jpg'),tail='야마 2018 주9 · 학습지 312쪽 원문대조'),
 'q-014':Q(3,AX+' Hyperacute GBS(AIDP)에서는 NCS가 정상일 수 있어 배제할 수 없다(교수님 티야).','틀림. 나가 틀렸다.','틀림.','정답. 가, 다.','틀림.','틀림.',
   stem='다음 중 옳은 것은?\n가. NCS 검사시 velocity가 70%미만으로 감소하고 latency가 증가할 때 Demylinating type 이다.\n나. NCS가 정상이고 EMG 시행시 short amplitude, short latency일 때 neuropathy로 진단 가능하다.\n다. AIDP의 hyperacute 질환에서 normal NCS는 AIDP를 배제할 수 없다.\n라. Demylinating neuropathy의 진단시 감각신경 검사도 포함된다.',caveat='복원자: "라"가 틀린 이유는 확실하지 않음(보기 조합으로 결정)'),
 'q-015':S('F-wave(F-response), H-reflex','Electrodiagnostic study: NCS, 반복신경자극(RNS), late responses, blink reflex, needle EMG. Late response — F-response(운동신경원의 역방향 자극 반응), H-reflex(말초신경 자극 → 척수를 거친 단일연접 반사).',tail='야마 2016 주1 · 학습지 313쪽 원문대조'),
 'q-016':S('Axonal(축삭형), Demyelinating(탈수초형)',AX,tail='야마 2016 주2 · 학습지 313–314쪽 원문대조'),
 'q-017':Q(3,'중증 근무력증 진단: 단일섬유 근전도 — 민감도 가장 높음(전신형·안구형 모두 82–99%), 반복신경자극 — 전신형 53–100%, 안구형 10–17%, 항 AChR 항체 — 혈중 양이 개인의 중증도를 예측하지 않음, Edrophonium 검사 — 작용시간 약 5분으로 짧아 간편, seronegative MG — MuSK, LRP4, agrin 항체.','맞는 설명.','맞는 설명.','정답(틀린 설명). 항체 양은 중증도를 시사하지 않는다.','맞는 설명.','맞는 설명.',
   choices=last(T,'q-017','Seronegative MG에서 MuSK antibody가 타겟 중 하나이다.')),
 'q-018':Q(1,UL,'정답. UMN sign.','LMN sign.','LMN sign.','LMN sign.','LMN sign.',
   choices=['Decreased endurance','Muscle paresis','Fasciculation','Hypotonia','Weakness is limited to segmental or focal pattern'],tail='야마 2015 객8 · 학습지 314쪽 원문대조'),
 'q-019':S('(a) latency, (b) amplitude, (c) duration',NCSW,visual=vis('Nerve conduction 그림 (학습지 315쪽)','e15_s2.jpg'),tail='야마 2015 주2 · 학습지 315쪽 원문대조'),
 'q-020':Q(5,UL,'UMN sign(근긴장 변화).','UMN sign.','UMN sign.','UMN sign.','정답. LMN sign.',tail='야마 2014 객7 · 학습지 315쪽 원문대조'),
 'q-021':Q(5,NCSW,'Latency 설명.','Latency 구성.','Latency 구성.','Latency 구성.','정답. Amplitude에 대한 설명이다.',
   choices=['The time for the stimulus to the initial CMAP deflection from baseline','The nerve conduction time from the stimulus site to the neuromuscular junction (NMJ)','The time delay across the NMJ','The depolarization time across the muscle','The number of muscle fibers that ultimately fire'],visual=vis('신경전도 그래프 (학습지 316쪽)','e14_8.jpg')),
 'q-001':Q(4,AX,'탈수초 소견.','탈수초 소견.','탈수초 소견.','정답. 축삭 손상은 CMAP amplitude 감소.','탈수초 소견.'),
}
for k in ['q-013','q-015','q-016','q-019']: SPECS[k]['subj']=True
