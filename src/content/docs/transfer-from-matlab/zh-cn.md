---
title: "从 MATLAB 迁移到 PyTorch 和 EvoX"
order: 18
section: "misc"
---

# 从 MATLAB 迁移到 PyTorch 和 EvoX

本文档旨在指导 MATLAB 用户转向使用 PyTorch 和 EvoX 进行演化计算。我们将重点介绍 MATLAB 和 PyTorch 在语法、数据结构和工作流程方面的核心差异。然后，我们将通过 MATLAB 和 PyTorch 中的粒子群优化 (PSO) 示例来说明这些差异。

## 语法差异

### 数组创建与索引

#### MATLAB

- 使用基于 1 的索引。
- 向量和矩阵使用方括号和分号声明（例如 `[1 2 3; 4 5 6]`）。使用 `rand()` 进行随机初始化会返回区间 $[0, 1)$ 内的值。
- 切片使用 `(start:end)` 语法，并采用基于 1 的索引。

#### PyTorch

- 使用基于 0 的索引。
- 数组（张量）通常使用构造函数创建，如 `torch.rand()`、`torch.zeros()`，或使用 `torch.tensor()` 将 Python 列表转换为张量。
- 切片使用 `[start:end]`，并采用基于 0 的索引。

### 矩阵计算

#### MATLAB

- 使用 `*` 执行线性代数矩阵乘法。
- 使用 `.*` 对相同大小的矩阵进行对应元素相乘。
- `/` 代表矩阵右除。
- `.^` 代表逐元素求幂。
- 长度为 1 的张量尾部和头部维度会被**忽略**。
- 自动寻找可广播的维度进行逐元素操作，并执行**隐式**维度扩展。

#### PyTorch

- 使用 `@` 或 `torch.matmul()` 执行线性代数矩阵乘法。
- 直接使用 `*` 对相同形状或可广播形状的张量进行对应元素相乘。
- `/` 代表逐元素除法。
- `**` 代表逐元素求幂。
- 长度为 1 的张量维度会被**保留**，并被视为**广播维度**。
- **阻止**大多数隐式维度扩展，通常需要显式的广播维度。

### 函数与定义

#### MATLAB

- 函数由 `function` 关键字定义。
- 一个文件可以包含多个函数，但通常主函数与文件名相同。
- 匿名函数（例如 `@(x) sum(x.^2)`）用于简短的内联计算。

#### PyTorch

- 函数使用 `def` 关键字定义，通常在一个 `.py` 文件或模块中。
- 类用于以面向对象的方式封装数据和方法。
- Lambda 用作简短的匿名函数（`lambda x: x.sum()`），但不允许使用多行 Lambda。

### 控制流

#### MATLAB

- 使用 `for i = 1:N` ... `end` 循环，基于 1 的索引。
- 条件语句如 `if`、`elseif` 和 `else`。

#### PyTorch

- 使用 `for i in range(N):`，基于 0 的索引。
- 缩进对于循环和条件语句的作用域至关重要（没有 `end` 关键字）。

### 打印与注释

#### MATLAB

- 使用 `fprintf()` 函数进行格式化输出。
- 使用 `%` 进行单行注释。

#### PyTorch

- 使用带有 f-strings 的 `print` 进行格式化输出。
- 使用 `#` 进行单行注释。

### 多行编码

#### MATLAB

- 在行尾使用 `...` 表示下一行应被视为同一行。
#### Python

- 在行尾使用 `\` 表示下一行应被视为同一行。
- 如果多行代码位于括号内，则不需要特定的行尾符号。

## 如何通过 EvoX 编写演化计算算法？

### MATLAB

PSO 算法的 MATLAB 代码示例如下：
```matlab
function [] = example_pso()
    pso = init_pso(100, [-10, -10], [10, 10], 0.6, 2.5, 0.8);
    test_fn = @(x) (sum(x .* x, 2));
    for i = 1:20
        pso = step_pso(pso, test_fn);
        fprintf("Iteration = %d, global best = %f\n", i, pso.global_best_fitness);
    end
end


function [self] = init_pso(pop_size, lb, ub, w, phi_p, phi_g)
    self = struct();
    self.pop_size = pop_size;
    self.dim = length(lb);
    self.w = w;
    self.phi_p = phi_p;
    self.phi_g = phi_g;
    % setup
    range = ub - lb;
    population = rand(self.pop_size, self.dim);
    population = range .* population + lb;
    velocity = rand(self.pop_size, self.dim);
    velocity = 2 .* range .* velocity - range;
    self.lb = lb;
    self.ub = ub;
    % mutable
    self.population = population;
    self.velocity = velocity;
    self.local_best_location = population;
    self.local_best_fitness = Inf(self.pop_size, 1);
    self.global_best_location = population(1, :);
    self.global_best_fitness = Inf;
end


function [self] = step_pso(self, evaluate)
    % Evaluate
    fitness = evaluate(self.population);
    % Update the local best
    compare = find(self.local_best_fitness > fitness);
    self.local_best_location(compare, :) = self.population(compare, :);
    self.local_best_fitness(compare) = fitness(compare);
    % Update the global best
    values = [self.global_best_location; self.population];
    keys = [self.global_best_fitness; fitness];
    [min_val, min_index] = min(keys);
    self.global_best_location = values(min_index, :);
    self.global_best_fitness = min_val;
    % Update velocity and position
    rg = rand(self.pop_size, self.dim);
    rp = rand(self.pop_size, self.dim);
    velocity = self.w .* self.velocity ...
        + self.phi_p .* rp .* (self.local_best_location - self.population) ...
        + self.phi_g .* rg .* (self.global_best_location - self.population);
    population = self.population + velocity;
    self.population = min(max(population, self.lb), self.ub);
    self.velocity = min(max(velocity, self.lb), self.ub);
end
```
在 MATLAB 中，函数 `init_pso()` 初始化算法，单独的函数 `step_pso()` 执行迭代步骤，主函数 `example_pso()` 负责协调循环。

### EvoX
在 EvoX 中，你可以通过以下方式构建 PSO 算法：

首先，建议从 EvoX 和 PyTorch 导入必要的模块和函数。
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

然后，你可以根据“语法差异”部分将 MATLAB 代码转换为相应的 Python 代码。
```python
def main():
    pso = PSO(pop_size=10, lb=torch.tensor([-10.0, -10.0]), ub=torch.tensor([10.0, 10.0]))
    wf = StdWorkflow()
    wf.setup(algorithm=pso, problem=Sphere())
    for i in range(1, 21):
        wf.step()
        print(f"Iteration = {i}, global best = {wf.algorithm.global_best_fitness}")

@jit_class
class PSO(Algorithm):
    def __init__(self, pop_size, lb, ub, w=0.6, phi_p=2.5, phi_g=0.8):
        super().__init__()
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = w
        self.phi_p = phi_p
        self.phi_g = phi_g
        # setup
        lb = lb.unsqueeze(0)
        ub = ub.unsqueeze(0)
        range = ub - lb
        population = torch.rand(self.pop_size, self.dim)
        population = range * population + lb
        velocity = torch.rand(self.pop_size, self.dim)
        velocity = 2 * range * velocity - range
        self.lb = lb
        self.ub = ub
        # mutable
        self.population = population
        self.velocity = velocity
        self.local_best_location = population
        self.local_best_fitness = torch.full((self.pop_size,), fill_value=torch.inf)
        self.global_best_location = population[0, :]
        self.global_best_fitness = torch.tensor(torch.inf)

    def step(self):
        # Evaluate
        fitness = self.evaluate(self.population)
        # Update the local best
        compare = self.local_best_fitness > fitness
        self.local_best_location = torch.where(compare.unsqueeze(1), self.population, self.local_best_location)
        self.local_best_fitness = torch.where(compare, fitness, self.local_best_fitness)
        # Update the global best
        values = torch.cat([self.global_best_location.unsqueeze(0), self.population], dim=0)
        keys = torch.cat([self.global_best_fitness.unsqueeze(0), fitness], dim=0)
        min_index = torch.argmin(keys)
        self.global_best_location = values[min_index]
        self.global_best_fitness = keys[min_index]
        # Update velocity and position
        rg = torch.rand(self.pop_size, self.dim)
        rp = torch.rand(self.pop_size, self.dim)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)


# Run the main function
if __name__ == "__main__":
    main()
```

> **注意：**
> 值得注意的是，在 MATLAB 中我们使用带有 `;` 和 `,` 的 `[]` 来沿特定维度连接矩阵和向量；而在 EvoX 中，必须调用带有 `dim` 参数的 `torch.cat` 来指定连接维度。
> 此外，在 PyTorch 中，要连接的张量必须具有相同的维度数量；因此，需要应用额外的 `XXX.unsqueeze(0)` 在第一维之前添加一个长度为 1 的新维度。

在 EvoX 中，PSO 逻辑封装在一个继承自 `Algorithm` 的类中。这种面向对象的设计简化了状态管理和迭代，并引入了以下优势：
- 继承的 `evaluate()` 方法
    你只需调用 `self.evaluate(self.population)` 即可计算适应度值，而无需在每次迭代中手动传递目标函数。
- 内置工作流集成
    当你将 PSO 类注册到工作流 `StdWorkflow` 时，它会代你处理对 `step()` 的迭代调用。

通过扩展 `Algorithm`，`__init__()` 在标准的 Python 类构造函数中设置所有主要的 PSO 组件（种群、速度、局部/全局最优等）。