---
title: "Genesis Assistant：讓執行中的工作更易理解與管理"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "在一次對話中檢視工作、了解系統容量並執行操作。Genesis 主分支近期也簡化了遠端服務、背景工作與模型憑證設定。"
---

一項長時間執行的軟體工作啟動後，問題才剛開始：哪些工作仍在進行？某項工作為何失敗？接下來該如何處理？2026 年 11 月 4—7 日合併至 Genesis `main` 分支的更新，將這些問題帶進儀表板的 Assistant 對話入口，也整理了背後的服務與工作管理方式。

![開發者查看執行中與已暫停的任務](./genesis-assistant-task-flows.webp)

*一個對話入口，多條持續推進的工作流程——本次更新主題的編輯插畫。*

## 從工作出發，找到下一步操作

Genesis Assistant 可以讀取 Genesis 原始碼和文件、檢視工作，並檢查排程器的即時容量。開發者可以請它分析失敗工作的狀態、錯誤與結果，再要求繼續先前的工作。解釋與操作圍繞目前檢視的節點展開，讓問題與處理動作相互銜接。

[Assistant 指南][assistant]提供具體起點：檢視執行中的工作、檢查可用模型槽位，或在處理合併時暫停排程。暫停作用於排程，已經執行的工作仍會繼續。暫時的執行設定與儲存至檔案的設定也保持區分，當前工作階段的調整不必默默變成長期預設值。

檢視狀態使用 `read` 層級；修改使用 `write`，執行前需要核准具體程式碼；`sudo` 則有獨立核准卡片。當問題轉化為操作時，開發者能看清實際準備執行的動作。

## 一個服務實例，兩種連線方式

遠端開發與 HTTP 儀表板現在共用單一服務實例。先前，遠端命令會啟動獨立的分散式連線實例。[共用服務的變更][remote]讓 `genesis remote stop` 只關閉遠端分散式連線，HTTP 儀表板仍可存取。結束遠端開發連線，不再需要停止這個共用的 HTTP 服務。

## 讓工作更容易追蹤的細節

[背景工作][jobs]現在採用 `bash-1` 等簡短識別碼。呼叫代理僅擁有一項工作時，`job_output` 可以自動找到它，不必傳入 `job_id`；有多項工作時，則回傳識別碼、狀態與標籤，方便選擇正確目標。

[OAuth 憑證檔案的自訂路徑][oauth]現在放在 `[[llm.models]]` 下的個別模型設定中，取代全域 `[llm] oauth_file` 設定。使用自訂憑證路徑的開發者，可以將路徑與其服務的模型放在一起管理。

這些變更為持續推進的工作提供更清楚的操作入口：要檢視的工作、要核准的動作，以及更容易理解的服務狀態。了解整體系統，可閱讀 [Genesis 介紹][intro]；查看具體操作，可繼續閱讀 [Assistant 指南][assistant]。

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /zh-tw/news/evox-genesis

