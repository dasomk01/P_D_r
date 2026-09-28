import { parseQuestionsText } from "/home/user/P_D_r/src/lib/questions/parse.ts";
const txt = `[Q]
카테고리: 야마그대로
형식: 주관식
범위밖: 아니오
문제: Primary motor cortex와 primary sensory cortex의 경계는?
정답: central sulcus
해설: 중심고랑.
[/Q]
[Q]
카테고리: 탈야대비
형식: 객관식
문제: 파킨슨병 병변 부위는?
1) basal ganglia
2) cerebellum
3) thalamus
4) pons
5) medulla
정답: 1
해설: x
[/Q]
[Q]
카테고리: 탈야대비
형식: 주관식
문제: _____에 들어갈 용어를 쓰시오
정답: 파킨슨병
[/Q]`;
console.log(JSON.stringify(parseQuestionsText(txt).map(q=>[q.category,q.format,q.choices.length,q.answerIndex,q.answerText])));
