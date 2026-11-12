---
title: "TensorNEAT: refinar redes distintas sin guardar todos los intermedios"
pubDate: 2026-04-04
summary: "Gradientes paralelos y memoria controlada conectan búsqueda de topologías y ajuste de parámetros con JAX."
---

Buscar estructuras neuronales produce individuos diferentes. La [integración de gradientes del 3 de marzo de 2026][s1] permite ajustar parámetros entre topologías distintas en TensorNEAT. La [actualización de memoria del 4 de abril][s2] reduce intermedios y añade lotes poblacionales, ofreciendo un control distinto de reducir la búsqueda.

![Redes neuronales distintas atraviesan una pequeña abertura en grupos](./cover.webp)

*Ilustración conceptual: preservar la población limitando el lote de trabajo activo.*

## Estructuras diferentes, una operación de gradiente

TensorNEAT representa redes NEAT con tensores de nodos y conexiones. `genome.grad` devuelve pérdida escalar y gradientes de ambos arrays. Los campos estructurales, índices y tipos de función, y el relleno NaN reciben gradientes nulos. Se ajustan parámetros numéricos conservando la estructura codificada.

La vectorización JAX aplica el cálculo a topologías diferentes. El [ejemplo XOR][s3] inicializa una población, la diversifica por mutación y optimiza las redes con descenso de gradiente. Es una pieza concreta para estudiar estructura y parámetros juntos sin suponer que el gradiente cambia conexiones discretas.

## Dividir el trabajo, no el espacio de búsqueda

Abril añade `pop_batch_size` a NEAT y Pipeline. El valor de Pipeline reemplaza el del algoritmo y debe dividir la población. El antiguo argumento `eval_batch_size` se sustituye, por lo que deben migrarse las configuraciones que lo usan.

En un dispositivo, la transformación entra en `jax.lax.scan`. En vez de materializar toda la adyacencia densa de la población antes de evaluar, se transforma y evalúa un lote cada vez. La mutación usa el mismo control. La población no cambia; cambia el conjunto de trabajo simultáneo. Es útil cuando se necesita diversidad pero se alcanza el límite de memoria GPU.

## Búsquedas sin grandes comparaciones intermedias

El cruzamiento sustituye comparaciones anidadas por coincidencias hash y búsqueda ordenada. Las claves de conexión se convierten en índices de nodos mediante ordenación y búsqueda. Se abordan arrays temporales que crecen al aumentar población y capacidad de red.

El commit comunica trayectorias iguales durante 15 generaciones con semilla fija para DefaultGene y OriginGene. Es una regresión concreta, no una promesa para todas las dependencias o dispositivos. Los scripts de corrección y memoria permiten examinar implementación y afirmaciones conjuntamente.

## Elegir el lote mediante un experimento reproducible

Empieza con ajuste de funciones pequeño y límites fijos de nodos y conexiones. Registra la secuencia sin lotes y elige un divisor de la población. Compara primero la corrección y mide memoria máxima, compilación y tiempo por paso separadamente. Un lote pequeño reduce memoria pero cambia el paralelismo disponible.

Para gradientes, consulta XOR y explicita pérdida y tasa de aprendizaje. Para memoria, fija el [código de abril][s4]. TensorNEAT usa JAX; la integración EvoX del README apunta a la rama de la época JAX, importante al combinar entornos. Así puede investigarse cuánta búsqueda estructural y paramétrica cabe en un presupuesto de memoria.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s3]: https://github.com/EMI-Group/tensorneat/blob/ce27fa9f794928c9416d9f12c398f58481c821ce/examples/func_fit/xor_grad.py
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
