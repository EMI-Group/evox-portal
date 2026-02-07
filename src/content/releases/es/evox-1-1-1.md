---
title: "EvoX v1.1.1 Notas de versión"
pubDate: 2025-03-16
summary: "Correcciones de errores para la captura de grafos de torch.compile, interrupciones de grafos de use_state y fugas de BatchedTensor."
---

**Cambios realizados**

**Esta versión menor incluye principalmente correcciones de errores y mejoras:**

- Se corrigió un problema por el que `torch.compile` no capturaba correctamente `workflow.step`.

- Se corrigió un problema por el que `use_state` provocaba una interrupción del grafo.

- Se corrigió el uso incorrecto de algunos buffers del modelo.

- Se corrigió un problema por el que monitor.plot no funcionaba según lo previsto.

- Se introdujo un nuevo wrapper, `evox.compile`, para solucionar ciertas limitaciones de `torch.compile` y `torch.vmap`.

- Se resolvieron diversos problemas relacionados con `BatchedTensor`:- Se corrigió un error por el que aplicar vmap a un flujo de trabajo con EvalMonitor podía causar fugas de BatchedTensor.

- Se corrigió un problema que impedía que HPOProblem funcionase con BraxProblem.

- Se mejoraron las implementaciones de RVEA y CSO para un mejor rendimiento y fiabilidad.

- Se mejoró la implementación de BraxProblem.

- Diversas correcciones y mejoras menores.

**Código abierto y comunidad**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Proyecto principal (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Grupo QQ | Evolving Machine Intelligence
