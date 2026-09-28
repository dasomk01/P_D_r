from fixlib import Q
PARA='NREM-related parasomnias: confusional arousals, sleepwalking, sleep terrors, sleep related eating disorder. REM-related: REM sleep behavior disorder, recurrent isolated sleep paralysis, nightmare disorder.'
para=['정답(해당하지 않음). Nightmare disorder는 REM-related.','Confusional arousals: NREM.','Sleepwalking: NREM.','Sleep terrors: NREM.','Sleep related eating disorder: NREM.']
INS='불면증: 나이에 따라 증가, 여성에 많음, 약물은 의존성이 높아 신중히 사용, 만성 불면증은 CBT가 약물치료보다 좋다(약물과 병행), 주간 수면제한은 좋은 비약물 치료(킹야).'
SC='자극제어법: 졸릴 때만 눕기, 잠자리는 잠 용도로만, 잠이 안 오면 일어나 다른 장소로, 반복, 잠을 못 잤어도 아침에 같은 시간에 기상(낮잠 보충 X), 낮에는 가급적 눕지 말고 졸리면 30분 이내.'
sc=['정답(틀린 방법). 낮에 부족한 잠을 보충하지 않는다.','맞는 방법.','맞는 방법.','맞는 방법.','맞는 방법.']
PSG='TRT: 소등~점등 시간. TST = N1+N2+N3+R. Sleep efficiency = TST/TRT × 100. PSG로 OSA·CSA 진단, 근긴장도(EMG), PLMD 평가 가능(RLS는 임상 진단).'
psg=['정답(틀린 설명). N1+N2+N3+R은 TST이다. TRT는 lights-out부터 lights-on까지.','맞는 설명.','맞는 설명.','맞는 설명.','맞는 설명.']
ACT='Actigraphy: 손목에 차는 기기로 장기간 움직임을 기록 → 수면-각성 패턴, circadian rhythm sleep disorder, 불면증(수면 착각) 평가. 24시간 착용, 수면일지와 함께 판독. 호흡은 측정하지 못하므로 OSA 진단에는 쓰지 않는다(OSA는 PSG).'
SPECS={
 'q-001':Q(4,'잠에서 깨어 비명·빈호흡·발한·몸부림, 달래기 어렵고 기억 못함 → sleep terror(NREM parasomnia). 주로 초저녁 slow-wave sleep(N3)에서 발생.',
   'REM parasomnia가 아니다.','N3(slow-wave)에서 발생한다.','nightmare는 REM에서 발생하며 깨어나면 꿈을 기억한다.','정답.','수면 후반부는 REM이 많은 시기이다. sleep terror는 전반부에 많다.'),
 'q-002':Q(1,PARA,*para),
 'q-003':Q(1,SC,*sc),
 'q-004':Q(3,INS,'맞는 설명.','맞는 설명.','정답(틀린 설명). 불면증 약은 의존성이 높다.','맞는 설명.','맞는 설명.'),
 'q-005':Q(1,PARA,*para,tail='야마 2022 객53 · 학습지 141–142쪽 원문대조'),
 'q-006':Q(3,INS,'맞는 설명.','맞는 설명.','정답(틀린 설명). 의존성이 높다.','맞는 설명(병행).','맞는 설명.'),
 'q-007':Q(3,INS,'맞는 설명.','맞는 설명.','정답(틀린 설명). 의존성이 높다.','맞는 설명(병행).','맞는 설명.'),
 'q-008':dict(keep_excluded=True,choices=['Sleep latency','(선지복원실패)','Sleep pattern R','Sleep pattern NREM 1','Sleep pattern NREM 2'],ans=[1],
   basis='학습지에 정답 미기재. 나이 들수록 증가: sleep latency, WASO, stage N1, N2 / 감소: TST, sleep efficiency, REM latency, N3, stage R. 복원자: 1·4·5번이 모두 증가라 답이 확실하지 않아 논의 필요.',
   exps=['나이 들수록 증가.','(선지 복원 실패)','Stage R은 감소.','N1은 증가.','N2는 증가.'],tail='야마 2020 객95 · 학습지 142–143쪽 (정답 미기재)'),
 'q-009':Q(4,INS,'맞는 설명.','맞는 설명.','맞는 설명. 대부분의 약은 의존성이 높다.','정답(틀린 설명). 만성 불면증은 CBT가 약물보다 좋다.','맞는 설명.'),
 'q-010':Q(1,SC,*sc),
 'q-011':Q(4,INS+' ※ 이전 버전의 정답(③)은 학습지 정답(④)과 달라 수정함.','맞는 설명.','맞는 설명.','맞는 설명. 대부분의 약은 의존성이 높다.','정답(틀린 설명). 만성 불면증은 CBT가 약물보다 좋다.','맞는 설명.',tail='야마 2018 객20 · 학습지 143–144쪽 원문대조'),
 'q-012':Q(1,SC,*sc),
 'q-013':Q(5,ACT,'맞는 설명. 수면일지와 함께 판독.','맞는 설명.','맞는 설명.','맞는 설명(수면 착각 평가).','정답(틀린 설명). OSA는 PSG로 진단.'),
 'q-014':Q(1,PSG,*psg),
 'q-015':Q(1,PSG+' ※ 이전 버전의 정답(⑤)은 학습지 정답(①)과 달라 수정함.',*psg,tail='야마 2016 객3 · 학습지 145쪽 원문대조'),
 'q-016':Q(5,ACT,'수면각성주기 파악에 도움이 된다.','24시간 착용해야 한다.','OSA는 예측할 수 없다.','수면 착각 환자에게 도움이 된다.','정답. 수면일지를 함께 작성.'),
 'q-017':Q(5,PSG,'맞는 설명.','맞는 설명.','맞는 설명(EMG).','맞는 설명(PLMD).','정답(틀린 설명). RLS는 임상 진단.'),
 'q-018':Q(1,ACT,'정답. 수면일지와 함께.','수면각성주기 파악에 도움이 된다.','24시간 착용.','OSA 진단에 쓰지 않는다.','수면 착각 환자에게 도움이 된다.',tail='야마 2015 객12 · 학습지 147쪽 원문대조'),
}
