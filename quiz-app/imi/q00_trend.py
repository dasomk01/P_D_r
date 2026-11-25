# 📈 출제경향 예상문제 – 단원별 trend_<slug>.py 의 Q 를 단원 순서로 모은다(영역 「출제경향」 → 📈 칩). 원문 근거는 출제경향.md
import importlib,os
from order import ORDER
SEC=('📈 출제경향 예상문제 (교수님이 STT에서 직접 말한 출제 방식 근거)','여러 교수님')
Q=[]
for _u in ORDER:
  if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),'trend_'+_u+'.py')):
    Q+=importlib.import_module('trend_'+_u).Q
