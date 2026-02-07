---
title: "使用非 NVIDIA GPU"
order: 16
section: "misc"
---

# 使用非 NVIDIA GPU

本指南說明如何在 EvoX 的環境中使用 AMD GPU 和 Apple Silicon GPU 搭配 PyTorch。

雖然 NVIDIA GPU 是可靠的選擇且通常提供強大的效能，但較新的型號針對深度學習工作負載和大型語言模型進行了最佳化。它們的許多進階功能（如對低精度資料類型的支援）目前在 EvoX 中尚未充分利用。在某些情況下，非 NVIDIA GPU 可以為演化任務提供更好的效能和更低的成本。

## AMD GPU 支援

PyTorch 中的 AMD GPU 支援透過 ROCm 提供。AMD 裝置被識別為 `cuda` 裝置（與 NVIDIA GPU 相同）。要使用 AMD GPU：

1. 安裝與 ROCm 相容的 PyTorch 版本。
2. 使用標準的裝置設定，例如 `device = torch.device("cuda")`。

除了使用 ROCm 版本外，不需要額外的更改。

## Apple Silicon GPU 支援

如果您擁有 Apple Silicon Mac，您可以利用內建的 GPU 來加速 EvoX 工作負載。
Apple Silicon GPU 透過 Metal Performance Shaders（MPS）後端支援，可在 PyTorch 中使用 `mps` 裝置存取。

要使用 Apple Silicon GPU：

1. 確保已安裝與 MPS 相容的 PyTorch 版本。
2. 將您的張量和模型移動到 `mps` 裝置，例如 `device = torch.device("mps")`。

> **注意：**
> `mps` 裝置**不**支援編譯（例如 `#evox.compile`）。
