# 야마 해설 · 수업 전 단원(y_pre_emg) — 학습지 복원자 해설만 (올해 수업 근거는 아직 없음)
import y_pre_emg as _m
EXP = {}
for _r in _m.Y:
    if _r[4] is not None and _r[7]:
        EXP.setdefault('y-%s-%d' % (_r[1], _r[2]), {'wb': _r[7]})
