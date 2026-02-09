---
title: "EvoX의 사용자 정의 알고리즘 및 문제"
order: 5
section: "developer"
---

# EvoX의 사용자 정의 알고리즘 및 문제

이 장에서는 EvoX에서 자신만의 알고리즘과 문제를 구현하는 방법을 소개합니다.

## 알고리즘과 문제의 구조

대부분의 전통적인 EC 라이브러리에서는 알고리즘이 내부적으로 목적 함수(objective function)를 호출하며, 이는 다음과 같은 구조를 가집니다:

```
Algorithm
|
+--Problem
```

**하지만 EvoX는 평면적인(flat) 구조를 가집니다:**

```
Algorithm.step -- Problem.evaluate
```

이러한 구조는 알고리즘과 문제 모두를 더 범용적으로 만듭니다. 하나의 알고리즘이 다양한 문제를 최적화할 수 있고, 하나의 문제가 여러 알고리즘에 적합할 수도 있습니다.


## Algorithm 클래스

`Algorithm` 클래스는 `ModuleBase`를 상속받습니다.

**총 5개의 메서드가 있으며(2개는 선택 사항), 우리가 구현해야 할 메서드는 다음과 같습니다:**

| 메서드 | 서명(Signature) | 용도 |
| --- | --- | --- |
| `__init__` | `(self, ...)` | 알고리즘 인스턴스를 초기화합니다. 예를 들어, 개체군 크기(반복 중에 일정하게 유지됨), 하이퍼파라미터(HPO 문제 래퍼에 의해서만 설정되거나 여기서 초기화됨), 그리고/또는 가변 텐서(실행 중에 수정 가능) 등이 있습니다. |
| `step` | `(self)` | 알고리즘의 일반적인 최적화 반복 단계를 수행합니다. |
| `init_step` (선택 사항) | `(self)` | 알고리즘 최적화의 첫 번째 단계를 수행합니다. 이 메서드가 재정의(overwrite)되지 않으면 `step` 메서드가 대신 호출됩니다. |

> **참고:**
> 정적 초기화는 여전히 `__init__`에 작성할 수 있지만, 가변(mutable) 서브모듈 초기화는 불가능합니다. 따라서 재정의된 `setup` 메서드가 `ModuleBase`의 `setup()`을 먼저 호출한다면, 반복적인 초기화를 위해 `setup`을 여러 번 호출하는 것이 가능합니다.
>
> `ModuleBase`의 이러한 `setup` 메서드가 여러분의 알고리즘에 적합하지 않다면, 자체 알고리즘 클래스를 생성할 때 `setup` 메서드를 재정의할 수 있습니다.


## Problem 클래스

`Problem` 클래스 또한 `ModuleBase`를 상속받습니다.

하지만 Problem 클래스는 꽤 간단합니다. **`__init__` 메서드 외에 필요한 유일한 메서드는 `evaluate` 메서드입니다.**

| 메서드 | 서명(Signature) | 용도 |
| --- | --- | --- |
| `__init__` | `(self, ...)` | 문제의 설정을 초기화합니다. |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | 주어진 개체군의 적합도(fitness)를 평가합니다. |

하지만 재정의된 메서드에서 `evaluate`의 `pop` 인자 타입은 다른 JIT 호환 타입으로 변경될 수 있습니다.


## 예제

여기서는 **Sphere 문제를 해결하는 PSO 알고리즘을 구현하는** 예제를 보여드립니다.

### 예제의 의사 코드(Pseudo-code)

의사 코드는 다음과 같습니다:

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

그리고 다음은 알고리즘과 문제의 각 부분이 EvoX에서 무엇에 해당하는지 보여줍니다.

```text
Set hyper-parameters # Algorithm.__init__

Generate the initial population # Algorithm.setup
Do
    # Problem.evaluate (not part of the algorithm)
    Compute fitness

    # Algorithm.step
    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### 알고리즘 예제: PSO 알고리즘

입자 군집 최적화(PSO)는 새와 물고기의 사회적 행동에서 영감을 받은 개체군 기반 메타 휴리스틱 알고리즘입니다. 연속 및 이산 최적화 문제를 해결하는 데 널리 사용됩니다.

**EvoX에서의 PSO 알고리즘 구현 예제는 다음과 같습니다:**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        # Mutable parameters
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        # Compute fitness
        fitness = self.evaluate(self.population)

        # Update the local best fitness and the global best fitness
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )

        # Update the velocity
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )

        # Update the population
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        # Find the value with the minimum key
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### 문제 예제: Sphere 문제

Sphere 문제는 최적화 알고리즘을 테스트하는 데 사용되는 간단하지만 기본적인 벤치마크 최적화 문제입니다.

Sphere 함수는 다음과 같이 정의됩니다:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**EvoX에서의 Sphere 문제 구현 예제는 다음과 같습니다:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

이제 워크플로우를 초기화하고 실행할 수 있습니다.