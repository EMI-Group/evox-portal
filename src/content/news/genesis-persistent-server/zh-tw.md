---
title: "Genesis Server：為軟體開發提供持續執行的環境"
pubDate: 2026-11-02
summary: "從 0.13.11 的獨立伺服器發行套件，到 0.14.0 的登出後持續執行支援，Genesis 為儀表板和智慧體建立可獨立部署的環境。"
updatedDate: 2026-11-08
---

2026 年 11 月 2 日發布的 Genesis 0.14.0 在伺服器啟動時加入 systemd lingering 狀態偵測，並提供啟用選項。它延續了 10 月 30 日在 0.13.11 中引入的獨立伺服器發行形式。這些變化讓開發工作擁有可以獨立於桌面工作階段管理生命週期的執行環境。

![終端關閉後伺服器繼續處理任務](./persistent-server-session.webp)

## 具有維運控制的伺服器套件

獨立伺服器包含儀表板和智慧體執行環境，支援 Linux x64/arm64 及 macOS arm64。CLI 涵蓋前景服務、啟動、停止、狀態、日誌、健康檢查與版本查詢。安裝指令碼會驗證檔案摘要，安裝或升級套件，並連結可執行檔。 [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 處理執行周圍的生命週期

在使用 systemd 的 Linux 系統上，使用者服務可能需要 lingering 才能在登出後保持可用。 0.14.0 檢查這個條件，並允許透過 `GENESIS_LINGER` 或 `--no-linger` 選項配置。 [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

先前版本也改進了遠端啟動：命令經由 POSIX shell 包裝執行，正確處理包含空格的路徑，並為連線失敗提供可讀原因。伺服器模式修復與準確的執行時間報告，讓狀態更容易診斷。 [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 讓伺服器持續執行前

將長任務移至伺服器前，先檢查狀態、日誌與 `/health` 回應。在 systemd 主機確認 lingering 設定，並於登出後再次檢查服務可用性。這些檢查建立執行基準；隨後可透過[開發歷史](/zh-tw/news/genesis-development-history)追蹤在此產生的程式碼。
