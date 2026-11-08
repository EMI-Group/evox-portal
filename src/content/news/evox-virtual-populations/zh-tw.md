---
title: "EvoX VirtualES：更多候選，更少權重副本"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "共享中心參數與個體隨機種子，讓 VirtualES 按需重建神經網路擾動，重新分配種群搜尋的記憶體預算。"
---

神經網路種群越大，通常就需要儲存越多份權重。EvoX 在 2026 年 7 月 7—8 日的更新中改用另一種表示方式：VirtualES 只儲存一份共享中心參數和每個候選的隨機種子，在評估時重建彼此的差異。研究者因此可以重新思考：在參數儲存耗盡記憶體之前，還能容納多少搜尋多樣性？

![實體基形、紅色種子與透明變體組成的虛擬種群概念圖](./virtuales-shared-center.webp)

*概念插畫：一個共享中心，多個可重建的候選。*

## 儲存候選的生成方式

若種群有 P 個候選，每個含 D 個參數，顯式儲存需要與 P × D 成正比的空間。中心加種子的表示約需 D + P 個元素。此處比較的是種群參數表示；啟動值、最佳化器狀態和評估緩衝區仍計入總記憶體開銷。[VirtualES 實作](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

VirtualES 將 `(center, seeds, sigma)` 交給工作流程。VirtualProblem 逐層評估網路，透過融合的 Triton 運算完成基礎線性計算，以及由種子產生的權重和偏置擾動。適應度再引導中心參數的下一次更新。此實作採用完整高斯擾動，取代先前的低秩 LoRA 形式。[評估實作](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## 讓每個候選取得自己的回饋

可以從包含線性層和文件支援啟動函數的 `nn.Sequential` 網路開始。將損失函數設為 `reduction='none'`，讓 VirtualProblem 分別彙整各候選的損失。若只回傳一個純量損失，它會被擴展到整個種群，失去個體差異。這個小小的介面選擇會直接影響搜尋。

虛擬種群路徑略過分散式評估與解轉換，VirtualProblem 也不支援 HPO 包裝器。移植既有實驗前，應先核對這些邊界。[工作流程整合](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## 衡量表示方式帶來的實驗空間

先使用受支援的網路，再逐步調整種群規模，在固定評估預算下記錄峰值記憶體、評估時間和適應度。如此可區分參數儲存的收益，以及重建雜訊、處理啟動值的成本。7 月的更新也包含雜訊輔助函數的 [Triton 編譯修正](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)。

若還不熟悉 EvoX 的實驗結構，可以先看[快速入門](/zh-tw/news/evox-quickstart)。VirtualES 提出一個值得實測的問題：當儲存每個候選的完整權重不再是前提，更大的搜尋種群會如何改變您的實驗？
