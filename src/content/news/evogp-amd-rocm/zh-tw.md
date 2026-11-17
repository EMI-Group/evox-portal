---
title: "EvoGP：讓樹式程式搜尋執行在 AMD GPU 上"
pubDate: 2026-06-18
updatedDate: 2026-11-17
summary: "ROCm 支援透過按後端配置編譯引數及修正執行緒私有直譯器棧，將 EvoGP 的 PyTorch 擴充套件帶到 AMD 硬體。"
---

使用 AMD GPU 的研究者，無需另行維護搜尋引擎，也能探索 EvoGP 的樹式遺傳程式設計。[PR #12][s2] 於 2026 年 6 月 17 日 UTC（北京時間 6 月 18 日）合入，透過 ROCm/HIP 打通這條路徑。變化既涉及擴充套件如何構建，也涉及程式執行時如何保持原有語義。

![相同程式樹位於兩種不同加速器板卡上方](./rocm-backend.webp)

*概念插畫：同一種程式表示跨越 GPU 後端邊界。*

## CUDA 與 ROCm 共用原始碼

6 月的整合使用 PyTorch 在構建時進行 HIP 轉換，將 EvoGP 的 CUDA 擴充套件原始碼編譯到 AMD GPU。編譯參數按後端選擇，並保護僅屬於 CUDA 的標頭檔案，避免破壞 HIP 構建。安裝 ROCm 版 PyTorch 後，使用者無需維護另一套演算法實現即可構建擴充套件。

該工作還將樹直譯器中的動態裝置棧分配替換為固定大小的區域性陣列。貢獻者將 AMD 上的錯誤執行追溯到駐留 wavefront 之間的分配別名問題。每個執行緒的棧必須獨立：若一棵程式樹使用了其他執行緒的臨時狀態，適應度可能錯誤，繼而影響選擇。

## 轉換核心原始碼只是構建的一部分

PyTorch 的 HIP 轉換會處理 CUDA 原始碼，但編譯引數仍會傳給裝置編譯器，面向 NVIDIA 編譯器的選項不能直接交給 `hipcc`。合入後的構建按後端選擇引數：CUDA 保留原列表，ROCm 分支採用 `-O3`，並單獨保護僅屬於 CUDA 的標頭檔案。這些是具體的構建邊界：ROCm PyTorch 提供轉換路徑，EvoGP 仍需讓自身構建配置與之相容。[構建改動][s2]

## 按後端準備構建環境

[原始碼安裝說明][s3] 要求適合的 GPU 工具鏈、C++ 編譯器和匹配的 PyTorch。AMD 路徑使用包含 `hipcc` 的 ROCm 及 ROCm PyTorch，然後以 `--no-build-isolation` 從原始碼構建 EvoGP，讓擴充套件使用已安裝的 PyTorch 環境。

ROCm 下的範例仍使用 `cuda` 裝置字串，這是 PyTorch 對這些裝置提供的介面。需要指定 AMD 架構時，使用 `PYTORCH_ROCM_ARCH` 控制目標。這個選擇屬於構建配置，無需重寫樹表示或演化運算元。

## 在已驗證的後端執行同一搜尋

貢獻者報告在 AMD MI250X、W7800、RX 9070 XT 和 PRO V710 上完成符號回歸檢查，具體作業系統及 ROCm 版本列於 PR。檢查採用 1,000 個體、100 代和固定種子，屬於這些配置下的專案報告結果，不能外推為與硬體無關的效能保證。

```bash
python -m evogp.sr_test
```

開展符號迴歸實驗前，先確認擴充套件能夠構建、小型迴歸檢查能以有限適應度正常完成。貢獻者的檢查覆蓋 wave32 和 wave64 裝置，報告的是固定種子軌跡吻合，而非新的通用加速結論。此後比較自己的硬體時，應保留相同資料集、種群和種子。[EvoGP 介紹][related] 解釋程式表示，後續的[種群報告修正][logging] 則針對另一類整代開銷。

[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/5538d75470ee0fa444ee6bbe5ea98b2eed6e99f8/README.md
[related]: /zh-tw/news/evogp
[logging]: /zh-tw/news/evogp-rocm-population-execution
