"""10/7 3교시 뇌종양 영상 (황승배) — 강의록(46쪽) · STT 3교시 · 학습지 683–693쪽.
2021 이전 기출은 정경호 교수님(뇌종양·뇌염증성 질환 통합 강의) 문제 — 종양 문항은 오늘 강의록 범위 안.
결핵성 수막염(2021 객33)·결절성 경화증(2011 객3)은 오늘 종양 강의록에 없어 [수업범위 외](감염·선천성 영상 시간 내용).
2016 객5는 시험 사진이 복원되지 않아(학습지는 강의 필기 사진으로 대체) 채점 제외. 문제 사진은 학습지 원본, 강의 퀴즈 사진은 강의록 45쪽 원본."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-048',prof='황승배',date='10/7',title='뇌종양 영상',period='3교시')
HSB='황승배'; JKH='정경호'
def V(t,*f): return vis(t,*f)

TECH='강의록 4–6쪽·STT 03:58–05:56: MRI가 CT보다 우수 — T1WI·T2WI·CET1WI, T2*GRE·SWI(종양 내 출혈), DWI(세포충실도, 농양과 감별); advanced — PWI·MRS(glioma grading), DTI/tractography. CT가 좋은 점 — skull 병변(bone metastasis), 종양 내 석회화(oligodendroglioma, adamantinomatous craniopharyngioma, meningioma), 인접 뼈 변화(hyperostosis·erosion).'
AXIS='강의록 7–10쪽·STT 05:56–09:26: 축내(intra-axial) — 뇌실질 안; 축외(extra-axial) — 수막·신경·두개골 기원(meningioma, cranial nerve schwannoma). 축외 소견 — CSF cleft sign, vessels sign, cortex sign(종양과 백질 사이 피질), broad dural base, dural tail sign(조영증강 MRI), buckling of GM/WM. 부종은 백질에만.'
INNER='강의록 11–15쪽·STT 09:26–13:10: 세포충실도↑ — CT 음영↑, T2WI 신호↓, DWI 신호↑(악성: lymphoma, high grade glioma, medulloblastoma / 양성: meningioma, pituitary adenoma). 괴사 — 악성 시사(glioblastoma, metastasis). 낭종 — 조영증강 안 됨, T1 low/T2 high가 일반적이나 단백·아급성 출혈이면 T1 high(adamantinomatous craniopharyngioma). 석회화 — oligodendroglioma, adamantinomatous craniopharyngioma, meningioma. 출혈 — glioblastoma, metastasis, oligodendroglioma, pituitary adenoma(조영 전 CT 고음영이면 출혈 의심).'
AGE='강의록 21–22쪽·STT 15:08–16:07: 판독 순서 — ① 나이 → ② 축내/축외 → ③ 정확한 위치 → ④ 조영증강·세포충실도·괴사·출혈·석회화·낭성. 소아 4th ventricle — medulloblastoma, ependymoma; 소아 brainstem — diffuse midline glioma; 9개월 lateral ventricle — choroid plexus papilloma; 45세 lateral ventricle — central neurocytoma; 성인 hemisphere — diffuse glioma/GBM, metastasis, lymphoma; CPA — vestibular schwannoma, meningioma; sellar/suprasellar — PitNET, craniopharyngioma.'
GLIOMA='강의록 19·23–28쪽·STT 17:01–21:35: Astrocytoma IDH-mutant grade 2–4(grade 4라도 glioblastoma라 부르지 않음) — grade↑일수록 cellularity·BBB 파괴·DWI·조영증강·rCBV↑, grade 4는 괴사로 heterogeneous thick irregular rim enhancement. Oligodendroglioma — IDH-mutant + 1p/19q-codeleted, grade 2–3, 성인 frontal lobe, cortical–subcortical, 석회화(CT가 단서), seizure. Glioblastoma IDH-wildtype — 가장 악성, >40세(peak 60–70), 중심 괴사 + 불규칙한 두꺼운 rim enhancement, 주변 enhancing부 DWI↑·T2↓, multifocal 20%, 뇌량 통해 반대편(butterfly), 출혈, rCBV↑.'
META='강의록 29–32쪽·STT 21:35–24:30: 전이암 — 뇌종양의 약 1/3(빈도상 가장 흔함), 원발 폐암(mc)·유방암; solid enhancing nodule 또는 rim-enhancing, multiple 또는 solitary(solitary면 high grade glioma와 감별 어려움 — 조직검사), gray–white junction. 폐암 — pachymeninges·실질·skull, 유방암 — leptomeninges·뇌신경. Skull의 punch-out defect — metastasis, multiple myeloma, LCH, Paget.'
LYM='강의록 33–34쪽·STT 24:30–25:18: Lymphoma — 대개 secondary, solitary 60–70%; 악성이지만 괴사가 없어 강하고 균일한(homogeneous) 조영증강; high cellularity(CT 약간 고음영, DWI 고신호, ADC 저신호); 뇌량을 넘어갈 수 있음; 수막·뇌신경 침범.'
MEN='강의록 35–36쪽·STT 25:18–27:17: Meningioma — 뇌종양의 15–30%, 가장 흔한 축외종양(양성 중 가장 흔함), 경막 있는 곳 어디나; 축외 소견(broad dural base, dural tail, CSF cleft); homogeneous enhancement; high cellularity → 조영 전 CT 약간 고음영, DWI 약간 고신호; hyperostosis 20%, 석회화 20–30%.'
SCH='강의록 37–40쪽·STT 27:17–31:02: Schwannoma — CN8(vestibular, 90%) >> CN5 > CN7; 양측 vestibular schwannoma = NF2; 위치가 중요; homogeneous 또는 cystic change로 heterogeneous enhancement. Vestibular — CPA에서 internal auditory canal로 들어가 ice cream cone 모양, 청력 감소. Trigeminal — pons 앞쪽에서 Meckel cave로.'
CRANIO='강의록 41–42쪽·STT 31:02–32:59: Adamantinomatous craniopharyngioma — 소아(5–15세), suprasellar, solid + cyst(T1WI 고신호 가능) + 석회화 — 나이·위치·낭종·석회화 4가지. Papillary — 성인, 대부분 solid, 석회화 드묾. Pituitary adenoma는 성인, 낭종·석회화 없는 sellar 종괴. Arachnoid cyst(43쪽) — 지주막 분리 사이 CSF 저류, middle cranial fossa 50–60% > posterior fossa, CSF와 같은 음영·신호, 대개 무증상.'
RING='강의록 4·45–46쪽·STT 34:59–37:08: rim(ring)-enhancing 패턴 — 내부 조영되지 않는 괴사 + 주변 조영증강 = 악성 종양 시사(glioblastoma, metastasis) — 다른 원인(농양 등)은 이후 수업에. DWI로 농양과 감별 — 농양은 중심부 DWI 고신호, 종양 괴사는 저신호(enhancing rim은 cellularity↑로 DWI↑).'
OUT='오늘(10/7) 뇌종양 영상 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',HSB); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

FQ='2026.10.7 뇌종양 영상 강의록 45–46쪽 Quiz'
MEN_ST='MR 영상에서 보이는 병변의 진단명은?'
MEN5=['Glioblastoma','Oligodendroglioma','brain metastasis','Meningioma','Hemorrhage']
MEN5E=['괴사·rim enhancement.','석회화·피질 침범.','gray–white junction, 다발.','정답 — 축외, broad dural base, homogeneous.','아님.']
ABS_E=['괴사 중심은 DWI 저신호.','균일 조영.','정답 — 중심부 DWI 고신호.','cyst 내 dot.','불완전 ring.']

YAMA=[
Y(FQ,'58세 여자 환자가 1개월전부터 두통이 시작되었고 점점 심해졌다고 하며 좌측 상하지에 힘이 빠진다고 하였다. 과거력상 특이 사항은 없었다. 금일 새벽부터는 의식도 약간 떨어지는 것 같다고 하여 응급실 내원하여 촬영한 brain MRI 사진이다. 가장 가능성 높은 진단은?',['Glioblastoma','Brain abscess','Subacute infarction','Schwannoma','Craniopharyngioma'],1,
 visual=V('조영증강 · DWI · Perfusion(rCBV) (강의록 45쪽 원본)','btq.jpg'),caveat='강의록에 정답 표시 없음 — STT 36:20("조영증강 안 되는 괴사 부분이 있는 rim-enhancing 패턴 = 악성 종양을 시사")와 rCBV 증가로 ①.',basis=RING+' '+GLIOMA,exps=['정답 — 괴사 + 두꺼운 rim, rCBV↑.','중심부 DWI 고신호여야.','rim·rCBV↑ 아님.','축외 CN.','소아 suprasellar.']),
Y(W('2025 객18','684'),'환자가 두통과 시야장애를 주소로 내원했다. CT영상과 MR 영상이 다음과 같습니다. 가장 가능성이 높은 진단명은 무엇인가?',['지주막낭종 (Arachnoid cyst)','교모세포종 (Glioblastoma)','두개인두종 (Craniopharyngioma)','뇌하수체선종 (Pituitary adenoma)','시신경교종 (Optic nerve glioma)'],3,
 visual=V('MR · CT (학습지 684쪽 원문)','bt25_18.jpg'),caveat='복원자: 문제를 정확히 기억하지 못해 23 객60을 참고해 재구성(사진 4개 중 1개 복원 못함).',basis=CRANIO,exps=['CSF 신호.','성인 hemisphere.','정답 — suprasellar, solid+cyst, 석회화.','성인, 낭종·석회화 없음.','시신경.']),
Y(W('2023 객59','684'),'다음은 조영증강 자기공명영상 사진들이다. 청력감소와 가장 관련이 높은 종양은?',['①','②','③','④','⑤'],4,
 visual=V('조영증강 MRI ①–⑤ (학습지 684쪽 원문)','bt23_59.jpg'),basis='복원자: internal auditory meatus의 ice cream cone 모양 — 수업 마지막 퀴즈로도. '+SCH,exps=['rim enhancement.','아님.','아님.','정답 — vestibular schwannoma.','lymphoma.']),
Y(W('2023 객60','685'),'15세 남자 환자가 두통과 시야장애를 주소로 내원하였다. 조영증강전 CT영상과 조영증강후 MR영상이다. 가장 가능성이 높은 진단명은?',['뇌하수체선종 (Pituitary adenoma)','두개인두종 (Craniopharyngioma)','시신경교종 (Optic nerve glioma)','교모세포종 (Glioblastoma)','지주막낭종 (Arachnoid cyst)'],2,
 visual=V('조영 전 CT · 조영증강 MR (학습지 685쪽 원문)','bt23_60.jpg'),basis=CRANIO,exps=['성인.','정답.','아님.','성인 hemisphere.','CSF 신호.']),
Y(W('2022 객29','685'),'50대 여자환자가 두통을 이유로 찾아왔다. 뇌 자기공명영상을 보았을 때 가능한 질환의 조합으로 옳은 것은? ㉠ 수막종(meningioma) ㉡ 교모세포종(glioblastoma) ㉢ 전이암(metastasis) ㉣ 면역억제상태인 림프종 환자 (lymphoma in immunocompromised patient) ㉤ 두개인두종(craniopharyngioma)',['㉠, ㉡, ㉢','㉠, ㉡, ㉣','㉡, ㉢, ㉣','㉡, ㉢, ㉣, ㉤','㉠, ㉡, ㉢, ㉣, ㉤'],3,
 visual=V('T1 조영증강 · DWI (학습지 685쪽 — 복원자가 비슷한 사진으로 대체)','bt22_29.jpg'),caveat='복원자: 강의록에 없는 사진이 나와 비슷한 사진으로 구글링.',basis='복원자: ring enhancing lesion 감별. '+RING+' '+META,exps=['수막종은 homogeneous.','수막종 X.','정답 — GBM·전이·AIDS 림프종.','두개인두종 X.','아님.']),
Y(W('2022 객30','686'),'66세 남자 환자가 4개월 전부터 우측 얼굴의 통증과 감각이상을 호소하였다. 평소에도 두통과 어지럼증이 있었다. 다음은 환자의 자기공명영상이다. 가장 가능성 높은 진단명은?',['이차 신경교종','수막종 (Meningioma)','전정신경초종 (Vestibular scwannoma)','삼차신경초종 (Trigeminal scwannoma)','??'],4,
 visual=V('MRI (학습지 686쪽 원문)','bt22_30.jpg'),caveat='복원자: 사진이 이 사진인지 확실치 않음, ⑤ 보기는 복원 못함.',basis=SCH,exps=['아님.','아님.','IAC·청력.','정답 — pons 앞→Meckel cave, 얼굴 감각.','복원 안 됨.']),
Y(W('2022 객33','686'),'다음 병변의 소견은?',['Glioblastoma','Lymphoma','Brain abscess','Neurocysticercosis','Tumefactive demyelinating disease'],3,
 visual=V('T2WI · CE T1 · DWI (학습지 686쪽 원문)','bt22_33.jpg'),caveat='복원자: 실제 시험에는 MRI sequence 표시가 없었음.',basis='복원자: 강의록 brain abscess 사진 그대로. '+RING,exps=ABS_E),
Y(W('2021 객5','687'),'두통으로 51세 여자환자가 병원에 왔다. 조영 전 컴퓨터 단층촬영에서 high density를 보이는 병변이 발견되었다. 가장 가능성 있는 진단은 무엇인가?',['급성 출혈','석회화','조영제','수막종','지방종'],4,
 visual=V('조영 전 CT (학습지 687쪽 — 복원자가 수막종으로 검색한 유사 사진)','bt21_5.jpg'),basis=MEN+' '+INNER,exps=['위치·모양이 다름.','아님.','조영 전.','정답 — high cellularity.','저음영.']),
Y(W('2021 객23','687'),'다음 환자의 영상에서 보이는 병변의 진단명은?',['Astrocytoma','Oigodendroglioma','Meningioma','Glioblastoma','brain abscess'],3,prof=JKH,
 visual=V('MRI (학습지 687쪽 원문)','bt21_23.jpg'),basis='복원자: 야마에 자주 나옴. '+MEN,exps=['축내.','석회화.','정답.','괴사·rim.','ring.']),
Y(W('2021 객33','687–688'),'다음 영상 소견에 해당하는 원인 질환은?',['aneurysm','hypertensive hemorrhage','결핵성 수막염','SAH','AVM'],3,prof=JKH,scope=True,
 visual=V('조영증강 MRI (학습지 688쪽 원문)','bt21_33.jpg'),basis='복원자: basal cistern·midbrain 뒤 지저분한 조영증강, tuberculoma. '+OUT+'(감염 영상 시간 내용).',exps=['아님.','아님.','정답.','아님.','아님.']),
Y(W('2020 객3','688'),'다음 MR은 무엇인가?',['Acute infarction','glioblastoma multiforme','subarachnoid hemorrhage','meningioma','metastatsis tumor'],2,prof=JKH,
 visual=V('MR (학습지 688쪽 원문)','bt20_3.jpg'),basis='복원자: 강의록 사진 그대로. '+GLIOMA,exps=['아님.','정답 — 괴사, 부종.','아님.','축외.','작고 다발.']),
Y(W('2018 객56','688–689'),MEN_ST,MEN5,4,prof=JKH,visual=V('MR (학습지 689쪽 원문)','bt18_56.jpg'),basis='복원자: 킹야. '+MEN,exps=MEN5E),
Y(W('2016 객2','689'),'다음 영상으로 알 수 있는 질환은 무엇인가?',['Metastasis','Glioblastoma multiforme','Brain abscess','Tuberculosis','Hemorrhagic infarction'],3,prof=JKH,
 visual=V('조영증강 CT (학습지 689쪽 원문)','bt16_2.jpg'),basis='복원자: 경계가 깨끗하고 명확한 ring, DWI 없이 출제. '+RING,exps=['작고 다발.','두껍고 불규칙.','정답.','아님.','아님.']),
Y(W('2016 객3','690'),MEN_ST,MEN5,2,prof=JKH,visual=V('MR (학습지 690쪽 — 복원자가 강의록 사진을 기억나는 대로 편집)','bt16_3.jpg'),caveat='복원자: 시험지 사진을 가져오지 못해 강의록 사진을 편집함 — 실제 시험에는 비어 있는 듯한 저음영 영상이 나옴.',basis='복원자: 큰 결절성, 대뇌반구 피질 침범. '+GLIOMA,exps=['불규칙·괴사.','정답.','다발.','축외.','아님.']),
Y(W('2016 객5','691'),'다음 영상의 병변과 가장 관련이 있는 질환은?',['Metastasis','Sturge-weber syndrome','Tuberculosis','Tuberous sclerosis','Hemorrhagic infarction'],1,prof=JKH,keep_excluded=True,
 visual=V('학습지 691쪽 — 시험 사진 대신 강의 필기 사진','bt16_5.jpg'),caveat='복원자: 시험 때 사진은 복원되지 못함(강의록 사진 참조) — 채점 제외.',basis=META,exps=['정답.','아님.','아님.','아님.','아님.']),
Y(W('2014 객15','691'),'아래 그림에 해당하는 질환은?',['Infarction','Hemorrhage','Metastasis','Meningioma','Oligodendroglioma'],4,prof=JKH,visual=V('MR (학습지 691쪽 원문)','bt14_15.jpg'),basis=MEN,exps=['아님.','아님.','아님.','정답.','아님.']),
Y(W('2013 객18','691–692'),'다음 영상으로 알 수 있는 질환은 무었인가?',['Brain abscess','Metastasis','Schwannoma','Glioblastoma multiforme','Meningioma'],4,prof=JKH,visual=V('MR (학습지 692쪽 원문)','bt13_18.jpg'),basis=GLIOMA,exps=['얇은 ring.','작고 다발.','CN.','정답.','축외.']),
Y(W('2012 객37','692'),'다음 중 extra-axial tumor를 고르시오',['①','②','③','④','⑤'],2,prof=JKH,
 visual=V('영상 ①–⑤ (학습지 692쪽 원문)','bt12_37a.jpg','bt12_37b.jpg'),basis='복원자: ② CSF가 따라 들어와 있고 뇌 밖의 신경에 생긴 종양. '+AXIS,exps=['GBM CT.','정답.','GBM T2.','oligodendroglioma.','abscess CT.']),
Y(W('2011 객3','693'),'화살표와 관계있는 것은?',['Brain cyst','Recent hemorrhage','Calcification','Blood flow','Fat'],3,prof=JKH,scope=True,
 visual=V('CT · MR (학습지 693쪽 원문)','bt11_3.jpg'),basis='복원자: tuberous sclerosis — 뇌실 주변 석회화. '+OUT+'(선천성 영상 시간 내용).',exps=['아님.','아님.','정답.','아님.','아님.']),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR(FQ+' 변형','rim-enhancing 종괴에서 농양과 악성 종양을 감별하는 데 가장 유용한 MRI 기법은?',['DWI','T1WI','T2*GRE','MR angiography','FLAIR'],1,RING,['정답 — 농양 중심 DWI 고신호.','아님.','출혈.','혈관.','아님.']),
VR('2025 객18 변형','adamantinomatous craniopharyngioma의 영상 특징 4가지에 해당하지 않는 것은?',['성인에서 대부분 발생','5–15세 소아','suprasellar','solid + cyst','석회화'],1,CRANIO,['정답 — papillary형.','특징.','특징.','특징.','특징.']),
VR('2023 객59 변형','vestibular schwannoma의 특징적 모양은?',['Ice cream cone','Butterfly','Target','Dural tail','Punch-out'],1,SCH,['정답.','GBM(뇌량).','결핵.','수막종.','skull meta.']),
VR('2022 객29 변형','악성 종양임에도 괴사가 없어 강하고 균일한 조영증강을 보이는 것은?',['Lymphoma','Glioblastoma','Metastasis','Oligodendroglioma','Astrocytoma grade 4'],1,LYM,['정답.','괴사.','괴사 가능.','석회화.','괴사.']),
VR('2022 객30 변형','뇌신경 schwannoma의 빈도 순서로 옳은 것은?',['CN8 > CN5 > CN7','CN5 > CN8 > CN7','CN7 > CN8 > CN5','CN3 > CN8','CN2 > CN8'],1,SCH,['정답.','아님.','아님.','아님.','아님.']),
VR('2022 객33 변형','DWI에서 rim-enhancing 병변의 중심부가 저신호이면 시사하는 것은?',['종양 괴사(glioblastoma·전이암)','뇌농양','급성 경색','출혈','지방'],1,RING,['정답.','고신호.','아님.','아님.','아님.']),
VR('2021 객5 변형','조영 전 CT에서 수막종이 약간 고음영으로 보이는 이유는?',['세포충실도가 높아서','석회화가 없어서','괴사 때문','지방 함유','CSF 때문'],1,MEN+' '+INNER,['정답.','아님.','아님.','아님.','아님.']),
VR('2021 객23 변형','축외(extra-axial) 종양의 영상 소견이 아닌 것은?',['종양과 백질 사이에 피질이 없음','CSF cleft sign','dural tail sign','broad dural base','vessels sign'],1,AXIS,['정답 — cortex sign은 피질이 보이는 것.','소견.','소견.','소견.','소견.']),
VR('2020 객3 변형','Glioblastoma의 영상 소견으로 옳지 않은 것은?',['석회화가 특징적이다','중심 괴사와 두꺼운 불규칙 rim enhancement','뇌량을 통해 반대편으로 넘어감','출혈 동반 가능','rCBV 증가'],1,GLIOMA,['틀리다(정답) — oligodendroglioma.','옳다.','옳다.','옳다.','옳다.']),
VR('2016 객3 변형','성인 frontal lobe의 cortical–subcortical 종괴로 석회화가 흔하고 seizure를 일으키는 종양은?',['Oligodendroglioma','Glioblastoma','Lymphoma','Meningioma','Metastasis'],1,GLIOMA,['정답 — IDH-mutant + 1p/19q codeleted.','괴사.','균일 조영.','축외.','다발.']),
VR('2012 객37 변형','다음 중 축외(extra-axial) 종양은?',['Meningioma','Glioblastoma','Oligodendroglioma','Astrocytoma','Lymphoma'],1,AXIS,['정답.','축내.','축내.','축내.','축내.']),
]
P=HSB; S3='STT 10/7 3교시'
TY=[
T(P,S3+' 02:59','교수님이 실제 시험·판독에서 가장 중요하다고 한 부분은?',['흔한 뇌종양의 영상 소견','WHO 분류 전체','MRS 원리','tractography','DTI 수술 계획'],'STT 02:59.',['정답.','알 필요 없음.','아님.','제한적.','제한적.']),
T(P,S3+' 04:58','MRI보다 CT가 좋은 점 3가지가 아닌 것은?',['종양 내 출혈','skull bone metastasis','인접 뼈의 hyperostosis','종양 내 석회화','인접 뼈의 erosion'],TECH,['정답 — 출혈은 MRI(T2*·SWI)에서 잘 보임.','CT.','CT.','CT.','CT.']),
T(P,S3+' 08:34','종괴와 부종 사이에 정상 피질이 보이면?',['축외 종괴','축내 종괴','괴사','출혈','석회화'],AXIS,['정답 — 부종은 백질에만.','아님.','아님.','아님.','아님.']),
T(P,S3+' 09:26','세포가 빽빽한(cellularity↑) 종양의 신호 변화로 옳은 것은?',['CT 음영↑, T2 신호↓, DWI 신호↑','CT↓, T2↑, DWI↓','모두 ↑','모두 ↓','변화 없음'],INNER,['정답.','저세포.','아님.','아님.','아님.']),
T(P,S3+' 16:07','뇌종양을 보면 가장 먼저 생각하라고 한 두 가지는?',['나이와 위치','조영증강과 출혈','DWI와 rCBV','석회화와 낭종','크기와 개수'],AGE,['정답.','④단계.','④단계.','④단계.','아님.']),
T(P,S3+' 21:35','빈도상 뇌에서 가장 흔한 종양(원발·속발 통틀어)은?',['전이암','교모세포종','수막종','림프종','신경초종'],META,['정답.','원발 악성 중.','양성 중.','아님.','아님.']),
T(P,S3+' 30:07','vestibular schwannoma가 ice cream cone 모양이 되는 이유는?',['IAC 안은 뼈로 둘러싸여 못 커지고 CPA cistern 쪽으로 커져서','뇌량을 넘어서','괴사 때문','석회화','dural tail'],SCH,['정답.','아님.','아님.','아님.','아님.']),
T(P,S3+' 32:59','arachnoid cyst가 압도적으로 많이 생기는 위치는?',['middle cranial fossa(temporal)와 posterior fossa','sella','lateral ventricle','frontal convexity','pons'],CRANIO,['정답.','아님.','아님.','드묾.','아님.']),
T(P,S3+' 36:20','조영되지 않는 부분을 둘러싼 rim-enhancing 패턴에서 꼭 기억하라고 한 것은?',['악성 종양(괴사)을 시사하는 대표 소견','항상 농양','항상 양성','석회화','출혈'],RING,['정답.','다른 원인도 있으나 이후 수업.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 4쪽','glioma grading에 도움이 되는 advanced MRI 기법은?',['PWI와 MR spectroscopy','T1WI','CT','SWI','tractography'],1,TECH,['정답.','conventional.','아님.','출혈.','백질로.']),
Q('강의록 5쪽','종양 내 석회화를 잘 동반해 CT가 단서가 되는 종양은?',['Oligodendroglioma','Lymphoma','Glioblastoma','Arachnoid cyst','Metastasis'],1,TECH,['정답(adamantinomatous craniopharyngioma·meningioma도).','균일 조영.','석회화 드묾.','CSF.','아님.']),
Q('강의록 13쪽','낭종이 T1WI에서 고신호로 보이는 경우는?',['고단백 또는 아급성 출혈(MetHb) 동반','순수한 CSF','석회화','지방 없음','공기'],1,INNER,['정답.','T1 low.','아님.','아님.','아님.']),
Q('강의록 15쪽','출혈을 잘 동반하는 종양이 아닌 것은?',['Arachnoid cyst','Glioblastoma','Metastasis','Oligodendroglioma','Pituitary adenoma'],1,INNER,['정답.','출혈.','출혈.','출혈.','출혈.']),
Q('강의록 19쪽','IDH-mutant + 1p/19q-codeleted인 종양은?',['Oligodendroglioma','Glioblastoma','Astrocytoma','Lymphoma','Meningioma'],1,GLIOMA,['정답.','IDH-wildtype.','IDH-mutant만.','아님.','아님.']),
Q('강의록 22쪽','6세 아이의 4th ventricle 종양으로 먼저 생각할 것은?',['Medulloblastoma, ependymoma','Glioblastoma','Meningioma','Central neurocytoma','Pituitary adenoma'],1,AGE,['정답.','성인.','성인 축외.','45세 lateral ventricle.','성인 sella.']),
Q('강의록 24쪽','Astrocytoma IDH-mutant에서 grade가 높아질수록 나타나는 변화가 아닌 것은?',['DWI 신호 감소','조영증강 증가','rCBV 증가','괴사 출현(grade 4)','BBB 파괴 증가'],1,GLIOMA,['정답 — DWI↑.','옳다.','옳다.','옳다.','옳다.']),
Q('강의록 31쪽','유방암 뇌전이가 잘 침범하는 곳은?',['leptomeninges와 뇌신경','pachymeninges','skull만','pons','소뇌만'],1,META,['정답.','폐암.','아님.','아님.','아님.']),
Q('강의록 32쪽','skull의 다발성 punch-out defect의 감별진단이 아닌 것은?',['Meningioma','Metastasis','Multiple myeloma','Langerhans cell histiocytosis','Paget disease(osteolytic)'],1,META,['정답 — hyperostosis.','감별.','감별.','감별.','감별.']),
Q('강의록 35쪽','수막종에서 인접 두개골의 hyperostosis 빈도는?',['약 20%','약 90%','약 1%','100%','약 50%'],1,MEN,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 41쪽','성인에서 대부분 발생하며 대부분 solid이고 석회화가 드문 두개인두종은?',['Papillary craniopharyngioma','Adamantinomatous craniopharyngioma','Pituitary adenoma','Arachnoid cyst','Germinoma'],1,CRANIO,['정답.','소아·석회화.','다른 종양.','낭종.','아님.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
