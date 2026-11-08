---
title: "AutoPSO: hacer evolucionar los algoritmos de búsqueda"
pubDate: 2026-08-25
updatedDate: 2026-11-08
summary: "AutoPSO convierte el diseño de la optimización por enjambre de partículas (PSO) en un espacio explorable y muestra cómo la evaluación paralela de EvoX permite evolucionar los propios métodos de optimización."
---

Un sistema de IA evolutiva debe decidir qué buscar y cómo hacerlo. AutoPSO incorpora la segunda pregunta al ciclo de optimización: parámetros, reglas de aprendizaje y organización del enjambre se convierten en diseños candidatos que pueden evaluarse y mejorarse para una tarea.

![Componentes reutilizables ensamblados en un mecanismo de enjambre](./automated-swarm-design.webp)

El marco **AutoPSO**, propuesto por el equipo de EvoX, codifica de forma uniforme la configuración de parámetros, los mecanismos de aprendizaje y la estructura del enjambre del PSO en un espacio evolutivo explorable, y mediante **metaevolución** busca automáticamente una variante de PSO adecuada para un problema objetivo dado. Este marco no solo optimiza la solución del problema, sino que, en un nivel superior, optimiza automáticamente "qué PSO utilizar para resolverlo".

La búsqueda a gran escala de la metaevolución depende de evaluaciones masivamente paralelas, y el cálculo tensorizado, el procesamiento por lotes y el paralelismo GPU de EvoX resuelven precisamente ese cuello de botella: miles de variantes candidatas pueden evolucionar simultáneamente, haciendo viables en la práctica búsquedas a nivel meta que antes eran inviables en CPU.

**Potencia de cálculo GPU × metaevolución impulsa al PSO del "diseño manual" hacia la "generación automática".**

## Al PSO no le faltan métodos; le falta la capacidad de combinarlos automáticamente

Durante las últimas décadas, la investigación sobre PSO ha acumulado un rico conjunto de opciones mecánicas: cómo cambian los parámetros a lo largo de las iteraciones, de qué individuos aprenden las partículas, si el enjambre se divide en subgrupos y qué estrategias de actualización adoptan los distintos subgrupos.

El problema no es la escasez de mecanismos, sino que la mayoría de ellos existen como algoritmos independientes específicos de un problema. Ante una tarea nueva, los investigadores siguen teniendo que seleccionar, combinar y verificar manualmente entre un gran conjunto de mecanismos, y luego reajustarlos.

La filosofía de AutoPSO no es descartar este conocimiento acumulado, sino reorganizarlo en un espacio de componentes reutilizables. Descompone los aspectos clave del diseño del PSO en varios módulos:

- cómo evolucionan los parámetros;

- de qué ejemplares aprenden las partículas;

- cómo se divide el enjambre en subgrupos;

- qué estrategias de actualización emplean los distintos subgrupos.

En los enfoques tradicionales, estas decisiones las toma principalmente el ser humano; en AutoPSO, se convierten en objetos explorables por el algoritmo. En otras palabras, AutoPSO no consiste en "reinventar manualmente un PSO", sino en construir un metamarco que, antes de resolver el problema actual, pueda configurar automáticamente una variante de PSO adecuada para él.

![](./autopso-1.gif)

*Figura 1: AutoPSO organiza los elementos clave del diseño del PSO en módulos combinables y explorables.*

## Delegar al propio algoritmo la optimización de nivel externo, tradicionalmente realizada por los investigadores

La investigación convencional en optimización siempre ha poseído una estructura de dos niveles. En el nivel interno, el PSO se utiliza para resolver el problema objetivo —sea optimización de funciones, diseño de ingeniería o políticas de control—. En el nivel externo existe una optimización menos explícita: los investigadores están optimizando el propio algoritmo.

Qué reglas de actualización elegir, cómo fijar los parámetros, qué ejemplares de aprendizaje adoptar, si introducir mecanismos de subgrupos, qué mecanismos pueden combinarse y qué combinaciones resultan inestables: estas decisiones se han tomado típicamente por los investigadores basándose en la experiencia y luego se han refinado mediante prueba y error.

El cambio clave que aporta AutoPSO es delegar al algoritmo este proceso de nivel externo, antes realizado manualmente por los investigadores. Una partícula de nivel externo ya no representa una solución candidata al problema objetivo, sino un diseño candidato de PSO que codifica parámetros, ejemplares de aprendizaje, partición en subgrupos y estrategias de actualización. El PSO de nivel interno, equipado con estas configuraciones, resuelve el problema objetivo y devuelve su rendimiento como retroalimentación al nivel externo, que continúa buscando mejores configuraciones algorítmicas.

**AutoPSO no solo optimiza la solución del problema, sino también "qué PSO utilizar para resolverlo".**

Transforma el proceso de diseño de algoritmos, que antes dependía de la experiencia de los investigadores, en un proceso evolutivo interno del sistema que puede explorarse, evaluarse e iterarse automáticamente.

![](./autopso-2.png)

*Figura 2: El nivel externo busca configuraciones del algoritmo, mientras que el nivel interno emplea la configuración elegida para resolver el problema objetivo.*

## EvoX y GPU: hacer verdaderamente viable el diseño automático de algoritmos

Proponer un marco de búsqueda automática de estructuras algorítmicas no es especialmente difícil; el verdadero reto está en el coste computacional. Evaluar un diseño candidato de PSO requiere ejecutarlo sobre un proceso completo de resolución del problema objetivo. Cuantos más diseños candidatos haya, mayor será la carga computacional del nivel interno.

En los entornos seriales tradicionales basados en CPU, tales costes son prohibitivos. Sin embargo, este tipo de computación es intrínsecamente paralelizable: los algoritmos candidatos pueden evaluarse de forma concurrente y, dentro de cada algoritmo candidato, las actualizaciones de las partículas también pueden procesarse por lotes. AutoPSO aprovecha EvoX para proyectar la estructura de poblaciones de la computación evolutiva sobre la capacidad de procesamiento por lotes de las GPU, permitiendo que la búsqueda de configuraciones del nivel externo y la resolución del problema del nivel interno avancen simultáneamente.

El procesamiento por lotes en GPU permite comparar más diseños PSO dentro de un presupuesto temporal. La calidad también depende de los componentes disponibles, la fiabilidad de las evaluaciones y la asignación del presupuesto. AutoPSO busca un diseño adecuado para la tarea en ese espacio; más candidatos no garantizan un algoritmo globalmente óptimo.

El valor de EvoX reside precisamente en proporcionar esta capacidad: organiza las actualizaciones de partículas y las evaluaciones de aptitud del nivel interno, así como la comparación de algoritmos candidatos del nivel externo, en operaciones tensoriales sobre GPU, lo que permite que miles de diseños candidatos avancen de forma síncrona en cada iteración. En otras palabras, EvoX transforma la metaevolución de un proceso de "prueba y error lento" en uno de "experimentación paralela a gran escala", y esta es precisamente la base computacional sobre la que se asienta AutoPSO.

## No solo más rápido, sino también más capaz de "usar la búsqueda"

Lo que AutoPSO busca demostrar no es simplemente que se ejecuta rápido en GPU, sino que, una vez automatizado el proceso de diseño del PSO, el algoritmo puede descubrir realmente una estrategia de búsqueda mejor adaptada al problema en cuestión.

En el banco de pruebas de optimización numérica CEC2022, el equipo de EvoX comparó AutoPSO con el PSO original, CSO, CLPSO, FIPS y varias variantes de PSO de aprendizaje social. Con el mismo presupuesto de tiempo de ejecución, muchas variantes de PSO de estructura fija mostraron un descenso inicial rápido de los valores objetivo pero tendieron a estancarse prematuramente. En cambio, AutoPSO pudo ajustar continuamente la configuración de su PSO de nivel interno durante la ejecución, manteniendo una tendencia de mejora más estable en múltiples funciones.

El equipo también realizó comparaciones con el mismo número de evaluaciones de la función, y AutoPSO siguió obteniendo un rendimiento superior. Esto indica que su ventaja procede de organizar el proceso de búsqueda de forma más eficaz, y no simplemente de consumir más recursos computacionales.

![](./autopso-3.png)

*Figura 3: Resultados experimentales en el banco de pruebas de optimización numérica CEC2022.*

El equipo de investigación aplicó además AutoPSO a tareas de control robótico basadas en neuroevolución. Comparadas con la optimización de funciones numéricas, estas tareas están mucho más cerca de las aplicaciones reales: implican parámetros de política de alta dimensionalidad, un ruido de retroalimentación significativo, paisajes objetivo irregulares e información de gradiente que no siempre está disponible.

En múltiples entornos de control robótico de Brax, AutoPSO logró una mejora más rápida de la recompensa y un mejor rendimiento final. Esto sugiere que AutoPSO no es meramente un conjunto de heurísticas ajustadas a una clase específica de funciones, sino un enfoque práctico y transferible para la construcción automática de algoritmos.

![](./autopso-4.png)

*Figura 4: Resultados experimentales en los problemas de control robótico de Brax.*

El valor de EvoX se demuestra de la manera más directa en los experimentos de escalabilidad. La estructura de dos niveles de AutoPSO conlleva naturalmente un mayor tamaño de población: el nivel externo alberga muchos algoritmos candidatos y cada algoritmo candidato del nivel interno tiene su propio enjambre de partículas. Con la ejecución serial tradicional, el tiempo de cómputo necesario se volvería rápidamente inasumible.

En las GPU, sin embargo, cuando el tamaño total de la población se incrementa 100 veces, el tiempo de ejecución solo aumenta alrededor de 3 veces. En pruebas con 8192 dimensiones, AutoPSO mantiene una sobrecarga temporal aceptable y logra una aceleración de un orden de magnitud respecto a la ejecución en CPU.

![](./autopso-5.png)

*Figura 5: Impacto del escalado del tamaño de la población en el tiempo de ejecución.*

## AutoPSO no desperdicia ni potencia de cálculo ni conocimiento histórico

En lugar de reemplazar la investigación algorítmica por potencia de cálculo bruta, AutoPSO transforma los resultados de investigación acumulados durante mucho tiempo en activos de diseño operativos. Los mecanismos eficaces que antes estaban dispersos entre distintas variantes de PSO se abstraen en componentes reutilizables, mientras que las decisiones combinatorias que antes dependían de la experiencia humana se delegan a la metaevolución para su validación en tareas específicas.

Tres elementos son indispensables: el conocimiento histórico proporciona el espacio de búsqueda; la optimización automática se encarga de la búsqueda combinatoria; y EvoX, junto con el paralelismo de GPU, aporta la capacidad de evaluación a gran escala. Sin conocimiento histórico, a la búsqueda le faltan candidatos prometedores; sin optimización automática, el conocimiento difícilmente puede reorganizarse para la tarea en cuestión; sin computación paralela, la escala de la búsqueda no puede sostenerse.

AutoPSO libera a los investigadores del ajuste repetitivo de parámetros y de la prueba y error, dirigiendo sus esfuerzos hacia un trabajo más valioso: definir componentes, diseñar espacios de búsqueda y establecer procesos de evaluación más fiables.

## De modificar algoritmos a construir sistemas que generan algoritmos

AutoPSO muestra el papel de EvoX en el diseño experimental de algoritmos. Los investigadores definen componentes útiles y evaluaciones fiables; la búsqueda por poblaciones explora sus combinaciones. El cálculo paralelo permite así construir algoritmos adaptados a la tarea, fundamentados en el rendimiento medido.

## Recursos

- [Artículo de investigación](https://arxiv.org/abs/2608.07539)
- [GitHub](https://github.com/EMI-Group/autopso)
- [EvoX](https://github.com/EMI-Group/evox)
