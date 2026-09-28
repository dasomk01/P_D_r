from fixlib import Q,S
EXAM='정신 및 고위기능 검사, 뇌신경 검사, 운동계 검사, 감각계 검사, 반사, 소뇌기능검사, 자율신경 기능검사, 혼수 환자의 신경학적 검진 (+ 언어, 자세와 보행)'
SPECS={
 'q-001':Q(1,'Optic tract 병변: 반대측 동측반맹이 불일치(incongruous)하고, 교차 섬유가 더 많아 반대측 눈에 RAPD가 생긴다. LGN 이후 병변에서는 RAPD가 없다.',
   '정답. 좌측 optic tract.','LGN 병변은 RAPD를 일으키지 않는다.','측두엽 시방사(Meyer loop): 반대측 상사분맹, RAPD 없음.','두정엽 시방사: 반대측 하사분맹, RAPD 없음.','시각피질: 일치성 반맹, 황반 회피, RAPD 없음.'),
 'q-002':Q(2,'Locked-in syndrome(다리뇌 증후군): 의식은 있으나 vertical eye movement와 blinking을 제외한 거의 모든 수의근 마비. 그림에서 지워진 부분에 pyramidal tract와 PPRF(horizontal gaze)가 있다.',
   'Parinaud(dorsal midbrain): vertical gaze palsy, sunset sign.','정답. Locked-in syndrome.','Lateral medullary: 동측 얼굴·반대측 사지 감각 이상, 마비 없음.','Sensory dissociation: 척수 반절 손상의 감각 양상.'),
 'q-003':S(EXAM+' 중 3개 이상','서만욱 교수님 신경학의 개요 강의록. 킹야 및 티야.',tail='야마 2018 주1 · 학습지 188쪽'),
 'q-004':S('정상적인 구심성·중추성·원심성 신경계의 구조와 기능을 이해하고, 병적 상태의 이상 징후를 해석하여 어떤 종류의 병변이 신경계 어느 부위에 발생했는지 검진하는 방법','신경학 통합강의록 p.210 요약.',tail='야마 2017 주12 · 학습지 189쪽'),
 'q-005':S('언어, 정신 및 고위기능 검사, 자세와 보행, 뇌신경 검사, 운동계 검사, 감각계 검사, 반사, 소뇌기능검사, 자율신경 기능검사, 혼수 환자의 신경학적 검진','PPT 빨간 글씨. 과거 야마에는 "언어"와 "자세와 보행"이 빠져 있으니 강의록 기준으로.',tail='야마 2017 주13 · 학습지 189쪽'),
 'q-006':S(EXAM,'강의록·과거 기출 (복원자 오태섭).',tail='야마 2015 주15 · 학습지 191쪽'),
 'q-007':S(EXAM+' 중 5가지 이상','강의록 182p (복원자 나호현).',tail='야마 2014 주30 · 학습지 192쪽'),
 'q-008':S('방사통 (Radicular pain)','pain의 종류: 국소통, 연관통, 방사통, 복합지역통증증후군, 시상통 (총론 ppt 80쪽).',tail='야마 2014 주31 · 학습지 192쪽'),
 'q-009':S('Test the gait, rebound phenomenon, finger to nose, heel to shin, rapid alternating movements, speech, nystagmus, hypotonia, pendular reflexes, tremors 중 3개 이상','서만욱 교수님 PPT 61번.',tail='야마 2013 주44 · 학습지 193쪽'),
 'q-010':S(EXAM,'강의록 182p (복원자 김다솔). 소아에서는 psychomotor development와 원시반사를 추가로 본다.',tail='야마 2011 주1 · 학습지 194쪽'),
}
