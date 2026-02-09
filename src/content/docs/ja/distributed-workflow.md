---
title: "マルチGPUと分散ワークフロー"
order: 8
section: "experimental"
---

# マルチGPUと分散ワークフロー

EvoXは分散ワークフローを実験的にサポートしており、通常の進化的アルゴリズムを複数のGPUや複数のマシンで実行することができます。これにより、特に処理に時間のかかる問題において、最適化プロセスを大幅に高速化できます。

## 使用方法

分散ワークフローを使用するには、いくつかの設定を行う必要があります。

1. 乱数生成器のシードを手動で固定していることを確認してください。
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **重要:**
> すべての乱数生成器のシードは、必ずtorchやnumpyの操作を行う**前に**設定してください。これにより、操作が実行される前に乱数生成器が既知の状態にあることが保証されます。

2. スクリプトを起動するには、`torch.distributed`または`torchrun`コマンドを使用します。例：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **ヒント:**
> `torchrun`は、分散torchプログラムを起動するための推奨される方法です。詳細については、[PyTorchのドキュメント](https://pytorch.org/docs/stable/elastic/run.html)を参照してください。