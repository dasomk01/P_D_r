import sys,re,html,base64
src,out,imgdir=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src,encoding='utf-8').read()
E=html.escape
def img(name,alt):
  b=base64.b64encode(open(f'{imgdir}/{name}','rb').read()).decode()
  return f'<img src="data:image/jpeg;base64,{b}" alt="{E(alt)}" style="max-width:100%;height:auto;display:block;margin:8px auto;border-radius:6px"/>'
CASE_2324=("27세 남자가 난치성 뇌전증으로 뇌의 일부분을 절제하는 수술을 받은 후 기억장애가 발생하였다. 남자는 수술 이전에 있었던 과거의 일들은 모두 잘 기억하였다. "
 "방금 전에 보여준 단어를 바로 기억하는 것도 잘 수행하였다. 그러나 수술 이후에 경험한 일이나 새로 알게 된 정보는 잠깐 동안은 기억할 수 있었으나 곧 잊어버렸다. 이와 반대로 새로운 운동 기술은 잘 습득할 수 있었다.")
MEM_BASIS="강의록 memory 정리: Working – prefrontal cortex / Episodic – medial temporal lobe / Semantic – anterior·inferolateral temporal lobe / Procedural – supplementary motor area·basal ganglia·cerebellum."
FIX={
 'q-002':dict(meta='야마 · 2/19 · 야마 2025 객41 · 학습지 252쪽 원문대조 (질문 문장 복원 보완)',
  stem='각 인지기능을 담당하는 뇌 영역과 인지기능을 평가하는 Neuropsychological test를 정리한 표에 대한 문항이다. 아래 두 그림(위: 복잡한 도형 따라 그리기, 아래: 단어 목록 1~3차 시행 기록지)의 검사가 평가하는 인지기능을 순서대로 옳게 짝지은 것은?',
  visual=('원본 그림', img('q41_figs.jpg','Rey complex figure copy와 SVLT 기록지')),
  choices=['집중력, 시공간능력','집행기능, 기억력','집중력, 기억력','시공간능력, 기억력','언어능력, 시공간능력'],ans=[4],
  basis='그림은 Rey complex figure test(copy)와 Seoul Verbal Learning Test(immediate)이다(복원자 해설). 강의록 표에서 Rey copy는 시공간능력(두정-후두엽), SVLT는 기억력(내측 측두엽) 검사이다. 원 학습지에는 질문 문장이 누락되어 있어 복원자 해설 기준으로 질문을 보완했다.',
  extra=('강의록 표 (학습지 252쪽)', img('q41_table.jpg','인지기능-뇌영역-검사 표')),
  exps=['집중력은 Digit span test로 평가한다. 도형 따라 그리기(Rey copy)는 집중력 검사가 아니다.','집행기능은 Stroop·COWAT·Go No-go 등으로 평가한다. 첫 그림(Rey copy)과 맞지 않는다.','첫 그림을 집중력으로 본 오답. Rey copy는 시공간능력 검사이다.','Rey complex figure copy → 시공간능력, SVLT(immediate) → 기억력.','언어능력은 Boston naming test 등으로 평가하며, 순서도 맞지 않는다.']),
 'q-003':dict(meta='야마 · 3/19 · 야마 2023 객29 · 학습지 252쪽 원문대조',
  stem='다음 표에서 인지기능영역과 해당하는 뇌영역이 바르게 짝지어진 것은?',
  visual=('원본 표 (MRI에 표시된 뇌영역)', img('q29_mri.jpg','인지기능별 MRI 표시 부위')),
  choices=['집중력 – 양측 후두엽(뒤쪽) 표시','언어능력 – 좌측 반구 외측(전두·측두) 표시','시공간능력 – 양측 전두엽 앞쪽 표시','기억력 – 전두엽 앞쪽 + 뒤쪽(점선) 표시','전두엽/집행기능 – 양측 내측 측두엽 표시'],ans=[2],
  basis='강의록 표: 집중력 – 전전두엽 / 언어능력 – 우세반구(전두엽·측두엽) / 시공간능력 – 두정-후두엽 / 기억력 – 내측 측두엽 / 전두엽·집행기능 – 전전두엽. 좌측(우세) 반구 외측을 표시한 ②만 맞다.',
  exps=['집중력은 전전두엽 담당이다. 후두엽 표시는 맞지 않다.','언어능력은 우세반구(좌측) 전두·측두엽 담당이다. 좌측 반구 외측 표시와 일치한다.','시공간능력은 두정-후두엽 담당이다. 전두엽 앞쪽 표시는 맞지 않다.','기억력은 내측 측두엽 담당이다. 전두엽·후두부 표시는 맞지 않다.','집행기능은 전전두엽 담당이다. 양측 내측 측두엽은 기억력 영역이다.']),
 'q-006':dict(meta='야마 · 6/19 · 야마 2022 객24 · 학습지 253–254쪽 원문대조',
  stem='다음 그림의 글자 카드를 이용하여 쓰여있는 글자 읽기와 글자의 색깔읽기를 수행하는 검사와 가장 관련있는 뇌 영역을 고르시오.',
  visual=('원본 그림 (글자읽기 C / 색깔 읽기 CW)', img('q24_stroop.jpg','K-CWST 카드')),
  choices=['prefrontal region','parieto-occipital region','medial temporal region','inferiolateral temporal region','dominant frontal, temporal region'],ans=[1],
  basis='그림은 Korean-Color Word Stroop Test(K-CWST)이다. 글자를 읽으려는 반응을 억제하고 색깔만 읽어야 하는 전두엽(집행)기능 검사로, 담당 부위는 prefrontal region이다(복원자 김지수, 정답 ①). ※ 이전 버전에서 선배 코멘트가 선지로 들어가 있던 오류를 학습지 원문 선지로 교체함.',
  exps=['K-CWST는 frontal/executive function 검사이며, 담당 부위는 prefrontal region이다.','parieto-occipital region은 시공간능력(Rey copy, clock drawing)을 담당한다.','medial temporal region은 기억력(episodic memory)을 담당한다.','inferolateral temporal region은 semantic memory를 담당한다.','dominant frontal·temporal region은 언어능력을 담당한다.']),
 'q-007':dict(meta='야마 · 7/19 · 야마 2021 객11 · 학습지 254쪽 원문대조',
  stem='27세 남자가 난치성 뇌전증으로 뇌의 일부분을 절제하는 수술을 받은 후 기억장애가 발생하였다. 남자는 수술 이전에 있었던 과거의 일들은 모두 잘 기억하였다. (A) 방금 전에 보여준 단어를 바로 기억하는 것도 잘 수행하였다. 그러나 (B) 수술 이후에 경험한 일은 잠깐 동안은 기억할 수 있었으나 곧 잊어버렸다. 이와 반대로 (C) 새로운 운동 기술은 잘 습득할 수 있었다. 위 환자에서 각각 (A), (B), (C)에 해당하는 뇌의 영역으로 알맞은 것은?',
  choices=['(A) inferolateral temporal lobe · (B) medial temporal lobe · (C) hippocampus','(A) prefrontal cortex · (B) inferolateral temporal lobe · (C) hippocampus','(A) prefrontal cortex · (B) inferolateral temporal lobe · (C) supplementary motor area','(A) prefrontal cortex · (B) medial temporal lobe · (C) supplementary motor area','(A) basal ganglia · (B) prefrontal cortex · (C) medial temporal lobe'],ans=[4],
  basis='(A) 즉시 기억 = working memory → prefrontal cortex, (B) 새 경험 저장 = episodic memory → medial temporal lobe, (C) 운동기술 = procedural memory → supplementary motor area. '+MEM_BASIS,
  exps=['(A) working memory는 inferolateral temporal이 아니라 prefrontal이다.','(B) episodic memory는 inferolateral temporal이 아니라 medial temporal lobe이다.','(B)가 틀렸다. inferolateral temporal은 semantic memory 영역이다.','(A) prefrontal, (B) medial temporal, (C) SMA가 모두 맞다.','(A)~(C)가 모두 어긋난다.']),
 'q-009':dict(meta='야마 · 9/19 · 야마 2020 객94 · 학습지 255쪽 원문대조 (5번 선지 원문 복원실패)',
  stem='60세 남자가 옷을 잘 입지 못해서 왔다. 환자는 팔, 다리의 위약감은 없었으며, 손, 발을 사용하는데 전혀 문제가 없었으나, 20대부터 매일 아침에 직접 매던 넥타이를 어떻게 매야 할지 몰라서 당황하는 모습을 보였고, 옷을 뒤집어 입었으며, 단추를 잘 채우지 못하는 모습을 보였다. 다음 memory 종류 중 증례의 남자에서 손상된 것을 고르시오',
  choices=['working memory','episodic memory','semantic memory','procedure memory'],ans=[4],
  basis='익숙하게 하던 동작(넥타이 매기, 단추 채우기)을 잊는 것은 procedural memory 손상이다(복원자 이은아, 정답 ④). Procedural memory는 long-term memory 중 implicit memory이며 SMA·basal ganglia·cerebellum이 담당한다. 강의록 예: corticobasal syndrome – unable to tie shoelaces or button up a shirt. ※ 원문 5번 선지는 학습지에서도 복원실패로 남아 있어 4지선다로 제공한다.',
  exps=['working memory는 방금 본 단어·전화번호를 잠깐 유지하는 기억이다.','episodic memory는 과거 사건·경험의 기억이다.','semantic memory는 단어 뜻 같은 일반 지식이다.','운동기술(옷 입기, 넥타이 매기)의 기억 = procedural memory.']),
 'q-010':dict(meta='야마 · 10/19 · 야마 2019 객23 · 학습지 256쪽 원문대조',
  stem='[23-24번 증례]\n'+CASE_2324+'\n\n다음 memory 종류 중 증례의 남자에서 손상된 것을 고르시오.',
  choices=['Working memory','Episodic memory','Semantic memory','Procedure memory','Implicit memory'],ans=[2],
  basis='수술 이후의 경험·새 정보를 곧 잊는 것 = episodic memory 손상(medial temporal lobe). 즉시 기억(working)과 운동기술(procedural)은 보존되어 있다. 학습지 정답표는 번호가 "객34"로 표기되어 있으나 해당 문항 바로 아래의 정답표이고 내용(episodic)도 일치하여 정답 ②로 복원했다. 복원자 메모: 18년 야마는 "두 가지"(episodic, semantic)였으나 이번엔 "두 가지"가 빠져 episodic으로 본다. ※ 이전 버전의 증례 누락과 잘못된 정답(①)을 수정함.',
  exps=['방금 본 단어의 즉시 기억은 잘 수행했으므로 working memory는 보존되어 있다.','수술 후 경험·새 정보를 곧 잊는다 → episodic memory 손상.','과거 지식은 보존되어 있다. 18년 "두 가지 고르시오" 버전에서는 semantic도 정답이었다.','새 운동기술을 잘 습득했으므로 procedural memory는 보존되어 있다.','implicit memory(procedure·emotional 등)는 보존되어 있다.']),
 'q-011':dict(meta='야마 · 11/19 · 야마 2019 객24 · 학습지 256–257쪽 원문대조',
  stem='[23-24번 증례]\n'+CASE_2324+'\n\n다음 뇌영역 중 증례의 남자에서 손상된 부분을 고르시오.',
  choices=['소뇌','기저핵','측두엽','전전두엽','보조운동영역'],ans=[3],
  basis='손상된 memory는 episodic memory이며 medial temporal lobe(측두엽)가 담당한다(복원자 전민혁, 정답 ③). '+MEM_BASIS,
  exps=['소뇌는 procedural memory 영역이다. 운동기술 습득은 보존되어 있다.','기저핵은 procedural memory 영역이다.','episodic memory → medial temporal lobe(측두엽).','전전두엽은 working memory 영역이다. 즉시 기억은 보존되어 있다.','SMA는 procedural memory 영역이다.']),
 'q-012':dict(meta='야마 · 12/19 · 야마 2018 객13 · 학습지 257쪽 원문대조 · 복수정답(2개)',
  stem='[13-14번 증례]\n'+CASE_2324+'\n\n다음 memory 종류 중 증례의 남자에서 손상된 것을 두 가지 고르시오.',
  choices=['Working memory','Episodic memory','Semantic memory','Procedure memory','Implicit memory'],ans=[2,3],
  basis='정답 ②,③ (복원자 구자홍). 측두엽 손상으로 episodic memory(medial temporal)와 semantic memory(anterior·inferolateral temporal)가 손상된 것으로 본다. 김고운 교수님 수업 중 퀴즈 6문제 중 4문제가 그대로 출제되었다.',
  exps=['즉시 기억은 보존되어 있다(prefrontal).','정답. 새로운 경험의 저장 장애 → episodic.','정답. 새로 알게 된 정보(지식)의 저장 장애 → semantic.','운동기술 습득은 보존되어 있다.','implicit(procedural 등)은 보존되어 있다.']),
 'q-013':dict(meta='야마 · 13/19 · 야마 2018 객14 · 학습지 258쪽 원문대조',
  stem='[13-14번 증례]\n'+CASE_2324+'\n\n다음 뇌영역 중 증례의 남자에서 손상된 부분을 고르시오.',
  choices=['소뇌(cerebellum)','기저핵(basal ganglia)','측두엽(temporal lobe)','전전두엽(prefrontal cortex)','보조운동영역(supplementary motor area)'],ans=[3],
  basis='Episodic memory – medial temporal lobe, semantic memory – anterior·inferior·lateral temporal cortical regions가 담당하므로 문제가 생긴 곳은 temporal lobe이다(복원자 최세리, 정답 ③).',
  exps=['procedural memory 영역이며, 보존되어 있다.','procedural memory 영역이며, 보존되어 있다.','episodic·semantic memory를 담당하는 측두엽이 손상 부위이다.','working memory 영역이며, 보존되어 있다.','procedural memory 영역이며, 보존되어 있다.']),
 'q-016':dict(meta='야마 · 16/19 · 야마 2013 객36 · 학습지 259쪽 원문대조 · 복수정답(5개)',
  stem='다음의 대화에서 해당되는 것을 모두 고르시오.\nA : 피아노는 언제부터 시작하셨나요?\nB : 유치원 때니까 6살쯤이요.\nA : 지금은 어려운 명곡도 칠 수 있으시나요?\nB : 예. 베토벤을 칠 수 있어요',
  choices=['Short term memory','Procedural memory','Episodic memory','Semantic memory','Declarative memory','Non-declarative memory','Emotional memory','Conditioned memory'],ans=[2,3,4,5,6],
  basis='학습지 정답 ②③④⑤⑥ (복원자 박사노). "유치원 때 6살쯤" = episodic(declarative), "명곡"이라는 단어의 뜻을 앎 = semantic(declarative), 피아노를 칠 수 있음 = procedural(non-declarative). ※ 복원자가 "모두 포함이라고 생각합니다"라고 적은 추정 정답이다.',
  exps=['단기 기억이 아니라 장기 기억에 해당한다.','정답. 피아노 연주 = procedural memory.','정답. 6살에 시작한 개인 경험 = episodic memory.','정답. "명곡"의 의미를 앎 = semantic memory.','정답. episodic·semantic은 declarative memory이다.','정답. procedural은 non-declarative memory이다.','대화에 감정 조건화 요소는 없다.','대화에 조건반사 요소는 없다.']),
 'q-017':dict(meta='야마 · 17/19 · 야마 2012 객19 · 학습지 259–260쪽 원문대조',
  stem='남녀가 대화를 하고 있다.\n여자 A : 우리가 처음 만난 때가 언제였지?\n남자 B : 100일전, 빼빼로 데이때!\n여자 A : 우리가 언제 처음 손을 잡았지?\n남자 B : 영화보고 나오다가.ㅎㅎ\n\n다음 중 여자 A가 남자 B에게 어떤 기억을 묻고 있는가? 가장 적절한 것을 고르시오.',
  choices=['Short-term memory','Procedural memory','Episodic memory','Semantic memory','Non-declarative memory'],ans=[3],
  basis='개인이 겪은 사건의 시점·경험을 묻고 있으므로 episodic memory(일화기억, declarative)이다(복원자 정은지, 정답 ③). 예: "when did we marry?"',
  exps=['100일 전 일은 장기 기억이다.','절차기억(피아노·자전거)이 아니다.','정답. 개인 경험(처음 만난 때, 처음 손잡은 때) = episodic memory.','일반 지식(예: what is a marriage?)이 아니다.','episodic은 declarative memory이다.']),
 'q-019':dict(meta='야마 · 19/19 · 야마 2011 객18 · 학습지 260쪽 원문대조',
  stem='기억의 개개 구성은 특정 뇌영역과 잘 조화된다. 다음 중 기억의 구성성분과 뇌 영역이 잘 조합된 것은 무엇인가?',
  choices=['Classical conditioning – parietal lobe','Conditioned reflex – frontal lobe','Semantic memory – temporal lobe','Episodic memory – cerebellum','Procedural memory – temporal lobe'],ans=[3],
  basis='학습지 정답 ③ (복원자 김태형, "답은 ③인 것 같습니다"). Declarative memory(episodic, semantic)는 hippocampus·medial temporal의 지배를 받는다. Semantic memory는 anterior·inferolateral temporal lobe가 담당한다.',
  exps=['고전적 조건화는 두정엽 기능과 짝지어지지 않는다.','조건반사는 전두엽 기능과 짝지어지지 않는다.','정답. semantic memory – (anterior·inferolateral) temporal lobe.','episodic memory는 medial temporal lobe가 담당한다. 소뇌는 procedural memory 영역이다.','procedural memory는 SMA·basal ganglia·cerebellum이 담당한다.']),
}
CIRC='①②③④⑤⑥⑦⑧'
def build(cid,body,f):
  nav=re.search(r'<div class="nav">.*?</div>',body,re.S).group(0)
  multi=len(f['ans'])>1
  parts=[f'<div class="qmeta">{E(f["meta"])}</div>']
  if '[수업범위 외]' in body: parts.append('<div class="scope">[수업범위 외] 원문 보존</div>')
  parts.append(f'<div class="stem">{E(f["stem"])}</div>')
  if f.get('visual'): parts.append(f'<div class="visual"><b>{E(f["visual"][0])}</b>{f["visual"][1]}</div>')
  if multi: parts.append(f'<div class="qmeta">정답 {len(f["ans"])}개를 모두 고른 뒤 아래 "채점하기"를 누르세요.</div>')
  for k,c in enumerate(f['choices'],1):
    ok=k in f['ans']; oid=f'{cid}-opt-{k}'
    if multi:
      cls='multi-input '+('mc-correct' if ok else 'mc-wrong')
      parts.append(f'<div class="choice-wrap"><input class="{cls}" id="{oid}" type="checkbox" value="{k}"/><label class="choice" for="{oid}">{k}. {E(c)}</label></div>')
    else:
      kind='correct' if ok else 'wrong'
      parts.append(f'<div class="choice-wrap {kind}-wrap"><input class="choice-input {kind}-input" id="{oid}" name="answer-{cid}" type="radio" value="{k}"/><label class="choice" for="{oid}">{k}. {E(c)}</label></div>')
  ansnum=','.join(str(a) for a in f['ans'])
  if multi: parts.append(f'<input class="reveal-toggle" id="{cid}-reveal" type="checkbox"/><label class="reveal reset" for="{cid}-reveal">채점하기 · 해설 보기</label>')
  parts.append(f'<div class="gradebox"><div class="grade-correct">✅ 정답</div><div class="grade-wrong">❌ 오답 · 정답은 {ansnum}번</div></div>')
  anstxt=' / '.join(f'{a}. {f["choices"][a-1]}' for a in f['ans'])
  fb=f'<div class="feedback"><div>{E("제공 정답: "+anstxt)}\n\n{E("정답 근거: "+f["basis"])}</div>'
  if f.get('extra'): fb+=f'<div class="visual"><b>{E(f["extra"][0])}</b>{f["extra"][1]}</div>'
  fb+='<div class="opt-exp"><b>선지별 해설</b>'+''.join(f'<div>{k}. {E(x)}</div>' for k,x in enumerate(f['exps'],1))+'</div></div>'
  parts.append(fb); parts.append(nav)
  cls='qcard multi' if multi else 'qcard'
  return cls,''.join(parts)
n=0
def sub(m):
  global n
  cls,cid,body=m.group(1),m.group(2),m.group(3)
  key=cid.replace('topic-020-area-yama-','')
  if cid.startswith('topic-020-area-yama-') and key in FIX:
    n+=1; newcls,newbody=build(cid,body,FIX[key])
    if 'active' in cls: newcls+=' active'
    return m.group(0).replace(f'class="{cls}"',f'class="{newcls}"',1).replace(body,newbody,1)
  return m.group(0)
s=re.sub(r'<article class="(qcard[^"]*)"[^>]*id="([^"]+)">(.*?)</article>',sub,s,flags=re.S)
CSS='''
/* multi-answer (복수정답) cards */
.multi-input{position:absolute;opacity:0;pointer-events:none}.choice-wrap .multi-input+.choice{margin:0;cursor:pointer}
.choice-wrap:has(.multi-input:checked) .choice{border:2px solid #6547b5;background:#f0ecff}
.qcard.multi:has(.reveal-toggle:checked) .gradebox{display:block}
.qcard.multi .grade-correct{display:none}.qcard.multi .grade-wrong{display:block}
.qcard.multi:not(:has(.mc-correct:not(:checked))):not(:has(.mc-wrong:checked)) .grade-correct{display:block}
.qcard.multi:not(:has(.mc-correct:not(:checked))):not(:has(.mc-wrong:checked)) .grade-wrong{display:none}
.qcard.multi:has(.reveal-toggle:checked) .mc-correct+.choice{border-color:#2e8b57;background:#eef9f0}
.qcard.multi:has(.reveal-toggle:checked) .mc-wrong:checked+.choice{border-color:#c84a4a;background:#fff0f0}
.visual img{max-width:100%}
'''
if '/* multi-answer' not in s: s=s.replace('</style>',CSS+'</style>',1)
open(out,'w',encoding='utf-8').write(s); print('fixed',n)
