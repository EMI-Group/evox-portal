---
title: "EvoX v1.2.1 Notas de versión"
pubDate: 2025-05-13
summary: "Mejoras de estabilidad, nuevas funciones de referencia (Ellipsoid, Griewank) y correcciones de errores."
---

Esta es una versión menor centrada en mejorar la estabilidad y corregir errores, con algunas mejoras de calidad de vida.

**Nuevas funcionalidades**

Nuevas funciones de referencia: Se añadieron funciones numéricas mono-objetivo: `Ellipsoid` y `Griewank`.

**Correcciones de errores**

* Se corrigió un problema por el que `StdWorkflow` no funcionaba con algoritmos que heredan de otros algoritmos.

* Se corrigió un error en la función `latin_hypercube_sampling_standard`.

* Se resolvió un problema con `non_dominate` que fallaba bajo `torch.compile`.

* Se corrigió un problema por el que `PSO` no utilizaba correctamente el dispositivo por defecto en ciertos casos.

**Refactorización y mantenimiento**

* Se reexportaron utilidades de uso frecuente al nivel superior para mayor comodidad, por ejemplo:

* `evox.compile` en lugar de `evox.core.compile`

* `evox.vmap` en lugar de `evox.core.vmap`.

* Se eliminó código obsoleto o redundante.

Full Changelog: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Código abierto / Recursos comunitarios**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Proyecto principal (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Grupo QQ | Evolving Machine Intelligence
