"""황승배 외상성 뇌손상 영상 Quiz(34쪽) 정답 정정: 5(SDH+DAI) → 4(SAH+DAI). 교수님 형성평가 정답 기준."""
import re,os,sys
D=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,D)
from fixlib import apply
s=open(D+'/work.html',encoding='utf-8').read()
cid='topic-026-area-yama-q-001'
card=re.search(r'id="'+cid+r'">(.*?)</article>',s,re.S).group(1)
vis=re.search(r'<div class="visual yimg">.*?</div><!--/yimg-->',card,re.S).group(0)
spec={'q-001':dict(ans=[4],visual=vis,
 basis='[황승배 교수님 형성평가 정답: 4번] 왼쪽 CT에서 Sylvian fissure·뇌구를 따라 선 모양 고음영(외상성 SAH, 피질 안쪽으로 선형), 오른쪽 CT에서 전두엽 회백질-백질 경계의 작은 점상 출혈(DAI). 뚜렷한 초승달 모양 extra-axial 혈종(SDH)이나 렌즈 모양 EDH는 없다. 강의록 슬라이드에 표시돼 있던 5번 형광펜은 정답이 아니었다(정답은 QR form 제출). 외상성 SAH는 비외상성처럼 basal cistern 별 모양이 아니라 어디서나, 뇌구를 따라 선형으로 보인다. DAI는 회백질-백질 경계·뇌량·뇌간의 점상 출혈, CT에서 정상일 수 있어 GRE·SWI가 민감하다.',
 exps=['틀림. 렌즈 모양 EDH가 없다.','틀림. 초승달 SDH도, 좌상(고·저음영 혼재)도 아니다.','틀림. SAH는 맞지만 오른쪽 병변은 좌상이 아니라 회백질-백질 경계 점상 출혈(DAI).','정답. 외상성 SAH(뇌구 따라 선형) + DAI(점상 출혈).','틀림. 초승달 모양 SDH가 보이지 않는다(강의록 형광펜 표시는 오답).'])}
log=[]; s,n=apply(s,'topic-026',spec,log); assert n==1
def fixcard(cid,pairs):
  global s
  a=s.index(f'id="{cid}">'); b=s.index('</article>',a); c=s[a:b]
  for o,nw in pairs:
    assert o in c,(cid,o[:30]); c=c.replace(o,nw)
  s=s[:a]+c+s[b:]
fixcard('topic-026-area-variants-q-001',[('Subdural hemorrhage + Diffuse axonal injury','Subarachnoid hemorrhage + Diffuse axonal injury'),
 ('CT에서 경막하 공간을 따라 초승달 모양의 출혈이 보이고, 심부/백질 부위에','CT에서 뇌구를 따라 선 모양 지주막하 출혈이 보이고, 회백질-백질 경계에')])
fixcard('topic-026-area-variants-q-011',[('CT에서 경막하 공간을 따라 초승달 모양의 출혈이 보이고, 심부/백질 부위에','CT에서 뇌구를 따라 선 모양 지주막하 출혈이 보이고, 회백질-백질 경계에')])
open(D+'/work.html','w',encoding='utf-8').write(s); print('ok')
