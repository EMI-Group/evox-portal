---
title: "GPU / CPUの選択"
order: 15
section: "misc"
---

# GPU / CPUの選択

特定のGPUでプログラムを実行するには、`CUDA_VISIBLE_DEVICES`環境変数を使用できます。例えば、2番目のGPUでプログラムを実行するには：

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

複数のGPUでプログラムを実行するには：

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

GPU使用を無効にする（CPUを使用する）には：

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
