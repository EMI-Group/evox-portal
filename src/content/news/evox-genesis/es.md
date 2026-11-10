---
title: "EvoX Genesis: Construcción de un compilador de C mediante etapas inspeccionables y puertas de regresión"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "El caso del compilador de C sigue una implementación desde cero a través de las etapas del compilador, diagnósticos y bancos de pruebas externos, con resultados mantenidos dentro de su alcance documentado."
---

Partir de una implementación vacía es un objetivo claro; producir un ejecutable que se comporte correctamente es una condición de aceptación mucho más exigente. El caso del compilador de C de Genesis puede examinarse a través de las interfaces que construyó y las capas de verificación que las rodean.

![Módulos de código fuente ensamblados en un proyecto de software en crecimiento](./software-world-continuity.webp)

El [registro de Evidence del compilador de C](https://genesis.evox.group/evidence/c-compiler/) reporta **248.989 líneas de Rust**, **1.019 episodios de agente archivados**, **123,4 horas** y **44,38 US$ en costes de tokens de modelo**, utilizando DeepSeek V4 Flash. Enumera 220/220 casos de c-testsuite, 32/36 casos de LLVM evaluados y 2.904/2.904 pruebas de Rust. Estos son resultados reportados por el proyecto, no una reproducción reciente para este artículo.

## Primero, lograr que un programa recorra cada etapa

El compilador público, jcc, documenta una secuencia de hitos de ingeniería: establecer el espacio de trabajo, construir un esqueleto de compilación de extremo a extremo, ampliar la cobertura del lenguaje, añadir optimización y, finalmente, ejecutar suites externas y compilaciones de aplicaciones. La [hoja de ruta](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) define esas puertas; debe leerse como el registro de desarrollo del repositorio más que como una transcripción cronometrada de cada episodio de Genesis.

La [arquitectura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) conecta el preprocesamiento, el análisis léxico y sintáctico, las comprobaciones semánticas, el lowering a CIR, la optimización, la generación de código máquina, el ensamblado de objetos y el enlazado. Crates independientes se encargan de esas etapas.

Esa estructura crea artefactos intermedios útiles. `-E` se detiene tras el preprocesamiento; `-emit-jcc-ir` expone CIR; `-S` emite ensamblador; `-c` produce un objeto. Cuando un programa compilado falla, estos límites estrechan la investigación antes de modificar todo el pipeline.

## Preservar la semántica de C mediante la representación intermedia

CIR es la representación SSA tipada del compilador, independiente de LLVM IR. La optimización transforma CIR en CIR; el flujo de trabajo documentado para builds de depuración ejecuta el verificador después de las pasadas. La [guía de pruebas](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) describe comprobaciones para el lowering, representaciones inválidas, reescrituras, codificación de instrucciones y comportamiento de la línea de comandos.

La verificación de la representación es una capa, no una prueba de compilación correcta. Una transformación estructuralmente válida aún puede cambiar el resultado de un programa. Por ello, la estrategia de pruebas también compila y ejecuta programas en C y compara su salida.

El corpus incluye fallos de compilación deliberados: las pruebas comprueban la severidad del diagnóstico, el mensaje y el tramo de código fuente. Esto preserva el comportamiento de rechazo para entradas inválidas junto con el comportamiento de ejecución exitosa. El [documento de cumplimiento de C11](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) del compilador registra las construcciones soportadas y la política de extensiones.

## Suites externas prueban la ruta completa

El [harness de c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) proporciona una puerta externa de pruebas del lenguaje. El [ejecutor de LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) gestiona CMake con el compilador bajo prueba, construye programas y compara la ejecución contra una salida de referencia. Su comparación numérica por defecto utiliza una tolerancia de 1e-4, mientras que los tokens no numéricos y el estado de salida deben coincidir exactamente.

El [harness de Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) añade pruebas diferenciales de programas generados contra un compilador de referencia. En la captura del README inspeccionada, su ejecución de 100 semillas reporta **93 éxitos, 0 fallos y 7 omisiones**, atribuyéndose las omisiones a tiempos de espera agotados en ambos compiladores. Llamar a esto "93/93" sin las semillas omitidas ocultaría parte de la carga de trabajo.

Estas comprobaciones detectan diferentes clases de error: una suite de lenguaje sondea construcciones específicas, los programas aleatorios exploran combinaciones, y las compilaciones de aplicaciones enlazadas ejercitan el driver, los archivos objeto y las interfaces de runtime conjuntamente.

## Vincular el éxito a la operación probada

El [README versionado](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) informa que lz4 se construye y supera sus ocho pruebas esenciales. Describe que SQLite se analiza y realiza el lowering limpiamente, con trabajos adicionales de verificación de archivos completos registrados. Analizar SQLite es un hito de integración útil; no es lo mismo que superar la suite completa de pruebas de runtime de SQLite.

La misma fuente enumera aritmética de `long double` parcial, plataformas diferidas y puertas documentadas de política de extensiones. El resultado 32/36 de LLVM debe, por tanto, mantener su subconjunto evaluado y exclusiones. El README y la página de Evidence también tienen recuentos de pruebas de espacio de trabajo diferentes; este artículo mantiene el total de Evidence vinculado a su registro en lugar de combinar capturas.

## Qué persiste entre las tareas de desarrollo

El [modelo de desarrollo documentado](https://genesis.evox.group/getting-started/) de Genesis utiliza la descomposición recursiva de tareas en torno a un proyecto de software. En este caso, los artefactos de ingeniería duraderos son concretos: módulos de fuentes, contratos de representación, salidas intermedias, diagnósticos y harnesses de regresión. Una tarea posterior puede trabajar sobre esos artefactos en lugar de depender únicamente de la conversación de un predecesor.

El [caso de continuación del modelo](/news/genesis-compiler-continuation) examina un traspaso posterior y su resultado de 1.820 casos con alcance independiente. La [reescritura de MESA](/news/genesis-mesa) utiliza el comportamiento numérico original como referencia, mientras que [EvoX Compiler](/news/genesis-evoxc) comprueba grafos de tensores y contratos de dispositivos. Esos son problemas de verificación distintos en lugar de ejecuciones adicionales del mismo experimento de compilador.

44,38 US$ cubren los tokens del modelo y excluyen el hardware. Los registros públicos respaldan un caso sustancial de construcción de un compilador dentro de su alcance reportado; no establecen una compatibilidad de C sin restricciones. Para inspeccionar el resultado, siga la [arquitectura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) hasta un harness externo y luego examine los programas y salidas exactos que definen su puerta.
