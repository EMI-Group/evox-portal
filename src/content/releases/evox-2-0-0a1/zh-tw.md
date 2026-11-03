---
title: "EvoX v2.0.0a1：以 EvoX Compiler 全面重寫"
pubDate: 2026-10-30
summary: "實驗性 Alpha 版本帶來新的函數式 API 與顯式張量圖編譯器。正式環境仍建議使用穩定的 1.x 系列。"
---

**EvoX v2.0.0a1** 是以 [EvoX Compiler（`evoxc`）](https://github.com/EMI-Group/evoxc) 全面重寫後的首個 Alpha 版本。

> **實驗性預先發布版本：** 新 API 與 1.x 不相容，無法直接替換升級。正式環境仍建議使用穩定的 1.x 系列；請在獨立環境中試用 Alpha。

## 顯式編譯流程

EvoX Compiler 讓張量圖可檢視、可轉換，將追蹤、圖轉換、降階、編譯與執行分為獨立階段。它支援 `vectorize`/`vmap`、`grad`、`jvp`、`vjp` 和 `batch_functions` 等可組合轉換，提供 NumPy、IREE、TVM 與 XLA/PJRT 後端。StableHLO 為編譯後端提供共同的降階邊界。

EvoX 2.0 不再依賴 PyTorch 或 JAX。NumPy 是 EvoX Compiler 唯一必要的執行階段相依套件；編譯後端為選用元件。

## 新的函數式 API

- 演算法使用 `init(config, key)` 與 `step(config, state, evaluate)`。
- 問題使用 `evaluate(config, state, candidates)`。
- 設定不可變，張量狀態明確傳遞，隨機性使用可重現的 PRNG key。
- `StdWorkflow` 追蹤一個演化步驟，以所選後端編譯並執行最佳化迴圈。

## 首個 Alpha 包含的功能

- **32 個演算法類別**與 **15 個演化運算子**。
- 基本數值基準、DTLZ、CEC2022 與虛擬神經演化。
- GD、IGD 與超體積指標；Plotly 視覺化與 `.exv` 軌跡。
- 主機端超參數最佳化，以及透過 `evox_ext` 自動探索擴充套件。

上游發布說明回報 **NumPy 後端通過 552 項測試**；這不表示編譯後端或 GPU 具有同等測試涵蓋範圍。

## 安裝

需要 **Python 3.11+**。請在獨立環境中選擇一種安裝方式：

```bash
pip install --pre "evox==2.0.0a1"
```

如需選用的編譯器支援：

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## 目前限制

分散式工作流程、Brax/MuJoCo、PyTorch 神經網路整合與 Triton 核心尚未移植。編譯後端與 GPU 執行仍屬實驗階段，部分運算子及控制流程模式尚未支援所有後端。監控、視覺化、指標與 HPO 目前在編譯圖之外執行。預先發布期間 API 仍可能變動。

歡迎透過 [GitHub Issues](https://github.com/EMI-Group/evox/issues) 提交錯誤回報、基準結果與 API 意見。

**發布紀錄**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
