from fixlib import Q
ANS='자율신경검사: QSART(교감 절후 땀분비), Valsalva maneuver, 부교감신경기능 평가(Valsalva ratio, HR response to deep breathing), 기립경사검사(head-up tilt). TCD는 두개내 혈류속도 검사로 자율신경검사가 아니다.'
ans=['정답(해당하지 않음). TCD는 뇌혈류 검사.','QSART: 교감신경 절후 땀분비 기능.','Valsalva: 교감·부교감 기능 평가.','부교감신경기능 평가: Valsalva ratio, HR DB.','기립경사검사: 기립 시 혈압·맥박 변화.']
SPECS={
 'q-001':Q(3,'ILR로 확인된 자연발생 실신 중 긴 무수축(asystole)이 있는 난치성 반사실신에서는 pacemaker를 고려할 수 있다. 다만 반사실신에는 vasodepressor(혈관확장) 성분이 함께 있어 pacemaker만으로 완치되지 않을 수 있다.',
   '금기가 아니라 선택적으로 고려한다.','보존적·약물치료가 이미 실패했다.','정답.','ICD는 심실성 부정맥 치료 기기이다.','cardioneuroablation은 1차 치료가 아니다.'),
 'q-002':Q(2,'Bezold-Jarisch reflex: venous pooling → preload 감소 → 심박출량 유지를 위해 심실 수축 증가(hypercontractile) → 좌심실 mechanoreceptor 자극 → vagal afferent로 NTS 활성 → 교감 억제(말초혈관 확장) + 부교감 활성(서맥) → 저혈압·서맥 → 실신. 복원자: 문제 복원이 정확하지는 않음.',
   '맞는 설명.','정답(틀린 설명). preload 감소 시 심실 수축은 증가한다.','맞는 설명.','맞는 설명.','맞는 설명.'),
 'q-003':Q(1,ANS,*ans),
 'q-004':Q(3,'기립저혈압: SBP 20 또는 DBP 10 이상 감소(3분 이내), 3분 이후면 지연기립저혈압. 기립빈맥증후군(POTS): 혈압 감소 없이 10분 이내 HR 30 이상 증가가 지속.',
   '혈압 감소가 기준에 미달한다.','지연기립저혈압도 혈압 감소가 있어야 한다.','정답. POTS.','반사실신: 실신 에피소드, 서맥·저혈압.','이 검사 소견과 맞지 않다.',
   stem='34세 여성이 앉았다 일어설 때 어지러움이 동반된다고 내원하였다. 내원 당시 혈압은 110/70mmHg였고, 시행한 기립경사검사에서 기립 후 5분만에 심박수가 34 bpm 상승하였다. 당시 혈압은 105/65mmHg였다. 이 환자에게 적절한 진단명은?',tail='야마 2023 객40 · 학습지 136–137쪽 원문대조'),
 'q-005':Q(1,ANS,*ans),
 'q-006':Q(3,'Syncope vs seizure: syncope의 myoclonus는 의식소실 후에 나타나고 1~15초, 불규칙, 안구는 위로 편위, 발작후 혼돈 없음. seizure는 즉시, 30초~2분, rhythmic, 측방 안구편위, postictal confusion.',
   '즉시 발생은 seizure.','좌우 편위는 seizure. syncope는 upward.','정답.','rhythmic은 seizure.','postictal confusion은 seizure.',tail='야마 2022 객2 · 학습지 137–138쪽 원문대조'),
}
