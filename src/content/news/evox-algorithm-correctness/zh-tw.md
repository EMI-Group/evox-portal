---
title: "EvoX 1.4.1：一個小修正，為什麼會改變搜尋"
pubDate: 2026-10-30
summary: "SHADE、差分演化與 CMA-ES 的修復說明，可靠的演化計算基礎設施需要同時關注執行效率和演算法行為的一致性。"
updatedDate: 2026-11-08
---

一次搜尋順利結束，也可能始終沿著錯誤的更新規則執行。2026 年 10 月 30 日發布的 EvoX 1.4.1，修正了 SHADE、差分演化與 CMA-ES 中的這類偏差，讓適應機制、取樣和執行行為回到演算法所依賴的定義。

![檢查並校正演算法行為](./algorithm-behavior-calibration.webp)

*讓實作與演算法預期行為對齊。*

## 程式執行了，搜尋卻可能不同

SHADE 的 F 與 CR 成功歷史記憶先前未能自適應更新。改進量在適應度被取代後才計算，且與填充 NaN 的陣列進行算術操作污染了所選數值。修復將改進量計算提前到適應度更新之前，並使用 `torch.where` 選擇成功項目。 [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

差分演化共用的二項交叉算子曾將常態分布隨機樣本與交叉機率比較。修復改用均勻取樣，使其符合機率的含義。相關更新也讓 CoDE、SaDE 和 SHADE 在邊界內均勻初始化種群。這些變化影響產生什麼候選，而不只是程式是否出錯。 [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## 數學定義與執行框架約束

CMA-ES 的修復涉及秩一共變異數更新、累積常數，以及 `torch.cond` 別名限制造成的執行失敗。後者還重新啟用了先前被停用的 CMA-ES 測試。數學公式和執行框架約束都需要檢查，滿足其中一個並不自動滿足另一個。 [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

該版本還處理演化策略的初始化與子空間、錦標賽選擇、PSO 裝置轉移及超體積計算。 [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## 可靠性也是基礎設施的一部分

SHADE 修正也加入回歸測試：執行五步工作流程，檢查適應記憶確實改變，並保持有限值。跨版本比較時，應記錄種子、目標、種群和評估預算，再重跑受影響的基準。升級參考可見[版本記錄](/zh-tw/releases/evox-1-4-1)。
