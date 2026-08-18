---
title: "EvoX Genesis: un sistema de IA recursivo para la evolución autónoma del software a largo plazo, que construyó desde cero un compilador de C de 250.000 líneas"
pubDate: 2026-08-17
summary: "El equipo de EvoX del Departamento de Ciencia de Datos e Inteligencia Artificial de la Universidad Politécnica de Hong Kong ha publicado EvoX Genesis, un sistema de IA recursivo para la evolución autónoma del software a largo plazo. En lugar de depender de un agente persistente para sostener el desarrollo a largo plazo, deja que el propio mundo del software siga evolucionando: partiendo de un repositorio vacío, el sistema construyó un compilador de C de 248.989 líneas en 123,4 horas, con un coste total en tokens del modelo de apenas 44,38 dólares."
---

# EvoX Genesis: un sistema de IA recursivo para la evolución autónoma del software a largo plazo, que construyó desde cero un compilador de C de 250.000 líneas

![image1.png](./evox-genesis-1.png)

El equipo de EvoX del Departamento de Ciencia de Datos e Inteligencia Artificial de la Universidad Politécnica de Hong Kong ha publicado **EvoX Genesis**, un sistema de IA recursivo para la evolución autónoma del software a largo plazo.

EvoX Genesis ya no depende de un agente persistente para sostener el desarrollo a largo plazo. En lugar de eso, deja que el propio mundo del software siga evolucionando.

Partiendo de un repositorio vacío, el sistema construyó un **compilador de C de 248.989 líneas** en 123,4 horas, a lo largo de 1.019 episodios de agente, con un coste en tokens del modelo de apenas **44,38 dólares**.

<center>

## Programación a largo plazo: la frontera sigue moviéndose

</center>

El tiempo de trabajo de los agentes de programación ha pasado de tareas cortas y puntuales a decenas de horas.

OpenAI ejecutó Codex desde un repositorio vacío durante unas 25 horas seguidas, produciendo unas 30K líneas de código.

Anthropic utilizó 16 agentes Claude, a través de casi 2.000 sesiones, unas dos semanas y casi 20.000 dólares en costes de API, para construir desde cero un compilador de C de unas 100K líneas.

El tiempo sigue alargándose, los agentes siguen aumentando y el software se vuelve cada vez más complejo.

Pero el centro de la investigación sigue siendo el agente:

modelos más potentes, contextos más largos, memoria más persistente, más agentes.

**El equipo de EvoX giró la pregunta en otra dirección:**

**¿Por qué tiene que persistir el agente?**

¿Y si lo que de verdad necesita persistir es el mundo del software en el que vive?

<center>

## 123,4 horas, 250K líneas

</center>

Dejamos que EvoX Genesis partiera de un repositorio con la implementación vacía.

Solo había un objetivo: construir un compilador de C.

123,4 horas, 1.019 episodios de agente, **248.989 líneas de código** y un coste en tokens del modelo de apenas **44,38 dólares**.

El compilador final superó 220/220 pruebas de c-testsuite, 32/36 casos de prueba de LLVM y 93/93 pruebas de programas aleatorios de Csmith.

Allí no esperaba ningún compilador existente que completar — **empezó desde cero.**

![image2.png](./evox-genesis-2.png)

<center>

_Figura 1: resultados del experimento del compilador de C / tamaño del código, tiempo de ejecución, episodios de agente, coste y resultados de pruebas_

</center>

<center>

_(con el modelo DeepSeek V4 Flash)_

</center>

<center>

## No mantener vivo al agente — mantener vivo el mundo del software

</center>

La vida del software complejo es, por naturaleza, más larga que una única sesión de agente.

EvoX Genesis organiza el software en un mundo del software que se despliega de forma recursiva:

los agentes de nivel superior descomponen los objetivos y nuevos agentes completan el trabajo en posiciones locales;

una vez verificados, los resultados entran en el historial de versiones del software y se convierten en la realidad de la siguiente ronda de desarrollo.

Después, los agentes pueden desaparecer,

y nuevos agentes continúan desde el mundo del software ya conformado.

Lo que persiste no es una conversación, no es un borrador que crece sin parar y no es un "agente maestro" siempre en línea.

Lo que persiste es el código, la estructura, las restricciones, los resultados de la verificación y la historia ya ocurrida.

**Lo que persiste no es el agente, sino el mundo del software.**

**Agent does not persist. Its validated consequences do.**

Así es como EvoX Genesis sostiene la evolución autónoma del software a largo plazo. Para los usuarios, esto también significa algo muy sencillo:

**No se construyen agentes — solo se describe en qué quiere que se convierta el software.**

No hace falta diseñar de antemano agentes, roles o flujos de trabajo, ni descomponer a mano un árbol de tareas completo.

El usuario solo tiene que describir el objetivo de desarrollo en un texto breve;

cómo se descomponen las tareas, cómo se generan los agentes, cómo se despliega la recursión y cómo se verifican los resultados — todo esto lo hace EvoX Genesis por sí mismo.

![image3.png](./evox-genesis-3.png)

<center>

_Figura 2: el concepto de Persistent Recursive World / los agentes nacen, actúan y desaparecen; el mundo del software sigue desplegándose_

</center>

<center>

## Los modelos pueden cambiar; el mundo del software continúa

</center>

Esta continuidad ni siquiera exige usar el mismo modelo de principio a fin.

En otro conjunto de experimentos, un mundo del software construido inicialmente por GLM 5.2 se entregó a DeepSeek V4 Flash para continuar su desarrollo.

Al final, superó 1.820/1.820 de las pruebas LLVM SingleSource retenidas.

Los modelos pueden sustituirse, los agentes pueden sustituirse — el mundo del software continúa.

![image4.png](./evox-genesis-4.png)

<center>

_Figura 3: el experimento de continuación entre modelos, GLM 5.2 → DeepSeek V4 Flash_

</center>

<center>

## Desde cero, o heredando la historia

</center>

Construir desde cero es solo un extremo del ciclo de vida del software;

el otro extremo es un mundo del software que lleva años existiendo, rico en estructura e historia.

Aplicamos EvoX Genesis a MESA — un sistema de computación científica de evolución estelar con un largo historial de desarrollo.

El experimento involucró 13 módulos Fortran, con un total de **139.414 líneas**;

EvoX Genesis los refactorizó en los crates de Rust correspondientes, con un coste en tokens del modelo de unos **10,6 dólares**.

Un mundo del software puede crearse desde la nada, o puede heredar la historia y seguir cambiando.

![image5.png](./evox-genesis-5.png)

<center>

_Figura 4: MESA Fortran → Rust, 13 módulos, 139.414 líneas de código, 10,6 dólares_

</center>

<center>

## Las ventajas de coste se acumulan con el tiempo

</center>

El desarrollo de software a largo plazo no significa que los costes crezcan de forma lineal.

En EvoX Genesis, el código verificado, la estructura y la historia de desarrollo se acumulan sin parar y se convierten en la base de la siguiente ronda de trabajo. Los agentes posteriores no necesitan volver a entender todo el proyecto desde cero; gran parte de la información existente puede almacenarse en caché y reutilizarse directamente, con una tasa de acierto de caché de hasta el 97,4 %.

A medida que el sistema sigue funcionando, el estado de desarrollo reutilizable se enriquece, el cálculo redundante disminuye y el coste unitario del desarrollo acaba descendiendo con el tiempo.

Es interés compuesto de ingeniería que se acumula con el tiempo.

<center>

## EvoX Genesis ya es open source

</center>

El proyecto es de código abierto, con paquetes de instalación disponibles para Windows, macOS y Linux.

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

![image7.png](./evox-genesis-7.png)

<center>

**Los agentes se van; el mundo del software sigue evolucionando**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>Grupo de QQ｜</strong>Evolutionary Machine Intelligence</center>

Referencias:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
