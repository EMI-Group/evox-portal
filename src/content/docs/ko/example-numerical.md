---
title: "수치 최적화"
order: 9
section: "examples"
---

# 수치 최적화

이 노트북은 입자 군집 최적화(PSO) 알고리즘을 통해 Ackley 함수를 최적화하기 위해 EvoX를 활용하는 단계별 튜토리얼을 제공합니다. PSO 알고리즘과 Ackley 최적화 문제 모두 EvoX 프레임워크 내에 내장 구성 요소로 통합되어 있습니다.

먼저 `PSO`(알고리즘), `Ackley`(문제) 및 `StdWorkflow` & `EvalMonitor`(워크플로우)를 포함한 모든 필요한 모듈을 임포트해야 합니다.

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

여기서 `PSO` 알고리즘을 인스턴스화합니다. 다음 설정을 지정합니다:

- `pop_size`: 입자 군집(개체군)의 크기.
- `lb` 및 `ub`: 탐색 공간에서 각 차원의 하한 및 상한.
- 기타 파라미터는 모두 기본값입니다. 자세한 API를 참조하세요.

```python
# 알고리즘 정의
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

다음으로 EvoX의 수치 문제에서 `Ackley` 함수를 선택합니다.

```python
# 문제 정의
problem = Ackley()
```

최적화 절차 중 필요한 정보를 추적하기 위해 `EvalMonitor` 인스턴스를 생성합니다.

```python
# 모니터 정의
monitor = EvalMonitor()
```

`StdWorkflow` 클래스는 알고리즘, 문제 및 모니터를 통합하는 표준화된 프로세스를 제공합니다.

```python
# 워크플로우 정의
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

`setup()`을 호출하면 구성 요소가 초기화되어 워크플로우가 최적화 단계를 수행할 준비가 됩니다.

일정 횟수의 반복(이 예제에서는 100회) 동안 최적화를 실행합니다. 각 반복에서 `step()` 메서드는 PSO 알고리즘을 업데이트하고, Ackley 함수에서 새로운 후보 솔루션을 평가하며, 모니터를 통해 적합도를 추적합니다.

```python
# Ackley 함수 최적화 절차 수행
for _ in range(100):
    workflow.step()
```

마지막으로 워크플로우에서 `monitor` 하위 모듈을 검색하여 지금까지 찾은 상위 솔루션(`topk_solutions`)과 해당 목적 값(`topk_fitness`)에 접근합니다. 그런 다음 최적 결과와 관련 솔루션을 출력합니다.

```python
# 최적 솔루션과 적합도 가져오기
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"최적 솔루션:\n{population},\n최소값:\n{fitness}")
```

```python
monitor.plot()
```
