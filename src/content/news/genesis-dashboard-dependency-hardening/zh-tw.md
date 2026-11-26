---
title: "Genesis 加固工作臺背後的 Web 依賴"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main 分支更新 Phoenix、LiveView、Bandit 和 jsv；原始碼部署需要重新構建應用才能納入這些變化。"
---

2026 年 11 月 23 日，Genesis 在 `main` 分支更新了四項依賴。本次維護涉及使用者訪問工作臺所經過的共用 Web 基礎設施。對於從原始碼構建 Genesis 的團隊，關鍵是執行中服務實際使用了哪組構建依賴。[依賴更新][lock]

![替換後的鎖釦部件加固共用門鎖機構](./cover.webp)

*概念插畫：維護保護共用入口的基礎部件。*

## 介面之下更新了什麼

Genesis 的依賴宣告將 Phoenix 更新關聯到 presence 跟蹤器和廣播分發崩潰修復，將 LiveView 最低版本調整關聯到連線請求缺少 URL 時跳過會話初始化鉤子的修復；同時說明 Bandit 的 HTTP/2 校驗與加固變化。這些是 Genesis 維護者記錄的更新理由，提交本身沒有確定某個具體部署例項是否受到影響。[依賴要求][pins]

鎖檔案將 Phoenix 從 1.8.16 升至 1.8.17、LiveView 從 1.2.13 升至 1.2.15、Bandit 從 1.14.1 升至 1.15.0、jsv 從 0.28.0 升至 0.28.1。LiveView 宣告的最低版本為 1.2.14，鎖定構建實際使用 1.2.15。配套 Nix 變更為更新後的鎖檔案重新計算依賴雜湊。[鎖定版本][lock] · [Nix 構建更新][nix]

## 核對實際部署的構建

例如，自託管團隊可能已經更新原始碼，但仍在執行舊工作臺二進位制。要應用本次變化，應使用包含這些提交的修訂，按專案正常安裝流程重新構建和部署。檢查構建使用的 `mix.lock`；使用 Nix 時保留對應依賴雜湊，並在部署後驗證工作臺訪問及實時連線恢復。僅更新原始碼目錄不會替換正在執行的服務。[構建與安裝指南][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

2026 年 11 月 25 日的維護還將 `db_connection` 提升至 2.10.3。原始碼說明，這一下限針對偽造流結構透過日誌選項觸發的安全問題；同時更新了 Markdown 原生依賴和 Nix 雜湊。重新構建時應配套使用鎖檔案與 Nix 定義。 [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
