---
title: "在 EvoX 中解決 Brax 問題"
order: 11
section: "examples"
---

# 在 EvoX 中解決 Brax 問題

EvoX 透過 Brax 深入探索神經演化（Neuroevolution）。
在此，我們將展示如何在 EvoX 中解決 Brax 問題的範例。

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

Brax 是一個快速且完全可微分的物理引擎，用於機器人技術、人類感知、材料科學、強化學習以及其他高度依賴模擬的應用研發。

這裡我們將演示 Brax 的 "swimmer" 環境。

如需更多資訊，您可以瀏覽 [Brax 的 Github](https://github.com/google/brax)。

## 設計神經網路類別

首先，我們需要決定要建構哪種神經網路。

這裡我們將提供一個簡單的多層感知器（MLP）類別。

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

透過 `SimpleMLP` 類別，我們可以初始化一個 MLP 模型。

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

### 初始化適配器 (Adapter)

適配器可以幫助我們進行資料的雙向轉換。

```python
adapter = ParamsAndVector(dummy_model=model)
```

有了適配器，我們就可以開始執行這項神經演化任務。

## 設定執行流程

### 初始化演算法與問題

我們初始化一個 `PSO 演算法`，問題則是 "swimmer" 環境下的 `Brax 問題`。

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

在此案例中，每個 episode 我們將使用 1000 步，並將 3 個 episode 的平均獎勵（reward）作為適應度值（fitness value）返回。

### 設定監控器 (Monitor)

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### 初始化工作流 (Workflow)

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

### 執行工作流

執行工作流，見證神奇的時刻！

> **注意：**
> 以下程式碼區塊大約需要 20 分鐘執行。
> 具體時間可能因您的硬體設備而異。

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
> - 通常，您只需要 `HTML(problem.visualize(best_params))` 即可進行渲染。上述程式碼是一種變通方法，以確保結果能正確顯示在我們的網站上。
> - PSO 演算法並未針對此類任務進行特別最佳化，因此預期會有性能限制。此範例僅供演示之用。

我們希望您享受使用 EvoX 解決 Brax 問題的過程，祝您使用愉快！