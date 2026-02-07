---
title: "在 EvoX 中求解 Brax 问题"
order: 11
section: "examples"
---

# 在 EvoX 中求解 Brax 问题

EvoX 深入探索了基于 Brax 的神经进化。
这里我们将展示一个在 EvoX 中求解 Brax 问题的示例。

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

## 什么是 Brax

Brax 是一个快速且完全可微分的物理引擎，用于机器人学、人类感知、材料科学、强化学习以及其他计算密集型仿真应用的研究和开发。

这里我们将演示 Brax 的 "swimmer" 环境。

更多信息请浏览 [Brax 的 Github](https://github.com/google/brax)。

## 设计神经网络类

首先，我们需要决定要构建哪种神经网络。

这里我们将给出一个简单的多层感知机（MLP）类。

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

通过 ``SimpleMLP`` 类，我们可以初始化一个 MLP 模型。

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

### 初始化适配器

适配器可以帮助我们来回转换数据。

```python
adapter = ParamsAndVector(dummy_model=model)
```

有了适配器，我们就可以开始进行这个神经进化任务了。

## 设置运行流程

### 初始化算法和问题

我们初始化一个 [PSO 算法](#evox.algorithms.so.pso_variants.pso.PSO)，问题是 "swimmer" 环境中的 [Brax 问题](#evox.problems.neuroevolution.brax.BraxProblem)。

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

在这个例子中，我们将使用每个 episode 1000 步，3 个 episode 的平均奖励将作为适应度值返回。

### 设置监视器

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### 初始化工作流

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

### 运行工作流

运行工作流，见证奇迹！

> **注意：**
> 以下代码块大约需要 20 分钟运行。
> 具体时间取决于你的硬件配置。

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
> - 通常，你只需要 `HTML(problem.visualize(best_params))` 来渲染。上面的代码是一个变通方案，以确保结果在我们的网站上正确显示。
> - PSO 算法并非专门为此类任务优化，因此性能限制是预期的。此示例仅用于演示目的。

希望你享受使用 EvoX 求解 Brax 问题的过程，祝你玩得开心！
