---
title: "1. Introducción"
order: 1
---

# 1. Introducción

## ¿Qué es EvoX?

EvoX es una librería de computación evolutiva de código abierto, utilizada principalmente para resolver diversos problemas de optimización complejos. La computación evolutiva es una categoría de algoritmos que simulan la evolución natural para buscar soluciones óptimas, incluyendo Algoritmos Genéticos (GA), Estrategias de Evolución (ES), Optimización por Enjambre de Partículas (PSO), etc.

Los frameworks evolutivos tradicionales suelen estar limitados por los recursos computacionales y los modelos de programación, lo que los hace ineficientes para problemas a gran escala. EvoX supera estos desafíos combinando **GPU acceleration** y **distributed computing**, ofreciendo una solución eficiente y escalable que permite a los usuarios encontrar mejores soluciones más rápido en espacios de búsqueda complejos.

## Características clave de EvoX

- **Arquitectura modular**: EvoX divide el proceso de optimización en módulos independientes: `Algorithm`, `Problem`, `Monitor` y `Workflow`. Los usuarios no necesitan preocuparse por las implementaciones paralelas de bajo nivel; EvoX aprovecha automáticamente el hardware para aumentar el rendimiento.
- **Ejecución distribuida**: EvoX admite la ejecución distribuida multi-GPU e incluso multi-nodo. El mismo código puede ejecutarse en una sola máquina o escalarse a un clúster de GPU con poco o ningún esfuerzo adicional de programación paralela. Esto significa que sus tareas de optimización pueden escalar fácilmente desde un portátil hasta un entorno de clúster de servidores.
- **Interfaz de programación funcional**: EvoX proporciona una interfaz de programación funcional que se alinea estrechamente con los modelos matemáticos. Los algoritmos principales se implementan como funciones puras sin efectos secundarios, lo que simplifica la paralelización y la depuración. Los usuarios solo necesitan implementar las funciones requeridas según lo definido por el framework, sin gestionar manualmente estados complejos de los algoritmos.
- **Visualización y monitorización**: EvoX incluye completas herramientas de visualización y módulos de monitorización para seguir el proceso evolutivo en tiempo real. Utiliza un formato de datos `.exv` dedicado para el streaming y registro eficiente de datos de optimización y proporciona módulos de visualización intuitivos para trazar curvas de convergencia y más. Estas herramientas ofrecen a los usuarios una comprensión intuitiva del rendimiento del algoritmo y del estado de convergencia.
- **Extensas librerías de algoritmos y problemas**: EvoX incluye más de 50 algoritmos evolutivos mono-objetivo y multi-objetivo y más de 100 problemas de optimización de referencia (benchmark). Ya sea optimización de funciones clásica, desafíos de ingeniería complejos o tareas de machine learning como la optimización de hiperparámetros (HPO) y neuroevolution, EvoX proporciona algoritmos e interfaces de problemas listos para usar.

## Casos de uso

Gracias a las características anteriores, EvoX es especialmente adecuado para los siguientes escenarios:

- **Optimización de parámetros a gran escala**: Para problemas de alta dimensión con grandes espacios de búsqueda, el cálculo paralelo basado en GPU y los algoritmos eficientes de EvoX pueden reducir significativamente el tiempo de resolución. Los ejemplos incluyen la optimización de los pesos de redes neuronales o el diseño de parámetros de sistemas complejos; EvoX puede acelerar el proceso.
- **Optimización multi-objetivo**: Cuando se necesita optimizar múltiples objetivos (a menudo en conflicto) simultáneamente —como equilibrar el coste y el rendimiento en el diseño de ingeniería— EvoX incluye una variedad de algoritmos evolutivos multi-objetivo (como NSGA-II, RVEA, etc.) para buscar el conjunto óptimo de Pareto.
- **Optimización de hiperparámetros (HPO)**: La búsqueda de las mejores combinaciones de hiperparámetros para modelos de machine learning puede llevar mucho tiempo. EvoX permite el uso de estrategias evolutivas para buscar eficientemente configuraciones de hiperparámetros, encontrando a menudo mejores soluciones más rápido que el `grid search` o el `random search`.
- **Aprendizaje por refuerzo y neuroevolution**: EvoX admite de forma nativa entornos de aprendizaje por refuerzo (como OpenAI Gym y Google Brax) y conjuntos de datos de deep learning (como CIFAR-10). Esto permite a los usuarios entrenar políticas de control o arquitecturas de redes neuronales utilizando algoritmos evolutivos (es decir, neuroevolution); por ejemplo, utilizando algoritmos genéticos para optimizar los parámetros de la política de RL.
- **Investigación académica y aplicaciones de ingeniería**: Para los investigadores en algoritmos evolutivos, EvoX ofrece una plataforma altamente flexible para implementar y probar nuevos métodos. Para tareas de optimización en ingeniería (como el ajuste de parámetros de procesos industriales o el ajuste de sistemas de control), EvoX proporciona un `solver` de alto rendimiento que puede obtener soluciones casi óptimas en un tiempo razonable.

En resumen, EvoX es adecuado para cualquier tarea de optimización que **requiera explorar un gran espacio de soluciones rápidamente**, siempre que la tarea pueda paralelizarse masivamente en una GPU. Tanto si es un investigador de IA como un desarrollador de ingeniería que se enfrenta a problemas de optimización complejos, EvoX es una herramienta potente para mejorar su eficiencia de resolución.

> **Consejo:**
> EvoX puede ejecutarse en muchos dispositivos GPU, incluyendo GPUs de NVIDIA y AMD, o incluso en la GPU de su Mac.