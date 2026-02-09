---
title: "3. 基礎操作"
order: 3
---

# 3. 基礎操作

在本章中，我們將引導您執行第一個 EvoX 優化任務，包括如何 **啟動 EvoX** 和 **初始化優化過程**，如何 **配置 EvoX 專案**（選擇演算法和問題並將其組裝），以及控制優化過程的常用 **基本指令**（或方法）。透過一個簡單的範例，您將學習 EvoX 的基本用法。

## 啟動與初始化

驗證安裝後，即可開始使用 EvoX 編寫優化腳本。您可以在任何 Python 環境（如終端機、Jupyter Notebook、IDE 等）中匯入 EvoX。

首先，讓我們匯入 EvoX 及其相關模組，並初始化一個簡單的優化任務。例如，我們將使用粒子群優化 (PSO) 演算法來優化經典的 Ackley 函數。Ackley 函數是一個常見的基準測試函數，已知其全域最佳解位於 $(0,0,\dots,0)$，非常適合作為示範。
以下是一個極簡的 EvoX 範例程式碼，展示如何啟動並執行優化：

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

上述程式碼包含以下步驟：
- 首先，我們設定 PSO 演算法的參數：族群大小為 50，搜尋空間為 2D，範圍在 [-32, 32]。
- 然後，我們定義 Ackley 問題（Ackley 函數預設定義為 2D）。
- 我們建立一個標準工作流 `StdWorkflow`，將演算法和問題 **組裝** 起來，並傳入一個監控器 `EvalMonitor` 來記錄優化過程數據。
- 接著，我們使用 `workflow.init_step()` 完成初始化過程，這會自動初始化族群、隨機亂數種子和其他內部狀態。
- 然後，我們執行一個迴圈，使用 `workflow.step()` 連續執行 100 次迭代。每次呼叫 `step()` 時，演算法都會生成新的解並評估其適應度，不斷逼近最佳解。
- 最後，我們使用監控器提供的 `get_min_fitness()` 方法獲取迭代過程中的最佳適應度值並將其印出。

當您執行此腳本時，您將看到優化迭代的輸出，例如：

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

由於我們沒有在迴圈中顯式印出中間結果，因此不會顯示中間結果。但是，您可以根據最終的適應度值判斷演算法是否收斂。例如，Ackley 函數的最佳值為 0，如果輸出接近 0，則表示 PSO 已經找到了接近全域最佳解的解。您也可以呼叫 `print(monitor.history)` 查看監控器記錄的歷史數據，或使用 `monitor.plot()` 繪製收斂曲線（需要 Plotly 等視覺化支援）。

> **注意：**
> `StdWorkflow` 是 EvoX 提供的 **標準優化流程** 封裝。它在內部實作了傳統演化演算法中的「初始化-迭代更新」邏輯，並封裝了演算法與問題之間的互動。對於大多數簡單的應用，直接使用 `StdWorkflow` 就足夠了。`EvalMonitor` 是一個監控器，實作了 `get_best_fitness()` 和 `plot()` 等方法，用於在優化過程中收集和顯示效能指標。初學者可以暫時將其理解為一本記錄簿，記錄每次迭代的最佳結果以供後續分析。

在上面的範例中，我們建立了一個 EvoX 專案的基本配置，包括選擇演算法、定義問題和組裝工作流。一般來說，配置 EvoX 專案涉及以下步驟：

1.  **選擇/定義優化問題**：釐清您要解決什麼優化問題。例如，如果您要優化數學函數，EvoX 在 `evox.problems` 模組下提供了許多 **內建問題**（例如 Sphere、Rastrigin、Ackley 等經典函數），您可以直接使用。如果內建問題未涵蓋您的需求，您可以自行定義（將在後續章節介紹）。配置問題時，通常需要知道 **決策變數的維度** 及其 **數值範圍**。

2.  **選擇/配置優化演算法**：根據問題類型選擇合適的演化演算法。EvoX 在 `evox.algorithms` 下提供了豐富的演算法集，包括單目標演算法（如 PSO、GA、CMA-ES）和多目標演算法（如 NSGA-II、RVEA）。選擇演算法後，通常需要設定演算法參數，例如族群大小 (`pop_size`) 和特定演算法參數（如 GA 中的交配機率和突變機率）。大多數演算法需要 **變數範圍**（下界 `lb` 和上界 `ub`）和問題維度來初始化族群。如果您使用的是多目標演算法，還需要指定目標數量 (`n_objs`)。EvoX 的演算法通常為常見超參數提供預設值，但初學者應考慮根據任務調整這些參數以獲得更好的效能。

3.  **組裝工作流**：準備好演算法和問題實例後，您需要將它們「組裝」成一個工作流，代表完整的優化過程控制。在 EvoX 中，通常使用 `StdWorkflow` 來結合演算法和問題。如果您想監控優化進度，可以向工作流添加監控器（如 `EvalMonitor`）。監控器不是必須的，但在除錯和分析時非常有幫助。組裝工作流通常只需要一行程式碼，例如：`workflow = StdWorkflow(algo, prob, monitor)`。

4.  **初始化**：呼叫工作流的初始化方法開始優化。最新版本的 EvoX 提供了一個方便的 `StdWorkflow.init_step()` 方法，可以在一次呼叫中完成初始化過程。

5.  **執行迭代**：使用迴圈重複呼叫 `workflow.step()` 來推動演化過程。每次呼叫執行一次迭代，包括演算法內部的「生成新解 -> 評估 -> 選擇」等步驟。在迭代期間，您可以使用監控器觀察即時結果，例如每隔幾代印出當前最佳適應度。可以根據需求設定終止條件——常見的包括固定代數（例如執行 100 代），或當監控指標收斂時停止（例如連續幾代沒有顯著改善）。

6.  **獲取結果**：迭代結束後，您需要從演算法中提取最終結果——例如最佳解及其目標值。在 EvoX 中，這些通常透過監控器獲取。例如，`EvalMonitor.get_best_fitness()` 返回最佳適應度值。要獲取最佳解向量，一種方法是讓問題物件在評估期間儲存最佳候選解，或使用監控器的介面。在 EvoX 的標準實作中，`EvalMonitor` 記錄每一代的最佳個體和適應度，可透過其屬性存取。假設 `monitor.history` 儲存了歷史記錄，您可以檢索上一代的最佳個體。當然，您也可以跳過 `EvalMonitor`，在迴圈後直接查詢演算法物件——這取決於演算法的實作。如果您的自訂演算法實作了 `get_best()` 或在其狀態中儲存了最佳個體，您可以直接提取它。然而，由於 EvoX 強調純函數和模組化，結果通常透過監控模組存取。

透過遵循這些步驟，您可以清晰地建構您的優化任務程式碼。對於初學者來說，重要的是理解 **演算法-問題-工作流** 三者如何協同工作：演算法負責生成和改進解，問題評估其品質，工作流將它們連接成一個迭代迴圈。

接下來，我們將介紹 EvoX 中可用的一些基本指令和函數呼叫，以幫助您加深對優化過程的理解。

## 基本指令概覽

使用 EvoX 時，有一些 **常用的方法和函數** 充當「指令」，您需要熟悉它們：

### 工作流相關方法

- **`StdWorkflow.init_step()`**：初始化。這是啟動優化過程的快速入門指令，通常在腳本開頭使用。它呼叫演算法和問題的初始化邏輯，生成初始族群並評估適應度。此後，工作流包含初始狀態並準備好進行迭代。

- **`StdWorkflow.step()`**：推進優化一步。每次呼叫都會讓演算法根據當前族群狀態生成新的候選解，對其進行評估，並選擇下一代。使用者通常在迴圈內多次呼叫此方法。`step()` 函數通常不返回任何內容（內部狀態在工作流內更新），儘管舊版本可能會返回新狀態。對於初學者，您只需呼叫它而無需擔心返回值。

### 監控器相關方法

以 `EvalMonitor` 為例，常用方法包括：

- `EvalMonitor.get_best_fitness()`：返回記錄到的最低適應度（對於最小化問題）或最高適應度（對於最大化問題；監控器通常會區分這一點）。對於了解當前最佳結果很有用。
- `EvalMonitor.get_history()` 或 `monitor.history`：檢索完整歷史記錄，例如每一代的最佳值。對於分析收斂趨勢很有用。
- `EvalMonitor.plot()`：繪製收斂或效能曲線；需要圖形環境或 Notebook。監控器通常使用 Plotly 渲染圖表，幫助您直觀地評估演算法效能。
  在內部，監控器記錄每一代的評估次數及其結果——您通常不需要干預，只需在需要時提取數據。

### 演算法相關方法

- `Algorithm.__init__()` 方法：演算法的初始化方法。變數通常使用 `evox.core.Mutable()` 包裝，超參數使用 `evox.core.Parameter()` 包裝。

- `Algorithm.step()` 方法：在特定場景或使用自訂演算法/問題時，您可能會直接呼叫演算法的 `step()` 方法，該方法通常封裝了演算法的整個迭代邏輯。

- `Algorithm.init_step()` 方法：`init_step()` 方法包含演算法的第一次迭代。如果未覆寫，它僅呼叫 `step()` 方法。對於典型情況，第一次迭代與其他迭代沒有區別，因此許多演算法可能不需要自訂 `init_step()`。但是對於涉及超參數調整的演算法，您可能需要在這裡更新超參數或相關變數。

### 裝置與平行控制

- `.to(device)` 方法：如果您需要在程式中切換計算裝置，請使用 PyTorch 的 `.to(device)` 方法將張量 (`torch.Tensor`) 移動到 GPU/CPU（某些 PyTorch 方法如 `torch.randn` 也需要指定裝置）。一般來說，如果您使用 `torch.set_default_device()` 將裝置設定為 `cuda:0`（假設您的系統支援，且 EvoX 和相依套件已正確安裝——可透過 `torch.cuda.is_available()` 驗證），大多數 EvoX 高效能平行計算將自動在 GPU 上執行。在編寫自訂演算法、問題或監控器時，如果您建立新張量或使用對裝置敏感的 PyTorch 方法，建議明確將 `device` 指定為 `cuda:0` 或使用 `torch.get_default_device()`，以避免因計算分散在不同裝置上而導致效能下降。

對於初學者，上述方法足以處理典型的優化任務。簡而言之：**初始化問題/演算法 – 設定監控器 – 組裝工作流 – 執行並獲取結果** 是最常見的 EvoX 工作流程。掌握這些讓您能夠使用 EvoX 處理基本的優化任務。

在進入下一章之前，試著修改範例：將 PSO 切換為其他演算法，將 Ackley 函數替換為其他測試函數，或使用監控器提取更多資訊——這將幫助您體會配置 EvoX 專案的靈活性。