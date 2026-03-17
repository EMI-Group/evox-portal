---
title: "EvoX를 활용한 효율적인 HPO"
order: 13
section: "examples"
---

# EvoX를 활용한 효율적인 HPO

이 장에서는 EvoX를 사용하여 하이퍼파라미터 최적화(HPO)를 수행하는 방법을 알아보겠습니다.

HPO는 많은 머신 러닝 작업에서 중요한 역할을 하지만, 높은 계산 비용으로 인해 처리하는 데 며칠이 걸리기도 하고 배포 과정의 어려움 때문에 종종 간과되곤 합니다.

EvoX를 사용하면 `HPOProblemWrapper`를 통해 HPO 배포를 간소화하고, `vmap` 메서드와 GPU 가속을 활용하여 효율적인 계산을 달성할 수 있습니다.

## Workflow를 Problem으로 변환하기

![HPO structure](/_static/HPO_structure.png)

EvoX로 HPO를 배포하는 핵심은 `HPOProblemWrapper`를 사용하여 `workflows`를 `problems`로 변환하는 것입니다. 변환된 후에는 `workflows`를 일반적인 `problems`처럼 다룰 수 있습니다. 'HPO problem'의 입력은 하이퍼파라미터로 구성되며, 출력은 평가 지표(evaluation metrics)입니다.

## 핵심 구성 요소 -- `HPOProblemWrapper`

`HPOProblemWrapper`가 하이퍼파라미터를 인식할 수 있도록 하려면 `Parameter`를 사용하여 감싸주어야 합니다. 이 간단한 단계만 거치면 하이퍼파라미터가 자동으로 식별됩니다.

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

## `HPOFitnessMonitor` 활용하기

다목적 문제(multi-objective problems)를 위한 'IGD' 및 'HV' 지표 계산과 단일 목적 문제(single-objective problems)를 위한 최소값 계산을 지원하는 `HPOFitnessMonitor`를 제공합니다.

`HPOFitnessMonitor`는 HPO 문제를 위해 설계된 기본적인 모니터라는 점을 유의해야 합니다. [사용자 정의 알고리즘으로 HPO 배포하기](../custom-hpo)에 설명된 방법을 사용하여 유연하게 자신만의 맞춤형 모니터를 만들 수도 있습니다.

## 간단한 예제

여기서는 EvoX를 HPO에 사용하는 간단한 예제를 보여드리겠습니다. 구체적으로, Sphere 문제를 해결하기 위한 `PSO` 알고리즘의 하이퍼파라미터를 최적화하기 위해 또 다른 `PSO` 알고리즘을 사용할 것입니다.

이 장에서는 HPO 배포에 대한 간략한 개요만 제공한다는 점을 참고해 주세요. 더 자세한 가이드는 [사용자 정의 알고리즘으로 HPO 배포하기](../custom-hpo)를 참조하시기 바랍니다.

먼저 필요한 모듈을 가져오겠습니다.

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

그다음 `StdWorkflow`를 사용하여 `problem`, `algorithm`, `monitor`를 감쌉니다. 그리고 `HPOProblemWrapper`를 사용하여 `StdWorkflow`를 HPO 문제로 변환합니다.

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

`HPOProblemWrapper`는 4개의 인자를 받습니다:
1. `iterations`: 최적화 과정에서 실행할 반복 횟수입니다.
2. `num_instances`: 최적화 과정에서 병렬로 실행할 인스턴스 수입니다.
3. `workflow`: 최적화 과정에서 사용할 워크플로우입니다.
4. `copy_init_state`: 각 평가마다 워크플로우의 초기 상태를 복사할지 여부입니다. 기본값은 `True`입니다. 워크플로우에 초기 상태의 텐서를 제자리(IN-PLACE)에서 수정하는 작업이 포함된 경우, 이 값을 `True`로 설정해야 합니다. 그렇지 않은 경우 `False`로 설정하여 메모리를 절약할 수 있습니다.

`HPOProblemWrapper`가 우리가 정의한 하이퍼파라미터를 올바르게 인식하는지 확인할 수 있습니다. 5개의 인스턴스 전체에서 하이퍼파라미터에 대한 수정이 이루어지지 않았으므로, 모든 인스턴스에서 동일하게 유지되어야 합니다.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

사용자 정의 하이퍼파라미터 값 세트를 정의할 수도 있습니다. 하이퍼파라미터 세트의 수가 `HPOProblemWrapper`의 인스턴스 수와 일치하는지 확인하는 것이 중요합니다. 또한, 사용자 정의 하이퍼파라미터는 값이 `Parameter`로 감싸진 딕셔너리 형태로 제공되어야 합니다.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

이제 `PSO` 알고리즘을 사용하여 `PSO` 알고리즘의 하이퍼파라미터를 최적화합니다.

`PSO`의 개체군 크기(population size)가 인스턴스 수와 일치하는지 확인하는 것이 중요합니다. 그렇지 않으면 예상치 못한 오류가 발생할 수 있습니다.

또한 `HPOProblemWrapper`는 입력이 딕셔너리 형태여야 하므로, 외부 워크플로우(outer workflow)에서 솔루션을 변환해야 합니다.

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