MODS=['q15_axr']
YMODS=['y_axr']
YSEC={'axr':'q15_axr'}
YSRC={'axr':'「복부 X-선」 191–211쪽'}
# 올해 수업범위 외(사용자 11/26 「송지수도 분류해주고」): 카드 노트가 「2026 강의록 90쪽·STT 전체에 초음파·조영술·MRCP·CT 기법 내용 없음」인 묶음 전체.
# 범위 안: pp(복강내 유리공기)·lbo·sbo·asc(복수)·cp(만성췌장염 석회화)·normgas(정상 장내가스), unk(2014 객52 복원 안 됨)는 그대로 둠. 답은 그대로.
YSRC['axr_out']='「복부 X-선」 191–211쪽 – 초음파·조영술·MRCP·CT(옛 강의 범위), 2026 강의록(90쪽)·STT에 없음'
PRE={'axr_out':('10/22 7교시 · 복부 X-선 – 올해 수업범위 외(초음파·조영술·CT)','송지수','q15_axr')}
PREFAM={f:'axr_out' for f in ['axr-3d', 'axr-be', 'axr-chol', 'axr-ct', 'axr-ctc', 'axr-liverct', 'axr-mcsbs', 'axr-mrcp', 'axr-mru', 'axr-ugi', 'axr-usae', 'axr-usanat', 'axr-usint', 'axr-usliver', 'axr-usps', 'axr-usrd', 'axr-usrev', 'axr-vcug']}
