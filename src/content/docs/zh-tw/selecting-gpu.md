---
title: "選擇 GPU / CPU"
order: 15
section: "misc"
---

# 選擇 GPU / CPU

要在特定 GPU 上執行您的程式，您可以使用 `CUDA_VISIBLE_DEVICES` 環境變數。例如，要在第二個 GPU 上執行程式，您可以使用：

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

要在多個 GPU 上執行程式，您可以使用：

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

要停用 GPU 使用（使用 CPU），您可以使用：

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
