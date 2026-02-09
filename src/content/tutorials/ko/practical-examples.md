---
title: "7. 실전 예제"
order: 7
---

# 7. 실전 예제

이 장에서는 이전 장에서 배운 지식을 적용하는 방법을 보여주기 위해 몇 가지 완전한 실전 예제를 제시합니다. 최적화 프로젝트를 처음부터 구축하고 EvoX를 다른 도구와 통합하는 방법을 보여드리겠습니다. 이 예제들은 다양한 문제 유형을 다루며, 실제 시나리오에 EvoX를 적용하는 데 도움을 줄 것입니다.

---

## 예제 1: 단일 목적 최적화

**문제**: 고전적인 Rastrigin 함수를 최적화합니다:

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

여기서 $\mathbf{x} \in \mathbb{R}^d$이고 $d$는 차원입니다. 전역 최적해(global optimum)는 원점에서 0입니다. 이 함수는 다봉성(multimodal)이 강하여 전역 최적화 알고리즘을 테스트하는 데 이상적입니다. 다음은 Rastrigin 함수의 플롯입니다.

```{figure} /_static/rastrigin_function.svg
:alt: Rastrigin 함수 플롯
:figwidth: 70%
:align: center

Rastrigin 함수
```

이 예제에서는 Particle Swarm Optimization (PSO) 알고리즘을 사용하여 10차원 Rastrigin 함수를 최적화합니다.

**1단계: 설정**

2장에서 설명한 대로 EvoX 환경을 구성했다고 가정합니다.

**2단계: 워크플로우 설정**

Python 스크립트 `opt_rastrigin_10.py`를 생성합니다:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

PSO 알고리즘을 정의합니다:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

문제와 워크플로우를 설정합니다:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**3단계: 최적화 실행**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**출력 예시**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

예상대로 PSO 알고리즘은 원점에 가까운 근사 최적해를 찾습니다.

---

## 예제 2: 다목적 최적화

**문제**: 두 가지 목적 함수를 최소화합니다:

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Pareto front는 $x = 0$ ($f_1$에 최적)과 $x = 2$ ($f_2$에 최적) 사이에 위치합니다.

**1단계: 환경 설정**

NSGA-II 지원이 포함된 EvoX가 설치되어 있는지 확인하세요.

**2단계: 사용자 정의 문제 정의**

EvoX에는 많은 다목적 테스트 문제가 내장되어 있지만, 이 예제에서는 두 가지 목적 함수를 최적화하기 위해 사용자 정의 문제를 정의하겠습니다:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Import evox core classes, see Chapter 5 for details
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Optional: Define the Pareto front function
    def pf(self) -> torch.Tensor:
        pass
```

**3단계: 알고리즘 및 워크플로우 정의**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**4단계: 최적화 및 시각화**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Matplotlib을 사용하여 결과를 시각화할 수 있습니다. 파란색 점은 최적화된 개체군(population)을 나타내고, 빨간색 선은 Pareto front를 보여줍니다.

```{figure} /_static/example_nsga2_result.svg
:alt: NSGA-II 개체군 플롯
:figwidth: 70%
:align: center

최적화 후 NSGA-II 개체군 플롯
```

Jupyter Notebook에서는 EvoX의 내장 플로팅 기능을 사용하여 최적화 과정을 시각화하고 세대에 따라 개체군이 어떻게 진화하는지 모니터링할 수 있습니다.

```python
monitor.plot()
```

---

## 예제 3: 하이퍼파라미터 최적화 (HPO)

**문제**: 유방암 데이터셋에 대한 로지스틱 회귀 분류기의 `C`와 `max_iter`를 조정하여 검증 정확도를 최대화합니다.

**1단계: 데이터 및 모델 로드**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**2단계: 문제 정의**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```

**3단계: 워크플로우 설정**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**4단계: 최적화**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**출력 예시**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

단 몇 줄의 코드로 EvoX는 지루한 시행착오 과정인 하이퍼파라미터 튜닝을 자동화합니다.

---

이러한 실전 예제들은 수학적 테스트 함수부터 머신러닝 워크플로우에 이르기까지 다양한 도메인에서 EvoX가 어떻게 효과적으로 적용될 수 있는지 보여줍니다. **Algorithm + Problem + Monitor + Workflow**라는 기본 구조에 익숙해지면, 거의 모든 최적화 작업에 맞게 EvoX를 조정할 수 있습니다.