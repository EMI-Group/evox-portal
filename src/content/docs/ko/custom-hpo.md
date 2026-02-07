---
title: "사용자 정의 알고리즘으로 HPO 배포"
order: 6
section: "developer"
---

# 사용자 정의 알고리즘으로 HPO 배포

이 장에서는 사용자 정의 알고리즘으로 HPO를 배포하는 데 초점을 맞추며, 전체 워크플로우보다는 세부 사항을 강조합니다. HPO 배포에 대한 간략한 소개는 [튜토리얼](#/tutorial/tutorial_part7)에서 제공되며, 사전 읽기를 강력히 권장합니다.

## 알고리즘을 병렬화 가능하게 만들기

내부 알고리즘을 문제로 변환해야 하므로 내부 알고리즘이 병렬화 가능한 것이 중요합니다. 따라서 알고리즘에 일부 수정이 필요할 수 있습니다.

1. 알고리즘은 알고리즘 자체의 속성에 대한 인플레이스 연산이 있는 메서드가 없어야 합니다.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. 코드 로직이 Python 제어 흐름에 의존하지 않아야 합니다.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #attribute of the algorithm itself
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # function with python control flow
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # function without python control flow
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```
## HPOMonitor 활용

HPO 작업에서는 `HPOMonitor`를 사용하여 각 내부 알고리즘의 지표를 추적해야 합니다. `HPOMonitor`는 표준 `monitor`에 비해 `tell_fitness`라는 하나의 메서드만 추가합니다. 이 추가는 HPO 작업이 종종 다차원적이고 복잡한 지표를 포함하므로 지표 평가에 더 큰 유연성을 제공하기 위해 설계되었습니다.

사용자는 `HPOMonitor`의 하위 클래스를 만들고 `tell_fitness` 메서드를 오버라이드하여 사용자 정의 평가 지표를 정의하기만 하면 됩니다.

또한 다목적 문제에 대한 'IGD' 및 'HV' 지표 계산과 단일 목적 문제에 대한 최소값을 지원하는 간단한 `HPOFitnessMonitor`도 제공합니다.

## 간단한 예제

여기서는 EvoX로 HPO를 사용하는 간단한 예제를 보여줍니다. `PSO` 알고리즘을 사용하여 sphere 문제를 해결하기 위한 기본 알고리즘의 최적 하이퍼파라미터를 탐색합니다.

먼저 필요한 모듈을 임포트합니다.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

다음으로 간단한 sphere 문제를 정의합니다. 이것은 일반적인 `problems`와 차이가 없습니다.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

다음으로 알고리즘을 정의합니다. `torch.cond` 함수를 사용하고 병렬화 가능하도록 합니다. 구체적으로 인플레이스 연산을 수정하고 Python 제어 흐름을 조정합니다.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # the hyperparameters to be optimized
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # one update strategy
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  #  the other update strategy
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simply random sampling
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

Python 제어 흐름을 처리하기 위해 [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html)를 사용합니다. 다음으로 `StdWorkflow`를 사용하여 `problem`, `algorithm` 및 `monitor`를 래핑할 수 있습니다. 그런 다음 `HPOProblemWrapper`를 사용하여 `StdWorkflow`를 HPO 문제로 변환합니다.

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

`HPOProblemWrapper`가 정의한 하이퍼파라미터를 올바르게 인식하는지 테스트할 수 있습니다. 7개 인스턴스에 대해 하이퍼파라미터를 수정하지 않았으므로 모든 인스턴스에서 동일해야 합니다.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

자체 하이퍼파라미터 값 세트를 지정할 수도 있습니다. 하이퍼파라미터 세트의 수가 `HPOProblemWrapper`의 인스턴스 수와 일치해야 합니다. 사용자 정의 하이퍼파라미터는 `Parameter`로 래핑된 값을 가진 딕셔너리로 제공해야 합니다.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

이제 `PSO` 알고리즘을 사용하여 `ExampleAlgorithm`의 하이퍼파라미터를 최적화합니다. `PSO`의 개체군 크기가 인스턴스 수와 일치해야 합니다. 그렇지 않으면 예기치 않은 오류가 발생할 수 있습니다. 이 경우 `HPOProblemWrapper`가 딕셔너리를 입력으로 요구하므로 외부 워크플로우에서 솔루션을 변환해야 합니다.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {"self.algorithm.hp": x}


outer_algo = PSO(7, -3 * torch.ones(4), 3 * torch.ones(4))
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow()
outer_workflow.setup(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
for _ in range(20):
    outer_workflow.step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```
