---
title: "Selezione GPU / CPU"
order: 15
section: "misc"
---

# Selezione GPU / CPU

Per eseguire il tuo programma su una GPU specifica, puoi usare la variabile d'ambiente `CUDA_VISIBLE_DEVICES`. Ad esempio, per eseguire il tuo programma sulla seconda GPU, puoi usare:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Per eseguire il tuo programma su più GPU, puoi usare:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Per disabilitare l'uso della GPU (usare la CPU), puoi usare:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
