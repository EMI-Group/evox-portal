---
title: "在 EvoX 中求解 Brax 問題"
order: 11
section: "examples"
---

# 在 EvoX 中求解 Brax 問題

EvoX 深入探索了結合 Brax 的神經演化。
這裡我們將展示一個在 EvoX 中求解 Brax 問題的範例。

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

## 什麼是 Brax

Brax 是一個快速且完全可微分的物理引擎，用於機器人學、人類感知、材料科學、強化學習和其他模擬密集型應用的研究和開發。

這裡我們將展示 Brax 的「swimmer」環境。

更多資訊，您可以瀏覽 [Brax 的 Github](https://github.com/google/brax)。

## 設計神經網路類別

首先，我們需要決定要建構哪種神經網路。

這裡我們將給出一個簡單的多層感知器（MLP）類別。

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

## 初始化模型

透過 ``SimpleMLP`` 類別，我們可以初始化一個 MLP 模型。

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

### 初始化轉接器

轉接器可以幫助我們來回轉換資料。

```python
adapter = ParamsAndVector(dummy_model=model)
```

有了轉接器，我們就可以開始進行這個神經演化任務了。

## 設定執行流程

### 初始化演算法和問題

我們初始化一個 [PSO 演算法](#evox.algorithms.so.pso_variants.pso.PSO)，問題是「swimmer」環境中的 [Brax 問題](#evox.problems.neuroevolution.brax.BraxProblem)。

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

在這種情況下，我們將使用每個回合 1000 步，3 個回合的平均獎勵將作為適應度值返回。

### 設定監控器

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### 初始化工作流程

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

### 執行工作流程

執行工作流程，見證奇蹟！

> **注意：**
> 以下區塊大約需要 20 分鐘執行。
> 時間可能因您的硬體而異。

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

> **重要：**
> - 通常，您只需要 `HTML(problem.visualize(best_params))` 來渲染。上面的程式碼是一個變通方法，以確保結果在我們的網站上正確顯示。
> - PSO 演算法並非專門針對此類任務進行最佳化，因此效能限制是預期的。此範例僅用於演示目的。

我們希望您享受使用 EvoX 求解 Brax 問題的樂趣！
