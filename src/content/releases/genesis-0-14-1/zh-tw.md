---
title: "Genesis 0.14.1：讓模型選擇貫穿整個任務"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "帳戶級模型設定、訂閱驗證與統一遠端伺服器改變了 Genesis 0.14.1 的設定方式。本文展開關鍵機制、使用情境與升級檢查。"
---

選擇模型，也是在選擇付費帳戶、驗證憑證與隨任務傳遞的推理設定。**Genesis 0.14.1 於 2026 年 11 月 8 日正式發布**，將這組身分貫通到 Settings、Projects、Assistant、排程器與執行階段，同時將遠端執行統一到無介面伺服器，並增加更可控的執行階段檢查能力。[完整發布說明][release]

![選中的帳戶標籤始終連接著對應的模型選項](./provider-account-continuity.webp)

## 帳戶設定一次，任務選擇到位

Provider profile 保存驗證、端點、並行數與時段安排；其巢狀模型清單列出該帳戶可用的模型，以及模型專屬的生成參數與推理設定。任務攜帶的是不含憑證的身分：帳戶設定 ID、模型 ID 與選用的推理強度。明確選擇後，這組身分會在後續執行中鎖定；**Auto** 則交由已設定的規則選擇。

例如，工作帳戶下的兩個模型共享該帳戶的並行名額與限流退避。增加模型，不會增加獨立配額池。個人帳戶可以另設憑證與排程策略；若兩個帳戶需要不同 API key，除了不同 profile ID，還要設定不同的憑證名稱。[帳戶設定與選擇規則][profiles]

每個可選模型都需要寫入 `[[llm.providers.models]]`，僅設定 `default_model` 並不足夠。預設推理強度與支援的強度清單也分別設定：儀表板中，清單非空但未解析出預設值時，會選擇第一項；核心 API 呼叫省略強度時，則可以不傳送該參數。因此，切換帳戶後應重新確認模型與強度。

本版修正了明確選擇在任務、代理與系統層之間遺失、排程器備援池不正確，以及儲存的模型快照不完整而觸發 `:model_spec_schema_unavailable` 等問題。封存設定也改為 JSON 安全格式，並遮蔽憑證。這些修正既影響新任務，也影響重新使用已儲存設定的工作。

## 訂閱登入沿帳戶設定解析

支援的帳戶設定新增 OAuth/訂閱驗證與逐設定的登入狀態。Genesis 將廠商 CLI 登入檔案匯入 ReqLLM 使用的受管憑證檔案。`openai_codex` 僅支援 OAuth；Anthropic 訂閱帳戶使用 `auth_mode = "oauth"`。版本化指南要求先在實際使用帳戶的節點上執行 `codex login`，或透過 Claude CLI 登入。[訂閱驗證設定][oauth]

預設受管檔案是 `config.toml` 旁的 `auth.json`。自訂 `oauth_file` 應放在 provider profile 中，全域 `[llm] oauth_file` 已移除。新建受管檔案使用 `0600` 權限，匯入採用原子寫入。檔案按 provider 保存一筆記錄，因此僅使用不同 profile ID 並不能隔離多個訂閱登入。

遠端工作時，應檢查遠端節點的登入狀態。若廠商登入存在，但受管憑證目標唯讀，需要將設定指向可寫入的私有路徑；重新登入無法解決目標不可寫入的問題。僅透過環境變數提供的 OAuth token 無法自動更新。新版狀態資訊會區分這些情況。

## 遠端執行與儀表板使用同一伺服器

獨立的 `genesis_remote` 發行套件停止使用。遠端命令與引導流程改用共享的 `genesis_server`，HTTP 始終可用，Erlang distribution 則可透過 SIGHUP 觸發的檔案協定在執行時切換。CLI 提供 `genesis remote start`、`stop`、`status` 與 `logs`。[伺服器與安裝入口][readme]

對於在筆電保留儀表板、透過 SSH 主機執行任務的使用者，這直接改變了服務管理方式：需要檢查引用舊發行套件的腳本，改為管理共享伺服器。本版也支援遠端專案測試與在呼叫時恢復測試執行。無介面 HTTP 伺服器預設監聽 localhost，未內建驗證；文件中的遠端存取方式是 SSH 通道。

## 長任務中的互動更容易恢復

分層、經代理的 Elixir 求值器增加了精確到程式碼的核准，以及聊天中的可恢復核准。輸出超過剩餘預算時會被截斷，而非直接失敗。其他變化包括短暫的回合上限恢復窗口、不呼叫工具的最終回覆、更短的循序工作編號，以及 OpenAI/Codex GPT 呼叫中穩定的單次代理執行提示快取身分。儀表板也加入融合膠囊面板，並統一任務與模型控制項。[詳細變化與修正][release]

## 展開設定，再升級

1. 從 [v0.14.1][release] 取得適用於目標平台的安裝套件或伺服器資源。調整帳戶結構前備份現有設定。舊 `[[llm.models]]` 仍可作為相容輸入；標準 provider profiles 優先，明確儲存 Settings/設定時執行遷移。
2. 在 **Settings → LLM → Provider profiles** 中檢查驗證、巢狀模型清單、預設推理強度與自訂 `oauth_file`。確保實際執行任務的程序能取得憑證，遠端伺服器也一樣。
3. 重新啟動無介面伺服器後，用 `genesis status` 檢查狀態；再核對一次明確指定帳戶/模型/強度的任務、一次 Auto 選擇，以及實際使用的遠端連線。重用舊常駐程序腳本前先檢查內容。這些檢查由文件記錄的變化推導而來。

關於執行中任務的操作入口，可繼續閱讀 [Genesis Assistant：更清楚地掌握執行中的工作](/zh-tw/news/genesis-development-2026-11-07)。

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
