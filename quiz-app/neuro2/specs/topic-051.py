"""10/7 6교시 중추신경계 감염·퇴행성·기타 뇌질환 영상 (황승배) — 강의록(53쪽) · STT('5교시 황승배' 파일 — Somed에 6교시 자료로 올라옴) · 학습지 694–707쪽.
2019 객84(정답 없음)·2014 객16(문제란에 시험 사진 없음)·2011 객33(사진 없음)은 채점 제외.
2018 이전 감염 문제 다수는 정경호 교수님 문제. 문제 사진은 학습지 원본(복원자 표시 포함), 강의 퀴즈 사진은 강의록 52쪽 원본(필기 포함)."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-051',prof='황승배',date='10/7',title='중추신경계 감염·퇴행성 뇌질환 영상',period='6교시')
HSB='황승배'; JKH='정경호'
def V(t,*f): return vis(t,*f)

INFO='강의록 4쪽·STT 00:34–02:03: 원인 — virus(HSV, CMV), bacteria, TB, parasite(neurocysticercosis·paragonimiasis·sparganosis), fungus; 형태 — meningitis, encephalitis(주로 virus·자가면역), cerebritis·brain abscess(세균·진균), ventriculitis, empyema(뇌실질 밖 고름).'
HSV='강의록 5–8쪽·STT 02:39–07:08: Herpes simplex encephalitis — HSV-1(90%), 급성 미만성 비화농성 괴사성 뇌염; 위치가 핵심 — limbic system, medial temporal lobe, insular cortex, subfrontal lobe, cingulate gyri; 편측 또는 양측(비대칭), 간혹 점상출혈, 비특이적 조영증강. Autoimmune(limbic) encephalitis — 정상 MRI가 많고, limbic pattern은 HSV와 같은 위치(양측성이 더 흔함, DWI·출혈·괴사·조영 경미) — 영상으로 감별 어려워 자가항체 검사.'
ABS='강의록 9–11쪽·STT 08:10–11:02: Cerebritis → abscess(early/late cerebritis, early/late capsule) — 캡슐 형성 단계에서 진단; rim enhancement + 중심 DWI 고신호(끈적한 고름, 확산 제한) — 괴사 종양은 DWI 고신호 아님, 벽이 불규칙·두꺼움. 혈행성(다발 가능) 또는 부비동염·중이염 직접 전파(인접 측두엽).'
TB='강의록 12–15쪽·STT 11:02–14:36: CNS TB — 대부분 혈행성 2차; basilar meningitis(basal cistern 수막 조영증강이 두드러지면 TB를 1번으로), parenchymal tuberculoma(다발 결절 + 부종, solid nodular 또는 ring enhancement, 중심 T2 저신호), TB abscess(DWI 고신호), 합병증 — 경색(혈관염), 수두증.'
MEN='강의록 16–19쪽·STT 14:36–17:47: Viral meningitis는 임상·검사 진단(영상 대부분 정상) — 영상은 합병증(수두증, 경색, ventriculitis, subdural effusion/empyema) 확인용; intraventricular·subdural empyema는 DWI 고신호. CMV — acquired: ventriculitis(뇌실 주위 FLAIR 고신호·벽 조영), congenital: periventricular calcification.'
PAR='강의록 20–23쪽·STT 18:47–22:30: Fungus는 영상이 비특이적(안 함). Neurocysticercosis — Taenia solium, 4단계(vesicular, colloidal vesicular, granular nodular, nodular calcified)가 한 환자에 동시에 보임; cyst with dot(scolex), ring·nodular enhancement, 석회화 결절; cistern > parenchyma > ventricle. Paragonimiasis — 만성기 뇌연화·위축·섬유화·비누거품 석회화, occipital > temporal > parietal. 면역저하 환자 다발 ring enhancement — toxoplasmosis·lymphoma.'
DEG='강의록 25–33쪽·STT 22:30–30:48: 정상 노화 — 뇌 용적↓, CSF 공간↑(수두증 아님), 뇌실 주위 얇은 고신호 rim, 백질 고신호(작고 적음), 확장된 perivascular(Virchow-Robin) space, 기저핵 mineralization↑(T2*·SWI 저신호). Alzheimer — 가장 흔한 치매, medial temporal(hippocampus·entorhinal) 위축(진행되면 frontal), 영상은 다른 원인 배제·진행 모니터링(조기 진단은 amyloid·tau PET). Vascular dementia — multifocal infarct·lacune, microbleeds, 크고 많은 백질 고신호(small vessel disease). FTD — frontal + anterior temporal 위축. CJD — 빠르게 진행, 1년 내 사망, DWI·FLAIR 고신호 — cortex, caudate, putamen.'
PD='강의록 34–39쪽·STT 30:48–36:34: PD — T2에서 substantia nigra pars compacta 좁아짐(실제 임상 MRI로 진단 불가). MSA-C(소뇌형, 보행장애·실조) — pons·cerebellum 위축, hot cross bun sign, flat pons; MSA-P — putamen 위축(뒤쪽부터)·T2/SWI 저신호; MSA-A = Shy-Drager. PSP — supranuclear gaze palsy, midbrain 위축(hummingbird sign). CBD — 비대칭 frontoparietal(perirolandic) 피질 위축.'
ETC='강의록 41–50쪽·STT 36:34–44:57: Hippocampal sclerosis — 측두엽 뇌전증에서 영상 이상의 가장 흔한 원인, hippocampus 위축 + T2 고신호(동측 temporal horn 확장, mammillary body·temporal lobe 위축). MS — 20–40세, 여성 2배, periventricular(>85%)·callososeptal interface, 뇌실에 수직(Dawson finger, sagittal에서 잘 보임), 시신경·척수(짧은 분절, 편측) 침범; ADEM — 소아, 감염 후 1–2주, 단상성; NMOSD/MOGAD — 시신경·뇌·긴 척수 병변. Hepatic encephalopathy(만성) — 망간 침착으로 양측 globus pallidus T1 고신호. Wernicke — thiamine 결핍(알코올·영양실조), 실조·안구운동 이상·혼돈, T2/FLAIR/DWI 고신호 — mammillary body, medial thalamus, hypothalamus, periaqueductal gray(대사성은 대칭). NPH — 치매·보행장애·요실금, DESH(Evans index ≥ 0.3, 양측 sylvian 확장, high convexity tightness), callosal angle < 90°, 치료 가능(shunt).'
OUT='오늘(10/7) 감염·퇴행성 영상 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',HSB); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',HSB); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

FQ='2026.10.7 감염·퇴행성 뇌질환 영상 강의록 52–53쪽 Quiz'
TB_ST='다음 영상 소견에 해당하는 원인 질환은?'
TB5=['aneurysm','hypertensive hemorrhage','결핵성 수막염','SAH','AVM']
TB5E=['아님.','아님.','정답 — basal cistern 조영증강·tuberculoma.','별 모양으로 감별.','아님.']
TBX=['Brain abscess','Brain metastasis','Subarachnoid hemorrhage','Tuberculosis','Glioblastoma multiforme']
TBXE=['얇은 ring·DWI↑.','gray–white junction.','아님.','정답.','두꺼운 불규칙 rim.']
HSV5=['Cysticercosis','Herpes encephalitis','Paragonimiasis','Brain abscess','Tuberculosis']
HSV5E=['cyst with dot.','정답 — medial temporal·orbitofrontal.','만성 석회화.','ring.','basal cistern.']

YAMA=[
Y(FQ,'55세 남자 환자가 보행장애를 주소로 내원하였음. 30년전부터 막걸리 하루 4-5병정도 매일 드시던 분이고 인지기능 떨어져 history 어려운 상태이나 보호자 문진시 작년 겨울보다 기억력이 떨어져 있다는 것을 느꼈다고 함. 당시부터 복시가 있다가 없다가 하여 병원에서 중증근무력증 진단받고 스테로이드 복용 중. 내원 당일 오후부터 피곤하고 온몸에 기력이 없는 듯한 느낌이 들다가 저녁쯤부터 거의 못걸을정도로 중심잡기 힘들어 내원함. 현재 복시는 없음. 진찰상 motor and sensory는 정상',['Vascular dementia','Hepatic encephalopathy','Limbic encephalitis','Multiple sclerosis','Wernicke encephalopathy'],5,
 visual=V('FLAIR (강의록 52쪽 원본, 강의 중 필기 포함)','igq.jpg'),caveat='강의록에 정답 표시 없음 — STT 44:57–45:56("만성 알코올, medial thalamus·mammillary body·hypothalamus... B1 투여")로 ⑤.',basis=ETC,exps=['아님.','globus pallidus T1.','medial temporal.','periventricular.','정답.']),
Y(W('2025 객17','695'),'56세 남자 환자가 보행장애를 주소로 내원하였으며 균형을 잘 못잡고 몸이 흔들거리며 걸음걸이가 이상하고 어지럼증을 동반하고 있었다. 가장 가능성이 높은 진단명은?',['파킨슨병 (Parkinson’s disease)','혈관성 치매(Vasucular dementia)','정상압 수두증(Normal pressure hydrodhephalus)','다계통 위축증(Multiple system atrophy)','간성 뇌병증증(Hepatic encephalopathy)'],4,
 visual=V('MRI (학습지 695쪽 원문)','ig25_17.jpg'),basis='복원자: 강의록 사진과 같은 사진 — 소뇌 위축, 납작한 pons. '+PD,exps=['영상 거의 정상.','허혈.','뇌실 확장.','정답 — MSA-C.','globus pallidus.']),
Y(W('2025 객20','695'),'33세 여성이 두통을 주소로 내원하였다. 다음 영상 소견에 해당하는 원인 질환은?',TB5,3,visual=V('조영증강 MRI (학습지 695쪽 원문)','ig25_20.jpg'),basis='복원자: 21기출과 같은 유형. '+TB,exps=TB5E),
Y(W('2023 객15','695–696'),'다음 사진들 중에서 중추신경계 결핵의 가능성이 가장 높은 것은?',['①','②','③','④','⑤'],3,
 visual=V('영상 ①–⑤ (학습지 695–696쪽 원문)','ig23_15a.jpg','ig23_15b.jpg'),basis=TB,exps=['herpes.','brain abscess.','정답 — basilar meningitis.','congenital CMV.','paragonimiasis.']),
Y(W('2023 객16','696–697'),'다음 사진들 중에서 혈관성 치매의 가능성이 가장 높은 것은?',['①','②','③','④','⑤'],1,
 visual=V('영상 ①–⑤ (학습지 696–697쪽 원문)','ig23_16a.jpg','ig23_16b.jpg'),basis=DEG,exps=['정답 — 크고 많은 백질 고신호.','노화(Virchow-Robin).','Alzheimer.','CJD.','MS(강의록에 없는 사진).']),
Y(W('2022 객34','698'),'32세 여자가 두달 전 어지럼증을 호소하였고, 증상은 복시, 좌측 혀 감각 이상 호소, 두통, 보행 장애, 불면증 등이 있었다. 영상 소견은 다음과 같았다.',['노화','혈관성 치매','간성 뇌증','다발성 경화증','베르니케 뇌병증'],4,
 visual=V('T2WI · FLAIR (학습지 698쪽 — 복원자가 구글에서 비슷한 사진)','ig22_34a.jpg','ig22_34b.jpg'),caveat='복원자: 그림은 구글 사진이지만 periventricular 병변·Dawson finger는 확실히 있었음.',basis=ETC,exps=['아님.','아님.','아님.','정답.','아님.']),
Y(W('2021 객33','699'),TB_ST,TB5,3,prof=JKH,visual=V('조영증강 MRI (학습지 699쪽 원문)','ig21_33.jpg'),basis=TB,exps=TB5E),
Y(W('2021 객31','699'),'48세 여성이 간질로 내원을 하였다. 다음은 이 환자의 자기공명영상사진이다. 적절한 질환은?',['알츠하이머','단순헤르페스 뇌염','해마경화증','베르니케뇌병증','만성간뇌병증'],3,
 visual=V('MRI (학습지 699쪽 원문)','ig21_31.jpg'),basis=ETC,exps=['양측 위축.','급성 염증.','정답 — 해마 위축 + T2 고신호.','mammillary.','globus pallidus.']),
Y(W('2020 객21','700'),'다음 질환은?',['Herpes encephalitis','Cysticercosis','Tuberculous meningitis','Schwannoma','Brain abscess'],1,prof=JKH,visual=V('FLAIR (학습지 700쪽 원문)','ig20_21.jpg'),basis=HSV,exps=['정답.','아님.','아님.','아님.','아님.']),
Y(W('2019 객84','700'),'54세 남자 환자가 어지럼증과 균형장애, 정신 혼돈을 주소로 내원하였다. 과거력상 10년간 매일 막걸리 4-5병씩 마셔왔다고 한다. 상기 환자의 뇌 자기공명 영상에서 보일 수 있는 소견에 해당하는 사진은?',['①','②','③','④','⑤'],2,keep_excluded=True,
 visual=V('영상 ①–⑤ (학습지 700쪽 원문)','ig19_84.jpg'),caveat='학습지 정답 칸이 비어 있고 복원자도 ②(Wernicke)와 ③(간성뇌병증) 사이에서 확신하지 못함 — 채점 제외(②는 해설 추정).',basis=ETC,exps=['강의록에 없는 사진.','Wernicke(해설 추정).','hepatic encephalopathy.','sporadic CJD.','aging(Virchow-Robin).']),
Y(W('2018 객53','701–702'),'다음 질환은?',HSV5,2,prof=JKH,visual=V('FLAIR (학습지 702쪽 원문)','ig18_53.jpg'),basis=HSV,exps=HSV5E),
Y(W('2017 객11','702'),'다음 mr의 조영증강 사진으로 맞는 것은?',TBX,4,prof=JKH,visual=V('조영증강 MRI (학습지 702쪽 원문)','ig17_11.jpg'),basis='복원자: 강의록 결핵성 수막염과 같은 사진. '+TB,exps=TBXE),
S(W('2017 주5','702–703'),'37세 여자가 1주일 전부터 발생한 감각이상, 운동기능 저하, 시야장애로 내원하였다. 다음은 MRI (FLAIR) 사진이다. 진단명은?','Multiple sclerosis',visual=V('FLAIR (학습지 703쪽 원문)','ig17_j5.jpg'),caveat='학습지 정답 칸은 비어 있고 해설에 "답 : Multiple Sclerosis".',basis=ETC),
Y(W('2014 객14','703'),'MR 영상에서 보이는 병변의 진단명은?',['Tuberculosis','Subarachnoid hemorrhage','Brain abscess','Meningioma','Contusion'],1,prof=JKH,visual=V('조영증강 MRI (학습지 703쪽 원문 — 복원자 표시 포함)','ig14_14.jpg'),basis=TB,exps=['정답.','아님.','아님.','아님.','아님.']),
Y(W('2014 객16','704'),'다음 MR영상이 나타내는 질활은?',['Metastasis','Subarachnoid hemorrhage','Infarction','Herpes encephalitis','Contusion'],4,prof=JKH,keep_excluded=True,
 caveat='학습지 문제란에 시험 사진이 없음(해설 칸에만 강의록 사진) — 채점 제외.',basis=HSV,exps=['아님.','아님.','아님.','정답.','아님.']),
Y(W('2013 객19','704'),'다음 MRI 소견은?',['Tuberculosis','Cysticerosis','Brain abscess','Subarachnoid hemorrhage','Hepatic encephalopathy'],1,prof=JKH,visual=V('조영증강 MRI (학습지 704쪽 원문)','ig13_19.jpg'),basis=TB,exps=['정답 — basal 수막 조영증강.','아님.','아님.','아님.','아님.']),
Y(W('2012 객38','704–705'),'다음 중 단순 포진 뇌염은?',['①','②','③','④','⑤'],1,prof=JKH,visual=V('영상 ①–⑤ (학습지 705쪽 원문)','ig12_38.jpg'),basis=HSV+' '+PAR+' '+ABS,exps=['정답.','neurocysticercosis.','brain abscess.','결핵성 수막염.','brain abscess.']),
Y(W('2011 객33','705'),'조영 후 MR영상에서 보이는 병변의 관계되는 질환은?',TBX,4,prof=JKH,keep_excluded=True,caveat='학습지에 문제 사진이 없음 — 채점 제외.',basis=TB,exps=TBXE),
Y(W('2011 객34','706'),'아래 설명과 그림에 관계되는 질환은? 45세 남자가 행동이상, 고열, 혼동을 주소로 내원하였다. 뇌척수액 검사에서 WBC 17, 포도당 60, 단백질 54, 혈청포도당 110인 환자의 영상소견이다. 가장 가능한 진단명은 무엇인가?',HSV5,2,prof=JKH,
 visual=V('FLAIR (학습지 706쪽 원문)','ig11_34.jpg'),basis='복원자: CSF는 바이러스성 소견. '+HSV,exps=HSV5E),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR(FQ+' 변형','Wernicke encephalopathy의 영상 호발 부위가 아닌 것은?',['Globus pallidus','Mammillary body','Medial thalamus','Hypothalamus','Periaqueductal gray'],1,ETC,['정답 — 간성뇌병증(T1).','호발.','호발.','호발.','호발.']),
VR('2025 객17 변형','MSA-C에서 pons에 십자 모양 고신호를 보이는 소견은?',['Hot cross bun sign','Hummingbird sign','Dawson finger','Molar tooth','Tram-track'],1,PD,['정답.','PSP.','MS.','Joubert.','SWS.']),
VR('2025 객20 변형','basal cistern 수막의 두드러진 조영증강을 보이면 1번으로 생각할 원인은?',['결핵','HSV','CMV','곰팡이','낭미충'],1,TB,['정답.','limbic.','뇌실.','비특이.','cyst with dot.']),
VR('2023 객15 변형','선천성 CMV 감염의 영상 소견은?',['뇌실 주위 석회화','basal 수막 조영','medial temporal FLAIR 고신호','hot cross bun','globus pallidus T1 고신호'],1,MEN,['정답.','TB.','HSV.','MSA.','간성뇌병증.']),
VR('2023 객16 변형','정상 노화의 영상 소견이 아닌 것은?',['크고 많은 백질 고신호와 다발성 lacune','CSF 공간 증가','Virchow-Robin space 확장','기저핵 mineralization 증가','뇌 용적 감소'],1,DEG,['정답 — vascular dementia.','노화.','노화.','노화.','노화.']),
VR('2022 객34 변형','MS 뇌 병변의 특징적 위치·모양은?',['뇌실에 수직인 periventricular 병변(Dawson finger)','양측 globus pallidus','mammillary body','medial temporal','pons 십자 모양'],1,ETC,['정답.','간성.','Wernicke.','HSV.','MSA-C.']),
VR('2021 객31 변형','측두엽 뇌전증 환자에서 영상 이상의 가장 흔한 원인은?',['Hippocampal sclerosis','Alzheimer','HSV','MS','NPH'],1,ETC,['정답.','아님.','아님.','아님.','아님.']),
VR('2020 객21 변형','Herpes simplex encephalitis 영상에서 가장 중요한 것은?',['침범 위치(limbic, medial temporal, insula, subfrontal, cingulate)','조영증강 정도','DWI 신호','출혈 유무','석회화'],1,HSV,['정답 — 위치로 진단.','다양.','다양.','간혹.','아님.']),
VR('2012 객38 변형','neurocysticercosis의 특징적 영상 소견은?',['Cyst with dot(scolex)','basal 수막 조영','hot cross bun','tram-track 석회화','Dawson finger'],1,PAR,['정답.','TB.','MSA.','SWS.','MS.']),
]
P=HSB; S6='STT 10/7 6교시'
TY=[
T(P,S6+' 02:39','영상이 진단에 실제로 도움이 되는 바이러스 뇌질환 두 가지로 교수님이 든 것은?',['HSV와 CMV','EBV와 HIV','measles와 mumps','JC와 BK','VZV와 rabies'],HSV+' '+MEN,['정답.','아님.','아님.','아님.','아님.']),
T(P,S6+' 06:14','HSV 뇌염과 autoimmune encephalitis를 감별하는 방법은?',['임상 감염 소견(발열·WBC·CSF)과 자가항체 검사 — 영상으로는 감별 어려움','영상 위치','조영증강','DWI','CT'],HSV,['정답.','같은 위치.','아님.','아님.','아님.']),
T(P,S6+' 09:09','농양 중심부가 DWI 고신호인 이유는?',['끈적하고 세포가 많은 고름이라 물 확산이 제한','괴사로 물이 자유로워서','출혈','석회화','지방'],ABS,['정답.','종양 괴사.','아님.','아님.','아님.']),
T(P,S6+' 15:21','viral meningitis에서 MRI를 찍는 이유는?',['진단보다 합병증(수두증·경색·empyema 등) 확인','진단 확정','원인 바이러스 구분','치료 반응 예측','예후'],MEN,['정답.','임상·검사 진단.','불가.','아님.','아님.']),
T(P,S6+' 18:47','교수님이 "영상이 비특이적이라 하지 않는다"고 한 감염은?',['곰팡이(fungus) 감염','TB','HSV','CMV','낭미충증'],PAR,['정답.','중요.','중요.','중요.','중요.']),
T(P,S6+' 22:30','면역저하 환자의 다발성 ring enhancement에서 먼저 생각할 두 가지는?',['toxoplasmosis와 lymphoma','meningioma와 schwannoma','MS와 ADEM','CJD와 AD','PD와 MSA'],PAR,['정답.','아님.','아님.','아님.','아님.']),
T(P,S6+' 26:10','알츠하이머 조기 진단에 쓰는 검사로 교수님이 언급한 것은?',['amyloid·tau PET','일반 MRI','CT','EEG','혈액 검사'],DEG,['정답 — MRI는 배제·모니터링.','진행 후.','아님.','아님.','아님.']),
T(P,S6+' 34:36','교수님이 "시험에 나올 만한 가치가 있는 사진"이라고 한 것은?',['MSA-P의 putamen 위축·T2/SWI 저신호','정상 노화','PD substantia nigra','CBD','FTD'],PD,['정답.','아님.','실제 진단 불가.','흔하지 않음.','아님.']),
T(P,S6+' 41:09','만성 간질환 환자에서 양측 globus pallidus가 T1 고신호인 원인은?',['망간 침착','출혈','석회화','지방','조영제'],ETC,['정답.','아님.','아님.','아님.','아님.']),
T(P,S6+' 44:57','NPH를 진단해야 하는 이유로 교수님이 강조한 것은?',['치료(shunt)가 가능한 치매·보행장애','진행을 막을 수 없음','유전 질환','감염','종양'],ETC,['정답.','아님.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 4쪽','뇌실질 밖에 고름이 고인 것은?',['Empyema','Cerebritis','Encephalitis','Abscess','Ventriculitis'],1,INFO,['정답.','실질 염증.','실질 염증.','실질 고름.','뇌실 염증.']),
Q('강의록 9쪽','뇌농양의 병리 단계 순서는?',['early cerebritis → late cerebritis → early capsule → late capsule','capsule → cerebritis','abscess → cerebritis','모두 동시','cerebritis만'],1,ABS,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 12쪽','Parenchymal tuberculoma의 영상 소견이 아닌 것은?',['중심 T2 고신호가 특징','다발 결절과 부종','solid nodular enhancement','ring enhancement','TB abscess는 DWI 고신호'],1,TB,['정답 — 대개 중심 T2 저신호.','소견.','소견.','소견.','소견.']),
Q('강의록 20쪽','Neurocysticercosis가 잘 침범하는 순서는?',['cistern > parenchyma > ventricle','ventricle > cistern','parenchyma만','spinal cord','skull'],1,PAR,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 22쪽','Paragonimiasis 만성기 소견은?',['뇌연화·위축·비누거품 석회화(occipital > temporal)','basal 수막 조영','cyst with dot','medial temporal FLAIR','hot cross bun'],1,PAR,['정답.','TB.','낭미충.','HSV.','MSA.']),
Q('강의록 33쪽','CJD의 DWI·FLAIR 고신호 호발 부위는?',['cortex, caudate, putamen','hippocampus만','pons','white matter만','소뇌'],1,DEG,['정답.','AD.','MSA.','아님.','아님.']),
Q('강의록 39쪽','PSP의 영상 소견은?',['midbrain 위축(hummingbird sign)','pons 십자','putamen 위축','hippocampus 위축','frontoparietal 비대칭 위축'],1,PD,['정답.','MSA-C.','MSA-P.','AD.','CBD.']),
Q('강의록 46쪽','감염 후 소아에서 단상성으로 뇌·척수를 침범하는 탈수초 질환은?',['ADEM','MS','NMOSD','MOGAD','CJD'],1,ETC,['정답.','재발-완화.','시신경.','시신경.','아님.']),
Q('강의록 50쪽','NPH의 영상 소견이 아닌 것은?',['callosal angle > 120°','Evans index ≥ 0.3','양측 sylvian fissure 확장','high convexity tightness','DESH'],1,ETC,['정답 — < 90°.','소견.','소견.','소견.','소견.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
