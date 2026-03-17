---
title: "使用非 NVIDIA GPU"
order: 16
section: "misc"
---

# 使用非 NVIDIA GPU

本指南說明如何在 EvoX 環境下，於 PyTorch 中使用 AMD GPU 和 Apple Silicon GPU。

雖然 NVIDIA GPU 是一個可靠的選擇，且通常提供強大的效能，但較新的型號主要針對深度學習工作負載和大型語言模型進行了優化。它們的許多進階功能（例如對低精度資料類型的支援）目前在 EvoX 中尚未被充分利用。在某些情況下，非 NVIDIA GPU 可以為演化任務提供更好的效能和更低的成本。

## AMD GPU 支援

PyTorch 中的 AMD GPU 支援是透過 ROCm 提供的。AMD 裝置會被識別為 `cuda` 裝置（就像 NVIDIA GPU 一樣）。要使用 AMD GPU：

1. 安裝與 ROCm 相容的 PyTorch 版本。
2. 使用標準的裝置設定，例如 `device = torch.device("cuda")`。

除了使用 ROCm 版本外，不需要進行其他更改。

## Apple Silicon GPU 支援

如果您擁有 Apple Silicon Mac，您可以利用內建的 GPU 來加速您的 EvoX 工作負載。
Apple Silicon GPU 透過 Metal Performance Shaders (MPS) 後端提供支援，並可在 PyTorch 中使用 `mps` 裝置進行存取。

要使用 Apple Silicon GPU：

1. 確保您已安裝與 MPS 相容的 PyTorch 版本。
2. 將您的張量和模型移動到 `mps` 裝置，例如 `device = torch.device("mps")`。

> **注意：**
> `mps` 裝置**不**支援編譯（例如 `#evox.compile`）。