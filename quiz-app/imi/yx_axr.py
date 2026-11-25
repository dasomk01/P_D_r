# 야마 선지별 해설 · 복부 X-선(y_axr)
_PI=('Paralytic ileus – 소장·대장 전체가 벙벙(신생아 같은 사진), 액면 적고 짧음(강의록 p.31·41)','c')
_SV=('Sigmoid volvulus – 고령, inverted U·coffee bean sign, haustra 소실(강의록 p.50–51)','c')
_PPc=('정답 – Pneumoperitoneum: erect에서 횡격막 아래 crescent 공기, 대부분 궤양 천공(강의록 p.58·60)','c')
_PPw=('Pneumoperitoneum – erect 사진 횡격막 아래 초승달 공기가 있어야 함(이 사진엔 없음)','c')
_PN=('Pneumatosis intestinalis – 장벽 내 공기(intramural gas), 허혈성 대장염(강의록 p.61·63)','c')
_LBOw=('Large bowel obstruction – 대장(변연부·haustra)이 늘어나고 대장에도 액면(강의록 p.42·46)','c')
_MI=('Mechanical ileus – step-ladder·herring-bone·string of bead, 폐색 상부만 늘어남(강의록 p.36·41)','c')
_EC=('Emphysematous cholecystitis – 담낭 주변 공기, 올해 강의록에 없음','w')
_US=['후방음영 – 담석·결석·석회화·뼈 같은 강한 반사계면 뒤 저에코(검은 그림자)','여운허상(ring-down = comet-tail) – 밝은 점 뒤로 V자 꼬리(콜레스테롤 용종·갑상선 낭성 결절)',
 '거울허상 – 횡격막 같은 강한 반사면 반대편에 거울상','반향허상 – 두 강한 반사체 사이 반복 반사로 같은 간격 평행선(방광 앞쪽)','음향증강 – 담낭·방광·낭종 같은 낭성 구조 뒤가 더 밝음']
def u(i,ok=False): return (('정답 – ' if ok else '')+_US[i],'w')
_CH=[('CT cholangiopancreatography – CT로 담도 재구성(투시 영상·내시경관 없음)','w'),('ERCP – 내시경으로 유두에 조영제 주입, 투시 영상에 내시경관이 보임','w'),
 ('MRCP – 조영제 없이 담즙·췌액이 하얗게 보이는 MR 영상','w'),('PTC – 피부·간을 뚫고 담도에 바늘로 조영','w'),('ultrasonography – 초음파 영상(흑백 단면, 담도 전체 지도 아님)','w')]
def ok(t): return ('정답 – '+t[0],t[1])
X={
('axr-pp',2025,'객39'):[('Hepatomegaly – 간이 골반뼈 높이까지 내려옴(강의록 p.87), 이 사진은 아님','c'),_SV,_PPc,('Mechanical ileus – 늘어난 장·step-ladder 없음','c'),('Chronic pancreatitis – 췌장 위치 석회화(강의록 p.73), 이 사진은 공기 소견','c')],
('axr-lbo',2025,'객40'):[_PI,_SV,_PPw,_PN,('정답 – Large bowel obstruction: supine herring-bone, erect step-ladder, 대장에도 액면(강의록 p.46 같은 사진)','c')],
('axr-asc',2023,'객27'):[('Panperitonitis – 궤양 천공이면 횡격막 아래 crescent(pneumoperitoneum)','c'),('Duodenal obstruction – 신생아 double bubble(강의록 p.53)','c'),_PN,
 ('정답 – Large amount of ascites: paracolic gutter 음영 증가·장기 경계 소실·장 중심화(강의록 p.80·82 같은 사진)','c'),_EC],
('axr-cp',2022,'객13'):[('mechanical ileus – 늘어난 장·액면이 보여야 함','c'),('gallbladder stone – RUQ 간 밑 담낭 위치 석회화(10–15%만 보임)','c'),
 ('정답 – chronic pancreatitis: 췌장 위치의 동글동글한 석회화(수업 퀴즈 사진, 강의록 p.73–74·90)','c'),_PN,_EC],
('axr-pp',2022,'객14'):[('mechanical ileus – 늘어난 소장·step-ladder 없음','c'),_SV,_PPc,('small bowel obstruction – 소장만 늘어나고 액면(강의록 p.49)','c'),('splenomegaly – LUQ 큰 하얀 음영, 장 가스 아래로 밀림(강의록 p.88)','c')],
('axr-usps',2020,'객69'):[u(0,True),u(1),u(2),u(3),('음향증강 – 낭성 구조 뒤가 밝음. 화살표가 빗나가 이의제기로 당시 정답 인정','w')],
('axr-vcug',2020,'객70'):[('barium enema – 항문으로 바륨 주입해 대장 조영','w'),('IVP – 정맥 조영제로 콩팥·요관·방광 조영(배뇨 장면 아님)','w'),('methylcellulose SBS – 바륨+methylcellulose 경구, 소장 조영','w'),
 ('정답 – VCUG: 방광에 조영제를 넣고 배뇨하며 촬영(「VOIDING」), vesicoureteral reflux 진단','w'),('UGI 바륨 충만검사 – 위·십이지장 조영','w')],
('axr-pp',2020,'객71'):[_PI,_SV,_PPc,('small bowel obstruction – 늘어난 소장·step-ladder 없음','c'),_EC],
('axr-sbo',2020,'객72'):[('crescent sign – 복부에선 pneumoperitoneum의 횡격막 아래 초승달 공기','c'),('accordion sign – 대장 벽 비후(CT), 수업에 없음','k'),('coffee bean sign – sigmoid volvulus','c'),
 ('step-ladder pattern – erect에서 높이 다른 액면 여러 개(이 사진은 supine)','c'),('정답 – herring-bone: 늘어난 소장이 촘촘히 붙은 모양, supine에서 잘 보임(강의록 p.36·38)','c')],
('axr-mrcp',2020,'객73'):[('정상 아님 – 총담관 하부에서 조영이 끊김','w'),('정답 – CBD stone: 총담관이 이물질로 막혀 흐름이 끊김(강의록 「Imaging evaluation of biliary tract」)','w'),
 ('gallbladder 팽창 소견 아님','w'),('cholangiocarcinoma – 학습지·강의록에서 이 사진 진단 아님','w'),('pancreatic duct dilatation 소견 아님','w')],
('axr-3d',2020,'객74'):[('A는 MRCP가 아닌 위 입체 영상, B는 barium enema가 아님','w'),('A는 대장이 아니라 위, B는 ERCP가 아님','w'),('CT gastrography와 UGI series 짝이 아님(B는 내시경처럼 보이는 가상 영상)','w'),
 ('barium enema·CT colonography 짝 아님','w'),('정답 – A transparent rendering, B virtual endoscopy(강의록 CT of stomach, 조기 위암)','w')],
('axr-usrev',2019,'객47'):[u(0),u(1),u(2),u(3,True),u(4)],
('axr-usrd',2019,'객49'):[('도플러 효과 – 혈류 속도 측정 원리, 허상 아님','w'),u(0),u(1,True),u(3),u(4)],
('axr-usae',2019,'객50'):[u(0),u(1),u(2),u(3),u(4,True)],
('axr-3d',2017,'객50'):[('enteroclysis·methylcellulose SBS – 소장 조영술(양성 조영제)','w'),('barium enema·mucosal relief – 양성 조영제 검사, 일부가 매우 opaque','w'),
 ('정답 – (A) transparent rendering (B) virtual endoscopy: 음성 조영제·발포제 후 CT data 입체화','w'),('enteroclysis·UGI – 바륨 조영술','w'),('barium filling·double contrast – 양성 조영제 UGI 방법','w')],
('axr-usrev',2017,'객51'):[u(1),('후방허상(후방음영) – 강한 반사계면 뒤 저에코','w'),u(4),u(3,True)],
('axr-usint',2016,'객90'):[('복원 자리표시 – 반사는 계면 에코(진단초음파의 기본), 감쇠의 한 요소','w'),('복원 자리표시 – 굴절은 매질 따라 전파속도·방향 변화','w'),
 ('복원 자리표시 – 흡수는 음파에너지가 열로 바뀜','w'),('복원 자리표시 – 산란은 조직 질감 형성','w'),('학습지 정답 ⑤ – 그러나 음파는 뼈·공기를 잘 투과하지 못함(2015 객22 ⑤) → 채점 제외','w')],
('axr-ct',2015,'객20'):[('맞음 – 조영 CT는 보통 문맥기 영상으로 복부 장기를 봄','w'),('맞음 – 종괴 평가엔 동맥기·지연기가 도움','w'),('맞음 – 음성 경구 조영제로 공기·물','w'),
 ('맞음 – 위·대장은 3D(virtual endoscopy 등)가 도움','w'),('정답(틀린 설명) – CT urography로 요로계 검사 가능','w')],
('axr-chol',2015,'객21'):[_CH[0],ok(_CH[1]),_CH[2],_CH[3],_CH[4]],
('axr-usint',2015,'객22'):[('맞음 – 반사: 계면에서 발생, 초음파의 기본 에코','w'),('맞음 – 굴절: 매질 따라 전파 속도가 바뀌며 방향이 꺾임','w'),('맞음 – 흡수: 마찰로 음파에너지가 열로 바뀜','w'),
 ('정답(틀린 설명) – 조직의 질감을 형성하는 것은 산란(scattering)','w'),('맞음 – 음파가 투과하지 못하는 조직은 뼈와 공기','w')],
('axr-usps',2015,'객23'):[u(4),u(0,True),u(1),u(3),u(2)],
('axr-ugi',2015,'객24'):[('정답 – 이중조영검사: 바륨 + 공기(발포제)로 점막에 얇게 도포, 미세 점막변화','w'),('점막 이완검사 – 바륨을 조금 넣어 점막 주름을 봄','w'),('바륨 충만검사 – 바륨으로 가득 채움(이중조영처럼 공기 확장 아님)','w'),
 ('압박검사 – 압박해 바륨 두께를 조절','w'),('enteroclysis – 관을 소장까지 넣어 조영제 주입','w')],
('axr-mcsbs',2015,'객25'):[('UGI – 위·십이지장 조영','w'),('esophagography – 식도 조영','w'),('enteroclysis – 관을 소장까지 넣어 주입(경구 아님)','w'),('barium enema – 항문으로 대장 조영','w'),
 ('정답 – methylcellulose SBS: 바륨+methylcellulose 경구, SBS보다 빠르고 이중조영 효과','w')],
('axr-usliver',2014,'객51'):[('틀림 – 간 실질은 신장 피질과 같거나 더 높은 에코','k'),('틀림 – 간문맥은 벽 에코가 있음(2012 객40 해설)','w'),('간문맥 에코와 호흡 – 학습지·수업에 근거 없음','k'),('신장 피질이 수질(신추체)보다 에코 높음 – 일반 지식상 옳음(학습지 정답 칸 비어 있음)','k')],
('axr-usliver',2012,'객40'):[('틀림 – 간 실질 에코는 신장 피질과 같거나 높음','k'),('틀림 – 비장 에코는 신장 피질보다 높음','k'),('정답 – 간문맥은 벽에코가 있어 하얀 띠, 간정맥은 없음(학습지 해설)','w'),
 ('일반 지식상 피질이 수질보다 에코 높음 – 학습지 정답은 ③만(확인 필요)','k'),('틀림 – 비장을 찾는 기준 구조물이 신정맥은 아님','k')],
('axr-usrd',2012,'객62'):[('도플러 효과 – 허상 아님','w'),u(0),('여운허상 – 학습지 해설 「여운허상」, 2019 같은 문제 정답 ③','w'),u(3),('음향증강 – 학습지 정답 칸 ⑤(해설과 엇갈림)','w')],
('axr-be',2012,'객63'):[('바륨충만검사 아님 – 공기로 확장된 이중조영 사진','w'),('압박검사 아님','w'),('점막이완검사 아님','w'),('정답 – 함요성 병변이 관찰됨(황승배 교수님 강의록 42p)','w'),('융기성 병변 아님','w')],
('axr-chol',2012,'객65'):[_CH[0],_CH[1],ok(_CH[2]),_CH[3],_CH[4]],
('axr-usint',2011,'객16'):[('반사 – 계면 에코(진단초음파의 기본), 장기경계 선 형성','w'),('굴절 – 매질 따른 전파속도 차이','w'),('흡수 – 높은 주파수일수록 흡수가 빨라 투과력 감소','w'),
 ('정답 – 산란: 조직의 질감을 형성','w'),('투과 – 감쇠 요소가 아님','w')],
('axr-usae',2011,'객17'):[u(4,True),u(0),u(1),u(3),u(2)],
('axr-liverct',2011,'객18'):[('틀림 – 우엽·좌엽 기준은 Cantlie\'s line(middle hepatic v.) 또는 falciform lig.','w'),('틀림 – 좌엽 내·외측분절: 상부 Lt. hepatic v., 하부 fissure of lig. teres(반대로 적힘)','w'),
 ('틀림 – 우엽 앞뒤는 Rt. hepatic v.','w'),('정답 – 우엽 상하 구분은 우측 간문맥','w'),('틀림 – 좌엽 2·3분절은 Lt. portal v.','w')],
('axr-normgas',2011,'객20'):[('맞음 – air-fluid level은 erect에서(강의록 p.19)','c'),('정답(옳지 않음) – 정상인은 위·대장에서 주로 관찰(강의록 p.19). 학습지 정답 ⑤는 ansfix로 ②로 고침','c'),
 ('맞음 – 정상 소장 가스 길이 3–4 cm(강의록 p.23)','c'),('맞음 – 소장 중심부, 대장 변연부(강의록 p.22)','c'),('맞음 – 신생아는 6개월까지 가스 많은 게 정상(강의록 p.26, STT 12:25) – 학습지 정답 ⑤였음','c')],
('axr-usanat',2011,'객21'):[('대동맥 – 학습지상 연결 맞음','w'),('하대정맥 – 학습지상 연결 맞음','w'),('췌장 – 학습지상 연결 맞음','w'),('정답(틀린 연결) – ④가 가리키는 구조물은 간문맥이 아님(학습지 정답)','w'),('상장간동맥 – 학습지상 연결 맞음','w')],
('axr-mru',2011,'객22'):[('정답 – MR 요로조영술: 조영제 없이 소변이 하얗고 배경이 검음','w'),('IVP는 X선 – 뼈·장 가스가 함께 보여야 함','w'),('VCUG는 배뇨 중 방광·요도 조영','w'),
 ('학습지 정답 아님 – 사진 해석상 좌측 확장으로 단정 못 함','w'),('학습지 정답 아님 – 화살표는 요관 하부(UPJ 아님)','w')],
('axr-usps',2009,'객23'):[('정답 – 석회화 종괴: 강한 반사계면 → 후방음영','w'),('지방성분 종괴 – 고에코지만 후방음영은 대개 없음','k'),('낭종성 종괴 – 후방음향증강','w'),('출혈 종괴 – 후방음영 아님','k'),('괴사 종괴 – 낭성 변화면 오히려 증강','k')],
}
