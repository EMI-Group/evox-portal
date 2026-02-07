---
title: "5. 개발 및 확장"
order: 5
---

# 5. 개발 및 확장

EvoX는 즉시 사용 가능한 기능뿐만 아니라 개발자와 고급 사용자를 위한 풍부한 사용자 정의 개발 및 확장 통합 인터페이스를 제공합니다. 이 장에서는 사용자 정의 알고리즘과 문제를 구현하는 방법, EvoX의 API를 활용하여 더 깊은 제어를 하는 방법, 그리고 EvoX를 다른 도구와 통합하여 더 복잡한 애플리케이션을 구축하는 방법을 자세히 설명합니다.

## 5.1 사용자 정의 모듈 개발

때로는 해결하려는 문제나 사용하려는 알고리즘이 EvoX의 표준 라이브러리에 포함되어 있지 않을 수 있습니다. 이러한 경우 EvoX가 제공하는 인터페이스를 사용하여 사용자 정의 모듈을 개발할 수 있습니다.

### 5.1.1 사용자 정의 문제 (MyProblem)

목적 함수가 `evox.problems`에 없는 경우 `evox.core.Problem` 기본 클래스에서 상속하여(또는 필요한 인터페이스를 준수하여) 직접 정의할 수 있습니다. 일반적인 문제 클래스는 솔루션 배치(`pop`)를 받아 해당 적합도/목적 값을 반환하는 `evaluate` 함수를 구현해야 합니다. 병렬 계산을 활용하기 위해 EvoX는 `evaluate`가 **배치 입력**을 지원해야 합니다.

```python
import torch
from abc import ABC
from typing import Any, Dict
from evox.core.module import ModuleBase

class Problem(ModuleBase, ABC):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor) -> torch.Tensor:
        return torch.empty(0)
```

예를 들어, 결정 벡터의 세제곱 합을 최소화하려면:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

다음과 같이 `MyProblem` 클래스를 구현할 수 있습니다:

```python
import torch
from evox.core import Problem

class MyProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        fitness = torch.sum(pop**3, dim=1)
        return fitness
```
여기서 `pop`은 `(population_size, dim)` 형태의 텐서입니다. `evaluate` 함수는 1D 적합도 값 텐서를 반환합니다. 다목적 문제의 경우 각 목적에 대한 별도의 키가 있는 딕셔너리를 반환할 수 있습니다.

사용자 정의 문제를 내장 문제처럼 사용할 수 있습니다:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 사용자 정의 알고리즘 (MyAlgorithm)

사용자 정의 알고리즘을 만드는 것은 초기화, 새 솔루션 생성, 선택을 포함하므로 더 복잡합니다. 새 알고리즘을 만들려면 `evox.core.Algorithm`에서 상속하고 최소한 다음을 구현하세요:

- `__init__`: 초기화용.
- `step`: 주요 진화 단계 로직.

다음은 EvoX에서 입자 군집 최적화(PSO) 알고리즘을 구현하는 예입니다:

```python
import torch
from evox.core import Algorithm, Mutable, Parameter
from evox.utils import clamp
from evox.algorithms.so.pso_variants.utils import min_by

class PSO(Algorithm):
    def __init__(
        self,
        pop_size: int,
        lb: torch.Tensor,
        ub: torch.Tensor,
        w: float = 0.6,
        phi_p: float = 2.5,
        phi_g: float = 0.8,
        device: torch.device | None = None,
    ):
        super().__init__()
        device = torch.get_default_device() if device is None else device
        assert lb.shape == ub.shape and lb.ndim == 1

        self.pop_size = pop_size
        self.dim = lb.shape[0]

        lb = lb[None, :].to(device)
        ub = ub[None, :].to(device)
        length = ub - lb

        pop = length * torch.rand(self.pop_size, self.dim, device=device) + lb
        velocity = 2 * length * torch.rand(self.pop_size, self.dim, device=device) - length

        self.lb = lb
        self.ub = ub

        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)

        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop.clone())
        self.local_best_fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.global_best_location = Mutable(pop[0])
        self.global_best_fit = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        compare = self.local_best_fit > self.fit
        self.local_best_location = torch.where(compare[:, None], self.pop, self.local_best_location)
        self.local_best_fit = torch.where(compare, self.fit, self.local_best_fit)
        self.global_best_location, self.global_best_fit = min_by(
            [self.global_best_location.unsqueeze(0), self.pop],
            [self.global_best_fit.unsqueeze(0), self.fit],
        )
        rg = torch.rand(self.pop_size, self.dim, device=self.fit.device)
        rp = torch.rand(self.pop_size, self.dim, device=self.fit.device)

        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.pop)
            + self.phi_g * rg * (self.global_best_location - self.pop)
        )
        pop = self.pop + velocity
        self.pop = clamp(pop, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)
        self.fit = self.evaluate(self.pop)

    def init_step(self):
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```
알고리즘을 워크플로우에 통합하려면:

```python
import torch
from MyProblems import MyProblem
from evox.workflows import EvalMonitor, StdWorkflow
from evox.algorithms import PSO

problem = MyProblem()
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0])
)
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)
for i in range(10):
    workflow.step()
```

### 5.1.3 기타 모듈 사용자 정의

`Monitor`, `Operator` 또는 EvoX의 모든 모듈을 사용자 정의할 수도 있습니다. 예를 들어, 개체군 다양성을 기록하는 `MyMonitor`를 구현하거나 사용자 정의 교차/돌연변이 전략을 위한 `MyOperator`를 만들 수 있습니다. 어떤 메서드를 오버라이드해야 하는지 이해하려면 기존 기본 클래스와 예제를 참조하세요.

## 5.2 API 사용

EvoX는 API를 모듈로 구성하여 구성 요소를 쉽게 확장하고 결합할 수 있습니다.

### 5.2.1 알고리즘과 문제

- **알고리즘**: `evox.algorithms.so`(단일 목적)와 `evox.algorithms.mo`(다목적)에 있습니다.

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **문제**: `evox.problems`에 있으며 다음을 포함합니다:
  - `numerical` -- 고전적 테스트 함수(예: Ackley, Sphere).
  - `neuroevolution` -- Brax와 같은 RL 환경.
  - `hpo_wrapper` -- ML 훈련을 HPO 문제로 래핑.

예: PyTorch MLP를 Brax 환경으로 래핑:

```python
import torch.nn as nn
from evox.problems.neuroevolution.brax import BraxProblem

class SimpleMLP(nn.Module):
    ...

policy = SimpleMLP().to(device)
problem = BraxProblem(
    policy=policy,
    env_name="swimmer",
    ...
)
```

예: HPO를 위한 최적화 프로세스 래핑:

```python
from evox.problems.hpo_wrapper import HPOProblemWrapper
...
hpo_problem = HPOProblemWrapper(
    iterations=30,
    num_instances=128,
    workflow=inner_workflow,
    copy_init_state=True
)
```

### 5.2.2 워크플로우와 도구

- **워크플로우**: 기본 최적화 루프를 위한 `evox.workflows.StdWorkflow`.
- **모니터**: 성능 추적을 위한 `EvalMonitor`.

예:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **지표**: `evox.metrics`는 IGD, Hypervolume 등을 제공합니다.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch 상호 운용성**: `torch.nn`, `torch.Tensor` 등과의 원활한 통합.

## 5.3 다른 도구와의 통합

EvoX는 외부 도구와 쉽게 통합되도록 설계되었습니다.

### 5.3.1 머신러닝 통합

EvoX를 사용하여 하이퍼파라미터를 조정하세요:

1. 훈련/검증을 `Problem`으로 래핑합니다.
2. CMA-ES와 같은 알고리즘을 사용합니다.
3. 여러 실행에 걸쳐 하이퍼파라미터를 최적화합니다.
4. 최적의 파라미터로 최종 모델을 훈련합니다.

### 5.3.2 강화학습 통합

EvoX를 사용하여 신경망 정책을 진화시키세요:

1. `BraxProblem`을 사용하여 RL 환경을 래핑합니다.
2. `ParamsAndVector`를 사용하여 정책 네트워크를 평탄화합니다.
3. GA 또는 CMA-ES와 같은 진화 알고리즘을 사용하여 최적화합니다.
4. 최적화된 정책을 직접 배포하거나 RL로 미세 조정합니다.

EvoX는 GPU/CPU 성능을 완전히 활용하기 위한 배치 환경 시뮬레이션을 지원합니다.

---

**요약하면**, EvoX는 사용자 정의 알고리즘 구현, 모든 최적화 문제 래핑, ML 및 RL 도구와의 통합을 위한 강력하고 모듈형 API와 개발자 친화적인 설계를 제공합니다. 이해가 깊어지면 이러한 인터페이스를 창의적으로 적용하여 맞춤형 최적화 솔루션을 구축할 수 있습니다.
