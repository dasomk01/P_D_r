"""10/6 2·3교시 척수 손상 · 척수(척추) 종양 (오영민) — 강의록 2교시(64쪽)·3교시(81쪽) · STT 2교시·3교시 · 학습지 465–493쪽.
2011–2019 기출 일부는 은종필 교수님이 같은 강의를 하던 해의 문제라 출제 교수를 따로 적음.
문제에 들어간 MRI·CT·X-ray·혈관조영·그림은 학습지 원본을 잘라 넣음(묘사 대신 원본)."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-043',prof='오영민',date='10/6',title='척수 손상 · 척수 종양',period='2·3교시')
OYM='오영민'; EJP='은종필'
def V(t,*f): return vis(t,*f)

EPI='2교시 강의록 2–5쪽: 발생 28–55명/100만, 남:여 4:1, 20–40대; 경추 55%·흉추 35%·요천추 10%; 교통사고 30–50%; 외상성 경수손상 3개월 사망률 20–21%(호흡기·심혈관 합병증); 기전 — 굴곡손상(가장 흔함)·신전·회전·압박·복합.'
SEC='2교시 강의록 6–8쪽: 일차 손상(직접 손상)은 되돌릴 수 없고, 이차 손상(저혈압·쇼크·저산소, ATP 고갈·free radical·lipid peroxidation·excitatory amino acid·Ca 과부하, 출혈·혈관연축·혈전·자가조절 상실, 염증)을 막는 것이 치료의 핵심(STT 06:41).'
INC=('2교시 강의록 11–22쪽: 전척수 증후군 — 굴곡손상, 전척수동맥 압박·척수 전방 압박; 병변 이하 양측 운동마비(CST), 양측 통각·온도 소실(lateral STT), pressure·touch 소실(anterior STT), 진동·위치감 보존(posterior column intact). '
 '후방척수 증후군 — 후척수동맥 손상; position·vibration·pressure 소실, 운동·통각 보존. '
 '중심척수 증후군 — 경추 과신전, C5/6/7 호발, 척추증·척추관 협착이 있는 중년·노인; 상지가 하지보다, 특히 손·손가락이 심한 마비(CST에서 상지 섬유가 안쪽), 양측 통각·온도 소실, 촉각·진동·위치 부분 보존(지각해리) — 임상적으로 가장 흔함(STT 10:05). '
 '측방척수(Brown-Séquard) 증후군 — 자상·총상·회전손상으로 한쪽만 손상; 동측 이하 운동마비, 동측 촉감·위치·진동 소실, 반대측 통각·온도 소실, 손상 부위 모든 감각 소실; 외상보다 척수 종양에서 주로 관찰(STT 16:00). 강의록 19쪽 증례: 68/M slip down 과신전, arm elevation G4, elbow·wrist G3, hand grasp G2, leg G5.')
MYEL='2교시 강의록 32쪽: Cervical myelopathy 확인 검사 — Lhermitte\'s sign, Hoffmann\'s sign, Babinski\'s sign, ankle clonus. Radiculopathy 확인 — Spurling\'s sign(C-spine), SLRT·FNST(L-spine). STT 21:26–22:18.'
KEY='2교시 강의록 30쪽 key muscle: C5 elbow flexor, C6 wrist extensor, C7 elbow extensor, C8 finger flexor, T1 finger abductor; L2 hip flexor, L3 knee extensor, L4 ankle dorsiflexor, L5 long toe extensor, S1 ankle plantar flexor. 31쪽 Frankel/ASIA A(운동·감각 없음)–E(정상).'
RESP='2교시 강의록 45쪽: 경추·상위 흉추 골절 — 늑간신경 마비로 흉곽 팽창 안 됨, 가래 못 뱉어 폐렴·호흡곤란; C3·4·5에서 시작하는 횡격신경 손상 시 매우 심한 호흡곤란으로 응급실 도착 전 사망 많음 → 삽관·인공호흡. STT 26:50.'
SHOCK='2교시 강의록 42–44쪽: 응급처치 — 고정, 저혈압(spinal shock) 교정(수축기 90 mmHg 이상), 기도, NG tube, Foley, 체온·전해질. Spinal shock — 완전 손상 직후 손상부위 이하 운동·감각·반사 일시 소실(LMN형 이완성 마비 → 수일–수주 후 반사항진), 교감신경 차단으로 저혈압 + 서맥; 반사 회복 후에도 원위부 감각·수의운동 없으면 완전 손상. Bulbocavernous reflex.'
STER='2교시 강의록 54쪽: 고용량 스테로이드 — 손상 후 8시간 이내 methylprednisolone 30 mg/kg 투여 후 24시간 동안 5.4 mg/kg/hr 정맥 주사. STT 31:41: 유럽·미국에서는 거의 안 쓰지만 쓸 게 이것밖에 없어서 쓰고 있다.'
IMG='2교시 강의록 38쪽: X-ray(flexion-extension view — 불안정성, swimmer\'s view — C6·7·T1·2, open mouth view — C1·2), myelogram, CT(골 구조·골절에 MRI보다 유리), MRI(척수·인대·부종·혈종, modality of choice), SSEP.'
PAAD='2교시 강의록 56–61쪽 증례: 67/M 안전벨트 없이 교통사고 후 neck pain, motor intact — posterior atlanto-axial dislocation(PAAD); C1이 C2 dens 뒤로 빠짐 → closed manual reduction, transverse ligament injury로 후방 고정술(STT 32:39).'
TUMC='3교시 강의록 4–7쪽: 경막외(전이성 — 가장 흔함), 경막내 수외(신경초종·수막종), 경막내 수내(상의세포종·성상세포종·혈관모세포종). 중추신경계 종양의 10–20%. MRI가 가장 유용; 양성 원발 종양은 완전 적출 원칙(신경초종·수막종·상의세포종은 90% 이상 완치), 신경교종·전이성은 성적 나쁨.'
IMT='3교시 강의록 12–20쪽: 수내 종양 — 성인은 상의세포종(가장 흔함, 60% 이상 경추, 70%에서 낭종·척수공동증 동반, 경계 명확해 완전 적출 가능), 소아는 성상세포종(경계 불분명, 불규칙 조영증강, 척수염과 감별), 혈관모세포종(5–10%, VHL 20%, 신호회피 signal void, 한꺼번에 제거).'
NST='3교시 강의록 23–28쪽: 신경초종(nerve sheath tumor) — 척수 종양 중 가장 흔함(25–37%), 대부분 경막내 수외, 30–40대·남녀 비슷, 흉>경>요, 주로 후근; 신경근성 통증·night pain, 편측이라 비대칭, 진행 시 Brown-Séquard; MRI — 경계 명확, 강한 조영증강, 종양내 낭종·rim enhancement, 10–15%는 추간공 따라 아령(dumbbell) 모양 성장; 완전 적출(아전 적출 시 50% 재발).'
MEN='3교시 강의록 29쪽 이하·STT 18:53–21:29: 수막종 — 흉추 가장 흔함(80%), 여성 빈발(85%), 치상인대 주위 arachnoid cap cell 기원이라 편측, 대부분 경막내 수외; 신경근성 통증 → CST 압박으로 하지 위약; MRI가 gold standard, 균일 조영증강 + dural tail sign; 완전 절제(10년 재발 약 10%), 악성 소견 없으면 추가 RT·chemo 불필요.'
SPT='3교시 강의록·STT 22:56–26:59: 원발성 척추 종양 — 양성: osteoid osteoma(1.5 cm 미만)/osteoblastoma(이상) — 후방(lamina·spinous process), 야간통, aspirin으로 극적 완화, 완전 절제가 원칙이나 증상 경미하면 관찰; aneurysmal bone cyst — 척추체, CT, fluid-fluid level; hemangioma — 대부분 무증상, 통증 시 vertebroplasty. 악성: multiple myeloma(가장 흔한 원발성 악성, 남자, punched-out defect, 압박골절 시 vertebroplasty), solitary면 plasmacytoma, osteosarcoma, Ewing sarcoma.'
AVF='3교시 STT 32:54–41:25: 척수 혈관기형 type I–IV — type I(dural AVF, 가장 흔함)·IV(perimedullary AVF)는 fistula, type II(glomus)·III(juvenile)는 AVM. MRI에서 척수 내 high signal(부종) + 척수 주위 구불구불한 signal void → 선택적 혈관조영으로 확진(동맥 조영 시 바로 정맥이 보임 = AV shunting); fistula는 색전술·클립으로 차단.'
OUT='오늘(10/6) 강의록·STT에 없는 내용'

def Y(meta,stem,choices,ans,basis,exps,**k):
  d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); d.setdefault('prof',OYM); return d
def S(meta,stem,answer,basis,**k):
  d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); d.setdefault('prof',OYM); return d
def W(m,p): return f'야마 {m} · 학습지 {p}쪽 원문대조'

MEN_ST='다음은 71세 여자 환자가 서서히 진행된 하지 통증과 감각저하를 주소로 내원하여 시행한 조영증강 MRI 사진이다. 이러한 척수종양은 흉추에서 가장 흔히 발생하여 여성에서 빈발한다. 경막부착부 주위로 방추상의 음영(dural tail sign)이 관찰된다. 가장 먼저 생각해 볼 수 있는 진단명을 고르시오.'
T5=['Filum ependymoma','Meningioma','Nerve sheath tumor','Astrocytoma','Metastatic carcinoma']
T5E=['경막내 수외(원추).','정답 — dural tail sign.','dumbbell·rim enhancement.','수내.','경막외.']
CC=['Anterior cord syndrome','Posterior cord syndrome','central cord syndrome','lateral cord syndrome (Brown-Sequard syndrome)','root syndrome']
CCE=['굴곡손상, 하지>상지.','감각만.','정답 — 과신전, 상지 말단>하지.','반측.','신경근.']
CC2=['Brown-Sequard Syndrome','Central cord syndrome','Anterior cord syndrome',"Bell's cruciate paralysis",'Conus medullaris syndrome']
CC2E=['반측.','정답.','굴곡.','경수연수 접합부 — 상지 양측 마비(비슷하지만 외상 과신전·통각 소실로 central cord).','T11–L2.']
CC_ST='차량 추돌 후 경추가 과신전 된 후 양손이 저리며 힘이 약해지고 통감각과 온각이 소실되었다. 하지의 근력과 감각은 상지에 비해 잘 보존되었다. 사고 후 촬영한 경추 MRI 사진이다. 진단명은?'
INC_ST='척추손상 중에서 불완전 손상에 관한 설명이다. 틀린 것은?'
INC_A=['Central cord synd은 경추 부위 과신전에 의해 발생하고 하지가 상지보다 안좋다.','Brown-sequard synd은 동측 운동마비.','Posterior cord synd은 감각신경은 소실되고 운동신경과 통각 신경은 보존된다.','Anterior cord synd은 측방 추체로(lateral spinothalamic tract)가 손상 되었을 시 양측성으로 온도와 통증을 소실하고 촉각 진동감 위치감은 보존된다.','Brown-sequard synd의 병변의 반대측은 통각과 온도 감각을 소실한다.']
INC_AE=['틀리다(정답) — 상지가 하지보다 나쁨.','옳다.','옳다.','옳다.','옳다.']
INC_B=['Central cord synd은 경추 부위 과신전에 의해 발생하고 상지가 하지보다 안좋다.','Brown-sequard synd은 동측 운동마비.','Posterior cord synd은 감각신경은 소실되고 운동신경과 통각 신경은 보존된다.','Anterior cord synd은 측방 추체로(lateral spinothalamic tract)가 손상 되었을 시 양측성으로 온도와 통증을 소실하고 촉각 진동감 위치감은 보존된다.','Brown-sequard synd의 병변의 반대측은 모든 감각을 소실한다.']
INC_BE=['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 반대측은 통각·온도만 소실.']
MY_ST='다음 중 Cervical myelopathy를 확인하기 위한 검사가 아닌 것은?'
C7_ST='C7이 담당하는 key muscle은?'
C7a=['Elbow flexors','Wrist extensors','Finger flexers','Elbow extensors','Finger abductors']; C7aE=['C5.','C6.','C8.','정답 — C7.','T1.']
C7b=['Elbow flexors','Wrist extensors','Elbow extensors','Finger flexor','Finger abductor']; C7bE=['C5.','C6.','정답 — C7.','C8.','T1.']
IM_ST='다음 중 Intramedullary tumor는?'
STAB_ST='35세 남자가 5흉추를 칼로 찔려 우측 절반의 손상을 입었다. 남자가 겪을 이상 증상 조합 중 맞는 것은?'
DEATH_ST='상부 경추 손상 후 입원한 환자가 새벽에 사망한 채로 발견되었다. 원인이 되는 생명에 위중한 합병증은?'
DEATH_CH=['혈압하강','배뇨장애','배변장애','사지마비','호흡마비']; DEATH_E=['spinal shock — 사망 원인 아님.','만성 문제.','만성 문제.','사망 원인 아님.','정답 — 횡격신경(C3–5).']
AVF_ST='70대 남자가 서서히 진행되는 하지 근력의 약화로 병원에 왔다. MRI에서는 공신호(signal void)가 비정상적으로 관찰되며, 척추 내 edema가 관찰되었다. 다음 MRI 소견과 혈관조영술에서 가장 먼저 생각해 볼 수 있는 진단명은?'

YAMA=[
Y(W('2025 객69','466'),'다음은 우측 10번째 thoracic level의 spinal cord에 병변이 있는 Brown-Sequard syndrome 환자를 나타낸 그림이다. 그림에서와 같이 환자는 우측 하지의 tactile sense 소실과 vibratory and proprioceptive sensation의 소실을 호소하는데 이러한 증상은 spinal tract 중 어떤 tract의 손상으로 인한 것인가?',
 ['lateral corticospinal tract','anterior spinothalamic tract','posterior white column','rubrospinal tract','lateral spinothalamic tract'],3,visual=V('그림 (학습지 466쪽 원문)','sc25_69.jpg'),
 basis=INC,exps=['동측 운동.','light touch.','정답.','굴곡근 긴장.','반대측 통각·온도.']),
Y(W('2025 객70','466'),MEN_ST,['filum ependymoma','meningioma','nerve sheath tumor','astrocytoma','metastatic carcinoma'],2,visual=V('조영증강 MRI (학습지 466쪽 원문)','sc25_70.jpg'),
 basis='복원자: 19·21·22년도 야마와 똑같은 문제. '+MEN,exps=T5E),
Y(W('2023 객49','466–467'),'다음은 67세 남자 환자로 앞차와 정면 충돌 교통 사고 후에 발생한 경부통증을 주소로 내원한 환자의 사진이다. 의심되는 진단명은 무엇인지 고르시오.',
 ['Unilateral facet dislocation','Posterior atlanto-axial dislocation (PAAD)','Atlas fracture','Odontoid fracture','Normal finding'],2,visual=V('X-ray·CT·3D-MDCT (학습지 467쪽 원문)','sc23_49.jpg'),
 basis='복원자: 그해 강의록에 새로 추가된 증례, 강의록 영상 그대로 출제. '+PAAD,exps=['아님.','정답.','아님.','아님.','아님.']),
Y(W('2023 객50','467'),'68세 남자 환자로 넘어지면서 목이 심하게 뒤로 꺾인 후 발생한 사지마비를 주소로 내원하였다. MRI상 경추에 척추 손상이 보이고 이마에 열상이 있었으며 신경학적 검사상 arm elevation G4/G4, elbow&wrist flexion G3/G3, hand grasp G2/G2로 저하되어 있었으나 leg elevation G5/G5로 하지보다 상지의 말단부위에 심한 마비가 있었다. 이 환자의 MRI 사진과 신경학적 손상 정도를 보였을 때 척수 불완전 손상 중 어느 손상에 해당하는지 고르세요.',
 ['Anterior cord syndrome','Central cord syndrome','Posterior cord syndrome','Lateral cord syndrome (brown sequard syndrome)','Root syndrome'],2,visual=V('MRI (학습지 467쪽 원문)','sc23_50.jpg'),
 basis=INC,exps=['하지>상지.','정답.','감각만.','반측.','신경근.']),
Y(W('2023 객51','467'),'다음은 서서히 진행되는 하지 통증 및 하지 감각저하를 주소로 내원한 45세 여자의 MRI 조영증강 사진 및 수술 소견이다. 추간공 쪽까지 퍼져 있는 소견이다. 가장 먼저 생각해 볼 수 있는 진단명은 무엇인가?',
 T5,3,visual=V('조영증강 MRI (학습지 467쪽 원문)','sc23_51.jpg'),basis='복원자: rim enhancement 되는 cystic tumor. '+NST,exps=['아님.','dural tail.','정답 — rim enhancement·추간공.','수내.','경막외.']),
Y(W('2023 객52','468'),'다음은 외상 후 우연히 발견된 cervical spine의 mass lesion을 주소로 내원한 환자의 사진이다. 증상은 약간의 목통증만 호소하였다. CT 및 MRI, bone scan 소견이 다음과 같다면 이 환자의 진단명은 무엇인지 고르시오.',
 ['Plasmacytoma','Meningioma','Osteoid osteoma','Aneurysmal bone cyst','Hemangioma'],3,visual=V('CT·MRI·bone scan (학습지 468쪽 원문)','sc23_52.jpg'),
 basis='복원자: C2 lamina 뒤 spinous process의 양성종양 — osteoid osteoma(강의록 37쪽). '+SPT,exps=['단발성 골수종.','경막내.','정답.','척추체·fluid-fluid level.','척추체, 무증상.']),
Y(W('2022 객52','468'),"경추가 손상되었을 때, cervial myelopathy를 확인하기 위한 검사가 아닌 것은?",["Ankle conus","Hoffman's sign","Barbinski's sign","Spurling's sign","Lhermitte's sign"],4,
 basis='복원자: 야마에도 자주 나오고 티야였던 내용. '+MYEL,exps=['myelopathy(ankle clonus).','myelopathy.','myelopathy.','정답 — radiculopathy.','myelopathy.']),
Y(W('2022 객53','468–469'),MEN_ST,T5,2,visual=V('조영증강 MRI (학습지 469쪽 원문)','sc22_53.jpg'),basis='복원자: 21·19년도 야마와 같은 문제. '+MEN,exps=T5E),
Y(W('2022 객54','469'),'다음 중 intradural intramedullary spinal cord tumor를 고르시오.',['meningioma','astrocytoma','filum ependymoma','nerve sheath tumor','metastatic carcinoma'],2,
 basis=IMT+' '+TUMC,exps=['수외.','정답.','수외.','수외.','경막외.']),
Y(W('2021 객27','469–470'),MEN_ST.replace('발생하여','발생하며'),T5,2,visual=V('조영증강 MRI (학습지 470쪽 원문)','sc21_27.jpg'),basis='복원자: 19년도 야마와 정확히 같은 문제. '+MEN,exps=T5E),
Y(W('2021 객29','470–471'),AVF_ST,['spinal artery aneurysm','metastatic spinal tumor','혈관모세포종 (hemangioblastoma)','척수주위 동정맥루 (type IV perimedullary AVF)','상의세포종 (ependymoma)'],4,
 visual=V('MRI·혈관조영 (학습지 471쪽 원문)','sc21_29.jpg'),basis='복원자: 야마이자 티야, 강의록 사진과 동일. '+AVF,exps=['아님.','경막외 종괴.','종양 내 signal void지만 종괴.','정답.','종괴·낭종.']),
Y(W('2021 객40','471'),'다음은 우측 10번째 흉추 부위의 spinal cord에 병변이 있는 Brown Sequard syndrome 환자를 나타낸 그림이다.\n동측의 운동마비, 위치감과 진동감 소실\n반대측의 통각과 온도감각이 소실되는데 이때 통각과 온도감각 소실에 관련된 신경로는 무엇인가?',
 ['Lateral spinothalamic tract','Anterior spinocerebellar tract','Lateral corticospinal tract','Posterior white column','Anterior corticospinal tract'],1,visual=V('그림 (학습지 471쪽 원문)','sc21_40.jpg'),
 caveat='복원자: "보기의 순서는 정확하지 않습니다."',basis=INC,exps=['정답.','소뇌.','동측 운동.','동측 위치·진동.','체간 운동.']),
Y(W('2021 객52','472'),'71세 남자환자가 경추의 손상으로 병원에 내원하였다. 환자의 양손이 저리며 힘이 약해지고 통감각과 온각이 소실되었다. 근력검사 결과 Ankle은 G5/G5, Elbow는 G3/G3, Wrist는 G2/G2 이었다. 다음은 사고 후 촬영한 환자의 경추 MRI 사진이다. 진단명은?',
 CC,3,visual=V('경추 MRI (학습지 472쪽 원문)','sc21_52.jpg'),basis='복원자: 티야이자 야마. '+INC,exps=CCE),
Y(W('2020 객99','472–473'),'71세 남자환자가 3층의 높이의 건물에서 떨어져 척추가 과신전되어 병원에 내원하였다. 환자의 양손이 저리며 통감각과 온각이 소실 되었고 근력검사 결과 Ankle 은 G5 / G5, Elbow는 G3 / G3, Wrist는 G2 / G2 였고 경추부 5 / 6 / 7 번에 이상이 있었다. 다음은 사고 후 촬영한 환자의 경추 MRI 사진이다. 진단명은 무엇인가?',
 CC,3,visual=V('경추 MRI (학습지 472쪽 원문)','sc20_99.jpg'),basis=INC,exps=CCE),
Y(W('2020 객100','473'),'61세 남자~. MRI에서 추간공을 따라 척추관 밖으로 dumbbell모양의 성장을 하는 종괴가 발견되었다.',
 ['Filum ependymoma','meningioma','nerve sheath tumor','astrocytoma','melanoma'],3,visual=V('MRI (학습지 473쪽 원문)','sc20_100.jpg'),
 caveat='복원자: 문제가 길어 앞부분을 못 외움("61세 남자~"). 사진의 빨간 표시는 학습지 원본에 있는 것.',basis='복원자: dumbbell shape = nerve sheath tumor. '+NST,exps=['아님.','dural tail.','정답.','수내.','아님.']),
Y(W('2020 객101','474'),'MRI 에서는 공신호(signal void)가 비정상적으로 관찰되며, 척추내 edema가 관찰된다. 다음 MRI 소견과 혈관조영술의 질환명은?',
 ['척수전이염','type IV perimedullary AVF','ependymoma'],2,visual=V('MRI·혈관조영 (학습지 474쪽 원문)','sc20_101.jpg'),
 caveat='④·⑤ 보기는 복원 실패(학습지 원문: "선지복원실패") — 확실히 출제된 보기 3개만 수록.',basis=AVF,exps=['아님.','정답.','종괴.']),
Y(W('2020 객97','474–475'),"신경학적검사에서 cervical radiculopathy를 확인하기 위한 검사로 적절한 것은?",["Lhermitte's sign","Hoffmann's sign","Barbinski's sign","Spurling's sign","Ankle clonus"],4,
 basis='20 학습부: 14년도부터 15년도를 제외하고 매년 출제된 킹야. '+MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','정답.','myelopathy.']),
Y(W('2019 객75','475'),INC_ST,INC_A,1,prof=EJP,basis='복원자: 기출에 계속 나오는 문제. '+INC,exps=INC_AE),
Y(W('2019 객76','475'),MY_ST,["Lhermitte’s sign","Hoffmann’s sign","Ankle clonus","Spurling’s sign","Babinski’s sign"],4,prof=EJP,basis='복원자: 킹야. '+MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','정답.','myelopathy.']),
Y(W('2019 객77','475–476'),MEN_ST.replace('발생하여','발생하며').replace('방추상의 음영(dural tail sign)','방추성 음영 dural tail sign'),['Filim ependymoma','Meningioma','Nerve sheath tumor','Astrocytoma','Mestastatic carcinoma'],2,
 prof=EJP,visual=V('조영증강 MRI (학습지 476쪽 원문)','sc19_77.jpg'),basis='복원자: 킹야. '+MEN,exps=T5E),
Y(W('2019 객86','476'),'35세 남자가 T5를 칼로 찔려 우측 절반의 손상을 입었다. 남자가 겪을 이상증상 징후로 옳은 것은?',
 ['좌측 통각 우측 온도','우측 통각 우측 운동','우측 운동 좌측 운동','우측 운동 좌측 통각','우측 운동 좌측 운동'],4,prof=EJP,
 caveat='③과 ⑤가 같은 내용으로 학습지 원문 그대로 수록.',basis='복원자: 2015년 야마와 같은 문제. '+INC,exps=['통각·온도는 같은 쪽(좌).','통각은 반대측.','운동은 동측만.','정답.','운동은 동측만.']),
S(W('2018 객36','476'),'잘못된 설명은?\n① Central cord syndrome은 ~\n② Anterior cord syndrome은 ~\n③ Brown-Sequard syndrome은 ~\n④ Posterior cord syndrome은 ~\n⑤ Brown-Sequard syndrome은 ~',
 '(정답·보기 내용 복원 실패) 복원자가 선택지에 나왔던 내용에 밑줄만 표시 — 전척수(양측 pain·temperature 소실, pressure·touch 소실, 진동·위치 보존), 후방척수(position·vibration·pressure 소실, 운동·통각 보존), 중심척수(상지 말단>하지), Brown-Séquard(동측 운동마비, 동측 촉감·위치·진동, 반대측 통각·온도).',
 prof=EJP,keep_excluded=True,basis='복원자: "탈야입니다. 정확히 복원하지 못해 죄송합니다." '+INC),
Y(W('2018 객37','477'),MY_ST,["Lhermitte's sign","Hoffmann's sign","Ankle clonus","Spurlng's sign","Babinski's sign"],4,prof=EJP,basis=MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','정답.','myelopathy.']),
Y(W('2018 객38','477'),'C7이 담당하는 Key muscle은?',C7a,4,prof=EJP,basis='복원자: 17·16·15·14년 같은 문제, 킹야. '+KEY,exps=C7aE),
Y(W('2018 객39','478'),'71세 여자 환자가 근력 저하와 통증으로 내원하여 시행한 조영증강 MRI 사진이다. 경막 꼬리 징후(dural tail sign)이 관찰되었을 떄 가장 적절한 질환을 고르세요.',
 ['Astrocytoma','Filum ependymoma','Meningioma','Metastatic tumor','Nerve sheath tumor'],3,prof=EJP,visual=V('조영증강 MRI (학습지 478쪽 원문)','sc18_39.jpg'),
 basis='복원자: 매번 출제되는 문제. '+MEN,exps=['수내.','아님.','정답.','경막외.','rim enhancement.']),
Y(W('2017 객31','478'),INC_ST,INC_A,1,prof=EJP,basis='복원자: 16년 2차 객19 야마와 동일. '+INC,exps=INC_AE),
Y(W('2017 객32','479'),MY_ST,["Lhermitte's sign","Hoffmann's sign","Ankle clonus","Babinski's sign","Spurlng's sign"],5,prof=EJP,basis=MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','myelopathy.','정답.']),
Y(W('2017 객33','479'),C7_ST,C7b,3,prof=EJP,basis='복원자: 매년 나오는 킹야마. '+KEY,exps=C7bE),
Y(W('2017 객34','479–480'),'71세 여자환자가 내원하였다. 다음은 환자의 MRI 소견이다. 50 ~ 70대 여성 유병률이 75~85%로 압도적으로 호발하며 arachnoid cell origin 으로 dural tail sign 이 관찰된다. 가장 적절한 질환을 고르세요.',
 ['Filum ependymoma','Meningioma','Nerve sheath tumor','Astrocytoma','Metastatic tumor'],2,prof=EJP,visual=V('MRI (학습지 479쪽 원문)','sc17_34.jpg'),basis=MEN,exps=T5E),
Y(W('2016 객19','480'),INC_ST,INC_A,1,prof=EJP,basis=INC,exps=INC_AE),
Y(W('2016 객20','480'),MY_ST,["Lhermitte's sign","Hoffmann's sign","Ankle clonus","Babinski's sign","Spurlng's sign"],5,prof=EJP,basis='복원자: 수업 중 시험에 내겠다고 강조. '+MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','myelopathy.','정답.']),
Y(W('2016 객21','481'),C7_ST,C7b,3,prof=EJP,basis=KEY,exps=C7bE),
Y(W('2016 객22','481'),'71세 여자 환자가 내원하였다. 다음은 환자의 MRI 소견이다. dural tail sign이 관찰 되었다. 가장 가능성이 높은 질환은?',
 ['Nerve sheath tumor','Meningioma','Filum ependymoma','Astrocytoma','Metastatic tumor'],2,prof=EJP,visual=V('MRI (학습지 481쪽 원문)','sc16_22.jpg'),basis=MEN,exps=['rim enhancement.','정답.','아님.','수내.','경막외.']),
Y(W('2015 객24','481–482'),INC_ST,INC_B,5,basis='복원자: 2015 티야. '+INC,exps=INC_BE),
Y(W('2015 객25','482'),C7_ST,C7b,3,basis=KEY,exps=C7bE),
Y(W('2015 객26','482'),IM_ST,['Nerve sheath tumor','Meningioma','Filum ependymoma','Astrocytoma','Metastatic tumor'],4,prof=EJP,basis=IMT+' '+TUMC,exps=['수외.','수외.','수외.','정답.','경막외.']),
Y(W('2015 객27','483'),'다음은 환자의 MRI 소견이다. dural tail sign이 관찰 되었다. 가장 가능성이 높은 질환은?',['Nerve sheath tumor','Meningioma','Filum ependymoma','Astrocytoma','Metastatic tumor'],2,
 prof=EJP,visual=V('MRI (학습지 483쪽 원문)','sc15_27.jpg'),basis=MEN,exps=['rim enhancement.','정답.','아님.','수내.','경막외.']),
Y(W('2015 객35','483'),STAB_ST,['좌측 통각감각, 우측 온도감각','우측 통각감각, 우측 운동감각','우측 온도감각, 좌측 운동감각','우측 운동감각, 좌측 통각감각','우측 운동감각, 좌측 통각감각'],5,
 caveat='학습지 원문에서 ④와 ⑤가 같은 문구로 복원되어 있음 — 주어진 답 ⑤ 유지(내용상 ④도 같은 답).',basis=INC,exps=['통각·온도는 좌측.','통각은 반대측.','운동은 동측.','같은 문구(복원 중복).','정답.']),
Y(W('2014 객13','483'),'다음 중 운동 영역이 최대로 보존되었을 척수손상은?',['전척수 증후군','후척수 증후군','중심척수 증후군','측방척수 증후군'],2,
 basis='복원자: 신경외과학 295–296쪽. '+INC,exps=['양측 운동마비.','정답 — 감각만.','상지 마비.','동측 마비.']),
Y(W('2014 객21','484'),INC_ST.replace('척추손상','척수손상'),INC_B,5,basis='복원자: 2014 티야, 수업 ppt 그대로. '+INC,exps=INC_BE),
Y(W('2014 객22','485'),'다음은 경추손상시 시행하는 검사이다. Cervix myelopathy를 확인하는 검사는?',["Ankle clonus","Hoffmann’s sign","Barbinski’s sign","Spurling’s sign","Lhermitte’s sign"],4,
 caveat='주어진 답 ④ 유지. 단, 문제가 "확인하는 검사는?"으로 복원되었는데 ④ Spurling은 radiculopathy 검사 — 원래 문제는 "확인하기 위한 검사가 아닌 것은?"이었을 가능성이 큼.',
 basis=MYEL,exps=['myelopathy.','myelopathy.','myelopathy.','복원 답(정답 처리) — radiculopathy 검사.','myelopathy.']),
Y(W('2014 객23','485'),C7_ST,['Elbow flexors','Wrist extensors','Elbow extensors','Finger flexors','Finger abductors'],3,basis=KEY,exps=C7bE),
Y(W('2014 객24','485'),'다음 중 Intramedullary spinal cord tumor 를 고르시오.',['Nerve sheath tumor','Meningioma','Filum ependymoma','Astrocytoma','Metastatic carcinoma'],4,prof=EJP,
 basis='복원자: 2010 2차 11번과 동일. '+IMT,exps=['수외.','수외.','수외.','정답.','경막외.']),
Y(W('2014 객25','485–486'),'척추병변의 설명으로 틀린 것은?',['Schwannoma는 MRI상에서 dura tail sign이 관찰된다.','Nerve sheath tumor는 dumbbell shape으로 growth한다.','Intramedullary tumor는 ependymoma,astrocytoma, hemangioblastoma가 있다.','Meningioma는 complete surgical excision이 원칙이다.','이상 모두 옳다.'],1,
 prof=EJP,basis='복원자: dural tail은 meningioma. '+MEN+' '+NST,exps=['틀리다(정답) — meningioma.','옳다.','옳다.','옳다.','아님.']),
Y(W('2013 객36','486'),STAB_ST,['좌측 통각감각, 우측 온도감각','우측 통각감각, 우측 운동감각','우측 온도감각, 좌측 운동감각','좌측 통각감각, 좌측 운동감각','우측 운동감각, 좌측 통각감각'],5,prof=EJP,basis=INC,exps=['통각·온도는 좌측.','통각은 반대측.','운동은 동측.','운동은 동측(우).','정답.']),
Y(W('2013 객38','486'),'척수 손상후 급성기에 사용해야 되는 것은?',['Methylprednisolone','Hydrocortisone','Dexamethasone','Prednisolone'],1,prof=EJP,basis=STER,exps=['정답.','아님.','아님.','아님.']),
Y(W('2013 객39','486'),CC_ST,CC2,2,prof=EJP,visual=V('경추 MRI (학습지 486쪽 원문)','sc13_39.jpg'),basis=INC,exps=CC2E),
Y(W('2013 객40','487'),DEATH_ST,DEATH_CH,5,prof=EJP,basis='복원자: 08년 50번, 10년 2차 10번, 11년 2차 53번, 12년 2차 32번 동일. '+RESP,exps=DEATH_E),
Y(W('2012 객29','488'),'척추손상을 입었을 경우 elbow flexion에 영향을 주는 곳은?',['C3','C4','C5','C6','C7'],3,prof=EJP,basis=KEY,exps=['횡격막.','어깨 올림.','정답.','wrist extensor.','elbow extensor.']),
S(W('2012 객30','488'),'척수 손상 후 급성기에 고용량 steroid치료시 사용하는 약은? (보기 ①만 복원: ① Methylprednisolone, ② 부터는 복원이 안 됨.)',
 'Methylprednisolone',prof=EJP,keep_excluded=True,basis='복원자: 10기출 8번과 같은 문제로 보임. '+STER),
Y(W('2012 객31','488'),CC_ST,CC2,2,prof=EJP,visual=V('경추 MRI (학습지 488쪽 원문)','sc12_31.jpg'),basis=INC,exps=CC2E),
Y(W('2012 객32','489–490'),DEATH_ST,DEATH_CH,5,prof=EJP,basis=RESP,exps=DEATH_E),
Y(W('2012 객41','490'),'척수손상의 임상 증후군 중 보행의 예후가 가장 좋지 않은 것은?',['중심척수증후군','십자증후군','브라운 시쿼드 증후군','전방척수증후군','후방척수증후군'],4,prof=EJP,
 basis='복원자: 전방척수증후군 — 운동마비, 예후 불량. 오늘 5교시 서정환 교수님 STT 40:13: 보행 예후 — Brown-Séquard 90%, central cord 50%, anterior cord 나쁨. '+INC,exps=['50%.','상지.','90% 보행.','정답.','감각만.']),
Y(W('2011 객51','490–491'),CC_ST,CC2,2,prof=EJP,visual=V('경추 MRI (학습지 490쪽 원문)','sc11_51.jpg'),basis='복원자: C4–C6 cord 압박. '+INC,exps=CC2E),
Y(W('2011 객52','491'),'척추병변의 설명으로 옳은 것은?',['척수의 횡단성 병변의 초기부터 집단반사가 온다.','중심성 척수 증후군은 근 위축이 없으며 강직성 마비가 온다.','경수부의 횡단성 병변의 초기에 혈압은 떨어지나 호흡은 영향이 없다.','Brown-Sequard 증후군은 동측의 운동마비와 반대측 통온각의 상실이 있다','이상 모두 옳다.'],4,
 prof=EJP,caveat='복원자: 강의록에 ①②③에 대한 정확한 내용이 없어 ④(확실)로 정함.',basis='복원자: ③ 횡격신경 C3–5라 호흡 영향. '+SHOCK+' '+INC,exps=['초기엔 spinal shock(반사 소실).','근위축 생길 수 있음.','호흡 영향 있음.','정답.','아님.']),
Y(W('2011 객53','491'),'상부 경추의 손상 후 입원 후 새벽에 사망한 채로 발견되었다. 이에 원인되는 생명이 위중한 합병증은?',DEATH_CH,5,prof=EJP,basis=RESP,exps=DEATH_E),
Y(W('2011 객54','492'),'다음 중 Intramedullary spinal cord tumor를 고시오.',['Meningioma','Astrocytoma','Filum ependymoma','Nerve sheath tumor','Metastatic carcinoma'],2,prof=EJP,basis=IMT,exps=['수외.','정답.','수외.','수외.','경막외.']),
]

def VR(key,stem,choices,ans,basis,exps,**k):
  d=dict(key=key if key.startswith('2026') else f'야마 {key}',stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
VAR=[
VR('2025 객69 변형','Brown-Séquard 증후군에서 병변 반대측 하지에 나타나는 소견은?',['통각·온도 감각 소실','운동마비','위치감 소실','진동감 소실','손상 부위 모든 감각 소실'],1,INC,['정답.','동측.','동측.','동측.','손상 레벨.']),
VR('2025 객70 변형','척수 수막종에 대한 설명으로 옳지 않은 것은?',['흉추에서 가장 흔함','여성에서 빈발','dural tail sign','arachnoid cap cell 기원','추간공을 따라 아령 모양으로 자람'],5,MEN,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 신경초종.']),
VR('2023 객49 변형','PAAD 증례(67/M, 교통사고 후 neck pain, motor intact)에서 강의록이 제시한 치료는?',['Closed manual reduction 후 후방 고정술','관찰만','고용량 스테로이드만','방사선 치료','전방 경추 디스크 절제'],1,PAAD,['정답.','아님.','아님.','아님.','아님.']),
VR('2023 객50 변형','중심척수 증후군에 대한 설명으로 옳지 않은 것은?',['경추 과신전 손상','C5/6/7 호발','척추관 협착이 있는 중년·노인','상지 말단의 심한 마비','하지가 상지보다 심한 마비'],5,INC,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
VR('2023 객51 변형','신경초종(nerve sheath tumor)에 대한 설명으로 옳지 않은 것은?',['척수 종양 중 가장 흔함','주로 후근에서 발생','신경근성 통증·night pain','10–15%는 아령 모양 성장','여성에서 85%로 압도적'],5,NST,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 수막종.']),
VR('2023 객52 변형','Osteoid osteoma에 대한 설명으로 옳지 않은 것은?',['척추 후방(lamina·spinous process)에 호발','밤에 심해지는 통증','aspirin 계열로 극적 완화','1.5 cm 이상이면 osteoblastoma','반드시 즉시 광범위 절제해야 한다'],5,SPT,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 증상 경미하면 관찰.']),
VR('2022 객52 변형',"Lumbar radiculopathy를 확인하기 위한 검사는?",["Straight leg raising test","Hoffmann's sign","Lhermitte's sign","Ankle clonus","Babinski's sign"],1,MYEL,['정답(FNST도).','myelopathy.','myelopathy.','myelopathy.','myelopathy.']),
VR('2022 객54 변형','다음 중 extradural spinal tumor는?',['metastatic carcinoma','ependymoma','astrocytoma','meningioma','schwannoma'],1,TUMC,['정답.','수내.','수내.','경막내 수외.','경막내 수외.']),
VR('2021 객29 변형','Type IV perimedullary AVF의 확진 검사는?',['선택적 척수 혈관조영술','CT','근전도','골주사','뇌파'],1,AVF,['정답.','아님.','아님.','아님.','아님.']),
VR('2021 객40 변형','우측 T10 Brown-Séquard 증후군에서 우측 하지 운동마비를 일으키는 tract는?',['Lateral corticospinal tract','Lateral spinothalamic tract','Posterior white column','Anterior spinocerebellar tract','Tectospinal tract'],1,INC,['정답.','반대측 통각.','동측 위치·진동.','소뇌.','C4까지.']),
VR('2021 객52 변형','중심척수 증후군에서 상지가 하지보다 심하게 마비되는 이유로 강의에서 설명한 것은?',['corticospinal tract에서 상지(경수) 섬유가 안쪽(가운데)에 위치','상지 신경이 더 길어서','하지 신경이 교차하지 않아서','posterior column이 손상되어서','spinothalamic tract만 손상되어서'],1,INC+' STT 13:57.',['정답.','아님.','아님.','아님.','아님.']),
VR('2020 객100 변형','MRI에서 rim enhancement·종양내 낭종을 보이며 추간공을 따라 척추관 밖으로 자라는 종양은?',['Nerve sheath tumor','Meningioma','Ependymoma','Astrocytoma','Hemangioblastoma'],1,NST,['정답.','dural tail.','수내.','수내.','수내·signal void.']),
VR('2020 객101 변형','척수 혈관기형 중 가장 흔한 형태는?',['Type I (dural AVF)','Type II (glomus AVM)','Type III (juvenile AVM)','Type IV (perimedullary AVF)','해면상 혈관종'],1,AVF,['정답.','AVM.','AVM.','fistula.','아님.']),
VR('2020 객97 변형',"Cervical radiculopathy를 확인하는 Spurling's sign과 달리 cervical myelopathy를 시사하는 소견은?",["Hoffmann's sign","Spurling's sign","Straight leg raising test","Femoral nerve stretching test","Patrick test"],1,MYEL,['정답.','radiculopathy.','L-spine.','L-spine.','고관절.']),
VR('2019 객75 변형','전척수 증후군에 대한 설명으로 옳은 것은?',['굴곡손상, 양측 운동마비·통각·온도 소실, 진동·위치감 보존','과신전, 상지 말단 마비','반측 손상','위치·진동만 소실','반대측 운동마비'],1,INC,['정답.','중심.','Brown-Séquard.','후방.','아님.']),
VR('2019 객86 변형','35세 남자가 T8 좌측 절반을 칼에 찔렸다. 예상되는 소견은?',['좌측 운동마비, 우측 통각·온도 소실','우측 운동마비, 좌측 통각 소실','양측 운동마비','좌측 통각 소실, 우측 진동 소실','우측 운동마비, 우측 통각 소실'],1,INC,['정답.','반대.','완전 손상.','반대.','아님.']),
VR('2018 객38 변형','L4가 담당하는 key muscle은?',['Ankle dorsiflexors','Hip flexors','Knee extensors','Long toe extensors','Ankle plantar flexors'],1,KEY,['정답.','L2.','L3.','L5.','S1.']),
VR('2015 객24 변형','후방척수 증후군에 대한 설명으로 옳은 것은?',['후척수동맥 손상, position·vibration·pressure 소실, 운동·통각 보존','양측 운동마비','반대측 통각 소실','상지 말단 마비','양측 통각·온도 소실'],1,INC,['정답.','전척수.','Brown-Séquard.','중심.','전척수.']),
VR('2014 객13 변형','척수 손상 중 운동마비가 하지보다 상지에서 더 심한 것은?',['중심척수 증후군','전척수 증후군','후척수 증후군','측방척수 증후군','완전 손상'],1,INC,['정답.','양측 하지 포함.','운동 보존.','동측.','전부.']),
VR('2014 객25 변형','척수 종양의 MRI 소견 연결로 옳지 않은 것은?',['수막종 — dural tail sign','신경초종 — dumbbell, rim enhancement','혈관모세포종 — signal void','상의세포종 — 낭종·척수공동증 동반','성상세포종 — 경계가 매우 명확'],5,IMT+' '+NST,['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 경계 불분명.']),
VR('2013 객38 변형','척수손상 후 고용량 methylprednisolone 투여 방법으로 강의록에 제시된 것은?',['8시간 이내 30 mg/kg 후 24시간 5.4 mg/kg/hr','1주 후 경구','5 mg 1회','수술 후에만','투여 금기'],1,STER,['정답.','아님.','아님.','아님.','아님.']),
VR('2013 객39 변형','중심척수 증후군의 감각 소견으로 옳은 것은?',['양측 통각·온도 소실, 촉각·진동·위치는 부분 보존(지각해리)','모든 감각 정상','동측 진동 소실만','반대측 통각만 소실','양측 진동만 소실'],1,INC,['정답.','아님.','Brown-Séquard.','Brown-Séquard.','후방.']),
VR('2013 객40 변형','경추·상위 흉추 척수손상에서 호흡곤란의 원인으로 옳지 않은 것은?',['늑간신경 마비로 흉곽 팽창 장애','가래 배출 장애','C3–5 횡격신경 손상','폐렴','요추 신경근 손상'],5,RESP,['원인.','원인.','원인.','원인.','정답.']),
VR('2012 객29 변형','척수손상 평가에서 wrist extension을 담당하는 분절은?',['C6','C5','C7','C8','T1'],1,KEY,['정답.','elbow flexion.','elbow extension.','finger flexion.','finger abduction.']),
VR('2012 객41 변형','척수손상 임상 증후군 중 보행 예후가 가장 좋은 것은?',['Brown-Séquard 증후군','전방척수 증후군','완전 손상','중심척수 증후군','십자 증후군'],1,'5교시 STT 40:13: Brown-Séquard 90% 보행, central 50%, anterior 나쁨. '+INC,['정답.','나쁨.','나쁨.','50%.','상지.']),
VR('2011 객52 변형','Spinal shock에 대한 설명으로 옳지 않은 것은?',['완전 손상 직후 손상부위 이하 운동·감각·반사 일시 소실','교감신경 차단으로 저혈압','저혈량성 쇼크와 달리 서맥','수일–수주 후 반사항진으로 변함','빈맥과 고혈압이 특징'],5,SHOCK,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
]
P=OYM; S2='STT 10/6 2교시'; S3='STT 10/6 3교시'
TY=[
T(P,S2+' 05:40','경수 손상 환자가 사망에 이르는 주요 원인으로 교수님이 설명한 것은?',['호흡기 문제(횡격막·호흡근 마비, 폐렴)와 오래 누워 생기는 DVT 등 합병증','두통','근위축','욕창만','발열'],'STT 04:49–05:40. '+EPI,['정답.','아님.','아님.','일부.','아님.']),
T(P,S2+' 06:41','척수손상 치료에서 교수님이 임상적으로 중요하다고 강조한 것은?',['되돌릴 수 없는 1차 손상보다 허혈·흥분독성·미토콘드리아 기능장애 등 2차 손상을 빨리 막는 것','1차 손상 복구','진통제','즉시 재활','항생제'],'STT 06:41–07:40. '+SEC,['정답.','불가능.','아님.','아님.','아님.']),
T(P,S2+' 10:05','불완전 척수손상 증후군 중 임상적으로 가장 많은 것은?',['중심척수 증후군','전척수 증후군','후척수 증후군','Brown-Séquard 증후군','신경근 증후군'],'STT 10:05·11:59. '+INC,['정답.','아님.','아님.','드묾.','아님.']),
T(P,S2+' 12:57','중심척수 증후군이 잘 생기는 상황으로 교수님이 든 것은?',['척추관이 좁은 노인이 넘어지며 책상에 이마를 부딪혀 목이 과신전','젊은 사람의 굴곡 손상','칼에 찔림','다이빙 굴곡','종양'],'STT 12:57. '+INC,['정답.','전척수.','Brown-Séquard.','굴곡.','아님.']),
T(P,S2+' 16:55','Brown-Séquard 증후군이 실제로 더 흔히 나타나는 상황으로 교수님이 설명한 것은?',['외상보다는 한쪽에서 척수를 미는 종양에서','교통사고','낙상','다이빙','운동'],'STT 16:00–16:55. '+INC,['정답.','드묾.','드묾.','드묾.','드묾.']),
T(P,S2+' 18:44','척수공동증(syringomyelia)이 척수 중심부에서 커질 때의 특징적 증상은?',['양측 통각·온도만 소실(촉각·위치·진동·운동은 보존)','양측 운동마비','위치·진동 소실','반측 마비','배뇨장애만'],'STT 17:54–19:40.',['정답.','늦게.','아님.','아님.','아님.']),
T(P,S2+' 23:05','Swimmer\'s view를 찍는 이유로 교수님이 설명한 것은?',['어깨에 가려 안 보이는 C7–T1(T2) 부위를 팔을 올려 보기 위해','C1–2를 보기 위해','요추를 보기 위해','불안정성 평가','골밀도 측정'],'STT 23:05. '+IMG,['정답.','open mouth view.','아님.','flexion-extension.','아님.']),
T(P,S2+' 25:50','Spinal shock에서 서맥이 생기는 이유로 교수님이 설명한 것은?',['교감신경 톤을 올릴 수 없어 혈관이 확장되고 심박수를 올리지 못함','부교감 차단','출혈','저체온','고칼륨'],'STT 25:50–26:50. '+SHOCK,['정답.','반대.','저혈량성은 빈맥.','아님.','아님.']),
T(P,S2+' 31:41','고용량 스테로이드(methylprednisolone)에 대한 교수님의 입장은?',['유럽·미국은 거의 안 쓰지만 해 줄 수 있는 게 이것밖에 없어 부작용을 감수하고 쓰고 있다','절대 쓰지 않는다','모든 나라 표준이다','효과가 확실히 입증됐다','경구로만 쓴다'],'STT 31:41. '+STER,['정답.','아님.','아님.','아님.','아님.']),
T(P,S3+' 04:40','수술 후 오히려 악화되는 경우가 많아 주의해야 한다고 한 척수내 종양은?',['성상세포종 등 신경교종 — 정상 척수와 경계가 불분명','상의세포종','혈관모세포종','신경초종','수막종'],'STT 3교시 04:40·07:55. '+IMT,['정답.','경계 명확 — 수술 권장.','경계 명확.','수외.','수외.']),
T(P,S3+' 06:57','성인과 소아에서 가장 흔한 척수내 종양으로 교수님이 설명한 것은?',['성인 상의세포종, 소아 성상세포종','성인 성상세포종, 소아 상의세포종','둘 다 혈관모세포종','둘 다 지방종','둘 다 전이암'],'STT 3교시 06:57. '+IMT,['정답.','반대.','아님.','아님.','아님.']),
T(P,S3+' 12:35','혈관모세포종을 MRI에서 의심할 수 있는 단서로 교수님이 든 것은?',['종양 안·주변의 signal void(혈관)와 VHL 연관','dural tail','dumbbell','fluid-fluid level','punched-out'],'STT 3교시 12:35. '+IMT,['정답.','수막종.','신경초종.','ABC.','골수종.']),
T(P,S3+' 16:15','신경초종이 아령(dumbbell) 모양이 되는 이유로 교수님이 설명한 것은?',['신경근을 따라 추간공 밖으로 나가는데 뼈(foramen) 부분에서 잘록해져서','척수 안에서 자라서','경막을 뚫어서','양쪽에서 생겨서','혈관이 많아서'],'STT 3교시 16:15. '+NST,['정답.','아님.','아님.','아님.','아님.']),
T(P,S3+' 19:53','수막종에서 dural tail sign이 보이는 이유로 교수님이 설명한 것은?',['경막 안 arachnoid cap cell에서 기원해 경막까지 조영증강되므로 — 뇌 수막종과 같음','혈관이 많아서','석회화 때문','낭종 때문','신경근 때문'],'STT 3교시 19:53. '+MEN,['정답.','아님.','아님.','아님.','아님.']),
T(P,S3+' 26:23','원발성 악성 골종양 중 가장 흔하며 punched-out defect를 보이는 것은?',['Multiple myeloma','Osteosarcoma','Ewing sarcoma','Chordoma','Plasmacytoma'],'STT 3교시 26:23–27:55. '+SPT,['정답.','드묾.','드묾.','아님.','단발성.']),
T(P,S3+' 41:25','양측 하지 위약 환자에서 디스크 문제가 없는데 MRI에서 척수 뒤쪽 signal void가 보일 때 교수님이 강조한 것은?',['"디스크 문제 없네"로 끝내지 말고 척수 레벨 질환(AVF)을 생각해 혈관조영','디스크 수술','관찰','근전도만','스테로이드'],'STT 3교시 40:54–41:25. '+AVF,['정답.','아님.','아님.','아님.','아님.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))
def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('2교시 강의록 2쪽','척수손상의 호발 부위 순서로 옳은 것은?',['경추 55% > 흉추 35% > 요천추 10%','흉추 > 경추 > 요천추','요천추 > 경추 > 흉추','경추 = 흉추','천추 > 흉추'],1,EPI,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 2쪽','척수손상의 남녀비로 강의록에 제시된 것은?',['4:1','1:1','1:4','2:1','10:1'],1,EPI,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 5쪽','척추·척수 손상 기전 중 가장 흔한 것은?',['굴곡손상','신전손상','회전손상','압박손상','복합손상'],1,EPI,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 7쪽','이차 손상의 생화학적 변화에 해당하지 않는 것은?',['ATP 고갈','free radical 생성','lipid peroxidation','세포내 칼슘 과부하','세포외 칼슘 감소로 인한 근육 경련'],5,SEC,['해당.','해당.','해당.','해당.','정답.']),
Q('2교시 강의록 7쪽','외상 후 척수 조직손상을 식별할 수 있는 시간으로 강의록에 제시된 것은?',['3–4시간 후(처음 2–3시간 회색질 괴사가 백색질로 퍼짐)','즉시','1주 후','24시간 후','1개월 후'],1,SEC,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 13쪽','전척수 증후군에서 보존되는 감각은?',['진동감·위치감','통각','온도각','pressure','touch'],1,INC,['정답.','소실.','소실.','소실.','소실.']),
Q('2교시 강의록 20쪽','Brown-Séquard 증후군의 원인으로 강의록에 제시된 것은?',['자상·총상·회전손상','과신전','굴곡','후척수동맥 손상','다이빙'],1,INC,['정답.','중심.','전척수.','후방.','아님.']),
Q('2교시 강의록 26쪽','척수 손상 환자의 몇 %가 다른 부위 손상을 동반하는가?',['20–60%','1%','5%','90% 이상','동반 없음'],1,'2교시 강의록 26쪽: 다른 부위 손상 동반 20–60%, 의식 없는 두부손상에서는 척추 손상 가능성을 항상 염두.',['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 27쪽','근력 등급 3의 정의는?',['중력에 반해 들어 올릴 수 있으나 저항을 가하면 움직일 수 없음','약간의 근육 수축','중력이 없으면 부분 운동','저항에 반해 움직임','정상'],1,'2교시 강의록 27쪽 근력 등급 0–5.',['정답.','1.','2.','4.','5.']),
Q('2교시 강의록 31쪽','ASIA(Frankel) C 등급은?',['쓸모없는 운동 + 감각 있음','운동·감각 없음','운동 없고 감각만','쓸모 있는 운동 + 감각','정상'],1,KEY,['정답.','A.','B.','D.','E.']),
Q('2교시 강의록 33쪽',"Lhermitte's sign 양성 소견은?",['머리를 숙이면 척추를 따라 상·하지로 찌릿한 통증','엄지가 굴곡','발목 간대','다리를 들면 방사통','목을 돌려 누르면 방사통'],1,MYEL,['정답.','Hoffmann.','ankle clonus.','SLR.','Spurling.']),
Q('2교시 강의록 35쪽','항문검사에서 sacral sparing이 의미하는 것은?',['불완전 손상 — 향후 회복 가능성','완전 손상','spinal shock 종료','신경근 손상','전척수 증후군'],1,'2교시 강의록 35쪽.',['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 38쪽','척추·척수 손상 진단의 modality of choice는?',['MRI','단순 X-ray','CT','Myelogram','SSEP'],1,IMG,['정답.','초기.','골구조에 유리.','과거.','보조.']),
Q('2교시 강의록 42쪽','척수손상 응급처치에서 유지해야 할 수축기 혈압은?',['90 mmHg 이상','60 mmHg 이상','140 mmHg 이상','상관없음','200 mmHg 이상'],1,SHOCK,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 44쪽','Bulbocavernous reflex에 대한 설명으로 옳은 것은?',['귀두·음핵 압박이나 Foley를 당길 때 항문괄약근이 수축','무릎 반사','발바닥 반사','각막 반사','복벽 반사'],1,SHOCK,['정답.','아님.','아님.','아님.','아님.']),
Q('2교시 강의록 49–52쪽','경추 골절의 정복 방법으로 강의록에 제시된 것은?',['두개골 견인(skull traction, Gardner tong)','체위 정복술','석고붕대','수술만','관찰'],1,'2교시 강의록 49–52쪽: 경추 — skull traction, 흉요추 — 체위 정복(postural reduction).',['정답.','흉요추.','아님.','아님.','아님.']),
Q('2교시 강의록 53쪽','척수손상 수술의 적응증이 아닌 것은?',['정복이 안 되어 척수 압박이 계속될 때','골편·추간판으로 압박이 남아 있을 때','척추가 불안정할 때','완전 손상이 확인된 직후 신경 회복을 위해 반드시','정복은 되었으나 압박이 남을 때'],4,'2교시 강의록 53쪽.',['적응증.','적응증.','적응증.','정답.','적응증.']),
Q('3교시 강의록 4쪽','척수 종양 중 경막외 종양에 해당하는 것은?',['전이성 종양','신경초종','수막종','상의세포종','성상세포종'],1,TUMC,['정답.','경막내 수외.','경막내 수외.','수내.','수내.']),
Q('3교시 강의록 8쪽','척추 전이를 잘 일으키는 원발암으로 강의록에 제시된 것은?',['남성 폐암·전립선암, 여성 유방암','남성 위암','여성 자궁암','갑상선암만','피부암'],1,'3교시 강의록 8쪽.',['정답.','아님.','아님.','아님.','아님.']),
Q('3교시 강의록 9쪽','척추의 종양성 병변을 감별하는 데 가장 민감도가 높은 검사는?',['99m-Tc bone scan','단순 X-ray','CT','MRI','경피적 생검'],1,'3교시 강의록 9쪽.',['정답.','아님.','파괴 정도.','관계 파악.','조직.']),
Q('3교시 강의록 14쪽','상의세포종에 대한 설명으로 옳지 않은 것은?',['성인 수내 종양 중 가장 흔함','60% 이상 경추','약 70%에서 낭종·척수공동증 동반','점액유두형은 척수원추부','경계 불분명해 완전 적출이 불가능'],5,IMT,['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
Q('3교시 강의록 20쪽','혈관모세포종 수술에서 금기인 것은?',['수술 중 종양내 감압','주변 혈관을 하나씩 차단','연막하 박리','종양 전체를 한꺼번에 제거','경막 절개'],1,IMT,['정답.','권장.','권장.','권장.','과정.']),
Q('3교시 강의록 22쪽','경막내 수외종양 중 가장 흔한 두 가지는?',['신경초종과 수막종','지방종과 유피종','상의세포종과 성상세포종','전이암과 골수종','혈관종과 육종'],1,'3교시 강의록 22쪽: 두 가지가 약 80%, 비슷한 빈도.',['정답.','드묾.','수내.','경막외.','드묾.']),
Q('3교시 강의록 25쪽','신경섬유종(neurofibroma)의 완전 제거에 필요한 것은?',['신경근 절단','방사선','항암','관찰','후궁절제만'],1,NST,['정답.','아님.','아님.','아님.','아님.']),
Q('3교시 STT 24:44','척추체를 녹이며 MRI에서 fluid-fluid level을 보이는 양성 종양은?',['Aneurysmal bone cyst','Osteoid osteoma','Hemangioma','Meningioma','Schwannoma'],1,SPT,['정답.','후방.','무증상.','경막내.','경막내.']),
Q('3교시 STT 29:53','전이성 척추 종양의 치료 결정에서 고려 사항이 아닌 것은?',['원발암 종류와 조절 상태','전신 상태','기대 여명','신경학적 결손·불안정성','환자의 혈액형'],5,'3교시 STT 28:54–30:30: 원발암, 전신상태, 기대여명, 신경장애·불안정성 — 비수술(진통제·보조기·호르몬·방사선·스테로이드), 수술(감압·고정).',['고려.','고려.','고려.','고려.','정답.']),
]

# 드라이브 티야방 정리 (specs/tyroom.py)
from tyroom import TYR as _TYR
TY+=_TYR.get(TOPIC['id'],[])
