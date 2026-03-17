---
title: "選擇 GPU / CPU"
order: 15
section: "misc"
---

# 選擇 GPU / CPU

若要在特定的 GPU 上執行您的程式，可以使用 `CUDA_VISIBLE_DEVICES` 環境變數。例如，若要在第二個 GPU 上執行程式，可以使用：

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

若要在多個 GPU 上執行您的程式，可以使用：

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

若要停用 GPU（使用 CPU），可以使用：

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```