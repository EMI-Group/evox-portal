---
title: "EvoX 1.1 發佈：支援 torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 引入完整的 torch.compile (TorchDynamo) 整合，取代 TorchScript 以獲得更好的相容性和效能。"
---

我們很高興宣佈 **EvoX 1.1** 的發佈，引入了 **torch.compile (TorchDynamo) 的完整整合**作為後端編譯器！此次更新取代了先前的 TorchScript 方法，使 EvoX **更加使用者友好，並與更廣泛的 Python 生態系統高度相容**。

透過利用 **torch.compile**，EvoX 現在能夠在運行時動態捕獲計算圖，無需手動追蹤即可自動最佳化效能。

**有什麼新功能？**

**torch.compile：更智慧、更靈活的編譯**

在 EvoX 1.1 中，我們全面採用 **torch.compile** 作為新的編譯後端。與先前基於追蹤的方法不同，torch.compile——其**內部使用 TorchDynamo**——攔截 Python 執行，動態提取計算圖，並即時最佳化。

這意味著：

l  **無需手動追蹤** -- 只需呼叫 **torch.compile(workflow.step)**，EvoX 會處理其餘一切。

l  **無縫 Python 相容性** -- 與原生 Python 函數和外部函式庫（如 NumPy 和 SciPy）相容。

l  **更好的效能** -- 最佳化的計算圖帶來**更快的執行速度和更好的硬體利用率**。

l  **面向未來的設計** -- 與 PyTorch 的發展路線圖保持一致，確保長期的相容性和效能改進。

**為什麼從 TorchScript 遷移到 torch.compile？**

在早期版本中，EvoX 依賴**基於追蹤的方法**：

l  **1.0.0 之前**使用 **JAX tracing** 進行計算圖提取。

l  **v1.0.0** 切換到 **TorchScript**，增強了 PyTorch 整合。

然而，這些方法存在幾個缺點：

l  **使用複雜** -- 使用者必須手動追蹤圖並處理複雜的除錯。

l  **相容性有限** -- 難以處理動態工作流程和非 PyTorch 函數。

l  **靈活性受限** -- 迴圈、條件判斷和其他 Python 結構並不總是能被正確捕獲。

有了 torch.compile 和 **TorchDynamo**，**這些問題都已解決**。EvoX 現在能夠動態最佳化，支援更廣泛的工作流程，**使用者無需額外付出任何努力**。

**EvoX 1.1 如何讓您的工作更輕鬆**

l  **無需再為追蹤煩惱** -- 一切都在幕後完成，使您的程式碼更簡潔、更易於維護。

l  **與您現有的 Python 程式碼相容** -- 無需為了相容性而修改您的工作流程。

l  **更快的執行速度，更好的擴展性** -- 受益於 PyTorch 針對 GPU 和 TPU 的最新最佳化。

l  **面向未來** -- 與 PyTorch 的長期發展保持一致，確保持續的效能提升。

**立即升級到 EvoX 1.1！**

EvoX 1.1 現已正式發佈！立即升級，體驗**更智慧、更快速、更直覺**的計算工作流程。

**取得 EvoX 1.1**：[GitHub](https://github.com/EMI-Group/EvoX)

有問題或回饋？在 GitHub 上開啟 issue 或加入我們的社群討論。讓我們一起推動**計算智慧的邊界！**

**原始碼 / 社群 / 文件**

論文：[https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

文件：[https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ群：297969717

![4.png](/images/articles/evox-1-1-0-1.png)
