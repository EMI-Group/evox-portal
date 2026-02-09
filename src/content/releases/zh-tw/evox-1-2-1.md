---
title: "EvoX v1.2.1 發布說明"
pubDate: 2025-05-13
summary: "穩定性改進，新增基準測試函數（Ellipsoid, Griewank）並修復了錯誤。"
---

這是一個次要版本，專注於提升穩定性並修復錯誤，同時包含了一些使用體驗上的改進。

**新功能**

新增基準測試函數：添加了單目標數值函數：`Ellipsoid` 和 `Griewank`。

**錯誤修復**

* 修復了 `StdWorkflow` 無法與繼承自其他演算法的演算法一起運作的問題。

* 修正了 `latin_hypercube_sampling_standard` 函數中的一個錯誤。

* 解決了 `non_dominate` 在 `torch.compile` 下失敗的問題。

* 修正了 `PSO` 在某些情況下未能正確使用預設裝置的問題。

**重構與維護**

* 為了方便起見，將常用的工具重新導出到頂層，例如：

* 使用 `evox.compile` 代替 `evox.core.compile`

* 使用 `evox.vmap` 代替 `evox.core.vmap`。

* 移除了已棄用或多餘的程式碼。

完整變更日誌：[https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**開源代碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案 (EvoX)：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 群：297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ 群 | Evolving Machine Intelligence