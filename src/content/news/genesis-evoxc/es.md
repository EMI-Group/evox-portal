---
title: "EvoX Compiler: un sistema explícito de grafos tensoriales construido con Genesis"
pubDate: 2026-11-03
summary: "El caso EvoX Compiler de Genesis documenta un compilador y runtime Python para grafos tensoriales, con NumPy, IREE, XLA y TVM."
---

EvoX Compiler (evoxc) convierte el grafo de cálculo en un artefacto inspeccionable. Su frontend construye y transforma EvoXIR; etapas explícitas realizan la reducción a una representación de menor nivel, compilación, carga y ejecución. NumPy es la única dependencia obligatoria; los compiladores externos optimizan y generan código.

La instantánea Evidence del **28 de octubre de 2026** documenta cuatro rutas: **NumPy, IREE, XLA y TVM**. El repositorio atribuye a Genesis la producción del código, las pruebas y la documentación. El caso sigue la construcción inicial y el desarrollo continuo de interfaces y backends.

Con IREE instalado, la instantánea informa de **6,789 pruebas superadas, 46 omitidas y 3 fallos esperados**, sin fallos. Son cifras históricas, no los totales actuales. Las **285,659 líneas de texto versionadas** incluyen pruebas, datos de benchmark y documentación; no miden solo el compilador. El gasto en tokens fue de unos **50 dólares**, sin hardware.

La validación depende de la configuración: Vulkan utilizó un dispositivo por software y la ruta ROCm de TVM solo se verificó en compilación. Son resultados declarados por el proyecto, sin reproducción independiente. El flujo explícito de grafos y los informes de benchmark del repositorio ofrecen un punto de partida para desarrolladores.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
