---
title: "EvoX Compiler：Genesis 建構的顯式張量圖編譯系統"
pubDate: 2026-11-03
summary: "Genesis 的 EvoX Compiler 案例記錄了一個 Python 張量圖編譯器與執行階段，提供 NumPy、IREE、XLA 和 TVM 四種執行路徑。"
---

EvoX Compiler（evoxc）將程式的計算圖變成可檢查的產物：前端建構和轉換 EvoXIR，再透過顯式階段完成降低、編譯、載入與執行。NumPy 是唯一必要相依套件，外部編譯器負責最佳化與程式碼生成。

Genesis 官網 **2026 年 10 月 28 日**的 Evidence 快照記錄了 **NumPy、IREE、XLA 和 TVM** 四種執行路徑。儲存庫聲明，其程式碼、測試和文件均使用 Genesis 產出。案例呈現專案從初次建構走向介面與後端持續開發的過程。

在安裝 IREE 的配置下，快照報告 **6,789 項測試通過、46 項略過、3 項預期失敗**，無失敗項。這是歷史快照，並非目前儲存庫的測試總數。記錄的 **285,659 行受版本控制文字**包含測試、基準資料和文件，不能全部視為編譯器原始碼。模型 token 費用約 **50 美元**，不含硬體。

後端驗證結果仍取決於具體配置：記錄中的 Vulkan 驗證使用軟體裝置，TVM 的 ROCm 路徑僅完成編譯驗證。結果由專案方報告，尚未獨立重現。開發者可從儲存庫的顯式計算圖流程及已提交的基準報告開始了解和使用 evoxc。

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
