BA='학습지 정답 그대로 채점 · 현재 강의록은 BA39·40을 Geschwind 영역으로 구분 (해설 참고)'
GP='학습지 정답 그대로 채점 · substantia nigra(SNr)도 출력핵이라는 점 주의 (해설 참고)'
FX='학습지 정답 그대로 채점 · 중격핵도 뇌궁 섬유를 받는다는 점 주의 (해설 참고)'
SPECS={
 'q-005':dict(caveat=BA),'q-009':dict(caveat=BA),'q-013':dict(caveat=BA),'q-019':dict(caveat=BA),
 'q-007':dict(caveat=GP),'q-010':dict(caveat=GP),'q-015':dict(caveat=GP),'q-018':dict(caveat=GP),
 'q-008':dict(caveat=FX),
 'q-011':dict(caveat=FX,stem='hippocampus에서 시작해서 fornix에 잇는 것을 고르시오.',meta='야마 · 11/41 · 야마 2022 객7 · 학습지 320–321쪽 원문대조'),
 'q-021':dict(caveat='학습지 정답 그대로 채점 · massa intermedia도 전형적인 반구 연결 백질은 아님 (해설 참고)'),
 'q-029':dict(caveat='원본 복원자도 정답 불확실로 표기 (해설 참고)'),
 'q-033':dict(caveat='학습지 정답 그대로 · 현재 수업은 해마→뇌궁→유두체 경로로 설명 (해설 참고)'),
 'q-037':dict(caveat='학습지 정답 그대로 · 해부학적 경계 주의 (해설 참고)'),
 'q-038':dict(meta='야마 · 38/41 · 야마 2014 객3 · 학습지 328–329쪽 원문대조 · 복수정답(2개)',
   choices=['1','2','3','4','39','40','41','42','43','44','17'],ans=[5,6],
   basis='학습지 정답 ⑤⑥ (복원자 정의성). 당시 수업 기준 BA39·40이 Wernicke’s area로 sensory aphasia 영역이었다. 현재 강의록은 BA22를 Wernicke, BA39·40을 Geschwind 영역(삼차 두정 연합영역)으로 구분하므로 표현 차이에 주의.',
   exps=['BA1: 일차체성감각피질.','BA2: 일차체성감각피질.','BA3: 일차체성감각피질.','BA4: 일차운동피질.','정답. BA39(각회): 학습지 기준 Wernicke 영역.','정답. BA40(모서리위회): 학습지 기준 Wernicke 영역.','BA41: 일차청각피질.','BA42: 일차청각피질.','BA43: 일차미각피질.','BA44: Broca 영역(운동실어증).','BA17: 일차시각피질.']),
}
