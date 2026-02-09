---
title: "사용자 정의 알고리즘 및 문제"
order: 14
section: "examples"
---

# 사용자 정의 알고리즘 및 문제
이 노트북에서는 `Algorithm`과 `Problem`을 사용하여 사용자 정의 알고리즘과 문제를 만드는 방법을 보여줍니다. 여기서는 **Sphere 문제를 해결하는 PSO 알고리즘을 구현하는** 예제를 제공합니다.


```python
import torch

from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.utils import clamp
from evox.workflows import EvalMonitor, StdWorkflow
```

## 알고리즘 예제: PSO 알고리즘

Particle Swarm Optimization (PSO)은 새와 물고기의 사회적 행동에서 영감을 받은 개체군 기반 메타휴리스틱 알고리즘입니다. 이 알고리즘은 연속 및 이산 최적화 문제를 해결하는 데 널리 사용됩니다.

**다음은 EvoX에서의 PSO 알고리즘 구현 예제입니다:**

```python
def min_by(
    values,
    keys,
):
    """A helper function to find the minimum value in a list of values."""
    values = torch.cat(values, dim=0)
    keys = torch.cat(keys, dim=0)
    min_index = torch.argmin(keys)
    return values[min_index[None]][0], keys[min_index[None]][0]


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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        # setup
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        pop = torch.rand(self.pop_size, self.dim, device=device)
        pop = length * pop + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        # write to self
        self.lb = lb
        self.ub = ub
        # mutable
        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop)
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
        """Perform the first step of the PSO optimization.

        See `step` for more details.
        """
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

## 문제 예제: Sphere 문제

Sphere 문제는 최적화 알고리즘을 테스트하는 데 사용되는 간단하지만 기본적인 벤치마크 최적화 문제입니다.

Sphere 함수는 다음과 같이 정의됩니다:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**다음은 EvoX에서의 Sphere 문제 구현 예제입니다:**

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

## 알고리즘을 사용하여 문제 해결하기

### 알고리즘, 문제 및 모니터 초기화

```python
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0]),
    w=0.6,
    phi_p=2.5,
    phi_g=0.8,
)
problem = Sphere()
monitor = EvalMonitor()
```

### 워크플로우 초기화 및 실행

```python
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)

for _ in range(100):
    workflow.step()
```

```python
workflow.monitor.plot()
```