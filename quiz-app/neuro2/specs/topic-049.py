"""10/7 4교시 선천성 뇌기형 영상 (황승배) — 강의록 '선천성뇌질환 영상(수정)'(54쪽) · STT 4교시 · 학습지 646–655쪽.
척추질환 영상은 5교시 자료(topic-050)로 따로 묶음. 2017 객13은 학습지에 정답·문제 사진이 없어 채점 제외.
2016 객4·2015 객19는 정경호 교수님 문제. 문제 사진은 학습지 원본, 강의 퀴즈 사진은 강의록 53쪽 원본(필기 포함)."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-049',prof='황승배',date='10/7',title='선천성 뇌기형 영상',period='4교시')
HSB='황승배'; JKH='정경호'
def V(t,*f): return vis(t,*f)

MID='강의록 3–12쪽·STT 01:01–08:20: Holoprosencephaly — 양 대뇌반구 분리 실패; alobar(거의 분리 안 됨, monoventricle, fused thalami, falx·interhemispheric fissure·septum·CC 없음, pancake), semilobar(뒤는 분리·앞은 융합), lobar(거의 정상, 앞쪽 일부 융합, septum pellucidum 없음). Callosal dysgenesis — 생성 순서 genu→body→splenium→rostrum(그래서 부분형은 뒤쪽이 없는 경우가 많음); cartwheel 모양 sulcus, cingulate gyrus 없음, 평행한 측뇌실(colpocephaly), Probst bundle; sagittal이 진단에 가장 좋음. Intracranial lipoma — 진짜 종양이 아닌 선천 기형, midline(interhemispheric 40–50%·pericallosal 30%, suprasellar 15–20%, tectal 10–15% → 폐쇄성 수두증), callosal dysgenesis 동반, CT −100 HU(검게), T1 고신호, 석회화 가능.'
CORT='강의록 13–29쪽·STT 08:20–19:35: 발생 단계별 — proliferation: hemimegalencephaly(한쪽 반구 과오종성 과성장, 큰 반구 + 커진 측뇌실, 백질 신호↑); migration: lissencephaly(이동 정지 → 두꺼운 4층 피질, 매끈한 표면, 얕은 sylvian fissure; complete = agyria, hourglass·figure eight / incomplete = agyria-pachygyria), heterotopia(이동 중 멈춘 회백질 — subependymal(periventricular nodular, 가장 흔함), band(double cortex), subcortical; CT·MR 모두 회백질과 같은 음영·신호); organization: focal cortical dysplasia(국소 피질 비후 + 피질하 백질 T2 고신호, 뇌전증 환자에서 가장 흔한 이상), polymicrogyria(작고 많은 뇌회, 얕은 고랑, 두꺼운 불규칙 피질 — 양측 sylvian 주변이면 congenital bilateral perisylvian syndrome, pseudobulbar palsy), schizencephaly(측뇌실 상의에서 피질 표면까지 회백질로 덮인 CSF 틈, 틈의 회백질은 polymicrogyria; closed lip / open lip).'
POST='강의록 30–36쪽·STT 19:35–27:24: Dandy-Walker — 큰 후두와 + 4th ventricle 낭성 확장, vermis 형성저하·무형성, torcular-lambdoid inversion(torcula가 lambdoid보다 위). Joubert — molar tooth sign(vermis 형성저하, 두껍고 길고 수평인 superior cerebellar peduncle, 깊은 interpeduncular fossa). Chiari — 작은 후두와로 tonsil·medulla가 foramen magnum 아래로; type I은 단순 tonsil herniation(5 mm 이상), syringohydromyelia 동반 가능, 흔하고 대개 무증상; II 작은 후두와 + hindbrain herniation; III = II + meningoencephalocele; IV 심한 소뇌 형성저하.'
PHAK='강의록 37–51쪽·STT 27:24–41:01: Tuberous sclerosis — 다장기 과오종, 고전적 3징후(안면 혈관섬유종 90%, 정신지체 50–80%, seizure 80–90%); cortical/subcortical tuber 95%(T2·FLAIR 고신호), subependymal nodule 98%(대개 석회화 — CT), SEGA 15%(foramen of Monro, >1 cm, 조영증강). Sturge-Weber — encephalotrigeminal angiomatosis, 얼굴 port-wine nevus(CN V), 태아 피질정맥 발달 실패 → 만성 정맥 울혈·허혈; pial angiomatosis 편측 80%, occipital > parietal, 두드러진 leptomeningeal enhancement, 커진 동측 맥락총, gyriform(tram-track) 석회화, 위축. NF1 — café-au-lait, T2 FASI(globus pallidus·thalamus·brainstem·cerebellar WM·hippocampus), plexiform neurofibroma, optic pathway glioma. NF2 — 양측 vestibular schwannoma(90%), 직계 가족 NF2 + 편측 VS 또는 신경섬유종·신경초종·수막종·신경교종 2개. VHL — CNS hemangioblastoma 2개 이상(소뇌·뇌간·척수; solid enhancing nodule 또는 cyst with enhancing mural nodule), retinal angioma, RCC, pheochromocytoma, 간·신장·췌장 낭종.'
OUT='오늘(10/7) 선천성 영상 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',HSB); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',HSB); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

FQ='2026.10.7 선천성 뇌질환 영상 강의록 53–54쪽 Quiz'
TS_E='subependymal 석회화 결절·피질 tuber.'
SCH_ST='45세 남자 환자가 발작을 주소로 내원했다. 영상 사진은 다음과 같다. 예상되는 진단명은?'

YAMA=[
Y(FQ,'Seizure를 주소로 내원한 환자들의 뇌영상이다. 맞게 연결된 것은?',['1. Sturge-Weber syndrome','2. Tuberous sclerosis','3. Lissencephaly (Pachygyria)','4. Neurofibromatosis type I','5. Chiari malformation'],3,
 visual=V('영상 1–5 (강의록 53쪽 원본, 강의 중 필기 포함)','bcq_a.jpg','bcq_b.jpg'),caveat='강의록에 정답 표시 없음 — STT 43:28 해설(1 결절성 경화증, 2 Sturge-Weber, 3 뇌회가 몇 개 없음 = lissencephaly, 4 schizencephaly, 5 뇌량 없음)로 ③.',basis=CORT+' '+PHAK,exps=['1은 TS.','2는 SWS.','정답.','4는 schizencephaly.','5는 callosal agenesis(+lipoma).']),
Y(W('2023 객53','647'),'다음 T1 강조영상에서 고신호강도를 보이는 사진들이다. 연결이 올바르게 된 것은?',['지방','고단백 낭종','가돌리늄 조영제','망간(manganese) 침착','아급성 출혈'],1,
 visual=V('T1WI ①–⑤ (학습지 647쪽 원문)','bc23_53.jpg'),caveat='복원자: ①·④는 강의록에 없는 사진. 해설 속 보기 번호(②조영제·③고단백·⑤lipoma)는 사진 라벨 순서와 다르게 적혀 있음 — 주어진 답 ① 유지.',basis='복원자: ① orbit의 정상 지방. '+MID,exps=['정답 — orbit 지방.','②는 조영제.','③은 고단백(Rathke cleft cyst).','④는 아급성 출혈.','⑤는 lipoma(pericallosal).']),
Y(W('2023 객54','647–648'),'다음 영상들 중 제2형 신경섬유종증에 해당하는 사진은?',['①','②','③','④','⑤'],1,
 visual=V('영상 ①–⑤ (학습지 647–648쪽 원문)','bc23_54a.jpg','bc23_54b.jpg'),basis='복원자: 강의록 사진, 시험엔 화살표 없었음. '+PHAK,exps=['정답 — 양측 vestibular schwannoma.','VHL.','incomplete lissencephaly.','tuberous sclerosis.','schizencephaly.']),
Y(W('2022 객31','649–650'),'다음 중 Polymicrogyria 는 무엇인가?',['①','②','③','④','⑤'],4,
 visual=V('영상 ①–⑤ 순서대로 (학습지 649–650쪽 원문)','bc22_31_1.jpg','bc22_31_2.jpg','bc22_31_3.jpg','bc22_31_4.jpg','bc22_31_5.jpg'),basis=CORT,exps=['cortical dysplasia.','lissencephaly.','schizencephaly.','정답.','callosal dysgenesis.']),
Y(W('2021 객8','650'),SCH_ST,['Schizencephaly','Neurofibromatosis type I','Tuberous sclerosis','Hemimegalencephaly','Lissencephaly'],1,
 visual=V('MRI (학습지 650쪽 — 복원자가 비슷한 사진으로 대체)','bc21_8.jpg'),caveat='복원자: 그림이 약간 달랐던 것 같아 최대한 비슷한 것으로 넣음.',basis=CORT,exps=['정답.','FASI.','석회화 결절.','한쪽 반구 큼.','매끈한 피질.']),
Y(W('2020 객103','650–651'),'다음 사진의 질환명은?',['Tuberosclerosis','Sturge weber syndrome','Neurofibromatosis I','Neurofibromatosis II','von Hippel Lindau syndrome'],4,
 visual=V('조영증강 MRI (학습지 650쪽 원문)','bc20_103.jpg'),basis=PHAK,exps=['아님.','아님.','아님.','정답 — 양측 IAC.','hemangioblastoma.']),
Y(W('2019 객83','651'),'다음 영상소견의 진단명은?',['Schizencephaly','Cortical dysplasia','callosal dysgenesis','Chiari malformation','Polymicrogyria'],4,
 visual=V('MRI (학습지 651쪽 원문)','bc19_83.jpg'),basis=POST,exps=['아님.','아님.','아님.','정답 — tonsil herniation + syrinx.','아님.']),
S(W('2017 객13','651–652'),'다음 중 Lissencephaly에 해당하는 영상은? (5개의 사진 중 하나를 고르는 문제)','강의록 Lissencephaly 사진(매끈한 뇌 표면, 두꺼운 피질, 얕은 sylvian fissure)',keep_excluded=True,caveat='복원자: 강의록 사진이 그대로 나왔다고만 적혀 있고 보기 사진·정답이 없어 채점 제외.',basis=CORT),
S(W('2017 주19','652'),'다음 영상소견의 진단명은?','Chiari I (malformation)',visual=V('MRI (학습지 652쪽 원문)','bc17_j19.jpg'),caveat='학습지 정답 칸은 비어 있고 해설에 "답: Chiari I".',basis='복원자: 강의록 51번 슬라이드. '+POST),
Y(W('2016 객4','652'),'다음 영상에 맞는 병명을 고르시오.',['Herpes simplex encephalitis','Brain metastasis','Tuberous sclerosis','Sturge-weber syndrome','Cysticercosis'],3,prof=JKH,
 visual=V('MRI (학습지 652쪽 원문)','bc16_4.jpg'),basis='복원자: 뇌실 주위 석회화 tuber — 강의록 동일 사진. '+PHAK,exps=['측두엽.','아님.','정답 — '+TS_E,'gyriform 석회화.','아님.']),
Y(W('2015 객19','653'),'다음 영상의 병변과 가장 관련이 있는 질환은?',['Cavernous malformation','Sturge-Weber syndrome','Meningioma','Tuberous sclerosis','Cysticerosis'],4,prof=JKH,
 visual=V('조영증강 MRI (학습지 653쪽 원문)','bc15_19.jpg'),caveat='복원자: 보기 ③은 실제 시험지와 다를 수 있음.',basis='복원자: SEGA(foramen of Monro). '+PHAK,exps=['아님.','아님.','아님.','정답 — SEGA.','아님.']),
Y(W('2014 객1','653'),'강직성 하지마비와 지능저하를 주호소로 내원한 16세 소녀의 영상사진이다. 예상되는 진단명은?',['Tuberous sclerosis','Neurofibromatosis type I','Schizencephaly','Hemimegalencephaly','Lissencephaly'],3,
 visual=V('MRI (학습지 653쪽 — 복원자가 강의록 사진으로 대체)','bc14_1.jpg'),caveat='복원자: 실제 시험에는 closed lip으로 나옴.',basis=CORT,exps=['아님.','아님.','정답.','아님.','아님.']),
Y(W('2013 객23','654'),'3세 남아가 경련과 정신지체를 주소로 내원하였다. CT와 MRI(T2강조영상)은 다음과 같다. 진단은?',['다발성 경화증 (Multiple sclerosis)','결정성 경화증 (Tuberous sclerosis)','분열뇌증 (Schizencephaly)','신경섬유종증 (Neurofibromatosis)','Von Hippel-Lindau syndrome'],2,
 visual=V('CT · T2WI (학습지 654쪽 원문)','bc13_23.jpg'),basis=PHAK,exps=['아님.','정답 — '+TS_E,'아님.','아님.','아님.']),
Y(W('2013 객24','654–655'),'5세 남아가 경련을 주소로 내원하였다. CT와 MRI영상은 다음과 같다. 이 질병에 대한 올바른 설명은?',['정상측 뇌의 크기가 커진다.','병변측 뇌회에 출혈이 발생한다.','경막을 따라 조영이 증가한다.','병변측 뇌실맥락총이 커진다.','동반되어 신혈관근지방(renal angiomyolipoma)가 발생한다.'],4,
 visual=V('CT · MRI (학습지 655쪽 원문)','bc13_24.jpg'),basis='복원자: 강의록 사진, image finding에 ④. '+PHAK,exps=['병변측 위축.','석회화.','leptomeningeal(연수막).','정답.','TS.']),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR(FQ+' 변형','완전형(complete) lissencephaly의 특징적 모양은?',['Hourglass(figure eight)','Molar tooth','Cartwheel','Pancake','Tram-track'],1,CORT,['정답.','Joubert.','callosal dysgenesis.','alobar HPE.','SWS 석회화.']),
VR('2023 객53 변형','Intracranial lipoma의 영상 소견으로 옳은 것은?',['CT −100 HU 저음영, T1 고신호','CT 고음영, T1 저신호','항상 측두엽 피질','조영증강 강함','DWI 고신호'],1,MID,['정답.','반대.','midline.','아님.','아님.']),
VR('2023 객54 변형','NF2 진단 기준이 아닌 것은?',['café-au-lait 반점','양측 vestibular schwannoma','직계 가족 NF2 + 편측 vestibular schwannoma','직계 가족 NF2 + 수막종·신경교종 등 2개','직계 가족 NF2 + 신경섬유종·신경초종 2개'],1,PHAK,['정답 — NF1.','기준.','기준.','기준.','기준.']),
VR('2022 객31 변형','양측 sylvian fissure 주변 polymicrogyria에서 나타나는 증상은?',['pseudobulbar palsy(congenital bilateral perisylvian syndrome)','시야결손','청력소실','사지 운동실조','안검하수'],1,CORT,['정답.','아님.','아님.','아님.','아님.']),
VR('2021 객8 변형','Schizencephaly의 틈(cleft)을 덮고 있는 피질의 형태는?',['Polymicrogyria','Lissencephaly','정상 6층 피질','Heterotopia','백질'],1,CORT,['정답.','아님.','아님.','아님.','아님.']),
VR('2019 객83 변형','Dandy-Walker malformation의 소견이 아닌 것은?',['작은 후두와(small posterior fossa)','4th ventricle 낭성 확장','vermis 형성저하','torcular-lambdoid inversion','큰 후두와'],1,POST,['정답 — Chiari.','소견.','소견.','소견.','소견.']),
VR('2016 객4 변형','Tuberous sclerosis에서 1 cm 이상 커지고 조영증강되며 foramen of Monro에 생기는 것은?',['SEGA','Subependymal nodule','Cortical tuber','Hemangioblastoma','Plexiform neurofibroma'],1,PHAK,['정답.','작고 석회화.','피질.','VHL.','NF1.']),
VR('2013 객24 변형','Sturge-Weber syndrome의 영상 소견이 아닌 것은?',['양측 vestibular schwannoma','두드러진 leptomeningeal enhancement','동측 맥락총 비대','tram-track gyriform 석회화','대뇌 위축'],1,PHAK,['정답 — NF2.','소견.','소견.','소견.','소견.']),
]
P=HSB; S4='STT 10/7 4교시'
TY=[
T(P,S4+' 03:37','뇌량(corpus callosum) 생성 순서상 부분 무형성에서 주로 없는 부분은?',['뒤쪽(splenium 쪽)','genu','앞쪽 전체','body 앞','항상 전체'],MID,['정답 — genu→body→splenium→rostrum 순서.','먼저 생김.','아님.','아님.','아님.']),
T(P,S4+' 05:24','뇌량 무형성을 가장 진단하기 좋은 영상 단면은?',['sagittal','axial','coronal','oblique','DWI'],MID,['정답.','어려움.','보조.','아님.','아님.']),
T(P,S4+' 06:23','뇌에 지방이 없는데 lipoma가 생기는 이유로 설명된 것은?',['뇌 형성 때 지방을 만드는 조직이 들어와 증식한 선천 기형','진짜 악성 종양','감염 후 변화','외상 후','약물'],MID,['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 12:46','heterotopia를 진단하는 핵심은?',['CT·MR 모두 회백질과 같은 음영·신호의 결절','조영증강','석회화','출혈','DWI 고신호'],CORT,['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 14:44','뇌전증 환자 MRI에서 첫 번째로 찾아야 할 선천 이상은?',['cortical dysplasia(피질 형성 이상)','lipoma','Chiari','Dandy-Walker','arachnoid cyst'],CORT,['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 22:18','교수님이 "시험 내면 안 된다"고 한 것은?',['Dandy-Walker variant의 세부 구분','Chiari type I','tuberous sclerosis','schizencephaly','NF2'],POST,['정답.','중요.','중요.','중요.','중요.']),
T(P,S4+' 25:36','Chiari I에서 tonsil herniation 기준은?',['foramen magnum 아래 5 mm 이상','1 mm','2 cm','vermis 전체','medulla만'],POST,['정답.','아님.','아님.','아님.','아님.']),
T(P,S4+' 33:41','Sturge-Weber가 진행하면 나타나는 소견은?',['뇌 위축과 피질을 따른 기찻길(tram-track) 석회화','뇌 비대','조영증강 소실','양측 VS','SEGA'],PHAK,['정답.','아님.','아님.','NF2.','TS.']),
T(P,S4+' 40:03','hemangioblastoma가 몇 개 이상이면 VHL을 강력히 의심하는가?',['2개 이상(멀티플)','1개','5개','10개','0개'],PHAK,['정답.','대개 단발.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 4쪽','Holoprosencephaly 중 가장 심한 형태는?',['Alobar','Semilobar','Lobar','Septo-optic dysplasia','Callosal agenesis'],1,MID,['정답 — monoventricle, fused thalami.','중간.','거의 정상.','아님.','아님.']),
Q('강의록 7쪽','Callosal dysgenesis의 영상 소견이 아닌 것은?',['Molar tooth sign','Cartwheel configuration','Cingulate gyrus 없음','Colpocephaly(평행 측뇌실)','Probst bundle'],1,MID,['정답 — Joubert.','소견.','소견.','소견.','소견.']),
Q('강의록 15쪽','한쪽 대뇌반구 전체나 일부의 과오종성 과성장은?',['Hemimegalencephaly','Lissencephaly','Heterotopia','Schizencephaly','Holoprosencephaly'],1,CORT,['정답.','이동.','이동.','조직화.','분리.']),
Q('강의록 21쪽','Heterotopia 중 가장 흔한 형태는?',['Subependymal(periventricular nodular)','Band','Subcortical','Cortical','Cerebellar'],1,CORT,['정답.','double cortex.','아님.','아님.','아님.']),
Q('강의록 25쪽','Focal cortical dysplasia의 영상 소견은?',['국소 피질 비후 + 피질하 백질 T2 고신호','매끈한 뇌 표면','CSF 틈','회백질 결절','양측 VS'],1,CORT,['정답.','lissencephaly.','schizencephaly.','heterotopia.','NF2.']),
Q('강의록 28쪽','Schizencephaly에서 틈의 벽이 맞닿아 있는 형태는?',['Closed lip','Open lip','Band','Agyria','Pachygyria'],1,CORT,['정답.','벌어짐.','heterotopia.','lissencephaly.','lissencephaly.']),
Q('강의록 33쪽','Molar tooth sign을 보이는 질환은?',['Joubert syndrome','Dandy-Walker','Chiari II','Holoprosencephaly','Lissencephaly'],1,POST,['정답.','큰 후두와.','작은 후두와.','아님.','아님.']),
Q('강의록 36쪽','Chiari II에 meningoencephalocele이 더해진 것은?',['Chiari III','Chiari I','Chiari IV','Dandy-Walker','Joubert'],1,POST,['정답.','단순 tonsil.','심한 소뇌 형성저하.','아님.','아님.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
