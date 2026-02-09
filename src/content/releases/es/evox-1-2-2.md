---
title: "Notas de la versión EvoX v1.2.2"
pubDate: 2025-06-03
summary: "Una versión menor centrada en la corrección de errores, incluyendo ajustes en los algoritmos DE y mejoras en la documentación."
---

Esta es una versión menor centrada exclusivamente en la corrección de errores:

- Se han eliminado las importaciones no utilizadas para mejorar la limpieza del código.
- Se ha corregido un comportamiento no deseado en ciertos algoritmos de Differential Evolution (DE) donde se llamaba a `step` dentro de `init_step`.
- Varias correcciones en la documentación.

**Changelog completo**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)