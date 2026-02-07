---
title: "NVIDIA以外のGPUの使用"
order: 16
section: "misc"
---

# NVIDIA以外のGPUの使用

このガイドでは、EvoXのコンテキストでAMD GPUとApple Silicon GPUをPyTorchで使用する方法を説明します。

NVIDIA GPUは信頼性の高い選択肢であり、一般的に優れたパフォーマンスを提供しますが、新しいモデルはディープラーニングワークロードや大規模言語モデル向けに最適化されています。低精度データ型のサポートなど、多くの高度な機能は現在EvoXでは十分に活用されていません。場合によっては、NVIDIA以外のGPUが進化タスクに対してより良いパフォーマンスと低コストを提供できます。

## AMD GPUサポート

PyTorchでのAMD GPUサポートはROCmを介して提供されます。AMDデバイスは`cuda`デバイスとして認識されます（NVIDIA GPUと同様）。AMD GPUを使用するには：

1. ROCm互換バージョンのPyTorchをインストールします。
2. 標準的なデバイス設定を使用します。例：`device = torch.device("cuda")`。

ROCmビルドを使用する以外に追加の変更は必要ありません。

## Apple Silicon GPUサポート

Apple Silicon Macをお持ちの場合、内蔵GPUを活用してEvoXワークロードを加速できます。
Apple Silicon GPUはMetal Performance Shaders（MPS）バックエンドを介してサポートされており、PyTorchの`mps`デバイスを使用してアクセスできます。

Apple Silicon GPUを使用するには：

1. MPS互換バージョンのPyTorchがインストールされていることを確認します。
2. テンソルとモデルを`mps`デバイスに移動します。例：`device = torch.device("mps")`。

> **注意:**
> `mps`デバイスはコンパイル（例：`#evox.compile`）を**サポートしていません**。
