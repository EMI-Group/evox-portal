---
title: "Genesis 將 openJiuwen Agent Core 從 Python 轉換為 Rust"
pubDate: 2026-11-20
updatedDate: 2026-11-20
summary: "Genesis 將 Agent SDK 重新開發為包含 30 個 Rust crate、26 個可執行範例的工作區，展示持續開發過程，以及工作階段、工具和工作流程行為如何在遷移後接受驗證。"
---

openJiuwen Agent Core 是用於建構 Agent 應用程式的 Python SDK，連接模型呼叫、工具執行、工作流程與工作階段狀態。EvoX Genesis 在 [2026 年 11 月 20 日發布的 Evidence][evidence] 中，記錄以 Python SDK v0.1.20 為唯讀參考，將其轉換為 Rust 實作 **agent-core-rs** 的過程。

產物是包含 **30 個 Rust crate、26 個可執行範例**的工作區，經歷首次轉換，以及基於保留程式碼的後續開發。遷移需要回答的工程問題是：更換語言後，哪些行為得以延續？儲存的工作階段要正確還原，工具要等待批准，工作流程也要走到預期分支。

![Python 程式碼轉換為 Rust 程式碼，並保留對應工作流程分支的概念插畫](./contract-migration-v2.webp)

## 改變實作，保留行為契約

工作區依共用型別、模型與工具存取、工作階段狀態、編排及應用程式入口分層，可執行產物涵蓋工作流程、DeepAgent、團隊協作與 CLI。這讓「30 個 crate」有了具體含義：轉換涵蓋 Agent 應用程式的多個組成部分，各項整合的支援範圍則由[涵蓋矩陣][parity]逐項說明。

[提交 242b5b5 的原始碼快照][repo] 將 Card JSON 欄位、模型通訊格式、持久化工作階段資料、工作流程參照及 CLI 行為列為相容目標。Rust 型別、trait、基於 Tokio 的非同步執行及 Serde 序列化承接 Python 的實作機制。共用型別放在使用者的下層；彙總 crate 只重新匯出 API，避免重複實作行為。

相容範圍限於已實作的子集。[涵蓋矩陣][parity] 區分已支援介面、部分實作和暫緩項目，包括分散式執行、GPU/ML 路徑及部分廠商或外部服務整合。有型別化 Unsupported 路徑的介面會明確回傳錯誤，其他缺口則尚無實作。選擇遷移應用程式時，這些差異直接影響可行性。

## 工作階段可以還原，工具必須等待

[工作階段範例][session] 先把檢查點存入暫存目錄，再用相同身分和儲存根目錄建立新工作階段，還原已儲存狀態。這項檢查跨越儲存邊界：僅將原物件保留在記憶體中，無法證明相同行為。

審批情境在模擬工具呼叫之前設定關卡，透過執行計數器確認等待審批時工具尚未執行。攜帶對應審批資料重新呼叫後，執行才會繼續。腳本化模型和帶計數的工具讓這個順序無需模型服務憑證即可檢查。

[工作流程範例][workflow] 驗證另一種整合問題。兩個輸入分別走同一已編譯拓撲的短分支和長分支，透過節點欄位參照傳遞資料。若直接將兩個互斥前驅都連接到同一節點，會形成等待兩者完成的合取條件。範例使用轉送元件與明確路由啟用，讓任一分支都能到達共同終點。僅保留欄位名稱，會漏掉這種排程差異。

## 兩次任務，明確的費用範圍

[任務歷史附錄][history] 記錄 UTC 11 月 11–16 日的首次轉換：任務被手動停止，但產物保留；隨後在 UTC 11 月 19 日完成一次演化任務。兩次任務歸於 DeepSeek V4 Flash 的模型呼叫費用合計 **150.024283 美元**。 第二次任務從第一次的結果版本接續開發，展示如何跨越任務邊界保留既有實作，並在其上繼續完善。

任務牆鐘時間合計 **113 小時 42 分鐘**，包含等待與排隊；從首次開始到最終完成的日曆跨度超過八天。3,570 個 Agent 註冊實例是累計數，並非峰值並行數。費用不含基礎設施、人工及後續文件工作；中間一次失敗任務的用量未知，也未計入。

同一附錄統計 1,434,767 行 Rust 實體行，包含註解、空白行，以及正式程式碼、測試和範例。這說明產物規模；重寫保留哪些行為，仍由行為檢查回答。

## 驗證紀錄能說明什麼

[驗證紀錄][parity] 報告格式檢查、Clippy、離線工作區測試、Rustdoc、七組功能檢查及範例建置通過。**24,293 是原始碼中的測試函式數量**，不是一次測試執行擷取的通過總數。五個忽略項屬於輔助程式或依賴環境的探測；後續文件任務僅重新執行選定檢查。

腳本化模型、本機模擬伺服器、暫存儲存與回環通訊端用於檢查協定處理及執行行為。這些方式支援無需真實憑證的可重複檢查，而真實模型的任務成功率須另行評估。以上為專案報告結果；我們未獨立重新執行 Rust 測試套件。

## 本機操作提速，須放在對應負載中理解

[基準報告][bench] 在一台八邏輯 CPU 的 Linux 主機上，以熱頁面快取比較 Rust release 建置與 CPython 3.11.15。提示詞渲染分別為 **0.356 µs 與 16.37 µs**，約 **46 倍**；無 I/O 的雙節點圖分別為 **7.23 µs 與 112.3 µs**，約 **15 倍**。

測量透過重複批次換算成每次操作，Rust 批次規模為 Python 的十倍。圖的邏輯形狀相同，內部引擎不同。倍數描述本機框架開銷，不包含模型與網路延遲、冷快取啟動或並行擴展。另列的 Python 首次圖執行及 Rust 腳本化 Agent 程序測試執行不同任務，不能據此計算等價的啟動或記憶體改善倍數。

## 從需要保留的一項行為開始

評估遷移時，檢查點、審批與條件路由範例可作為具體驗收目標。先對照[涵蓋矩陣][parity]檢查目標整合，再備妥建置環境，執行文件中的 `make verify`。`cargo test --workspace --offline --no-fail-fast` 會包含一般 `cargo test` 遺漏的開發 crate。

工作區以原始碼形式提供，各 crate 標記為 `publish = false`。可透過[完整 Evidence][evidence] 和[固定提交的實作][repo]繼續檢查。結合先前的 [MESA 重新開發案例](/zh-tw/news/genesis-mesa)，本案例展示如何透過保留的行為與新實作共同評估 Genesis 的重新開發能力。

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

