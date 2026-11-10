---
title: "Traspaso del compilador Genesis: Qué hereda el siguiente modelo y cómo se verifica la continuación"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Un traspaso de modelo conserva un linaje de compilador aceptado. El resultado reportado y los entornos de regresión del compilador público muestran qué se puede verificar a través de ese límite."
---

El [registro de Evidence del 7 de septiembre de 2026](https://genesis.evox.group/evidence/compiler-continuation/) describe un traspaso de compilador de **GLM 5.2 a DeepSeek V4 Flash**, sin transferir el contexto conversacional del agente anterior. El árbol de fuentes aceptado y el linaje de Git permanecieron disponibles. La cuestión de ingeniería es qué puede inspeccionar el modelo receptor y cómo se pueden evaluar los cambios posteriores.

![Un proyecto de compilador conservado entre diferentes conjuntos de herramientas](./compiler-model-handoff.webp)

El registro informa que **1.820/1.820 casos de LLVM SingleSource retenidos pasaron las pruebas** tras la continuación, y la profundidad de recursión de tareas aumentó de 4 a 8. No se publica una transcripción por cada corrección ni el volumen de código añadido o el coste de la continuación. Las fuentes públicas de jcc que figuran a continuación explican las interfaces y los mecanismos de regresión del compilador; su instantánea independiente no reconstruye la secuencia exacta de las acciones del traspaso.

## Un compilador heredado tiene límites que un sucesor debe preservar

La [arquitectura de jcc](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) separa el frontend, la representación intermedia CIR tipada, el optimizador, el backend de código máquina, el ensamblador y el controlador de línea de comandos. El frontend entrega un árbol de sintaxis verificado al lowering; las etapas posteriores consumen la representación resultante en lugar de volver a interpretar el código fuente original de forma independiente.

Esto es relevante cuando un nuevo modelo cambia un componente. Una corrección aritmética en el lowering aún debe satisfacer el tipado de CIR; un cambio en la convención de llamadas debe concordar con la asignación de registros y la emisión de objetos. Estos son ejemplos de las dependencias documentadas por la arquitectura, no afirmaciones sobre reparaciones particulares del traspaso.

El controlador expone puntos de parada intermedios: `-E` para preprocesamiento, `-emit-jcc-ir` para CIR, `-S` para ensamblador y `-c` para emisión de objetos. Esos artefactos ayudan a localizar qué etapa cambió antes de probar un ejecutable enlazado.

## Las comprobaciones de regresión cubren programas exitosos y rechazos deliberados

La [guía de pruebas](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) describe casos de compilación y ejecución que verifican el estado de salida y la salida estándar, junto con casos de fallo de compilación que verifican la severidad del diagnóstico, el mensaje y el tramo del código fuente. Los pases de optimización también cuentan con comprobaciones de verificación de la representación.

Por lo tanto, un sucesor tiene más de una condición de aceptación. Generar un ejecutable es insuficiente si su salida cambia; aceptar un programa es insuficiente si la política del lenguaje exige rechazarlo. Probar los diagnósticos preserva comportamientos que un benchmark basado solo en el éxito omitiría.

El [README con versiones](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) enumera límites concretos, como la aritmética parcial de `long double` y los objetivos diferidos. Esos límites son información heredada útil: cambiar un rechazo documentado es una decisión de funcionalidad, no automáticamente una corrección de regresión.

## Qué compara realmente el entorno de LLVM

El [ejecutor de la suite LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) público configura la suite con el compilador bajo prueba, construye ejecutables y compara su salida con archivos de referencia. Su comparación directa se basa en tokens de espacio en blanco: los tokens no numéricos deben coincidir exactamente; los tokens numéricos utilizan una tolerancia de punto flotante configurable, por defecto 1e-4; el código de salida final debe coincidir exactamente.

Esto ilustra por qué un recuento de pruebas necesita un manifiesto y una política de comparación. El subconjunto Regression/C de 36 casos documentado del ejecutor es un alcance de evaluación diferente al de los 1.820 casos retenidos del registro de continuación. La instantánea más pequeña no puede usarse para inferir la tasa de éxito inicial del traspaso, y restar los dos totales no mediría el progreso.

## Mantener el resultado del traspaso reportado vinculado a su alcance

| Elemento | Lo que reporta el registro de continuación |
| --- | --- |
| Transición de modelo | GLM 5.2 → DeepSeek V4 Flash |
| Contexto conversacional transferido | 0 |
| Estado del proyecto preservado | Linaje del compilador aceptado |
| Profundidad de recursión de tareas | 4 → 8 |
| Evaluación final | 1.820/1.820 casos de LLVM SingleSource retenidos |

Fuente: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Estos son resultados reportados por el proyecto de un traspaso. La profundidad de recursión describe la descomposición de tareas; el resultado de la prueba proporciona la evidencia de comportamiento.

El compilador inicial y los registros de continuación enlazan al mismo repositorio. No deben contarse como dos proyectos de compilador independientes, y sus totales de pruebas con alcances diferentes deben permanecer separados.

## Hacer que un traspaso sea inspeccionable

Para un desarrollador que aplique este enfoque, un paquete de traspaso útil consiste en una revisión aceptada, comandos de construcción, contratos de interfaz, el manifiesto exacto de regresión y las exclusiones conocidas. Esta es una recomendación práctica extraída de la arquitectura y los entornos públicos, más que una afirmación de que se archivó un paquete completo de esta forma para el experimento.

Comience con un cambio pequeño y compare sus artefactos intermedios, diagnósticos y comportamiento del ejecutable frente a esa revisión. La [vista del historial de desarrollo de Genesis](/news/genesis-development-history) proporciona un contexto relacionado para seguir las contribuciones después de que el agente que las realizó haya terminado.
