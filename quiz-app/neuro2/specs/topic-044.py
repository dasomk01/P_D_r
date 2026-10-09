"""10/6 4교시 파킨슨병의 수술적 치료(Surgical treatment for movement disorder) (고은정) — 강의록(32쪽) · STT 4교시 · 학습지 369–379쪽.
Somed에 이 교시의 학습지 범위가 331–342쪽(CNS 기형 수술)으로 연결되어 있으나 오늘 강의 내용과 달라, 강의와 같은 단원인 369–379쪽(이상운동질환 수술)을 씀.
최하영·서만욱 교수님 시절의 '파킨슨병에 대한 설명 중 옳은 것'(도파민·임상양상·1차 치료) 문항은 오늘 강의에서 다루지 않아 [수업범위 외](이상운동질환 단원 topic-031에서 다룸).
DBS가 완화하는 증상 목록·병태기전 서술 문항도 오늘 강의록·STT에 없어 [수업범위 외]."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-044',prof='고은정',date='10/6',title='파킨슨병의 수술적 치료',period='4교시')
KEJ='고은정'; CHY='최하영'; SMW='서만욱'

TGT='강의록 10쪽 TARGETs: Tremor — Vim, Vop, PSA; Rigidity — Voa, GPi; Tremor and rigidity — STN. STT 27:44: "트레머 때는 VIM, 리지디티 때는 GPI, 트레머와 리지디티를 함께 잡는 건 STN — 이 3개만 알면 된다." 본태성 진전(essential tremor)은 Vim(또는 PSA).'
CIRC='강의록 7쪽: Circuit I(rigidity) Putamen–GPi–Thalamus(Voa)–Cortex(area 6); Circuit II(tremor) Cerebellum(dentate)–Red nucleus–Thalamus(Vim, Vop)–Cortex(area 4). 직접·간접 경로 모두 GPi가 출력 — GPi가 thalamus를 과도하게 억제. STT 19:56–21:56.'
DBS=('강의록 2–6쪽·STT: stereotactic(3차원 좌표 + Leksell frame) functional neurosurgery — 과기능 회로는 교란·억제, 저기능 회로는 자극. 수술 — thalamotomy·pallidotomy(RF로 지져 응고 → 한시적), deep brain stimulation(전극을 넣어 자극, 파괴성 병변 없음 — 문제 생기면 빼면 되어 더 안전, 강도·범위 조절 가능, 양측 삽입 가능), cell transplantation(태아 뇌세포·배양 세포 → 오래 못 감), MRgFUS, 감마나이프. '
 '기본은 국소마취로 깨워서(awake) 증상 호전을 확인하며 삽입; 협조가 안 되면 근이완제 없이 프로포폴로 재움(STT 06:48, 34:09). 배터리는 STN이면 5–6년, GPi·thalamus는 2–4년마다 교체(재충전형은 약 8년) — 반영구적이지 않음(STT 39:57). 전자레인지·전기장판 주의. Macrostimulation(probe) vs microstimulation(microelectrode로 각 핵 특유 파형 기록).')
IND='강의록 5쪽 적응증: movement disorder(PD, ET, dystonia), spasticity(ballismus·hemiballismus·spastic CP·torticollis), pain, psychiatric disease(OCD, Tourette — STT 16:20), epilepsy.'
OUT='오늘(10/6) 강의록·STT에 없는 내용(파킨슨병의 병태·임상양상·약물치료는 이상운동질환 강의 topic-031)'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',KEJ); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',KEJ); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

TG5=['Vim','GPi','GPe','STN','NAc']
PD_ST='다음 중 파킨슨 병에 대한 설명 중 옳은 것은?'
PD5=['중간뇌 흑질의 세로토닌 부족으로 인해 발생한다','진전, 경직, 운동 완서가 특징이다','Intention tremor가 특징이다','보행 시 처음에는 이상이 있으나 갈수록 호전되는 양상을 보인다','수술적 처치가 파킨슨 병의 일차적 치료이다']
PD5E=['도파민.','정답.','resting tremor.','점점 악화·자세반사 소실.','약물이 1차.']
PD4=['중간뇌 흑질의 세로토닌 부족으로 인해 발생한다.','Intention tremor가 특징이다','운동완만, 진전, 근경직을 특징으로 한다.','Dopamine이 acetylcholine보다 높아서 발생한다.']
PD4E=['도파민.','resting.','정답.','ACh 상대적 과다.']
DBS_ST='파킨슨 치료로서 Deep brain stimulation에 대한 설명 중 틀린 것은?'
DBS5=['파괴성 병변을 만들지 않는다.','세기를 조정함으로써 최대 효과와 최소 부작용 효과를 만들 수 있다.','기계 장치를 삽입해서 반영구적인 효과를 얻을 수 있다.','양쪽 뇌에 동시에 심을 수 있다.','Gpi, Vim을 타겟으로 한다.']
DBS5E=['옳다.','옳다.','틀리다(정답) — 배터리·기계 교체 필요.','옳다.','옳다.']
NT_ST='다음 중 파킨슨 병 치료 시 DBS와 lesioning의 target이 아닌 것은?'
NTa=['Subthalamic nucleus','Head of caudate nucleus','Ventral intermediate of thalamus','Globus pallidus interna','Pedunculopontine nucleus']
NTaE=['타깃.','정답.','타깃.','타깃.','타깃(교과서).']
SX_ST='DBS를 통해 완화될 수 있는 증상을 모두 고르시오.\n① Tremor ② Dyskinesia ③ Rigidity ④ Bradykinesia ⑤ Freezing ⑥ Medication dosage ⑦ Wearing off'
SX_A='①②③④⑤⑥⑦ 모두 — DBS expected outcomes: tremor, dyskinesia/dystonia, rigidity, bradykinesia, gait shuffling, medication reductions, less wearing off'

YAMA=[
S('2026.10.6 파킨슨병의 수술적 치료 4교시 강의록 32쪽 QUIZ','파킨슨 병 증상 중 RIGIDITY를 주로 조절하기 위한 TARGET은 어디인가요?','GPi(globus pallidus interna) — 시상 Voa도 rigidity 타깃',
 basis='강의록 32쪽 QUIZ · STT 27:44. '+TGT),
Y(W('2025 객16','370'),'파킨슨병 환자의 주된 증상이 tremor와 rigidity일 때 가장 보편적인 뇌심부자극술의 타겟을 고르시오.',['VIM','GPi','GPe','PSA','STN'],5,
 basis='복원자: tremor — VIM·Vop·PSA, rigidity — Voa·GPi, tremor & rigidity — STN; 교수님이 시간당 티야 1–2문제를 찍어 주고 거기서 냄. '+TGT,exps=['tremor.','rigidity.','아님.','tremor.','정답.']),
Y(W('2023 객5','370'),'파킨슨병 환자의 주된 증상이 강직일 때 가장 보편적인 뇌심부자극술의 타겟을 고르시오.',TG5,2,
 basis='복원자: 강의록 p.10, 교수님이 중요하다고 짚은 티야. '+TGT,exps=['tremor.','정답.','아님.','tremor+rigidity.','강박·치매 연구 타깃.']),
Y(W('2023 객6','370'),'본태성 진전 환자의 증상 조절을 위해 가장 적절한 뇌심부자극술의 타겟을 고르시오.',TG5,1,
 basis='복원자: 수업시간에 매우 강조. '+TGT,exps=['정답.','rigidity.','아님.','PD tremor+rigidity.','아님.']),
Y(W('2022 객23','370'),DBS_ST,DBS5,3,prof=CHY,
 basis='복원자: 그동안 빈출 — DBS는 파괴성 병변 없음, 세기 조정, 양쪽 가능, GPi·Vim·STN 타깃. '+DBS,exps=DBS5E),
Y(W('2022 객24','371'),PD_ST,PD5,2,prof=CHY,scope=True,basis='복원자. '+OUT,exps=PD5E),
Y(W('2021 객23','371'),PD_ST,PD5,2,prof=CHY,scope=True,basis='복원자. '+OUT,exps=PD5E),
Y(W('2020 객69','371'),'파킨슨 치료로서 deep brain stimulation에 대한 설명 중 틀린 것은?',['파괴성 병변을 만들지 않는다.','세기를 조정함으로써 최대 효과와 최소 부작용 효과를 만들 수 있다.','lead 삽입 시 전신마취가 필요하다.','양쪽 뇌에 동시에 심을 수 있다.','GPi와 Vim을 타겟으로 한다.'],3,prof=CHY,
 basis='복원자: 국소마취로도 가능. '+DBS,exps=['옳다.','옳다.','틀리다(정답) — 기본은 국소마취 awake.','옳다.','옳다.']),
Y(W('2020 객79','372'),PD_ST,['중간뇌 흑질의 도파민의 부족으로 인해 발생한다.','진전, 근이완, 운동완만을 특징으로 한다.','Intention tremor가 특징이다.','보행 시 처음에는 이상이 있으나 갈수록 호전되는 양상을 보인다.','수술적 처치가 파킨슨 병의 일차적 치료이다.'],1,
 prof=CHY,scope=True,basis='20 학습부: 답 선지만 다르고 내용 동일. '+OUT,exps=['정답.','강직.','resting.','악화.','약물.']),
Y(W('2020 객70','372'),'다음 중 파킨슨병 환자에 대한 설명으로 옳은 것은?',['파킨슨병은 중간뇌 흑색질의 치밀대에서 도파민을 분비하는 세포의 변성과 소실에 의해 일어난다.','증상으로는 진전, 반사항진, 운동완만이 있다.','intention tremor가 특징이다.','보행 시 출발하는 데에는 어려움이 있지만 걷기 시작한 이후에는 몸을 가눌 수 있고 이동하다가 정지도 가능하다.','처음부터 수술적 치료를 고려해야한다.'],1,
 prof=SMW,scope=True,caveat='학습지에 이 문항의 연도 표기가 없음(앞뒤 문항 기준 2020으로 표기).',basis='복원자. '+OUT,exps=['정답.','반사 저하.','resting.','가속보행.','약물이 기본.']),
Y(W('2019 객62','372–373'),PD_ST,['중간뇌 흑질의 세로토닌의 부족으로 인해 발생한다.','진전, 근경직, 운동완만을 특징으로 한다.','Intention tremor가 특징이다.','보행 시 처음에는 이상이 있으나 갈수록 호전되는 양상을 보인다.','수술적 처치가 파킨슨 병의 일차적 치료이다.'],2,
 prof=CHY,scope=True,basis='복원자. '+OUT,exps=PD5E),
Y(W('2019 객63','373'),'파킨슨 치료로서 deep brain stimulation 에 대한 설명 중 틀린 것?',['파괴성 병변을 만들지 않는다','세기를 조정함으로써 최대 효과와 최소 부작용 효과를 만들 수 있다','기계 장치를 삽입해서 반영구적 효과를 얻을 수 있다','양쪽 뇌에 동시에 심을 수 있다','Gpi Vim 을 타겟으로 한다'],3,prof=CHY,
 basis='복원자: 기계장치를 3–5년마다 갈아주어야 함. '+DBS,exps=DBS5E),
Y(W('2018 객48','373'),PD_ST,['중간뇌 흑질의 세로토닌의 부족으로 인해 발생한다.','진전, 근경직, 운동완만을 특징으로 한다.','Intention tremor가 특징이다.','보행 시 처음에는 이상이 있으나 갈수록 호전되는 양상을 보인다.','수술적 처치가 파킨슨 병의 일차적 치료이다.'],2,
 prof=SMW,scope=True,basis='복원자. '+OUT,exps=PD5E),
Y(W('2018 객49','374'),'파킨슨 치료로서 Deep Brain Stimulation 에 대한 설명 중 틀린 것?',['파괴성 병변을 만들지 않는다.','세기를 조절함으로서 최대 효과와 최소 부작용 효과를 만들 수 있다.','기계장치를 삽입해서 반영구적 효과를 얻을 수 있다.','양쪽 뇌 에 동시에 심을 수 있다.','Gpi, Vim 을 타켓으로 한다.'],3,
 prof=SMW,basis='복원자: 교과서 — 기계장치 3–5년마다 교체. '+DBS,exps=DBS5E),
Y(W('2017 객45','374'),PD_ST,['중간뇌 흑질의 세로토닌의 부족으로 인해 발생한다.','진전, 근경직, 운동완만을 특징으로 한다.','Intention tremor가 특징이다.','보행 시 처음에는 이상이 있으나 갈수록 호전되는 양상을 보인다.','수술적 처치가 파킨슨 병의 일차적 치료이다.'],2,
 prof=SMW,scope=True,basis='복원자. '+OUT,exps=PD5E),
Y(W('2017 객46','375'),NT_ST,NTa,2,prof=CHY,basis='복원자: 2013 강의록 P21 — STN, GPi, Vim; 교과서 PPN. '+TGT,exps=NTaE),
Y(W('2016 객37','375'),'파킨슨병에 대한 설명 중 옳은 것은?',PD4,3,prof=SMW,scope=True,basis='복원자. '+OUT,exps=PD4E),
Y(W('2016 객38','375'),'다음 중 파킨슨병 치료 시 DBS와 lesioning의 target이 아닌 것은?',['Subthalamic nucleus','Ventral intermediate of thalamus','Head of caudate nucleus','Globus pallidus interna','Pedunculopontine nucleus'],3,prof=CHY,
 basis='복원자: 작년 문제 그대로. '+TGT,exps=['타깃.','타깃.','정답.','타깃.','타깃(교과서).']),
Y(W('2015 객46','376'),'파킨슨병에 대한 설명 중 옳은 것은?',['중간뇌 흑질의 세로토닌의 부족으로 인해 발생한다.','Intention tremor가 특징이다.','운동완만, 진전, 근경직을 특징으로 한다.','Dopamine이 acetylcholine보다 높아서 발생한다.'],3,prof=SMW,scope=True,
 caveat='⑤ 보기는 복원 안 됨(복원자: "쉬운 보기였는데 기억이 안 남").',basis='복원자. '+OUT,exps=PD4E),
Y(W('2015 객47','376'),NT_ST,NTa,2,prof=CHY,basis=TGT,exps=NTaE),
Y(W('2014 객49','376'),'파킨슨병에 대한 설명 중 옳은 것은?',['중간뇌 흑질의 세로토닌의 부족으로 인해 발생한다.','Intention tremor가 특징적이다.','운동완만, 진전, 근경직을 특징으로 한다.'],3,prof=SMW,scope=True,
 caveat='④·⑤ 보기는 복원 실패(학습지 원문: "복원x").',basis='복원자. '+OUT,exps=['도파민.','resting.','정답.']),
S(W('2014 객50','376'),'Deep Brain Stimulation에 대한 설명으로 맞는 것은? (보기 복원 실패)','(보기·정답 복원 실패) 복원자가 신경외과 교과서의 DBS(통증 — thalamic VP nucleus, 중수도주위/뇌실주위 회백질) 부분만 해설로 적어 둠.',
 prof=CHY,keep_excluded=True,basis='복원자: "문제만 복원하고 보기는 복원하지 못하였습니다." '+DBS),
S(W('2013 주9','377'),SX_ST,SX_A,prof=CHY,scope=True,basis='복원자. '+OUT),
S(W('2012 주49','377'),'파킨슨병의 Pathogenesis에 대하여 기술하시오.','흑질 도파민 감소로 아세틸콜린이 상대적으로 과다해져(도파민–아세틸콜린 균형 붕괴) 운동저하성 운동장애가 발생',
 prof=SMW,scope=True,basis='복원자: 2013 신경학 강의록 p.300. '+OUT),
S(W('2012 주50','377'),'파킨슨병의 주 증상인 resting tremor와 rigidity를 함께 해결할 수 있는 DBS의 target을 쓰시오.','Subthalamic nucleus, Globus pallidus internus, Vim thalamus (복원자 답)',
 prof=CHY,caveat='복원자는 세 곳을 모두 답으로 적었으나, 오늘 강의록 10쪽은 "Tremor and rigidity: STN"으로 정리 — 함께 잡는 타깃 하나를 쓰라면 STN.',basis=TGT),
S(W('2011 주3','377–378'),SX_ST,SX_A,prof=CHY,scope=True,basis='복원자: freezing은 freezing gait로 봄. '+OUT),
S(W('2011 주4','378'),'파킨슨병 증상 중 rigidity와 resting tremor를 함께 호전시키고자 하는 경우 DBS의 target은 어디인가?','STN (subthalamic nucleus)',prof=CHY,basis='복원자: 도파민 감소 → STN 활성 증가 → GPi 활성 증가 → thalamus 억제. '+TGT),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR('2026.10.6 파킨슨병의 수술적 치료 4교시 강의록 32쪽 QUIZ 변형','Rigidity 회로(Circuit I)에 해당하지 않는 구조는?',['Cerebellum dentate nucleus','Putamen','GPi','Thalamus Voa','Cortex area 6'],1,CIRC,['정답 — tremor 회로.','회로.','회로.','회로.','회로.']),
VR('2025 객16 변형','STN을 DBS 타깃으로 할 때의 장점으로 강의에서 설명한 것은?',['작은 핵이라 적은 자극으로 tremor와 rigidity를 함께 조절해 배터리가 오래(5–6년) 감','rigidity만 조절','tremor만 조절','배터리가 2년마다 필요','전신마취 필수'],1,TGT+' STT 39:57.',['정답.','GPi.','Vim.','GPi·thalamus.','아님.']),
VR('2023 객5 변형','파킨슨병 환자의 주증상이 진전일 때 시상(thalamus)의 DBS 타깃은?',['Vim','GPi','STN','NAc','Voa'],1,TGT,['정답.','rigidity.','tremor+rigidity.','아님.','rigidity.']),
VR('2023 객6 변형','본태성 진전 DBS에서 Vim 대신(또는 추가로) 사용할 수 있는 타깃으로 강의록에 제시된 것은?',['PSA(posterior subthalamic area)','GPi','NAc','Caudate head','Putamen'],1,TGT+' 강의록 12·26쪽(2차 DBS on Rt. PSA).',['정답.','rigidity.','아님.','아님.','아님.']),
VR('2022 객23 변형','RF 파괴술(thalamotomy·pallidotomy)에 비해 DBS가 선호되는 이유로 강의에서 설명한 것은?',['파괴하지 않아 문제가 생기면 전극을 빼면 되고, 강도·범위 조절이 가능','배터리가 영구적','비용이 저렴','마취가 필요 없음','효과가 평생 동일'],1,DBS,['정답.','교체 필요.','비쌈(한쪽 1,500만 원).','아님.','세포 위축 시 감소.']),
VR('2020 객69 변형','DBS 수술 방법에 대한 설명으로 옳지 않은 것은?',['기본은 국소마취 후 깨워서 증상 변화를 확인','Leksell frame으로 3차원 좌표 고정','microelectrode로 핵 특유의 파형 기록','협조가 안 되면 프로포폴로 재우기도 함','반드시 근이완제를 포함한 전신마취로만 한다'],5,DBS,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
VR('2017 객46 변형','기능적 정위 수술의 적응증으로 강의록에 제시되지 않은 것은?',['급성 세균성 수막염','파킨슨병','본태성 진전','OCD·Tourette','뇌전증'],1,IND,['정답.','적응증.','적응증.','적응증.','적응증.']),
VR('2012 주50 변형','DBS 타깃과 조절 증상의 연결로 옳지 않은 것은?',['Vim — tremor','GPi — rigidity','STN — tremor와 rigidity','PSA — tremor','NAc — rigidity'],5,TGT,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
]
P=KEJ; S4='STT 10/6 4교시'
TY=[
T(P,S4+' 05:04','교수님이 학생 수준에서 알면 되는 DBS 공략점으로 정리한 것은?',['GPi, thalamus Vim, STN','caudate, putamen','hippocampus, amygdala','cerebellum, pons','substantia nigra만'],'STT 05:04. '+TGT,['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 07:25','DBS 효과가 시간이 지나며 떨어질 수 있는 이유로 교수님이 설명한 것은?',['자극에 반응할 뇌세포가 계속 위축·소실되면 효과가 떨어짐','배터리가 너무 강해서','전극이 녹아서','면역 거부','감염'],'STT 07:25.',['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 10:00','정위(stereotactic) 수술이 내비게이션보다 심부 타깃에서 정확한 이유는?',['뇌 중심부(시상·뇌간)는 CSF가 빠져도 거의 움직이지 않아 3차원 좌표가 유지됨 — 나무 줄기처럼','실시간 영상이라서','AI가 해서','두개골을 열어서','국소마취라서'],'STT 08:15–10:56.',['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 12:38','RF 파괴술(thalamotomy 등)의 한계로 교수님이 설명한 것은?',['효과가 한시적 — 주변 세포가 기능을 나눠 가져 증상 조절이 오래 가지 않음','영구적 마비','감염률 100%','비용','불가능'],'STT 12:38·37:06.',['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 21:56','파킨슨병과 파킨슨증후군(parkinsonism)의 차이로 교수님이 든 예는?',['파킨슨병은 불이 나면 뛰어서 도망갈 수 있지만 파킨슨증후군은 못 도망감','차이 없음','파킨슨증후군이 약에 더 잘 반응','파킨슨병은 소뇌 위축','파킨슨증후군은 진전만'],'STT 21:56–24:05.',['정답.','아님.','반대.','아님.','아님.']),
T(P,S4+' 26:02','본태성 진전(essential tremor) 환자에게 처음 물어볼 질문으로 교수님이 든 것은?',['숟가락으로 국을 떠서 드실 수 있나요?(움직일 때 떨림)','가만히 있을 때 떨리나요?','잘 때 떨리나요?','냄새를 맡으세요?','변비가 있나요?'],'STT 24:05–26:02.',['정답 — action/intention tremor.','파킨슨.','아님.','아님.','아님.']),
T(P,S4+' 27:44','교수님이 "이 3개만 알고 있으면 된다"고 정리한 DBS 타깃 연결은?',['tremor — Vim, rigidity — GPi, tremor+rigidity — STN','tremor — GPi','rigidity — Vim','STN — rigidity만','NAc — tremor'],'STT 27:44. '+TGT,['정답.','반대.','반대.','둘 다.','아님.']),
T(P,S4+' 39:57','DBS 환자에게 주의시키는 것으로 교수님이 든 것은?',['전자레인지 앞에 서거나 전기장판을 쓰지 말 것 — 기계가 교란되어 꺼질 수 있음','운동 금지','물 금지','햇빛 금지','비행 금지'],'STT 39:57.',['정답.','아님.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 2쪽','"Stereotactic"의 의미로 강의록에 제시된 것은?',['stereo — 3차원, tactic — 접근(approaching)','정위 — 2차원','방사선 조사','내시경','자극'],1,DBS,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 3쪽','기능적 신경외과 수술의 기본 개념으로 옳은 것은?',['과기능 신경계는 교란·억제하고 저기능 신경계는 자극','종양 제거','혈관 문합','감염 배액','골절 고정'],1,DBS,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 4쪽','강의록에 제시된 정위 수술의 3차원 프레임은?',['Leksell frame and arc system','Halo vest','Gardner tong','Mayfield clamp','Philadelphia collar'],1,DBS,['정답.','경추 고정.','견인.','두부 고정.','경추 보조기.']),
Q('강의록 6쪽','전극을 이용한 신경생리 검사에 해당하지 않는 것은?',['Macrostimulation','Microstimulation','Semi-microstimulation','Transcranial Doppler','(모두 해당)'],4,DBS,['해당.','해당.','해당.','정답.','아님.']),
Q('강의록 9쪽','Hyperkinetic disorder에 해당하지 않는 것은?',['Parkinson\'s disease','Essential tremor','Chorea','Hemiballismus','Dystonia'],1,'강의록 8–9쪽: hypokinetic — PD·parkinsonism, hyperkinetic — intention/action tremor(ET), chorea, ballismus, myoclonus, dystonia, spasmodic torticollis.',['정답 — hypokinetic.','해당.','해당.','해당.','해당.']),
Q('강의록 7쪽','Tremor 회로(Circuit II)의 시상 핵은?',['Vim, Vop','Voa','VPL','MD','Pulvinar'],1,CIRC,['정답.','rigidity.','감각.','아님.','아님.']),
Q('강의록 31쪽','최근 기능적 수술에 도입된 MRgFUS의 원리로 강의에서 설명한 것은?',['두개골을 통과하는 집속 초음파로 타깃에 열을 발생시켜 응고(머리를 깎아야 함)','전극 삽입','감마선','약물 주입','레이저 개두술'],1,'STT 15:22·44:30: MR-guided focused ultrasound — 마이크로버블로 BBB를 열어 항암제 전달에도 이용.',['정답.','DBS.','감마나이프.','아님.','아님.']),
Q('강의록 30쪽','adaptive DBS(aDBS)의 특징으로 강의에서 설명한 것은?',['이상 전기신호(신경 바이오마커)를 감지해 그때 자극을 조절','자극 없이 기록만','배터리 불필요','파괴술','약물 펌프'],1,'STT 42:44: RNS처럼 이상 신호를 감지해 증상이 올라갈 때 자극.',['정답.','아님.','아님.','아님.','아님.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
