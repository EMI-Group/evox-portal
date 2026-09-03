---
title: "使用非 NVIDIA GPU"
order: 16
section: "misc"
---

# 使用非 NVIDIA GPU

本指南介绍了如何在 EvoX 中结合 PyTorch 使用 AMD GPU 和 Apple Silicon GPU。

虽然 NVIDIA GPU 是可靠的选择且通常性能强劲，但较新的型号主要针对深度学习工作负载和大型语言模型进行了优化。它们的许多高级特性（如对低精度数据类型的支持）目前在 EvoX 中尚未得到充分利用。在某些情况下，非 NVIDIA GPU 可以为演化计算任务提供更高的性价比。

## AMD GPU 支持

PyTorch 通过 ROCm 提供对 AMD GPU 的支持。AMD 设备会被识别为 `cuda` 设备（与 NVIDIA GPU 一样）。要使用 AMD GPU：

1. 安装兼容 ROCm 版本的 PyTorch。
2. 使用标准的设备设置，例如 `device = torch.device("cuda")`。

除了使用 ROCm 构建版本外，无需进行其他更改。

## Apple Silicon GPU 支持

如果您拥有 Apple Silicon Mac，可以利用内置 GPU 来加速 EvoX 工作负载。
Apple Silicon GPU 通过 Metal Performance Shaders (MPS) 后端提供支持，在 PyTorch 中可通过 `mps` 设备进行访问。

要使用 Apple Silicon GPU：

1. 确保已安装兼容 MPS 的 PyTorch 版本。
2. 将张量（tensors）和模型移动到 `mps` 设备，例如 `device = torch.device("mps")`。

> **注意：**
> `mps` 设备**不**支持编译（例如 `#evox.compile`）。