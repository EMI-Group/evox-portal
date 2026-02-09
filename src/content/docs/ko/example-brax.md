---
title: "EvoX에서 Brax 문제 해결하기"
order: 11
section: "examples"
---

# EvoX에서 Brax 문제 해결하기

EvoX는 Brax를 통해 신경진화(neuroevolution)를 깊이 있게 다룹니다.
여기서는 EvoX에서 Brax 문제를 해결하는 예제를 보여드리겠습니다.

```python
# install EvoX and Brax, skip it if you have already installed EvoX or Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# The dependent packages or functions in this example
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## Brax란 무엇인가요?

Brax는 로봇 공학, 인간 지각, 재료 과학, 강화 학습 및 기타 시뮬레이션 집약적 애플리케이션의 연구 개발에 사용되는 빠르고 완전히 미분 가능한 물리 엔진입니다.

여기서는 Brax의 "swimmer" 환경을 시연해 보겠습니다.

더 자세한 정보는 [Brax Github](https://github.com/google/brax)에서 확인할 수 있습니다.

## 신경망 클래스 설계

먼저, 어떤 신경망을 구축할지 결정해야 합니다.

여기서는 간단한 다층 퍼셉트론(MLP) 클래스를 제시하겠습니다.

```python
# Construct an MLP using PyTorch.
# This MLP has 3 layers.


class SimpleMLP(nn.Module):
    def __init__(self):
        super(SimpleMLP, self).__init__()
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)
```

## 모델 초기화

`SimpleMLP` 클래스를 통해 MLP 모델을 초기화할 수 있습니다.

```python
# Make sure that the model is on the same device, better to be on the GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Reset the random seed
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Initialize the MLP model
model = SimpleMLP().to(device)
```

### Adapter 초기화

Adapter는 데이터를 상호 변환하는 데 도움을 줍니다.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Adapter를 사용하여 이 신경진화(Neuroevolution) 작업을 시작할 수 있습니다.

## 실행 프로세스 설정

### 알고리즘 및 문제 초기화

[PSO 알고리즘](#evox.algorithms.so.pso_variants.pso.PSO)을 초기화하고, 문제는 "swimmer" 환경의 [Brax 문제](#evox.problems.neuroevolution.brax.BraxProblem)로 설정합니다.

```python
# Set the population size
POP_SIZE = 1024

# Get the bound of the PSO algorithm
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Initialize the PSO, and you can also use any other algorithms
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Initialize the Brax problem
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
    device=device,
)
```

이 경우, 각 에피소드마다 1000 스텝을 사용하며, 3개 에피소드의 평균 보상이 적합도(fitness) 값으로 반환됩니다.

### Monitor 설정

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Workflow 초기화

```python
# Initiate an workflow
workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
    device=device,
)
```

### Workflow 실행

Workflow를 실행하고 마법 같은 결과를 확인해 보세요!

> **참고:**
> 다음 블록을 실행하는 데 약 20분이 소요됩니다.
> 하드웨어 사양에 따라 소요 시간은 달라질 수 있습니다.

```python
# Set the maximum number of generations
max_generation = 50

# Run the workflow
workflow.init_step()
compiled_step = torch.compile(workflow.step)
for i in range(max_generation):
    if i % 10 == 0:
        print(f"Generation {i}")
    compiled_step()

print(f"Top fitness: {monitor.get_best_fitness()}")
best_params = adapter.to_params(monitor.get_best_solution())
print(f"Best params: {best_params}")
```

```python
monitor.get_best_fitness()
```

```python
monitor.plot()
```

```python
html_string = problem.visualize(best_params)
escaped_string = html_string.replace('"', "&quot;")
HTML(f'<iframe srcdoc="{escaped_string}" width="100%" height="480" frameborder="0"></iframe>')
```

> **중요:**
> - 일반적으로 렌더링하려면 `HTML(problem.visualize(best_params))`만 있으면 됩니다. 위의 코드는 웹사이트에서 결과가 올바르게 표시되도록 하기 위한 임시 방편입니다.
> - PSO 알고리즘은 이러한 유형의 작업에 특별히 최적화되지 않았으므로 성능상의 한계가 있을 수 있습니다. 이 예제는 데모 목적으로 제공됩니다.

EvoX로 Brax 문제를 해결하며 즐거운 시간을 보내시길 바랍니다!