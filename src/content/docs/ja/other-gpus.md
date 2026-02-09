---
title: "NVIDIA以外のGPUを使用する"
order: 16
section: "misc"
---

# NVIDIA以外のGPUを使用する

このガイドでは、EvoXのコンテキストにおいて、PyTorchでAMD GPUおよびApple Silicon GPUを使用する方法を説明します。

NVIDIA GPUは信頼できる選択肢であり、一般的に強力なパフォーマンスを提供しますが、新しいモデルはディープラーニングのワークロードや大規模言語モデル向けに最適化されています。低精度データ型のサポートなど、それらの高度な機能の多くは、現在のEvoXでは十分に活用されていません。場合によっては、進化計算タスクにおいて、NVIDIA以外のGPUの方が優れたパフォーマンスと低コストを実現できることがあります。

## AMD GPUのサポート

PyTorchにおけるAMD GPUのサポートは、ROCmを介して提供されます。AMDデバイスは（NVIDIA GPUと同様に）`cuda`デバイスとして認識されます。AMD GPUを使用するには：

1. ROCm互換バージョンのPyTorchをインストールします。
2. 標準的なデバイス設定を使用します（例：`device = torch.device("cuda")`）。

ROCmビルドを使用すること以外に、追加の変更は必要ありません。

## Apple Silicon GPUのサポート

Apple Silicon搭載のMacをお持ちの場合、内蔵GPUを活用してEvoXのワークロードを高速化できます。
Apple Silicon GPUはMetal Performance Shaders (MPS) バックエンドを介してサポートされており、PyTorchでは`mps`デバイスを使用してアクセスできます。

Apple Silicon GPUを使用するには：

1. MPS互換バージョンのPyTorchがインストールされていることを確認します。
2. テンソルとモデルを`mps`デバイスに移動します（例：`device = torch.device("mps")`）。

> **注意:**
> `mps`デバイスはコンパイル（例：`#evox.compile`）をサポートして**いません**。