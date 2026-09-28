def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
MEM='강의록 기억: explicit(의식적) — episodic(사건·경험), semantic(사실·지식); implicit — procedural(기술), emotional 등. 단기 — working memory(전전두–측두두정 연합 네트워크, 정보를 잠시 유지); episodic — encoding·storage·retrieval, 내측측두엽이 새 기억의 부호화·공고화에 중요, 손상 시 오래된 기억은 보존; semantic — 전·하·외측 측두피질(양측 전측두엽, 언어 관련은 좌측 우세); procedural — SMA·상두정소엽·기저핵·소뇌.'
TEST='강의록 신경심리검사: 집중력 Digit span(forward — attention, backward — working memory, 전전두); 언어 K-BNT(이름대기), 자발언어·유창성·이해·따라말하기·읽기·쓰기; 시공간 interlocking pentagon(K-MMSE), clock drawing, Rey complex figure copy; 기억 SVLT(언어, 우성), Rey complex figure 즉시·지연·재인(시각, 비우성); 전두엽/집행 — motor impersistence, contrasting program, go–no-go, fist-edge-palm, alternating hand, alternating square & triangle, Luria loop, COWAT, K-CWST(Stroop). 선별 — MMSE, MoCA; 지능 — WAIS.'
OFF=[
Q('강의록','Digit span backward가 주로 평가하는 기능은?',['작업기억(working memory)','단순 주의력','일화기억','의미기억','절차기억'],1,TEST,['정답.','forward.','SVLT.','K-BNT 등.','운동.']),
Q('강의록','Digit span forward가 평가하는 기능은?',['주의력(attention)','작업기억','시공간 능력','집행기능','이름대기'],1,TEST,['정답.','backward.','pentagon.','Stroop.','K-BNT.']),
Q('강의록','27세 남자가 난치성 뇌전증으로 양측 내측측두엽 절제 후, 수술 전 일은 잘 기억하고 방금 본 단어를 바로 말하는 것도 잘하지만 수술 후 경험은 곧 잊는다. 새로운 운동 기술은 잘 습득한다. 손상된 기억은?',['일화기억(episodic memory)','작업기억','의미기억','절차기억','시공간 기억'],1,MEM+' (H.M. 증례: 심한 전향성 일화기억 장애, 작업기억·절차학습 보존; 강의 형성평가)',['정답.','보존.','주 손상 아님.','보존.','틀리다.']),
Q('강의록','H.M. 환자의 수술 후 기억 양상으로 옳은 것은?',['심한 전향성 일화기억 장애, 작업기억과 절차학습은 비교적 보존','절차학습이 가장 심하게 손상','작업기억이 완전히 소실','과거 기억만 모두 소실','의미기억만 선택적 손상'],1,MEM+' H.M.(1953년 27세 양측 내측측두엽 절제: 해마·해마곁·후각내·조롱박·편도).',['정답.','보존.','비교적 보존.','오래된 기억 보존.','틀리다.']),
Q('강의록','Papez 회로의 구성 요소가 아닌 것은?',['소뇌 치아핵','해마체','뇌궁(fornix)','유두체','시상 앞핵'],1,'강의록 Papez circuit: hippocampal formation, fornix, mammillary bodies, mammillothalamic tract, anterior thalamic nucleus, cingulum, entorhinal cortex — 일화기억 부호화·공고화.',['정답.','구성.','구성.','구성.','구성.']),
Q('강의록','의미기억(semantic memory)을 지지하는 주요 뇌 영역은?',['전·하·외측 측두피질(양측 전측두엽)','해마만','소뇌','기저핵','일차운동피질'],1,MEM,['정답.','일화.','절차.','절차.','틀리다.']),
Q('강의록','자전거 타기·운전 같은 기술을 담당하는 절차기억의 해부학적 기반이 아닌 것은?',['해마','보조운동영역','상두정소엽','기저핵','소뇌'],1,MEM,['정답. 일화.','기반.','기반.','기반.','기반.']),
Q('강의록','작업기억을 지지하는 네트워크는?',['전전두엽과 측두두정 연합피질을 연결하는 네트워크','해마–유두체 단독','소뇌–척수','기저핵–흑질','후두엽 단독'],1,MEM,['정답.','Papez.','틀리다.','틀리다.','틀리다.']),
Q('강의록','일화기억의 3단계로 옳은 것은?',['부호화(encoding) – 저장(storage) – 인출(retrieval)','주의 – 반복 – 망각','감각 – 운동 – 반사','학습 – 망각 – 재학습','지각 – 해석 – 표현'],1,MEM,['정답.','틀리다.','틀리다.','틀리다.','틀리다.']),
Q('강의록','언어성 기억을 평가하며 즉시회상·지연회상·재인을 측정하는 검사는?',['서울언어학습검사(SVLT)','Rey complex figure test','K-BNT','Stroop test','Digit span'],1,TEST,['정답.','시각.','이름대기.','집행.','주의.']),
Q('강의록','시각 기억 검사로 비우성 반구 기능을 반영하는 것은?',['Rey complex figure test 즉시·지연회상·재인','SVLT','K-BNT','COWAT','Digit span backward'],1,TEST,['정답.','언어.','이름대기.','집행.','작업기억.']),
Q('강의록','K-MMSE의 겹친 오각형 그리기 채점 기준으로 옳은 것은?',['두 도형이 모두 5개 선의 오각형이고 겹친 부분이 사각형이면 1점','정오각형이어야 한다','겹친 부분이 삼각형이어야 한다','하나만 그려도 1점','2점 만점'],1,'강의록: 두 도형 모두 5개 선의 오각형(정오각형 아니어도 됨), 겹친 부분 반드시 사각형 → 1점. 시공간(두정–후두, 주로 우측).',['정답.','아니어도 됨.','사각형.','틀리다.','1점.']),
Q('강의록','시공간 능력 평가 검사가 아닌 것은?',['K-CWST(Stroop)','Interlocking pentagon','Clock drawing test','Rey complex figure copy','—'],1,TEST,['정답. 집행.','시공간.','시공간.','시공간.','—'],fixed=True),
Q('강의록','전두엽/집행기능 검사가 아닌 것은?',['K-BNT','Go–no-go test','Fist-edge-palm','Luria loop','COWAT'],1,TEST,['정답. 언어.','집행.','집행.','집행.','집행.']),
Q('강의록','색깔 이름과 글자가 불일치할 때 억제 능력을 평가하는 검사는?',['K-CWST(Stroop test)','SVLT','Clock drawing','Digit span forward','K-BNT'],1,TEST,['정답.','기억.','시공간.','주의.','이름대기.']),
Q('강의록','실어증의 정의로 옳은 것은?',['구음 기관 마비 없이 후천적 뇌손상으로 말하기·이해·이름대기·따라말하기·읽기·쓰기 등이 손상된 상태','구음 기관 마비로 발음이 부정확한 상태','선천적 언어 발달 지연','청력 소실','기억력 저하'],1,'강의록: aphasia — 구음 기관 마비 없이 후천적 손상; aphasia ≠ dysarthria; Broca(말하기)·Wernicke(이해)는 전통 모델이며 실제는 우성반구 전두–측두–두정 네트워크.',['정답.','dysarthria.','틀리다.','틀리다.','틀리다.']),
Q('강의록','간이 인지 선별검사에 해당하는 것은?',['MMSE와 MoCA','WAIS','Rey complex figure','COWAT','K-CWST'],1,TEST,['정답.','지능.','시공간·기억.','집행.','집행.']),
Q('강의록','전전두엽 손상의 행동 양상으로 강의록에 제시되지 않은 것은?',['순수 전향성 기억상실','무의지증·무감동','무언무동증','탈억제·충동적 행동','반복·강박적 행동'],1,'강의록: 전전두엽 가운데면 — 무의지·무감동·무언무동; 아랫면 — 탈억제·충동·반복·강박; 바깥면 — 집행·기획 기능.',['정답. 내측측두.','제시.','제시.','제시.','제시.']),
Q('강의록','Clock drawing test의 지시로 강의록에 제시된 것은?',['숫자를 모두 쓰고 11시 10분으로 표시','3시로 표시','숫자 없이 원만','시계를 따라 그림','바늘만 표시'],1,'강의록: "이곳에 시계를 그리시는데, 숫자를 모두 써 넣으시고, 시간은 11시 10분으로 표시해주세요".',['정답.','틀리다.','틀리다.','copy 아님.','틀리다.']),
]
OFF=[q for q in OFF if '—' not in ''.join(q['choices'])][:18]
