---
title: "Genesis desarrolla EvoX Compiler: contratos, pruebas de grafos y sincronización de dispositivos"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Cómo Genesis desarrolló un compilador de grafos de tensores basado en etapas explícitas, comprobaciones de transformación y contratos de backend, con ejemplos concretos de sus pruebas públicas."
---

Desarrollar un compilador de grafos de tensores implica mantener la coherencia entre varias implementaciones de un mismo cálculo. Una transformación de grafo puede cambiar el diseño (layout) de los tensores; un adaptador puede rechazar una operación; una llamada al dispositivo puede retornar antes de que finalice el cómputo. El caso de EvoX Compiler de Genesis resulta útil cuando esos límites se examinan individualmente.

![Grafos del compilador verificados frente a pruebas de regresión](./compiler-contract-layers.webp)

La [instantánea de Evidence del 28 de octubre](https://genesis.evox.group/evidence/evoxc/) registra 6.789 pruebas superadas y aproximadamente 50 dólares estadounidenses en costes de tokens de modelos. Para analizar la ingeniería que sustenta esas cifras, este artículo utiliza también el código fuente de la v0.1.0, accesible públicamente. La instantánea y el lanzamiento (release) tienen totales de pruebas distintos; los ejemplos de implementación que aparecen a continuación se identifican por su versión.

## Convertir el objetivo en interfaces verificables

EvoX Compiler posee el lenguaje de tensores, el grafo EvoXIR y las interfaces de staging. Los compiladores externos reciben su representación exportada y gestionan la optimización, la planificación (scheduling) y la generación de código. Sus [contratos de paquete](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) documentan la dirección de las dependencias: los tipos de valor e IR sustentan el rastreo (tracing) y las operaciones, mientras que las transformaciones y los adaptadores se construyen sobre esas capas. El paquete independiente `evoxc_hf` consume la API pública del compilador; el compilador no importa la integración del modelo.

Esta división otorga al trabajo de desarrollo local un límite concreto. Por ejemplo, una transformación produce otro grafo ordinario en lugar de requerir que cada backend comprenda el `vmap` de Python. Una carencia en el backend debe convertirse en un error explícito en lugar de cambiar silenciosamente la ruta de ejecución. Los documentos de contexto a nivel de paquete registran las API y las restricciones que otra tarea de desarrollo debe preservar.

El pipeline público es `trace → lower → compile → load → run`. Cada etapa devuelve un objeto distinto. Las [pruebas de especificación](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) comprueban entradas en etapas incorrectas, rechazan llamadas directas en modo eager execution a definiciones de grafos y verifican que las funciones de conveniencia se expandan según el pipeline documentado. También rechazan la captura de un tensor concreto desde un cierre (closure) a menos que el autor lo incruste explícitamente. El beneficio práctico es que un atajo aparentemente conveniente no puede introducir silenciosamente un segundo conjunto de semánticas.

Según el registro de Evidence, el desarrollo avanzó capa por capa, requiriendo comprobaciones de pytest antes de continuar con la siguiente. El repositorio proporciona contratos y pruebas inspeccionables para ese método; no proporciona una secuencia archivada completa de las decisiones de los agentes.

## Una transformación de población verificada frente a dos referencias

Una característica exigente es `batch_functions`: combinar múltiples programas con firmas de entrada/salida coincidentes en un solo grafo. Su contrato es más estricto que "el grafo combinado funciona": la fila de salida *i* debe seguir siendo igual al resultado del programa *i*.

Las [pruebas de integración de la v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) ejercitan un ejemplo pequeño y legible. En la misma posición del grafo, tres programas realizan `x + 1`, `x * 2` y `x - 3`. Con `switch_ops=True`, el grafo fusionado representa las diferentes operaciones mediante una selección por fila. Las pruebas compilan ese grafo a través de la ruta de CPU de IREE y comparan su salida tanto con la ejecución en NumPy del grafo fusionado como con los resultados de NumPy apilados de las funciones originales, con una tolerancia de `rtol=atol=1e-5`.

Comprobaciones sin compilador inspeccionan la salida de StableHLO en busca de la operación de selección esperada. Otra comprobación fusiona programas idénticos y compara el resultado con `vmap`, donde no debería ser necesaria ninguna selección. Juntas, estas pruebas analizan la preservación del programa, la exportación y la integración con el backend, en lugar de utilizar la compilación exitosa como única condición de aceptación.

## La ubicación en el dispositivo es parte de la corrección

Un ejecutable que se corre en una GPU no debería aceptar datos del host fingiendo que ya residen en el dispositivo. Las [pruebas de especificación de tensores y ubicación](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verifican que los datos tengan un dispositivo físico, que las transferencias sean explícitas mediante `Tensor.to(device)` y que una ubicación inválida genere un `DeviceError`.

Esto también es relevante para la medición del rendimiento. Si cada llamada transfiere de nuevo los pesos del modelo, una cifra de latencia medirá una carga de trabajo distinta a la de una que los mantiene residentes. La [documentación de integración de modelos de la v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) separa la carga de checkpoints, el cómputo forward y el staging del ejecutable. Los parámetros permanecen como entradas explícitas del grafo, haciendo visible su ubicación.

## Una llamada devuelta no es necesariamente trabajo completado

La ruta de residencia en dispositivo de XLA puede encolar trabajo y retornar antes de que finalice. Cronometrar solo `run`, por lo tanto, infravaloraría la ejecución. Las [pruebas de sincronización](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) comprueban el ciclo de vida de los eventos: las ejecuciones acumulan manejadores (handles) de finalización; `synchronize()` los espera y los destruye; una segunda sincronización no realiza trabajo adicional del plugin.

Los casos de error son igualmente específicos. Si la espera falla, los manejadores restantes deben procesarse de todos modos y debe lanzarse el primer error. Un plugin que no proporcione un evento de finalización debe activar un error explícito en lugar de una afirmación falsa de finalización.

Estas pruebas utilizan un pequeño plugin PJRT simulado que no realiza cálculos numéricos. Verifican la semántica de sincronización y la limpieza, no el rendimiento de la GPU ni la precisión numérica. Esa distinción mantiene la evidencia de la prueba alineada con lo que se pretende demostrar.

## Mantener separados el resultado histórico y el resultado del lanzamiento

| Registro | Configuración | Resultado reportado |
| --- | --- | --- |
| Instantánea Evidence 28 oct | IREE instalado | 6.789 superadas; 46 omitidas; 3 fallos esperados; 0 fallidas |
| Instantánea Evidence 28 oct | Sin compilador | 6.367 superadas; 95 omitidas; 3 fallos esperados |
| README lanzamiento v0.1.0 | Suites de núcleo e integración, todos los extras instalados | 7.511 superadas; 77 omitidas; 4 fallos esperados; 0 fallidas |

Fuentes: [Verificación de Evidence](https://genesis.evox.group/evidence/evoxc/#verification) y [estado del lanzamiento versionado](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Estas son ejecuciones reportadas por el proyecto. Las protecciones de dependencias y hardware explican las rutas no ejercitadas; una prueba de CPU superada no es una validación de cada acelerador.

Las 285.659 líneas de texto rastreadas en la instantánea de Evidence incluyen pruebas, documentación y material de benchmark. Sus aproximadamente 50 dólares cubren tokens de modelos, excluyendo el hardware; no se informaron el modelo, el recuento de episodios ni el tiempo de ejecución activa. El intervalo temporal del repositorio no es un tiempo de ejecución autónomo continuo.

El repositorio acredita a Genesis la producción de su código, pruebas y documentación. El resultado concreto es un compilador con contratos de etapa inspeccionables por separado, pruebas de preservación de grafos y semántica de finalización en dispositivo. Comience con la [prueba de integración de población](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) para seguir una característica a través de esos límites; la [visión general de EvoX Compiler](/es/releases/evoxc-0-1-0) explica el pipeline orientado al usuario.
