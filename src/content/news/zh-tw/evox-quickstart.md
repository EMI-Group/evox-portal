---
title: "EvoX 快速入門：10分鐘運行GPU加速的演化計算"
pubDate: 2025-04-30
summary: "面向初學者的教學，10分鐘內使用 EvoX 開始GPU加速的演化計算。"
---

一方面，演化計算在實際研究和工程中極為強大，但卻難以調用。另一方面，GPU 的能力日益強大，但在演化計算任務中卻難以發揮其威力。

我們需要一個真正現代化的解決方案：原生 GPU 支援、模組化架構、清晰的介面、開箱即用的易用性，以及可自訂的擴展性。這就是 EvoX——一個面向未來的演化計算引擎。

為了幫助使用者快速上手，EvoX 團隊發佈了「EvoX 初學者教學」。該教學共 8 章，涵蓋從基礎到進階實際應用的所有內容，逐步引導您如何在 GPU 上運行演化算法。

**完整教學資源**

中文線上教學：

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

中文 PDF 教學：

請加入QQ群獲取：297969717

接下來，我們將帶您在短短 10 分鐘內完成從安裝到運行的整個流程。

**步驟 1：環境設定**

開啟您的終端機並建立一個乾淨的 Python 環境：

![代码片段1.png](/images/articles/quickstart-1.png)

您也可以使用您偏好的工具來建立乾淨的 Python 環境。

**步驟 2：安裝 PyTorch 和 EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

檢查 GPU 是否可用：

![代码片段3.png](/images/articles/quickstart-3.png)

**步驟 3：運行您的第一個演化算法**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

這段程式碼做了什麼？它透過標準介面組合了一個算法（PSO）、一個問題（Ackley）和一個監控器（EvalMonitor）。EvoX 會處理所有的平行化、加速和監控！

**步驟 4：繪製收斂曲線**

只需一行程式碼：

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

看到那條下降的曲線了嗎？那就是**您的演化算法逼近目標的軌跡**，也是**它探索未知世界所走過的路徑。**

**步驟 5：嘗試擴展**

如果「只運行一個 Ackley」還不夠過癮，您可以：

· 將 PSO 替換為 GA、DE、CMA-ES、NSGA-II、RVEA...
 · 將 Ackley 替換為 Rastrigin、Griewank、CEC2022
 · 設定 n_objs >= 2 切換到多目標問題
 · 用 MyProblem 和 MyAlgorithm 實現您自己的邏輯
 · 接入 PyTorch 模型或強化學習環境（Gym、Brax、MuJoCo Playground）

無論是超參數調優、架構搜索、神經演化還是控制策略最佳化，EvoX 都能輕鬆應對。

**為什麼選擇 EvoX？**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**致謝**

本教學由 **Boqing Xu**、**Xinmeng Yu**、**Bowen Zheng** 和 **Xinyao Li** 撰寫。**Beichen Huang** 負責教學的整理、編輯和線上發佈。

我們衷心感謝 EvoX 社群的每一位成員。正是我們的共同努力，才使得 EvoX 不斷演進。

**開源程式碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案（EvoX）：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ群：297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

QQ群 | Evolving Machine Intelligence

EvoMO 建立在 EvoX 框架之上。如果您有興趣了解更多關於 EvoX 的資訊，歡迎查閱我們微信公眾號上發佈的 EvoX 1.0 官方文章以獲取更多詳情。

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
