---
title: "4. Funciones Avanzadas"
order: 4
---

# 4. Funciones Avanzadas

EvoX ofrece muchas **funciones avanzadas** para satisfacer necesidades más complejas. Después de familiarizarse con lo básico, este capítulo presenta cómo personalizar la configuración del framework, gestionar módulos de plugins opcionales y optimizar el rendimiento, permitiéndole extender y ajustar EvoX cuando sea necesario.

## Configuración Personalizada

Los ajustes predeterminados de EvoX se adaptan a la mayoría de las situaciones, pero a veces es posible que desee personalizar el comportamiento o los parámetros del framework. Por ejemplo:

- **Ajuste de Parámetros del Algoritmo**: Más allá del tamaño básico de la población y el número de iteraciones, muchos algoritmos exponen parámetros avanzados. Por ejemplo, CMA-ES permite la configuración de la matriz de covarianza inicial, y NSGA-II expone parámetros de distancia de apiñamiento (crowding distance). Puede pasar parámetros al constructor del algoritmo; por ejemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza las probabilidades de cruce y mutación en el Algoritmo Genético. Ajustar estos parámetros puede perfeccionar el rendimiento. Consulte la documentación de EvoX para la API de cada algoritmo, donde se enumeran los parámetros disponibles y sus valores predeterminados.

- **Reemplazo de Componentes de Operadores**: Puede reemplazar los operadores evolutivos internos (por ejemplo, estrategias de selección o mutación). Algunas clases de algoritmos admiten el paso de objetos de operadores personalizados. Por ejemplo, Differential Evolution (DE) puede admitir operadores de mutación personalizados, permitiéndole proporcionar una función personalizada o una clase `Operator`. El diseño modular de EvoX admite este reemplazo "estilo plugin". Esto normalmente requiere comprender el funcionamiento interno del algoritmo y no suele ser necesario para casos de uso estándar.

- **Configuraciones Multiobjetivo**: Para la optimización multiobjetivo, es posible que necesite configurar preferencias o pesos; por ejemplo, establecer vectores de peso para métodos de suma ponderada o ajustar puntos de referencia durante la evolución. Estas configuraciones suelen exponerse a través de parámetros en la clase del problema o del algoritmo. Por ejemplo, `problem = DTLZ2(d=12, m=3)` define un problema de 12 dimensiones y 3 objetivos. Algunos algoritmos permiten pasar vectores de referencia personalizados. Leer la documentación del algoritmo le ayudará a aprovechar al máximo estas configuraciones.

- **Registro y Salida (Logging)**: El `EvalMonitor` predeterminado ya registra métricas clave de optimización. Si necesita información adicional (por ejemplo, diversidad de la población o aptitud promedio por generación), puede personalizar el monitor o registrar datos manualmente dentro de su bucle. Para tareas de larga duración, es posible que desee registrar en un archivo. Esto se puede hacer utilizando la librería `logging` de Python o mediante E/S de archivos simple para añadir resultados para un análisis posterior.

En resumen, la configuración personalizada significa modificar el comportamiento predeterminado de EvoX para una tarea específica. Esto suele implicar un uso más profundo de la API de EvoX. Cubriremos más en la sección de **desarrollo y extensión**. Para principiantes, solo recuerden: EvoX ofrece interfaces flexibles que permiten a los usuarios experimentados ajustar casi cada detalle, pero también pueden quedarse con los valores predeterminados y obtener resultados rápidamente.

## Gestión de Plugins

Los "Plugins" aquí se refieren a componentes opcionales o módulos de extensión en EvoX, como herramientas de visualización, wrappers de entornos de aprendizaje por refuerzo y proyectos hermanos en el ecosistema EvoX. La gestión de plugins en EvoX implica principalmente **instalar y usar módulos opcionales**. Aquí hay algunas extensiones clave y cómo gestionarlas:

- **Plugin de Visualización**: EvoX incluye el módulo `evox.vis_tools`, que contiene un submódulo `plot` para gráficos y admite el formato de registro `.exv` para flujos de datos en tiempo real. Para usar la visualización, instale EvoX con el extra `vis`: `pip install evox[vis]`. (Si no se instaló inicialmente, puede instalarlo más tarde o simplemente ejecutar `pip install plotly` para satisfacer las dependencias). Al usar herramientas visuales, normalmente se llaman a las funciones de trazado después de que el monitor registra los datos; por ejemplo, `EvalMonitor.plot()` utiliza `vis_tools.plot`. Asegurarse de que este plugin esté instalado evita errores por librerías faltantes como `matplotlib`.

- **Plugin de Neuroevolución**: EvoX admite entornos de aprendizaje por refuerzo (como el motor de física Brax) y la optimización de individuos neuronales (neuroevolución). Estas funciones se agrupan en la extensión `neuroevolution`, instalada a través de `pip install "evox[neuroevolution]"`. Esto incluye la librería Google Brax, Gym y más. Después de la instalación, puede usar wrappers como `BraxProblem` en `evox.problems.neuroevolution` para convertir entornos de RL en problemas de optimización. También se incluyen herramientas como `ParamsAndVector` para aplanar los parámetros de los modelos de PyTorch en vectores para la evolución. Tenga en cuenta que Brax solo funciona en Linux o Windows a través de WSL; el Python nativo de Windows solo puede ejecutarse en CPU. En resumen, habilitar o deshabilitar los plugins de EvoX se controla mediante la instalación de extras específicos.

- **Proyectos Hermanos**: EvoX tiene proyectos relacionados como EvoRL (enfocado en el aprendizaje por refuerzo evolutivo) y EvoGP (programación genética acelerada por GPU). Estos comparten la filosofía de diseño e interfaz de EvoX. Si su tarea se centra mucho en RL, es posible que prefiera estos frameworks dedicados. Gestionar estos plugins significa asegurar la compatibilidad de versiones y satisfacer las dependencias. Por ejemplo, EvoRL utiliza JAX y Brax, mientras que EvoGP puede requerir librerías de árboles simbólicos. Estas librerías suelen coexistir sin conflictos. Piense en ellas como herramientas complementarias que pueden llamarse desde el proyecto principal EvoX, o dejarse fuera por completo para una configuración ligera.

- **Plugins Personalizados**: Gracias a la modularidad de EvoX, puede crear sus propios "plugins". Por ejemplo, cree una clase `Monitor` personalizada para rastrear métricas únicas, o una subclase de `Problem` personalizada que envuelva un simulador de terceros. Estos extienden eficazmente las capacidades de EvoX. La mejor práctica es seguir los contratos de interfaz de EvoX; por ejemplo, asegúrese de que su `Problem` personalizado tenga un método `evaluate()`, o que su `Monitor` personalizado herede de una clase base. Una vez probado, incluso podría contribuirlo a futuras versiones de EvoX.

En general, la gestión de plugins en EvoX se trata de una **extensión flexible y control de dependencias**. Como principiante, durante la instalación, puede decidir si incluir las extensiones `vis` y `neuroevolution`. Si no se instalaron inicialmente, se pueden agregar más tarde. Con los plugins, puede monitorear el progreso de la optimización más fácilmente e integrar EvoX con herramientas externas para obtener un mayor potencial.

## Optimización del Rendimiento

El rendimiento es una de las mayores fortalezas de EvoX. Incluso usando el mismo algoritmo, el soporte de GPU de EvoX puede aumentar la velocidad en varios órdenes de magnitud. Sin embargo, para aprovechar esto al máximo, querrá seguir algunos consejos:

- **Usar Paralelismo de GPU**: Primero, asegúrese de que su código se esté ejecutando realmente en la GPU. Como se mencionó anteriormente, instale PyTorch con soporte para CUDA y mueva los datos a los dispositivos GPU. Si las cosas parecen lentas, verifique con `torch.cuda.is_available()`; debería devolver `True`. Si la GPU existe pero no se usa, es probable que los tensores se hayan creado en la CPU por defecto. Corrija esto configurando explícitamente el `device`, o asegurándose de que los tensores de entrada (como `lb`/`ub`) estén en CUDA. EvoX seguirá el dispositivo de estas entradas. En sistemas multi-GPU, EvoX generalmente usa **una GPU por proceso**. Para aprovechar varias GPUs, puede ejecutar múltiples procesos con diferentes GPUs o esperar el soporte futuro para la ejecución coordinada multi-GPU.

- **Evaluación Paralela**: Un cuello de botella clave en los algoritmos evolutivos es la **evaluación de la aptitud (fitness)**. Dado que las evaluaciones suelen ser independientes, se pueden paralelizar. EvoX procesa las evaluaciones por lotes (batches) cuando es posible; por ejemplo, las evaluaciones de redes neuronales o funciones polinómicas se pueden calcular en paralelo usando la GPU. Para problemas personalizados, evite los bucles de Python: vectorice su código de evaluación para procesar un lote completo de candidatos a la vez. Esto aprovecha al máximo las capacidades paralelas de PyTorch. En pocas palabras: haga que la función `evaluate()` de su problema opere sobre lotes, no sobre soluciones individuales, para obtener una aceleración masiva.

- **Compilar para Optimización**: PyTorch 2.0 introdujo `torch.compile`, que compila modelos/funciones JIT para obtener mejoras de rendimiento. Si su lógica de evaluación es compleja, considere compilar antes de ejecutar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Esto podría mejorar significativamente el rendimiento.
  > **Nota:**
> La compilación añade una carga adicional (overhead) y no siempre es compatible con todas las funciones o problemas. Es más adecuada para tareas a gran escala y de larga duración. En Windows, asegúrese de que Triton esté instalado para que `torch.compile` funcione.

- **Ajustar el Tamaño de la Población**: Una población más grande aumenta la diversidad y la capacidad de búsqueda global, pero también aumenta el cálculo por generación. Equilibre la calidad y la velocidad ajustando `pop_size`. En GPU, a menudo puede aumentarlo sin un costo de tiempo lineal (gracias al paralelismo). Pero un tamaño demasiado grande puede causar problemas de memoria. Si se está quedando sin memoria de GPU, reduzca el tamaño de la población o la dimensión del problema, o use FP16 para ahorrar espacio (se configura mediante `torch.set_float32_matmul_precision('medium')`).

- **Reducir la Carga de Python**: EvoX mueve la mayor parte del cálculo principal a `torch.Tensor`, pero los bucles escritos por el usuario o los operadores personalizados deben evitar operaciones excesivas a nivel de Python. Evite impresiones (prints) frecuentes (alto costo de E/S), listas o conversiones de tipos de datos. Mantenga su código vectorizado/tensorizado para aprovechar los kernels rápidos de C++/CUDA internamente y reducir la carga del intérprete de Python.

- **Despliegue Distribuido**: Para problemas ultra grandes, considere la ejecución en múltiples máquinas. EvoX admite configuraciones de múltiples nodos (a través de comunicación de backend y sharding). Aunque no es apto para principiantes, es bueno saber que esto existe. Con un clúster de GPUs, consulte la documentación de EvoX para el despliegue distribuido. Por lo general, necesitará configurar variables de entorno o lanzar con scripts especiales. La arquitectura permite que el mismo código se ejecute en configuraciones de un solo nodo o de múltiples nodos. Para su primer intento, simúlelo con múltiples procesos en una sola máquina.

- **Perfilado de Rendimiento (Profiling)**: Para profundizar más, use herramientas como el profiler de PyTorch o `cProfile` de Python para analizar los cuellos de botella. Esto le ayuda a identificar si el tiempo se va en la evaluación, la selección o en otra cosa, para que pueda optimizar en consecuencia (por ejemplo, almacenando en caché cálculos repetidos). EvoX está diseñado para el rendimiento, pero las tareas del mundo real aún pueden encontrar cuellos de botella únicos que necesitan análisis.

En resumen, aunque EvoX ya está optimizado a nivel de arquitectura, los usuarios pueden aumentar aún más el rendimiento **usando las GPUs correctamente**, **computando por lotes** y **ajustando los parámetros**. Mientras busca velocidad, recuerde también mantener la calidad de los resultados; el equilibrio es la clave. A medida que se familiarice más con EvoX, el ajuste del rendimiento se volverá algo natural.