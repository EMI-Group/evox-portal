---
title: "Genesis 開發進展：為專案建立持久登錄冊"
pubDate: 2026-11-10
summary: "11 月 9 日合入 main 的變更，以資料庫專案登錄冊取代最近專案記錄，並區分本機與遠端選項。"
---

在另一部機器上開啟儲存庫時，專案身分應與本機專案保持清楚邊界。2026 年 11 月 9 日合入 Genesis main 的變更，將專案頁與選擇面板接入資料庫支援的 VCT 專案登錄冊，取代原先的最近專案清單。 [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![專案資料夾按主機分櫃保存，並與登錄標籤對應](./project-host-registry.webp)

## 為專案登錄一個位置

開啟或建立專案時，透過識別節點的專案介面登錄掛載。選擇面板搜尋已登錄路徑，目前專案可顯示掛載點。遠端清單來自所選主機；遠端連線尚未完成時，本機項目不會混入該檢視。 [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## 繼續工作前核對主機

使用這些變更的開發版本時，可分別重新開啟本機與遠端儲存庫，檢查專案身分與路徑建議。登錄冊提供導覽記錄，程式碼變更仍沿用專案正常的驗證流程審查。

[Genesis 多儲存庫協作：一個目標，多份獨立歷史](/zh-tw/news/genesis-multi-repository)
