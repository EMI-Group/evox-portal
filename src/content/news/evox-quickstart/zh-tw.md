---
title: "EvoX 入門：構建第一個演化工作流"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "透過完整的 EvoX 1.4.1 實驗，理解問題、種群、評價與執行如何組成可複用的演化工作流。"
---

本文完成一個小而完整的最佳化實驗：使用 PSO 最小化二維 Ackley 函式，確認執行裝置並繪製搜尋歷史。示例對應 **EvoX 1.4.1 與 PyTorch**，不適用於實驗性的 2.x 編譯器 API。小規模任務用於理解流程，不作為 GPU 效能基準。

![候選粒子探索搜尋地形](./first-search-workflow.webp)

## 準備獨立環境

使用 Python 3.10 或更新版本。建立虛擬環境，再按終端型別啟用。

```bash
python -m venv .venv
```

macOS/Linux：

```bash
source .venv/bin/activate
```

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

## 安裝匹配的軟體包

根據作業系統與硬體，在 [PyTorch 官方安裝頁面](https://pytorch.org/get-started/locally/)選擇安裝命令。CUDA 軟體包需要受支援的驅動，安裝 EvoX 本身並不保證 GPU 可用。然後安裝本文固定版本：

```bash
python -m pip install "evox[vis]==1.4.1"
```

## 執行完整實驗

將以下內容儲存為 Python 指令碼。程式碼在 CUDA 可用時選擇 GPU，否則使用 CPU，列印實際裝置，並將演算法狀態和監控放在所選裝置上。固定隨機種子有助於重複實驗，但跨裝置或軟體版本仍可能得到不同結果。

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## 理解並視覺化結果

PSO 維護候選向量，Ackley 負責評價，StdWorkflow 連線元件，EvalMonitor 記錄進展。適應度越小越好，理論最優值為原點處的零。最終數值具有隨機性，本示例不承諾固定分數。

搜尋結束後，在同一程序中執行以下命令。安裝步驟已包含視覺化依賴。圖片沿用原教程，用於說明曲線形式，不是該隨機種子的保證輸出。

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## 有目的地擴充套件實驗

逐次修改維度、種群規模或隨機種子。自定義問題需要為每個候選解返回目標值。多目標最佳化還需匹配的演算法、目標形狀和監控配置，不能只修改一個引數。

計時時應區分編譯、預熱與穩定執行，對 CUDA 測量進行同步，並使用相同評價預算。小任務可能在 CPU 上更快；先跑通基線，再研究編譯最佳化。

## 教程資源與致謝

原教程由 Boqing Xu、Xinmeng Yu、Bowen Zheng 和 Xinyao Li 編寫，Beichen Huang 整理、編輯並上線。下方保留原教程的概覽圖。

![EvoX overview](./quickstart-8.png)

本示例以[版本原始碼](https://github.com/EMI-Group/evox/tree/v1.4.1)為依據，更多教程見[文件](https://evox.readthedocs.io/en/latest/)。複製較新資料的 API 前，請先確認其對應版本。

擴充範例前，將套件版本、實際裝置、隨機種子與最佳適應度保存在一起。每次修改一個設定，並使用相同預算重新執行。轉向具有競爭目標的任務時，[EvoMO 解讀](/zh-tw/news/gpu-accelerated-emo)介紹了需要增加的選擇與評估設計。
