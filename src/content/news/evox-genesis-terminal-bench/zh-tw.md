---
title: "EvoX Genesis 以 36 美元完成並提交 Terminal-Bench WASM Render 挑戰"
pubDate: 2026-09-10
summary: "EvoX 團隊已使用 Genesis 完成並提交 Terminal-Bench Challenges 中的 WASM Render 挑戰，本次運行記錄的模型成本為 36 美元，遠低於 Terminal-Bench 所述每項挑戰 1,000 美元以上的預期成本。截至本文發布，Genesis 可能是首個公開報告完成並提交 Terminal-Bench Challenge 成果的自主系統。"
---

![EvoX Genesis 完成並提交 Terminal-Bench WASM Render 挑戰](./evox-genesis-terminal-bench-hero.png)

EvoX 團隊已使用 Genesis 完成並提交 Terminal-Bench Challenges 中的 WASM Render 挑戰，本次運行記錄的模型成本為 **36 美元**。

截至本文發布，**Genesis 可能是首個公開報告完成並提交 Terminal-Bench Challenge 成果的自主系統**。

## WASM Render：從零打造完整的 WebGL 軟體堆疊

WASM Render 要求實作一個純 JavaScript/WASM 軟體渲染器，為 Node.js 專案提供 WebGL 1.0 與 2.0 API。目標環境不得依賴瀏覽器、GPU、C++ 原生綁定或外部程式庫。

依照挑戰定義，解決方案需要涵蓋 GLSL 編譯器、三角形光柵化器以及 WebGL API 介面。Terminal-Bench 為該任務規定的驗證範圍包括 2,071 項 Khronos CTS 測試，以及 three.js 與 Babylon.js 的視覺迴歸測試。這裡描述的是挑戰的驗收目標，並不表示 Genesis 的提交目前已通過 Terminal-Bench 的官方評估。

許多編碼代理基準以單一錯誤修復或局部功能為單位。WASM Render 的不同之處在於，工作需要橫跨大量相互依賴的模組，並在持續實作、整合與驗證的過程中保持整個程式碼庫一致。

這類任務會持續暴露長週期開發中的核心問題：局部修改是否符合整體架構，早期決策能否被後續工作正確繼承，以及驗證結果能否成為下一輪開發的可靠依據。Terminal-Bench Challenges 將評價對象擴大到完整軟體專案，正是為了觀察這種能力。

![Terminal-Bench Challenges 與短週期編碼任務比較](./evox-genesis-terminal-bench-comparison.jpg)

## Genesis 如何維持長週期開發

Genesis 不依賴一個持續存在的代理或不斷增長的單一上下文來保存全部開發狀態。軟體專案本身構成持續存在的「世界」：被接受的軟體版本記錄當前事實，儲存庫路徑限定代理所處的責任範圍。

生命週期有限的智慧代理圍繞儲存庫結構遞迴展開，在局部範圍內實作、檢查與驗證候選修改。代理的輸出首先是提案；只有被接受的程式碼與驗證證據才會進入專案歷史，並由後續代理繼承。

對於 WASM Render 這樣的系統工程任務，這使單一代理能夠處理明確、有限的局部問題，同時讓編譯器、渲染管線、狀態管理與相容性工作沿著同一份程式碼與驗證歷史持續演進。

Genesis 僅花費 36 美元便完成了 WASM Render 挑戰，遠低於 Terminal-Bench 所述的每項挑戰 1,000 美元以上的預期成本。

我們的內部非正式測試也表明，Genesis 能夠有效處理約 10 萬行程式碼規模的程式碼庫。對於 100 萬行及以上規模的程式碼庫，我們的實務經驗相對有限，但迄今為止的嘗試進展順利。

🌐 專案官網：

https://genesis.evox.group/

🔗 **GitHub**：

https://github.com/EMI-Group/genesis

🌐 QQ 群：297969717

![QQ 群 QR Code](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>QQ 群｜</strong>Evolutionary Machine Intelligence</center>
