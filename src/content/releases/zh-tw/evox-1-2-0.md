---
title: "EvoX v1.2.0 發布說明"
pubDate: 2025-04-23
summary: "新功能包括 final_step()、Mujoco Playground 環境、使用者教學以及 EvoMO 整合。"
---

**我們很高興宣布「EvoX v1.2.0」正式發布，此次更新帶來了豐富的新功能、改進以及重要的錯誤修復！**

**此次更新增強了框架在關鍵模組上的靈活性與效能**。

**亮點：**

-  新增 `final_step()` 並更新了 `hpo_wrapper` 和 `std_workflow`，以實現更流暢的執行工作流程。

-  引入了「Mujoco Playground」—— 一個用於強化學習實驗的新環境。

-  發布了全新的 [教學](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")，幫助使用者快速上手。

-  新增了 EvoX 擴充功能，使其能更好地與 [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/") 等姊妹專案整合。

-  各種錯誤修復和文件更新，以提高穩定性和清晰度。

**相關 Pull Requests：**

- MOEAs 的 Docstring 更新 —— [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py` 中的 `vmap` 修復 —— [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  新增 RVEAa 並改進了對 DTLZ、IGD、RVEA 的支援 —— [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- 工作流程模組中的 `final_step()` 更新 —— [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground 環境 —— [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  文件優化 —— [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playground 的錯誤修復 —— [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  新的使用者教學 —— [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**完整變更日誌**：[v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**開源程式碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案 (EvoX)：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 群：297969717

![圖片11.png](/images/articles/evox-1-2-0-1.png)

QQ 群 | Evolving Machine Intelligence