---
title: "TensorNEAT: conservar la población y limitar la memoria de trabajo"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Los lotes de población y unos intermediarios de búsqueda menores reducen el conjunto de trabajo simultáneo de NEAT sin reducir la población."
---

Aunque los genomas quepan en la GPU, sus matrices de transformación y evaluación pueden agotar la memoria. La [actualización del 4 de abril de 2026][s2] de TensorNEAT mueve la transformación a lotes secuenciales y reduce los intermediarios de búsqueda. Mantiene el número de candidatos mientras permite controlar el conjunto de trabajo.

![Redes neuronales distintas atraviesan una pequeña abertura en grupos](./cover.webp)

*Ilustración conceptual: preservar la población limitando el lote de trabajo activo.*

## Dividir el trabajo, no el espacio de búsqueda

Abril añade `pop_batch_size` a NEAT y Pipeline. El valor de Pipeline reemplaza el del algoritmo y debe dividir la población. El antiguo argumento `eval_batch_size` se sustituye, por lo que deben migrarse las configuraciones que lo usan.

En un dispositivo, la transformación entra en `jax.lax.scan`. En vez de materializar toda la adyacencia densa de la población antes de evaluar, se transforma y evalúa un lote cada vez. La mutación usa el mismo control. La población no cambia; cambia el conjunto de trabajo simultáneo. Es útil cuando se necesita diversidad pero se alcanza el límite de memoria GPU.

Lo importante es dónde empieza el lote. Dividir la evaluación tras transformar toda la población deja ya asignada la gran matriz de adyacencia. Mover ambas operaciones al cuerpo de scan cambia su duración. El commit describe el paso de población × nodos × nodos a lote × nodos × nodos. Es una comparación de implementación, no una fórmula de memoria total: genomas, estado persistente y otros búferes siguen ocupando espacio. [Cambio de transformación][s2]

El procesamiento por lotes es una elección de ejecución. No selecciona menos supervivientes ni cambia la población solicitada. Reducir la población sí cambia los candidatos y puede modificar la búsqueda. Distingue los ajustes al diagnosticar falta de memoria. Una primera comparación útil mantiene la población y varía solo un divisor válido para el lote.

## Búsquedas sin grandes comparaciones intermedias

El cruzamiento sustituye comparaciones anidadas por coincidencias hash y búsqueda ordenada. Las claves de conexión se convierten en índices de nodos mediante ordenación y búsqueda. Se abordan arrays temporales que crecen al aumentar población y capacidad de red.

El commit comunica trayectorias iguales durante 15 generaciones con semilla fija para DefaultGene y OriginGene. Es una regresión concreta, no una promesa para todas las dependencias o dispositivos. Los scripts de corrección y memoria permiten examinar implementación y afirmaciones conjuntamente.

## Elegir el lote mediante un experimento reproducible

Empieza con ajuste de funciones pequeño y límites fijos de nodos y conexiones. Registra la secuencia sin lotes y elige un divisor de la población. Compara primero la corrección y mide memoria máxima, compilación y tiempo por paso separadamente. Un lote pequeño reduce memoria pero cambia el paralelismo disponible.

Usa la [instantánea de abril][s4] para fijar la semántica de configuración, incluido el argumento de lote renombrado. TensorNEAT se basa en JAX y su integración EvoX documentada apunta a la rama de la época JAX. Registra versiones de dependencias con las medidas. El artículo separado de [gradientes de población][gradient] explica el aprendizaje. Comprueba primero que cambiar el lote conserva los resultados de tu ejecución; después evalúa la relación entre memoria y tiempo.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /es/news/tensorneat-population-gradients
