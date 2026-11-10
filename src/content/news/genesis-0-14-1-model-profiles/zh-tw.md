---
title: "Genesis 0.14.1：讓模型選擇跟隨任務"
pubDate: 2026-11-10
summary: "提供者帳戶設定貫通 Genesis 的模型與推理選項，遠端開發則統一使用同一部伺服器。"
---

選擇模型，也涉及帳戶、憑證與推理設定。2026 年 11 月 8 日發布的 Genesis 0.14.1，將這份選擇貫通設定、專案、Assistant、排程器與執行環境，讓任務指定的設定更可靠地進入實際執行。 [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![選取的帳戶標籤與對應模型選項保持連接](./provider-account-continuity.webp)

## 一份設定，貫通模型選擇

標準化提供者設定分開表達帳戶與模型選擇。共用選擇器提供模型及推理選項；排程器修正保留明確指定的任務選擇與完整儲存設定。支援的設定也加入 OAuth／訂閱驗證、逐設定登入狀態，以及從廠商 CLI 匯入憑證檔案的能力。

## 本機與遠端共用一部伺服器

遠端開發現在採用與無介面儀表板相同的 genesis_server 發行套件，獨立的 genesis_remote 套件停止使用。CLI 管理遠端啟動、停止、狀態與日誌；分散式連線可於執行時切換，HTTP 服務持續可用。

## 升級時核對設定交接

升級後，先在設定中檢查提供者帳戶、模型與推理選項，再核對一次明確指定模型的任務。自訂 OAuth 憑證路徑屬於各個模型設定。遠端維運人員應在重用舊常駐程式腳本前，檢查共用伺服器的變化。完整遷移及修正清單見發布說明。 [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant：讓執行中的工作更易理解與管理](/zh-tw/news/genesis-development-2026-11-07)
