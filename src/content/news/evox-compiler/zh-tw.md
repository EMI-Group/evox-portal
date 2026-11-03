---
title: "EvoX Compiler v0.1.0 發布：顯式計算圖，多後端執行"
pubDate: 2026-10-29
summary: "EvoX Compiler 首個版本為 Python 帶來可檢查的計算圖、可組合的圖轉換，以及 NumPy、IREE、XLA 和 TVM 執行路徑。"
---

**EvoX Compiler（evoxc）v0.1.0 於 2026 年 10 月 29 日發布。** 這是一套 Python 張量圖編譯器與執行階段，面向希望直接檢查、轉換、儲存和執行程式本身的開發者。專案採用 Apache-2.0 授權，要求 Python 3.11 或更新版本。

## 讓計算過程成為可檢查的程式

evoxc 透過 `trace → lower → compile → load → run` 顯式開放各個階段。前端以 EvoXIR 表達計算，並匯出 StableHLO 交給外部編譯器完成最佳化與程式碼生成。中間計算圖和編譯產物可保留下來，供檢查與持久化儲存。

圖轉換包括 `vmap`、`grad`、`jvp` 和 `vjp`。針對神經架構搜尋、遺傳程式設計與演算法合成，`batch_functions` 可將輸入輸出規格一致的候選程式合併為一個計算圖；顯式編譯快取則服務於反覆生成靜態程式的工作負載。

## 四種執行路徑

NumPy 是唯一必要相依套件，並提供預設 CPU 直譯執行路徑。可選配的介接器將計算圖連接至 IREE、透過使用者提供的 PJRT 外掛接入的 XLA，以及 TVM。後端和裝置由開發者顯式選擇，運算子與硬體涵蓋範圍取決於介接器。發布文件中的 Vulkan 驗證使用 Mesa lavapipe，TVM 的 ROCm 支援僅驗證至編譯階段。

發布版 README 報告，在安裝 IREE、TVM 和 torch 的配置下，核心與 `evoxc_hf` 兩套測試共 **7,511 項通過、77 項略過、4 項預期失敗、0 項失敗**。這是專案方在該配置下報告的結果。儲存庫同時註明，其程式碼、測試和文件均使用 EvoX Genesis 產出。

## 開始使用

可使用下方指令安裝此發布版本。可選配編譯器介接器的設定請見對應版本 README；HuggingFace 整合以 `evoxc-hf` 獨立發行。

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
