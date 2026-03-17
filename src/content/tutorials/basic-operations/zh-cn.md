---
title: "3. 基础操作"
order: 3
---

# 3. 基础操作

在本章中，我们将引导您运行第一个 EvoX 优化任务，包括如何**启动 EvoX** 并**初始化优化过程**，如何**配置 EvoX 项目**（选择算法和问题并进行组装），以及控制优化过程的常用**基本指令**（或方法）。通过一个简单的示例，您将学习 EvoX 的基本用法。

## 启动与初始化

验证安装完成后，您就可以开始使用 EvoX 编写优化脚本了。您可以在任何 Python 环境（如终端、Jupyter Notebook、IDE 等）中导入 EvoX。

首先，让我们导入 EvoX 及其相关模块，并初始化一个简单的优化任务。例如，我们将使用粒子群优化（PSO）算法来优化经典的 Ackley 函数。Ackley 函数是一个常见的基准测试函数，其已知全局最优解位于 \((0,0,\dots,0)\)，非常适合用于演示。
以下是一个最小化的 EvoX 示例代码，演示了如何启动并运行优化：

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

上述代码包含以下步骤：
- 首先，我们设置 PSO 算法的参数：种群大小为 50，搜索空间为 2D，范围在 [-32, 32] 之间。
- 然后，我们定义 Ackley 问题（Ackley 函数默认定义为 2D）。
- 我们创建一个标准工作流 `StdWorkflow` 来**组装**算法和问题，并传入一个监控器 `EvalMonitor` 以记录优化过程数据。
- 接下来，我们使用 `workflow.init_step()` 完成初始化过程，该方法会自动初始化种群、随机种子和其他内部状态。
- 然后，我们运行一个循环，使用 `workflow.step()` 连续执行 100 次迭代。每次调用 `step()` 时，算法都会生成新的解并评估其适应度，不断逼近最优解。
- 最后，我们使用监控器提供的 `get_min_fitness()` 方法获取迭代过程中的最佳适应度值并将其打印出来。

运行此脚本时，您将看到优化迭代的输出，例如：

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

由于我们没有在循环中显式打印中间结果，因此不会显示中间结果。但是，您可以根据最终的适应度值来判断算法是否收敛。例如，Ackley 函数的最优值为 0，如果输出接近 0，则表明 PSO 已经找到了接近全局最优的解。您还可以调用 `print(monitor.history)` 查看监控器记录的历史数据，或使用 `monitor.plot()` 绘制收敛曲线（需要 Plotly 等可视化支持）。

> **注意：**
> `StdWorkflow` 是 EvoX 提供的**标准优化流程**封装。它在内部实现了传统进化算法中的“初始化-迭代更新”逻辑，并封装了算法与问题之间的交互。对于大多数简单的应用，直接使用 `StdWorkflow` 就足够了。`EvalMonitor` 是一个监控器，实现了 `get_best_fitness()` 和 `plot()` 等方法，用于在优化过程中收集和展示性能指标。初学者可以暂时将其理解为一个记录本，记录每次迭代的最佳结果以供后续分析。

在上面的示例中，我们创建了一个 EvoX 项目的基本配置，包括选择算法、定义问题和组装工作流。通常，配置 EvoX 项目涉及以下步骤：

1.  **选择/定义优化问题**：明确您要解决什么优化问题。例如，如果您要优化数学函数，EvoX 在 `evox.problems` 模块下提供了许多**内置问题**（如 Sphere、Rastrigin、Ackley 等经典函数），您可以直接使用。如果内置问题无法涵盖您的需求，您可以自定义问题（将在后续章节介绍）。配置问题时，通常需要知道**决策变量的维度**及其**取值范围**。

2.  **选择/配置优化算法**：根据问题类型选择合适的进化算法。EvoX 在 `evox.algorithms` 下提供了丰富的算法集，包括单目标算法（如 PSO、GA、CMA-ES）和多目标算法（如 NSGA-II、RVEA）。选择算法后，通常需要设置算法参数，例如种群大小 (`pop_size`) 和特定于算法的参数（如 GA 中的交叉概率和变异概率）。大多数算法需要**变量范围**（下界 `lb` 和上界 `ub`）以及问题维度来初始化种群。如果您使用的是多目标算法，还需要指定目标数量 (`n_objs`)。EvoX 的算法通常为常用超参数提供默认值，但初学者应考虑根据任务调整这些参数以获得更好的性能。

3.  **组装工作流**：准备好算法和问题实例后，您需要将它们“组装”成一个工作流，代表完整的优化过程控制。在 EvoX 中，通常使用 `StdWorkflow` 来组合算法和问题。如果您想监控优化进度，可以向工作流添加监控器（如 `EvalMonitor`）。监控器不是必须的，但在调试和分析过程中非常有帮助。组装工作流通常只需要一行代码，例如：`workflow = StdWorkflow(algo, prob, monitor)`。

4.  **初始化**：调用工作流的初始化方法以开始优化。最新版本的 EvoX 提供了一个便捷的 `StdWorkflow.init_step()` 方法，可以在一次调用中完成初始化过程。

5.  **运行迭代**：使用循环重复调用 `workflow.step()` 来推动进化过程。每次调用执行一次迭代，包括算法内部的“生成新解 -> 评估 -> 选择”等步骤。在迭代过程中，您可以使用监控器观察实时结果，例如每隔几代打印当前最佳适应度。终止条件可以根据您的需求设定——常见的包括固定代数（例如运行 100 代），或当监控指标收敛时停止（例如连续几代没有显著改善）。

6.  **获取结果**：迭代结束后，您需要从算法中提取最终结果——例如最佳解及其目标值。在 EvoX 中，这些通常通过监控器获取。例如，`EvalMonitor.get_best_fitness()` 返回最佳适应度值。要获取最佳解向量，一种方法是让问题对象在评估期间存储最佳候选解，或者使用监控器的接口。在 EvoX 的标准实现中，`EvalMonitor` 记录每一代的最佳个体和适应度，可以通过其属性访问。假设 `monitor.history` 存储了历史记录，您可以检索上一代的最佳个体。当然，您也可以跳过 `EvalMonitor`，在循环结束后直接查询算法对象——这取决于算法的实现。如果您的自定义算法实现了 `get_best()` 或在其状态中存储了最佳个体，您可以直接提取它。然而，由于 EvoX 强调纯函数和模块化，结果通常通过监控模块访问。

遵循这些步骤，您可以清晰地构建优化任务代码。对于初学者来说，理解**算法-问题-工作流**三者如何协同工作非常重要：算法负责生成和改进解，问题负责评估解的质量，而工作流将它们连接成一个迭代循环。

接下来，我们将介绍 EvoX 中可用的一些基本指令和函数调用，以帮助您加深对优化过程的理解。

## 基本指令概览

在使用 EvoX 时，有一些**常用的方法和函数**充当“指令”，您需要熟悉它们：

### 工作流相关方法

- **`StdWorkflow.init_step()`**：初始化。这是启动优化过程的快速入门指令，通常在脚本开头使用。它调用算法和问题的初始化逻辑，生成初始种群并评估适应度。此后，工作流包含初始状态并准备好进行迭代。

- **`StdWorkflow.step()`**：推进一步优化。每次调用都会让算法根据当前种群状态生成新的候选解，对其进行评估，并选择下一代。用户通常在循环中多次调用此方法。`step()` 函数通常不返回任何内容（内部状态在工作流中更新），尽管旧版本可能会返回新状态。对于初学者，您只需调用它而无需担心返回值。

### 监控器相关方法

以 `EvalMonitor` 为例，常用方法包括：

- `EvalMonitor.get_best_fitness()`：返回记录的最低适应度（对于最小化问题）或最高适应度（对于最大化问题；监控器通常会对此进行区分）。用于了解当前最佳结果。
- `EvalMonitor.get_history()` 或 `monitor.history`：检索完整历史记录，例如每一代的最佳值。用于分析收敛趋势。
- `EvalMonitor.plot()`：绘制收敛或性能曲线；需要图形环境或 Notebook。监控器通常使用 Plotly 渲染图表，帮助您直观地评估算法性能。
  在内部，监控器记录每一代的评估次数及其结果——您通常不需要干预，只需在需要时提取数据即可。

### 算法相关方法

- `Algorithm.__init__()` 方法：算法的初始化方法。变量通常使用 `evox.core.Mutable()` 包装，超参数使用 `evox.core.Parameter()` 包装。

- `Algorithm.step()` 方法：在特定场景下或使用自定义算法/问题时，您可能会直接调用算法的 `step()` 方法，该方法通常封装了算法的整个迭代逻辑。

- `Algorithm.init_step()` 方法：`init_step()` 方法包含算法的第一次迭代。如果没有重写，它只是简单地调用 `step()` 方法。对于典型情况，第一次迭代与其他迭代没有区别，因此许多算法可能不需要自定义 `init_step()`。但是对于涉及超参数调整的算法，您可能需要在此处更新超参数或相关变量。

### 设备与并行控制

- `.to(device)` 方法：如果您需要在程序中切换计算设备，请使用 PyTorch 的 `.to(device)` 方法将张量 (`torch.Tensor`) 移动到 GPU/CPU（某些 PyTorch 方法如 `torch.randn` 也需要指定设备）。通常，如果您使用 `torch.set_default_device()` 将设备设置为 `cuda:0`（假设您的系统支持，并且 EvoX 及其依赖项已正确安装——可通过 `torch.cuda.is_available()` 验证），大多数 EvoX 高性能并行计算将自动在 GPU 上运行。编写自定义算法、问题或监控器时，如果您创建新张量或使用对设备敏感的 PyTorch 方法，建议显式指定 `device` 为 `cuda:0` 或使用 `torch.get_default_device()`，以避免因计算分散在不同设备上而导致的性能下降。

对于初学者来说，上述方法足以处理典型的优化任务。简而言之：**初始化问题/算法 – 设置监控器 – 组装工作流 – 运行并获取结果** 是最常见的 EvoX 工作流程。掌握这些内容，您就可以使用 EvoX 处理基本的优化任务。

在进入下一章之前，尝试修改示例：将 PSO 切换为其他算法，将 Ackley 函数替换为其他测试函数，或使用监控器提取更多信息——这将帮助您体会配置 EvoX 项目的灵活性。