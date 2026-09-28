from fixlib import Q
UES='상부식도괄약근(UES)은 윤상인두근(cricopharyngeus)이 평상시 지속적으로 수축해 식도로부터의 역류를 막는다. 열림 기전: 윤상인두근 이완, suprahyoid·thyrohyoid 수축으로 후두가 앞으로 당겨짐, 음식물의 압력.'
SPECS={
 'q-001':Q(2,'Penetration-Aspiration Scale 8: 성대 아래로 흡인되었는데 배출하려는 노력(기침 등)이 없다(silent aspiration). 1: 정상, 2~5: 침투(성대 위), 6~8: 흡인.',
   'PAS 2~3 수준.','정답.','구강 잔류는 PAS로 평가하지 않는다.','식도 역류는 PAS 항목이 아니다.','정상은 PAS 1.'),
 'q-002':Q(3,'VFSS에서 음식물이 기도 옆으로 흘러 식도로 넘어가는 통로 → piriform sinus(22년 기출과 동일, 20년엔 vallecular fossa). 정답 선지 외에는 복원자가 임의 구성.',
   'Epiglottis: 후두덮개.','Vocal fold: 성대.','정답. Piriform sinus.','Soft palate: 연구개.','Vallecular fossa: 혀뿌리와 후두덮개 사이.',
   choices=['Epiglottis','Vocal fold','Piriform sinus','Soft palate','Vallecular fossa'],caveat='정답 외 선지는 복원자 임의 구성'),
 'q-003':Q(5,'정상 삼킴 중 흡인 방지 기전: 삼킴 중 호흡 정지, suprahyoid·thyrohyoid 수축으로 설골·후두 상전방 이동, 피열연골이 앞으로 기울고 후두덮개가 뒤로 접힘, 성대가 닫혀 성문 폐쇄. 윤상인두근 수축은 흡인 방지 기전이 아니다(UES).',
   '흡인 방지 기전.','흡인 방지 기전.','흡인 방지 기전.','흡인 방지 기전.','정답(아닌 것).'),
 'q-004':Q(2,'원유희 교수님 티야(강의록 p.4 그림). 화살표는 piriform sinus.','Vallecular fossa: 혀뿌리와 후두덮개 사이.','정답. Pyriform sinus.','Epiglottis.','Vocal fold.','UES.'),
 'q-005':Q(1,UES+' (여기서 시험 낸다고 하심)','정답. cricopharyngeus.','suprahyoid: 후두 거상.','thyrohyoid: 후두 거상.','arytenoid: 성문 폐쇄.','epiglottis: 기도 보호.'),
 'q-006':Q(2,'Shaker exercise: 똑바로 누워 1분 정도 발을 보도록 목을 들었다 내리기를 반복 → suprahyoid 강화, hyolaryngeal excursion과 UES opening 강화(보상이 아닌 운동의 대표).',
   'head tilt: 편마비 시 건측으로 기울이는 보상법.','정답.','Masako: 혀뿌리 후퇴(tongue base retraction) 저하 시.','Supraglottic swallow: 기도 보호가 부족할 때.','Mendelsohn: 삼킨 채 2~3초 후두 거상을 유지하는 기법.'),
 'q-007':Q(5,'VFSS에서 음식물이 혀뿌리와 후두덮개 사이(vallecular fossa)에 머물러 있는 모습(수업 중 보여준 사진).','Epiglottis.','Vocal fold.','Soft palate.','Piriform sinus.','정답. Vallecular fossa.'),
 'q-008':Q(4,UES,'붓목뿔근: 설골 거상.','턱목뿔근: 설골 거상.','갑상피열근: 성대.','정답. 윤상인두근.','입천장올림근: 연구개 거상.'),
}
INSERTS=[('q-002',dict(meta='야마 · 0/0 · 야마 2023 객53 · 학습지 837–838쪽 원문대조 (앱에서 누락되어 추가)',
  stem='67세 우측 중대뇌동맥 경색의 여자환자에서 시행한 비디오 투시 검사 상에서 흡인(aspiration)은 보이지 않았으나, 삼킴 후 AP view에서 다음과 같은 영상이 관찰되었다. 이 환자의 연하에 대한 가장 적절한 보상 기술을 고르시오?\n(영상 소견: AP view에서 우측(병변측) 인두에 조영제가 잔류)',
  choices=['목을 신전한다.','좌측으로 머리를 기울이기','좌측으로 머리를 돌린다.','구강 식도관 사용','성문상부 연하 기법(supraglottic swallow technique)'],ans=[2],
  basis='보상전략: chin tuck(가장 흔함), neck extension, 병변 쪽으로 머리 돌리기(turn) + chin tuck, 건측(정상 쪽)으로 머리 기울이기(tilt), supraglottic·super-supraglottic swallow. "turn은 병변 쪽, tilt는 정상 쪽". 우측 병변 → 좌측으로 기울이기(김기욱 교수님 티야).',
  exps=['목은 굴곡(chin tuck)이 기본.','정답. 건측(좌측)으로 tilt.','turn은 병변 쪽(우측)으로.','구강 식도관은 다른 방법이 모두 안 될 때.','supraglottic swallow는 "가장" 적절한 보상 기술은 아니다.'],
  caveat='원본 영상 미포함 — 소견 서술'))]
