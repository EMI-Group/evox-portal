---
title: "Выбор GPU / CPU"
order: 15
section: "misc"
---

# Выбор GPU / CPU

Чтобы запустить программу на конкретном GPU, вы можете использовать переменную окружения `CUDA_VISIBLE_DEVICES`. Например, для запуска программы на втором GPU используйте:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Чтобы запустить программу на нескольких GPU, используйте:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Чтобы отключить использование GPU (использовать CPU), используйте:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```