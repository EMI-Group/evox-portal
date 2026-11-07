---
title: "Genesis: conservar el progreso del software entre cambios de modelo"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Un relevo en un compilador explora cómo código aceptado, estructura y registros de verificación sostienen el desarrollo cuando cambia el modelo."
---

*Actualizado el 7 de noviembre de 2026. Los resultados históricos conservan su fecha de referencia.*

Los sistemas de IA evolutiva deben conservar avances útiles cuando cambian sus participantes. El relevo de compilador de Genesis examina esta necesidad: ¿puede un modelo nuevo continuar desde el proyecto aceptado, usando su código, restricciones y pruebas como base para más trabajo?

## Partir de un compilador existente

El [registro Evidence del 7 de septiembre de 2026](https://genesis.evox.group/evidence/compiler-continuation/) describe el relevo de **GLM 5.2 a DeepSeek V4 Flash** sobre el mismo historial aceptado. No se transfirió el contexto conversacional anterior.

Sin embargo, permanecían código, estructura e historial. Es continuación de un proyecto, no construcción de un segundo compilador independiente.

## Preservar el sistema heredado

Un compilador conecta análisis sintáctico, semántica, representaciones intermedias y generación de código. Un cambio local puede afectar a otros módulos: además de añadir código, hacen falta integración y pruebas de regresión.

El repositorio jcc muestra implementación Rust, representación intermedia, límites funcionales y herramientas de prueba. Su README describe otro estado del desarrollo y no sustituye el registro del relevo.

## Resultados comunicados

La profundidad recursiva aumenta de **4 a 8**, con **1.820/1.820 casos LLVM SingleSource conservados superados** después del relevo. Es el conjunto de evaluación definido, no toda la suite LLVM.

La profundidad describe la descomposición del trabajo, no directamente su calidad. Las pruebas aportan evidencia de comportamiento; una fiabilidad general exigiría más tareas y repeticiones.

## Entender la continuidad

La lección práctica es conservar lo que pueda verificar quien continúe: código, interfaces, restricciones, cambios aceptados y procedimientos de evaluación. La memoria conversacional ayuda, pero no tiene por qué ser el único soporte del progreso.

Comience por la referencia heredada y la lista exacta de pruebas. Registre revisión validada, exclusiones y comandos antes de comparar mejoras.

## Un desarrollo que acumula resultados

Construcción y continuación comparten [el mismo repositorio](https://github.com/EMI-Group/genesis-demo-jcc). No son proyectos independientes ni deben sumarse pruebas con alcances distintos. No se comunicaron el código añadido ni el coste de la continuación.

Este caso comunicado por el proyecto convierte la continuidad en una cuestión arquitectónica: ¿qué debe conservar un proyecto para que otros agentes lo amplíen? En EvoX, conecta la capacidad de los modelos con el desarrollo acumulativo de sistemas. El conjunto de pruebas retenido aporta evidencia de este relevo; una fiabilidad más amplia exige más evaluación.
