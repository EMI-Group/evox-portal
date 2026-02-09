---
title: "Notas de la versión EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Correcciones de errores para la captura de grafos de torch.compile, rupturas de grafos en use_state y fugas de BatchedTensor."
---

**Cambios realizados**

**Esta versión menor incluye principalmente correcciones de errores y mejoras:**

- Se corrigió un problema donde `torch.compile` no capturaba correctamente `workflow.step`.

- Se corrigió un problema donde `use_state` provocaba una ruptura del grafo (`graph break`).

- Se corrigieron algunos usos incorrectos de buffers de modelos.

- Se corrigió un problema donde `monitor.plot` no funcionaba según lo previsto.

- Se introdujo un nuevo wrapper, `evox.compile`, para solucionar ciertas limitaciones con `torch.compile` y `torch.vmap`.

- Se resolvieron varios problemas relacionados con `BatchedTensor`:- Se corrigió un error donde el uso de `vmap` en un workflow con `EvalMonitor` podía causar fugas de `BatchedTensor`.

- Se corrigió un problema que impedía que `HPOProblem` funcionara con `BraxProblem`.

- Se mejoraron las implementaciones de `RVEA` y `CSO` para un mejor rendimiento y confiabilidad.

- Se mejoró la implementación de `BraxProblem`.

- Varias correcciones y mejoras menores.

**Código de código abierto y comunidad**

**Artículo (Paper)**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Proyecto original (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo de QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Grupo de QQ | Evolving Machine Intelligence