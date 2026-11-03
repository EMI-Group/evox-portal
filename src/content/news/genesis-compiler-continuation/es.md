---
title: "Genesis continúa desarrollando un compilador tras cambiar de modelo"
pubDate: 2026-11-03
summary: "El caso de continuación de Genesis informa de 1,820/1,820 pruebas LLVM SingleSource seleccionadas superadas tras pasar de GLM 5.2 a DeepSeek V4 Flash."
---

¿Puede avanzar un proyecto cuando cambia el modelo subyacente? El registro Compiler Continuation, fechado el 7 de septiembre de 2026, describe la reanudación desde el repositorio aceptado del compilador sin transferir el contexto conversacional del Agent anterior.

El registro informa de un cambio de **GLM 5.2 a DeepSeek V4 Flash**, con una profundidad de recursión que pasó de **4 a 8**. La continuación superó **1,820/1,820 casos LLVM SingleSource conservados para la evaluación**. Es un conjunto definido, no toda la batería LLVM.

El código aceptado y el historial del proyecto sirven de base para el trabajo posterior: así ilustra Genesis la continuidad. La creación del compilador y su continuación comparten repositorio; no deben contarse como proyectos independientes.

Esta retrospectiva sigue el registro Evidence. Los resultados proceden del proyecto y no se han reproducido independientemente; no se publicaron el coste ni el código añadido durante la continuación. El README de la rama predeterminada describe otra evaluación, cuyos recuentos no deben combinarse con este resultado.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
