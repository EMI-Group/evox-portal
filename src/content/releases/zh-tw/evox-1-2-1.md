---
title: "EvoX v1.2.1 版本說明"
pubDate: 2025-05-13
summary: "穩定性改進，新增基準函數（Ellipsoid、Griewank）及錯誤修復。"
---

這是一個專注於提升穩定性和修復錯誤的小版本更新，同時包含一些便利性增強。

**新功能**

新增基準函數：新增了單目標數值函數：`Ellipsoid` 和 `Griewank`。

**錯誤修復**

* 修復了 `StdWorkflow` 無法與繼承自其他算法的算法配合使用的問題。

* 修正了 `latin_hypercube_sampling_standard` 函數中的錯誤。

* 解決了 `non_dominate` 在 `torch.compile` 下失敗的問題。

* 修正了 `PSO` 在某些情況下未正確使用預設裝置的問題。

**重構與維護**

* 將常用工具重新匯出到頂層以方便使用，例如：

* `evox.compile` 取代 `evox.core.compile`

* `evox.vmap` 取代 `evox.core.vmap`。

* 移除了已棄用或冗餘的程式碼。

完整更新日誌：[https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**開源程式碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案（EvoX）：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ群：297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ群 | Evolving Machine Intelligence
