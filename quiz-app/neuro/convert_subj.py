import re,sys,html
D='/home/user/P_D_r/quiz-app/neuro'
sys.path.insert(0,D)
from fixlib import parse,build
exec(open(D+'/subj_mc.py').read())
s=open(D+'/work.html',encoding='utf-8').read()
PAT=[3,1,4,2,5,2,4,1,5,3]; n=0
def sub(m):
  global n
  head,cid,body=m.group(1),m.group(2),m.group(3)
  if cid not in S or 'class="entry"' not in body: return m.group(0)
  sp=S[cid]; f=parse(body)
  fb=html.unescape(re.search(r'<div class="feedback"><div>(.*?)</div>',body,re.S).group(1))
  given=re.search(r'제공 정답: ([^\n]*)',fb); given=given.group(1).strip() if given else ''
  basis=re.sub(r'^\s*제공 정답:[^\n]*\n*','',fb).strip()
  ch=[sp['c']]+[d[0] for d in sp['ds']]; ex=['정답. '+sp['ce']]+['오답. '+d[1] for d in sp['ds']]
  t=PAT[n%10]; r=(1-t)%5
  ch=ch[r:]+ch[:r]; ex=ex[r:]+ex[:r]; assert ch[t-1]==sp['c']
  note='원래 주관식 문항 → 객관식으로 전환'+(f' · {sp["note"]}' if sp['note'] else '')+(f' · 원 제공 정답: {given}' if given else '')
  f.update(subj=False,choices=ch,exps=ex,ans=[t],basis=basis,caveat=note,stem=f['stem']+'\n[객관식 전환] 가장 옳은 것을 고르시오.')
  f['meta']=f['meta']+' · 🔁주관식→객관식'
  out=build(cid,f).replace('<div class="scope">⚠ 원래 주관식','<div class="scope subj2mc">🔁 원래 주관식',1)
  n+=1
  return head+out+'</article>'
s=re.sub(r'(<article class="qcard[^"]*"[^>]*id="([^"]+)">)(.*?)</article>',sub,s,flags=re.S)
open(D+'/work.html','w',encoding='utf-8').write(s)
print('converted',n,'remaining entry',s.count('class="entry"'))
