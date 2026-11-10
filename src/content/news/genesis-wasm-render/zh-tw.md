---
title: "Genesis WASM Render：修復 WebGL 渲染器中的驗證順序與畫素精度"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "兩項已記錄的 WebGL2 修復將根本原因與迴歸結果聯絡起來，而最終驗證記錄則將 API 一致性與視覺匹配區分開來。"
---

軟體 WebGL 渲染器不僅要能繪製出可辨認的影象，還必須編譯著色器、維護 API 狀態、按正確順序驗證輸入，並在模組邊界間保持影象精度。Genesis WASM Render 案例包含兩個具體的示例，展示了這些要求是如何被除錯和重新檢查的。

![線框幾何體變為著色畫素影象](./software-graphics-pipeline.webp)

[Evidence 記錄](https://genesis.evox.group/evidence/tbench-wasm/)描述了一個使用 DeepSeek V4 Flash 開發的 TypeScript 實現：透過了 2,017/2,019 個 Khronos CTS 用例，模型 token 費用約為 36 美元，從第一個到最後一個智慧體提交（commit）歷時 65.9 小時。該時間間隔是倉庫的歷史跨度，而非測得的智慧體活躍執行時間。

## 按介面拆分圖形流水線

[原始碼架構](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md)將著色器編譯與連結、光柵化、WebGL 狀態與物件，以及呈現/影象解碼進行了分離。著色器結果仍需經過插值、片元執行、紋理處理和繪製緩衝區，才能成為可見影象。

該渲染器不依賴額外的執行庫，目標是在不呼叫原生 GPU 渲染的環境中執行。儘管如此，仍使用基於瀏覽器的一致性測試框架對其進行測試；該驗證環境與渲染器的執行時依賴宣告是不同的。

## 安全錯誤必須發生在紋理繫結錯誤之前

一個失敗的 WebGL2 頁面涉及跨域汙染（origin-tainted）的影象源。[最終驗證記錄](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f)將其歸因於驗證順序，而非缺失 worker 能力。

該實現在檢查源是否為同源安全（origin-clean）之前，先檢查了紋理繫結。修復提交 `7d8718a` 將安全檢查移至所有六個相關影象源入口點的繫結驗證之前，涵蓋了影象和子影象上傳。受影響頁面的測試結果從 **9 個透過 / 4 個失敗的子測試變為 13 / 0**。

這是一個整合問題：兩項檢查都存在，但它們的順序改變了可觀測的 API 行為。定向測試透過後，專案又進行了全量回歸，檢查其他頁面是否仍然透過。

## 高位深紋理在上傳前就丟失了精度

第二個頁面測試了更高精度的紋理輸入。同一份記錄發現了一個影象解碼路徑，該路徑在上傳前將源壓縮成每通道 8 位精度。修復提交 `89e4559` 和 `9bd7811` 增加了一個 JavaScript 16 位 PNG 路徑並修正了通道處理，包括 RGBA 輸入。

`tex-image-10bpc` 頁面從 **2 個透過 / 1 個失敗的子測試變為 3 / 0**。相關的實現是[呈現層 PNG 解碼器](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts)。這個例子說明了為什麼僅靠改變著色器算術運算無法解決所有的精度失敗：資料在上游解碼階段已經丟失了精度。

## 核對提交的構建產物與實際執行的渲染器

[8 月 29 日的最終記錄](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md)確定了 bundle 提交版本 `c4ffbff`。記錄指出，檢入的 `renderer.js` 是按檢出狀態直接測試的，未為了驗證而重新構建。

| 評估測試集 | 透過 | 失敗 | 超時 / 錯誤 |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1,184/1,184 | 0 | 0 / 0 |
| 合計 | 2,017/2,019 | 2 | 0 / 0 |

測試分母來自該版本測試樹中的清單。記錄還指出，所有 2,019 個評分頁面均報告軟體渲染器處於活動狀態，因此原生回退（fallback）並未提供透過的結果。對於那兩個修正後的 WebGL2 頁面，全量執行在恢復這兩個失敗項的同時，也保留了之前透過的頁面。

![記錄的 Genesis 執行的 WebGL 一致性結果](./wasm-render-results-en.png)

*歷史結果圖表；版本化的最終記錄定義了評估的 manifest 和計數。*

## 使用對照組調查剩餘失敗項

仍有兩個 WebGL1 頁面失敗。最終記錄將低 Alpha 顏色案例歸因於 Chromium 的 2D-canvas 呈現/回讀行為，並報告原生 WebGL 也存在同樣的失敗。對於雙下劃線著色器識別符號，記錄顯示原生 Chrome 同樣未能透過該測試頁。

這些是專案記錄的對照結果，而非獨立的復現。它們解釋了作者對剩餘項的分類，而沒有將 2,017/2,019 變成無條件的相容性宣告。

視覺對比是一項單獨的檢查。Evidence 記錄報告，在選定的子集中，**16/38 個 three.js 頁面達到了 0.1% 的嚴格畫素閾值**，以及 **13/16 個 Babylon.js 場景**。API 一致性和畫素一致性衡量的是不同的屬性；高 CTS 計數並不能消除視覺上的失敗。

## 追蹤從測試頁到最終產物的失敗過程

在準備好所需的測試樹和框架依賴項後，最終記錄給出了以下 WebGL2 測試入口：

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

記錄指出，詳細的 JSON 輸出已被 gitignore 忽略。已提交的報告和修復編號構成公開的追溯線索；本文並未重新執行該測試集。

該存檔的 135,165 行受 Git 跟蹤的文字包括生成的 bundle、第三方庫、lockfile 和文件。36 美元涵蓋了模型 token，不包括硬體。在檢查此案例時，請從驗證順序修復及其測試頁開始：它將特定的失敗、原始碼更改和整合結果聯絡起來，而不僅僅依賴於程式碼量。
