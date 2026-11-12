---
title: "EvoGP: más opciones de GPU y menos trabajo en los registros"
pubDate: 2026-10-16
summary: "El soporte AMD ROCm y una reducción tensorial corregida abordan dos obstáculos para ejecutar grandes poblaciones de programas."
---

Un núcleo rápido es solo parte de una búsqueda utilizable. La GPU disponible debe ser compatible y los informes no deben dominar cada generación. La [integración del 16 de octubre de 2026][s1] sustituye las reducciones Python de aptitud en la canalización estándar. Sigue al [soporte AMD ROCm del 17 de junio][s2], ampliando el acceso a la misma búsqueda basada en árboles.

![Los mismos árboles de programas sobre dos aceleradores diferentes](./cover.webp)

*Ilustración conceptual: una representación compartida atraviesa las fronteras de los motores GPU.*

## Mantener estadísticas como operaciones tensoriales

Los máximos y mínimos Python sobre el tensor se sustituyen por `torch.max` y `torch.min`. Recorrer grandes tensores de dispositivo desde Python añade trabajo en la frontera del lenguaje que una reducción puede resolver dentro del marco numérico. Importa especialmente cuando evaluar la aptitud cuesta poco.

En regresión simbólica, las expresiones pueden evaluarse en paralelo mientras mostrar extremos resulta caro. La corrección elimina ese desajuste sin cambiar la estadística. La PR comunica una gran mejora con un millón de individuos, pero no un protocolo completo; conviene perfilar la generación entera, incluidos los informes.

## Una base de código para CUDA y ROCm

La integración de junio usa la conversión HIP de PyTorch durante la construcción para compilar las extensiones CUDA en AMD. Las opciones se seleccionan por motor y se protege una cabecera exclusiva de CUDA. Con PyTorch ROCm no hace falta mantener otros algoritmos.

Las pilas dinámicas de los intérpretes se sustituyen por arrays locales de tamaño fijo. El contribuidor relacionó los errores AMD con alias de asignación entre wavefronts residentes. Separar las pilas importa: usar el estado temporal de otro hilo puede falsear la aptitud y perjudicar la selección.

## Preparar el entorno de construcción adecuado

Las [instrucciones fuente][s3] exigen herramientas GPU, compilador C++ y PyTorch compatibles. En AMD se usan ROCm con `hipcc` y PyTorch ROCm. `--no-build-isolation` permite construir la extensión con ese entorno instalado.

Los ejemplos conservan las cadenas de dispositivo `cuda` bajo ROCm porque así funciona la interfaz PyTorch. `PYTORCH_ROCM_ARCH` selecciona una arquitectura AMD concreta. Es una opción de construcción, no una reescritura de árboles ni operadores evolutivos.

## Validar una búsqueda pequeña antes de escalar

El contribuidor comunica pruebas en MI250X, W7800, RX 9070 XT y PRO V710, con sistemas y versiones ROCm indicados en la PR. Utilizan 1.000 individuos, 100 generaciones y semilla fija. Son validaciones comunicadas para esas configuraciones, no garantías independientes del hardware.

Tras construir, ejecuta `python -m evogp.sr_test` y comprueba aptitud finita y finalización normal. Compara después con y sin informes manteniendo entradas, semilla y población, separando evaluación y gestión. La [presentación de investigación EvoGP][related] explica los árboles tensorizados; estas mejoras conectan esa representación con el hardware disponible.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/85c9f96490185b371438768668da53de930cc3f6/README.md
[related]: /es/news/evogp
