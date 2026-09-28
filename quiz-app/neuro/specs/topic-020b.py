from fixlib import Q
MEM='기억의 분류: Declarative(explicit) — episodic(개인 경험, medial temporal lobe/hippocampus), semantic(일반 지식, 앞·아래·옆쪽 측두엽). Non-declarative(implicit) — procedural(자전거·피아노·넥타이 매기, 기저핵·소뇌·SMA), emotional conditioning(독사를 보면 무서움), priming(광고 효과), conditioned reflex(파블로프). Working memory(전화번호 받아 적기, 방금 본 단어 바로 기억)는 전전두엽. 내측 측두엽 절제(H.M.) → 과거 기억·즉시 기억·운동 기술 습득은 보존, 새 사건의 장기 저장(episodic) 장애.'
SPECS={
 'q-001':Q(2,MEM,'틀림. 즉시 기억은 보존되어 있다.','정답. 새로운 사건을 장기 저장하지 못함 → episodic memory.','틀림. 일반 지식(과거 기억)은 보존되어 있다.','틀림. 운동 기술은 습득한다.','틀림. 시공간 기능과 무관하다.'),
 'q-004':Q(5,MEM,'Working memory(전전두엽).','Procedural memory(기저핵·소뇌).','시공간 구성(두정엽).','Semantic memory.','정답. 새로운 일화의 장기 저장 = episodic memory(내측 측두엽).'),
 'q-005':Q(2,MEM,'틀림. Working memory 담당이다.','정답. Episodic memory 장애 → medial temporal lobe.','틀림. Semantic memory 담당이다.','틀림. 시공간 기능 담당이다.','틀림. 운동 기술(procedural) 쪽이다.'),
 'q-008':Q(4,MEM,'틀림.','틀림.','틀림.','정답. 넥타이 매기·옷 입기·단추 채우기 같은 익숙한 운동 기술 = procedural memory.','틀림.'),
 'q-014':Q(5,MEM+' 아들 생일에 있었던 일 = 자신만의 특별한 경험 → Long term(나) + Explicit(다) + Episodic(마).','틀림. Short term이 아니다.','틀림. Implicit·semantic이 아니다.','틀림. Implicit·semantic이 아니다.','틀림. Implicit가 아니다.','정답. 나(Long term) – 다(Explicit) – 마(Episodic).',
   stem='아들의 생일에 있었던 일에 대한 기억, 자전거를 가르쳐줬던 기억 등 자신만이 가진 특별한 기억에 해당하는 것을 다음 보기에서 고르시오.\n가. Short term memory\n나. Long term memory\n다. Explicit memory\n라. Implicit memory\n마. Episodic memory\n바. Sementic memory'),
 'q-015':Q(5,MEM+' 몇 년 전 아들 생일의 일 → long term, declarative, episodic.','틀림. Long term이다.','틀림.','틀림. Semantic이 아니라 episodic이다.','틀림. Declarative이다.','정답.'),
 'q-018':Q(4,MEM,'틀림. 뜻을 설명하는 것은 declarative(semantic)이다.','틀림. Non-declarative(emotional conditioning)이다.','틀림. Non-declarative(procedural)이다.','정답. 최근 수업 내용·시간에 대한 기억은 declarative(episodic)이다.','틀림. Priming effect 때문이다.',
   choices=["'책상'의 뜻을 설명하는 것은 non-declarative memory에 의존한다.","'독사'를 보면 떠오르는 무서움이나 혐오는 declarative memory 때문이다.","피아노를 배우고 익혀 더 잘 칠 수 있는 것은 declarative memory에 기인한다.","최근 치매수업에 대한 내용이나 시간 등에 대한 기억은 declarative memory에 의존한다.","무의식 중에 자주 접하는 광고에 따라 상품을 선택하는 것은 procedural memory 때문이다."]),
}
