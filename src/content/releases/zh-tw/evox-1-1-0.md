---
title: "EvoX 1.1 發布：現已支援 torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 引入了完整的 torch.compile (TorchDynamo) 整合，取代了 TorchScript，以獲得更好的相容性和效能。"
---

我們很高興地宣布 **EvoX 1.1** 正式發布，引入了 **torch.compile (TorchDynamo) 的完整整合**作為後端編譯器！此更新取代了先前的 TorchScript 方法，使 EvoX **更易於使用，並與更廣泛的 Python 生態系統高度相容**。

透過利用 **torch.compile**，EvoX 現在可以在執行時動態捕捉計算圖，消除手動追蹤 (tracing) 的需求，同時自動優化效能。

**有什麼新功能？**

**torch.compile：更智慧、更靈活的編譯**

在 EvoX 1.1 中，我們全面採用 **torch.compile** 作為新的編譯後端。與先前基於追蹤的方法不同，torch.compile——其**內部使用 TorchDynamo**——會攔截 Python 執行，動態提取計算圖，並即時進行優化。

這意味著：

- **不再需要手動追蹤** —— 只需呼叫 **torch.compile(workflow.step)**，EvoX 會處理剩下的工作。

- **無縫的 Python 相容性** —— 適用於原生 Python 函式以及 NumPy 和 SciPy 等外部函式庫。

- **更好的效能** —— 優化的計算圖帶來**更快的執行速度和更好的硬體利用率**。

- **面向未來的設計** —— 與 PyTorch 的發展藍圖保持一致，確保長期的相容性和效能改進。

**為什麼從 TorchScript 轉向 torch.compile？**

在早期版本中，EvoX 依賴**基於追蹤的方法**：

- **1.0.0 之前**使用 **JAX tracing** 進行計算圖提取。

- **v1.0.0** 切換到 **TorchScript**，增強了 PyTorch 整合。

然而，這些方法有一些缺點：

- **使用複雜** —— 使用者必須手動追蹤圖形並處理複雜的除錯。

- **相容性有限** —— 難以處理動態工作流程和非 PyTorch 函式。

- **靈活性受限** —— 迴圈、條件語句和其他 Python 結構並不總能被正確捕捉。

有了 torch.compile 和 **TorchDynamo**，**這些問題都消失了**。EvoX 現在進行動態優化，支援更廣泛的工作流程，**使用者無需付出額外努力**。

**EvoX 1.1 如何讓您的生活更輕鬆**

- **不再有追蹤的麻煩** —— 一切都在幕後進行，讓您的程式碼更乾淨、更易於維護。

- **適用於您現有的 Python 程式碼** —— 無需為了相容性修改您的工作流程。

- **執行更快，擴展性更好** —— 受益於 PyTorch 對 GPU 和 TPU 的最新優化。

- **為未來做好準備** —— 與 PyTorch 的長期演進保持一致，確保持續的效能提升。

**立即升級到 EvoX 1.1！**

EvoX 1.1 現已正式發布！立即升級，體驗**更智慧、更快速且更直觀**的計算工作流程。

**獲取 EvoX 1.1**：[GitHub](https://github.com/EMI-Group/EvoX)

有問題或回饋嗎？在 GitHub 上開啟 issue 或加入我們的社群討論。讓我們一起拓展**計算智慧的邊界！**

**原始碼 / 社群 / 文件**

論文：[https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

文件：[https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ 群：297969717

![4.png](/images/articles/evox-1-1-0-1.png)