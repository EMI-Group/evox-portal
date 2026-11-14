---
title: "Genesis Assistant：從暫停的位置接續對話"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "Genesis 主分支以互動工作階段保留 Assistant 對話，並在核准視窗顯示確切程式碼及目標節點。"
---

開發者可以請 Genesis Assistant 檢查失敗任務，先去審查變更，再回來追問。要接續工作，就要找得到原對話，並保留足夠脈絡。2026 年 11 月 10 日至 12 日合併至 Genesis `main` 的改動，在工作階段存續期間保留 Assistant 的互動狀態，並將對話清單移到儀表板側欄。[Assistant 指南][guide]

![開發者回到有標記的對話並檢視一項擬執行的操作](./genesis-assistant-interactive-sessions.webp)

*編輯插畫：回到 Assistant 對話並審閱擬執行的操作。*

## 回到等待輸入的對話

在 **Active Tasks** 下方開啟 **Conversations**。清單同時顯示所選節點上的活動工作階段與本機快取的對話，狀態分為等待輸入、執行中和已結束。選擇對話會開啟 `/assistant?session=<agent_id>`。原有的 `/help` 連結會重新導向 `/assistant`，保留查詢參數。[路由變更][route]

一次互動完成後，工作階段可以釋出執行名額，保留脈絡和工作樹，等待下一筆輸入。追問會沿用同一個代理工作階段與提示快取識別。**New chat** 會另開對話，原對話仍留在清單中。已結束的對話也能以歷程顯示。[工作階段實作][session]

## 先檢查任務，再決定要改什麼

以測試失敗為例，先請 Assistant 讀取目前節點上的任務狀態、錯誤和結果。開啟審查頁面，比對程式碼差異與失敗資訊，再從 **Conversations** 回到原對話提出更具體的問題。如果本機執行個體提示下載 Genesis 原始碼，先完成下載，Assistant 才能查閱該份程式碼。

若要重試，可以請 Assistant 提議以前一項任務為背景啟動新任務。檢查屬於讀取層級，啟動工作則使用寫入呼叫，須對所選節點上的該次呼叫作出核准決定。[任務檢查與執行層級][guide]

## 審閱寫入操作時保留閱讀位置

對話內容與輸入欄之間有固定狀態列，提示待處理請求。**Review** 會開啟對話方塊，每次顯示一項請求。確認要執行的確切程式碼及目標，再選擇 **Allow once** 或 **Deny**。`sudo` 層級的請求會顯示醒目警告，因為它會以 Genesis 伺服器身分執行原生 Elixir。

對話方塊現在會讀取執行時標記的目標節點，並顯示請求附帶的警告。多項請求可逐一審閱。尚未處理的請求也可在恢復會話時顯示。狀態列改變時，對話內容與輸入欄保持在原位。[核准流程改動][approval]

## 回到任務確認結果

寫入獲准後，查看所產生的任務與狀態，確認工作是否完成。若回應中斷或寫入逾時，先查詢目前狀態，再決定是否重送寫入。在包含這些改動的建置上，可以先執行唯讀任務檢查，切換到另一個儀表板頁面，再從 **Conversations** 回來追問。[先前的 Assistant 介紹][related]說明這套流程所依據的操作工具。[目前的 Assistant 指南][guide]

## 對話結束時保留最終回答

11 月 14 日補充：11 月 13 日合入 `main` 的更新，將最終權威快照交給 Assistant 和所選代理的檢查面板。對話內容與終止狀態一起套用，延遲的任務廣播不能重新開啟已封閉的對話。若交接無法使用，介面保留最後一致的快取文字，而非另外讀取歷史。檢查面板可在活動樹之外保留已結束代理的詳細資訊。在包含此更新的版本上，保持選取對話直到完成，確認最終文字與狀態一致後再決定是否重試工作。[終止交接實作][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /zh-tw/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
