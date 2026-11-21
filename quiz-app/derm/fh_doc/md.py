import sys,importlib,re,json
sys.path.insert(0,'/home/user/P_D_r/quiz-app/derm'); sys.path.insert(0,'/home/user/P_D_r/quiz-app/derm/fh_doc')
from data import T
Q={}
for m in ['qf0503','qf0504','qf0505','qf0602','qf0603','qf0604','qf0901','qf0902','qf1001','qf1002','qf1003','qf1004','qf1105','qf1204']:
  for t in importlib.import_module(m).Q: Q[t[1]]=t
C='①②③④⑤⑥⑦⑧'
def ans(t): a=t[4]; return a if isinstance(a,list) else [a]
def kind(stem): return '💜 종합 형성평가' if stem.startswith('💜') else '🤍 수업 끝 퀴즈'
out={}
for prof in ['박진','남경화','윤석권']:
  L=[]; top=None
  for i,(p,tp,k,ti,d,ex) in enumerate(T,1):
    if p!=prof: continue
    t=Q[k]
    if tp!=top: L.append('### '+tp); top=tp
    stem=re.sub(r'^(🤍|💜)형성평가(\(수업 퀴즈\))?\s*','',t[2])
    L.append('#### %d. %s'%(i,ti))
    L.append('%s · %s'%(kind(t[2]),d))
    L.append(stem)
    if not all(re.fullmatch(r'[①-⑧]\s*',c) for c in t[3]):
      L.append('\n'.join('- %s %s'%(C[j],c) for j,c in enumerate(t[3])))
    L.append(('**정답 %s** %s — %s'%(''.join(C[a-1] for a in ans(t)), ' · '.join(t[3][a-1].strip() for a in ans(t) if not re.fullmatch(r'[①-⑧]\s*',t[3][a-1])), ex)).replace('**  — ','** — '))
  out[prof]='## %s 교수님\n\n'%prof+'\n\n'.join(L)
rows=['| 번호 | 교수 | 정답 | 정답 내용 | 구분 |','| --- | --- | --- | --- | --- |']
for i,(p,tp,k,ti,d,ex) in enumerate(T,1):
  t=Q[k]; rows.append('| %d | %s | %s | %s | %s |'%(i,p,''.join(C[a-1] for a in ans(t)),(ti.split(' = ')[-1] if ' = ' in ti else ti.split(' → ')[-1]),'💜' if t[2].startswith('💜') else '🤍'))
out['ans']='## 정답표\n\n'+'\n'.join(rows)
json.dump(out,open('/home/user/P_D_r/quiz-app/derm/fh_doc/md.json','w'),ensure_ascii=False)
print(out['박진'][:1500]); print(out['ans'])
