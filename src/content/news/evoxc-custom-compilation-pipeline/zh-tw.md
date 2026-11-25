---
title: "EvoX Compiler 開放自定義編譯流程"
pubDate: 2026-11-25
summary: "main 分支新增自定義呼叫、內聯 StableHLO 和編輯後模組的編譯入口，並透過後端能力宣告明確不受支援的路徑。"
---

實驗性操作可能超出張量庫的能力，而周圍的程式並不需要整體改變。EvoX Compiler 在 2026 年 11 月 23–24 日的預設分支更新中，加入了插入編譯器專用操作、編譯編輯後的中間程式碼和選擇自定義後端的入口。關鍵是先確定擴充套件在哪一層執行：編譯器內部、執行時核心，還是整個後端。[實現與指南][guide]

![可拆卸光學模組接入導軌，紅色光路連續穿過各階段](./cover.webp)

*概念插畫：替換一個階段，同時保持周圍流程清晰可見。*

## 先選擇自定義操作的邊界

`custom_call` 生成一個具名 StableHLO 呼叫，攜帶顯式結果宣告和可選後端配置；外部編譯器判斷目標是否存在、能否完成降級。`inline_stablehlo` 則嵌入原始程式碼片段：運算元使用 `%in0` 等順序編號，結果必須賦值給 `%out0` 等對應編號，結果規格仍需明確宣告。名稱、配置和程式碼片段是參與圖特化的靜態值。[操作契約][ops]

這些入口不會替你向 IREE 或 PJRT 註冊任意核心。需要在執行時執行的 Python 或 Triton 核心，仍應使用已有的 `external_call` 註冊路徑；用普通 EvoX Compiler 操作表達的可移植操作，則可以選擇帶分解實現的 block。區分這些路徑，才能避免把編譯宣告誤認為執行時實現。

## 編輯中間程式，再交給編譯器

例如，編譯器開發者可以用 `source_text()` 檢查可執行物件，編輯其 StableHLO，再透過 `compile_text` 連同輸入、輸出規格提交。這條路徑跳過追蹤和圖構建，隨後沿用正常的編譯與載入階段。規格描述的是外層元組，因此執行時必須保持元組形式的輸入輸出契約。模組由外部編譯器驗證；文字成功提交併不代表數值結果已經正確。[流程實現][pipeline]

每次編輯後，保留一組小規模輸入，與原程式比較結果。缺失的自定義目標應在編譯器合法化階段診斷，不能透過悄悄切換後端掩蓋。NumPy 直譯器和原生 CPU 引擎會明確拒絕這些編譯擴充套件。新增圖內操作也沒有自動批處理和求導規則，需要這些變換時應選擇已有支援的實現路徑。[能力與限制][guide]

## 明確接入哪個後端

後端例項現在會在流程各階段保持一致。註冊介面支援顯式替換和移除，入口點允許外部包提供後端。編譯後端需要宣告能力與支援的資料型別，並實現編譯和載入；空的資料型別集合會拒絕所有圖。自定義 IREE 編譯器和執行時模組可透過選項或環境變數傳入，便於測試自定義編譯器構建，同時避免混用預設執行時。[後端擴充套件指南][guide]

## 分別檢查傳輸和數值比較

同一開發時段也調整了 Vulkan 傳輸：不超過 16 MiB 的上傳使用對映的一致性緩衝區，更大資料走複製路徑；回讀則區分真正的主機記憶體與僅對主機可見的 GPU 記憶體。原始碼記錄的測量來自一套 Intel 整合顯示卡、Mesa 和 IREE 環境，應在自己的硬體上分別測量傳輸與執行。[傳輸實現][transfer]

原生 CPU 的更新也為大型緩衝區和傳入陣列重用儲存空間，減少重複配置開銷。歸約執行緒依獨立輸出拆分工作，同時保留每個輸出的折疊順序。編譯介面也開放了 `split_reduction_threshold` 和 `split_reduction_non_exact`；調整歸約策略時，應同時檢查數值結果與耗時。 [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

原生 CPU 的 `power` 修復還使指數處理與 NumPy 的浮點冪路徑一致，並在一致性檢查工具中明確區分整數、布林值的精確比較與浮點數的容差比較。採用這一原始碼修訂前，保留參考輸出，測試所選編譯器和裝置，並核對比較容差。此前的 [v0.1.1 版本公告][release] 介紹了原有準備流程；本次原始碼更新擴充套件了開發者定製該流程的方式。[數值修復][power]

[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /zh-tw/releases/evoxc-0-1-1
