---
title: "EvoX Compiler v0.1.1: menos preparación antes de ejecutar una población"
pubDate: 2026-10-30
summary: "La versión del 30 de octubre mejora agrupación de programas, preparación de grafos y errores de los motores, incluido un bloqueo de XLA."
---

Buscar programas convierte la compilación en parte del presupuesto experimental. Si cada generación tarda en preparar grafos, acelerar solo el dispositivo resuelve una parte del problema. [EvoX Compiler v0.1.1][s1], publicado el 30 de octubre de 2026, mejora esa preparación y corrige fallos de los motores. Sus [45 commits][s2] amplían la canalización explícita de v0.1.0.

![Distintas estructuras de programas organizadas en grupos paralelos compactos](./cover.webp)

*Ilustración conceptual: organizar una población de programas antes de compilar.*

## Agrupar programas requiere un modelo de coste

`batch_functions` combina programas compatibles en un grafo. Esta versión propaga dependencias por fila en el grafo interno de clases y amplía la búsqueda geométrica de bandas de `bands="auto"`. Ayuda a determinar qué trabajo depende de cada individuo y cómo organizar los candidatos.

En programación genética, programas con la misma firma de entrada pueden contener operaciones distintas. Una agrupación plana única no tiene por qué ser la más barata. Las bandas ofrecen otra organización y la política automática las compara con su modelo de coste. La comprobación esencial es semántica: la fila i del resultado combinado debe coincidir con la ejecución individual del candidato i. También se actualizan las pruebas de regresión.

## Eliminar trabajo repetido de preparación

Varios cambios actúan sobre la CPU antes de ejecutar: captura de posiciones mediante recorrido directo de marcos, eliminación de verificaciones redundantes durante el lowering y seguimiento lineal de usos con inferencia de tipos memorizada en el IR. La exportación StableHLO añade emisión conjunta de constantes, caché de textos de tipos y despacho de operaciones mediante tablas.

Son mejoras en etapas distintas. Exportar más rápido no implica acelerar el núcleo GPU. Conviene medir trazado, transformación, lowering, compilación y ejecución estable por separado. Una población grande con muchas constantes puede tener costes distintos a un grafo pequeño con cálculo numérico caro.

## Diagnosticar mejor los fallos del motor

IREE presenta el límite HAL de enlaces por despacho como un `BackendError` que permite actuar. Así se distingue un límite de recursos de un programa numérico incorrecto. XLA deja de mantener el bloqueo de clientes compartidos durante `PJRT_Client_Create`, corrigiendo un interbloqueo con un finalizador del mismo hilo. Una prueba de regresión acompaña el cambio.

El soporte sigue la matriz versionada. NumPy proporciona el intérprete CPU; IREE, XLA y TVM tienen requisitos de dispositivos y dependencias diferentes. El intérprete sirve de referencia antes de comprobar la ruta compilada. El [README de la versión][s3] explica los límites y la transferencia explícita.

## Actualizar con una población representativa

La base se instala con `pip install evoxc==0.1.1`; para IREE, `pip install "evoxc[iree]==0.1.1"`. Se necesita Python 3.11 o posterior. La distribución independiente `evoxc-hf` tiene su propio ciclo de versiones. Conserva la configuración de los complementos existentes.

Parte de una población guardada y entradas fijas. Compara los resultados combinados con ejecuciones individuales y mide preparación y ejecución por separado. Ante un error de enlaces, guarda el grafo y los detalles del motor en vez de alterar silenciosamente el experimento. La [presentación v0.1.0][related] describe la canalización; v0.1.1 hace más prácticas sus etapas preparatorias y fronteras.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /es/releases/evoxc-0-1-0
