# 야마(기출) · 「진단검사의학의 이해」 학습지 79–83쪽 (원문·정답 그대로, 학습지 순서)
# p.79 연도·교수 표(2020·2022·2023·2025 모두 조용곤) / p.80 2025 객57·객58, 2023 객1 / p.81 2023 객2, 2022 객41
# p.82 2020 객9·객10 / p.83 다음 단원(조동휴) 표지.  학습지 객관식 7문항 = 아래 튜플 7개.
S='lab'
JY='조용곤'
_HE='적혈구 용혈 시 LD가 270% 정도로 매우 크게 증가 → 농도 변화가 가장 큰 것은 LD. 수치상 LD가 가장 크고 그 다음 AST. glucose와 sodium은 농도가 감소(그중 glucose가 더 많이 감소). 근거: 조용곤 교수님 진단검사의학 총론 강의록 p.43 표 4-2. 킹야.'
_SP='민감도 = 진양성/(진양성+위음성), 특이도 = 진음성/(위양성+진음성) → 특이도가 90%라면 10%는 위양성(false positive). 강의록 퀴즈(Quiz 5, p.50)를 살짝 변형한 문제.'
_HECK='🔎 강의록·수업 점검: 정답 ⑤ LD 맞음 – 강의록 p.43 표 4-2 「용혈에 의한 혈청 내 성분들의 농도 변화」: 1% 적혈구 용혈 시 LD +272.0%, AST +220.0%, ALT +55.0%, K +24.4%, Ca +2.9%, Glucose −5.0%(적혈구/혈청 농도비 LD 160:1). 교수님 「용혈되면… RBC가 깨지게 되면… 용혈 여부에서 가장 크게 영향받습니다」(근거: 강의록 p.43 / STT 10/1 5교시 50:22)'
_SPCK='🔎 강의록·수업 점검: 정답 ② False positive 맞음 – 교수님은 Quiz 5 답을 「O」라 하면서 「이게 특이도 때문에 10%가 되는 건 아니고요… 양성 예측도… 1 마이너스 양성 예측도가 10%」라고 짚음. 즉 10%는 「양성으로 나온 사람 중 위양성(FP/(TP+FP))」이고, 이 표에서 우연히 FP/(FP+TN)도 10%. 어느 해석이든 보기 중 답은 False positive 하나뿐(근거: 강의록 p.50 / STT 10/1 5교시 54:56–57:31)'
Y=[
(S,'lab-hemo',2025,'객57','환자로부터 항응고제 처리 없이 채혈된 전혈을 원심분리하여 상청액을 관찰하여 보니 붉은색을 보였다. 이 환자의 혈청 내 농도변화가 가장 큰 성분은?',
 ['Aspartate aminotransferase','Alanine aminotransferase','Calcium','Glucose','Lactate dehydrogenase'],[5],_HE,
 [_HECK,'학습지 참고: 조용곤 교수님 진단검사의학 총론 강의록 p.43'],JY),
(S,'lab-spec',2025,'객58','X라는 병에 대한 검사의 특이도가 90%라라면 X병으로 결과가 나온 환자의 10%는 실제로는 X병에 의한 것이 아니다. 여기서 10%는 무엇을 가리키는가?',
 ['Coefficient of variation','False positive','Prevalence','Reference value','Standard deviation'],[2],_SP+' 기존 문제와 동일하게 출제.',
 [_SPCK,'학습지 참고: 조용곤 교수님 진단검사의학 총론 강의록 p.50'],JY),
(S,'lab-hemo',2023,'객1',None,None,None,'',['2023 객1 정답 ⑤(LD) – 2025 객57과 문제·선지 같음. 파라야마 느낌으로 glucose와 sodium은 농도가 감소한다는 것도 알아 두면 좋음(학습지 해설).'],JY),
(S,'lab-spec',2023,'객2',None,None,None,'',['2023 객2 정답 ②(False positive) – 2025 객58과 문제·선지 같음.'],JY),
(S,'lab-spec',2022,'객41',None,None,None,'',['2022 객41 정답 ②(False positive) – 학습지 해설: 예과 2학년 때부터 배워 온 내용, 강의록 퀴즈를 살짝 변형, 수업 중 Quiz 5는 위양성을 정의하는 것이라고 설명.'],JY),
(S,'lab-hemo',2020,'객9','1% 적혈구 용혈 시 혈청 내 농도변화가 가장 큰 성분은?',
 ['Aspartate aminotransferase','Alanine aminotransferase','Calcium','Glucose','Lactate dehydrogenase'],[5],'적혈구 용혈 시 LD가 270% 정도로 매우 크게 증가. 이 표에서 LD만 설명하셨음. 근거: 강의록 표 4-2 「용혈에 의한 혈청 내 성분들의 농도 변화」.',
 [_HECK,'학습지 원문 문제는 「9.1% 적혈구 용혈 시…」로 시작 – 앞의 「9.」는 문항 번호(객9)로 보고 「1% 적혈구 용혈」로 옮김(표 4-2 열 제목 「1% 적혈구 용혈 시 혈청 내 농도 변화(%)」와 일치).'],JY),
(S,'lab-cv',2020,'객10','검사의 정밀도를 나타내는 가장 좋은 지표는?',
 ['Coefficient of variation','Geometric mean','Prevalence','Reference value','Standard deviation'],[1],'CV는 standard deviation, 즉 표준편차를 평균값으로 나눈 후 100을 곱한 값. 교수님께서 수업 시간에 내신 퀴즈 중 「CV는 precision을 의미한다 (O/X)」가 있었음(강의 시간에 내신 퀴즈).',
 ['🔎 강의록·수업 점검: 정답 ① CV 맞음 – 강의록 p.48 Statistics 「Coefficient of Variation / Quiz 1. CV means Precision (True, False)」, 교수님 「CV의 정의는 standard deviation을 mean 값으로 나눈 거… SD가 커지면 CV가 커져요… 정밀도가 낮아진다. 그러니까 이 CV가 결국은 정밀도를 반영하죠」(근거: 강의록 p.48 / STT 10/1 5교시 52:01–52:51). ※ STT 52:01에 「CV는 precision을 나타낸다. 맞을까요? 틀리거든요」라는 말이 섞여 있으나 바로 뒤에서 CV가 정밀도를 반영한다고 정리 – 전사 잡음 또는 「CV가 클수록 정밀도는 낮다(불정밀도의 척도)」는 뜻으로 보임. SD도 정밀도 지표지만 평균으로 표준화한 CV가 「가장 좋은 지표」.'],JY),
]
