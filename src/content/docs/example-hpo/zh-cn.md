---
title: "使用 EvoX 进行高效 HPO"
order: 13
section: "examples"
---

# 使用 EvoX 进行高效 HPO

在本章中，我们将探讨如何使用 EvoX 进行超参数优化（HPO）。

HPO 在许多机器学习任务中起着至关重要的作用，但由于其高昂的计算成本（有时需要数天才能处理完）以及部署方面的挑战，往往被忽视。

通过 EvoX，我们可以使用 `HPOProblemWrapper` 简化 HPO 部署，并利用 `vmap` 方法和 GPU 加速实现高效计算。

## 将工作流转换为问题

![HPO 结构](/_static/HPO_structure.png)

使用 EvoX 部署 HPO 的关键在于使用 `HPOProblemWrapper` 将 `workflows` 转换为 `problems`。转换完成后，我们可以将 `workflows` 视为标准的 `problems`。‘HPO 问题’的输入由超参数组成，输出则是评估指标。

## 核心组件 —— `HPOProblemWrapper`

为了确保 `HPOProblemWrapper` 能够识别超参数，我们需要使用 `Parameter` 对其进行封装。通过这一简单的步骤，超参数将被自动识别。

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

## 使用 `HPOFitnessMonitor`

我们提供了一个 `HPOFitnessMonitor`，支持计算多目标问题的 'IGD' 和 'HV' 指标，以及单目标问题的最小值。

需要注意的是，`HPOFitnessMonitor` 是一个为 HPO 问题设计的基础监控器。您也可以参考 [使用自定义算法部署 HPO](/zh-cn/docs/custom-hpo) 中概述的方法，灵活地创建自定义监控器。

## 一个简单的例子

在这里，我们将演示一个使用 EvoX 进行 HPO 的简单示例。具体来说，我们将使用 `PSO` 算法来优化用于求解 Sphere 问题的 `PSO` 算法的超参数。

请注意，本章仅提供 HPO 部署的简要概述。有关更详细的指南，请参阅 [使用自定义算法部署 HPO](/zh-cn/docs/custom-hpo)。

首先，让我们导入必要的模块。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

接下来，我们定义一个简单的 Sphere 问题。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

接下来，我们可以使用 `StdWorkflow` 来封装 `problem`、`algorithm` 和 `monitor`。然后，我们使用 `HPOProblemWrapper` 将 `StdWorkflow` 转换为 HPO 问题。

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

`HPOProblemWrapper` 接受 4 个参数：
1. `iterations`：优化过程中执行的迭代次数。
2. `num_instances`：优化过程中并行执行的实例数量。
3. `workflow`：优化过程中使用的工作流。
4. `copy_init_state`：是否为每次评估复制工作流的初始状态。默认为 `True`。如果您的工作流包含对初始状态中的张量进行原位（IN-PLACE）修改的操作，则应将其设置为 `True`。否则，您可以将其设置为 `False` 以节省内存。

我们可以验证 `HPOProblemWrapper` 是否正确识别了我们定义的超参数。由于 5 个实例的超参数未做任何修改，因此所有实例的超参数应保持一致。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

我们还可以定义一组自定义的超参数值。务必确保超参数组的数量与 `HPOProblemWrapper` 中的实例数量相匹配。此外，自定义超参数必须以字典形式提供，且其值需使用 `Parameter` 进行封装。

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

现在，我们使用 `PSO` 算法来优化 `PSO` 算法的超参数。

务必确保 `PSO` 的种群大小与实例数量相匹配，否则可能会发生意外错误。

此外，解需要在外部工作流中进行转换，因为 `HPOProblemWrapper` 要求输入必须是字典形式。

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