---
title: "GPU / CPU の選択"
order: 15
section: "misc"
---

# GPU / CPU の選択

特定の GPU でプログラムを実行するには、環境変数 `CUDA_VISIBLE_DEVICES` を使用できます。例えば、2番目の GPU でプログラムを実行するには、以下のようにします：

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

複数の GPU でプログラムを実行するには、以下のようにします：

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

GPU の使用を無効にする（CPU を使用する）には、以下のようにします：

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```