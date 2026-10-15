---
title: "EvoX Genesis：約兩天、36 美元完成 WASM Render 挑戰"
pubDate: 2026-10-15
summary: "EvoX Genesis 使用 DeepSeek V4 Flash，耗時約兩天、僅花費 36 美元模型費用完成 WASM Render 挑戰，成為全球首個提交該挑戰成果的 AI 系統。團隊測試紀錄顯示，Khronos CTS 通過 2,017/2,019 項測試（99.90%），其中所執行的 WebGL2.0 一致性測試 1,184/1,184 項全部通過。"
---

能否持續推進長週期任務、最終交付完整工程，正成為衡量 AI 能力的重要指標。Terminal-Bench 是 AI Agent 領域的代表性評測基準之一，著重於終端機環境中的程式與命令列任務。Terminal-Bench Challenges 則將評測推進到從零建構完整軟體專案，官方估計每項挑戰的成本超過 1,000 美元。

EvoX 團隊推出的遞迴演化式 AI 系統 EvoX Genesis，此次使用 DeepSeek V4 Flash 模型，耗時約**兩天**、僅花費 **36 美元**模型費用完成 WASM Render 挑戰，成為**全球首個提交該挑戰成果的 AI 系統**。團隊測試紀錄顯示，Khronos CTS 套件通過 2,017/2,019 項測試（99.90%），其中 WebGL2.0 一致性測試 1,184/1,184 項全部通過。

## 從局部程式碼到完整系統，難關在哪裡？

WASM Render 是 Terminal-Bench Challenges 中的一項圖形系統挑戰：讓 WebGL 程式在沒有瀏覽器、GPU 和外部執行階段函式庫的條件下運作。

這相當於用軟體實作一套圖形管線：理解著色器程式、計算圖形，再讓大量介面與狀態變化保持一致。單個局部功能可用，距離整套系統協同運作，還有很長的路。該任務要求 AI 在多輪開發中持續對齊目標、處理模組相依性，依據測試回饋修正錯誤，最終完成系統整合與迴歸驗證。

根據 Terminal-Bench 團隊公布的 12 小時早期試跑結果，Cognition 的 AI 軟體開發產品 Devin 搭配 Fable 5，在更難的 WebGL2.0 一致性測試上通過率為 20.5%。Genesis 則在約兩天開發後，將所執行的 WebGL2.0 一致性測試通過率推進到 100%。

![WebGL2.0 一致性測試結果與 Genesis 的 Khronos CTS 測試紀錄](./wasm-render-results.png)

*WebGL2.0 一致性測試結果與 Genesis 的 Khronos CTS 測試紀錄。*

Genesis 公開的成果儲存庫包含約 **13 萬行程式碼**，涵蓋 GLSL 著色語言編譯器、WebGL 介面與狀態管理、軟體光柵化、影像呈現等模組。這些 TypeScript 實作經建置形成 JavaScript 繪製器，將語言處理、圖形計算和介面行為串聯起來。

本次開發最終通過 2,017 項 Khronos CTS 測試，模型 token 費用約為 36 美元，其中快取命中率約 98%。在較低模型成本下持續推進並整合如此大規模的軟體工程，這也展現出 Genesis 利用經濟型開源模型進行長週期開發的能力。

## 讓專案持續演化，讓 Agent 按需登場

Genesis 是一套遞迴演化式 AI 系統。使用者描述軟體開發目標，系統圍繞目標展開任務，讓局部 Agent 在需要的位置承擔工作，並將獲接納的程式碼與驗證結果保留在軟體專案中。

面對大型專案，一種直觀的思路是為 Agent 加碼：更長的上下文、更持久的工作階段、更複雜的預設協作。Genesis 則把開發的連續性放在軟體專案上——頂層目標與約束貫穿開發，任務隨儲存庫結構遞迴展開。Agent 處理局部工作、完成後退出，後續 Agent 從已經形成的專案繼續。

此前，Genesis 已從空儲存庫出發，建構出約 25 萬行程式碼的 C 編譯器，並進行了跨模型接續開發。本次 WASM Render 挑戰的測試結果，進一步驗證了 Genesis 在複雜圖形系統開發中的自主建構與整合能力。

## 開源與社群

EvoX 團隊將持續深耕遞迴演化式 AI 系統，推動程式碼、驗證結果與開發經驗在開源社群中累積，讓更多開發者參與可持續的軟體演化，共同建設開放的軟體開發生態系。

🔗 Genesis 儲存庫：[https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Genesis 論文：[https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ 挑戰成果儲存庫：[https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 上游專案（EvoX）：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 QQ 交流群組：297969717
