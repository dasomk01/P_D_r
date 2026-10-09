"""10/7 5교시 척추질환 영상 (황승배) — 강의록 '척주질환 영상'(44쪽) · STT('6교시 황승배' 파일 — Somed에 5교시 자료로 올라옴) · 학습지 656–664쪽.
STT 05:33: 퇴행성 척추 질환은 "시험에 낼 건 없다" — 다만 강의록에 있어 범위 안으로 둠. 2017 객3은 학습지에 보기 사진·정답이 없어 채점 제외.
2015 객28·29는 정경호 교수님 문제. 문제 사진은 학습지 원본(복원자 화살표 포함), 강의 퀴즈 사진은 강의록 43쪽 원본."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-050',prof='황승배',date='10/7',title='척추질환 영상',period='5교시')
HSB='황승배'; JKH='정경호'
def V(t,*f): return vis(t,*f)

MOD='강의록 3쪽·STT 00:06–01:58: X-ray — 정렬(굴곡/신전 촬영으로 동적 불안정성), 척추체 높이, 퇴행성 변화, 큰 골절; CT — 급성 외상의 자세한 골절, 피질골·인대 골화, 감염·종양의 골파괴; MRI — 척수·신경근·추간판·인대·근육, 감염·종양·골수 병변(골파괴 전 초기 병변).'
TRA='강의록 5–9쪽·STT 01:58–05:33: 외상에서 볼 것 — alignment, bone, spinal canal, cord/nerve. Denis 3 column — middle column이 안정성에 가장 중요. 압박골절 — T10–L2(흉요추 이행부), 굴곡 손상, 높이 감소·CT fracture line, MR은 골수 부종(T1 저·T2 고신호)·조영증강(단순 압박골절엔 MRI 불필요). 분쇄골절(burst) — 골편이 척추관으로 밀려 신경학적 결손 가능. C5/6 dislocation.'
DEG='강의록 10–20쪽·STT 05:33–13:07: 퇴행성 — 추간판(높이 감소, vacuum phenomenon, T2 신호 감소), 척추체(osteophyte, C-spine uncovertebral joint 비대 → 신경공 협착·radiculopathy, subchondral sclerosis, 골수 신호 변화), facet joint OA(관절간격 감소·경화·골극·vacuum·erosion/cyst·비대), 인대(황색인대·ALL·PLL 비후·골화 — OPLL은 경추 호발, 척수 압박). 합병증 — disc herniation(요추 > 경추 > 흉추, MRI 최선), alignment 이상(퇴행성 전방전위증 — 아래 척추 기준, 후방전위증), 척추관 협착 → compressive myelopathy(hand clumsiness·보행장애·위약·저림). 석회화·골화는 X-ray·CT, 비후는 MRI가 잘 보임.'
LYS='강의록 21–23쪽·STT 13:07–15:47: 척추분리증(spondylolysis) — pars interarticularis 결손, 척추체 전위 없음, 요추 압도적, oblique X-ray에서 "neck of a Scottie dog"를 관통하는 투명한 선. Isthmic spondylolisthesis = 분리증 + 전방전위증.'
INF='강의록 24–27쪽·STT 15:47–18:37: 감염성 척추염 — 추간판과 척추체 침범으로 추간판 공간 협소 + 인접 척추뼈 불규칙 파괴 ± paravertebral abscess; 심하면 척추체 붕괴(압박골절과 감별); 인접 척추로 연속 확산; pyogenic은 초기 추간판 침범, TB는 paravertebral abscess를 더 잘 만듦(영상만으로 감별 어려움, 균 동정). 소견 — 척추체·종판 파괴, 종판 골용해/경화, 추간판 협소, 척추주위 연부조직 염증·농양.'
TUM='강의록 28–35쪽·STT 18:37–26:04: 척수내(intramedullary) — ependymoma, astrocytoma, hemangioblastoma(척수 팽대·조영증강 종괴, 부종·syrinx); 경막내 척수외(intradural extramedullary) — nerve sheath tumor(schwannoma·neurofibroma; 낭성 변화로 heterogeneous, 신경공으로 확장), meningioma(척수를 한쪽으로 압박, 균일 신호·조영, 관 안에만); 경막외(extradural) — metastasis, multiple myeloma, lymphoma, LCH, hemangioma(다발성 골용해, 압박골절 형태, 연부조직 종괴). 척추체 붕괴 감별 — 외상(병력, 높이만 감소), 감염(인접 2개 척추·추간판 협소·pedicle 보존), 종양(pedicle 등 후방 요소 침범, 추간판 정상 — 혈관 없음, multiple skip lesion).'
MYE='강의록 36–41쪽·STT 27:05–33:15: 척수병증 원인 — 탈수초(MS·NMOSD·MOGAD·ADEM), 전신염증, 감염, 특발성 ATM, 혈관(경색·dural AVF), 대사(B12 결핍 SCD), 종양 등. Idiopathic ATM — 긴 분절(3–4 척추 이상), 중심부, 단면적 2/3 이상, steroid. MS — 짧은 분절, 단면 1/2 미만, 말초 백질(특히 dorsolateral). NMOSD/MOGAD — 영상은 ATM과 비슷, 시신경염 동반. 척수경색 — 갑작스런 발병, anterior spinal artery → 앞쪽(ventral) 병변, owl-eye/snake-eye, DWI.'
OUT='오늘(10/7) 척추 영상 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',HSB); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',HSB); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

FQ='2026.10.7 척추질환 영상 강의록 43–44쪽 Quiz'
INF5=['압박골절','척추분리증','퇴행성 척추증','감염성 척추증','척추전위증']
INF5E=['외상력·높이만 감소.','pars 결손.','아님.','정답 — 인접 척추·추간판 파괴.','아님.']
DEG_ST='다음 중 퇴행성 척추 질환의 영상 소견으로'

YAMA=[
Y(FQ,'80세 여자 환자가 약 2개월전부터 허리 부위에 통증이 시작되었고 양측 하지가 저리가 힘이 빠진다고 하였으며 간헐적으로 열이 났다고 한다. 최근에 외상은 없었으며, 과거에 척추 수술한 것 외에 다른 기왕력은 없었다. 다음은 CT와 MRI(T2강조영상 & 조영증강영상)이다. 가장 가능성 높은 진단은?',['Metastasis','Multiple myeloma','Infectious spondylitis','Ossification of posterior longitudinal ligament','Burst fracture'],3,
 visual=V('CT · T2WI · 조영증강 (강의록 43쪽 원본)','spq.jpg'),caveat='강의록에 정답 표시 없음 — STT 34:08 정답 언급이 불분명하게 녹취됨; 발열·인접 척추와 추간판 파괴·척추주위 염증으로 ③.',basis=INF+' '+TUM,exps=['추간판 보존·pedicle 침범.','다발성 골용해.','정답.','인대 골화.','외상력 없음.']),
Y(W('2022 객32','657'),'다음 중 infectious spondylitis의 영상은?',['①','②','③','④','⑤'],5,
 visual=V('영상 ①–⑤ (학습지 657쪽 원문 — 시험엔 화살표 없음)','sp22_32.jpg'),basis='복원자: 시험 전날 수업에서 많이 강조한 티야, 강의록 사진에서만 출제. '+INF,exps=['isthmic spondylolisthesis.','OPLL.','burst fracture.','meningioma.','정답.']),
Y(W('2021 객42','657–658'),'퇴행성 척추 질환이 아닌 것은?',['①','②','③','④','⑤'],2,
 visual=V('영상 ①–⑤ 순서대로 (학습지 657–658쪽 원문 — 시험엔 화살표 없음)','sp21_42_1.jpg','sp21_42_2.jpg','sp21_42_3.jpg','sp21_42_4.jpg','sp21_42_5.jpg'),basis=DEG+' '+TRA,exps=['OPLL — 퇴행성.','정답 — burst fracture(외상).','osteophyte.','subchondral sclerosis.','disc herniation.']),
S(W('2017 객3','659'),'다음 중 감염성 척추염 영상을 고르시오. (보기는 사진으로만 제시)','감염성 척추염 영상 — 인접 추간판 협소·소실, 척추체 파괴, 종판 골용해/경화, 연부조직 부종',keep_excluded=True,caveat='복원자: 보기 사진이 복원되지 않았고 정답 칸도 비어 있어 채점 제외.',basis=INF),
Y(W('2015 객28','660'),'다음 영상에서 나타나는 소견을 바탕으로 이 환자의 진단명은?',['압박골절','척추분리증','퇴행성 척추증','감염성 척추증','천추전위증'],4,prof=JKH,
 visual=V('MRI (학습지 660쪽 원문)','sp15_28.jpg'),basis='복원자: 강의록 사진 그대로. '+INF,exps=INF5E),
Y(W('2015 객29','660'),'다음 영상에서 나타나는 소견으로 옳은 것은?',['T1 강조 영상이다.','퇴행성 척추전방전위증','Degenerative cord change','Compression failure','Neck of a scottie dog defect'],3,prof=JKH,
 visual=V('MRI (학습지 660쪽 원문)','sp15_29.jpg'),caveat='주어진 답 ③ 유지 — 복원 해설은 "물이 빠져 T2에서 검게 보이는 disc의 퇴행성 변화·bony spur"를 설명함(보기 표현은 "cord").',basis='복원자: 강의록 사진 그대로. '+DEG,exps=['T2WI.','전위 없음.','정답(주어진 답) — 추간판 퇴행성 변화.','아님.','oblique X-ray 소견.']),
Y(W('2014 객2','661'),'48세 남자가 back pain을 주소로 내원하였다. CT와 조영제 MRI를 찍은 결과, 다음과 같은 소견을 나타내었다. 이 환자의 진단명은?',INF5,4,
 visual=V('CT · 조영증강 MRI (학습지 661쪽 원문)','sp14_2.jpg'),basis='복원자: 강의록 사진 그대로. '+INF,exps=INF5E),
Y(W('2013 객20','661'),'다음 영상에서 알 수 있는 소견은?',['Vertebral metastasis','Compression fracture','Burst fracture','Spondylolysis','Infectious spondylitis'],3,
 visual=V('CT · MRI (학습지 661쪽 원문)','sp13_20.jpg'),basis='복원자: 골편이 척추관으로. '+TRA,exps=['pedicle 파괴.','골편 이동 없음.','정답.','pars 결손.','추간판 파괴.']),
Y(W('2013 객21','662'),'다음 중 척추 및 척수종양에 대한 설명으로 옳은 것은?',['척추 전이암(vertebral metastasis)은 pedicle과 intervertebral disc를 잘 침범한다.','척추 혈관종(vertebral hemangioma)은 압박골절을 흔히 일으킨다.','수막종(meningioma)은 경막외종양(extradural tumor)에 속한다.','림프종(lymphoma)은 경막내-척수외 종양 (intradural-extramedullary tumor)에 속한다.','상의세포종(ependymoma)은 척수공동증(syrinx)을 동반하여 척수 내에 생기는 종양이다.'],5,
 basis=TUM,exps=['disc는 정상.','압박골절은 경막외 종양 일반 소견.','경막내 척수외.','경막외.','정답.']),
Y(W('2012 객3','662–663'),'다음 영상을 보고 알맞은 진단명은?',['Spondylolithesis (척추전방전위증)','Spondylolysis (척추분리증)','Metastasis','Fracture (척추골절)','Infectious spondylitis (척추염증)'],2,
 visual=V('X-ray · CT (학습지 663쪽 원문)','sp12_3.jpg'),basis=LYS,exps=['전위 없음.','정답 — pars 결손.','아님.','아님.','아님.']),
Y(W('2012 객4','663'),DEG_ST+' 맞지 않는 것은?',['연골단판의 골경화 (subchondral sclerosis)','골증식체 형성 (osteophyte formation)','MRI상 추체내 골수 신호강도 변화','MRI상 추간판내 공기음영(vacuum phenomenon)이 보이지 않는다.','MRI T2WI 상에서 추간판의 수핵 신호가 감소'],4,
 basis=DEG,exps=['소견.','소견.','소견.','틀리다(정답) — vacuum phenomenon은 퇴행성 소견.','소견.']),
Y(W('2011 객37','663–664'),DEG_ST+' 맞는 것은?',['추간판 높이의 증가','MRI상 T2 강조영상에서 추간판내 수핵 신호강도의 증가','MRI상 T1 강조영상에서 추간판내 수핵 신호강도의 증가','척추종판(endllate)의 가장자리에 골증식체(osteophyte) 형성','추간판내 vaccum 현상을 관찰하는데는 단순촬영이나 CT보다 MRI가 우수'],4,
 basis=DEG,exps=['감소.','감소.','아님.','정답.','CT가 우수.']),
Y(W('2011 객38','664'),'다음은 척추의 단순촬영사진이다. 가장 적절한 진단명은?',['척추골절 (Fracture)','전이암 (Metastasis)','척추 분리증 (Spondylolysis)','척추 전방 전위증 (Spondylolithesis)','감염섬 척추염 (Pyogenic spondylitis)'],2,
 visual=V('단순촬영 AP (학습지 664쪽 원문)','sp11_38.jpg'),basis='복원자: 강의록 그림과 동일 — pedicle 소실(winking owl). STT 24:07–25:07. '+TUM,exps=['아님.','정답 — 한쪽 pedicle 안 보임.','아님.','아님.','pedicle 보존.']),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR(FQ+' 변형','척추체 붕괴에서 종양보다 감염성 척추염을 시사하는 소견은?',['인접 2개 척추와 추간판 공간 협소','pedicle 파괴','multiple skip lesion','추간판 정상','후방 요소 침범'],1,TUM+' '+INF,['정답.','종양.','종양.','종양.','종양.']),
VR('2022 객32 변형','결핵성 척추염이 화농성보다 더 잘 보이는 소견은?',['paravertebral abscess 형성','초기 추간판 침범','pedicle 파괴','skip lesion','vacuum phenomenon'],1,INF,['정답.','화농성.','종양.','종양.','퇴행성.']),
VR('2021 객42 변형','퇴행성 척추 질환의 인대 변화로 척수 압박과 신경학적 증상을 일으키며 경추에 호발하는 것은?',['OPLL','ALL 골화','극간인대 파열','황색인대 위축','vacuum phenomenon'],1,DEG,['정답.','앞쪽 — 증상 적음.','아님.','비후가 문제.','추간판.']),
VR('2015 객29 변형','퇴행성 추간판의 MRI 소견은?',['T2WI에서 신호 감소','T2WI에서 신호 증가','높이 증가','조영증강','T1 고신호'],1,DEG,['정답 — 수분 감소.','반대.','반대.','아님.','아님.']),
VR('2013 객20 변형','분쇄골절(burst fracture)이 압박골절보다 위험한 이유는?',['골편이 척추관으로 밀려 척수를 압박해 신경학적 결손 가능','통증이 없음','항상 경추','MRI로만 보임','골수 부종이 없음'],1,TRA,['정답.','아님.','아님.','아님.','아님.']),
VR('2013 객21 변형','경막내 척수외(intradural extramedullary) 종양은?',['Meningioma','Ependymoma','Astrocytoma','Metastasis','Multiple myeloma'],1,TUM,['정답(신경초종도).','척수내.','척수내.','경막외.','경막외.']),
VR('2012 객3 변형','척추분리증의 oblique X-ray 소견은?',['Neck of a Scottie dog를 관통하는 투명한 선','Owl-eye sign','Molar tooth sign','Ice cream cone','Vacuum phenomenon'],1,LYS,['정답.','척수경색.','Joubert.','VS.','퇴행성.']),
VR('2012 객4 변형','퇴행성 척추 질환의 척추체 변화가 아닌 것은?',['pedicle 파괴','osteophyte','subchondral sclerosis','골수 신호 변화','uncovertebral joint 비대'],1,DEG+' '+TUM,['정답 — 종양.','퇴행성.','퇴행성.','퇴행성.','퇴행성(경추).']),
VR('2011 객38 변형','척추 전이암의 영상 특징이 아닌 것은?',['추간판 공간 협소','pedicle 침범','multiple skip lesion','후방 요소 침범','압박골절 형태'],1,TUM,['정답 — 감염.','특징.','특징.','특징.','특징.']),
]
P=HSB; S5='STT 10/7 5교시(파일명 6교시)'
TY=[
T(P,'STT 10/7 5교시 01:58','Denis 3 column 중 골절 시 불안정성이 가장 심한 것은?',['Middle column','Anterior column','Posterior column','Transverse process','Spinous process'],TRA,['정답.','덜함.','덜함.','아님.','아님.']),
T(P,'STT 10/7 5교시 03:44','단순 압박골절에서 MRI에 대해 교수님이 한 말은?',['일반적으로 불필요 — CT까지만','반드시 필요','X-ray 불필요','조영제 필수','PET 필요'],TRA,['정답.','아님.','아님.','아님.','아님.']),
T(P,'STT 10/7 5교시 05:33','교수님이 "시험에 낼 건 없다"고 한 부분은?',['퇴행성 척추 질환','감염성 척추염','척추체 붕괴 감별','척수병증','분쇄골절'],DEG,['정답 — 나이 든 사람 99.5%에서 보이는 소견.','강조.','강조.','강조.','강조.']),
T(P,'STT 10/7 5교시 14:06','척추분리증을 단순촬영으로 보려면 찍어야 하는 것은?',['Oblique view','AP view','Lateral만','Flexion만','Odontoid view'],LYS,['정답.','아님.','겹쳐 어려움.','아님.','아님.']),
T(P,'STT 10/7 5교시 17:39','감염성 척추염의 확산 양상은?',['인접한 위아래로 연속적으로 퍼짐','건너뛰며(skip) 퍼짐','pedicle만','추간판 보존','원격 전이'],INF,['정답.','종양.','종양.','종양.','아님.']),
T(P,'STT 10/7 5교시 19:33','척수내·경막외 종양 영상에 대해 교수님이 한 말은?',['종류 이름 정도만 알면 되고 영상 감별은 무리','모두 영상으로 감별해야','시험 필수','MRS 필수','조직검사 불필요'],TUM,['정답.','아님.','아님.','아님.','아님.']),
T(P,'STT 10/7 5교시 22:21','신경공(neural foramen)으로 확장되는 경막내 척수외 종양은?',['신경초종(neurogenic tumor)','수막종','ependymoma','astrocytoma','metastasis'],TUM,['정답.','관 안에만.','척수내.','척수내.','경막외.']),
T(P,'STT 10/7 5교시 26:04','종양이 추간판에 생기지 않는 이유는?',['추간판에는 혈관이 없어서','추간판이 단단해서','추간판이 크지 않아서','면역 때문','신경이 없어서'],TUM,['정답.','아님.','아님.','아님.','아님.']),
T(P,'STT 10/7 5교시 27:54','척수의 긴 분절(3–4 척추 이상)과 단면 2/3 이상 침범, steroid에 잘 반응하는 것은?',['Idiopathic acute transverse myelitis','MS','척수경색','ependymoma','OPLL'],MYE,['정답.','짧은 분절.','앞쪽·급성.','종양.','퇴행.']),
T(P,'STT 10/7 5교시 32:25','앞쪽에 치우친 owl-eye 병변을 보이는 척수경색에서 막히는 혈관은?',['Anterior spinal artery','Posterior spinal artery','Vertebral artery','Basilar artery','Radicular vein'],MYE,['정답.','잘 안 막힘.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 3쪽','척추 영상 검사 중 척수·신경근·추간판·골수 병변 평가에 가장 좋은 것은?',['MRI','X-ray','CT','초음파','혈관조영'],1,MOD,['정답.','정렬.','골절·골화.','아님.','아님.']),
Q('강의록 6쪽','압박골절이 가장 흔한 부위는?',['T10–L2(흉요추 이행부)','C1–2','L5–S1','T4–6','천추'],1,TRA,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 7쪽','급성 압박골절의 MRI 골수 신호는?',['T1 저신호, T2 고신호(부종)','T1 고신호','T2 저신호','변화 없음','지방 신호'],1,TRA,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 12쪽','추간판의 퇴행성 소견이 아닌 것은?',['추간판 높이 증가','vacuum phenomenon','T2 신호 감소','추간판 공간 협소','linear low SI'],1,DEG,['정답.','소견.','소견.','소견.','소견.']),
Q('강의록 17쪽','추간판 탈출증의 빈도 순서는?',['요추 > 경추 > 흉추','흉추 > 요추','경추 > 요추','모두 같음','흉추만'],1,DEG,['정답.','아님.','아님.','아님.','아님.']),
Q('강의록 29쪽','척수내(intramedullary) 종양이 아닌 것은?',['Schwannoma','Ependymoma','Astrocytoma','Hemangioblastoma','척수내 전이암'],1,TUM,['정답 — 경막내 척수외.','척수내.','척수내.','척수내.','척수내(기타).']),
Q('강의록 39쪽','MS 척수 병변의 특징은?',['짧은 분절, 단면 1/2 미만, 말초 백질(dorsolateral)','긴 분절, 중심부','앞쪽 owl-eye','척수 팽대 조영 종괴','경막외'],1,MYE,['정답.','ATM·NMOSD.','경색.','종양.','아님.']),
Q('강의록 40쪽','NMOSD/MOGAD를 ATM과 구별하는 단서는?',['시신경염·뇌 병변 동반','척수 영상의 길이','조영증강 유무','DWI','나이'],1,MYE,['정답 — 척수 영상만으로는 비슷.','비슷.','아님.','아님.','아님.']),
Q('강의록 41쪽','척수경색 진단에 가장 유용한 MRI 기법과 임상 특징은?',['DWI와 갑작스런 발병','T1과 서서히 진행','CT와 발열','X-ray와 외상','MRS와 만성'],1,MYE,['정답.','아님.','아님.','아님.','아님.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
