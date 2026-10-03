"""10/1 1·2교시 뇌전증 수술적 치료 1·2 (고은정) — 학습지 343–368쪽 · 강의록(1·2교시 공통) · STT(고은정, 1·2교시 연속 강의, 2교시 별도 자료 없음).
시야검사 그림(2017 객43)은 학습지 356쪽 원본을 잘라 넣음. 2018 객46은 학습지에 그림이 없음.
2014 객47·2013 객6은 정답 칸이 비어 있어 같은 문제의 답·복원자 해설을 따름(주의 문구)."""
import sys; sys.path.insert(0,__file__.rsplit('/',1)[0]); from tyhelp import T
from fixlib import vis

TOPIC=dict(id='topic-036',prof='고은정',date='10/1',title='뇌전증 수술적 치료 1·2',period='1·2교시')

KIND='강의록 Type of surgical treatment: (1) Resection — temporal lobectomy, selective amygdalohippocampectomy, topectomy, lesionectomy (2) Disconnection — multiple subpial transection(MST), corpus callosotomy, functional hemispherectomy (3) Ablation — radiofrequency thermocoagulation, laser interstitial thermal therapy(LiTT) (4) Neuromodulation — VNS, DBS, RNS (5) Radiosurgery. STT 34:45–48:49: 잘라내기 → 못 자르면 disconnection → 그것도 안 되면 지지기(ablation) → 다 안 되면 neuromodulation, 덧붙여 감마나이프.'
CAND='강의록 Candidates: 유병률 인구의 1%; 70%는 약으로 조절, 30%는 약물 난치 → 수술 후보; 적절한 용량의 ASM 2가지 이상에도 발작 지속, 발작으로 삶의 질 저하. 20–40%가 적절한 치료에도 발작하지만 수술 의뢰는 1% 미만, 발병부터 수술까지 평균 20년 이상. STT 10:57–13:48: 70–80%는 약으로 조절, 20–30%가 medically intractable.'
CAND_TB='복원자(신경외과학 4판 448–449쪽): 1) 약물치료에도 발작이 지속되는 난치성 2) 발작 시작 부위를 잘 알 수 있을 때 3) 절제할 부분이 기능적으로 안전한 부위일 때 — 세 가지가 충족되면 수술 고려; 대체로 2개 이상 약물을 2년간 써도 조절이 힘들면 난치성; 모든 소아가 아니라 소아 난치성 뇌전증에서 조기 수술 권유. '+CAND
PRE='강의록 Preoperative evaluation: 1) EEG(non-invasive) 2) Neuroimaging — MRI, PET, SPECT, MRS, 3D surface rendering, fMRI 3) 24h video-EEG — semi-invasive(sphenoidal, foramen ovale electrode), invasive(subdural grid·strip, depth electrode; 국소화가 불확실하거나 기능 영역이 걸릴 때) 4) Wada test(언어·기억), 신경심리검사. STT 15:38–22:02: PET은 포도당 대사 — interictal에는 저대사, ictal에는 과대사; SPECT는 혈류; MRS는 세포 성분(정상은 NAA가 가장 높고, 비정상 조직은 NAA가 떨어지고 choline이 역전); 3D 렌더링은 일반 MRI에서 안 보이는 피질 구조 이상.'
WADA='STT 30:13–33:00: Wada test — 한쪽 ICA에 카테터를 걸고 약(예전 amobarbital sodium, 지금 국내는 pentothal sodium)을 넣어 한쪽 뇌를 약 3분 재우고, 깨어 있는 쪽에 물건·소리·글씨 과제 약 25가지를 준 뒤 다 깨면 기억하는지 물어 언어·기억 우세 반구를 정한다; 시행 전 혈관조영으로 한쪽 ICA가 양쪽 뇌를 공급하지 않는지 확인.'
TLE='강의록 Temporal lobectomy: standard(=anterior temporal resection) — 약물 난치 측두엽 뇌전증, 내측 측두엽 경화증 등; 우세측은 측두극에서 STG 3–4.5 cm, 비우세측은 vein of Labbé(4.5–6 cm)까지; 합병증 — 시야 결손(pie in the sky, Meyer\'s loop), 편마비(anterior choroidal artery), 이름대기·언어 장애(우세측), 기억 저하. STT 36:42–37:41, 53:23: 측두엽 뇌전증만이 유일하게 surgically curable — 수술 후 95–99%가 재발 없이 생활.'
CALLO='강의록 Disconnection surgery: corpus callosotomy 적응증 — drop attack, multiple 또는 poorly localized, secondary GTC; hemispherectomy 적응증 — Sturge-Weber, Rasmussen 뇌염, 발달 이상(다엽 피질이형성, 다소뇌회증, 뇌회결손), 금기 — 건강한 반구에서 발작. STT 41:22, 58:00: 뇌량을 2/3–3/4 잘라 양쪽 박자가 안 맞게 → 넘어지지 않고 안전.'
MST='강의록: MST — 발작이 eloquent cortex(언어·운동·1차 감각)에서 시작할 때. STT 39:30–40:28, 59:49–01:00:51: 피질 두께(약 5 mm)까지 프로브를 넣어 5 mm 간격으로 옆으로 퍼지는 수평 섬유만 끊고 아래로 내려가는 수직 섬유(기능)는 남겨 전파만 막는다.'
VNS='강의록: VNS — 완화적(드물게 완치), 왼쪽 경부 미주신경 자극, 발작 감소 중앙값 3개월 46%·1년 57%·2년 63%; 적응증 — 2가지 이상 ASM 실패 + 절제술 후보가 아님. STT 01:03:37–01:04:35: 오른쪽 미주신경은 SA node를 지배해 자극하면 심정지(asystole) 위험 → 왼쪽이 원칙, 닫기 전 EKG 확인.'
RS='강의록 Radiosurgery: 혈관 기형 동반 뇌전증, 시상하부 과오종, 내측 측두엽 경화증 동반 MTLE, 남은 뇌전증 유발 영역.'
CHY='최하영'; KEJ='고은정'

def Y(meta,stem,choices,ans,basis,exps,**k): d=dict(meta=meta,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
def S(meta,stem,answer,basis,**k): d=dict(meta=meta,stem=stem,answer_text=answer,basis=basis,subj=True); d.update(k); return d

IND_ST='다음 중 뇌전증 수술(epilepsy surgery)의 적응증이 되는 경우는?'
IND_CH=['약물치료에도 불구하고 발작이 지속되는 난치성 간질','발작의 시작부위를 정확히 알 수 없는 경우','절제 계획한 부위가 기능적으로 중요한 부위(eloquent area)일 때','2가지 이상의 약물로만 발작이 조절될 때','모든 소아간질 환자']
IND_E=['정답.','시작 부위를 알 수 있어야.','기능적으로 안전해야.','조절되면 수술 아님.','소아 난치성에서.']
IND2_CH=['약물치료에도 불구하고 발작이 지속되는 난치성 간질','검사 상 발작 시작부위를 정확히 알 수 없을 때','절제 계획한 부위가 기능적으로 중요한 부위일 때','두 가지 이상의 약물 치료로 발작이 조절 될 때','모든 소아 간질 환자']
TRUE_ST='다음 중 간질수술에 대한 올바른 설명은?'
TRUE_CH=['경련 차단 전달술은 뇌전장의 근간을 치료하는 것으로 병소의 근치적 절제를 하는 수술이다.','발작의 시작부위가 어디인지 모를 경우 수술적 치료가 효과적이다.','뇌간 절제술(corpus callosotomy)은 발작경로 차단술(disconnection surgery)의 일종이다.','다발성 연막하 절제술(multiple subpial transection)은 언어, 운동영역 등이 있는 부위(eloquent area)에 시행할 수 없다.','미주신경 자극술(vagal nerve stimulation)은 약물로 조절이 잘 되는 환자에게만 시행한다.']
TRUE_B='복원자: ① 근치적 절제는 resective surgery 설명 ② 시작 부위를 알아야 ③ 정답 ④ MST는 eloquent area에 쓴다 ⑤ VNS는 약물 난치이나 절제가 어려울 때. '+KIND
TRUE_E=['절제술 설명.','알아야 한다.','정답.','eloquent area에 쓴다.','약물 난치에.']
PRE_ST='뇌전증 환자의 수술 전 검사에 대한 다음의 설명 중 옳지 않은 것은?'
PRE_CH=['와다(Wada) 검사는 내경동맥에 소디움-아모바비탈을 주사하고, 뇌의 언어영역 부분을 편재화 한 수 기억력을 검사한다.','FDG-PET은 일반적으로 경련 발생 부위에서 발작 사이기간 중 정상보다 뇌대사가 증가하는 것을 이용하여, 경련발생 부위를 예측하는 데 사용한다.','뇌 MRI는 수술 대상자에게 절대적인 검사고, 특히 촬영부위 간격을 작게 하여 뇌의 전부분을 찍어서 이상부위를 세밀하게 확인한다.','난원공 전극 삽입술 등은 MRI소견과 뇌파소견상의 병소가 일치하지 않을 때 시행한다.','난원공 전극 삽입술이나 경막하 전극 삽입술은 수술 후 경막하 혈종이나 감염 등의 위험성이 있다.']
PRE_B='복원자(매년 같은 문제): ② FDG-PET에서 대사가 증가하는 것은 발작 사이기간(interictal)이 아니라 발작기간(ictal). '+PRE
PRE_E=['옳다.','틀리다(정답) — interictal은 저대사.','옳다.','옳다.','옳다.']
TLE_ST='다음 중 간질 수술에 대한 올바른 설명은?'
TLE_CH=['경련 차단전달술은 뇌전증의 근간을 치료하는 것으로 병소의 근치적 절제를 하는 수술이다.','Temporal lobar epilepsy 의 경우는 Anterior temporal lobectomy 로 수술하는데 예후가 매우 좋다','신피질 절제술(Neocortical resections), 병소절제술(Lesionectomy) 등은 ~','Multiple subpial transection은 언어, 운동 등을 담당하는 곳에 시행할 수 없다.','Vagal nerve stimulation 은 약물로 조절이 잘 되는 환자에게만 시행한다.']
TLE_B='복원자: ② 매년 나오는 가장 중요한 문장 — 측두엽 뇌전증은 유일하게 완전 제거가 가능하고 예후가 좋다; ③은 복원 실패(틀린 문장). '+TLE
TLE_E=['틀리다 — callosotomy 등은 근치 아님.','정답.','복원 실패(틀린 문장).','eloquent area에 쓴다.','약물 난치에.']
TLE2_ST='다음 중 간질 수술에 대한 올바른 설명은?'
TLE2_CH=['Temporal lobar epilepsy의 경우는 Anterior Temporal Lobectomy로 완전한 치료가 가능하다.','Standard temporal lobectomy에 대한 설명','MST(Multiple subpial dissection)에 대한 설명','VNS(Vagal nerve stimulation)에 대한 설명','Callostomy에 대한 설명']
TLE2_B='복원자: 1번이 답이고 티야 — 나머지 보기는 원문 미복원(보기 내용만 적힘). '+TLE
TLE2_E=['정답.','원문 미복원.','원문 미복원.','원문 미복원.','원문 미복원.']
VF_ST='35세 남자환자가 medial temporal sclerosis로 인한 epilepsy 양상이 관찰되어 anterior temporal lobectomy를 시행하였다. 수술 후 상기 환자는 시야의 불편감을 느껴 visual field검사를 시행하였고 검사결과는 다음과 같다. 손상을 의심해 볼 수 있는 부위는 다음 중 어디인가?'
VF_CH=['Optic nerve','Optic chiasm','Optic tract',"Meyer's loop",'Occipital lobe']
VF_B="복원자: 시야 결손이 right homonymous superior quadrantanopia → 좌측 측두엽 병변으로 위쪽 시방사(Meyer's loop) 손상. "+TLE
VF_E=['단안 결손.','양이측 반맹.','동측 반맹.','정답.','반맹·황반 보존.']
SP_ST='다음 중 틀린 것은?'
SP_CH=['(원문 보기 미복원)','간질병소의 뇌혈류 SPECT/PET은 발작간(interictal)에 뇌혈류/대사 증가하는 것을 확인한다.','MRI는 수술을 해야하는 환자들에게는 필수적이며 촬영 거리를 넓게 잡아 하나하나 세세히 판독한다.','후두공(foramen magnum)과 subdural grip, subdural strip을 이용하여 검사를 한다.','Foramen magnum 이용한 수술은 합병증이 적다.']
SP_B='복원자: 다른 보기는 강의록에도 없었지만 ②가 확실히 틀림 — 발작 중(ictal) 뇌혈류·대사 증가, 발작간(interictal) 감소. '+PRE
SP_E=['원문 미복원.','틀리다(정답).','복원 부정확.','복원 부정확.','복원 부정확.']
VFV=vis('시야검사 결과 (학습지 356쪽, 2017 객43)','epsx17_43_vf.jpg')

YAMA=[
S('2026.10.1 뇌전증 수술적 치료 1교시 강의록 QUIZ 1','뇌표면이 아닌 뇌전증병소를 직접 타겟하여 3차원 좌표를 정하고 전극을 넣는 방법의 이름은 무엇인가요?','stereo-EEG (stereotactic EEG, SEEG)',
 'STT 33:00–34:45: 프레임을 쓰고 좌표를 정해 들어가는 stereotactic EEG — 원형은 depth electrode(측두엽·해마만), 백질 문제까지 찾을 수 있다; 피질 표면 이상은 subdural grid가 더 잘 찾는다. 신경외과 로봇 수술(ROSA)이 SEEG 전극을 꽂는 수술. '+PRE),
S('2026.10.1 뇌전증 수술적 치료 2교시 강의록 QUIZ 2','뇌전증병소를 완전히 제거하지 못하거나 제거 후에도 증상이 발생하는 경우 발작을 조절하기 위해 전극을 삽입하여 외부에서 전류의 범위와 세기를 조절하는 수술적 처치의 이름을 종합하여 무엇이라고 하나요?','neuromodulation (VNS, DBS, RNS)',
 'STT 01:11:22–01:12:28: 뇌졸중 후·외상 후 뇌전증이 늘면서 절제·단절·소작을 할 수 없는 경우가 많아 neuromodulation이 다시 각광. '+VNS),
Y('야마 2025 객13 · 학습지 344쪽 원문대조','놓침발작(Drop attack)을 control하기 위한 뇌전증 수술은?',
 ['Temporal lobectomy','Amygdalohippocampectomy','Corpus Callosotomy','Multiple Subpial Transection','Topectomy'],3,prof=KEJ,
 basis='복원자: 수업 중 기억하라고 하셨고 2023 야마(객37). '+CALLO,exps=['절제술.','절제술.','정답.','eloquent cortex.','절제술.']),
Y('야마 2025 객15 · 학습지 344쪽 원문대조','뇌의 화학적 대사를 이용한 영상촬영기법은?',['MRI','SPECT','PET','MRS','fMRI'],4,prof=KEJ,
 basis='복원자: MRS는 MRI 장비로 모양이 아니라 그 부위의 화학적 성분(대사물질별 고유 peak)을 본다 — 2023 야마의 "포도당 대사 = PET"만 보고 틀렸다고 함. '+PRE,
 exps=['구조.','혈류.','포도당 대사(혈류).','정답 — 화학 성분.','활성(혈류).']),
Y('야마 2023 객35 · 학습지 344쪽 원문대조','뇌전증 수술 전 촬영하는 영상 중 뇌의 대사를 확인하는 영상기법을 고르시오.',
 ['뇌자기공명영상','자기공명분광법','양전자방출단층촬영','3D 표면 렌더링','뇌확산텐서이미지'],3,prof=KEJ,
 basis='복원자: 수술 전 영상 — MRI, PET, MRS, 3D surface rendering, fMRI; DTI는 백질 회로를 보는 방법(정신과 수업). '+PRE,
 exps=['구조.','화학 성분.','정답 — 포도당 대사.','피질 모양.','백질 연결.']),
Y('야마 2023 객36 · 학습지 344쪽 원문대조','뇌전증 수술 중 발작파가 주변으로 퍼져나가는 것을 차단하는 수술을 고르시오.',
 ['Topectomy','Lesionectomy','Multiple subpial transection','Vagus nerve stimulation','Hemispherectomy'],3,prof=KEJ,
 basis='복원자: MST는 운동 기능은 아래로 내려가지만 옆으로 가는 것은 잘라 propagation을 막는다. '+MST,
 exps=['절제.','절제.','정답.','neuromodulation.','반구 단절.']),
Y('야마 2023 객37 · 학습지 345쪽 원문대조','놓침발작 (attack drop)의 발작증상에 가장 많이 적용되는 뇌전증 수술을 고르시오.',
 ['Callostomy','Hemispherotomy','MST','Topectomy','Vagus nerve stimulation'],1,prof=KEJ,
 basis='복원자: 고은정 교수님의 왕왕왕 티야(나온 티야 — drop attack시 callosotomy; 안 나온 티야 — VNS는 왼쪽만, temporal lobectomy 합병증 pie in the sky). '+CALLO,
 exps=['정답.','반구.','eloquent cortex.','절제.','자극.']),
Y('야마 2023 객38 · 학습지 346쪽 원문대조','혈관성 병변이 원인이 되는 뇌전증의 수술적 처치 중 가장 많이 사용되는 수술을 고르시오.',
 ['Topectomy','Radiosurgery','Radiofrequency thermocoagulation','Laser ablation','Callostomy'],2,prof=KEJ,
 basis=RS,exps=['아니다.','정답.','아니다.','아니다.','아니다.']),
Y('야마 2022 객19 · 학습지 346쪽 원문대조',IND_ST,IND_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2022 객20 · 학습지 347쪽 원문대조',TRUE_ST,TRUE_CH,3,prof=CHY,basis=TRUE_B,exps=TRUE_E),
Y('야마 2022 객21 · 학습지 347쪽 원문대조',PRE_ST,PRE_CH,2,prof=CHY,basis=PRE_B,exps=PRE_E),
Y('야마 2022 객22 · 학습지 348쪽 원문대조','뇌전증의 수술방법이 아닌것은?',
 ['Temooral lobectomy','Aneurysal neck clipping','Functional hemispherectomy','Callosotomy','Vagal nerve stimulation'],2,prof=CHY,
 basis='복원자: aneurysmal neck clipping은 뇌동맥류 치료. '+KIND,exps=['절제.','정답.','단절.','단절.','자극.']),
Y('야마 2021 객2 · 학습지 348쪽 원문대조','다음 중 뇌전증 수술(Epilepsy surgery)의 적응증이 되는 경우는?',IND_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2021 객14 · 학습지 348쪽 원문대조',TRUE_ST,TRUE_CH,3,prof=CHY,basis=TRUE_B,exps=TRUE_E),
Y('야마 2021 객34 · 학습지 349쪽 원문대조','뇌전증 환자의 수술전 검사에 대한 다음의 설명중 옳지 않은 설명은?',PRE_CH,2,prof=CHY,basis=PRE_B,exps=PRE_E),
Y('야마 2020 객80 · 학습지 349쪽 원문대조','뇌전증 환자의 수술전 검사에 대한 다음의 설명중 옳지 않은 설명은?',PRE_CH,2,prof=CHY,basis=PRE_B,exps=PRE_E),
Y('야마 2020 객81 · 학습지 350쪽 원문대조',TLE_ST,TLE_CH,2,prof=CHY,basis=TLE_B,exps=TLE_E),
Y('야마 2020 객83 · 학습지 350–351쪽 원문대조','다음 중 뇌전증 수술(Epilepsy surgery)의 적응증으로 적절한 것은?',
 ['약물치료로 조절되는 간질','검사로 발작이 시작되는 부위를 정확히 알 수 있을 때','절제 계획한 부위가 기능적으로 중요한 부위(Eloquent area)일 때','두 가지 이하의 약물 치료로 발작이 조절되지 않을 때','성인 간질 환자'],2,prof=CHY,
 caveat='제공 정답 ② 유지 — 복원자가 보기를 정확히 외우지 못했다고 함(④ 문구 주의)',
 basis='복원자: 야마에서 보기만 조금씩 바뀜 — 세 조건(난치성, 시작 부위를 앎, 기능적으로 안전) 충족 시 수술 고려. '+CAND_TB,
 exps=['아니다.','정답(제공).','안전해야.','복원 부정확 — 논란 보기.','소아도 해당.']),
Y('야마 2019 객60 · 학습지 351쪽 원문대조','다음 중 뇌전증 수술의 적응증은?',IND2_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2019 객61 · 학습지 351쪽 원문대조','뇌전증 환자의 수술전 검사에 대한 다음의 설명중 옳지 않은 설명은?',PRE_CH,2,prof=CHY,basis=PRE_B,exps=PRE_E),
Y('야마 2018 객44 · 학습지 352쪽 원문대조','다음 중 간질 수술(epilepsy surgery)을 시행해야 하는 경우는?',IND_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2018 객45 · 학습지 353쪽 원문대조',TLE_ST,TLE_CH,2,prof=CHY,basis=TLE_B,exps=TLE_E),
Y('야마 2018 객46 · 학습지 353–354쪽 원문대조',VF_ST,VF_CH,4,prof=CHY,basis=VF_B,exps=VF_E),
Y('야마 2018 객47 · 학습지 354쪽 원문대조','뇌전증 환자의 수술전 검사에 대한 다음의 설명중 옳지 않은 설명은?',PRE_CH,2,prof=CHY,basis=PRE_B,exps=PRE_E),
Y('야마 2017 객40 · 학습지 354쪽 원문대조',TLE2_ST,TLE2_CH,1,prof='이종명',basis=TLE2_B,exps=TLE2_E),
Y('야마 2017 객41 · 학습지 355쪽 원문대조','다음 중 뇌전증 수술의 적응증은?',IND2_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2017 객42 · 학습지 355쪽 원문대조','뇌전증 수술에 대해 옳은 것은?',
 ['(원문 보기 미복원)','위치를 잘 모르는 데에 효과적이다.','Corpus callotomy는 경련 차단전달술에 포함된다.','MST 수술은 언어, 운동 등을 담당하는 곳에 시행할 수 없다.','VNS관련 내용'],3,prof=CHY,
 basis='복원자: corpus callosotomy — 뇌량을 절단해 발작의 퍼짐과 전신화를 차단(정답 ③); MST는 기능 영역에서 수평 전파 차단. '+KIND,
 exps=['원문 미복원.','알아야 한다.','정답.','eloquent area에 쓴다.','원문 미복원.']),
Y('야마 2017 객43 · 학습지 356쪽 원문대조',VF_ST,VF_CH,4,prof=CHY,visual=VFV,basis=VF_B,exps=VF_E),
Y('야마 2017 객44 · 학습지 356–357쪽 원문대조','다음 설명 중 옳지 않은 것은?',
 ['Wada test는 내경동맥에 소듐-아모바비탈을 주사하고, 뇌의 언어 영역 부분을 편재화한 후 기억력을 검사한다.','간질병소의 뇌혈류 SPECT/PET는 ictal 시기에 뇌혈류/대사가 증가하는 것을 확인한다.','MRI는 수술 대상자에게는 절대적인 검사이고, 특히 촬영부위 간격을 작게하여 뇌의 전 부분을 찍어서 이상 부위를 세밀하게 확인해야 한다.','Subdural strip은 뇌파와 MRI 검사 결과가 일치할 때 시행한다.','Subdural grid는 술 후 출혈 및 감염 등의 합병증이 잘 발생한다.'],4,prof=CHY,
 basis='복원자: 침습적 전극은 뇌파와 MRI가 일치하지 않을 때; foramen ovale 전극은 측두엽 뇌전증 편측화에 유용하고 덜 침습적, 경막하 전극(strip·grid)은 모든 뇌전증에 유용. '+PRE,
 exps=['옳다.','옳다.','옳다.','틀리다(정답) — 불일치할 때.','옳다.']),
Y('야마 2016 객33 · 학습지 357쪽 원문대조','다음 중 뇌전증 수술의 적응증은?',IND2_CH,1,prof=CHY,basis=CAND_TB,exps=IND_E),
Y('야마 2016 객34 · 학습지 357–358쪽 원문대조','다음 중 간질 수술에 대한 올바른 설명은?',TLE2_CH,1,prof=CHY,basis=TLE2_B,exps=TLE2_E),
Y('야마 2016 객35 · 학습지 358쪽 원문대조',VF_ST.replace('medial','mesial'),VF_CH,4,prof='양태호',basis=VF_B,exps=VF_E),
Y('야마 2016 객36 · 학습지 359쪽 원문대조','다음 설명 중 옳지 않은 것은?',
 ['Wada test에 관한 지문, language?','FDG-PET? SPECT/PET?으로 봤을 때 interictal 시기에 뇌혈류/대사 증가한다.','수술 대상자에게는 절대적인 검사이고, 특히 촬영부위 간격을 작게하여(thin section) 뇌의 전 부분을 찍어서 이상 부위를 세밀하게 확인해야 한다.','Foramen ovale를 통해 subdural grip, strip을 한다는 내용','Foramen ovale를 통해 접근하는건 수술하기 어려운 부위이거나 한다는 내용 + 침습적이라는 내용'],2,prof=CHY,
 basis='복원자: 보기가 길어 복원이 잘 안 됐지만 ②만 알면 풂 — ictal 시기에 증가. '+PRE,exps=['복원 부정확.','틀리다(정답).','옳다.','복원 부정확.','복원 부정확.']),
Y('야마 2015 객42 · 학습지 359쪽 원문대조','다음 중 간질 수술(epilepsy surgery)을 시행해야 하는 경우는?',
 ['발작의 시작부위를 정확히 알 수 없는 경우','약물로 조절이 되지 않는 난치성 간질','수술적 절제를 계획한 부분이 중요한 (eloquence) 영역인 경우','두 개의 약물로 조절이 되는 간질','모든 소아성 간질 환자'],2,prof=CHY,
 basis=CAND_TB,exps=['알아야 한다.','정답.','안전해야.','조절되면 아님.','소아 난치성에서.']),
Y('야마 2015 객43 · 학습지 360쪽 원문대조','다음 설명 중 옳은 것은?',
 ['(원문 보기 미복원)','Tempolar lobar Epilepsy의 경우는 Anterior Temporal Lobectomy로 완전한 치료가 가능해진다.','Standard temporal lobectomy에 대한 설명','MST(Multiple subpial dissection)에 대한 설명','VNS(Vagal nerve stimulation)에 대한 설명'],2,prof=CHY,
 basis='복원자: 사진이 흔들려 완전 복원 실패 — 답은 temporal lobectomy로 완치 가능. '+TLE,exps=['원문 미복원.','정답.','원문 미복원.','원문 미복원.','원문 미복원.']),
Y('야마 2015 객44 · 학습지 360–361쪽 원문대조',VF_ST.replace('medial','mesial'),VF_CH,4,prof='양태호',basis=VF_B,exps=VF_E),
Y('야마 2015 객45 · 학습지 361쪽 원문대조',SP_ST,SP_CH,2,prof=CHY,basis=SP_B,exps=SP_E),
Y('야마 2014 객47 · 학습지 362쪽 원문대조','다음 설명 중 옳은 것은?',
 ['(원문 보기 미복원)','Tempolar lobar Epilepsy의 경우는 Temporal Lobectomy로 완전한 치료가 가능해진다.','Standard temporal lobectomy에 대한 설명','MST(Multiple subpial dissection)에 대한 설명','CNS(Vagal nerve stimulation)에 대한 설명'],2,prof=CHY,
 caveat='학습지 정답 칸이 비어 있음 — 같은 문제(2015 객43)의 답 ②를 따름',basis=TLE,exps=['원문 미복원.','정답.','원문 미복원.','원문 미복원.','원문 미복원.']),
Y('야마 2014 객48 · 학습지 362쪽 원문대조',SP_ST,SP_CH,2,prof=CHY,basis=SP_B,exps=SP_E),
Y('야마 2013 객3 · 학습지 362–363쪽 원문대조','Temporal lobe epilepsy에서 정확한 병변을 알기 위해서 시행하는 Invasive EEG 방법은 무엇인가?',
 ['Depth electrode','Subdural Strip','Subdural Grid','ECoG'],1,prof=CHY,
 basis='복원자: 수업 중 언급 — depth electrode(측두엽 뇌전증의 기원 측 결정). STT 27:44: depth는 측두엽·해마만 타깃. '+PRE,exps=['정답.','피질 표면.','피질 표면.','수술 중 피질뇌파.']),
Y('야마 2013 객4 · 학습지 363쪽 원문대조','수술로 완치가 가능한 뇌전증을 고르시오.',['전두엽 뇌전증','측두엽 뇌전증','두정엽 뇌전증','후두엽 뇌전증'],2,prof=CHY,
 basis='복원자: "temporal lobe epilepsy is surgically remediable epilepsy". '+TLE,exps=['아니다.','정답.','아니다.','아니다.']),
Y('야마 2013 객5 · 학습지 363쪽 원문대조','뇌피질의 1차 고유영역에 epileptogenic zone 이 있을 경우 시행할수 있는 수술방법을 고르시오.',
 ['Lesionectomy','Topectomy','Multiple subpial transection','Funtional hemispherectomy'],3,prof=CHY,basis=MST,exps=['절제.','절제.','정답.','반구.']),
Y('야마 2013 객6 · 학습지 363–364쪽 원문대조','뇌의 여러 엽에 병소가 있어서 절제를 할 수 없을 때 사용할 수 있는 방법을 모두 고르시오.',
 ['Multiple subpial transection','Callosotomy','Deep brain stimulation','Topectomy','Vagal nerve stimulation'],[2,3,5],prof=CHY,
 caveat='학습지 정답 칸이 비어 있음 — 복원자 해설 "답: ② ③ ⑤"를 따름',
 basis='복원자: MST는 motor cortex 등 절제할 수 없는 엽에, topectomy는 부분 절제. '+KIND,exps=['한 부위 eloquent cortex.','정답.','정답.','절제.','정답.']),
S('야마 2012 주52 · 학습지 364쪽 원문대조','뇌에 병변이 있을 때 그 부위가 매우 중요하여 절제가 힘들다. 적절한 치료법은 무엇인가?','MST (multiple subpial transection)',
 '복원자: motor cortex 병변을 제거하면 근력 약화 → central sulcus에 수직으로 5 mm 간격으로 긁어 수평 전파 차단. '+MST,prof=CHY),
S('야마 2012 주53 · 학습지 364쪽 원문대조','뇌전증 환자의 몇 %가 난치성 뇌전증 환자인가?','20%',
 '복원자(당시 강의록): 80% medical treatment, 20% intractable → 수술 후보. '+CAND,prof=CHY,
 caveat='제공 답 20% 유지 — 2026 강의록은 30%(STT는 20–30%)'),
S('야마 2012 주54 · 학습지 365쪽 원문대조','수술로 치료 효과가 가장 좋은 간질은 무엇인가?','Temporal lobe epilepsy (측두엽 뇌전증)',
 '복원자: temporal lobectomy 성공률 80–90%, extratemporal neocortical resection 50–55%(당시 수업). '+TLE,prof=CHY),
S('야마 2012 주55 · 학습지 365쪽 원문대조','난치성 뇌전증의 수술적 치료를 위하여 병변의 위치를 확진할 수 있는 방법?','MRI',
 '복원자: 강의록·야마에 근거가 없어 논문을 참고해 MRI로 유추(뇌 지도화는 기능 확인이 목적). '+PRE,prof=CHY,
 caveat='복원자 추정 답 — 오늘 강의 흐름상 MRI·PET·SPECT로 안 되면 invasive monitoring(depth·subdural·SEEG)으로 확인'),
S('야마 2012 주56 · 학습지 366쪽 원문대조','병소절제술을 할 수 없는 난치성 뇌전증 환자에서 시행할 수 있는 치료는?','① Corpus callosotomy ② Deep brain stimulation ③ Vagal nerve stimulation',
 '복원자: 병소가 여러 곳이거나 eloquent area에 있으면 절제 대신 단절·자극. '+KIND,prof=CHY),
Y('야마 2011 객28 · 학습지 366쪽 원문대조','뇌의 여러엽에 걸쳐 간질병소가 있어 절제술을 할 수 없는 경우 시행할 수 있는 수술방법을 모두 고르시오.',
 ['Topectomy','Corpus callostomy','Vagus nerve stimulation','Multiple subpial transection','Deep brain stimulation','Temporal lobectomy'],[3,5],prof=CHY,
 caveat='제공 정답 3·5 유지 — 복원자도 여러 엽 병소에 대한 근거를 찾기 힘들다고 함(callosotomy 논란)',
 basis='복원자: 절제술이 아닌 자극술 VNS·DBS를 답으로. '+KIND,exps=['절제.','논란 보기.','정답.','eloquent cortex.','정답.','절제.']),
S('야마 2011 주5 · 학습지 367쪽 원문대조','Invasive EEG monitoring의 종류를 쓰시오.','Depth electrode, subdural grid, subdural strip, ECoG',
 '복원자(당시 강의록). 2026 강의록: invasive — subdural grid·strip, depth electrode(+ stereo-EEG); semi-invasive — sphenoidal, foramen ovale. '+PRE,prof=CHY),
S('야마 2011 주6 · 학습지 367쪽 원문대조','수술로 완치될 수 있는 간질을 쓰시오.','Temporal lobe epilepsy',
 '복원자: "Temporal lobe epilepsy is surgically remediable epilepsy!!" '+TLE,prof=CHY),
S('야마 2011 주7 · 학습지 367쪽 원문대조','Motor cortex에 epileptogenic zone이 있을 경우 시행할 수 있는 수술방법을 쓰시오.','다발성 연막하 절제술(MST)',
 '복원자: central sulcus에 수직으로 5 mm 간격 — pyramidal cell 간 연결 차단, corona radiata로 아래로 퍼지는 것은 못 막지만 옆으로 퍼지는 것은 막는다. '+MST,prof=CHY),
]

VAR=[
dict(key='2026.10.1 뇌전증 수술적 치료 1교시 강의록 QUIZ 1 변형',stem='뇌전증 수술 전 침습적 뇌파 감시에 대한 설명으로 옳은 것은?',
 choices=['Stereo-EEG는 3차원 좌표로 전극을 꽂아 깊은 곳·백질 쪽 이상을 찾을 수 있다','Subdural grid는 두개골을 열지 않고 넣는다','Sphenoidal electrode는 invasive EEG다','Depth electrode는 피질 표면에 판을 얹는 방식이다','피질 표면의 이상은 SEEG가 grid보다 항상 더 잘 찾는다'],ans=1,
 basis=PRE,exps=['정답.','개두 후 경막을 열고 얹는다.','semi-invasive.','grid 설명.','표면 이상은 grid가 더 잘 찾는다.']),
dict(key='2026.10.1 뇌전증 수술적 치료 2교시 강의록 QUIZ 2 변형',stem='Neuromodulation에 해당하지 않는 것은?',
 choices=['Vagus nerve stimulation','Deep brain stimulation','Responsive neurostimulation','Anterior thalamic nucleus 자극','Corpus callosotomy'],ans=5,
 basis=KIND,exps=['해당.','해당.','해당.','DBS 표적.','정답 — disconnection.']),
dict(key='야마 2025 객13 변형',stem='Corpus callosotomy의 적응증이 아닌 것은?',
 choices=['Drop attack','Multiple 또는 poorly localized 발작','Secondary GTC seizure','양측 반구 사이 발작 전파','단일 측두엽 내측 경화증으로 인한 국소 발작'],ans=5,
 basis=CALLO,exps=['적응증.','적응증.','적응증.','차단 목적.','정답 — temporal lobectomy.']),
dict(key='야마 2025 객15 변형',stem='MR spectroscopy(MRS)에서 비정상 뇌조직(뇌전증 유발 부위·종양)의 소견은?',
 choices=['NAA 감소, choline 증가(역전)','NAA 증가','choline 감소','lactate만 소실','변화 없음'],ans=1,
 basis=PRE,exps=['정답.','반대.','반대.','아니다.','아니다.']),
dict(key='야마 2023 객35 변형',stem='뇌전증 유발 부위의 interictal PET 소견으로 옳은 것은?',
 choices=['포도당 대사 감소(저대사)','포도당 대사 증가','혈류 증가','NAA 증가','변화 없음'],ans=1,
 basis=PRE,exps=['정답.','ictal.','SPECT·ictal.','MRS.','아니다.']),
dict(key='야마 2023 객36 변형',stem='Multiple subpial transection(MST)에 대한 설명으로 옳지 않은 것은?',
 choices=['eloquent cortex(언어·운동)에 epileptogenic zone이 있을 때 쓴다','피질 내 수평 섬유를 약 5 mm 간격으로 끊는다','수직으로 내려가는 섬유(기능)는 보존한다','발작파가 옆으로 퍼지는 것을 막는다','병소를 근치적으로 절제해 완치를 목표로 한다'],ans=5,
 basis=MST,exps=['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
dict(key='야마 2023 객38 변형',stem='Radiosurgery(감마나이프)의 뇌전증 적응증으로 강의록에 제시되지 않은 것은?',
 choices=['혈관 기형 동반 뇌전증','시상하부 과오종','내측 측두엽 경화증 동반 MTLE','남은 뇌전증 유발 영역','Drop attack'],ans=5,
 basis=RS,exps=['적응증.','적응증.','적응증.','적응증.','정답 — callosotomy.']),
dict(key='야마 2022 객19 변형',stem='약물 난치성 뇌전증(medically intractable epilepsy)에 대한 설명으로 옳은 것은?',
 choices=['적절한 용량의 ASM 2가지 이상에도 발작이 조절되지 않는 경우','ASM 1가지 실패','발작이 1년에 1회','모든 소아 뇌전증','MRI 이상이 있는 모든 경우'],ans=1,
 basis=CAND,exps=['정답.','부족.','아니다.','아니다.','아니다.']),
dict(key='야마 2022 객20 변형',stem='뇌전증 수술의 분류와 예의 연결로 옳지 않은 것은?',
 choices=['Resection — selective amygdalohippocampectomy','Disconnection — functional hemispherectomy','Ablation — radiofrequency thermocoagulation','Neuromodulation — responsive neurostimulation','Disconnection — lesionectomy'],ans=5,
 basis=KIND,exps=['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — resection.']),
dict(key='야마 2022 객21 변형',stem='Wada test에 대한 설명으로 옳지 않은 것은?',
 choices=['한쪽 ICA에 약물을 주입해 한쪽 반구를 잠깐 재운다','언어·기억 우세 반구를 정한다','국내에서는 현재 amobarbital 대신 pentothal sodium을 쓴다','시행 전 한쪽 ICA가 양쪽 뇌를 공급하지 않는지 확인한다','양쪽 ICA에 동시에 주입한다'],ans=5,
 basis=WADA,exps=['옳다.','옳다.','옳다(STT).','옳다.','틀리다(정답) — 한 번에 한쪽씩.']),
dict(key='야마 2022 객22 변형',stem='뇌전증의 수술방법이 아닌 것은?',
 choices=['Topectomy','Lesionectomy','Laser interstitial thermal therapy','Responsive neurostimulation','Microvascular decompression'],ans=5,
 basis=KIND,exps=['해당.','해당.','해당.','해당.','정답 — 삼차신경통 등.']),
dict(key='야마 2020 객81 변형',stem='측두엽 뇌전증 수술에 대한 설명으로 옳은 것은?',
 choices=['측두엽 뇌전증은 유일하게 surgically curable한 뇌전증으로 수술 후 95–99%가 재발 없이 지낸다','측두엽 뇌전증은 수술 효과가 가장 나쁘다','측두엽 절제 후 시야 결손은 생기지 않는다','측두엽은 운동 피질과 직접 연결되어 절제가 위험하다','우세 반구는 STG를 6 cm 이상 절제한다'],ans=1,
 basis=TLE,exps=['정답.','반대.','pie in the sky.','연결이 적어 절제 가능.','3–4.5 cm로 제한.']),
dict(key='야마 2020 객83 변형',stem='뇌전증 수술이 잘 시행되지 않는 이유로 교수님이 설명한 것이 아닌 것은?',
 choices=['약이 좋아져 대부분 약으로 조절된다','약물 난치 환자 중 극히 일부만, 평균 20년 넘게 지나서 의뢰된다','수술 후 합병증·장애에 대한 두려움','사회경제적 지원 부족','산정특례가 없어 수술비 전액을 환자가 낸다'],ans=5,
 basis='STT 03:01–05:44, 12:49–13:48, 01:11:22: 난치성 질환 산정특례로 본인 부담 10% — 경제 부담보다 합병증을 두려워한다. '+CAND,
 exps=['이유.','이유.','이유.','이유.','틀리다(정답) — 산정특례 있음.']),
dict(key='야마 2017 객43 변형',stem="Anterior temporal lobectomy의 수술 합병증과 원인의 연결로 옳은 것은?",
 choices=["반대쪽 위 1/4 시야 결손(pie in the sky) — Meyer's loop 손상",'편마비 — vein of Labbé 손상','이름대기 장애 — 비우세 반구 절제','기억 저하 — 후두엽 손상','하측 1/4 시야 결손 — Meyer\'s loop'],ans=1,
 basis=TLE,exps=['정답.','anterior choroidal artery.','우세 반구.','해마.','상측.']),
dict(key='야마 2017 객40 변형',stem='Temporal lobectomy에서 우세 반구일 때 절제 범위로 강의록에 제시된 것은?',
 choices=['측두극에서 STG 3–4.5 cm까지','vein of Labbé까지(4.5–6 cm)','측두엽 전체','후두엽까지','해마만'],ans=1,
 basis=TLE,exps=['정답.','비우세 반구.','아니다.','아니다.','selective AH.']),
dict(key='야마 2017 객44 변형',stem='Semi-invasive EEG에 해당하는 것은?',
 choices=['Foramen ovale electrode','Subdural grid','Subdural strip','Depth electrode','Stereo-EEG'],ans=1,
 basis=PRE,exps=['정답(sphenoidal과 함께).','invasive.','invasive.','invasive.','invasive.']),
dict(key='야마 2016 객36 변형',stem='뇌전증 유발 부위의 SPECT 소견으로 옳은 것은?',
 choices=['발작 중(ictal)에는 혈류 증가, 발작 사이(interictal)에는 혈류 감소','발작 사이에 혈류 증가','항상 혈류 증가','NAA 감소','포도당 대사만 본다'],ans=1,
 basis=PRE,exps=['정답.','반대.','아니다.','MRS.','PET.']),
dict(key='야마 2015 객45 변형',stem='수술 전 neuroimaging으로 강의록에 제시되지 않은 것은?',
 choices=['MRI','PET','MR spectroscopy','3D surface rendering','Diffusion tensor imaging'],ans=5,
 basis='강의록 Neuroimaging: MRI, PET, SPECT, MRS, 3D surface rendering, fMRI. 복원자(2023 객35): DTI는 백질 회로 분석(정신과).',
 exps=['해당.','해당.','해당.','해당.','정답.']),
dict(key='야마 2013 객3 변형',stem='Sphenoidal electrode에 대한 설명으로 옳은 것은?',
 choices=['관골궁(zygomatic arch) 아래로 넣어 foramen ovale 근처에 위치시키는 semi-invasive 전극','개두 후 피질에 얹는다','뇌실 안에 넣는다','두피에만 붙인다','3차원 좌표로 백질에 꽂는다'],ans=1,
 basis='강의록: Sphenoidal electrode — under the zygomatic arch to rest near the foramen ovale. STT 23:49: 머리를 열지 않고 바늘을 깊게 꽂는 semi-invasive. '+PRE,
 exps=['정답.','grid.','아니다.','scalp EEG.','SEEG.']),
dict(key='야마 2013 객4 변형',stem='측두엽 외 뇌전증(extratemporal lobe epilepsy)에 대한 설명으로 옳지 않은 것은?',
 choices=['전두엽이 60–80%로 가장 많다','증후학이 덜 특징적이다','빨리 퍼져 임상 증상만으로 국소화가 어렵다','원인 병리가 다양하다','수술로 측두엽 뇌전증보다 완치율이 높다'],ans=5,
 basis='강의록 Topectomy: lobar distribution — frontal 60–80%, parietal 4–20%, occipital 3–20%, multilobar 0–46%. '+TLE,
 exps=['옳다.','옳다.','옳다.','옳다.','틀리다(정답).']),
dict(key='야마 2013 객5 변형',stem='Topectomy에서 절제 범위를 정하는 근거(concordance)가 아닌 것은?',
 choices=['발작 증후학과의 일치','뇌파의 국소 이상','MRI의 국소 이상','PET 대사·SPECT 혈류의 국소 이상','환자의 혈액형'],ans=5,
 basis='강의록 Topectomy: semiology, EEG, MRI, metabolic, SPECT 혈류, 신경인지 장애와의 concordance. STT 51:33–56:08: 모든 증거가 한곳을 가리킬 때(concordance) 절제.',
 exps=['근거.','근거.','근거.','근거.','정답.']),
dict(key='야마 2013 객6 변형',stem='Vagus nerve stimulation(VNS)에 대한 설명으로 옳지 않은 것은?',
 choices=['왼쪽 경부 미주신경에 전극을 감는다','2가지 이상 ASM 실패 + 절제술 후보가 아닐 때 쓴다','발작 감소 효과는 시간이 지나며 커진다(3개월 46% → 2년 63%)','완화적 치료다','오른쪽 미주신경을 자극하는 것이 원칙이다'],ans=5,
 basis=VNS,exps=['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — SA node, 심정지 위험.']),
dict(key='야마 2012 주52 변형',stem='Functional hemispherectomy의 적응증이 아닌 것은?',
 choices=['Rasmussen 뇌염','Sturge-Weber 증후군','다엽 피질이형성증','다소뇌회증','건강한 반구에서 시작하는 발작'],ans=5,
 basis=CALLO+' STT 42:16: Rasmussen 뇌염 소아에서 2세 이전이 가장 좋다.',exps=['적응증.','적응증.','적응증.','적응증.','정답 — 금기.']),
dict(key='야마 2012 주53 변형',stem='2026 강의록에 제시된 뇌전증 수술 관련 수치로 옳은 것은?',
 choices=['인구의 약 1%가 뇌전증, 약 30%가 약물 난치','인구의 10%가 뇌전증','90%가 약물 난치','수술 의뢰까지 평균 1년','약물 난치 환자의 50%가 수술 의뢰'],ans=1,
 basis=CAND,exps=['정답.','아니다.','아니다.','20년 이상.','1% 미만.']),
dict(key='야마 2012 주54 변형',stem='측두엽 뇌전증(내측 측두엽 경화증)의 영상·임상 소견으로 옳지 않은 것은?',
 choices=['해마 위축','FLAIR·T2 신호 증가','interictal PET에서 측두엽 저대사','상복부에서 올라오는 aura 후 입·손 자동증','발작 중 동측 손 dystonic posturing'],ans=5,
 basis='강의록 Temporal lobectomy: rising abdominal aura → mouth·hand automatism → 반대측 손 dystonic posturing; MRI — 해마 위축, FLAIR·T2 증가; interictal PET 저대사.',
 exps=['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 반대측.']),
dict(key='야마 2012 주55 변형',stem='Selective amygdalohippocampectomy를 고려하는 상황으로 교수님이 설명한 것은?',
 choices=['뇌전증 유발 부위가 편도·해마에 국한되거나, 우세 반구라 언어 피질을 보존해야 할 때','eloquent motor cortex 병변','다엽 병변','drop attack','혈관 기형'],ans=1,
 basis='STT 37:41: 기억 관련 편도·해마만 빼서 언어는 보존하면서 발작 횟수를 줄인다. '+KIND,exps=['정답.','MST.','단절·자극.','callosotomy.','radiosurgery.']),
dict(key='야마 2012 주56 변형',stem='Responsive neurostimulation(RNS)에 대한 설명으로 옳은 것은?',
 choices=['뇌전증 유발 부위에 전극과 감지 스트립을 두고 이상 뇌파가 나오면 자극해 운동 피질로 퍼지지 않게 상쇄한다','미주신경을 주기적으로 자극한다','시상을 주기적으로 자극한다','레이저로 지진다','방사선으로 세포를 파괴한다'],ans=1,
 basis='STT 46:54–47:54: RNS는 국내에 아직 없다. '+KIND,exps=['정답.','VNS.','DBS.','LiTT.','radiosurgery.']),
dict(key='야마 2011 객28 변형',stem='뇌전증에서 DBS의 표적으로 교수님이 설명한 것은?',
 choices=['시상 전핵(anterior thalamic nucleus)','STN','GPi','Vim','Hypothalamus'],ans=1,
 basis='STT 45:04–46:00: 시상 전핵은 기억(Papez 회로)과 관련 — 주기적으로 자극. 학습지 해설: 발작 빈도 40–50% 감소.',
 exps=['정답.','파킨슨.','파킨슨 강직.','진전.','아니다.']),
dict(key='야마 2011 주5 변형',stem='Subdural grid와 stereo-EEG의 비교로 옳은 것은?',
 choices=['피질 표면의 뚜렷한 이상은 subdural grid가, 깊은 곳·백질의 이상은 SEEG가 더 잘 찾는다','SEEG는 개두가 필수다','Grid는 백질 이상을 더 잘 찾는다','둘 다 non-invasive다','SEEG는 측두엽만 볼 수 있다'],ans=1,
 basis='STT 33:55–34:45. '+PRE,exps=['정답.','좌표로 꽂음.','반대.','invasive.','depth electrode 설명.']),
dict(key='야마 2011 주7 변형',stem='언어 피질 근처 topectomy를 할 때의 방법으로 교수님이 설명한 것은?',
 choices=['환자를 깨운 상태(awake)에서 피질 자극으로 언어 장애가 생기는 자리를 피해 절제','전신마취 + 근이완제 후 절제','언어 피질을 함께 절제','Wada test만으로 절제 범위 결정','방사선 수술만 시행'],ans=1,
 basis='STT 48:49–50:43: 운동 피질 근처는 근이완제 없이 재우고 피질 자극, 언어 피질은 깨워서 글씨 읽기·색깔 말하기를 시키며 자극 — 언어 피질에서 2.5 cm 바깥까지만 절제.',
 exps=['정답.','운동 피질도 근이완제 안 씀.','아니다.','아니다.','아니다.']),
]

P=KEJ; ST='STT 10/1 1·2교시'
TY=[
T(P,ST+' 01:06','뇌전증 치료 약물의 용어 변경으로 교수님이 강조한 것은?',['AED(anti-epileptic drug) → ASM(anti-seizure medication)','ASM → AED','간질 → 경기','뇌전증 → 간질','AED → NSAID'],'STT 00:08–01:06.',['정답.','반대.','아니다.','반대.','아니다.']),
T(P,ST+' 07:29','교수님이 설명한 seizure와 convulsion의 사용에 대한 설명은?',['정의상 차이는 있지만 실제로는 섞어 쓰므로 굳이 나눌 필요는 없다','반드시 구분해 써야 한다','convulsion은 뇌와 무관하다','seizure는 소아에만 쓴다','둘 다 뇌전증과 같은 말이다'],'STT 06:41–08:22.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 10:57','약을 잘 먹던 뇌전증 환자가 응급실에 오는 흔한 상황으로 교수님이 든 예는?',['20–30대 남자 환자가 친구들과 술 마시며 약을 제때 안 먹었을 때','과식','수면 과다','운동 후','커피 섭취'],'STT 10:57: 70–80%는 약만 제때 먹으면 조절된다.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 13:48','약물 난치 뇌전증 환자가 수술을 꺼리는 이유로 교수님이 설명한 것은?',['평균 20년 넘게 늦게 의뢰되어 이미 발달 지연이 있고, 수술 후 편마비·언어장애 같은 합병증 가능성을 가족이 받아들이기 어렵다','수술비가 너무 비싸서','수술 기술이 없어서','약이 전혀 없어서','법적으로 금지되어서'],'STT 12:49–13:48.',['정답.','산정특례.','아니다.','아니다.','아니다.']),
T(P,ST+' 16:34','뇌전증 환자에서 PET을 찍는 이유로 교수님이 설명한 것은?',['뇌전증 유발 부위는 평소(interictal)에 숨어 있어 대사가 떨어지고, 발작 중(ictal)에는 대사가 올라가므로 이를 찾는다','혈류만 보기 위해','해부학적 모양을 보기 위해','NAA를 보기 위해','백질 연결을 보기 위해'],'STT 15:38–16:34.',['정답.','SPECT.','MRI.','MRS.','DTI.']),
T(P,ST+' 18:33','Non-invasive 검사에서 뇌전증 부위를 확정하는 방법으로 교수님이 설명한 것은?',['PET 대사 저하, SPECT 관류 저하, 발작 증후학이 한 자리를 가리키는지 맞춰 본다','MRI 하나만 본다','혈액검사로 정한다','Wada test로 정한다','CT로 정한다'],'STT 17:33–18:33: 긴가민가하면 phase 2(invasive)로.',['정답.','부족.','아니다.','언어·기억.','안 쓴다.']),
T(P,ST+' 19:23','Neuronal migration disorder가 뇌전증을 일으키는 기전으로 교수님이 설명한 것은?',['뇌실 주변에서 피질로 이주하던 세포가 중간에 멈춰 백질 안에 회색질이 남아 비정상 연결을 만든다','세포가 과도하게 피질로 이동한다','혈관이 막힌다','종양이 생긴다','수초가 사라진다'],'STT 18:33–19:23.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 22:02','3D surface rendering이 필요한 이유로 교수님이 설명한 것은?',['일반 MRI에서는 안 보이는 피질 구조 이상(중심고랑 주변이 뭉개진 모양 등)이 3D 렌더링에서만 보이기도 한다','혈류를 보기 위해','대사를 보기 위해','언어 우세를 보기 위해','전극 위치가 필요 없어서'],'STT 21:14–22:02.',['정답.','SPECT.','PET.','Wada.','아니다.']),
T(P,ST+' 22:53','뇌전증 환자에서 fMRI가 어려운 이유로 교수님이 설명한 것은?',['환자 교육과 협조가 많이 필요한데, 발달 지연이 있는 환자가 많아 협조가 잘 안 된다','방사선량이 많아서','조영제 알레르기 때문','가격이 너무 비싸서','결과가 항상 정상이라서'],'STT 22:02–22:53: 언어 우세를 fMRI로 찾으려는 연구가 진행 중이지만 정확도는 Wada test가 낫다.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 26:45','Subdural grid를 넣은 뒤 교수님이 꼭 해야 한다고 한 것은?',['피질 모양과 전극 번호를 그림으로 그려 3D 렌더링과 맞춰 두고, 발작이 시작되는 전극 부위를 찾는다','전극을 바로 제거한다','사진을 찍지 않는다','MRI를 찍지 않는다','약을 끊지 않는다'],'STT 25:47–26:45: 그래서 그림을 잘 그리라고 한다.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 29:13','신경외과의 "로봇 수술"에 대해 교수님이 설명한 것은?',['다빈치 같은 원격 조작이 아니라, 좌표를 잡아 SEEG 전극을 꽂는 것을 돕는 로봇 팔(ROSA 등)','뇌 안에서 원격 조작으로 종양을 자른다','수술 전체를 로봇이 한다','복강경과 같다','국내에서는 쓸 수 없다'],'STT 27:44–29:13: 10억–15억.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 32:05','Wada test 전 혈관조영으로 확인하는 것은?',['한쪽 ICA가 A-com을 통해 양쪽 뇌를 다 공급하고 있지 않은지(한쪽만 재워지는지)','동맥류 유무만','정맥 혈전','척추동맥','경동맥 협착만'],'STT 32:05. '+WADA,['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 34:45','Stereo-EEG와 subdural grid 중 피질 표면의 뚜렷한 이상을 더 잘 찾는 것은?',['Subdural grid','Stereo-EEG','Sphenoidal electrode','Scalp EEG','Foramen ovale electrode'],'STT 33:55–34:45: SEEG는 백질 쪽 이상을 찾는 장점.',['정답.','백질·깊은 곳.','semi-invasive.','non-invasive.','semi-invasive.']),
T(P,ST+' 36:42','측두엽 절제가 다른 부위에 비해 비교적 안전한 이유로 교수님이 설명한 것은?',['측두엽은 운동(전두엽)·감각(두정엽) 피질과 직접 연결되지 않아 기능 손상을 비껴갈 수 있다','측두엽에 혈관이 없어서','측두엽이 작아서','측두엽은 기억과 무관해서','측두엽은 재생돼서'],'STT 35:42–36:42. '+TLE,['정답.','아니다.','아니다.','기억 담당.','아니다.']),
T(P,ST+' 38:39','Lesionectomy에 대해 교수님이 설명한 것은?',['AVM·종양·해면 기형 등 동반 병변과 그 주변 변성 조직을 함께 잘라내는 것','피질만 긁어 수평 섬유를 끊는 것','뇌량을 자르는 것','한쪽 반구를 고립시키는 것','미주신경을 자극하는 것'],'STT 37:41–38:39: topectomy는 전두·두정·후두 피질에 국한된 유발 부위만 절제.',['정답.','MST.','callosotomy.','hemispherectomy.','VNS.']),
T(P,ST+' 39:30','Tuberous sclerosis처럼 병소가 여러 개일 때 교수님이 설명한 접근은?',['모두 잘라낼 수 없으므로 주변으로 퍼지는 것이라도 막는 disconnection 등을 고려','모든 결절을 한 번에 절제','수술 금기','방사선만','약 중단'],'STT 38:39–39:30.',['정답.','불가.','아니다.','아니다.','아니다.']),
T(P,ST+' 42:16','Functional hemispherectomy의 방법으로 교수님이 설명한 것은?',['뇌량을 자르고 반구 안의 백질 연결(temporal stem, 시상 주변 등)을 모두 끊어 반구를 기능적으로 고립 — 뇌는 남겨 둔다','반구 전체를 완전히 제거한다','반구에 전극만 넣는다','미주신경을 자른다','뇌실을 막는다'],'STT 41:22–42:16, 58:52–59:49: 완전히 없애면 빈 공간에 물·피가 차 hemosiderosis가 심해져 해롭다.',['정답.','예전 방식 — 해로움.','아니다.','아니다.','아니다.']),
T(P,ST+' 43:13','Radiofrequency thermocoagulation에 대해 교수님이 설명한 것은?',['프로브를 넣어 50–70도로 단백질을 응고시켜 지진다','레이저로 지지며 국내에 이미 많이 쓴다','방사선으로 DNA를 파괴한다','전류로 주기적 자극한다','피질을 긁는다'],'STT 43:13: LiTT는 레이저 프로브(SEEG 프로브처럼) — 국내 미도입. RF 프로브는 접점이 하나라 좌표를 옮겨 가며 치료.',['정답.','LiTT는 국내 미도입.','radiosurgery.','neuromodulation.','MST.']),
T(P,ST+' 45:04','VNS의 부작용과 대처로 교수님이 든 예는?',['자극 중 되돌이후두신경도 자극돼 목소리가 변함 — 자석을 대면 잠시 멈춰 축가를 부를 수 있다','청력 소실','시야 결손','편마비','설사'],'STT 44:08–45:04.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 01:04:35','VNS를 왼쪽에 하는 이유로 교수님이 설명한 것은?',['오른쪽 미주신경은 SA node를 지배해 자극 시 심정지(asystole)·급사 위험이 있어서','왼쪽이 더 굵어서','오른쪽은 수술 시야가 나빠서','왼쪽이 우세 반구라서','관습일 뿐'],'STT 01:03:37–01:04:35: 기계를 심고 닫기 전 자극해 EKG 심박수 변화 확인.',['정답.','아니다.','아니다.','아니다.','아니다.']),
T(P,ST+' 01:06:59','VNS가 뇌전증 외에 많이 쓰이는 질환으로 교수님이 든 것은?',['우울증','파킨슨병','편두통','뇌졸중','치매'],'STT 01:06:08–01:06:59: 발작 약 50% 감소가 목적, 머리를 열지 않아 편하다.',['정답.','DBS.','아니다.','아니다.','아니다.']),
T(P,ST+' 01:08:37','Gamma knife radiosurgery의 원리로 교수님이 설명한 것은?',['머리를 열지 않고 방사선을 모아 뇌전증 유발 부위 세포의 DNA를 파괴해 세포사에 빠지게 한다','열로 단백질 응고','전기 자극','피질 절개','약물 주입'],'STT 01:07:59–01:08:37. '+RS,['정답.','RF.','neuromodulation.','MST.','아니다.']),
T(P,ST+' 01:09:28','측두엽 뇌전증의 병리로 교수님이 설명한 것이 아닌 것은?',['백질 탈수초','해마 경화','피질 이형성','편도 비대(MRI 정상인데 편도가 커진 경우)','이주 장애로 뭉친 세포'],'STT 01:09:28 · 강의록 Pathology: TLE — hippocampal sclerosis, amygdalar enlargement, CD; extratemporal — cortical dysplasia, 외상, 종양, AVM, CM, 뇌염 후, Rasmussen.',['정답(아닌 것).','해당.','해당.','해당.','해당.']),
T(P,ST+' 01:11:22','최근 뇌전증이 다시 신경외과에서 중요해지는 이유와 대책으로 교수님이 설명한 것은?',['뇌졸중·외상 후 뇌전증이 늘었는데 절제가 어려워 약 다음으로 neuromodulation이 떠오르고 있다','소아 뇌전증이 사라져서','약이 없어져서','측두엽 뇌전증이 늘어서','수술비가 싸져서'],'STT 01:10:27–01:11:22.',['정답.','아니다.','아니다.','아니다.','아니다.']),
]
TY.sort(key=lambda q:(q['src'].split()[2], q['src'].split()[-1].zfill(8)))

def Q(src,stem,choices,ans,basis,exps,**k):
  d=dict(src=src,stem=stem,choices=choices,ans=ans,basis=basis,exps=exps); d.update(k); return d
OFF=[
Q('강의록 Cause of seizure','발작(seizure)의 원인으로 강의록에 제시되지 않은 것은?',['장기 부전·약물 금단','전해질 불균형','수면 박탈','월경 주기','근력 운동'],5,'강의록 Cause of SEIZURE: organ failure, medication·withdrawal, cancer, 전해질, 고혈압성 뇌병증, 영양, 약물, 발열, 두부 외상, 고·저혈당, 월경 주기, 수면 박탈, 기생충, 스트레스, 급성 질환.',['원인.','원인.','원인.','원인.','정답.']),
Q('강의록 Cause of convulsion','경련(convulsion)의 원인으로 강의록에 제시된 것이 아닌 것은?',['Listeria monocytogenes 감염','비타민 B6(pyridoxine) 결핍','저혈당','paroxysmal kinesigenic dyskinesia','비타민 C 과다'],5,'강의록 Cause of CONVULSION: 뇌의 비정상 전기활동, 뇌전증, 감염(listeriosis, 수막염·뇌염), 외상, 감전, 스쿠버 공기, 셀리악병, 뇌졸중, 저산소, 유전·종양, 저혈당, B6 결핍, 열성경련, 비뇌전증 발작, PKD.',['원인.','원인.','원인.','원인.','정답.']),
Q('강의록 Candidates','강의록의 뇌전증 수술 후보 기준으로 옳은 것은?',['적절한 용량의 ASM 2가지 이상에도 발작이 지속되고 삶의 질이 떨어질 때','ASM 1가지 실패','첫 발작','MRI 정상인 모든 환자','발작이 1년에 1회'],1,CAND,['정답.','부족.','아니다.','아니다.','아니다.']),
Q('강의록 Candidates','강의록에 제시된 뇌전증 수술 의뢰의 현실로 옳은 것은?',['약물 난치 환자 중 1% 미만만 의뢰되고 발병부터 평균 20년 넘게 지나 의뢰된다','대부분 1년 안에 의뢰된다','50% 이상 의뢰된다','의뢰가 너무 빨라 문제다','소아는 의뢰되지 않는다'],1,CAND,['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Preoperative evaluation','강의록의 수술 전 neuroimaging에 포함되지 않는 것은?',['MRI','PET','SPECT','fMRI','Myelography'],5,PRE,['해당.','해당.','해당.','해당.','정답.']),
Q('강의록 Preoperative evaluation','Semi-invasive EEG에 해당하는 것을 고르면?',['Sphenoidal electrode','Subdural grid','Subdural strip','Depth electrode','Stereo-EEG'],1,PRE,['정답.','invasive.','invasive.','invasive.','invasive.']),
Q('강의록 Preoperative evaluation','Invasive EEG를 시행하는 경우로 강의록에 제시된 것은?',['국소화가 불분명하거나 기능 영역이 영향을 받을 수 있을 때','모든 첫 발작','MRI·뇌파가 완전히 일치할 때만','결신 발작','열성 경련'],1,PRE,['정답.','아니다.','오히려 불일치·불분명할 때.','아니다.','아니다.']),
Q('강의록 To make sure that it is safe','수술의 안전성 확인 검사로 강의록에 제시된 것이 아닌 것은?',['Wada test(언어·기억)','신경심리검사(IQ, 기억, 주의)','성격 평가','정신과적 평가','근전도검사'],5,'강의록 To make sure that it is safe: Wada test, neuropsychological testing(IQ, memory, attention, personality), psychological evaluation, ophthalmologic evaluation.',['해당.','해당.','해당.','해당.','정답.']),
Q('강의록 Temporal lobectomy','내측 측두엽 뇌전증(해마 경화)의 전형적 전기·임상 증후군은?',['상복부에서 올라오는 aura → 입·손 자동증 → 반대측 손 dystonic posturing','시각 섬광 aura','펜싱 자세','과운동 발작','웃음 발작'],1,'강의록 Temporal lobectomy.',['정답.','후두엽.','SMA.','전두엽.','시상하부 과오종.']),
Q('강의록 Temporal lobectomy','Standard temporal lobectomy에서 측두각(inferior horn)으로 들어가는 중요한 지표는?',['Collateral sulcus — 시방사 손상을 피하려고 측두각의 아래-바깥쪽으로 진입','Sylvian fissure','Central sulcus','Calcarine sulcus','Cingulate sulcus'],1,'강의록 Temporal lobectomy: collateral sulcus; 내측 구조(해마, 구, 편도, 해마곁이랑, 치아이랑) 제거.',['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Temporal lobectomy','Temporal lobectomy에서 제거하는 내측 구조가 아닌 것은?',['해마','구(uncus)','편도','해마곁이랑','시상'],5,'강의록 Temporal lobectomy.',['제거.','제거.','제거.','제거.','정답.']),
Q('강의록 Temporal lobectomy','Temporal lobectomy 후 편마비의 원인 혈관으로 강의록에 제시된 것은?',['Anterior choroidal artery','Anterior cerebral artery','Posterior inferior cerebellar artery','Basilar artery','Ophthalmic artery'],1,TLE,['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Temporal lobectomy','비우세 반구 temporal lobectomy의 후방 절제 한계로 강의록에 제시된 것은?',['Vein of Labbé(측두극에서 약 4.5–6 cm)','STG 3–4.5 cm','후두엽 끝','중심고랑','시상'],1,TLE,['정답.','우세 반구.','아니다.','아니다.','아니다.']),
Q('강의록 Topectomy','측두엽 외 뇌전증의 엽별 분포로 가장 흔한 것은?',['전두엽(60–80%)','두정엽','후두엽','다엽','섬엽'],1,'강의록 Topectomy: frontal 60–80%, parietal 4–20%, occipital 3–20%, multilobar 0–46%.',['정답.','4–20%.','3–20%.','0–46%.','아니다.']),
Q('강의록 Topectomy','엽별 뇌전증의 증후학 연결로 옳지 않은 것은?',['전두엽 — 국소 강직·간대, 과운동','전두엽(SSMA) — 팔 외전 강직(fencer posturing)','두정엽 — 체감각 aura, 통증, 이상감각','후두엽 — 빛·점·단순 도형의 시각 aura','후두엽 — 형태를 갖춘 시각 환각'],5,'강의록 Topectomy: 형태를 갖춘(formed) 시각 환각은 측두엽.',['옳다.','옳다.','옳다.','옳다.','틀리다(정답) — 측두엽.']),
Q('강의록 Lesionectomy','Lesionectomy의 대상 병변으로 강의록에 제시되지 않은 것은?',['DNET','Ganglioglioma','AVM','Cavernous malformation','다발성 경화증 판'],5,'강의록 Lesionectomy: 뇌종양(DNET, ganglioglioma, oligodendroglioma, low grade glioma), AVM, cavernous malformation; dual pathology(해마 경화) 고려.',['대상.','대상.','대상.','대상.','정답.']),
Q('강의록 Disconnection','Multiple subpial transection의 대상 부위로 강의록에 제시된 것은?',['언어·운동·1차 감각 피질(eloquent cortex)','해마','소뇌','시상','뇌량'],1,MST,['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Disconnection','Hemispherectomy의 금기로 강의록에 제시된 것은?',['건강한 반구에서 시작하는 발작','Rasmussen 뇌염','Sturge-Weber 증후군','다엽 피질이형성','다소뇌회증'],1,CALLO,['정답.','적응증.','적응증.','적응증.','적응증.']),
Q('강의록 Ablation','Ablation 치료에 해당하는 것은?',['Laser interstitial thermal therapy(LiTT)','Corpus callosotomy','VNS','Topectomy','MST'],1,KIND,['정답.','단절.','자극.','절제.','단절.']),
Q('강의록 Stimulation management','VNS의 발작 감소 중앙값으로 강의록에 제시된 것은?',['3개월 46%, 1년 57%, 2년 63%','3개월 90%','1년 10%','2년 100%','효과 없음'],1,VNS,['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Stimulation management','VNS의 적응증으로 옳은 것은?',['2가지 이상 ASM 실패이면서 절제술 후보가 아닐 때','첫 발작','약으로 잘 조절될 때','측두엽 경화증으로 절제 가능할 때','결신 발작 소아 전부'],1,VNS,['정답.','아니다.','아니다.','절제 우선.','아니다.']),
Q('강의록 Radiosurgery','Radiosurgery의 적응증이 아닌 것은?',['혈관 기형 동반 뇌전증','시상하부 과오종','MTLE(내측 측두엽 경화증)','남은 뇌전증 유발 영역','Drop attack'],5,RS,['적응증.','적응증.','적응증.','적응증.','정답.']),
Q('강의록 Pathology','측두엽 외 뇌전증의 병리로 강의록에 제시되지 않은 것은?',['피질 이형성(neuronal migration disorder)','두부 외상','뇌종양','Rasmussen 뇌염','해마 경화'],5,'강의록 Pathology: TLE — hippocampal sclerosis, amygdalar enlargement, CD; extratemporal — CD, 외상, 종양, AVM, CM, 뇌염 후, Rasmussen.',['해당.','해당.','해당.','해당.','정답 — TLE.']),
Q('강의록 Type of surgical treatment','Resection에 해당하지 않는 것은?',['Temporal lobectomy','Selective amygdalohippocampectomy','Topectomy','Lesionectomy','Functional hemispherectomy'],5,KIND,['해당.','해당.','해당.','해당.','정답 — disconnection.']),
Q('강의록 Type of surgical treatment','Disconnection에 해당하는 것은?',['Corpus callosotomy','Lesionectomy','LiTT','DBS','Radiosurgery'],1,KIND,['정답.','resection.','ablation.','neuromodulation.','radiosurgery.']),
Q('강의록 Neuroimaging','뇌전증 증례(39세 남자, 20년간 월 2–4회 정신운동 발작)의 수술 전 검사에서 fMRI로 확인하려는 것은?',['중심고랑 등 기능 영역(운동·언어)의 위치','포도당 대사','혈류만','NAA','백질 섬유'],1,'강의록 증례 슬라이드(central sulcus, PET, fMRI) · STT 22:53: fMRI로 언어 우세를 찾으려는 연구.',['정답.','PET.','SPECT.','MRS.','DTI.']),
Q('강의록 QUIZ 1','Stereotactic 방식의 핵심으로 강의록 QUIZ 해설에 제시된 것은?',['프레임(또는 내비게이션)으로 3차원 좌표를 정해 표적에 접근','피질 표면에 판을 얹는다','두피에 붙인다','관골궁 아래로 넣는다','혈관 안으로 넣는다'],1,'강의록 QUIZ 1 · STT 33:00–33:55.',['정답.','grid.','scalp.','sphenoidal.','아니다.']),
Q('강의록 Candidates','강의록의 국내 뇌전증 수술 센터로 비수도권에 제시된 곳은?',['전북대, 대구 계명대','부산대만','제주대','강원대','없다'],1,CAND+' STT 11:57: 지금은 사실상 빅5 위주로 한다.',['정답.','아니다.','아니다.','아니다.','아니다.']),
Q('강의록 Temporal lobectomy','Interictal PET에서 측두엽 뇌전증의 소견은?',['측두엽 저대사','측두엽 과대사','후두엽 과대사','소뇌 저대사','정상'],1,'강의록 Temporal lobectomy Images: interictal PET — temporal hypometabolism; MRI — 해마 위축, FLAIR·T2 신호 증가.',['정답.','ictal.','아니다.','아니다.','아니다.']),
Q('강의록 Lesionectomy','Lesionectomy를 계획할 때 함께 고려하는 것으로 강의록에 제시되지 않은 것은?',['Dual pathology(해마 경화)','발작 임상 양상','발작 중·발작 사이 두피 뇌파','신경영상','혈중 ASM 농도만'],5,'강의록 Lesionectomy.',['고려.','고려.','고려.','고려.','정답.']),
]
