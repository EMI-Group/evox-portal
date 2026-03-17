---
title: "Selección de GPU / CPU"
order: 15
section: "misc"
---

# Selección de GPU / CPU

Para ejecutar tu programa en una GPU específica, puedes usar la variable de entorno `CUDA_VISIBLE_DEVICES`. Por ejemplo, para ejecutar tu programa en la segunda GPU, puedes usar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para ejecutar tu programa en múltiples GPUs, puedes usar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para desactivar el uso de la GPU (usar la CPU), puedes usar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```