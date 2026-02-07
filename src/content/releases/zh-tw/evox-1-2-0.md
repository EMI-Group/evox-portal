---
title: "EvoX v1.2.0 版本說明"
pubDate: 2025-04-23
summary: "新增 final_step()、Mujoco Playground 環境、使用者教學以及 EvoMO 整合等功能。"
---

**我們很高興宣佈「EvoX v1.2.0」的發佈，包含眾多新功能、改進和重要的錯誤修復！**

**此次更新增強了框架在關鍵模組上的靈活性和效能**。

**亮點：**

-  新增 `final_step()` 並更新了 `hpo_wrapper` 和 `std_workflow`，使執行工作流程更加順暢。

-  推出「Mujoco Playground」——一個用於強化學習實驗的新環境。

-  發佈了全新的[教學](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")，幫助使用者快速上手。

-  新增 EvoX 擴展功能，實現與姊妹專案（如 [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/")）的更好整合。

-  各種錯誤修復和文件更新，提升穩定性和清晰度。

**相關 Pull Requests：**

- MOEAs 的文件字串更新 -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py` 中的 `vmap` 修復 -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  新增 RVEAa 並改進 DTLZ、IGD、RVEA 支援 -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- 工作流程模組中的 `final_step()` 更新 -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground 環境 -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  文件改進 -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playground 錯誤修復 -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  新使用者教學 -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**完整更新日誌**：[v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**開源程式碼 / 社群資源**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游專案（EvoX）：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ群：297969717

![图片11.png](/images/articles/evox-1-2-0-1.png)

QQ群 | Evolving Machine Intelligence
