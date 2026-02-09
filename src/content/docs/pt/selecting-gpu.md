---
title: "Selecionar GPU / CPU"
order: 15
section: "misc"
---

# Selecionar GPU / CPU

Para executar o seu programa numa GPU específica, pode utilizar a variável de ambiente `CUDA_VISIBLE_DEVICES`. Por exemplo, para executar o seu programa na segunda GPU, pode utilizar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para executar o seu programa em múltiplas GPUs, pode utilizar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para desativar a utilização de GPU (utilizar CPU), pode utilizar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```