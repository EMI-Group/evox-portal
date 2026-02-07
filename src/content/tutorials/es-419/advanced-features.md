---
title: "4. Caracteristicas Avanzadas"
order: 4
---

# 4. Caracteristicas Avanzadas

EvoX ofrece muchas **caracteristicas avanzadas** para satisfacer necesidades mas complejas. Despues de familiarizarte con lo basico, este capitulo presenta como personalizar la configuracion del framework, gestionar modulos de plugins opcionales y optimizar el rendimiento, permitiendote extender y ajustar EvoX cuando sea necesario.

## Configuracion Personalizada

La configuracion predeterminada de EvoX se adapta a la mayoria de las situaciones, pero a veces podrias querer personalizar el comportamiento o los parametros del framework. Por ejemplo:

- **Ajuste de Parametros del Algoritmo**: Mas alla del tamano basico de la poblacion y el numero de iteraciones, muchos algoritmos exponen parametros avanzados. Por ejemplo, CMA-ES permite la configuracion de la matriz de covarianza inicial, y NSGA-II expone parametros de distancia de hacinamiento. Puedes pasar parametros al constructor del algoritmo, por ejemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza las probabilidades de cruce y mutacion en el Algoritmo Genetico. Ajustar estos puede mejorar el rendimiento. Consulta la documentacion de EvoX para la API de cada algoritmo, donde se listan los parametros disponibles y sus valores predeterminados.

- **Reemplazo de Componentes de Operadores**: Puedes reemplazar operadores evolutivos internos (por ejemplo, estrategias de seleccion o mutacion). Algunas clases de algoritmos soportan pasar objetos de operadores personalizados. Por ejemplo, la Evolucion Diferencial (DE) puede soportar operadores de mutacion personalizados, permitiendote proporcionar una funcion personalizada o una clase `Operator`. El diseno modular de EvoX soporta este reemplazo estilo "plugin". Esto tipicamente requiere entender los detalles internos del algoritmo y generalmente no es necesario para casos de uso estandar.

- **Configuraciones Multiobjetivo**: Para optimizacion multiobjetivo, podrias necesitar configurar preferencias o pesos, por ejemplo, establecer vectores de peso para metodos de suma ponderada o ajustar puntos de referencia durante la evolucion. Estas configuraciones tipicamente se exponen a traves de parametros en la clase del problema o algoritmo. Por ejemplo, `problem = DTLZ2(d=12, m=3)` define un problema de 12 dimensiones y 3 objetivos. Algunos algoritmos permiten pasar vectores de referencia personalizados. Leer la documentacion del algoritmo te ayuda a aprovechar completamente estas configuraciones.

- **Registro y Salida**: El `EvalMonitor` predeterminado ya registra metricas clave de optimizacion. Si necesitas informacion adicional (por ejemplo, diversidad de la poblacion o aptitud promedio por generacion), puedes personalizar el monitor o registrar manualmente dentro de tu bucle. Para tareas de larga duracion, podrias querer registrar en un archivo. Esto se puede hacer usando la biblioteca `logging` de Python o simple E/S de archivos para agregar resultados para analisis posterior.

En resumen, la configuracion personalizada significa modificar el comportamiento predeterminado de EvoX para una tarea especifica. Esto generalmente implica un uso mas profundo de la API de EvoX. Cubriremos mas en la seccion de **desarrollo y extension**. Para principiantes, solo recuerda: EvoX ofrece interfaces flexibles que permiten a los usuarios experimentados ajustar casi cada detalle, pero tambien puedes quedarte con los valores predeterminados y obtener resultados rapidamente.

## Gestion de Plugins

"Plugins" aqui se refiere a componentes opcionales o modulos de extension en EvoX, como herramientas de visualizacion, envoltorios de entornos de aprendizaje por refuerzo y proyectos hermanos en el ecosistema de EvoX. La gestion de plugins en EvoX implica principalmente **instalar y usar modulos opcionales**. Aqui hay algunas extensiones clave y como gestionarlas:

- **Plugin de Visualizacion**: EvoX incluye el modulo `evox.vis_tools`, que contiene un submodulo `plot` para graficos y soporta el formato de registro `.exv` para flujos de datos en tiempo real. Para usar la visualizacion, instala EvoX con el extra `vis`: `pip install evox[vis]`. (Si no se instalo inicialmente, puedes instalarlo despues o simplemente ejecutar `pip install plotly` para satisfacer las dependencias.) Al usar herramientas visuales, tipicamente llamas funciones de graficado despues de que el monitor registra datos, por ejemplo, `EvalMonitor.plot()` usa `vis_tools.plot`. Asegurar que este plugin este instalado evita errores por bibliotecas faltantes como `matplotlib`.

- **Plugin de Neuroevolucion**: EvoX soporta entornos de aprendizaje por refuerzo (como el motor de fisica Brax) y optimizacion de individuos neuronales (neuroevolucion). Estas caracteristicas estan incluidas en la extension `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Esto incluye la biblioteca Google Brax, Gym y mas. Despues de la instalacion, puedes usar envoltorios como `BraxProblem` en `evox.problems.neuroevolution` para convertir entornos de RL en problemas de optimizacion. Herramientas como `ParamsAndVector` tambien estan incluidas para aplanar parametros de modelos PyTorch en vectores para evolucion. Ten en cuenta que Brax solo funciona en Linux o Windows via WSL; Python nativo de Windows solo puede ejecutarse en CPU. En resumen, habilitar o deshabilitar plugins de EvoX se controla mediante la instalacion de extras especificos.

- **Proyectos Hermanos**: EvoX tiene proyectos relacionados como EvoRL (enfocado en aprendizaje por refuerzo evolutivo) y EvoGP (programacion genetica acelerada por GPU). Estos comparten la filosofia de diseno e interfaz de EvoX. Si tu tarea es intensiva en RL, podrias preferir estos frameworks dedicados. Gestionar estos plugins significa asegurar la compatibilidad de versiones y satisfacer las dependencias. Por ejemplo, EvoRL usa JAX y Brax, mientras que EvoGP puede requerir bibliotecas de arboles simbolicos. Estas bibliotecas generalmente pueden coexistir sin conflictos. Piensa en ellas como herramientas complementarias que pueden llamarse desde el proyecto principal de EvoX, o dejarse fuera para una configuracion ligera.

- **Plugins Personalizados**: Gracias a la modularidad de EvoX, puedes construir tus propios "plugins". Por ejemplo, crear una clase `Monitor` personalizada para rastrear metricas unicas, o una subclase `Problem` personalizada que envuelva un simulador de terceros. Estos efectivamente extienden las capacidades de EvoX. La mejor practica es seguir los contratos de interfaz de EvoX, por ejemplo, asegurar que tu `Problem` personalizado tenga un metodo `evaluate()`, o que tu `Monitor` personalizado herede de una clase base. Una vez probado, incluso podrias contribuirlo a futuras versiones de EvoX.

En general, la gestion de plugins en EvoX se trata de **extension flexible y control de dependencias**. Como principiante, durante la instalacion, puedes decidir si incluir las extensiones `vis` y `neuroevolution`. Si no se instalaron inicialmente, pueden agregarse despues. Con plugins, puedes monitorear el progreso de la optimizacion mas facilmente e integrar EvoX con herramientas externas para mayor potencia.

## Optimizacion de Rendimiento

El rendimiento es una fortaleza importante de EvoX. Incluso usando el mismo algoritmo, el soporte de GPU de EvoX puede aumentar la velocidad en varios ordenes de magnitud. Sin embargo, para aprovechar esto al maximo, querras seguir algunos consejos:

- **Usa Paralelismo de GPU**: Primero, asegurate de que tu codigo realmente se ejecute en la GPU. Como se menciono anteriormente, instala PyTorch habilitado para CUDA y mueve los datos a dispositivos GPU. Si las cosas parecen lentas, verifica con `torch.cuda.is_available()`: deberia devolver `True`. Si la GPU existe pero no se usa, es probable que los tensores se hayan creado en CPU por defecto. Corrige esto estableciendo explicitamente el `device`, o asegurando que los tensores de entrada (como `lb`/`ub`) esten en CUDA. EvoX seguira el dispositivo de estas entradas. En sistemas multi-GPU, EvoX generalmente usa **una GPU por proceso**. Para aprovechar multiples GPUs, puedes ejecutar multiples procesos con diferentes GPUs o esperar soporte futuro para ejecucion coordinada multi-GPU.

- **Evaluacion Paralela**: Un cuello de botella clave en los algoritmos evolutivos es la **evaluacion de aptitud**. Dado que las evaluaciones son frecuentemente independientes, pueden paralelizarse. EvoX agrupa las evaluaciones cuando es posible, por ejemplo, las evaluaciones de redes neuronales o funciones polinomiales pueden calcularse en paralelo usando la GPU. Para problemas personalizados, evita bucles de Python: vectoriza tu codigo de evaluacion para procesar un lote completo de candidatos a la vez. Esto aprovecha al maximo las capacidades paralelas de PyTorch. En pocas palabras: haz que la funcion `evaluate()` de tu problema opere en lotes, no en soluciones individuales, para una aceleracion masiva.

- **Compila para Optimizacion**: PyTorch 2.0 introdujo `torch.compile`, que compila JIT modelos/funciones para mejoras de rendimiento. Si tu logica de evaluacion es compleja, considera compilar antes de ejecutar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Esto podria mejorar significativamente el rendimiento.
  > **Nota:**
> La compilacion agrega sobrecarga y no siempre es soportada por todas las funciones o problemas. Es mas adecuada para tareas a gran escala y de larga duracion. En Windows, asegurate de que Triton este instalado para que `torch.compile` funcione.

- **Ajusta el Tamano de la Poblacion**: Una poblacion mas grande aumenta la diversidad y la capacidad de busqueda global, pero tambien aumenta la computacion por generacion. Equilibra calidad y velocidad ajustando `pop_size`. En GPU, frecuentemente puedes aumentarlo sin un costo de tiempo lineal (gracias al paralelismo). Pero un tamano demasiado grande puede causar problemas de memoria. Si te quedas sin memoria de GPU, reduce el tamano de la poblacion o la dimension del problema, o usa FP16 para ahorrar espacio (configura via `torch.set_float32_matmul_precision('medium')`).

- **Reduce la Sobrecarga de Python**: EvoX mueve la mayor parte de la computacion central a `torch.Tensor`, pero los bucles escritos por el usuario u operadores personalizados deben evitar operaciones excesivas a nivel de Python. Evita impresiones frecuentes (alto costo de E/S), listas o conversiones de tipos de datos. Manten tu codigo vectorizado/tensorizado para aprovechar los kernels rapidos de C++/CUDA bajo el capo y reducir la sobrecarga del interprete de Python.

- **Despliegue Distribuido**: Para problemas ultra-grandes, considera ejecutar en multiples maquinas. EvoX soporta configuraciones multi-nodo (via comunicacion de backend y fragmentacion). Aunque no es amigable para principiantes, es bueno saber que existe. Con un cluster de GPUs, consulta la documentacion de EvoX para despliegue distribuido. Generalmente, necesitaras establecer variables de entorno o lanzar con scripts especiales. La arquitectura permite que el mismo codigo se ejecute en configuraciones de uno o multiples nodos. Para tu primer intento, simulalo con multiples procesos en una maquina.

- **Perfilado de Rendimiento**: Para profundizar, usa herramientas como el profiler de PyTorch o `cProfile` de Python para analizar cuellos de botella. Esto te ayuda a identificar si el tiempo se va en evaluacion, seleccion u otra cosa, para que puedas optimizar en consecuencia (por ejemplo, almacenando en cache computaciones repetidas). EvoX esta construido para rendimiento, pero las tareas del mundo real aun pueden encontrar cuellos de botella unicos que necesitan analisis.

En resumen, aunque EvoX ya esta optimizado a nivel de arquitectura, los usuarios pueden mejorar aun mas el rendimiento **usando GPUs correctamente**, **computacion por lotes** y **ajustando parametros**. Mientras persigues velocidad, tambien recuerda mantener la calidad de los resultados: el equilibrio es clave. A medida que te familiarices mas con EvoX, el ajuste de rendimiento se convertira en algo natural.
