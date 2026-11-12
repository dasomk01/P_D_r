# 안과 문풀앱 빌드: y*.py(야마) + q*.py(티야·형성평가, 수업 후 추가) → oph-app.html
import importlib, sys, json, collections, os, re, difflib, glob, base64, hashlib, random
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from mk import build

# 수업(시간표 순). 코드 → (섹션명, 교수). 수업 자료(강의록·STT)가 생기면 '(야마 · 수업 전)'을 떼고 q 모듈을 붙인다.
PRE = ' (야마 · 수업 전)'
WAITL = ' (야마 · 강의록·STT 대기)'   # 수업은 끝났는데 솜에드에 강의록·STT가 아직 없는 칸
LECT = [
  ('L1205', '11/12 5교시 · 눈의 구조와 기능', '이행진'),
  ('L1301', '11/13 1–2교시 · 안과 검사', '김영은'),
  ('L1303', '11/13 3–4교시 · 충혈눈 (결막, 각막, 공막)', '유인천'),
  ('L1601', '11/16 1–2교시 · 외안근과 사시', '이행진'),
  ('L1603', '11/16 3교시 · 시신경, 신경안과', '이행진'),
  ('L1604', '11/16 4교시 · 굴절 및 광학', '이행진'),
  ('L1701', '11/17 1교시 · 시력장애 (백내장)', '유인천'),
  ('L1702', '11/17 2–3교시 · 시력장애 (각막, 결막, 공막)', '유인천'),
  ('L1704', '11/17 4교시 · 충혈눈 (녹내장, 전방출혈)', '이태은'),
  ('L1801', '11/18 1–2교시 · 포도막', '조남천'),
  ('L1803', '11/18 3–4교시 · 유리체, 망막', '조남천'),
  ('L1805', '11/18 5–6교시 · 눈꺼풀', '안민'),
  ('L1901', '11/19 1교시 · 눈물과 눈물기관', '안민'),
  ('L1902', '11/19 2교시 · 안와', '안민'),
  ('L1903', '11/19 3교시 · 안외상', '이태은'),
  ('L1904', '11/19 4교시 · 전신질환과 눈', '이태은'),
]
LMAP = {c: (n, p) for c, n, p in LECT}
# 수업을 마친(올해 강의록·STT를 반영한) 수업 코드 → 티야·형성평가 모듈
QMOD = {}
WAIT = {'L1205'}

YMODS = sorted(os.path.basename(p)[:-3] for p in glob.glob(D + '/y[0-9]*.py'))

def N(t): return re.sub(r'[\s\W_]+', '', t.lower())
def R(a, b): return difflib.SequenceMatcher(None, N(a), N(b)).ratio()
def same(c, s, ch, ans):
  # 문제가 거의 같고, 선지가 (순서만 바뀌어도) 1:1로 거의 같고, 정답 선지 내용이 같으면 같은 문제로 한 카드에 합친다
  if not c['ans'] or not ans or R(c['stem'], s) < 0.8 or len(c['ch']) != len(ch): return False
  used = set(); mp = {}
  for i, x in enumerate(ch):
    best = max(((R(x, y), j) for j, y in enumerate(c['ch']) if j not in used), default=(0, -1))
    if best[0] < 0.85: return False
    used.add(best[1]); mp[i + 1] = best[1] + 1
  return sorted(mp[a] for a in ans) == sorted(c['ans'])

IMG = {}
for p in sorted(glob.glob(D + '/yimg*.py')): IMG.update(importlib.import_module(os.path.basename(p)[:-3]).IMG)
def imgs(k): return ['data:image/jpeg;base64,' + base64.b64encode(open(D + '/' + f, 'rb').read()).decode() for f in IMG.get(k, [])]

EXP = {}   # 카드키 → {'cls': 올해 수업 기준 해설} (수업 후 yexp*.py 로 채움)
for p in sorted(glob.glob(D + '/yexp*.py')): EXP.update(importlib.import_module(os.path.basename(p)[:-3]).EXP)
TYB = {}   # 카드키 → (담당자, 멘트)  티야방
if os.path.exists(D + '/tyb.py'): TYB = importlib.import_module('tyb').TYB

def secname(code):
  n, p = LMAP[code]
  return (n if code in QMOD else n + (WAITL if code in WAIT else PRE)), p

def yama():
  cards = []; fam = collections.defaultdict(list); srcs = {}
  for m in YMODS:
    M = importlib.import_module(m)
    for t in M.Y:
      sec, f, y, n, stem, ch, ans, exp, notes = t[:9]
      prof = t[9] if len(t) > 9 else M.YP.get(y, '미상') if isinstance(M.YP, dict) else M.YP
      yl = '%d %s' % (y, n)
      if stem is None:                         # 바로 앞 해와 같은 문제(학습지에 '동일' 표시)
        fam[f][-1]['ys'].append(yl); fam[f][-1]['pf'][str(y)] = prof; continue
      excl = not ans and bool(ch)              # 정답 미상: 채점하지 않음. 선지 없는 주관식은 자가채점
      for c in fam[f]:
        if not excl and same(c, stem, ch, ans):
          c['ys'].append(yl); c['pf'][str(y)] = prof
          if exp and exp not in c['exps']: c['exps'].append((yl, exp))
          for x in notes:
            if x not in c['notes']: c['notes'].append(x)
          break
      else:
        c = dict(sec=sec, f=f, ys=[yl], stem=stem, ch=ch, ans=ans, exps=[(yl, exp)] if exp else [], notes=list(notes), excl=excl, pf={str(y): prof}, src=M.SRC)
        fam[f].append(c); cards.append(c)
  out = collections.defaultdict(list); used = set()
  for c in cards:
    allys = [y for d in fam[c['f']] for y in d['ys']]
    rep = len({y.split()[0] for y in allys})
    k = 'y-' + c['f'] + '-' + c['ys'][0].split()[0]
    if k in used: k += '-' + re.sub(r'\D', '', c['ys'][0].split()[1])   # 같은 해 같은 묶음에 다른 문제가 둘이면 번호를 붙인다
    used.add(k)
    sec, prof = secname(c['sec'])
    notes = c['notes']
    if len(c['ys']) > 1: notes = ['같은 문제(문제·선지 거의 동일): ' + ' · '.join(c['ys'][1:])] + notes
    if c['excl']: notes = notes + ['학습지 정답이 불분명해 채점하지 않아요. 확인되면 반영할게요.']
    # 출제 교수
    g = collections.OrderedDict()
    for y in sorted(c['pf']): g.setdefault(c['pf'][y] or '미상', []).append(y)
    cn = '✍️ 출제: ' + ' / '.join(p + (' 교수님' if p != '미상' else '') + ' (' + '·'.join(ys) + ')' for p, ys in g.items())
    if any(p not in (prof, '미상') for p in g): cn += ' — 올해 담당 ' + prof + ' 교수님과 다른 교수님 출제 포함'
    notes = [cn] + notes
    tb = TYB.get(k); ex = EXP.get(k, {})
    parts = ['📌 티야방(' + tb[0] + '): ' + tb[1]] if tb else []
    if ex.get('cls'): parts.append('🎓 올해 수업 기준: ' + ex['cls'])
    if c['exps']:
      wb = c['exps'][0][1] if len(c['exps']) == 1 else '\n'.join('[' + yl + '] ' + e for yl, e in c['exps'])
      summ = all(e.startswith('[요약]') for _, e in c['exps'])
      wb = wb.replace('[요약] ', '')
      parts.append(('📝 요약 해설(3개년 기출 부분엔 학습지 해설이 없어 정답 기준으로 정리 – 단원 야마 추가 때 학습지 해설로 교체): ' if summ else '📚 학습지 해설(요약): ') + wb)
    basis = '\n\n'.join(parts) or '📚 학습지 해설 없음'
    out[c['sec']].append(dict(k='oph-' + k, fam=c['f'], area='야마', prof=prof, sec=sec, meta='근거: ' + c['src'], tyb=bool(tb),
      year=c['ys'][0], type='객' if c['ch'] else '주', rep=rep, repyears=' · '.join(y for y in allys if y != c['ys'][0]) if rep > 1 else '',
      stem=c['stem'], choices=c['ch'], ans=c['ans'], excl=c['excl'], imgs=imgs(k), vis=[], notes=notes, basis=basis, exps=[], ai=''))
  return out

Y = yama()
bad = [s for s in Y if s not in LMAP]
items = []; errs = []
for code, _, _ in LECT:
  sec, prof = secname(code)
  if code in QMOD:
    mods = QMOD[code] if isinstance(QMOD[code], list) else [QMOD[code]]
    for t in [t for m in mods for t in importlib.import_module(m).Q]:
      area, k, stem, ch, ans, basis, exps, src = t[:8]; qn = list(t[8]) if len(t) > 8 else []
      r = random.Random(int(hashlib.md5(k.encode()).hexdigest(), 16)); idx = list(range(5)); r.shuffle(idx)
      fhq = bool(re.match(r'^(🤍|💜)형성평가', stem))   # 형성평가는 원래 선지 순서·개수 그대로
      if ch and not fhq:
        if len(ch) != 5 or len(exps) != 5 or not 1 <= ans <= 5: errs.append(k)
        ch = [ch[i] for i in idx]; exps = [exps[i] for i in idx]; ans = idx.index(ans - 1) + 1
      tb = TYB.get(k)
      if tb: basis = '📌 티야방(' + tb[0] + '): ' + tb[1] + '\n\n' + basis
      items.append(dict(k='oph-' + k, area=area, prof=prof, sec=sec, meta=('📌티야방 · ' if tb else '') + '근거: ' + src, tyb=bool(tb),
        year='', type='객' if ch else '주', rep=1, stem=stem, choices=ch, ans=[ans] if ch else [], imgs=imgs(k), vis=[], notes=qn, basis=basis, exps=exps, ai=''))
  items += Y.get(code, [])
for i in items:
  if i['area'] == '야마' and not i.get('excl') and i['choices'] and (not i['ans'] or max(i['ans']) > len(i['choices'])): errs.append(i['k'])
  if re.match(r'^(🤍|💜)형성평가', i['stem']) or any('형성평가' in n for n in i['notes']): i['fh'] = True
keys = [i['k'] for i in items]; dup = [k for k, c in collections.Counter(keys).items() if c > 1]
ym = [i for i in items if i['area'] == '야마']
print(len(items), dict(collections.Counter(i['area'] for i in items)), 'errs', errs, 'dup', dup, 'bad sec', bad)
print('야마', len(ym), '킹야(2회)', sum(i['rep'] == 2 for i in ym), '킹킹야(3회+)', sum(i['rep'] >= 3 for i in ym),
      '확인필요(채점X)', len([i for i in ym if i.get('excl')]), '⚠', sum(any(n.startswith('⚠') for n in i['notes']) for i in ym),
      '그림', sum(bool(i['imgs']) for i in items), '주관식', sum(not i['choices'] for i in ym))
print('IMG키없음', [k for k in IMG if 'oph-' + k not in keys])
print('사진문항인데그림없음', [i['k'] for i in items if re.search(r'\((사진|그림)', i['stem']) and not i['imgs']])
print('형성평가', sum(bool(i.get('fh')) for i in items))
print(collections.Counter(i['sec'] for i in items))
ny = [i for i in items if i['area'] != '야마' and i['choices']]
print('answer-much-longer', [i['k'] for i in ny if len(i['choices'][i['ans'][0]-1]) > 1.6 * max(len(c) for j, c in enumerate(i['choices']) if j != i['ans'][0]-1)])
if os.environ.get('DUMP'): json.dump([dict(k=i['k'], y=i['year'], r=i['repyears'], s=i['stem'][:50]) for i in ym], open(os.environ['DUMP'], 'w'), ensure_ascii=False, indent=0)
print(build(items, '안과 문풀', 'oph-app', D + '/oph-app.html'))
