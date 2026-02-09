---
title: "Notas de la versión EvoX v1.2.1"
pubDate: 2025-05-13
summary: "Mejoras de estabilidad con nuevas funciones de benchmark (Ellipsoid, Griewank) y correcciones de errores."
---

Esta es una versión menor enfocada en mejorar la estabilidad y corregir errores, con algunas mejoras en la calidad de vida del usuario.

**Nuevas características**

Nuevas funciones de benchmark: Se agregaron funciones numéricas de un solo objetivo: `Ellipsoid` y `Griewank`.

**Correcciones de errores**

* Se corrigió un problema donde `StdWorkflow` no funcionaba con algoritmos que heredan de otros algoritmos.

* Se corrigió un error en la función `latin_hypercube_sampling_standard`.

* Se resolvió un problema con `non_dominate` que fallaba bajo `torch.compile`.

* Se corrigió un problema donde `PSO` no utilizaba el dispositivo predeterminado correctamente en ciertos casos.

**Refactorización y mantenimiento**

* Se volvieron a exportar utilidades de uso común al nivel superior para mayor comodidad, por ejemplo:

* `evox.compile` en lugar de `evox.core.compile`

* `evox.vmap` en lugar de `evox.core.vmap`.

* Se eliminó código obsoleto o redundante.

Registro de cambios completo: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Código de fuente abierta / Recursos de la comunidad**

Artículo (Paper):

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Proyecto original (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo de QQ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Grupo de QQ | Evolving Machine Intelligence