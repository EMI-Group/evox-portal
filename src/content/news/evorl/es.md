---
title: "EvoRL: búsqueda evolutiva y aprendizaje por refuerzo juntos en GPU"
pubDate: 2025-01-14
updatedDate: 2026-11-08
summary: "EvoRL conecta búsqueda por poblaciones, aprendizaje por refuerzo y simulación paralela para experimentar con enfoques evolutivos de Physical AI."
---

Physical AI necesita explorar comportamientos distintos, probarlos mediante interacción y reutilizar la experiencia útil. EvoRL introduce ese ciclo en la simulación paralela: las políticas individuales aprenden mientras la búsqueda por poblaciones explora alternativas y configuraciones de aprendizaje. La relación entre aprendizaje y evolución se vuelve así accesible a la experimentación.

![Modelos de patas mecánicas exploran rutas en un ciclo de simulación compartido](./population-learning-loop.webp)

EvoRL es un framework de investigación de código abierto concebido para estas preguntas. Basado en JAX, reúne aprendizaje por refuerzo, computación evolutiva y simulación en un flujo común para desarrollar y evaluar métodos clásicos e híbridos. Como proyecto hermano de EvoX, se centra en combinarlos para que la búsqueda a escala de población aproveche las GPU modernas. [Presentación del proyecto](https://github.com/EMI-Group/evorl)

## ¿Por qué combinar evolución y aprendizaje por refuerzo?

Pensemos en un robot que aprende a caminar. Varias políticas pueden resolver la misma tarea con distintas formas de andar, equilibrios entre velocidad y estabilidad y necesidades energéticas. Mejorar una política siguiendo una sola trayectoria de aprendizaje puede dejar muchas posibilidades sin explorar.

El aprendizaje por refuerzo usa datos de interacción para perfeccionar políticas. La computación evolutiva mantiene un conjunto de candidatos, los evalúa, selecciona y modifica para conservar varias direcciones de búsqueda. Al combinarlos, se puede estudiar un proceso más rico: los individuos mejoran con la experiencia y la población transmite resultados útiles entre ellos.

La búsqueda evolutiva puede actuar directamente sobre los parámetros de las políticas o ajustar los hiperparámetros del aprendizaje. Son preguntas diferentes: qué políticas buscar y cómo ayudarlas a aprender mejor.

Esta complementariedad no significa que los métodos híbridos superen al aprendizaje por refuerzo por sí solo en todas las tareas. Ofrece más opciones de diseño que comprobar; EvoRL busca reducir el coste de desarrollo y cómputo necesario para explorarlas.

## Diseño central: un flujo de entrenamiento pensado para GPU

La diversidad hace atractivos a los métodos basados en poblaciones, pero también tiene un coste. Cada política adicional puede requerir más interacciones, evaluaciones y actualizaciones. Cuando estas etapas se reparten entre CPU y GPU, las transferencias repetidas y la planificación de su ejecución pueden convertirse en cuellos de botella.

Con entornos de simulación GPU compatibles, EvoRL organiza las interacciones, el cálculo de las políticas, las operaciones evolutivas y las actualizaciones en un flujo GPU de extremo a extremo. La vectorización y compilación just-in-time de JAX agrupan cálculos repetidos y optimizan el grafo de cómputo del paso de entrenamiento. [Descripción técnica](https://evorl.readthedocs.io/latest/)

El paralelismo funciona en tres niveles:

- **Entornos paralelos**: una política interactúa con varias instancias para recoger experiencia por lotes.
- **Individuos paralelos**: varias políticas candidatas de una población se evalúan simultáneamente.
- **Entrenamiento paralelo**: varios agentes aprenden a la vez, lo que permite métodos híbridos y entrenamiento de poblaciones.

Así resulta más sencillo experimentar con más políticas a la vez. El tamaño de la población debe seguir teniendo en cuenta la memoria GPU, el coste del entorno y el tamaño de la red. [Artículo sobre la arquitectura](https://arxiv.org/abs/2501.15129)

## Comparar cuatro familias de métodos en un mismo framework

EvoRL proporciona una base experimental común para establecer referencias y añadir después mecanismos de búsqueda o aprendizaje.

| Familia de métodos | Algoritmos representativos | Pregunta principal |
| --- | --- | --- |
| Aprendizaje por refuerzo | PPO, TD3, SAC y otros | ¿Cómo mejorar una política con datos de interacción? |
| Algoritmos evolutivos | OpenES, ARS, CMA-ES y otros | ¿Cómo orientar la búsqueda a partir de la evaluación de los candidatos? |
| Aprendizaje por refuerzo guiado por evolución | ERL, CEM-RL y variantes | ¿Cómo hacer cooperar la búsqueda evolutiva y el aprendizaje por gradiente? |
| AutoRL basado en poblaciones | PBT-PPO, PBT-SAC y otros | ¿Cómo adaptar la configuración durante el entrenamiento? |

Dos direcciones híbridas merecen especial atención.

**El aprendizaje por refuerzo guiado por evolución** conecta la búsqueda en poblaciones con el aprendizaje individual. Una población puede explorar distintas regiones del espacio de parámetros, mientras las actualizaciones por refuerzo mejoran las políticas candidatas. Los algoritmos difieren en cómo comparten experiencias, actualizan individuos y seleccionan la población. EvoRL ofrece implementaciones para estudiar estas decisiones.

**El AutoRL basado en poblaciones** explora las configuraciones de entrenamiento. En PBT, por ejemplo, varios individuos se entrenan por separado. Según evaluaciones periódicas, heredan estados de entrenamiento de individuos con mejores resultados y perturban los hiperparámetros para seguir explorando. Así, los hiperparámetros pueden cambiar durante el proceso.

Los algoritmos y variantes disponibles dependen de la implementación actual del repositorio. [Lista de algoritmos](https://github.com/EMI-Group/evorl#algorithms)

## Modularidad: llevar las ideas de investigación a los experimentos

Desarrollar algoritmos híbridos suele exigir mucho trabajo de adaptación de entornos, organización de datos, evaluación y coordinación de interfaces. EvoRL estructura estas responsabilidades con unas pocas abstracciones centrales:

- **Env** proporciona una interfaz común de interacción con los entornos.
- **Agent** define el comportamiento del agente y su lógica de aprendizaje.
- **SampleBatch** organiza trayectorias y muestras.
- **Workflow** define los pasos de entrenamiento del algoritmo.
- **EC** proporciona algoritmos evolutivos y operadores relacionados.

Estos módulos permiten cambiar partes concretas del experimento: sustituir la búsqueda manteniendo el entorno y la red de la política, o comparar el aprendizaje antes y después de añadir operaciones evolutivas. [Documentación del framework y la API](https://evorl.readthedocs.io/latest/)

Una implementación común también facilita el control de variables. Igualar tareas, procedimientos de evaluación y presupuestos ayuda a distinguir las mejoras algorítmicas de las diferencias de implementación. El framework facilita estas comparaciones, pero el rigor del diseño experimental sigue siendo responsabilidad de los investigadores.

## ¿Qué significan las mejoras de rendimiento?

El artículo de EvoRL compara la eficiencia computacional en Swimmer de Brax, con un ordenador equipado con dos CPU Intel Xeon Gold 6132, 128 GiB de RAM y una GPU RTX 3090. En las configuraciones probadas, OpenES alcanza una aceleración máxima superior a 60× respecto a la implementación distribuida en CPU de RLlib; CEM-RL obtiene aproximadamente 5–9× respecto a su implementación oficial.

Estas cifras corresponden a tareas, tamaños de población y referencias concretos. No implican la misma mejora en todas las tareas ni una reducción equivalente de las muestras necesarias para alcanzar una recompensa objetivo. [Configuración experimental y resultados](https://arxiv.org/html/2501.15129v1#S5)

Al planificar experimentos, una mayor capacidad de procesamiento permite considerar más semillas aleatorias, estudios de ablación más completos o poblaciones mayores. El beneficio práctico es poder comprobar más ideas con el presupuesto disponible.

## Del control robótico a nuevas tareas de decisión

EvoRL admite Brax y MuJoCo Playground para control continuo, búsqueda de políticas y entrenamiento de poblaciones. Las integraciones experimentales con gymnax, Jumanji y JaxMARL abarcan control clásico, juegos, optimización combinatoria y entornos multiagente; hay que comprobar la compatibilidad de los algoritmos en cada configuración. También admite algunos entornos CPU, por lo que ejecutar todo el flujo en GPU depende de la combinación elegida. [Entornos compatibles](https://github.com/EMI-Group/evorl#rl-environments)

En investigación sobre aprendizaje por refuerzo evolutivo, se puede establecer una referencia con algoritmos existentes y modificar después la cooperación entre búsqueda y aprendizaje de políticas. Para AutoRL, PBT permite empezar a estudiar el efecto de las configuraciones. Quienes desarrollan nuevos métodos de optimización pueden integrar progresivamente sus componentes mediante interfaces comunes.

## Ejecutar el primer experimento

La instalación actual requiere Python 3.12 o posterior y JAX/jaxlib 0.10.0 o posterior. [EvoRL](https://github.com/EMI-Group/evorl#installation)

Siga primero la [guía de instalación](https://evorl.readthedocs.io/latest/guide/installation.html) para configurar JAX según su hardware. Instale después EvoRL desde el código fuente para obtener los scripts y configuraciones del ejemplo:

```bash
git clone https://github.com/EMI-Group/evorl.git
cd evorl
pip install -e .
```

Empiece con una referencia PPO en el entorno Ant de Brax:

```bash
python scripts/train.py agent=ppo env=brax/ant
```

EvoRL utiliza Hydra para gestionar las configuraciones. Una vez que funcione la referencia, puede variar semillas aleatorias, configuraciones de algoritmos y ajustes del entorno antes de pasar a métodos híbridos o poblaciones. Consulte la [guía de inicio rápido](https://evorl.readthedocs.io/latest/guide/quickstart.html).

Conserve la primera ejecución PPO como referencia: guarde entorno, semilla, configuración y curva antes de cambiar un componente. Para empezar con una búsqueda poblacional más sencilla, consulte el [tutorial de EvoX](/es/news/evox-quickstart).
