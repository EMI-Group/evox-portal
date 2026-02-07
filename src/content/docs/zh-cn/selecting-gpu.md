---
title: "选择 GPU / CPU"
order: 15
section: "misc"
---

# 选择 GPU / CPU

要在特定 GPU 上运行程序，可以使用 `CUDA_VISIBLE_DEVICES` 环境变量。例如，要在第二块 GPU 上运行程序，可以使用：

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

要在多块 GPU 上运行程序，可以使用：

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

要禁用 GPU（使用 CPU），可以使用：

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
