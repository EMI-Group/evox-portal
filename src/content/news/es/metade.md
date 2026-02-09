---
title: "MetaDE: Evolucionando la Evolución Diferencial mediante Evolución Diferencial"
pubDate: 2025-02-15
summary: "MetaDE es un método metaevolutivo que utiliza la Evolución Diferencial para evolucionar sus propios hiperparámetros y estrategias, publicado en IEEE TEVC."
---

La Evolución Diferencial (DE), uno de los algoritmos fundamentales en la computación evolutiva, se ha empleado ampliamente en problemas de optimización de caja negra debido a su simplicidad y alta eficiencia. No obstante, su rendimiento depende en gran medida de la selección de hiperparámetros y estrategias, un problema persistente para los investigadores. Para abordar este desafío, el equipo de EvoX publicó recientemente un estudio en *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* titulado "MetaDE: Evolving Differential Evolution by Differential Evolution". Como método metaevolutivo que aprovecha la DE para evolucionar sus propios hiperparámetros y estrategias, MetaDE permite el ajuste dinámico de parámetros y estrategias al tiempo que incorpora computación paralela acelerada por GPU. Este diseño mejora sustancialmente la eficiencia computacional junto con el rendimiento de la optimización. Los resultados experimentales demuestran que MetaDE ofrece un rendimiento excepcional tanto en la suite de benchmarks CEC2022 como en tareas de control de robots. El código fuente de MetaDE es de código abierto y está disponible en GitHub en [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Antecedentes**

En el campo de la Computación Evolutiva, el rendimiento de los algoritmos suele estar significativamente influenciado por la elección de los hiperparámetros. Determinar la configuración de parámetros más adecuada para un problema específico ha sido un desafío de investigación de larga data. La Evolución Diferencial (DE), como algoritmo evolutivo clásico, es ampliamente favorecida por su simplicidad y su robusta capacidad de búsqueda global; no obstante, su rendimiento es altamente sensible a la selección de hiperparámetros. Los métodos convencionales suelen basarse en el ajuste basado en la experiencia o en mecanismos adaptativos para mejorar el rendimiento. Sin embargo, ante diversos escenarios de problemas, estos enfoques frecuentemente tienen dificultades para equilibrar la eficiencia y la aplicabilidad general.

El concepto de "Metaevolución" se introdujo ya en el siglo pasado, con el objetivo de utilizar los propios algoritmos evolutivos para optimizar las configuraciones de hiperparámetros de dichos algoritmos. Aunque la metaevolución ha existido durante muchos años, su aplicación práctica se ha visto limitada por las altas demandas computacionales. Los avances recientes en la computación por GPU han aliviado estas limitaciones, proporcionando un sólido soporte de hardware para los algoritmos evolutivos. En particular, la introducción del framework EvoX distribuido y acelerado por GPU ha facilitado enormemente el desarrollo de algoritmos evolutivos basados en GPU. En este contexto, nuestro equipo de investigación propuso un nuevo enfoque de metaevolución que aprovecha la DE para evolucionar sus propios hiperparámetros y estrategias, ofreciendo así una nueva vía para resolver el antiguo problema del ajuste de parámetros en los algoritmos evolutivos.

**¿Qué es la Metaevolución?**

La idea central detrás de la metaevolución se puede resumir como "**utilizar un algoritmo evolutivo para evolucionarse a sí mismo**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Este concepto trasciende los métodos tradicionales de computación evolutiva al no solo emplear algoritmos evolutivos para buscar soluciones óptimas a un problema, sino también adaptar los hiperparámetros y estrategias de los algoritmos a través de sus propios procesos evolutivos.

En otras palabras, la metaevolución introduce un paradigma de "**autoevolución**", que permite a los algoritmos optimizarse a sí mismos mientras exploran el espacio de búsqueda de soluciones al problema. Al perfeccionarse continuamente durante el proceso evolutivo, los algoritmos se vuelven más adaptativos y pueden mantener una alta eficiencia en varios escenarios de problemas.

Tomando MetaDE como ejemplo, su diseño se basa en esta filosofía. En una estructura de dos capas, la capa inferior (el "**ejecutor**") resuelve el problema de optimización dado utilizando una DE parametrizada. La capa superior (el "**evolucionador**") emplea simultáneamente la DE para optimizar las configuraciones de hiperparámetros del ejecutor. Este framework permite que la DE no solo sirva como un solver, sino que también "explore" la mejor manera de ajustar sus propios parámetros y estrategias para resolver diferentes problemas de manera más efectiva. Tal proceso es similar a un sistema que comprende y se perfecciona a sí mismo de forma incremental: una transformación de **"resolver pasivamente un problema" a "autoevolucionar activamente"**. En consecuencia, puede adaptarse mejor a diversas tareas. **Si consideramos la DE como un sistema complejo, MetaDE permite efectivamente una forma "recursiva" de autocomprensión y automejora dentro de este sistema.**

El término "**recursividad**" en informática describe típicamente una función o procedimiento que se llama a sí mismo. Dentro de MetaDE, este concepto adquiere un nuevo significado: es un mecanismo de optimización **internamente recursivo** que emplea la DE para evolucionar los hiperparámetros de la DE. Este esquema autorreferencial no solo encarna una poderosa adaptatividad, sino que también proporciona una perspectiva novedosa sobre el teorema "no free lunch" (no hay almuerzo gratis). Dado que no existe un único conjunto de parámetros universalmente óptimo para todos los problemas, permitir que el algoritmo evolucione por sí mismo de forma autónoma es clave para encontrar las mejores configuraciones de parámetros para una tarea determinada.

A través de este enfoque metaevolutivo recursivo, MetaDE logra varios beneficios:

**1. Ajuste automático de parámetros**

Se elimina el proceso de ajuste manual que requiere mucha mano de obra. El propio algoritmo aprende a ajustar sus hiperparámetros, reduciendo la intervención humana y mejorando la eficiencia.

**2. Adaptabilidad mejorada**

MetaDE responde dinámicamente a las características y condiciones cambiantes del problema, modificando las estrategias en tiempo real para mejorar el rendimiento. Esto aumenta significativamente la flexibilidad del algoritmo.

**3. Búsqueda eficiente**

Al aprovechar el paralelismo inherente, MetaDE acelera enormemente las búsquedas en problemas de optimización a gran escala. Ofrece soluciones factibles para problemas complejos y de alta dimensión en plazos de tiempo razonables.

**Implementación Algorítmica**

MetaDE emplea técnicas basadas en tensores y aceleración por GPU para permitir una computación paralela eficiente. Al procesar simultáneamente a muchos individuos de una población, la eficiencia computacional general mejora notablemente, lo que lo hace particularmente ventajoso en la optimización de caja negra mono-objetivo y en problemas de optimización a gran escala. A través de la tensorización de parámetros clave y estructuras de datos (por ejemplo, población, fitness, parámetros de estrategia), MetaDE no solo logra una mayor eficiencia computacional, sino que también mejora su capacidad para abordar desafíos de optimización complejos. En comparación con la DE clásica y otros algoritmos evolutivos (EAs), MetaDE muestra un rendimiento superior en la resolución de problemas a gran escala. Debido al enfoque basado en tensores, MetaDE aprovecha los recursos computacionales de manera más efectiva, produciendo soluciones más rápidas y resultados de optimización más precisos que los métodos tradicionales.

![1.png](/images/articles/metade-4.png "1.png")

Arquitectura PDE

El equipo de investigación propuso primero un framework de algoritmo DE parametrizado (PDE) que admite plenamente modificaciones de parámetros y estrategias. En este framework, F y CR son parámetros continuos, mientras que otros parámetros son discretos. Los cuadros discontinuos indican el rango de valores de parámetros permitidos. La función de mutación se deriva de los vectores base izquierdo y derecho, junto con el parámetro que controla el número de vectores de diferencia.

![2.png](/images/articles/metade-5.png "2.png")

Arquitectura MetaDE

MetaDE adopta una estructura de dos capas, que comprende **un evolucionador** (capa superior) y **múltiples ejecutores** (capa inferior). El evolucionador es una DE (o potencialmente otro algoritmo evolutivo), responsable de optimizar los parámetros de la PDE. Cada individuo![spacer.gif](/images/articles/metade-6.gif) x_i en la población del evolucionador corresponde a una configuración de parámetros única θ_i. Estas configuraciones se pasan a la PDE para instanciar diferentes variantes de DE, cada una gestionada por un ejecutor que se ejecuta de forma independiente en la tarea de optimización dada. Cada ejecutor devuelve su mejor valor de fitness y^* al evolucionador, que asigna ese valor de fitness y_i al individuo correspondiente x_i.

**Rendimiento Experimental**

Para evaluar exhaustivamente la efectividad de MetaDE, el equipo de investigación realizó experimentos sistemáticos que abarcaron múltiples pruebas de benchmark y escenarios del mundo real. Cada experimento utilizó un evolucionador (DE con estrategia rand/1/bin) y ejecutores (PDE con un tamaño de población de 100). Los componentes experimentales clave incluyen:

**Benchmark CEC2022**
Comparación de MetaDE con varias variantes de DE en tareas de optimización mono-objetivo.

**Comparación con los cuatro mejores algoritmos de CEC2022**
Evaluación de MetaDE frente a los cuatro algoritmos con mejor rendimiento de la competición CEC2022 bajo presupuestos idénticos de evaluaciones de funciones (FEs).

**Evaluaciones de funciones (FEs) bajo un tiempo de reloj (wall-clock time) fijo**
Análisis de la eficiencia computacional de MetaDE bajo aceleración por GPU.

**Tareas de control de robots**
Aplicación de MetaDE a tareas de control de robots en un entorno de plataforma Brax para validar su utilidad práctica.

**Benchmark CEC2022: Comparación con las principales variantes de DE**

El equipo comparó MetaDE con varias variantes representativas de DE en la suite de benchmarks CEC2022, incluyendo:

*   **DE estándar (rand/1/bin)**
*   **SaDE y JaDE (algoritmos de DE adaptativos)**
*   **CoDE (DE con integración de estrategias)**
*   **SHADE y LSHADE-RSP (DE adaptativa basada en el historial de éxitos)**
*   **EDEV (variantes de DE integradas)**

Todos los algoritmos se implementaron en la plataforma EvoX, utilizando aceleración por GPU con un tamaño de población de 100 para garantizar la equidad. Los experimentos se realizaron en diferentes dimensionalidades (10D y 20D) bajo **la misma restricción de tiempo computacional (60 segundos)**.

![3.png](/images/articles/metade-7.png "3.png")

Resultados de optimización CEC2022 10D

![4.png](/images/articles/metade-8.png "4.png")

Resultados de optimización CEC2022 20D

MetaDE generalmente logra una convergencia más rápida y estable en la mayoría de las funciones de prueba. Su DE parametrizada (PDE) junto con la optimización de la capa superior permite una adaptación dinámica a diferentes espacios de problemas, mejorando la robustez general y el rendimiento de la búsqueda.

**Comparación con los cuatro mejores algoritmos de CEC2022 (bajo FEs idénticas)**

Para evaluar más a fondo la capacidad de optimización de MetaDE, lo comparamos con los cuatro mejores algoritmos de la competición CEC2022 dentro del **mismo presupuesto de evaluación de funciones**:

*   **EA4eig**: Un método híbrido que integra múltiples EAs.
*   **NL-SHADE-LBC**: Una DE adaptativa mejorada.
*   **NL-SHADE-RSP-MID**: Una SHADE mejorada con estimación de punto medio.
*   **S-LSHADE-DP**: Una variante de DE que mantiene la diversidad de la población mediante perturbación dinámica.

Cada uno de estos algoritmos se ejecutó con sus configuraciones de parámetros oficiales y código fuente bajo **las mismas restricciones de FE**. Se realizaron comparaciones estadísticas (prueba de suma de rangos de Wilcoxon, nivel de significación 0.05) entre MetaDE y cada línea base en la suite de pruebas CEC2022. La última fila de la tabla muestra el rendimiento de cada algoritmo en comparación con MetaDE en las diferentes funciones de prueba: + (significativamente mejor), ≈ (sin diferencia significativa) y − (significativamente peor).

![5.png](/images/articles/metade-9.png "5.png")

Comparación de algoritmos de la competición CEC2022 10D (mismas FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparación de algoritmos de la competición CEC2022 20D (mismas FEs)

MetaDE demuestra consistentemente un sólido rendimiento, especialmente en problemas complejos que requieren una convergencia robusta. Debido a su **mecanismo autoadaptativo**, MetaDE ajusta eficazmente su estrategia para diferentes paisajes de búsqueda, mejorando así la eficiencia de la búsqueda y la capacidad de optimización global. Estos resultados indican que MetaDE no solo supera a las variantes principales de DE, sino que también exhibe una fuerte competitividad frente a los algoritmos de competición de primer nivel.

**Eficiencia computacional: FEs dentro de un tiempo fijo (60 segundos)**

El equipo de investigación registró además **el número de evaluaciones de funciones (FEs) completadas por diferentes algoritmos dentro del mismo tiempo de ejecución fijo (60 segundos)**.

![图片2.png](/images/articles/metade-11.png)

FEs alcanzadas por cada algoritmo en 60 segundos

Bajo el mismo framework EvoX con computación paralela acelerada por GPU, MetaDE alcanzó en promedio FEs de nivel **10****⁹**, mientras que las variantes tradicionales de DE solo alcanzaron alrededor de ***10^6*** FEs. Esta ventaja surge del enfoque parametrizado de MetaDE, que realiza **evaluaciones paralelas a gran escala** de individuos, lo que permite una **utilización más eficiente de los recursos de hardware.** En consecuencia, el algoritmo explora más soluciones dentro de la misma ventana de tiempo, mejorando tanto la calidad de la solución como la estabilidad.

**Aprendizaje por Refuerzo Evolutivo: Tareas de control de robots**

En el Aprendizaje por Refuerzo (RL), la eficiencia y la estabilidad de la optimización de políticas son cruciales. Los métodos basados en gradientes como PPO y SAC pueden sufrir de desvanecimiento o explosión del gradiente en entornos de alta dimensión. Por el contrario, el Aprendizaje por Refuerzo Evolutivo (EvoRL) elude estos problemas mediante el uso de **búsquedas sin gradiente** para optimizar directamente los parámetros de la política.

![8.png](/images/articles/metade-12.png "8.png")

Proceso de Aprendizaje por Refuerzo Evolutivo

Dentro del framework EvoRL, MetaDE:

*   **Optimiza automáticamente los parámetros de las redes neuronales**, aumentando la adaptabilidad de los modelos de política.
*   **Ajusta dinámicamente los hiperparámetros**, mejorando la estabilidad del entrenamiento.
*   **Aprovecha la aceleración por GPU** para acelerar la optimización de políticas.

Para evaluar el rendimiento de MetaDE en tareas de optimización complejas, lo aplicamos a **problemas de control de robots** utilizando optimización acelerada por GPU en la **plataforma de simulación Brax**. El estudio incluyó tres tareas —**Swimmer**, **Hopper** y **Reacher**— cada una modelada por una red neuronal totalmente conectada (MLP) de tres capas con el objetivo de **maximizar la recompensa**. Cabe destacar que cada MLP contiene unos **1.500 parámetros**, lo que crea un **desafío de optimización de 1.500 dimensiones** para los algoritmos evolutivos (EAs). Esto impone requisitos estrictos tanto en la capacidad de búsqueda como en la eficiencia computacional.

![9.png](/images/articles/metade-13.png "9.png")

Curvas de convergencia para tres entornos Brax

Como se muestra en la figura, MetaDE demuestra un sólido rendimiento en las tareas de control de robots basadas en Brax, logrando los mejores resultados en la tarea Swimmer y resultados casi óptimos en Hopper y Reacher. Su principal ventaja reside en la alta calidad de la población inicial, lo que permite una rápida convergencia en las etapas iniciales y produce soluciones de alta calidad. Estos hallazgos sugieren que MetaDE puede **optimizar eficientemente las políticas de redes neuronales**, lo que lo hace **muy adecuado para tareas de control de robots con simulaciones físicas complejas** y **ofrece un amplio potencial para aplicaciones prácticas**.

**Conclusión y direcciones futuras**

MetaDE es un enfoque de metaevolución innovador que no solo destaca en la resolución de tareas de optimización, sino que también ajusta y perfecciona de forma autónoma sus propias estrategias. Capitalizando las fortalezas de la Evolución Diferencial, MetaDE exhibe un gran potencial en la configuración adaptativa de parámetros y la evolución de estrategias. Los resultados experimentales muestran una robustez superior en una gama de pruebas de benchmark, y su aplicabilidad en el mundo real se ve subrayada por el éxito en las tareas de control de robots a través del aprendizaje por refuerzo evolutivo. Un desafío central consiste en mantener un equilibrio óptimo entre la generalización y la especialización, asegurando que el algoritmo pueda adaptarse a diversas tareas y al mismo tiempo optimizar eficazmente para problemas específicos. Esta investigación ofrece nuevas perspectivas para los algoritmos evolutivos autoadaptativos y puede impulsar nuevos avances en la metaevolución para sistemas complejos.

**Código de código abierto y comunidad**

**Artículo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Proyecto original (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo de QQ**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

Grupo de QQ | Evolving Machine Intelligence

MetaDE está construido sobre el framework EvoX. Si está interesado en EvoX, consulte el artículo sobre EvoX 1.0 para obtener más detalles.

![image.png](/images/articles/metade-1.png)

([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")