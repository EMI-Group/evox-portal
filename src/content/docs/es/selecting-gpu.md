---
title: "Seleccion de GPU / CPU"
order: 15
section: "misc"
---

# Seleccion de GPU / CPU

Para ejecutar su programa en una GPU especifica, puede usar la variable de entorno `CUDA_VISIBLE_DEVICES`. Por ejemplo, para ejecutar su programa en la segunda GPU, puede usar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para ejecutar su programa en multiples GPUs, puede usar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para deshabilitar el uso de GPU (usar CPU), puede usar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
