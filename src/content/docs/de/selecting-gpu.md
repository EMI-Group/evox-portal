---
title: "GPU / CPU auswählen"
order: 15
section: "misc"
---

# GPU / CPU auswählen

Um Ihr Programm auf einer bestimmten GPU auszuführen, können Sie die Umgebungsvariable `CUDA_VISIBLE_DEVICES` verwenden. Um beispielsweise Ihr Programm auf der zweiten GPU auszuführen, können Sie verwenden:

```bash
CUDA_VISIBLE_DEVICES=1 python my_program.py
```

Um Ihr Programm auf mehreren GPUs auszuführen, können Sie verwenden:

```bash
CUDA_VISIBLE_DEVICES=0,1 python my_program.py
```

Um die GPU-Nutzung zu deaktivieren (CPU verwenden), können Sie verwenden:

```bash
CUDA_VISIBLE_DEVICES="" python my_program.py
```
