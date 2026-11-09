# 피부과 문풀앱 빌드: y*.py(야마) + q*.py(티야·탈야, 수업 후 추가) → derm-app.html
import importlib, sys, json, collections, os, re, difflib, glob, base64, hashlib, random
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from mk import build

# 수업(시간표 순). 코드 → (섹션명, 교수). 수업 자료(강의록·STT)가 생기면 '(야마 · 수업 전)'을 떼고 q 모듈을 붙인다.
PRE = ' (야마 · 수업 전)'
LECT = [
  ('L0503', '11/5 3교시 · 피부의 구조와 기능, 피부조직병리학', '박진'),
  ('L0504', '11/5 4교시 · 피부의 증상, 징후 및 진단, 피부면역학', '박진'),
  ('L0505', '11/5 5교시 · 광의학', '남경화'),
  ('L0601', '11/6 1교시 · 유전피부질환, 물리적 피부질환, 스포츠피부질환', '윤석권'),
  ('L0602', '11/6 2교시 · 수포(물집)질환', '윤석권'),
  ('L0603', '11/6 3교시 · 가려움증, 정신피부질환 및 신경피부질환', '박진'),
  ('L0604', '11/6 4교시 · 11/10 3교시 · 습진 1·2', '박진'),
  ('L0901', '11/9 1교시 · 구진인설(구진비늘)질환', '남경화'),
  ('L0902', '11/9 2교시 · 색소이상증, 내분비질환, 섬유증', '남경화'),
  ('L0903', '11/9 3교시 · 피부부속기질환 (피지샘질환, 땀샘질환)', '윤석권'),
  ('L0904', '11/9 4교시 · 피부혈관질환, 결합조직질환', '윤석권'),
  ('L1001', '11/10 1교시 · 감염피부질환 (세균감염 및 리케차 질환)', '남경화'),
  ('L1002', '11/10 2교시 · 감염피부질환 (피부진균증)', '남경화'),
  ('L1004', '11/10 4교시 · 약물발진, 홍반 및 두드러기', '박진'),
  ('L1101', '11/11 1교시 · 피하지방질환, 점막질환', '윤석권'),
  ('L1102', '11/11 2교시 · 결절 질환, 대사이상, 포르피린증', '윤석권'),
  ('L1103', '11/11 3교시 · 감염피부질환 (피부마이코박테리움증, 나병)', '남경화'),
  ('L1104', '11/11 4교시 · 피부부속기질환 (모발질환, 손발톱질환)', '박진'),
  ('L1105', '11/11 5–6교시 · 모반과 종양 1·2', '박진'),
  ('L1201', '11/12 1교시 · 임신피부질환, 신생아피부질환, 피부노화', '윤석권'),
  ('L1202', '11/12 2교시 · 피부질환의 치료, 피부미용학', '윤석권'),
  ('L1203', '11/10 2교시 · 11/12 3교시 · 감염피부질환 (바이러스피부질환)', '남경화'),
  ('L1204', '11/12 4교시 · 감염피부질환 (성전파질환, 동물기생충질환)', '남경화'),
]
LMAP = {c: (n, p) for c, n, p in LECT}
# 수업을 마친(올해 강의록·STT를 반영한) 수업 코드 → 티야·탈야 모듈. 비어 있으면 그 칸은 '수업 전'.
QMOD = {'L0503': ['qf0503', 'q0503'], 'L0504': ['qf0504', 'q0504'], 'L0505': ['qf0505', 'q0505'], 'L0601': 'q0601', 'L0602': 'q0602', 'L0603': ['qf0603', 'q0603'], 'L0604': 'q0604', 'L0901': ['qf0901', 'q0901'], 'L0902': 'q0902', 'L0903': 'q0903', 'L0904': 'q0904'}

YMODS = sorted(os.path.basename(p)[:-3] for p in glob.glob(D + '/y[0-9]*.py'))

def N(t): return re.sub(r'[\s\W_]+', '', t.lower())
def R(a, b): return difflib.SequenceMatcher(None, N(a), N(b)).ratio()
def same(c, s, ch, ans):
  # 문제·선지가 거의 같고(순서 포함) 정답 선지 내용이 같으면 같은 문제로 한 카드에 합친다
  if not c['ans'] or not ans or R(c['stem'], s) < 0.8 or len(c['ch']) != len(ch): return False
  if R(' '.join(c['ch'][a-1] for a in c['ans']), ' '.join(ch[a-1] for a in ans)) < 0.85: return False
  return min(R(x, y) for x, y in zip(c['ch'], ch)) >= 0.85

IMG = {}
for p in sorted(glob.glob(D + '/yimg*.py')): IMG.update(importlib.import_module(os.path.basename(p)[:-3]).IMG)
def imgs(k): return ['data:image/jpeg;base64,' + base64.b64encode(open(D + '/' + f, 'rb').read()).decode() for f in IMG.get(k, [])]

EXP = {}   # 카드키 → {'cls': 올해 수업 기준 해설} (수업 후 yexp*.py 로 채움)
for p in sorted(glob.glob(D + '/yexp*.py')): EXP.update(importlib.import_module(os.path.basename(p)[:-3]).EXP)
TYB = {}   # 카드키 → (담당자, 멘트)  티야방
if os.path.exists(D + '/tyb.py'): TYB = importlib.import_module('tyb').TYB

def secname(code):
  n, p = LMAP[code]
  return (n if code in QMOD else n + PRE), p

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
      parts.append('📚 학습지 해설: ' + wb)
    basis = '\n\n'.join(parts) or '📚 학습지 해설 없음'
    out[c['sec']].append(dict(k='derm-' + k, fam=c['f'], area='야마', prof=prof, sec=sec, meta='근거: ' + c['src'], tyb=bool(tb),
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
      items.append(dict(k='derm-' + k, area=area, prof=prof, sec=sec, meta=('📌티야방 · ' if tb else '') + '근거: ' + src, tyb=bool(tb),
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
print('IMG키없음', [k for k in IMG if 'derm-' + k not in keys])
print('형성평가', sum(bool(i.get('fh')) for i in items))
print(collections.Counter(i['sec'] for i in items))
ny = [i for i in items if i['area'] != '야마' and i['choices']]
print('answer-much-longer', [i['k'] for i in ny if len(i['choices'][i['ans'][0]-1]) > 1.6 * max(len(c) for j, c in enumerate(i['choices']) if j != i['ans'][0]-1)])
if os.environ.get('DUMP'): json.dump([dict(k=i['k'], y=i['year'], r=i['repyears'], s=i['stem'][:50]) for i in ym], open(os.environ['DUMP'], 'w'), ensure_ascii=False, indent=0)
print(build(items, '피부과 문풀', 'derm-app', D + '/derm-app.html'))
