---
title: "Genesis 串聯賬戶設定、模型選擇與 ChatGPT 登入"
pubDate: 2026-11-22
updatedDate: 2026-11-26
summary: "重建的提供方向導統一管理憑據、模型清單、推理選項和排程，並新增由 Genesis 管理的 ChatGPT 訂閱連線。"
---

可用的模型連線不只是一個模型名稱：認證、端點、支援的推理選項和共享賬戶限制必須相互匹配。2026 年 11 月 19—20 日合入 Genesis `main` 的變更，圍繞提供方賬戶重建了 Welcome 與 Settings。PR #175 加入 **Sign in with ChatGPT**，替換 ChatGPT 訂閱配置此前匯入 Codex 憑據的方式。[已合併的整合][pr]

![賬戶鑰匙與選定模型的配置配件整齊放在同一儀器盒內](./cover.webp)

*概念插畫：認證與模型選擇屬於同一個配置賬戶。*

## 先配置賬戶，再配置模型

Welcome 現在採用分步提供方向導，Settings 負責後續賬戶管理。自動生成的賬戶名稱與標識來自提供方，而不是所選模型。一個賬戶可以包含多種模型與推理選項，共享憑據、併發和排程；這些屬性不同時，仍應分別建立賬戶。[配置約定][profiles]

例如，使用 OpenAI 相容端點的團隊可以先配置一次基礎 URL 和憑據，再加入端點實際提供的模型，然後為任務選擇模型和推理等級。合入的整合讓自定義端點能夠輸入 API 金鑰，並透過 OpenAI Chat Completions 路由自定義模型賬戶。每個可選模型仍必須有清單條目，僅填寫預設模型名稱不會完成登記。應測試選中的模型，而不只是確認憑據框已經填寫。[整合與瀏覽器檢查][pr]

嚮導將模型公佈的推理選項與預設值分開。選定的預設值會進入儲存的模型條目和連線測試請求。統一等級為 `none`、`minimal`、`low`、`medium`、`high`、`xhigh`；舊值 `max` 會按 `xhigh` 讀取，後續儲存時寫成規範值。提供方自己的拼寫在請求邊界轉換。支援範圍仍取決於實際模型，介面展示等級不代表每個端點都接受全部選項。[推理規則][profiles]

## 透過 Genesis 授權 ChatGPT

在 Welcome 或 **Settings → LLM → Provider accounts** 中選擇 **ChatGPT Subscription**。版本化指南給出的登入與檢查命令為 `genesis chatgpt login`、`genesis chatgpt status` 和 `genesis chatgpt models`。從原始碼檢出執行時，登入入口為 `mix genesis.chatgpt login`。在瀏覽器中開啟顯示的 URL，完成對 Genesis 的授權。[訂閱指南][oauth]

登入後使用 **Check connection**，選擇登記的賬戶以及該賬戶可用的模型。在 Settings 中，先儲存賬戶，再執行 **Connection Test**；Welcome 則在完成設定前測試所選模型。為保持相容，配置仍使用 `provider = "openai_codex"`，認證方式為 `auth_mode = "oauth"`，由 `siwc_account` 標識 Genesis 的賬戶登記。

現有訂閱配置需要透過 Genesis 重新授權：此連線不使用舊版本從 Codex 匯入的憑據。如果此前選擇的模型不在新發現的清單中，應改選可用模型。OpenAI API 金鑰賬戶仍是獨立選項。需要多個登記賬戶時，可用 `genesis chatgpt login --account work` 指定別名，再在配置中選擇該別名。[遷移與別名][oauth]

## 讓連線歸屬於執行主機

所選賬戶的憑據在執行節點解析和重新整理。登入 CLI 與執行中伺服器之間的憑據更新會序列處理，避免把瀏覽器中可見的賬戶登記誤當成另一臺遠端主機上的連線。[賬戶儲存][store]

對於自託管部署，指南說明了如何透過 SSH 轉發迴環登入埠，並使用與 Genesis 服務相同的賬戶和配置目錄執行登入。它還提供受保護的憑據轉移方式，以及需要 HTTP CONNECT 代理時可用的 `GENESIS_SIWC_HTTPS_PROXY`。測試推理前應按具體主機完成配置；只在筆記本上登入不會配置另一臺伺服器。

PR 中的 ChatGPT 重新整理和流式處理檢查使用了測試夾具，該輪評審尚未驗證真實 ChatGPT 賬戶的全新瀏覽器授權。對自己的部署，應以目標主機實際返回模型響應來確認設定成功。[驗證範圍][pr]

## 明確賬戶排程規則

同一賬戶模型還包含高峰與非高峰併發、時區和排程策略。新增預設可以預填受支援提供方的排程，但槽位數是可編輯的 Genesis 預設設定，不保證提供方容量或費用節省。同一賬戶的所有模型共享槽位，增加模型不會建立額外配額池。[預設實現][presets]

`off_peak_holidays = "CN"` 將內建中國日曆加入賬戶排程，包括調休工作日。日曆是靜態資料，覆蓋 2025—2027 年，不會自動更新。依賴它之前，應檢查時區、週末規則與預設假設。高峰併發為零會讓新請求排隊；降低容量不會驅逐已經執行中的工作。[排程語義][profiles]

切換到包含這些變更的構建後，應重新檢查各賬戶的模型清單、預設推理選項和執行主機。ChatGPT 配置需要重新授權並執行連線測試；採用排程的賬戶應檢查儲存的規則和預期的下一次切換。這些檢查對應未來任務實際使用的身份與限制。

## 儲存後重新整理模型選項

2026 年 11 月 23 日合入 `main` 的更新，將儲存 ChatGPT 註冊資訊與設定重新整理連接起來。同一執行節點上的設定變更會重新載入專案的模型選擇器；關閉工作台設定視窗也會觸發重新載入。被捨棄的結果現在會顯示可重試錯誤，避免選擇器一直停在載入狀態。遠端連線就緒後再重試。 [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

帳戶尚未設定完整時，排程器不再陷入當機循環，而是記錄預設模型無法解析的警告。請補齊帳戶的模型清單並選擇有效模型，再依賴該預設選項。 [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex

2026 年 11 月 25 日的修改會在本地 BEAM 節點身份自頁面掛載後發生變化時拒絕設定儲存。請先重新載入頁面的節點上下文再重試，避免寫入回執仍屬於過時的配置範圍。 [GitHub](https://github.com/EMI-Group/genesis/commit/5ed383a3e803df692bd105504b36aa65768e7a3b).
