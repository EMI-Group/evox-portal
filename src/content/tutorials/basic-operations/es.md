---
title: "3. Operaciones básicas"
order: 3
---

# 3. Operaciones básicas

En este capítulo, le guiaremos a través de la ejecución de su primera tarea de optimización en EvoX, incluyendo cómo **iniciar EvoX** e **inicializar el proceso de optimización**, cómo **configurar un proyecto EvoX** (seleccionando algoritmos y problemas y ensamblándolos), y los **comandos básicos** (o métodos) utilizados habitualmente para controlar el proceso de optimización. A través de un ejemplo sencillo, aprenderá el uso básico de EvoX.

## Inicio e inicialización

Tras verificar la instalación, puede empezar a escribir scripts de optimización utilizando EvoX. Puede importar EvoX en cualquier entorno de Python (como la terminal, Jupyter Notebook, IDE, etc.).

Primero, importemos EvoX y sus módulos relacionados, e inicialicemos una tarea de optimización sencilla. Por ejemplo, utilizaremos el algoritmo Particle Swarm Optimization (PSO) para optimizar la clásica función Ackley. La función Ackley es una función de referencia (benchmark) común con un óptimo global conocido en \((0,0,\dots,0)\), lo que la hace adecuada para demostraciones.
Aquí tiene un código de ejemplo mínimo de EvoX que demuestra cómo iniciar y ejecutar la optimización:

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

El código anterior incluye los siguientes pasos:
- Primero, configuramos los parámetros para el algoritmo PSO: un tamaño de población de 50 y un espacio de búsqueda en 2D que oscila entre [-32, 32].
- A continuación, definimos el problema Ackley (la función Ackley se define en 2D por defecto).
- Creamos un flujo de trabajo estándar `StdWorkflow` que **ensambla** el algoritmo y el problema, y pasamos un monitor `EvalMonitor` para registrar los datos del proceso de optimización.
- Después, completamos el proceso de inicialización utilizando `workflow.init_step()`, que inicializa automáticamente la población, la semilla aleatoria y otros estados internos.
- Luego, ejecutamos un bucle para realizar continuamente 100 iteraciones utilizando `workflow.step()`. Cada vez que se llama a `step()`, el algoritmo genera nuevas soluciones y evalúa su fitness, acercándose continuamente a la solución óptima.
- Finalmente, utilizamos el método `get_min_fitness()` proporcionado por el monitor para obtener el mejor valor de fitness durante el proceso de iteración e imprimirlo.

Cuando ejecute este script, verá la salida de las iteraciones de optimización, por ejemplo:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Dado que no imprimimos explitamente los resultados intermedios en el bucle, estos no se mostrarán. Sin embargo, puede juzgar si el algoritmo ha convergido basándose en el valor de fitness final. Por ejemplo, el valor óptimo de la función Ackley es 0, y si la salida es cercana a 0, indica que PSO ha encontrado una solución cercana al óptimo global. También puede llamar a `print(monitor.history)` para ver los datos históricos registrados por el monitor o usar `monitor.plot()` para trazar curvas de convergencia (requiere soporte de visualización como Plotly).

> **Nota:**
> `StdWorkflow` es una encapsulación del **proceso de optimización estándar** proporcionada por EvoX. Implementa internamente la lógica de "actualización de iteración-inicialización" que se encuentra en los algoritmos evolutivos tradicionales y encapsula la interacción entre el algoritmo y el problema. Para la mayoría de las aplicaciones sencillas, bastará con usar `StdWorkflow` directamente. El `EvalMonitor` es un monitor que implementa métodos como `get_best_fitness()` y `plot()` para recopilar y mostrar métricas de rendimiento durante el proceso de optimización. Los principiantes pueden entenderlo temporalmente como un libro de registro que anota los mejores resultados de cada iteración para su posterior análisis.

En el ejemplo anterior, hemos creado una configuración básica para un proyecto EvoX, incluyendo la selección de un algoritmo, la definición del problema y el ensamblaje del flujo de trabajo. Generalmente, la configuración de un proyecto EvoX implica los siguientes pasos:

1. **Seleccionar/Definir un problema de optimización**: Aclare qué problema de optimización está intentando resolver. Por ejemplo, si está optimizando una función matemática, EvoX proporciona muchos **problemas integrados** bajo el módulo `evox.problems` (por ejemplo, funciones clásicas como Sphere, Rastrigin, Ackley) que puede usar directamente. Si su problema no está cubierto por los integrados, puede definir el suyo propio (se tratará en un capítulo posterior). Al configurar un problema, normalmente necesita conocer la **dimensión de las variables de decisión** y su **rango de valores**.

2. **Seleccionar/Configurar un algoritmo de optimización**: Elija un algoritmo evolutivo apropiado basado en el tipo de problema. EvoX proporciona un amplio conjunto de algoritmos bajo `evox.algorithms`, incluyendo algoritmos de un solo objetivo (como PSO, GA, CMA-ES) y algoritmos multiobjetivo (como NSGA-II, RVEA). Tras elegir el algoritmo, generalmente necesitará establecer los parámetros del algoritmo, como el tamaño de la población (`pop_size`) y parámetros específicos del algoritmo (como la probabilidad de cruce y la probabilidad de mutación en GA). La mayoría de los algoritmos requieren el **rango de variables** (límite inferior `lb` y límite superior `ub`) y la dimensión del problema para inicializar la población. Si está utilizando un algoritmo multiobjetivo, también deberá especificar el número de objetivos (`n_objs`). Los algoritmos de EvoX suelen proporcionar valores por defecto para los hiperparámetros comunes, pero los principiantes deberían considerar ajustar estos parámetros basándose en la tarea para obtener un mejor rendimiento.

3. **Ensamblar el flujo de trabajo**: Con la instancia del algoritmo y del problema listas, necesita "ensamblarlas" en un flujo de trabajo, que representa el control total del proceso de optimización. En EvoX, `StdWorkflow` se utiliza normalmente para combinar el algoritmo y el problema. Si desea monitorizar el progreso de la optimización, puede añadir un monitor (como `EvalMonitor`) al flujo de trabajo. No es obligatorio usar un monitor, pero puede ser muy útil durante la depuración y el análisis. Ensamblar el flujo de trabajo suele requerir una línea de código, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Llame al método de inicialización del flujo de trabajo para comenzar la optimización. La versión más reciente de EvoX proporciona un método conveniente `StdWorkflow.init_step()` que completa el proceso de inicialización en una sola llamada.

5. **Ejecutar iteraciones**: Use un bucle para llamar repetidamente a `workflow.step()` para impulsar el proceso evolutivo. Cada llamada realiza una iteración, incluyendo pasos como “generar nuevas soluciones -> evaluar -> seleccionar” dentro del algoritmo. Durante las iteraciones, puede usar un monitor para observar los resultados en tiempo real, como imprimir el mejor fitness actual cada pocas generaciones. Los criterios de terminación pueden establecerse según sus necesidades; los más comunes incluyen un número fijo de generaciones (por ejemplo, ejecutar durante 100 generaciones) o detenerse cuando las métricas monitorizadas convergen (por ejemplo, sin mejoras significativas durante varias generaciones).

6. **Obtener resultados**: Una vez finalizadas las iteraciones, debe extraer los resultados finales del algoritmo, como la mejor solución y su valor objetivo. En EvoX, estos se obtienen normalmente a través del monitor. Por ejemplo, `EvalMonitor.get_best_fitness()` devuelve el mejor valor de fitness. Para obtener el vector de la mejor solución, una forma es que el objeto del problema almacene el mejor candidato durante la evaluación, o usar la interfaz del monitor. En la implementación estándar de EvoX, `EvalMonitor` registra el mejor individuo y fitness de cada generación, accesibles a través de sus propiedades. Suponiendo que `monitor.history` almacena el historial, puede recuperar el mejor individuo de la última generación. Por supuesto, también puede omitir `EvalMonitor` y consultar directamente el objeto del algoritmo después del bucle; esto depende de la implementación del algoritmo. Si su algoritmo personalizado implementa `get_best()` o almacena el mejor individuo en su estado, puede extraerlo directamente. Sin embargo, dado que EvoX enfatiza las funciones puras y la modularidad, los resultados se acceden habitualmente a través de módulos de monitorización.

Siguiendo estos pasos, puede estructurar claramente el código de su tarea de optimización. Para los principiantes, es importante entender cómo trabaja en conjunto el trío **algoritmo-problema-flujo de trabajo**: el algoritmo se encarga de generar y mejorar las soluciones, el problema evalúa su calidad y el flujo de trabajo los conecta en un bucle iterativo.

A continuación, presentaremos algunos comandos básicos y llamadas a funciones disponibles en EvoX para ayudarle a profundizar en su comprensión del proceso de optimización.

## Resumen de comandos básicos

Al usar EvoX, hay algunos **métodos y funciones de uso común** que actúan como “comandos” con los que querrá familiarizarse:

### Métodos relacionados con el flujo de trabajo

- **`StdWorkflow.init_step()`**: Inicialización. Este es un comando de inicio rápido para lanzar el proceso de optimización, utilizado a menudo al principio de un script. Llama a la lógica de inicialización tanto para el algoritmo como para el problema, genera la población inicial y evalúa el fitness. Después de esto, el flujo de trabajo contiene el estado inicial y está listo para la iteración.

- **`StdWorkflow.step()`**: Avanzar un paso en la optimización. Cada llamada hace que el algoritmo genere nuevas soluciones candidatas basadas en el estado actual de la población, las evalúe y seleccione la siguiente generación. Los usuarios suelen llamar a esto varias veces dentro de un bucle. La función `step()` normalmente no devuelve nada (el estado interno se actualiza dentro del flujo de trabajo), aunque las versiones anteriores pueden devolver un nuevo estado. Para los principiantes, simplemente puede llamarlo sin preocuparse por el valor de retorno.

### Métodos relacionados con el monitor

Usando `EvalMonitor` como ejemplo, los métodos comunes incluyen:

- `EvalMonitor.get_best_fitness()`: Devuelve el fitness más bajo registrado (para problemas de minimización) o el fitness más alto (para problemas de maximización; el monitor suele distinguir esto). Útil para conocer el mejor resultado actual.
- `EvalMonitor.get_history()` o `monitor.history`: Recupera el historial completo, como el mejor valor de cada generación. Útil para analizar las tendencias de convergencia.
- `EvalMonitor.plot()`: Traza curvas de convergencia o rendimiento; requiere un entorno gráfico o Notebook. El monitor suele usar Plotly para renderizar gráficos, ayudándole a evaluar visualmente el rendimiento del algoritmo.
  Internamente, el monitor registra el número de evaluaciones y sus resultados en cada generación; normalmente no necesita intervenir, solo extraer los datos cuando sea necesario.

### Métodos relacionados con el algoritmo

- Método `Algorithm.__init__()`: Método de inicialización de un algoritmo. Las variables suelen envolverse utilizando `evox.core.Mutable()` y los hiperparámetros con `evox.core.Parameter()`.

- Método `Algorithm.step()`: En escenarios específicos o al usar algoritmos/problemas personalizados, podría llamar directamente al método `step()` del algoritmo, que normalmente encapsula toda la lógica de iteración del algoritmo.

- Método `Algorithm.init_step()`: El método `init_step()` incluye la primera iteración del algoritmo. Si no se sobrescribe, simplemente llama al método `step()`. Para casos típicos, la primera iteración no es diferente de las demás, por lo que muchos algoritmos pueden no necesitar un `init_step()` personalizado. Pero para algoritmos que implican el ajuste de hiperparámetros, es posible que necesite actualizar los hiperparámetros o las variables relacionadas aquí.

### Control de dispositivos y paralelo

- Método `.to(device)`: Si necesita cambiar los dispositivos de computación en su programa, use el método `.to(device)` de PyTorch para mover tensores (`torch.Tensor`) a la GPU/CPU (algunos métodos de PyTorch como `torch.randn` también necesitan que se especifique el dispositivo). Generalmente, si establece el dispositivo usando `torch.set_default_device()` a `cuda:0` (suponiendo que su sistema lo soporte y que EvoX y las dependencias estén instaladas correctamente; verifíquelo con `torch.cuda.is_available()`), la mayoría de los cálculos paralelos de alto rendimiento de EvoX se ejecutarán en la GPU automáticamente. Al escribir algoritmos, problemas o monitores personalizados, si crea nuevos tensores o utiliza métodos de PyTorch sensibles al dispositivo, se recomienda especificar explícitamente el `device` como `cuda:0` o usar `torch.get_default_device()` para evitar caídas de rendimiento por cálculos repartidos en diferentes dispositivos.

Para los principiantes, los métodos anteriores son suficientes para manejar tareas de optimización típicas. En resumen: **Inicializar problema/algoritmo – configurar monitor – ensamblar flujo de trabajo – ejecutar y recuperar resultados** es el flujo de trabajo más común de EvoX. Dominar estos pasos le permite abordar tareas de optimización básicas utilizando EvoX.

Antes de pasar al siguiente capítulo, intente modificar el ejemplo: cambie de PSO a otro algoritmo, reemplace la función Ackley por otra función de prueba o use el monitor para extraer más información; esto le ayudará a apreciar la flexibilidad de configurar proyectos EvoX.