---
title: "EvoX 快速入門：只需 10 分鐘即可運行 GPU 加速的演化計算"
pubDate: 2025-04-30
summary: "一份初學者教程，教您如何在 10 分鐘內使用 EvoX 開始進行 GPU 加速的演化計算。"
---

一方面，演化計算（Evolutionary Computation）在現實世界的研究和工程中極具威力，但卻難以調用。另一方面，GPU 的能力日益強大，但它們很難在演化計算任務中發揮其威力。

我們需要一個真正現代化的解決方案：原生 GPU 支援、模組化架構、清晰的介面、開箱即用以及可自定義的擴展性。這就是 EvoX —— 面向未來的演化計算引擎。

為了幫助使用者快速上手，EvoX 團隊發布了「EvoX 初學者教程」。該教程包含 8 個章節，涵蓋了從基礎知識到進階實際應用的所有內容，一步步指導您如何在 GPU 上運行演化演算法。

**完整的教程資源**

中文線上教程：

[EvoX 初學者教程 - EvoX 文檔](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

中文 PDF 教程：

請加入 QQ 群獲取：297969717

接下來，我們將帶您在短短 10 分鐘內完成從安裝到運行的整個過程。

**第一步：環境設置**

打開您的終端機並建立一個乾淨的 Python 環境：

![代碼片段1.png](./quickstart-1.png)

您也可以使用您偏好的工具來建立一個乾淨的 Python 環境。

**第二步：安裝 PyTorch 和 EvoX**

![代碼片段2.png](./quickstart-2.png)

檢查 GPU 是否可用：

![代碼片段3.png](./quickstart-3.png)

**第三步：運行您的第一個演化演算法**

**![代碼片段4.png](./quickstart-4.png)![圖片2.4.png](./quickstart-5.png)**

這是做什麼的？它透過標準介面組合了一個演算法（PSO）、一個問題（Ackley）和一個監控器（EvalMonitor）。EvoX 負責所有的並行化、加速和監控！

**第四步：繪製收斂曲線**

只需要一行程式碼：

![代碼片段5.png](./quickstart-6.png "代碼片段5.png")

![monitor_output.png](./quickstart-7.png)

看到那條下降的曲線了嗎？那就是 **您的演化演算法接近目標的軌跡**，以及 **它探索未知世界的路徑。**

**第五步：嘗試擴展**

如果「僅僅運行一個 Ackley」不能滿足您，您可以：

· 將 PSO 替換為 GA, DE, CMA-ES, NSGA-II, RVEA...
 · 將 Ackley 替換為 Rastrigin, Griewank, CEC2022
 · 透過設置 n_objs >= 2 切換到多目標問題
 · 使用 MyProblem 和 MyAlgorithm 實現您自己的邏輯
 · 與 PyTorch 模型或強化學習環境（Gym, Brax, MuJoCo Playground）對接

無論是超參數調整、架構搜索、神經演化還是控制策略優化，EvoX 都能輕鬆應對。

**為什麼選擇 EvoX？**

![表格-英文.png](./quickstart-8.png "表格-英文.png")



**致謝**

本教程由 **Boqing Xu**、**Xinmeng Yu**、**Bowen Zheng** 和 **Xinyao Li** 撰寫。**Beichen Huang** 負責教程的整理、編輯和線上發布。

我們衷心感謝 EvoX 社群的每一位成員。正是我們的共同努力，讓 EvoX 能夠不斷進化。

**開源程式碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案 (EvoX)：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 群：297969717

![圖片11.png](./evox-1-1-0-1.png)

QQ 群 | 演化機器智能 (Evolving Machine Intelligence)

EvoMO 是基於 EvoX 框架構建的。如果您有興趣了解更多關於 EvoX 的資訊，歡迎查看我們微信公眾號上發布的關於 EvoX 1.0 的官方文章以獲取更多詳情。

![image.png](./metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))