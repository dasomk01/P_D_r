# Cards where the graded answer (ANS) looks wrong or ambiguous per lecture notes / class:
# - y-vor-2016 : ANS ③, but ④ is also a false statement (1교시 추가 강의록 p.6: ASCC -> 'ageotropic, downbeating, extorsional', not upbeating). Two wrong choices: ③,④ (③ is the best single answer).
# - y-vor-2017 : ANS ④, but ③ is also false (muscles reversed: lateral canal = ipsi MR + contra LR). Two wrong choices: ③,④. Same ③ text was the ANSWER in 2016.
# - y-vor-2018 : ANS ②, but ② as written ("좌측 문제 -> 좌측으로 slow") is TRUE per class -> no false choice as reconstructed.
#                ② is only "false" if the original read "좌측으로 머리를 돌릴 때와 같은 slow" (the 2019-2021 wording).
# - y-vor-2022 : ANS ⑤, but ② ("좌측 마비 -> 우측으로 머리를 돌릴 때와 같은 slow") is also TRUE -> ②,⑤ both correct.
# - y-scc-2017 : ANS ③ (pair concept) is intended, but by push-pull (3장 p.6) the partner canal is inhibited, so ③ and ④ share the same flaw -> ambiguous; keep ③.
A = {
'y-vor-2016': """
• 핵심 짝(📖 1교시 추가 강의록 p.6): "LSCC: ipsilateral MR & contralat LR", "PSCC: ipsilateral SO & contralat IR – geotropic, extorsional, upbeating", "ASCC: ipsilateral SR & contralat IO – ageotropic, downbeating, extorsional". 🎙 이은정 교수님 11/4 설명도 동일.
• ③ 틀림(정답): 근육이 뒤바뀜. 동측 "내"직근·반대측 "외"직근이 맞아요.
• ④도 틀린 문장이에요 ⚠: 근육 짝(SR+IO)은 맞지만 강의록에 "ASCC… downbeating"(📖 1교시 추가 강의록 p.6)이라고 써 있어요. "upbeating"은 후반규관 얘기예요.
• ①⑤ 맞음: 📖 3장 p.39 "머리 움직임과 반대방향으로 동일한 속도의 안구 움직임", 🎙 11/4 "인체에서 가장 빠른 리플렉스".
• 결론: 이 카드는 ③·④ 둘 다 틀린 선지라 복수정답 소지. 교수님이 "안테리어는 BPPV에서 흔치 않아 레터럴·포스테리어만 잘 알면 된다"(🎙 11/4)고 하셨으니 하나 고르면 ③.""",

'y-vor-2017': """
• 이 카드는 틀린 선지가 2개예요 ⚠.
• ④ 틀림(정답): 📖 1교시 추가 강의록 p.6 "PSCC: ipsilateral SO & contralat IR – geotropic, extorsional, upbeating". "intorsional downbeating"은 정반대예요(downbeating은 ASCC). 📖 16장 p.30, 🎙 이은정 교수님 11/4도 동일.
• ③도 틀림: 📖 1교시 추가 강의록 p.6 "LSCC: ipsilateral MR & contralat LR" → 동측 "내"직근 + 반대측 "외"직근이에요. 여기선 반대로 써 있음. 2016 객18에선 똑같은 ③ 문장이 정답(틀린 것)으로 채점됐는데 2017에선 맞는 보기로 처리 → 연도마다 채점이 엇갈린 문장이에요.
• ② 논란: 좌측 마비라도 좌측 회전 시 우측 반규관 억제로 약하게나마 반대방향 slow가 생겨 맞는 보기로 처리(학습지 해설).
• ①⑤ 맞음(📖 3장 p.39 "머리 움직임과 반대방향으로 동일한 속도").
• 시험에선 근육 짝 + up/down 방향을 같이 외우면 둘 다 걸러져요.""",

'y-vor-2018': """
• 네, 맞게 봤어요 ⚠. 써 있는 그대로면 ②는 "맞는" 문장이에요.
• 📖 1교시 추가 강의록 p.7: "Excitation of SCC → Eye deviation (slow) to opposite side, Nystagmus (fast) to same side" + 한쪽 귀 "Damaged" 그림. 🎙 이은정 교수님 11/4: 왼쪽이 망가지면 "오른쪽으로 회전을 하고 있는 것처럼… 안진이 오른쪽으로 친다". 즉 우측이 흥분한 셈 → slow는 좌측, fast는 우측 → "좌측으로 slow movement"는 사실이에요. 앱 해설도 "slow는 좌측으로 간다"고 써 놓고 틀렸다고 해서 모순이에요.
• ③ 맞음(📖 1교시 추가 강의록 p.6 "LSCC: ipsilateral MR & contralat LR"), ④ 맞음(📖 같은 강의록 p.8 "빠른 쪽 방향을 임상에서 안진의 방향으로 함"), ①⑤ 맞음(📖 3장 p.39).
• 그래서 복원된 문장 그대로면 틀린 선지가 없어요. 학습지도 "보기가 100% 정확하진 않음"이라고 적혀 있어요. 원문은 아마 2019–2021처럼 "좌측으로 머리를 돌릴 때와 같은 slow"(이건 틀림)였을 거예요.
• 외울 것: 좌측 마비 = 우측으로 머리 돌릴 때와 같은 반응 = slow 좌측·fast 우측.""",

'y-vor-2021': """
• 이 카드 채점(②가 틀린 것)은 맞아요. 다만 비슷해 보이는 연도별 ②가 서로 달라서 헷갈리는 거예요.
• 기준: 📖 1교시 추가 강의록 p.7 "흥분한 반규관 → slow는 반대쪽, fast는 같은 쪽"(한쪽 Damaged 그림). 🎙 이은정 교수님 11/4: 왼쪽이 망가지면 "오른쪽으로 회전을 하고 있는 것처럼" → 우측으로 머리 돌릴 때와 같음 → slow 좌측, fast 우측.
• 2021 ② "좌측 마비 → 좌측으로 머리 돌릴 때와 같은 slow" → 틀림(정답). 돌리는 방향이 반대예요.
• 2018 ② "좌측 문제 → 좌측으로 slow" → 사실은 맞는 문장(눈의 slow 방향 얘기라서).
• 2022 ② "좌측 마비 → 우측으로 머리 돌릴 때와 같은 slow" → 맞는 문장 ⚠. 그래서 2022는 ②⑤ 복수정답이에요. 이걸 말한 거라면 네 말이 맞아요.
• "좌측"이 머리 회전 방향인지 눈 slow 방향인지가 핵심이에요. ③은 맞는 보기(📖 1교시 추가 강의록 p.6 "LSCC: ipsilateral MR & contralat LR", p.7 slow는 반대쪽).""",

'y-vor-2022': """
• ③은 틀린 게 맞아요. 근육 짝은 맞는데 마지막 "동측으로 slow"가 틀렸어요.
• 우측 외반규관 흥분 → 우측 내직근(오른눈을 코쪽 = 왼쪽으로) + 좌측 외직근(왼눈을 바깥 = 왼쪽으로) → 두 눈 slow가 왼쪽 = "반대측". 📖 1교시 추가 강의록 p.7 "Eye deviation (slow eye movement) to opposite side", p.6 "LSCC: ipsilateral MR & contralat LR". 🎙 이은정 교수님 11/4도 동일.
• 그런데 네 논리("좌측 VN이면 우측이 흥분 = 고개를 우측으로 돌린 것과 같다")는 정확히 ②를 증명해요. ② "좌측 마비 → 우측으로 머리를 돌릴 때와 같은 slow"는 맞는 문장이에요(🎙 11/4 "왼쪽이 망가지면 오른쪽으로 회전을 하고 있는 것처럼").
• ⚠ 그래서 이 카드는 ②⑤ 둘 다 맞는 보기 → 복수정답. 앱 해설의 "②는 틀림"은 자기 설명("우측으로 돌릴 때와 같은 반응")과도 모순이에요.
• ① 반대방향이 맞음(📖 3장 p.39), ④ 빠른 방향이 기준(📖 1교시 추가 강의록 p.8 "빠른 쪽 방향을 임상에서 안진의 방향으로 함"), ⑤ 맞음.""",

'y-vordraw-2016': """
• 이 표는 강의록에 그대로 있어요(📖 1교시 추가 강의록 p.6): "LSCC: ipsilateral MR & contralat LR – geotropic, horizontal" / "PSCC: ipsilateral SO & contralat IR – geotropic, extorsional, upbeating" / "ASCC: ipsilateral SR & contralat IO – ageotropic, downbeating, extorsional".
• 정답 칸: 우측 후반고리관 – 우측(상사근) – 좌측(하직근) – 안진(geotropic·extorsional·upbeating). 우측 가쪽반고리관 – 우측(내직근) – 좌측(외직근) – 안진(geotropic·horizontal).
• geo/ageo 뜻: 안진 fast가 바닥쪽이면 geotropic, 하늘쪽이면 ageotropic(🎙 이은정 교수님 11/4 "지오트로픽은 바닥을 향한다"). 위 표에서 ageo는 ASCC 하나뿐이라 "ASCC만 ageo·downbeat"로 외우면 끝.
• 외우는 법: 짝 두 근육은 두 눈을 "같은 방향"으로 움직여요. 수직관은 동측=상(S), 반대측=하(I), 직/사가 엇갈림 → 후: 상"사"·하"직"(눈 아래로 → upbeat), 전: 상"직"·하"사"(눈 위로 → downbeat).
• 학습지 풀이는 안진 칸 두 개를 서로 바꿔 적어 놨으니 그대로 외우지 마세요.""",

'y-vntx-2022': """
• 한 줄 요약: 우측 전정신경염(귀 감기)이에요. 치료는 대증요법 후 빨리 전정재활 → ③.
• 1) 이틀째 하루 종일 빙빙 돎 + 청력 정상(난청·이명·충만감 없음, SRT·어음 100%) → 귀(달팽이)는 멀쩡, 균형신경만 문제 = 전정신경염(📖 16장 p.24 "난청이 동반되지 않은 급성 편측성 말초전정계 질환", "지속적인 현훈이 한 차례").
• 2) 어느 쪽? 자발안진이 좌측으로 침 → 안진은 병변 "반대측"으로 침 → 병은 우측(📖 16장 p.24 "병변의 반대측으로 안진이 나타남"). 그림의 좌측 귀 온도검사는 정상으로 반응하니까 약한 쪽은 우측이에요.
• 3) 치료: 📖 16장 p.27 "급성기: 전정계 억제제, 오심 억제제… 급성기가 지난 후: 전정재활이 주된 치료". 🎙 여차동 교수님 11/4 "기감기… 증상 치료, 전정 재활 운동 시키면 잘 좋아진다".
• 오답: ①④ 생활습관·이뇨제 = 메니에르, ② 바베큐 = 외반규관 BPPV, ⑤ 스테로이드 = "효과는 입증되지 않음"(📖 16장 p.27, 🎙 여차동 11/4 동일).""",

'y-bppvloc-2017': """
• 여기서 "위쪽"은 상반규관 얘기가 아니에요. 안진의 빠른 성분이 위로 친다(upbeating)는 뜻이에요.
• upbeat가 중요한 이유: 수직관 구분이에요. 후반규관 = 동측 상사근+반대측 하직근 → 눈을 아래로 끌다 위로 튐 → upbeating. 상반규관이면 반대로 downbeating이라 "위쪽"이면 상반규관이 아니라 후반규관이라는 단서예요(📖 1교시 추가 강의록 p.6 "PSCC… upbeating", "ASCC… downbeating", 🎙 이은정 교수님 11/4 "포스테리어 캐널일 때는 토저널하게 업비팅").
• 회전 방향: 우측 Dix-Hallpike에서 회전성 = 우측 후반규관(📖 16장 p.30 "검사자 위치에서 볼 때 급속상이 병변 쪽… 아래 눈 방향으로 향지성·회전성"). "반시계=우측"은 일반 지식이에요(강의록에 문장 없음).
• 📖 16장 p.32: 같은 자세에서 "눈 위쪽을 주시하면 위쪽 안진, 아래쪽 주시하면 회전성". 지문의 "왼쪽으로 돌렸을 때 위쪽"은 복원하면서 이 시선 얘기가 섞인 걸로 보여요.
• 교수님: 상반규관 BPPV는 "아주 드물다"(🎙 11/4) → 답 ①.""",

'y-dizzy-2018': """
• 올해 수업 위치예요.
• BPPV: 🎙 여차동 교수님 11/5 수업 앞부분("체위 변경 시 수 초 이내 회전성 어지럼", "레터럴은 바베큐, 포스테리어는 에플리"). Dix-Hallpike는 🎙 이은정 교수님 11/4 1교시에도 나옴. 📖 16장 p.29–30, p.38.
• 전정신경염: 🎙 여차동 교수님 11/4 6교시 끝부분(45분~, "기감기", "병변 반대측으로 자발안진"). 📖 16장 p.24–27.
• 가 맞음(📖 16장 p.29 "1분 이내로 짧게 지속"), 다 맞음(📖 16장 p.30 "병변 쪽에서 Hallpike 자세").
• 라 틀림: Epley는 후반규관(📖 16장 p.38 "후반규관의 관내를 따라…"), 외반규관은 바베큐(🎙 11/5).
• 마 틀림: 전정신경염은 "지속적인 현훈이 한 차례"(📖 16장 p.24) → 재발이 특징 아님.
• 나 틀림: 회복기엔 환측으로 바뀐다는 내용은 학습지 해설에만 있어요(강의록·수업엔 없음). → 답 ④(가·다).""",

'y-scc-2017': """
• 핵심: 우측 후반규관과 좌측 상반규관은 같은 평면의 짝이에요 → ③.
• ③ 근거: 📖 3장 p.6 "우측 후반규관과 좌측 상반규관은 서로 거의 동일 평면", "같은 평면상에 위치하는 양측 반규관은 항상 동시에 자극을 받게 됨".
• ⚠ 그런데 같은 쪽에 "한쪽 반규관이 자극을 받으면 쌍을 이루는 반대쪽 반규관은 억제(push-pull)"라고도 써 있고, 교수님도 "한쪽은 흥분하고 한쪽은 inhibition"(🎙 이은정 교수님 11/4)이라고 하셨어요. 그래서 엄밀히는 ③도 ④와 같은 이유로 애매해요. 출제 의도(짝 개념)대로 ③.
• ① 틀림: 수평반규관은 "앞쪽이 30° 상방"(📖 3장 p.6)이라 완전 수평 아님. ② 틀림: 30°는 수평반규관 얘기, 수직관은 서로 90°.
• ④ 틀림: 짝은 반대로 억제. ⑤ 틀림: "수평반규관은 직접 전정으로, 상·후반규관만 공통각"(📖 3장 p.12).""",
}
