---
title: "Genesis WASM Render: Corrección del orden de validación y precisión de píxeles en un renderizador WebGL"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Dos correcciones documentadas de WebGL2 conectan las causas raíz con los resultados de regresión, mientras que el registro de verificación final distingue la conformidad de la API de la coincidencia visual."
---

Un renderizador WebGL por software debe hacer algo más que dibujar una imagen reconocible. Debe compilar shaders, mantener el estado de la API, validar las entradas en el orden correcto y preservar la precisión de la imagen a través de los límites del módulo. El caso de Genesis WASM Render contiene dos ejemplos concretos de esos requisitos siendo depurados y verificados de nuevo.

![La geometría de malla de alambre se convierte en una imagen de píxeles sombreados](./software-graphics-pipeline.webp)

El registro de [Evidence](https://genesis.evox.group/evidence/tbench-wasm/) describe una implementación en TypeScript desarrollada con DeepSeek V4 Flash: 2.017/2.019 casos de Khronos CTS superados, aproximadamente 36 USD en costes de tokens del modelo y 65,9 horas entre el primer y el último commit del agente. Ese intervalo es la duración del historial del repositorio, no el tiempo de ejecución medido del agente activo.

## Dividir el pipeline a lo largo de interfaces utilizables

La [arquitectura de origen](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) separa la compilación y el enlazado de shaders, la rasterización, el estado y los objetos de WebGL, y la presentación/decodificación de imágenes. El resultado de un shader todavía tiene que pasar por la interpolación, la ejecución de fragmentos, el manejo de texturas y el búfer de dibujo antes de convertirse en una imagen visible.

El renderizador sin dependencias en tiempo de ejecución tiene como objetivo la ejecución sin renderizado por GPU nativa. Aún así, se utilizan entornos de conformidad basados en navegador para probarlo; ese entorno de verificación es distinto de la declaración de dependencias en tiempo de ejecución del renderizador.

## Un error de seguridad debía ocurrir antes que un error de vinculación de textura

Una página de WebGL2 que fallaba se refería a una fuente de imagen con origen contaminado (origin-tainted). El [registro de verificación final](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) lo rastrea hasta el orden de validación, en lugar de una capacidad de worker faltante.

La implementación comprobaba la vinculación de la textura antes de comprobar si el origen era seguro (origin-clean). La corrección `7d8718a` movió la comprobación de seguridad antes de la validación de vinculación en los seis puntos de entrada de fuentes de imagen relevantes, cubriendo tanto las cargas de imagen como de subimagen. La página afectada pasó de **9 subpruebas superadas / 4 fallidas a 13 / 0**.

Este es un problema de integración: ambas comprobaciones existían, pero su orden cambió el comportamiento observable de la API. El resultado objetivo se incluyó luego en una ejecución de la suite completa, en lugar de tratarse como prueba de que el comportamiento no relacionado no había cambiado.

## Una textura de alta profundidad de bits fallaba antes de llegar al renderizador

Una segunda página probaba la entrada de texturas de mayor precisión. El mismo registro identifica una ruta de decodificación de imagen que reducía la fuente a ocho bits por canal antes de la carga. Las correcciones `89e4559` y `9bd7811` añadieron una ruta de PNG de 16 bits en JavaScript y corrigieron el manejo de canales, incluyendo la entrada RGBA.

La página `tex-image-10bpc` pasó de **2 subpruebas superadas / 1 fallida a 3 / 0**. La implementación relevante es el [decodificador PNG de la capa de presentación](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Este ejemplo muestra por qué cambiar solo la aritmética del shader no habría solucionado todos los fallos de precisión: los datos ya habían perdido precisión previamente.

## Verificar el paquete enviado, incluyendo qué renderizador se ejecutó

El [registro final del 29 de agosto](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifica el commit del paquete `c4ffbff`. Indica que el archivo `renderer.js` incluido se probó tal cual, sin reconstruirlo para la verificación.

| Suite evaluada | Superadas | Fallidas | Timeouts / errores |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1.184/1.184 | 0 | 0 / 0 |
| Combinada | 2.017/2.019 | 2 | 0 / 0 |

El denominador sigue los manifiestos en ese árbol de pruebas. El registro también establece que las 2.019 páginas calificadas informaron que el renderizador por software estaba activo, por lo que el respaldo nativo (fallback) no proporcionó los resultados satisfactorios. Para esas dos páginas de WebGL2 corregidas, la ejecución completa recuperó ambos fallos manteniendo las páginas que ya superaban las pruebas anteriormente.

![Resultados de conformidad de WebGL para la ejecución documentada de Genesis](./wasm-render-results-en.png)

*Figura de resultados históricos; el registro final con versión define los manifiestos y recuentos evaluados.*

## Investigar fallos residuales con un control

Dos páginas de WebGL1 siguieron fallando. El registro final atribuye el caso de color con alfa bajo al comportamiento de presentación/lectura del canvas 2D de Chromium e informa del mismo fallo con WebGL nativo. Para los identificadores de shader con doble guion bajo, informa que Chrome nativo también falló en la página de prueba.

Estos son los resultados de control documentados del proyecto, no una reproducción independiente. Explican la clasificación de los residuales por parte de los autores sin convertir el 2.017/2.019 en una afirmación de compatibilidad incondicional.

La comparación visual es una comprobación independiente. El registro de Evidence informa de **16/38 páginas de three.js con un umbral estricto de píxeles del 0,1%** y **13/16 escenas de Babylon.js**, ambos subconjuntos seleccionados. La conformidad de la API y la concordancia de píxeles miden propiedades diferentes; el alto recuento de CTS no borra los fallos visuales.

## Seguir un fallo desde la página de prueba hasta el artefacto final

Con los árboles de prueba y las dependencias del entorno preparados, el registro final documenta este punto de entrada de WebGL2:

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

El registro señala que las salidas JSON detalladas están en el gitignore. Su informe incluido y los identificadores de corrección son el rastro público; este artículo no ha vuelto a ejecutar la suite.

Las 135.165 líneas de texto rastreadas del archivo incluyen el paquete generado, material de terceros, archivos de bloqueo y documentación. Los 36 USD cubren los tokens del modelo, excluyendo el hardware. Comience con la corrección del orden de validación y su página de prueba al inspeccionar este caso: conecta un fallo específico, un cambio en el código fuente y el resultado integrado sin depender únicamente del volumen de código.
