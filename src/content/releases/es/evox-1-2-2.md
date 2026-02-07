---
title: "EvoX v1.2.2 Notas de versión"
pubDate: 2025-06-03
summary: "Versión menor centrada en correcciones del algoritmo DE y mejoras de documentación."
---

Esta es una versión menor centrada exclusivamente en correcciones de errores:

- Se eliminaron importaciones no utilizadas para mejorar la limpieza del código.
- Se corrigió un comportamiento no deseado en ciertos algoritmos de Differential Evolution (DE) donde `step` se estaba invocando dentro de `init_step`.
- Diversas correcciones en la documentación.

**Full Changelog**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
