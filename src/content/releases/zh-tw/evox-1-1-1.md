---
title: "EvoX v1.1.1 版本說明"
pubDate: 2025-03-16
summary: "修復 torch.compile 圖捕獲、use_state 圖中斷和 BatchedTensor 洩漏等問題。"
---

**更新內容**

**此次小版本更新主要包含錯誤修復和改進：**

- 修復了 `torch.compile` 未能正確捕獲 `workflow.step` 的問題。

- 修復了 `use_state` 導致圖中斷的問題。

- 修復了一些不正確的模型緩衝區使用。

- 修復了 monitor.plot 未按預期運作的問題。

- 引入了新的包裝器 `evox.compile`，以解決 `torch.compile` 和 `torch.vmap` 的某些限制。

- 解決了多個 `BatchedTensor` 相關問題：- 修復了對帶有 EvalMonitor 的工作流程進行 vmapping 時可能導致 BatchedTensor 洩漏的錯誤。

- 修復了 HPOProblem 無法與 BraxProblem 配合使用的問題。

- 增強了 RVEA 和 CSO 的實現，以獲得更好的效能和可靠性。

- 增強了 BraxProblem 的實現。

- 各種小型修復和改進。

**開源程式碼與社群**

**論文**：[https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**：[https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**上游專案（EvoX）**：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ群**：297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQ群 | Evolving Machine Intelligence
