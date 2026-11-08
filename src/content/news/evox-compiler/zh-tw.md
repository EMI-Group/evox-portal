---
title: "EvoX Compiler v0.1.0：讓程式在執行之前就可檢查"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "顯式計算圖、可組合轉換與獨立執行階段，讓研究者能檢查程式結構，並將多個候選程式合併評估。"
---

當搜尋的候選對象本身就是程式，只檢查最終輸出，會讓實驗中的許多環節隱而不見。EvoX Compiler 將程式本身變成可檢查的物件：研究者可以保留計算圖、施加轉換，再透過清楚分開的階段選擇執行後端。

![懸浮的計算圖層逐步變為對齊結構和緊湊的紅色產物](./evoxc-visible-stages.webp)

*概念插畫：從程式定義到執行，中間結構清楚可見。*

**EvoX Compiler（evoxc）v0.1.0** 於 2026 年 10 月 29 日發布。這套 Python 張量圖前端與執行環境要求 Python 3.11 或更新版本，採用 Apache-2.0 授權。 [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## 從定義走向可檢查的可執行物件

處理流程是 `trace → lower → compile → load → run`：追蹤階段根據程式定義和輸入規格構建 EvoXIR 圖；表示轉換階段準備後端表示；編譯生成產物；載入將產物繫結到執行裝置；執行階段提供實際資料。每一步都有可檢查的物件。

這種分離有助於定位問題：計算圖無效、運算元無法轉換和裝置不匹配，是不同層面的問題。圖與受支援的編譯產物也可以儲存。最佳化、排程與程式碼生成由外部編譯器負責，evoxc 提供前端與階段間的介面約定。

## 把一組候選程式放進同一張圖

`vmap`、`grad`、`jvp`、`vjp` 等變換生成新的圖，可以在執行前組合。對於程式空間搜尋，[`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) 能將輸入輸出規格匹配的候選函式組合成一個種群計算圖。

這適用於遺傳程式設計、神經架構搜尋和演算法合成：候選物件可能是不同程式，而不只是不同引數向量。合併有機會減少重複編譯與呼叫開銷，但收益取決於程式結構和後端，並非任何種群都會自動加速。

## 依所需運算選擇後端

NumPy 是唯一必需依賴，提供參考 CPU 直譯器。可選介面卡連線 IREE、透過使用者提供的 PJRT 外掛使用的 XLA，以及透過 StableHLO 前端接入的 TVM。後端可用，不等於運算元與硬體覆蓋完全一致。

版本 README 記錄的 Vulkan 驗證使用 Mesa lavapipe 軟體裝置，TVM ROCm 只完成了編譯驗證。GPU 輸入和裝置放置需要顯式處理；將 CPU 圖遷移到其他目標前，應先核對介面卡的運算元支援範圍。

## 先在 CPU 上執行，再移轉計算圖

安裝固定版本，執行 README 的 CPU 示例，檢查圖結構，再選擇編譯後端：

```bash
pip install evoxc==0.1.0
```

獨立的 HuggingFace 整合以 `evoxc-hf` 安裝，擁有自己的發行套件與升級週期。

## 結合環境理解驗證結果

在安裝文件所列擴充依賴的環境中，版本 README 報告核心與整合測試共 **7,511 項通過、77 項略過、4 項預期失敗**，沒有非預期失敗。略過項目包括硬體與依賴條件檢查。儲存庫註明程式碼、測試和文件均由 Genesis 產生。

API 與支援矩陣見[版本 README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md)，釋出產物見[版本記錄](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)，後續開發見 [GitHub](https://github.com/EMI-Group/evoxc)。

編譯器背後的代理開發過程，見 [Genesis 與 EvoX Compiler](/zh-tw/news/genesis-evoxc)。開始自己的實驗時，可以保留一張參考圖，逐步檢查轉換，再比較不同後端的行為。
