---
title: "從 MATLAB 轉換到 PyTorch 和 EvoX"
order: 18
section: "misc"
---

# 從 MATLAB 轉換到 PyTorch 和 EvoX

本文件旨在引導 MATLAB 使用者轉換至 PyTorch 和 EvoX 進行演化計算。我們將重點介紹 MATLAB 和 PyTorch 在語法、資料結構和工作流程方面的核心差異。接著，我們將透過 MATLAB 和 PyTorch 中的粒子群最佳化 (PSO) 範例來說明這些差異。

## 語法差異

### 陣列建立與索引

#### MATLAB

- 使用從 1 開始的索引 (1-based indexing)。
- 向量和矩陣使用方括號和分號宣告（例如 `[1 2 3; 4 5 6]`）。使用 `rand()` 進行隨機初始化會回傳區間 $[0, 1)$ 內的值。
- 切片 (Slicing) 使用 `(start:end)` 語法並採用從 1 開始的索引。

#### PyTorch

- 使用從 0 開始的索引 (0-based indexing)。
- 陣列（張量）通常使用建構函式建立，如 `torch.rand()`、`torch.zeros()`，或透過 `torch.tensor()` 將 Python 列表轉換為張量。
- 切片使用 `[start:end]` 並採用從 0 開始的索引。

### 矩陣運算

#### MATLAB

- 使用 `*` 執行線性代數矩陣乘法。
- 使用 `.*` 將相同大小矩陣的對應元素相乘。
- `/` 代表矩陣右除。
- `.^` 代表逐元素 (element-wise) 次方運算。
- 長度為 1 的張量尾部和前導維度會被 **忽略**。
- 自動尋找可用於逐元素運算的廣播維度，並執行 **隱式** 維度擴展。

#### PyTorch

- 使用 `@` 或 `torch.matmul()` 執行線性代數矩陣乘法。
- 直接使用 `*` 將相同形狀或可廣播形狀的張量對應元素相乘。
- `/` 代表逐元素除法。
- `**` 代表逐元素次方運算。
- 長度為 1 的張量維度會被 **保留** 並視為 **廣播維度**。
- **阻止** 大多數隱式維度擴展，通常需要明確指定廣播維度。

### 函式與定義

#### MATLAB

- 函式由 `function` 關鍵字定義。
- 一個檔案可以包含多個函式，但通常主函式與檔案名稱相同。
- 匿名函式（例如 `@(x) sum(x.^2)`）用於簡短的行內計算。

#### PyTorch

- 函式使用 `def` 關鍵字定義，通常位於單個 `.py` 檔案或模組中。
- 類別 (Classes) 用於以物件導向的方式封裝資料和方法。
- Lambdas 作為簡短的匿名函式（`lambda x: x.sum()`），但不允許跨多行。

### 控制流程

#### MATLAB

- 使用 `for i = 1:N` ... `end` 迴圈，採用從 1 開始的索引。
- 條件陳述式如 `if`、`elseif` 和 `else`。

#### PyTorch

- 使用 `for i in range(N):`，採用從 0 開始的索引。
- 縮排對於迴圈和條件式的作用域非常重要（沒有 `end` 關鍵字）。

### 列印與註解

#### MATLAB

- 使用 `fprintf()` 函式進行格式化輸出。
- 使用 `%` 進行單行註解。

#### PyTorch

- 使用帶有 f-strings 的 `print` 進行格式化輸出。
- 使用 `#` 進行單行註解。

### 多行程式碼

#### MATLAB

- 在行尾使用 `...` 表示下一行應視為同一行。
#### Python

- 在行尾使用 `\` 表示下一行應視為同一行。
- 如果多行內容位於括號內，則不需要特定的行尾符號。

## 如何透過 EvoX 撰寫演化計算演算法？

### MATLAB

PSO 演算法的 MATLAB 程式碼範例如下：
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
在 MATLAB 中，函式 `init_pso()` 初始化演算法，獨立的函式 `step_pso()` 執行迭代步驟，而主函式 `example_pso()` 負責協調迴圈。

### EvoX
在 EvoX 中，您可以透過以下方式建構 PSO 演算法：

首先，建議從 EvoX 和 PyTorch 匯入必要的模組和函式。
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

然後，您可以根據「語法差異」一節，將 MATLAB 程式碼對應轉換為 Python 程式碼。
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
> 值得注意的是，在 MATLAB 中我們使用帶有 `;` 和 `,` 的 `[]` 來沿特定維度串接矩陣和向量；然而在 EvoX 中，必須呼叫帶有參數 `dim` 的 `torch.cat` 來指定串接維度。
> 此外，在 PyTorch 中，要串接的張量必須具有相同的維度數量；因此，需要應用額外的 `XXX.unsqueeze(0)` 在第一個維度之前增加一個長度為 1 的新維度。

在 EvoX 中，PSO 邏輯封裝在繼承自 `Algorithm` 的類別內。這種物件導向設計簡化了狀態管理和迭代，並帶來以下優勢：
- 繼承的 `evaluate()` 方法
    您可以直接呼叫 `self.evaluate(self.population)` 來計算適應度值，而無需在每次迭代中手動傳遞目標函式。
- 內建工作流程整合
    當您將 PSO 類別註冊到工作流程 `StdWorkflow` 時，它會代您處理對 `step()` 的迭代呼叫。

透過繼承 `Algorithm`，`__init__()` 會在標準 Python 類別建構函式中設定所有主要的 PSO 元件（族群、速度、區域/全域最佳解等）。