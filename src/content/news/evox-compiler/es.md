---
title: "EvoX Compiler v0.1.0: una base computacional para programas que evolucionan"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "EvoX Compiler separa representación, transformación y ejecución de programas, ofreciendo una base para experimentar con poblaciones y distintos backends."
---

*Actualizado el 7 de noviembre de 2026. Los resultados históricos conservan su fecha de referencia.*

La visión de IA evolutiva de EvoX exige sistemas de cálculo que admitan candidatos cambiantes, incluidos programas de estructuras diferentes. EvoX Compiler aborda esa base: los grafos explícitos permiten inspeccionar y transformar programas antes de ejecutarlos, y las interfaces de backend conectan los cálculos compatibles con distintos sistemas de ejecución.

Un programa numérico no se reduce a su salida: puede ser necesario inspeccionar el grafo, transformarlo, comparar backends o guardar un artefacto compilado. **EvoX Compiler (evoxc) v0.1.0**, publicado el 29 de octubre de 2026, hace explícitas estas etapas. Es un frontend y runtime Python de grafos tensoriales, con licencia Apache-2.0 y Python 3.11 o posterior.

## De la definición al ejecutable

El flujo es `trace → lower → compile → load → run`. El trazado construye EvoXIR desde la definición y las especificaciones de entrada; lowering prepara la representación del backend; la compilación crea un artefacto que se carga en un dispositivo y se ejecuta con datos. Cada etapa produce un objeto inspeccionable.

Así se distinguen grafos inválidos, operaciones no compatibles y errores de dispositivo. Los grafos y artefactos admitidos pueden guardarse. Los compiladores externos optimizan, planifican y generan código; evoxc proporciona el frontend y los contratos entre etapas.

## Transformaciones para la búsqueda evolutiva

`vmap`, `grad`, `jvp` y `vjp` producen grafos combinables antes de ejecutarlos. `batch_functions` agrupa funciones candidatas con especificaciones de entrada y salida coincidentes en un grafo de población.

En programación genética, búsqueda de arquitecturas y síntesis de algoritmos, los candidatos pueden ser programas diferentes. Agruparlos puede reducir compilaciones e invocaciones, pero el beneficio depende de la estructura y del backend; no está garantizado.

## Elegir una ruta de ejecución

NumPy es la única dependencia obligatoria y ofrece el intérprete CPU de referencia. Los adaptadores opcionales conectan IREE, XLA mediante un plugin PJRT del usuario y TVM mediante StableHLO. La cobertura de operadores y hardware varía.

El README versionado documenta Vulkan sobre Mesa lavapipe, un dispositivo software, y TVM ROCm solo en compilación. Las entradas GPU y su ubicación son explícitas. Compruebe las operaciones compatibles antes de trasladar un grafo CPU.

## Empezar por la referencia

Instale la versión fijada, ejecute el ejemplo CPU del README, inspeccione el grafo y seleccione después un backend compilado:

```bash
pip install evoxc==0.1.0
```

La integración HuggingFace es el paquete independiente `evoxc-hf`. No confunda este compilador y sus versiones con el paquete de optimización EvoX.

## Validación dentro de la base computacional

El README informa de **7.511 pruebas superadas, 77 omitidas y 4 fallos esperados**, sin fallos, en el entorno documentado de las suites principal y de integración. No valida todo el hardware. El repositorio atribuye a Genesis el código, las pruebas y la documentación.

Consulte el [README versionado](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), la [publicación](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) y [GitHub](https://github.com/EMI-Group/evoxc) para API, artefactos y desarrollo posterior.
