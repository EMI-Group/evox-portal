---
title: "使用非 NVIDIA GPU"
order: 16
section: "misc"
---

# 使用非 NVIDIA GPU

本指南介绍如何在 EvoX 中使用 AMD GPU 和 Apple Silicon GPU 配合 PyTorch。

虽然 NVIDIA GPU 是可靠的选择，通常性能表现优异，但较新的型号针对深度学习工作负载和大语言模型进行了优化。它们的许多高级功能（如对低精度数据类型的支持）目前在 EvoX 中尚未充分利用。在某些情况下，非 NVIDIA GPU 可以为进化计算任务提供更好的性能和更低的成本。

## AMD GPU 支持

PyTorch 通过 ROCm 提供 AMD GPU 支持。AMD 设备被识别为 `cuda` 设备（与 NVIDIA GPU 相同）。要使用 AMD GPU：

1. 安装兼容 ROCm 的 PyTorch 版本。
2. 使用标准的设备设置，例如 `device = torch.device("cuda")`。

除了使用 ROCm 构建版本外，无需其他额外更改。

## Apple Silicon GPU 支持

如果你拥有 Apple Silicon Mac，可以利用内置 GPU 来加速 EvoX 工作负载。
Apple Silicon GPU 通过 Metal Performance Shaders (MPS) 后端提供支持，可以在 PyTorch 中使用 `mps` 设备进行访问。

要使用 Apple Silicon GPU：

1. 确保已安装兼容 MPS 的 PyTorch 版本。
2. 将张量和模型移动到 `mps` 设备，例如 `device = torch.device("mps")`。

> **注意：**
> `mps` 设备**不**支持编译（例如 `#evox.compile`）。
