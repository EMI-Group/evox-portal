---
title: "EvoX v1.1.1 發布說明"
pubDate: 2025-03-16
summary: "修復了 torch.compile 圖捕獲、use_state 圖中斷以及 BatchedTensor 洩漏的錯誤。"
---

**變更內容**

**此小版本更新主要包含錯誤修復和改進：**

- 修復了 `torch.compile` 無法正確捕獲 `workflow.step` 的問題。

- 修復了 `use_state` 導致圖中斷 (graph break) 的問題。

- 修復了一些錯誤的模型緩衝區 (buffer) 使用方式。

- 修復了 monitor.plot 無法按預期運作的問題。

- 引入了一個新的包裝器 `evox.compile`，以解決 `torch.compile` 和 `torch.vmap` 的某些限制。

- 解決了多個與 `BatchedTensor` 相關的問題：修復了在帶有 EvalMonitor 的工作流上使用 vmap 可能導致 BatchedTensor 洩漏的錯誤。

- 修復了導致 HPOProblem 無法與 BraxProblem 協同工作的問題。

- 增強了 RVEA 和 CSO 的實作，以獲得更好的效能和可靠性。

- 增強了 BraxProblem 的實作。

- 各種小型修復和改進。

**開源程式碼與社群**

**論文**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**上游專案 (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ 群**: 297969717

![image.png](./evox-1-1-1-1.png)

  QQ 群 | 演化機器智能