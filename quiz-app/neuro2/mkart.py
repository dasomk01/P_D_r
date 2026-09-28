import re,json
D='/home/user/P_D_r/quiz-app/neuro2'
s=open(D+'/final.html',encoding='utf-8').read()
s=re.sub(r'^<!DOCTYPE html>\s*<html[^>]*><head><meta charset="utf-8"/><meta [^>]*name="viewport"/>','',s)
s=s.replace('</head><body>','',1).replace('</body></html>','')
s=s.replace('.tabs{position:sticky;top:0;','.tabs{position:sticky;top:env(safe-area-inset-top,0px);',1)
arts=re.findall(r'<article class="qcard[^"]*"[^>]*id="topic-\d+-area-(\w+)-q-\d+">(.*?)</article>',s,re.S)
cnt={a:0 for a in ['yama','variants','ty','off']}
for a,b in arts:
  if a=='yama' and '[수업범위 외]' in b: continue
  cnt[a]+=1
nt=len(json.load(open(D+'/topics.json')))
s=re.sub(r'<div class="audit">STEP 9 최종검수:.*?</div>',f'<div class="audit">범위내 야마 {cnt["yama"]} · 야마 변형 {cnt["variants"]} · 티야 {cnt["ty"]} · 탈야 {cnt["off"]} · 주제 {nt}개</div><div class="audit">2번 앱 · 9/28 2교시부터(9/15~9/28 1교시는 1번 앱) · 중복 야마 병합(👑 킹야 = 2회, 👑👑 킹킹야 = 3회 이상 출제) · 야마는 학습지 원문·제공 정답 그대로, 영상은 학습지·강의록에서 잘라 넣음 · 티야는 STT 강조, 탈야는 강의록 기준 · 복습 표시는 이 브라우저에 저장돼요(1번 앱과 따로 저장)</div>',s,1,flags=re.S)
assert s.startswith('<title>'),s[:80]
open(D+'/neuro2-app.html','w',encoding='utf-8').write(s)
print(len(s)/1e6)
