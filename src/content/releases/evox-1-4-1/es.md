---
title: "Notas de la versión EvoX v1.4.1"
pubDate: 2026-10-30
summary: "Correcciones en CMA-ES, variantes DE, PSO, estrategias evolutivas, selección por torneo y cálculo del hipervolumen."
---

![Verificación y corrección del comportamiento algorítmico](./algorithm-update-correction.webp)

**EvoX v1.4.1** corrige errores algorítmicos y de ejecución en la serie estable 1.x.

## Correcciones de algoritmos

- **CMA-ES:** corregidas la actualización de rango uno de la covarianza y la constante de acumulación `c_c`; resuelto un fallo en `torch.cond` y reactivada la prueba ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **Variantes DE:** cambiado el muestreo de `DE_binary_crossover` de una distribución normal a una uniforme. Corregida la adaptación de `F` y `CR` en SHADE y el muestreo dentro de los límites de las poblaciones iniciales de las variantes DE ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO:** corregida la transferencia de los límites al dispositivo ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **Estrategias evolutivas:** corregidos ASEBO tras activar su subespacio de gradiente, el `pop_size` predeterminado de XNES/SeparableNES y los fallos de los subespacios de Guided ES ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## Operadores y métricas

- Corregidos los fallos de la selección por torneo con `n_round=1` ([#259](https://github.com/EMI-Group/evox/pull/259)).
- El hipervolumen (`hv`) ahora ignora los puntos que no dominan el punto de referencia ([#254](https://github.com/EMI-Group/evox/pull/254)).

Gracias a @bbopen, @raashish1601, @Arthur031221 y @flyingdoubleG por sus primeras contribuciones.

**Publicación**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **Historial completo**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
