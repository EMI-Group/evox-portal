---
title: "EvoMO v0.3.1: más herramientas para experimentar con varios objetivos"
pubDate: 2026-10-08
summary: "La serie v0.3 amplía algoritmos tensorizados, corrige selección y benchmarks, y documenta comparaciones reproducibles."
---

La optimización multiobjetivo necesita más que evaluación rápida: selección que preserve compromisos, fórmulas correctas y estado recuperable. [EvoMO v0.3.1][s1], publicado el 8 de octubre de 2026 en hora de Pekín, añade documentación. Las principales ampliaciones y correcciones llegaron con [v0.3.0 el 24 de septiembre][s2].

![Una colección de instrumentos de búsqueda sobre objetivos en competencia](./cover.webp)

*Ilustración conceptual: distintos algoritmos exploran distintos compromisos útiles.*

## Más algoritmos sobre una base tensorial común

v0.3.0 incorpora 48 algoritmos multiobjetivo tensorizados. La base compartida facilita comparar en un mismo flujo de evaluación manteniendo distintas reglas de selección, variación y actualización.

Para objetivos en competencia, pueden fijarse problema, límites, población y presupuesto cambiando solo el algoritmo. El valor está en disponer de otros comportamientos de búsqueda. La cantidad de métodos no demuestra mejores compromisos para una tarea específica.

## Las correcciones afectan a la propia comparación

La versión corrige actualización y selección en varios métodos. La ordenación no dominada se detiene tras completar el frente límite necesario; la distancia de crowding trata objetivos constantes, poblaciones pequeñas, máscaras y dispositivos. PyTorch sigue siendo predeterminado; Triton es experimental y se selecciona explícitamente. [Cambios de selección][s3]

ZDT1–4 y ZDT6 reciben correcciones por fila, incluido el cálculo dependiente de dimensión de ZDT6. El hipervolumen Monte Carlo se corrige para minimización, referencias, entradas vacías y dispositivos de muestreo. Si un estudio utilizaba esas rutas, conserva los resultados antiguos y repite comparaciones controladas sin mezclar definiciones.

## Revisar restricciones y simulación por separado

La serie parte de los 86 benchmarks restringidos, NSGA-II con restricciones y `UnifiedWorkflow` de v0.2.2. Añade registro diferido de búferes de restricciones, recuperación de checkpoints y recursos de frentes Pareto en las distribuciones. [Base restringida][s4]

MoRobtrol incorpora Playground/MJX, objetivos específicos y visualización, con mejoras en normalización y checkpoints. En robótica, registra simulador y definición de objetivos con el mismo cuidado que el optimizador: un frente mejor puede reflejar una tarea o métrica diferente. [Simulación e integración][s5]

## Actualizar con un pequeño experimento de referencia

La [guía versionada][s6] instala primero EvoX. Usa `pip install evox` y después `pip install evomo==0.3.1`, registrando dependencias resueltas. La instalación fuente puede fijar v0.3.1. Este parche añade documentación; las funciones se explican en v0.3.0.

Antes de un benchmark grande, comprueba un objetivo conocido, una selección pequeña y la restauración del estado. En problemas restringidos, verifica viabilidad y calidad; para hipervolumen, conserva referencia y muestreo. La [presentación multiobjetivo GPU][related] explica la tensorización; v0.3 aporta una base experimental más amplia y definida.

[s1]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.1
[s2]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.0
[s3]: https://github.com/EMI-Group/evomo/pull/38
[s4]: https://github.com/EMI-Group/evomo/pull/34
[s5]: https://github.com/EMI-Group/evomo/pull/39
[s6]: https://github.com/EMI-Group/evomo/blob/v0.3.1/README.md
[related]: /es/news/gpu-accelerated-emo
