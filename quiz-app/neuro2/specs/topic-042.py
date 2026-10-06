"""10/6 1교시 척추(척수)의 구조 (은종필) — 강의록(53쪽) · STT 1교시 · 학습지 452–464쪽.
시간표에는 '윤종필'로 적혀 있으나 강의록·STT 파일명과 학습지가 모두 은종필 교수님이라 은종필로 표기.
옛 기출(2016–2020)은 오영민 교수님이 같은 강의를 하던 해의 문제라 출제 교수를 따로 적음.
문제에 들어간 Rexed lamina 그림·Brown-Séquard 그림은 학습지 원본을 잘라 넣음(묘사 대신 원본)."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-042',prof='은종필',date='10/6',title='척추(척수)의 구조',period='1교시')
EJP='은종필'; OYM='오영민'; KEJ='고은정'; KSJ='김선준'
def V(t,*f): return vis(t,*f)

SURF='강의록 3–6쪽: 척수막 — 경막(뇌경막의 연속, 대후두공~제2천추, 말단사를 싸고 미골인대로 이행)·지주막(지주막하 공간 CSF, S2까지)·연막(치상인대 dentate ligament 형성 — 척수 고정, 척수신경로절단술의 지표). 척수신경 31쌍(경 8, 흉 12, 요 5, 천 5, 미 1); 경·요팽대에서 신경총. 척수원추(conus medullaris) — 태생 3개월까지 척추관 끝, 출생 시 L3, 성인 T12–L1; 그 아래 마미(cauda equina). STT 03:54: 원추가 못 올라가면 tethered cord syndrome → 잘라 줌.'
VASC='강의록 10–14쪽: 전척수동맥 1개(양측 추골동맥 분지가 합쳐짐, 척수 앞 2/3–3/4 공급), 후척수동맥 2개(뒤 1/3–1/4), 근동맥(radicular a. — 중부흉수 T4–8은 2–3개뿐이라 허혈 잘 생김; 흉요추부의 큰 Adamkiewicz a.는 수술 시 손상 주의), 수질동맥(medullary a.).'
LAM='강의록 18–20쪽: 회색질은 Rexed lamination I–X층. Rexed lamina II = 아교질(substantia gelatinosa) — 통증 문조절설(gate control theory)의 문(gate). Substantia gelatinosa group(Golgi type II — pain·temperature·touch), nucleus proprius(position·vibration·proprioception·2점 식별), nucleus dorsalis(Clarke column, C8–L3, proprioception). STT 07:49: "여기서 제일 중요한 건 lamina II".'
ASC='강의록 23–28쪽 상행로: posterior white column(F. gracilis·cuneatus[T6부터] → internal arcuate fiber로 연수에서 교차 → medial lemniscus → VPLc; touch localization·2점 식별·pressure·위치·진동); anterior spinothalamic tract(light touch, VPLc); lateral spinothalamic tract(somatotopic, anterior spinocerebellar tract의 내측, Aδ·C fiber, Lissauer tract, substantia gelatinosa — substance P, VPLc, pain & temperature, 그 레벨에서 교차); spinocerebellar tract(의식과 관계없이 근긴장·협조).'
DESC='강의록 29–39쪽 하행로: corticospinal(=pyramidal) tract가 가장 크고 중요(연수 추체교차 90% → lateral CST). Tectospinal — 상구(superior colliculus) 깊은층에서 시작, dorsal tegmental decussation, C4까지만, 시각·청각 자극에 대한 반사적 자세 운동(STT: 권투선수가 주먹 피함, 누가 부르면 돌아봄). Rubrospinal — ventral tegmental decussation, CST 앞(extrapyramidal 일부), 대뇌피질·소뇌 입력, 반대쪽 굴곡근 긴장 조절, decorticate rigidity와 관계. Vestibulospinal — 주로 lateral vestibular nucleus, 동측, 신전근 긴장 조절, decerebrate. Reticulospinal — 근긴장·반사·혈압, 잠잘 때(무의식) 호흡 — 손상 시 Ondine\'s curse(수면 중 호흡부전).'
DERM='강의록 40–41쪽: 피부절 — T4 유두, T10 배꼽, L1 치골; 서로 겹쳐 신경근 하나만 손상되면 증상이 잘 안 나타날 수 있음.'
KEY='강의록 51쪽·STT 23:46 key muscle: C5 elbow flexor, C6 wrist extensor, C7 elbow extensor, C8 finger flexor(가운뎃손가락 원위지), T1 finger abductor(새끼손가락 외전); L2 hip flexor, L3 knee extensor, L4 ankle dorsiflexor, L5 long toe extensor, S1 ankle plantar flexor.'
BS='Brown-Séquard(척수 반측 손상): 동측 — 운동마비(corticospinal), 위치·진동·촉각 식별 소실(posterior column); 반대측 — 통각·온도 소실(lateral spinothalamic, 그 레벨에서 교차). '+ASC
OUT='오늘(10/6) 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',EJP); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',EJP); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

TECTO_ST='다음은 tract에 대한 설명이다. 이 tract의 이름은?'
TECTO_BOX='\n- Superior colliculus의 deep layer에서 시작한다.\n- Midbrain의 dorsal tegmentum에서 decussation한다.\n- Visual 또는 auditory stimulation에 대한 반응으로 reflex postural movement에 관여한다.'
LST_BOX='\n- Medial to anterior spinocerebellar tract\n- pain, temperature\n- VPLc'
RUB_BOX='\n- Midbrain의 red nucleus에서 시작한다.\n- Ventral tegmental decussation한다.\n- Anterior to corticospinal tract\n- Contralateral flexor의 tone을 조절한다.\n- Decorticate rigidity와 관계있다.'
GATE_ST='Spinal cord의 회색질은 기능에 따라 다음과 같이 Rexed lamination I층부터 X층까지 나뉜다. 이 중 통증 기전 중 gate control theory의 gate에 해당하는 구조물은 무엇인지 쓰시오.'
BS_ST='다음은 우측 10번째 흉추 부위의 spinal cord에 병변이 있는 Brown-Sequard syndrome 환자를 나타낸 그림이다. 그림에서와 같이 환자는 우측 하지의 tactile sense와 vibratory and proprioceptive sensation의 소실을 호소하는데 이러한 증상은 어떠한 spinal tract의 손상으로 인한 것인지 고르시오.'
BS_CH=['Lateral spinothalamic tract','Anterior spinocerebellar tract','Lateral corticospinal tract','Posterior white column','Anterior spinothalamic tract']
BS_E=['반대측 통각·온도.','소뇌.','동측 운동.','정답 — 동측 위치·진동·촉각 식별.','light touch.']
C7_CH=['Elbow flexors','Wrist extensors','Finger flexers','Elbow extensors','Finger abductors']
C7_E=['C5.','C6.','C8.','정답 — C7.','T1.']
CONUS_CV='주어진 답(L1, 생후 3개월) 유지. 오늘 강의록 6쪽은 "태생 3개월까지 척추관 끝, 출생 시 L3, 성인 T12–L1"로 적혀 있어 시기 표현이 다름 — 복원자도 시기 근거를 못 찾았다고 적음.'

YAMA=[
Y(W('2025 객68','453'),'T1이 담당하는 key muscle은?',['finger flexor','finger abductor','elbow flexor','wrist extensor','elbow extensor'],2,
 basis='복원자: 자주 나오는 문항, 다른 key muscle도 외울 것. '+KEY,exps=['C8.','정답 — T1.','C5.','C6.','C7.']),
Y(W('2023 객47','453'),'다음은 spinal tract에 대한 설명이다. 이 tract의 이름은 무엇인지 쓰시오.\n- superior colliculus의 deep layer에서 시작한다.\n- Midbrain dorsal tegmentum decussation한다.\n- Visual 또는 auditory stimuli에 대한 반응으로 reflex postural movement에 관여한다.',
 ['Rubrospinal tract','Spinotectal tract','Spinothalamic tract','Tectospinal tract','Spinocerebellar tract'],4,
 basis='복원자: 시각·청각 자극에 머리를 피하는 반사 — superior colliculus에서 시작해 C4에서 끝나 머리·눈·목에만 작용. '+DESC,exps=['적핵 — 굴곡근.','상행로.','통각·온도.','정답.','소뇌.']),
Y(W('2023 객48','453–454'),GATE_ST.replace(' 쓰시오',' 고르시오'),['Rexed lamina I','Rexed lamina II','Rexed lamina VII','Rexed lamina X','Rexed lamina VIII'],2,
 visual=V('그림 (학습지 454쪽 원문)','sp23_48.jpg'),basis=LAM,exps=['marginal zone.','정답 — 아교질.','중간대.','중심관 주위.','운동 중간뉴런.']),
Y(W('2022 객45','454'),TECTO_ST+TECTO_BOX,['Rubrospinal tract','spinotectal tract','spinothalamic tract','tectospinal tract','spinocerebellar tract'],4,
 basis='복원자: 14년 24번 야마. '+DESC,exps=['적핵.','상행로.','통각·온도.','정답.','소뇌.']),
Y(W('2022 객46','454–455'),'다음 중 통증기전 중 문조절설(Gate cotrol theory)의 gate에 해당하는 구조는?',['1','2','16','17','18'],2,
 visual=V('그림 (학습지 454쪽 원문)','sp22_46.jpg'),caveat='선지 숫자(1, 2, 16, 17, 18)는 학습지 원문 그대로 — 그림의 층 번호와 대응하지 않는 숫자가 섞여 있음.',
 basis='복원자: 18년도 야마이자 그해 교수님 티야. '+LAM,exps=['lamina I.','정답 — lamina II.','그림 외.','그림 외.','그림 외.']),
Y(W('2022 객51','455'),'C7이 담당하는 Key muscle은?',C7_CH,4,basis='복원자: 야마로 많이 나왔고 교수님도 중요하다고 강조. '+KEY,exps=C7_E),
Y(W('2021 객24','455'),'다음 설명에 해당하는 척수신경로는?'+LST_BOX,['Lateral spinothalamic tract','Posterior white column','Anterior spinothalamic tract','Posterior column','Anterior spinocerebellar tract'],1,
 basis='복원자: 킹킹야. '+ASC,exps=['정답.','위치·진동.','light touch.','위치·진동.','소뇌.']),
Y(W('2021 객38','455–456'),'다음은 tract에 대한 설명이다. 이 tract의 이름은?\n- midbrain의 red nucleus에서 시작한다\n- Ventral tegmental decussation 한다\n- Anterior to corticospinal tract\n- Contralateral flexor의 tone을 조절한다\n- Decorticate rigidity와 관계있다',
 ['rubrospinal tract','vestibulospinal tract','reticulospinal tract','tectospinal tract','ascending autonomic nerve'],1,
 basis='복원자: 17년도 주관식으로 나왔던 문제. '+DESC,exps=['정답.','신전근·decerebrate.','근긴장·호흡.','상구.','아님.']),
Y(W('2020 객7','456'),'다음 설명에 해당하는 척수신경로는?'+LST_BOX,['Lateral spinothalamic tract','Anterior spinothalamic tract','Anterior spinocerebellar tract','Rubrospinal tract','Tectospinal tract'],1,
 prof=OYM,basis=ASC,exps=['정답.','light touch.','소뇌.','하행.','하행.']),
Y(W('2020 객98','456'),BS_ST,BS_CH,4,prof=OYM,visual=V('그림 (학습지 456쪽 원문)','sp20_98.jpg'),basis='복원자: 강의록 27, 34쪽. '+BS,exps=BS_E),
Y(W('2019 객74','457'),'다음 설명중 틀린 것을 고르시오.',
 ['spinothalamic tract은 thalamus의 VPL을 지나며, pain과 temperature 감각에 관여한다.','Rubrospinal tract은 midbrain의 red nucleus에서 시작해서 contralateral flexor muscle groups을 조절하고 특히 decorticate rigidity와 관계가 있다.','Vestibulospinal tracts는 pons에서 시작되고 control of extensor muscle tone의 기능을 한다.','Posterior white column은 진동, 위치감각을 전달하고 spinal cord 내에서 decussation한다.'],4,
 basis='복원자: posterior white column은 medulla(internal arcuate fiber)에서 교차. '+ASC+' '+DESC,exps=['옳다.','옳다.','옳다(외측전정핵).','틀리다(정답) — 연수에서 교차.']),
Y(W('2018 객35','457'),'다음 설명 중 틀린 것을 고르시오.',
 ['Spinothalamic tract은 ~~','Lateral corticospinal tract은 ~~','Vestibulospinal tracts는 pons에서 시작되고 control of extensor muscle tone의 기능을 한다.','Posterior white column은 진동, 위치감각을 전달하고 spinal cord 내에서 decussation한다.'],4,
 prof=OYM,caveat='복원자가 ③④ 보기만 기억해 ①②는 내용이 복원되지 않음(원문 그대로 "~~").',basis='복원자: "표에서 내셨는데 3, 4번 보기만 기억". '+ASC,exps=['복원 안 됨.','복원 안 됨.','옳다.','틀리다(정답) — 연수에서 교차.']),
S(W('2018 주15','458'),'spinal cord의 회색질은 기능에 따라 다음과 같이 rexed lamination 1층부터 10까지 나뉜다. 이 중 통증기전 중 gate control theory의 gate에 해당하는 구조물은 무엇인가?',
 'Rexed lamina II — 아교질(substantia gelatinosa)',prof=OYM,visual=V('그림 (학습지 458쪽 원문)','sp18_s15.jpg'),basis=LAM),
S(W('2017 주20','458'),TECTO_ST+'\n1) Superior colliculus의 deep layer에서 시작한다.\n2) Midbrain의 dorsal tagmentum에 decussation한다.\n3) Visual 또는 auditory stimulation에 대한 반응으로 reflex postural movement에 관여한다.',
 'Tectospinal tract',prof=OYM,basis='복원자: 오영민 교수님 강의록 p39. '+DESC),
S(W('2017 주21','459'),'Tract의 이름은?'+RUB_BOX,'Rubrospinal tract',prof=OYM,basis=DESC),
Y(W('2016 객20','459–460'),BS_ST.replace('그림이다.','그림이다.'),BS_CH,4,prof=OYM,visual=V('그림 (학습지 459쪽 원문)','sp16_20.jpg'),
 basis='복원자: 그해 티야, Harrison 19th p.2652. '+BS,exps=BS_E),
S(W('2016 주17','460'),GATE_ST,'Rexed lamina II — 아교질(substantia gelatinosa)',prof=OYM,visual=V('그림 (학습지 460쪽 원문)','sp16_s17.jpg'),
 basis='복원자: 그림 주고 1–10 중 하나를 쓰는 문제. '+LAM),
Y(W('2015 객21','460'),'다음 설명 중 옳지 않은 것은?',
 ['Corticospinal tract은 motor cortex에서부터 특정 level의 spinal cord의 anterior gray horn까지 이어지는 통로이며 우리 몸의 운동조절을 담당한다.','Rubrospinal tract은 midbrain의 red nucleus에서 시작해서 contralateral flexor muscle groups을 조절하고 특히 decorticate rigidity와 관계가 있다.','Posterior white column은 우리 몸의 touch와 pressure에 관련한 감각의 주된 통로이다.','척수의 혈액공급은 vertebral artery에서 분지한 2개의 anterior spinal artery와 1개의 posterior spinal artery로 이루어진다.'],4,
 basis='복원자: ④는 "1개의 anterior spinal artery와 2개의 posterior spinal artery"로 고쳐야 함. '+VASC,exps=['옳다.','옳다.','옳다.','틀리다(정답) — 전 1개, 후 2개.']),
Y(W('2015 객22','461'),'다음은 tract에 대한 설명이다. 이 tract의 이름은?\n1) Medial to the anterior spinocerebellar tract\n2) Pain & Temperature\n3) VPLc',
 ['Lateral spinothalamic tract','Anterior spinothalamic tract','Posterior column','Cuneospinal tract'],1,basis='복원자: Pain & Temperature 나오면 lateral spinothalamic tract — 수업 중 중요하다고 언급. '+ASC,exps=['정답.','light touch.','위치·진동.','아님.']),
Y(W('2014 객23','461'),'다음에 해당하는 tract는?\n1. Medial to the anterior spinocerebellar tract\n2. Pain & Temperature\n3. VPLc',
 ['Lateral spinothalamic tract','Anterior spinothalamic tract','Anterior spinocerebellar tract','Rubrospinal tract','Cuneocerebellar tract'],1,basis=ASC,exps=['정답.','light touch.','소뇌.','하행.','소뇌.']),
Y(W('2014 객24','461'),TECTO_ST+'\n1) Superior colliculus의 deep layer에서 시작한다.\n2) Midbrain의 dorsal tagmentum에서 decussation한다.\n3) Visual 또는 auditory stimulation에 대한 반응으로 reflex postural movement에 관여한다.',
 ['Rubrospinal tract','Reticulospinal tract','Vestibulospinal tract','Tectospinal tract','Descending autonomic pathway'],4,basis=DESC,exps=['적핵.','근긴장·호흡.','신전근.','정답.','자율.']),
S(W('2013 주3','462'),'Conus medullaris가 정상 성인에서 몇 번째 요추 부위에 위치하고 있는지 쓰고, 정상 성인 레벨에 이르게 되는 시기를 쓰시오.',
 '정상 성인 위치: L1 / 시기: 생후 3개월',prof=KEJ,caveat=CONUS_CV,basis='복원자: 고은정 교수님이 thickened filum terminale 설명 중 질문한 내용. '+SURF),
S(W('2012 주36','462'),'Conus medullaris의 정상 성인에서 몇 번째 요추 부위에 위치하고 있는지 쓰고, 언제 정상 성인 레벨에 이르게 되는 시기를 쓰시오.',
 '정상 성인 위치: L1 / 시기: 생후 3개월(선배 표기 답안)',prof=KSJ,caveat=CONUS_CV,basis='복원자: 신생아 L2(–L3), 성인 L1. '+SURF),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR('2025 객68 변형','C6가 담당하는 key muscle은?',['wrist extensor','elbow flexor','elbow extensor','finger flexor','finger abductor'],1,KEY,['정답.','C5.','C7.','C8.','T1.']),
VR('2023 객47 변형','Tectospinal tract에 대한 설명으로 옳지 않은 것은?',['superior colliculus 깊은층에서 시작','dorsal tegmental decussation','C4까지만 존재','시각·청각 자극에 대한 반사적 자세 운동','반대쪽 굴곡근 긴장 조절 — decorticate rigidity'],5,DESC,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — rubrospinal.']),
VR('2023 객48 변형','Rexed lamina II(substantia gelatinosa)에 대한 설명으로 옳은 것은?',['통증 문조절설의 gate에 해당','position·vibration을 전달하는 nucleus proprius','C8–L3의 Clarke column','전각 운동신경원','중심관 주위 회색질'],1,LAM,['정답.','다른 핵.','nucleus dorsalis.','lamina IX.','lamina X.']),
VR('2022 객51 변형','C8이 담당하는 key muscle은?',['finger flexor(가운뎃손가락 원위지)','elbow extensor','wrist extensor','finger abductor','elbow flexor'],1,KEY,['정답.','C7.','C6.','T1.','C5.']),
VR('2021 객24 변형','Lateral spinothalamic tract에 대한 설명으로 옳지 않은 것은?',['pain & temperature','VPLc를 거침','substantia gelatinosa — substance P','Aδ·C fiber','연수의 internal arcuate fiber에서 교차'],5,ASC,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 그 레벨에서 교차(연수 교차는 후주).']),
VR('2021 객38 변형','Vestibulospinal tract에 대한 설명으로 옳은 것은?',['주로 lateral vestibular nucleus에서 시작, 동측, 신전근 긴장 조절 — decerebrate','red nucleus에서 시작','superior colliculus에서 시작','반대쪽 굴곡근 조절','pain 전달'],1,DESC,['정답.','rubrospinal.','tectospinal.','rubrospinal.','상행로.']),
VR('2020 객98 변형','우측 T10 Brown-Séquard 증후군 환자에서 좌측 하지의 통각·온도 소실을 일으키는 tract는?',['Lateral spinothalamic tract','Posterior white column','Lateral corticospinal tract','Anterior spinocerebellar tract','Tectospinal tract'],1,BS,['정답.','동측.','동측 운동.','소뇌.','하행.']),
VR('2019 객74 변형','척수신경로의 교차 위치 연결로 옳지 않은 것은?',['posterior white column — 연수','lateral spinothalamic tract — 들어온 척수 레벨','lateral corticospinal tract — 연수 추체','tectospinal tract — dorsal tegmental decussation','vestibulospinal tract — 연수에서 교차'],5,ASC+' '+DESC,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 동측(교차 없음).']),
VR('2015 객21 변형','척수의 혈액공급에 대한 설명으로 옳지 않은 것은?',['전척수동맥 1개가 척수 앞 2/3–3/4 공급','후척수동맥 2개가 뒤 1/3–1/4 공급','중부흉수(T4–8)는 근동맥이 적어 허혈에 취약','Adamkiewicz artery는 흉요추부의 큰 전근동맥','후척수동맥은 1개, 전척수동맥은 2개이다'],5,VASC,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
VR('2013 주3 변형','척수원추(conus medullaris)의 위치로 오늘 강의록에 제시된 것은?',['태생 3개월까지 척추관 끝, 출생 시 L3, 성인 T12–L1','출생 시 S2, 성인 L5','평생 L3','성인 C7','출생 시 T10'],1,SURF,['정답.','아니다.','아니다.','아니다.','아니다.']),
]
P=EJP; S1='STT 10/6 1교시'
TY=[
T(P,S1+' 01:51','치상인대(dentate ligament)가 없다면 생길 문제로 교수님이 설명한 것은?',['척수가 척추관 안에서 흔들려 외상에 취약해진다','CSF가 생성되지 않는다','통증이 사라진다','교차가 일어나지 않는다','근력이 증가한다'],'STT 01:51–02:27. '+SURF,['정답.','아님.','아님.','아님.','아님.']),
T(P,S1+' 03:54','척수원추가 성장에 따라 올라가지 못하고 아래로 당겨져 신경학적 결손이 생기는 질환과 치료는?',['Tethered cord syndrome — 당기는 구조를 잘라 준다','Syringomyelia — 단락술','Chiari 기형 — 감압술','척수공동증 — 스테로이드','Cauda equina syndrome — 관찰'],'STT 03:54. '+SURF,['정답.','아님.','아님.','아님.','아님.']),
T(P,S1+' 04:39','수술 시야 확보를 위해 흉부(thoracic) 신경근 1–2개를 잘라도 문제가 적은 이유로 교수님이 설명한 것은?',['흉부 신경근은 신경총 없이 단일로 나가고 중요한 운동 기능이 거의 없어서','흉부 신경근은 재생되어서','흉부에는 신경근이 없어서','감각 신경이 없어서','경수에서 대신해서'],'STT 02:27·04:39.',['정답.','아님.','아님.','아님.','아님.']),
T(P,S1+' 05:21','Adamkiewicz artery 손상이 문제가 되는 이유로 교수님이 강조한 것은?',['요추부 척수에 중요한 혈류를 공급해 손상 시 바로 하지마비(paraplegia)가 올 수 있다','뇌로 가는 혈류라서','두통을 일으켜서','상지만 마비되어서','출혈이 많아서'],'STT 05:21. '+VASC,['정답.','아님.','아님.','아님.','아님.']),
T(P,S1+' 07:49','척수 회색질에서 교수님이 "여기서 제일 중요한 것"이라고 한 구조는?',['Rexed lamina II — 통증 gate control의 gate','Lamina IX — 운동신경원','Lamina X','Clarke column','Nucleus proprius'],'STT 07:49. '+LAM,['정답.','아님.','아님.','아님.','아님.']),
T(P,S1+' 09:23','후주(dorsal column) 손상 환자의 증상으로 교수님이 예를 든 것은?',['어느 손가락을 만졌는지 모르고, 위치·진동 감각이 없다','통증을 못 느낀다','온도를 못 느낀다','팔을 못 움직인다','호흡을 못 한다'],'STT 09:23. '+ASC,['정답.','STT.','STT.','CST.','reticulospinal.']),
T(P,S1+' 15:34','Rubrospinal tract과 vestibulospinal tract 손상 시 자세를 교수님이 어떻게 설명했나?',['rubrospinal — decorticate(굴곡), vestibulospinal — decerebrate(쭉 뻗는 신전)','둘 다 굴곡','둘 다 신전','rubrospinal — 신전','vestibulospinal — 굴곡'],'STT 14:44–17:11. '+DESC,['정답.','아님.','아님.','반대.','반대.']),
T(P,S1+' 15:34','교수님이 tectospinal tract의 기능을 설명하며 든 예는?',['권투선수가 날아오는 주먹을 반사적으로 피함 — 시각·청각 자극에 머리를 돌리는 반사','걷기','숨쉬기','글씨 쓰기','배뇨'],'STT 15:34·17:55. 학습지 462쪽 해설에도 같은 예. '+DESC,['정답.','아님.','reticulospinal.','CST.','아님.']),
T(P,S1+' 20:11','Ondine\'s curse에 대해 교수님이 설명한 것은?',['reticulospinal tract 손상(또는 C3–5 경수 손상)으로 잠잘 때 무의식 호흡이 안 돼 자다가 사망','깨어 있을 때만 호흡이 안 됨','통증 소실','하지 마비','의식 소실'],'STT 18:50–21:06 · 강의록 38쪽.',['정답.','반대.','아님.','아님.','아님.']),
T(P,S1+' 23:46','교수님이 key muscle에서 C7을 외우는 방법으로 든 것은?',['C7은 elbow extensor — 팔꿈치를 펴는 모양이 7자','C7은 wrist extensor','C7은 finger abductor','C7은 hip flexor','C7은 elbow flexor'],'STT 23:46. '+KEY,['정답.','C6.','T1.','L2.','C5.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 5쪽','척수신경의 수로 옳은 것은?',['31쌍(경 8, 흉 12, 요 5, 천 5, 미 1)','33쌍','30쌍','12쌍','31쌍(경 7, 흉 12, 요 5, 천 5, 미 2)'],1,SURF,['정답.','척추뼈 수.','아님.','뇌신경.','경수 신경은 8쌍.']),
Q('강의록 3–4쪽','척수경막과 지주막하 공간이 끝나는 높이는?',['제2천추','제1요추','제3요추','미골 끝','제12흉추'],1,SURF,['정답.','원추.','신생아 원추.','미골인대.','아님.']),
Q('강의록 11쪽','전척수동맥이 공급하는 척수 범위는?',['앞쪽 2/3–3/4','뒤쪽 1/3','회색질만','백색질만','척수 전체'],1,VASC,['정답.','후척수동맥.','아님.','아님.','아님.']),
Q('강의록 13쪽','근동맥 폐쇄 시 척수 허혈이 가장 잘 일어나는 부위는?',['중부흉수(T4–8)','경수','요수','천수','원추'],1,VASC,['정답 — 근동맥 2–3개뿐.','아님.','Adamkiewicz.','아님.','아님.']),
Q('강의록 17쪽','백색질 섬유단 중 주로 감각 기능을 담당하는 것은?',['뒤 섬유단(posterior funiculus)','앞 섬유단','외측 섬유단','회색질','중심관'],1,'강의록 17쪽: 앞·외측 섬유단은 주로 운동, 뒤 섬유단은 감각.',['정답.','운동.','운동(주로).','아님.','아님.']),
Q('강의록 19–20쪽','Clarke column(nucleus dorsalis)이 존재하는 척수 레벨은?',['C8–L3','C1–C4','T1–T6','L4–S5','전 척수'],1,LAM,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 25쪽','Spinocerebellar tract의 기능으로 옳은 것은?',['의식과 관계없이 근긴장 조절과 운동의 협조','통각 전달','온도 전달','수의 운동','호흡'],1,ASC,['정답.','STT.','STT.','CST.','reticulospinal.']),
Q('강의록 26쪽','Fasciculus cuneatus가 나타나는 레벨은?',['T6부터','L1부터','C1까지만','S1부터','전 척수'],1,ASC,['정답.','gracilis는 전 레벨.','아님.','아님.','아님.']),
Q('강의록 35쪽','Tectospinal tract이 존재하는 레벨로 강의록에 제시된 것은?',['C4까지만','T12까지','L1까지','전 척수','천수까지'],1,DESC,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 41쪽','피부절 표지 연결로 옳지 않은 것은?',['T4 — 유두','T10 — 배꼽','L1 — 치골','C6 — 엄지','T10 — 유두'],5,DERM,['옳다.','옳다.','옳다.','옳다(일반 지식).','틀리다(정답) — T4.']),
]
