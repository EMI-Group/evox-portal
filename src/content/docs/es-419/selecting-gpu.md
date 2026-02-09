---
title: "Selección de GPU / CPU"
order: 15
section: "misc"
---

# Selección de GPU / CPU

Para ejecutar su programa en una GPU específica, puede utilizar la variable de entorno `CUDA_VISIBLE_DEVICES`. Por ejemplo, para ejecutar su programa en la segunda GPU, puede utilizar:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Para ejecutar su programa en múltiples GPUs, puede utilizar:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Para desactivar el uso de GPU (usar CPU), puede utilizar:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```