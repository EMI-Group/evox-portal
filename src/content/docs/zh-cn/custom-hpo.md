---
title: "使用自定义算法部署 HPO"
order: 6
section: "developer"
---

# 使用自定义算法部署 HPO

在本章中，我们将重点介绍如何使用自定义算法部署 HPO，着重于细节而非整体工作流程。关于 HPO 部署的简要介绍已在 [教程](#/tutorial/tutorial_part7) 中提供，强烈建议您先阅读该教程。

## 使算法可并行化

由于我们需要将内部算法转换为问题，因此内部算法必须是可并行化的，这一点至关重要。因此，可能需要对算法进行一些修改。

1. 算法不应包含对其自身属性进行原地（in-place）操作的方法。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. 代码逻辑不依赖于 Python 控制流。

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


## 使用 HPOMonitor

在 HPO 任务中，我们应该使用 `HPOMonitor` 来跟踪每个内部算法的指标。与标准 `monitor` 相比，`HPOMonitor` 仅增加了一个方法 `tell_fitness`。这一新增功能旨在为评估指标提供更大的灵活性，因为 HPO 任务通常涉及多维且复杂的指标。

用户只需创建一个 `HPOMonitor` 的子类并重写 `tell_fitness` 方法，即可定义自定义评估指标。

我们还提供了一个简单的 `HPOFitnessMonitor`，它支持计算多目标问题的 'IGD' 和 'HV' 指标，以及单目标问题的最小值。

## 一个简单的示例

在这里，我们将展示一个如何使用 EvoX 进行 HPO 的简单示例。我们将使用 `PSO` 算法来搜索一个基础算法的最佳超参数，以解决 Sphere 问题。

首先，让我们导入必要的模块。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

接下来，我们定义一个简单的 Sphere 问题。请注意，这与普通的 `problems` 没有区别。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

接下来，我们定义算法，我们使用 `torch.cond` 函数并确保它是可并行化的。具体来说，我们修改了原地操作并调整了 Python 控制流。

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

为了处理 Python 控制流，我们使用 [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html)，接下来，我们可以使用 `StdWorkflow` 来封装 `problem`、`algorithm` 和 `monitor`。然后我们使用 `HPOProblemWrapper` 将 `StdWorkflow` 转换为 HPO 问题。

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

我们可以测试 `HPOProblemWrapper` 是否正确识别了我们定义的超参数。由于我们没有对这 7 个实例的超参数进行任何修改，因此它们在所有实例中应该都是相同的。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

我们也可以指定自己的一组超参数值。请注意，超参数组的数量必须与 `HPOProblemWrapper` 中的实例数量相匹配。自定义超参数应以字典形式提供，其值需封装在 `Parameter` 中。

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

现在，我们使用 `PSO` 算法来优化 `ExampleAlgorithm` 的超参数。请注意，`PSO` 的种群大小必须与实例数量相匹配；否则，可能会发生意外错误。在这种情况下，我们需要在外部工作流中转换解，因为 `HPOProblemWrapper` 需要字典作为输入。

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