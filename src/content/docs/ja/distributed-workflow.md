---
title: "マルチGPUと分散ワークフロー"
order: 8
section: "experimental"
---

# マルチGPUと分散ワークフロー

EvoXは分散ワークフローの実験的サポートを提供しており、通常の進化アルゴリズムを複数のGPUや複数のマシンにまたがって実行できます。これにより、特に時間のかかる問題に対して最適化プロセスを大幅に高速化できます。

## 使用方法

分散ワークフローを使用するには、いくつかの設定が必要です：
1. 乱数生成器のシードを手動で固定していることを確認してください。
```python
torch.manual_seed(seed)
# オプション：numpyのシードを設定
np.random.seed(seed)
# オプション：決定論的アルゴリズムを使用
torch.use_deterministic_algorithms(True)
```
> **重要:**
> torchやnumpyの操作の**前に**、すべての乱数生成器のシードを設定してください。これにより、操作が実行される前に乱数生成器が既知の状態にあることが保証されます。
2. `torch.distributed`または`torchrun`コマンドを使用してスクリプトを起動します。例えば：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **ヒント:**
> `torchrun`は分散torchプログラムを起動するための推奨方法です。詳細については、[PyTorchドキュメント](https://pytorch.org/docs/stable/elastic/run.html)を参照してください。
