# 단원(학습지 순서) – sec_<slug>.py 가 있으면 이 순서로 앱에 들어간다
import os
ORDER=['u01_la','u02_wound','u03_burn','u04_blood','u05_inj','u06_trans','u07_labintro','u08_gyn','u09_eye',
 'u10_chem','u11_immuno','u12_cxr','u13_preop','u14_splint','u15_axr','u16_foley','u17_drain','u18_motor','u19_ngt','u20_reflex']
# PUBLISH=1 이면 완료된 단원만: done.txt 에 slug 한 줄씩(없으면 전체). 작업 중 단원이 앱에 섞이지 않게 한다.
_d=os.path.join(os.path.dirname(os.path.abspath(__file__)),'done.txt')
if os.path.exists(_d) and os.environ.get('PUBLISH'):
  _s=set(open(_d).read().split()); ORDER=[u for u in ORDER if u in _s]
