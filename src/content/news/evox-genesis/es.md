---
title: "EvoX Genesis: un sistema de IA evolutiva recursivo que construyó desde cero un compilador de C de 250.000 líneas"
pubDate: 2026-08-17
summary: "El equipo de EvoX del Departamento de Ciencia de Datos e Inteligencia Artificial de la Universidad Politécnica de Hong Kong ha publicado EvoX Genesis, un sistema de IA evolutiva recursivo. En lugar de depender de un agente persistente para sostener el desarrollo a largo plazo, deja que el propio mundo del software siga evolucionando: partiendo de un repositorio vacío, el sistema construyó un compilador de C de 248.989 líneas en 123,4 horas, con un coste total en tokens del modelo de apenas 44,38 dólares."
---

# EvoX Genesis: un sistema de IA evolutiva recursivo que construyó desde cero un compilador de C de 250.000 líneas

![image1.png](./evox-genesis-1.png)

El equipo de EvoX del Departamento de Ciencia de Datos e Inteligencia Artificial de la Universidad Politécnica de Hong Kong ha publicado **EvoX Genesis**, un sistema de IA evolutiva recursivo.

EvoX Genesis ya no depende de un agente persistente para sostener el desarrollo a largo plazo. En su lugar, deja que el propio mundo del software siga evolucionando.

Partiendo de un repositorio vacío, el sistema construyó un **compilador de C de 248.989 líneas** en 123,4 horas, a lo largo de 1.019 episodios de agente, con un coste en tokens del modelo de apenas **44,38 dólares**.

## Programación a largo plazo: la frontera no deja de moverse

El tiempo de trabajo de los agentes de programación ha pasado de tareas breves y puntuales a decenas de horas.

OpenAI ejecutó Codex partiendo de un repositorio vacío durante unas 25 horas seguidas, produciendo alrededor de 30.000 líneas de código.

Anthropic empleó 16 agentes Claude, mediante casi 2.000 sesiones, unas dos semanas y cerca de 20.000 dólares en costes de API, para construir desde cero un compilador de C de unas 100.000 líneas.

El tiempo no deja de alargarse, los agentes no dejan de multiplicarse y el software no deja de volverse más complejo.

Pero el centro de la investigación sigue siendo el agente:

modelos más potentes, contextos más largos, memoria más persistente, más agentes.

**El equipo de EvoX orientó la pregunta en otra dirección:**

**¿Por qué tiene que persistir el agente?**

¿Y si lo que de verdad necesita persistir es el mundo del software en el que vive?

## 123,4 horas, 250.000 líneas

Hicimos que EvoX Genesis partiera de un repositorio con la implementación vacía.

Solo había un objetivo: construir un compilador de C.

123,4 horas, 1.019 episodios de agente, **248.989 líneas de código** y un coste en tokens del modelo de apenas **44,38 dólares**.

El compilador final superó 220/220 tests de c-testsuite, 32/36 casos de prueba de LLVM y 93/93 tests de programas aleatorios de Csmith.

No había ningún compilador existente esperando a ser completado — **empezó desde cero.**

![image2.png](./evox-genesis-2.png)

_Figura 1: resultados del experimento del compilador de C / tamaño del código, tiempo de ejecución, episodios de agente, coste y resultados de los tests_

_(utilizando el modelo DeepSeek V4 Flash)_

## No mantengáis con vida al agente — mantened con vida al mundo del software

La vida del software complejo es, por naturaleza, más larga que una única sesión de agente.

EvoX Genesis organiza el software en un mundo del software que se despliega recursivamente:

los agentes de nivel superior descomponen los objetivos y nuevos agentes completan el trabajo en posiciones locales;

una vez verificados, los resultados entran en el historial de versiones del software y se convierten en la realidad del siguiente ciclo de desarrollo.

Entonces los agentes pueden desaparecer,

y nuevos agentes continúan a partir del mundo del software que ya ha tomado forma.

Lo que persiste no es una conversación, no es un scratchpad que crece sin parar ni un «agente maestro» siempre conectado.

Lo que persiste es el código, la estructura, las restricciones, los resultados de la verificación y la historia que ya ha ocurrido.

**Lo que persiste no es el agente, sino el mundo del software.**

**El agente no persiste. Persisten sus consecuencias validadas.**

Esta es la evolución autónoma recursiva de EvoX Genesis. Para los usuarios también significa algo muy sencillo:

**No construís agentes — solo describís lo que queréis que el software llegue a ser.**

No hace falta diseñar de antemano agentes, roles ni flujos de trabajo, ni descomponer a mano un árbol de tareas completo.

El usuario solo tiene que describir el objetivo de desarrollo del software en un texto breve;

cómo se descomponen las tareas, cómo se generan los agentes, cómo se despliega la recursión y cómo se verifican los resultados — todo esto lo hace el propio EvoX Genesis.

![image3.png](./evox-genesis-3.png)

_Figura 2: el concepto de Persistent Recursive World / los agentes nacen, actúan y desaparecen; el mundo del software sigue desplegándose_

## Los modelos se pueden cambiar; el mundo del software continúa

Esta continuidad ni siquiera exige usar el mismo modelo durante todo el proceso.

En otro conjunto de experimentos, un mundo del software construido inicialmente por GLM 5.2 se entregó a DeepSeek V4 Flash para que continuara su desarrollo.

Al final superó 1.820/1.820 de los tests LLVM SingleSource conservados.

Los modelos se pueden sustituir, los agentes se pueden sustituir — el mundo del software continúa.

![image4.png](./evox-genesis-4.png)

_Figura 3: el experimento de continuación entre modelos, GLM 5.2 → DeepSeek V4 Flash_

## Desde cero, o heredando la historia

Construir desde cero es solo un extremo del ciclo de vida del software;

el otro es un mundo del software que lleva años existiendo, rico en estructura e historia.

Aplicamos EvoX Genesis a MESA — un sistema de computación científica de evolución estelar con un largo desarrollo a sus espaldas.

El experimento implicó 13 módulos Fortran, con un total de **139.414 líneas**;

EvoX Genesis los refactorizó en los crates Rust correspondientes, con un coste en tokens del modelo de unos **10,6 dólares**.

Un mundo del software puede crearse desde la nada, o puede heredar la historia y seguir transformándose.

![image5.png](./evox-genesis-5.png)

_Figura 4: MESA Fortran → Rust, 13 módulos, 139.414 líneas de código, 10,6 dólares_

## Las ventajas de coste se acumulan con el tiempo

El desarrollo de software a largo plazo no significa que los costes crezcan linealmente sin parar.

En EvoX Genesis, el código verificado, la estructura y el historial de desarrollo se van acumulando y se convierten en la base del siguiente ciclo de trabajo. Los agentes posteriores no necesitan volver a entender todo el proyecto desde cero; gran parte de la información existente se puede almacenar en caché y reutilizar directamente, con una tasa de acierto de caché de hasta el 97,4 %.

A medida que el sistema sigue funcionando, el estado de desarrollo reutilizable se enriquece, el cálculo redundante disminuye y el coste unitario del desarrollo en realidad desciende con el tiempo.

Es un interés compuesto de ingeniería que se acumula con el tiempo.

## EvoX Genesis ya es open source

El proyecto es de código abierto, con instaladores disponibles para Windows, macOS y Linux.

🌐 Sitio web:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Descargas**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Paper:**

**https://arxiv.org/abs/2608.10450**

🌐 Grupo de QQ: 297969717

![image6.png](./evox-genesis-6.png)

**Los agentes se marchan; el mundo del software sigue evolucionando**

**EvoX Genesis**

Referencias:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
