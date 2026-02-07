---
title: "4. Caracteristicas Avanzadas"
order: 4
---

# 4. Caracteristicas Avanzadas

EvoX ofrece muchas **caracteristicas avanzadas** para satisfacer necesidades mas complejas. Despues de familiarizarse con lo basico, este capitulo presenta como personalizar la configuracion del marco, gestionar modulos de complementos opcionales y optimizar el rendimiento, permitiendole extender y ajustar EvoX cuando sea necesario.

## Configuracion Personalizada

La configuracion predeterminada de EvoX se adapta a la mayoria de las situaciones, pero a veces podria querer personalizar el comportamiento o los parametros del marco. Por ejemplo:

- **Ajuste de Parametros del Algoritmo**: Mas alla del tamano basico de poblacion y el numero de iteraciones, muchos algoritmos exponen parametros avanzados. Por ejemplo, CMA-ES permite la configuracion de la matriz de covarianza inicial, y NSGA-II expone parametros de distancia de aglomeracion. Puede pasar parametros al constructor del algoritmo, por ejemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza las probabilidades de cruce y mutacion en el Algoritmo Genetico. Ajustar estos puede afinar el rendimiento. Consulte la documentacion de EvoX para la API de cada algoritmo, donde se listan los parametros disponibles y los valores predeterminados.

- **Reemplazo de Componentes de Operadores**: Puede reemplazar operadores evolutivos internos (por ejemplo, estrategias de seleccion o mutacion). Algunas clases de algoritmos soportan pasar objetos de operadores personalizados. Por ejemplo, la Evolucion Diferencial (DE) puede soportar operadores de mutacion personalizados, permitiendole proporcionar una funcion personalizada o una clase `Operator`. El diseno modular de EvoX soporta este reemplazo estilo "complemento". Esto tipicamente requiere entender los internos del algoritmo y generalmente no es necesario para casos de uso estandar.

- **Configuraciones Multiobjetivo**: Para la optimizacion multiobjetivo, podria necesitar configurar preferencias o pesos, por ejemplo, establecer vectores de peso para metodos de suma ponderada o ajustar puntos de referencia durante la evolucion. Estas configuraciones tipicamente se exponen a traves de parametros en la clase del problema o algoritmo. Por ejemplo, `problem = DTLZ2(d=12, m=3)` define un problema de 12 dimensiones y 3 objetivos. Algunos algoritmos permiten pasar vectores de referencia personalizados. Leer la documentacion del algoritmo le ayuda a aprovechar completamente tales configuraciones.

- **Registro y Salida**: El `EvalMonitor` predeterminado ya registra metricas clave de optimizacion. Si necesita informacion adicional (por ejemplo, diversidad de la poblacion o aptitud promedio por generacion), puede personalizar el monitor o registrar manualmente dentro de su bucle. Para tareas de larga duracion, puede querer registrar en un archivo. Esto se puede hacer usando la biblioteca `logging` de Python o E/S de archivos simple para agregar resultados para analisis posterior.

En resumen, la configuracion personalizada significa modificar el comportamiento predeterminado de EvoX para una tarea especifica. Esto generalmente implica un uso mas profundo de la API de EvoX. Cubriremos mas en la seccion de **desarrollo y extension**. Para principiantes, solo recuerde: EvoX ofrece interfaces flexibles que permiten a los usuarios experimentados ajustar casi cada detalle, pero tambien puede quedarse con los valores predeterminados y obtener resultados rapidamente.

## Gestion de Complementos

"Complementos" aqui se refiere a componentes opcionales o modulos de extension en EvoX, como herramientas de visualizacion, envoltorios de entornos de aprendizaje por refuerzo y proyectos hermanos en el ecosistema EvoX. Gestionar complementos en EvoX implica principalmente **instalar y usar modulos opcionales**. Aqui hay algunas extensiones clave y como gestionarlas:

- **Complemento de Visualizacion**: EvoX incluye el modulo `evox.vis_tools`, que contiene un submodulo `plot` para graficos y soporta el formato de registro `.exv` para flujos de datos en tiempo real. Para usar la visualizacion, instale EvoX con el extra `vis`: `pip install evox[vis]`. (Si no se instalo inicialmente, puede instalarlo despues o simplemente ejecutar `pip install plotly` para satisfacer las dependencias.) Al usar herramientas visuales, tipicamente llama a funciones de graficado despues de que el monitor registra datos, por ejemplo, `EvalMonitor.plot()` usa `vis_tools.plot`. Asegurar que este complemento este instalado evita errores por bibliotecas faltantes como `matplotlib`.

- **Complemento de Neuroevolucion**: EvoX soporta entornos de aprendizaje por refuerzo (como el motor de fisica Brax) y optimizacion de individuos neuronales (neuroevolucion). Estas caracteristicas estan incluidas en la extension `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Esto incluye la biblioteca Google Brax, Gym y mas. Despues de la instalacion, puede usar envoltorios como `BraxProblem` en `evox.problems.neuroevolution` para convertir entornos de RL en problemas de optimizacion. Herramientas como `ParamsAndVector` tambien estan incluidas para aplanar parametros de modelos PyTorch en vectores para la evolucion. Tenga en cuenta que Brax solo funciona en Linux o Windows via WSL; Python nativo de Windows solo puede ejecutarse en CPU. En resumen, habilitar o deshabilitar complementos de EvoX se controla mediante la instalacion de extras especificos.

- **Proyectos Hermanos**: EvoX tiene proyectos relacionados como EvoRL (enfocado en aprendizaje por refuerzo evolutivo) y EvoGP (programacion genetica acelerada por GPU). Estos comparten la filosofia de diseno e interfaz de EvoX. Si su tarea es intensiva en RL, podria preferir estos marcos dedicados. Gestionar estos complementos significa asegurar la compatibilidad de versiones y satisfacer las dependencias. Por ejemplo, EvoRL usa JAX y Brax, mientras que EvoGP puede requerir bibliotecas de arboles simbolicos. Estas bibliotecas generalmente pueden coexistir sin conflictos. Piense en ellas como herramientas complementarias que pueden llamarse desde el proyecto principal de EvoX, o dejarse fuera completamente para una configuracion ligera.

- **Complementos Personalizados**: Gracias a la modularidad de EvoX, puede construir sus propios "complementos". Por ejemplo, crear una clase `Monitor` personalizada para rastrear metricas unicas, o una subclase `Problem` personalizada que envuelva un simulador de terceros. Estos efectivamente extienden las capacidades de EvoX. La mejor practica es seguir los contratos de interfaz de EvoX, por ejemplo, asegurar que su `Problem` personalizado tenga un metodo `evaluate()`, o que su `Monitor` personalizado herede de una clase base. Una vez probado, incluso podria contribuirlo a futuras versiones de EvoX.

En general, la gestion de complementos en EvoX se trata de **extension flexible y control de dependencias**. Como principiante, durante la instalacion, puede decidir si incluir las extensiones `vis` y `neuroevolution`. Si no se instalaron inicialmente, pueden agregarse despues. Con complementos, puede monitorear el progreso de la optimizacion mas facilmente e integrar EvoX con herramientas externas para mayor potencia.

## Optimizacion del Rendimiento

El rendimiento es una fortaleza importante de EvoX. Incluso usando el mismo algoritmo, el soporte de GPU de EvoX puede aumentar la velocidad en varios ordenes de magnitud. Sin embargo, para aprovechar esto al maximo, querra seguir algunos consejos:

- **Usar Paralelismo de GPU**: Primero, asegurese de que su codigo realmente se este ejecutando en la GPU. Como se noto anteriormente, instale PyTorch habilitado para CUDA y mueva los datos a dispositivos GPU. Si las cosas parecen lentas, verifique con `torch.cuda.is_available()`; deberia devolver `True`. Si la GPU existe pero no se usa, es probable que los tensores se hayan creado en la CPU por defecto. Corrija esto estableciendo explicitamente `device`, o asegurandose de que los tensores de entrada (como `lb`/`ub`) esten en CUDA. EvoX seguira el dispositivo de estas entradas. En sistemas multi-GPU, EvoX generalmente usa **una GPU por proceso**. Para aprovechar multiples GPUs, puede ejecutar multiples procesos con diferentes GPUs o esperar soporte futuro para ejecucion coordinada multi-GPU.

- **Evaluacion Paralela**: Un cuello de botella clave en los algoritmos evolutivos es la **evaluacion de aptitud**. Dado que las evaluaciones son a menudo independientes, pueden paralelizarse. EvoX agrupa las evaluaciones cuando es posible, por ejemplo, las evaluaciones de redes neuronales o funciones polinomiales pueden calcularse en paralelo usando la GPU. Para problemas personalizados, evite los bucles de Python; vectorice su codigo de evaluacion para procesar un lote completo de candidatos a la vez. Esto aprovecha al maximo las capacidades paralelas de PyTorch. En pocas palabras: haga que la funcion `evaluate()` de su problema opere en lotes, no en soluciones individuales, para una aceleracion masiva.

- **Compilar para Optimizacion**: PyTorch 2.0 introdujo `torch.compile`, que compila JIT modelos/funciones para mejoras de rendimiento. Si su logica de evaluacion es compleja, considere compilar antes de ejecutar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Esto podria mejorar significativamente el rendimiento.
  > **Nota:**
> La compilacion agrega sobrecarga y no siempre es soportada por todas las funciones o problemas. Mas adecuada para tareas a gran escala y de larga duracion. En Windows, asegurese de que Triton este instalado para que `torch.compile` funcione.

- **Ajustar el Tamano de Poblacion**: Una poblacion mas grande aumenta la diversidad y la capacidad de busqueda global, pero tambien aumenta el calculo por generacion. Equilibre calidad y velocidad ajustando `pop_size`. En GPU, a menudo puede aumentarlo sin un costo de tiempo lineal (gracias al paralelismo). Pero un tamano demasiado grande puede causar problemas de memoria. Si se esta quedando sin memoria GPU, reduzca el tamano de poblacion o la dimension del problema, o use FP16 para ahorrar espacio (configure via `torch.set_float32_matmul_precision('medium')`).

- **Reducir la Sobrecarga de Python**: EvoX mueve la mayor parte del calculo central a `torch.Tensor`, pero los bucles escritos por el usuario u operadores personalizados deben evitar operaciones excesivas a nivel de Python. Evite impresiones frecuentes (alto costo de E/S), listas o conversiones de tipos de datos. Mantenga su codigo vectorizado/tensorizado para aprovechar los kernels rapidos de C++/CUDA bajo el capo y reducir la sobrecarga del interprete de Python.

- **Despliegue Distribuido**: Para problemas ultra-grandes, considere ejecutar en multiples maquinas. EvoX soporta configuraciones multi-nodo (via comunicacion de backend y fragmentacion). Aunque no es amigable para principiantes, es bueno saber que existe. Con un cluster de GPUs, consulte la documentacion de EvoX para el despliegue distribuido. Generalmente, necesitara establecer variables de entorno o lanzar con scripts especiales. La arquitectura permite que el mismo codigo se ejecute en configuraciones de uno o multiples nodos. Para su primer intento, simulelo con multiples procesos en una maquina.

- **Perfilado de Rendimiento**: Para profundizar mas, use herramientas como el perfilador de PyTorch o `cProfile` de Python para analizar cuellos de botella. Esto le ayuda a identificar si el tiempo se va en evaluacion, seleccion u otra cosa, para que pueda optimizar en consecuencia (por ejemplo, almacenando en cache calculos repetidos). EvoX esta construido para el rendimiento, pero las tareas del mundo real aun pueden encontrar cuellos de botella unicos que necesitan analisis.

En resumen, aunque EvoX ya esta optimizado a nivel de arquitectura, los usuarios pueden mejorar aun mas el rendimiento **usando GPUs correctamente**, **computacion por lotes** y **ajustando parametros**. Mientras persigue la velocidad, tambien recuerde mantener la calidad de los resultados; el equilibrio es clave. A medida que se familiarice mas con EvoX, el ajuste del rendimiento se convertira en algo natural.
