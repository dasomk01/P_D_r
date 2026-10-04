"""오답 분석에서 찾은 앱 오류 수정(재실행 안전)."""
import re,os
D=os.path.dirname(os.path.abspath(__file__))
s=open(D+'/work.html',encoding='utf-8').read()
# 1) 2016 주30 지문 끝에 섞여 들어간 주기마비 해설 제거
s=re.sub(r' extremities\), acute onset, variable severity.*?발생했 음을 알 수 있습니다\.','',s,count=1,flags=re.S)
# 2) 2014 객33 선지 3 해설 보강 (강의록 기준 + 교과서 차이 명시)
old='hypothyroidism·pernicious anemia는 LEMS와 연관. MG는 hyperthyroidism.'
new=('강의록(오선영 슬라이드 68) 기준 hypothyroidism·pernicious anemia는 LEMS 슬라이드에 있고, MG 동반 자가면역질환으로는 hyperthyroidism 등(슬라이드 49)을 든다. '
     '※ 일반 교과서에서는 MG에도 자가면역 갑상선질환·악성빈혈이 동반될 수 있어 애매하지만, 시험은 강의록 기준으로 ⑤만 MG 설명이다.')
s=s.replace(old,new)
# 3) 학습지에 두 번 실린 2016 객15 중복 표시
NOTE={'topic-005':'🔁 같은 문제가 「신경전도검사·근전도검사」 야마(학습지 314쪽)에도 실려 있어요 — 학습지 중복 수록 문항',
      'topic-024':'🔁 같은 문제가 「신경근연접부 질환」 야마(학습지 121쪽)에도 실려 있어요 — 학습지 중복 수록 문항'}
s=re.sub(r'<div class="scope dupnote">[^<]*</div>','',s)
def add(m):
  t=m.group(1); return m.group(0)+f'<div class="scope dupnote">{NOTE[t]}</div>'
s=re.sub(r'id="(topic-005|topic-024)-area-(?:yama|variants)-q-\d+"><div class="qmeta">[^<]*2016 객15[^<]*</div>',add,s)
open(D+'/work.html','w',encoding='utf-8').write(s)
print('garbage',s.count('extremities), acute onset'),'exp',s.count('슬라이드 68) 기준'),'dup',s.count('dupnote'))
