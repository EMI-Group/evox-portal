---
title: "Genesis 新增可選的免 API 金鑰搜尋入口"
pubDate: 2026-11-22
summary: "Keenable 介面卡支援顯式啟用公開網頁搜尋，同時保留金鑰訪問和現有預設提供方。"
---

如果網頁搜尋還需要單獨準備憑據，Agent 研究任務可能在第一次查詢之前就停在配置環節。Genesis PR #174 於 2026 年 11 月 19 日合入 `main`，新增可選提供方 **Keenable**，無需配置 API 金鑰即可使用其公開端點。已有安裝保持原來的預設行為。[已合併的搜尋介面卡][pr]

![敞開的圖書館入口通向一組帶來源標記的文件](./cover.webp)

*概念插畫：進入網頁研究的一條可選公開通路。*

## 顯式啟用公開通路

在 `[tools.search]` 中設定 `enabled = true` 和 `provider = "keenable"`。沒有金鑰時，介面卡向公開端點提交查詢與結果數量上限，攜帶 `X-Keenable-Title: Genesis`，不傳送 `X-API-Key`。在憑據儲存中加入 `KEENABLE_API_KEY` 後，則切換為金鑰訪問。[請求構造][adapter]

實現同時修改了讓這條通路真正可用的兩個檢查點：選中的免金鑰提供方可以啟用 Agent 搜尋工具，執行時也不再僅因缺少金鑰而拒絕該提供方。需要憑據的其他提供方保留原有檢查。

## 結合限制閱讀結果

對於收集文件參考資料的任務，這減少了搜尋前的一項配置。介面卡把結果標題、URL 與 `snippet` 對映到現有搜尋結果格式，並遵守 `max_results`；Keenable 沒有對應的 `search_depth` 引數，因此會忽略該選項。[響應對映][adapter]

公開通路按 IP 限流。PR 記錄了請求構造、解析和工具啟用測試，包括經模擬執行介面進行的檢查，沒有報告真實 Keenable API 呼叫。啟用後，可先從實際執行主機傳送一次小查詢，檢查來源連結和服務錯誤，再將它用於更大的研究任務。[已記錄檢查][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
