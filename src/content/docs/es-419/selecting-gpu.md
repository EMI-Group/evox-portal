---
title: "Seleccion de GPU / CPU"
order: 15
section: "misc"
---

# Seleccion de GPU / CPU

Para ejecutar tu programa en una GPU especifica, puedes usar la variable de entorno `CUDA_VISIBLE_DEVICES`. Por ejemplo, para ejecutar tu programa en la segunda GPU, puedes usar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para ejecutar tu programa en multiples GPUs, puedes usar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para deshabilitar el uso de GPU (usar CPU), puedes usar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
