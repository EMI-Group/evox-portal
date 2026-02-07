---
title: "EvoX에서의 사용자 정의 알고리즘과 문제"
order: 5
section: "developer"
---

# EvoX에서의 사용자 정의 알고리즘과 문제

이 장에서는 EvoX에서 자체 알고리즘과 문제를 구현하는 방법을 소개합니다.

## 알고리즘과 문제의 레이아웃

대부분의 전통적인 EC 라이브러리에서 알고리즘은 일반적으로 내부적으로 목적 함수를 호출하며, 다음과 같은 레이아웃을 가집니다:

```
Algorithm
|
+--Problem
```

**하지만 EvoX에서는 평면 레이아웃을 사용합니다:**

```
Algorithm.step -- Problem.evaluate
```

이 레이아웃은 알고리즘과 문제 모두를 더 범용적으로 만듭니다: 알고리즘은 다양한 문제를 최적화할 수 있고, 문제도 많은 알고리즘에 적합할 수 있습니다.


## Algorithm 클래스

`Algorithm` 클래스는 `ModuleBase`에서 상속됩니다.

**총 5개의 메서드(2개는 선택 사항)를 구현해야 합니다:**

| 메서드       | 시그니처                               | 용도                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | 알고리즘 인스턴스를 초기화합니다. 예를 들어, 개체군 크기(반복 중 일정), 하이퍼파라미터(HPO 문제 래퍼에 의해서만 설정되거나 여기서 초기화됨), 및/또는 가변 텐서(즉시 수정 가능). |
| `step`               | `(self)`                        | 알고리즘의 일반적인 최적화 반복 단계를 수행합니다. |
| `init_step` (선택 사항) | `(self)` | 알고리즘 최적화의 첫 번째 단계를 수행합니다. 이 메서드가 오버라이드되지 않으면 대신 `step` 메서드가 호출됩니다. |

> **참고:**
> 정적 초기화는 여전히 `__init__`에서 작성할 수 있지만 가변 하위 모듈 초기화는 그렇지 않습니다. 따라서 오버라이드된 `setup` 메서드가 먼저 `ModuleBase`의 `setup()`을 호출하면 반복 초기화를 위한 `setup`의 다중 호출이 가능합니다.
>
> `ModuleBase`의 이러한 `setup` 메서드가 알고리즘에 적합하지 않은 경우 자체 알고리즘 클래스를 만들 때 `setup` 메서드를 오버라이드할 수 있습니다.
## Problem 클래스

`Problem` 클래스도 `ModuleBase`에서 상속됩니다.

그러나 Problem 클래스는 매우 간단합니다. **`__init__` 메서드 외에 유일하게 필요한 메서드는 `evaluate` 메서드입니다.**

| 메서드     | 시그니처                                   | 용도                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | 문제의 설정을 초기화합니다.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | 주어진 개체군의 적합도를 평가합니다. |

그러나 `evaluate`의 `pop` 인수 유형은 오버라이드된 메서드에서 다른 JIT 호환 유형으로 변경할 수 있습니다.


## 예제

여기서 **Sphere 문제를 해결하는 PSO 알고리즘을 구현하는** 예제를 제공합니다.

### 예제의 의사 코드

다음은 의사 코드입니다:

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

그리고 알고리즘과 문제의 각 부분이 EvoX에서 어떻게 대응하는지 보여줍니다.

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

입자 군집 최적화(PSO)는 새와 물고기의 사회적 행동에서 영감을 받은 개체군 기반 메타휴리스틱 알고리즘입니다. 연속 및 이산 최적화 문제를 해결하는 데 널리 사용됩니다.

**다음은 EvoX에서의 PSO 알고리즘 구현 예제입니다:**

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
**다음은 EvoX에서의 Sphere 문제 구현 예제입니다:**

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
