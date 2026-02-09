---
title: "다목적 최적화 알고리즘"
order: 10
section: "examples"
---

# 다목적 최적화 알고리즘

이 노트북에서는 **DTLZ2** 문제의 최적해를 찾기 위해 Reference Vector Guided Evolutionary Algorithm (**RVEA**)을 사용합니다.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (선택 사항) GPU를 사용하여 코드 실행
더 빠른 실행을 위해 코드를 GPU에서 실행하는 것을 선호하는 경우가 많습니다. 하지만 GPU를 사용할 수 없는 경우 CPU에서 실행하는 것도 가능합니다.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 실행 예제: DTLZ2 문제에서의 RVEA
다음 코드는 `DTLZ2` 문제와 `RVEA` 알고리즘을 설정하는 데 사용됩니다. 문제와 알고리즘에 대한 자세한 정보는 문서의 해당 섹션에서 확인할 수 있습니다.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

설정이 완료되었으므로 이제 최적화를 시작할 수 있습니다. 이 문제에 대해 다목적 최적화 알고리즘이 100 스텝(step) 동안 최적화를 수행하도록 설정합니다.

```python
# Run the workflow for 100 steps
t = time.time()
workflow.init_step()
for i in range(100):
    compiled_step()
    fit = workflow.algorithm.fit
    fit = fit[~torch.isnan(fit).any(dim=1)]
    if i % 10 == 0:
        print(igd(fit, pf))
```

```python
monitor.plot()
```