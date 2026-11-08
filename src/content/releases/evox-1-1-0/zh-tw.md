---
title: "EvoX 1.1 發布：現已支援 torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 使用 torch.compile 取代 TorchScript，透過 TorchDynamo 在 Python 執行過程中擷取計算圖。"
---

![展開程式結構以檢查編譯過程](./execution-graph-capture.webp)

## 編譯後端更新

EvoX 1.1 使用 `torch.compile` 取代 TorchScript，透過 TorchDynamo 在 Python 執行過程中擷取計算圖。

## 工作流程編譯

本次更新引入工作流程步驟編譯，使執行路徑與 PyTorch 編譯器銜接，支援的張量操作可在計算圖內統一最佳化。

## 相容性

圖擷取取決於工作流程使用的操作與控制流程。不支援的程式碼可能造成圖中斷；整合編譯器並不代表任意 Python 函式庫呼叫都能被編譯。

## 相關資源

- [GitHub](https://github.com/EMI-Group/evox)
- [文件](https://evox.readthedocs.io/en/latest/)
