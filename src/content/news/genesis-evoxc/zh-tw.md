---
title: "Genesis 構建 EvoX Compiler：讓 AI 參與演化基礎設施的開發"
pubDate: 2026-11-03
summary: "EvoX Compiler 案例連線生態中的兩層能力：Genesis 推進軟體開發，生成的編譯器支撐程式變換與執行。"
updatedDate: 2026-11-08
---

演化式 AI 所需的基礎設施，本身也是複雜的軟體工程。Genesis 構建 EvoX Compiler 的案例連線了這兩個層面：智慧體開發系統構建和擴充套件張量圖編譯器，介面約定與迴歸測試則決定哪些變更能夠進入持續發展的實現。

![紅色結構桿貫穿對齊的編譯器分層構件](./compiler-contract-layers.webp)

## 先把職責劃分清楚

EvoX Compiler 構建和變換 EvoXIR 圖，再依次完成表示轉換、編譯、載入和執行。外部編譯器負責最佳化與程式碼生成。NumPy 提供參考直譯器，IREE、XLA 與 TVM 提供可選執行路徑。 [EvoX Compiler](https://genesis.evox.group/evidence/evoxc/)

這些邊界形成具體的驗收標準：圖變換要保留程式含義，後端要支援它接收的運算元，執行時要遵守裝置約束。它們比單純增加程式碼行數更能說明工程進展。

## 開發工作如何組織？

[2026 年 10 月 28 日的 Evidence 快照](https://genesis.evox.group/evidence/evoxc/) 描述了包級上下文文件、單向依賴結構，以及逐層透過測試後繼續推進的方式。倉庫宣告程式碼、測試和文件均由 Genesis 輔助生成。

後續工作持續涉及介面卡、圖表示與基準測試。該記錄依據倉庫歷史重建專案結構，並非對每個智慧體動作的審計；約兩個月的日曆跨度也不能視為連續自主執行時長。

## 驗證需要分層理解

快照報告：安裝 IREE 的配置中，**6,789 項測試透過、46 項跳過、3 項預期失敗**，沒有失敗項；不安裝編譯器的配置中有 **6,367 項透過**。介紹這次實驗時，不應將這些歷史數量替換為後續釋出版本的數字。 [GW-000005](https://genesis.evox.group/evidence/evoxc/)

除單元測試外，獨立的 `evoxc_hf` 整合還比較模型輸出與 torch/transformers 的延遲。比較必須保留檢查點、精度、後端和硬體條件：數值一致性與執行速度是兩個不同指標。

## 將結果和適用範圍一起看

快照中的 **285,659 行跟蹤文字**包含基準資料、測試和文件，不只是編譯器原始碼。約 **50 美元**僅為模型 token 費用，不含硬體；基礎模型、會話數量和實際執行時長沒有報告。

硬體覆蓋也有明確邊界：Vulkan 使用 Mesa lavapipe 軟體裝置，TVM ROCm 僅完成編譯驗證。功能表出現後端名稱，不等於每類裝置均已完成端到端驗證。這些結果由專案報告，尚未獨立復現。

## 連接軟體演化與計算基礎設施

先閱讀 [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) 中的圖處理流程，再將具體主張追溯到測試和[已提交的模型基準報告](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)，同時檢視可用路徑與尚未解決的效能差距。

應用這個方法時，可先選擇一項圖變換或一條後端路徑，明確列出它必須保留的介面契約，並找出涵蓋它的測試。數值檢查與延遲測量應分別記錄。[EvoX Compiler 概覽](/zh-tw/news/evox-compiler)解釋執行流程；這個案例則展示，明確邊界如何讓開發過程可供審查。
