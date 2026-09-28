import sys,importlib.util
sys.path.insert(0,'/home/user/P_D_r/quiz-app/neuro'); sys.path.insert(0,'/home/user/P_D_r/quiz-app/neuro/specs')
import fixlib
D='/home/user/P_D_r/quiz-app/neuro'
s=open(D+'/work.html',encoding='utf-8').read()
for t in sys.argv[1:]:
  spec=importlib.util.spec_from_file_location(t,f'{D}/specs/{t}.py'); t=t.split('b')[0] if t.endswith('b') else t; m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
  log=[]; s,n=fixlib.apply(s,t,m.SPECS,log)
  missing=set(m.SPECS)-{c.split('-area-yama-')[-1] for c in log}
  for after,sp in getattr(m,'INSERTS',[]): s=fixlib.insert_yama(s,t,after,sp); print(t,'inserted after',after)
  print(t,'applied',n,'missing',sorted(missing))
open(D+'/work.html','w',encoding='utf-8').write(s)
