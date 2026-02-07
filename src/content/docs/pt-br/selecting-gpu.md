---
title: "Selecionando GPU / CPU"
order: 15
section: "misc"
---

# Selecionando GPU / CPU

Para executar seu programa em uma GPU específica, você pode usar a variável de ambiente `CUDA_VISIBLE_DEVICES`. Por exemplo, para executar seu programa na segunda GPU, você pode usar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para executar seu programa em múltiplas GPUs, você pode usar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para desabilitar o uso da GPU (usar CPU), você pode usar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
