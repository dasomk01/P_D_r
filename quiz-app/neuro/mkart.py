import re
D='/home/user/P_D_r/quiz-app/neuro'
s=open(D+'/final.html',encoding='utf-8').read()
s=re.sub(r'^<!DOCTYPE html>\s*<html[^>]*><head><meta charset="utf-8"/><meta [^>]*name="viewport"/>','',s)
s=s.replace('<title>신경학 9/15–9/23 문풀앱 최종</title>','<title>신경학 문풀앱</title>',1)
s=s.replace('</head><body>','',1).replace('</body></html>','')
s=s.replace('.tabs{position:sticky;top:0;','.tabs{position:sticky;top:env(safe-area-inset-top,0px);',1)
import json
arts=re.findall(r'<article class="qcard[^"]*"[^>]*id="topic-\d+-area-(\w+)-q-\d+">(.*?)</article>',s,re.S)
cnt={a:0 for a in ['yama','variants','ty','off']}
for a,b in arts:
  if a=='yama' and '[수업범위 외]' in b: continue
  cnt[a]+=1
done=json.load(open(D+'/off_done.json')) if __import__('os').path.exists(D+'/off_done.json') else []
s=re.sub(r'<div class="audit">STEP 9 최종검수:.*?</div>',f'<div class="audit">범위내 야마 {cnt["yama"]} · 야마 변형 {cnt["variants"]} · 티야 {cnt["ty"]} · 탈야 {cnt["off"]}</div><div class="audit">v6 · 중복 야마 병합(👑 킹야 = 2회, 👑👑 킹킹야 = 3회 이상 출제, 반복 연도 표시) · 논란 문항은 해설 맨 위에 🤖 AI 추정 답변 · 탈야는 강의록(수업자료) 기준으로 새로 쓰는 중: 완료 {len(done)}/26개 주제 · 복습 표시는 이 브라우저에 저장돼요</div>',s,1,flags=re.S)
assert s.startswith('<title>'),s[:80]
open(D+'/neuro-app.html','w',encoding='utf-8').write(s)
print(len(s)/1e6)
