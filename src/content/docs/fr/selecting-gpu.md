---
title: "Sélection GPU / CPU"
order: 15
section: "misc"
---

# Sélection GPU / CPU

Pour exécuter votre programme sur un GPU spécifique, vous pouvez utiliser la variable d'environnement `CUDA_VISIBLE_DEVICES`. Par exemple, pour exécuter votre programme sur le deuxième GPU, vous pouvez utiliser :

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Pour exécuter votre programme sur plusieurs GPU, vous pouvez utiliser :

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Pour désactiver l'utilisation du GPU (utiliser le CPU), vous pouvez utiliser :

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
