---
title: "Genesis 開發進展：Assistant 與共用遠端服務"
pubDate: 2026-11-07
summary: "主分支近期加入操作助理、共用遠端服務及更簡潔的背景工作處理。"
---

2026 年 11 月 4—7 日合併至 Genesis `main` 分支的變更改善了日常操作體驗。

Genesis Assistant 成為儀表板中的操作對話入口，可檢視工作和系統容量，並請求執行工作或修改設定。其 read/write/sudo 分級執行機制區分唯讀檢查與需要核准具體程式碼的操作；sudo 使用獨立的核准卡片。具體界線請見 [Assistant 指南][assistant]。

遠端開發現在與 HTTP 儀表板共用單一服務實例。`genesis remote stop` 關閉遠端分散式連線，同時保留 HTTP 服務。背景工作採用 `bash-1` 等簡短識別碼；當呼叫代理僅擁有一項工作時，`job_output` 可以省略 `job_id`。

對於使用開發組建的使用者，OAuth 憑證檔案的自訂路徑現在屬於個別模型設定（`[[llm.models]]`），不再使用全域 `[llm] oauth_file` 設定。

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

