---
title: "Auswahl von GPU / CPU"
order: 15
section: "misc"
---

# Auswahl von GPU / CPU

Um Ihr Programm auf einer bestimmten GPU auszuführen, können Sie die Umgebungsvariable `CUDA_VISIBLE_DEVICES` verwenden. Um Ihr Programm beispielsweise auf der zweiten GPU auszuführen, können Sie Folgendes verwenden:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Um Ihr Programm auf mehreren GPUs auszuführen, können Sie Folgendes verwenden:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Um die GPU-Nutzung zu deaktivieren (CPU verwenden), können Sie Folgendes verwenden:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```