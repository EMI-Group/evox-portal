---
title: "EvoX를 활용한 효율적인 HPO"
order: 13
section: "examples"
---

# EvoX를 활용한 효율적인 HPO

이 장에서는 EvoX를 사용하여 하이퍼파라미터 최적화(HPO)를 수행하는 방법을 살펴봅니다.

HPO는 많은 머신러닝 작업에서 중요한 역할을 하지만, 때로는 처리하는 데 며칠이 걸릴 수 있는 높은 계산 비용과 배포의 어려움으로 인해 종종 간과됩니다.

EvoX를 사용하면 `HPOProblemWrapper`를 사용하여 HPO 배포를 단순화하고 `vmap` 메서드와 GPU 가속을 활용하여 효율적인 계산을 달성할 수 있습니다.

## 워크플로우를 문제로 변환

![HPO structure](/_static/HPO_structure.png)

EvoX로 HPO를 배포하는 핵심은 `HPOProblemWrapper`를 사용하여 `workflows`를 `problems`로 변환하는 것입니다. 변환되면 `workflows`를 표준 `problems`로 취급할 수 있습니다. 'HPO 문제'의 입력은 하이퍼파라미터로 구성되고, 출력은 평가 지표입니다.

## 핵심 구성 요소 -- `HPOProblemWrapper`

`HPOProblemWrapper`가 하이퍼파라미터를 인식하도록 하려면 `Parameter`를 사용하여 래핑해야 합니다. 이 간단한 단계로 하이퍼파라미터가 자동으로 식별됩니다.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## `HPOFitnessMonitor` 활용

다목적 문제에 대한 'IGD' 및 'HV' 지표 계산과 단일 목적 문제에 대한 최소값을 지원하는 `HPOFitnessMonitor`를 제공합니다.

`HPOFitnessMonitor`는 HPO 문제를 위해 설계된 기본 모니터라는 점에 유의해야 합니다. [사용자 정의 알고리즘으로 HPO 배포](#/guide/developer/custom_hpo_prob)에 설명된 접근 방식을 사용하여 유연하게 자체 사용자 정의 모니터를 만들 수도 있습니다.
## 간단한 예제

여기서는 EvoX를 사용한 HPO의 간단한 예제를 시연합니다. 구체적으로 [PSO](#PSO) 알고리즘을 사용하여 sphere 문제를 해결하기 위한 [PSO](#PSO) 알고리즘의 하이퍼파라미터를 최적화합니다.

이 장은 HPO 배포에 대한 간략한 개요만 제공합니다. 더 자세한 가이드는 [사용자 정의 알고리즘으로 HPO 배포](#/guide/developer/custom_hpo_prob)를 참조하세요.

시작하려면 필요한 모듈을 임포트합니다.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

다음으로 간단한 Sphere 문제를 정의합니다.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

다음으로 `StdWorkflow`를 사용하여 `problem`, `algorithm` 및 `monitor`를 래핑할 수 있습니다. 그런 다음 `HPOProblemWrapper`를 사용하여 `StdWorkflow`를 HPO 문제로 변환합니다.

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

`HPOProblemWrapper`는 4개의 인수를 받습니다:
1. `iterations`: 최적화 프로세스에서 실행할 반복 횟수.
2. `num_instances`: 최적화 프로세스에서 병렬로 실행할 인스턴스 수.
3. `workflow`: 최적화 프로세스에서 사용할 워크플로우.
4. `copy_init_state`: 각 평가에 대해 워크플로우의 초기 상태를 복사할지 여부. 기본값은 `True`입니다. 워크플로우에 초기 상태의 텐서를 인플레이스로 수정하는 연산이 포함된 경우 `True`로 설정해야 합니다. 그렇지 않으면 메모리를 절약하기 위해 `False`로 설정할 수 있습니다.

`HPOProblemWrapper`가 정의한 하이퍼파라미터를 올바르게 인식하는지 확인할 수 있습니다. 5개 인스턴스에 대해 하이퍼파라미터를 수정하지 않았으므로 모든 인스턴스에서 동일해야 합니다.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

사용자 정의 하이퍼파라미터 값 세트를 정의할 수도 있습니다. 하이퍼파라미터 세트의 수가 `HPOProblemWrapper`의 인스턴스 수와 일치하는지 확인하는 것이 중요합니다. 또한 사용자 정의 하이퍼파라미터는 `Parameter`를 사용하여 래핑된 값을 가진 딕셔너리로 제공해야 합니다.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

이제 [PSO](#PSO) 알고리즘을 사용하여 [PSO](#PSO) 알고리즘의 하이퍼파라미터를 최적화합니다.

[PSO](#PSO)의 개체군 크기가 인스턴스 수와 일치하는지 확인하는 것이 중요합니다. 그렇지 않으면 예기치 않은 오류가 발생할 수 있습니다.

또한 `HPOProblemWrapper`가 딕셔너리 형태의 입력을 요구하므로 외부 워크플로우에서 솔루션을 변환해야 합니다.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```
