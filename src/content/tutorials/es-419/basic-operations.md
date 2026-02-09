---
title: "3. Operaciones Básicas"
order: 3
---

# 3. Operaciones Básicas

En este capítulo, lo guiaremos a través de la ejecución de su primera tarea de optimización en EvoX, incluyendo cómo **iniciar EvoX** e **inicializar el proceso de optimización**, cómo **configurar un proyecto de EvoX** (seleccionando algoritmos y problemas y ensamblándolos), y los **comandos básicos** (o métodos) comúnmente utilizados para controlar el proceso de optimización. A través de un ejemplo sencillo, aprenderá el uso básico de EvoX.

## Inicio e Inicialización

Después de verificar la instalación, puede comenzar a escribir scripts de optimización usando EvoX. Puede importar EvoX en cualquier entorno de Python (como la terminal, Jupyter Notebook, IDE, etc.).

Primero, importemos EvoX y sus módulos relacionados, e inicialicemos una tarea de optimización simple. Por ejemplo, utilizaremos el algoritmo Particle Swarm Optimization (PSO) para optimizar la clásica función Ackley. La función Ackley es una función de referencia común con un óptimo global conocido en \((0,0,\dots,0)\), lo que la hace adecuada para demostraciones.
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
- Primero, configuramos los parámetros para el algoritmo PSO: un tamaño de población de 50 y un espacio de búsqueda en 2D que va de [-32, 32].
- Luego, definimos el problema Ackley (la función Ackley se define en 2D por defecto).
- Creamos un workflow estándar `StdWorkflow` que **ensambla** el algoritmo y el problema, y pasamos un monitor `EvalMonitor` para registrar los datos del proceso de optimización.
- A continuación, completamos el proceso de inicialización usando `workflow.init_step()`, que inicializa automáticamente la población, la semilla aleatoria y otros estados internos.
- Luego, ejecutamos un bucle para realizar continuamente 100 iteraciones usando `workflow.step()`. Cada vez que se llama a `step()`, el algoritmo genera nuevas soluciones y evalúa su fitness, acercándose continuamente a la solución óptima.
- Finalmente, usamos el método `get_best_fitness()` proporcionado por el monitor para obtener el mejor valor de fitness durante el proceso de iteración e imprimirlo.

Cuando ejecute este script, verá la salida de las iteraciones de optimización, por ejemplo:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Dado que no imprimimos explícitamente los resultados intermedios en el bucle, estos no se mostrarán. Sin embargo, puede juzgar si el algoritmo ha convergido basándose en el valor de fitness final. Por ejemplo, el valor óptimo de la función Ackley es 0, y si la salida es cercana a 0, indica que PSO ha encontrado una solución cercana al óptimo global. También puede llamar a `print(monitor.history)` para ver los datos históricos registrados por el monitor o usar `monitor.plot()` para graficar las curvas de convergencia (requiere soporte de visualización como Plotly).

> **Nota:**
> `StdWorkflow` es una encapsulación del **proceso de optimización estándar** proporcionada por EvoX. Implementa internamente la lógica de "actualización de inicialización-iteración" que se encuentra en los algoritmos evolutivos tradicionales y encapsula la interacción entre el algoritmo y el problema. Para la mayoría de las aplicaciones simples, usar `StdWorkflow` directamente será suficiente. El `EvalMonitor` es un monitor que implementa métodos como `get_best_fitness()` y `plot()` para recopilar y mostrar métricas de rendimiento durante el proceso de optimización. Los principiantes pueden entenderlo temporalmente como un libro de registro que anota los mejores resultados de cada iteración para un análisis posterior.

En el ejemplo anterior, hemos creado una configuración básica para un proyecto de EvoX, incluyendo la selección de un algoritmo, la definición del problema y el ensamblaje del workflow. Generalmente, configurar un proyecto de EvoX implica los siguientes pasos:

1. **Seleccionar/Definir un Problema de Optimización**: Aclare qué problema de optimización está intentando resolver. Por ejemplo, si está optimizando una función matemática, EvoX proporciona muchos **problemas integrados** bajo el módulo `evox.problems` (por ejemplo, funciones clásicas como Sphere, Rastrigin, Ackley) que puede usar directamente. Si su problema no está cubierto por los integrados, puede definir el suyo propio (se tratará en un capítulo posterior). Al configurar un problema, generalmente necesita conocer la **dimensión de las variables de decisión** y su **rango de valores**.

2. **Seleccionar/Configurar un Algoritmo de Optimización**: Elija un algoritmo evolutivo apropiado basado en el tipo de problema. EvoX proporciona un conjunto rico de algoritmos bajo `evox.algorithms`, incluyendo algoritmos de un solo objetivo (como PSO, GA, CMA-ES) y algoritmos multiobjetivo (como NSGA-II, RVEA). Después de elegir el algoritmo, generalmente necesitará establecer los parámetros del algoritmo, como el tamaño de la población (`pop_size`) y parámetros específicos del algoritmo (como la probabilidad de cruce y la probabilidad de mutación en GA). La mayoría de los algoritmos requieren el **rango de variables** (límite inferior `lb` y límite superior `ub`) y la dimensión del problema para inicializar la población. Si está utilizando un algoritmo multiobjetivo, también deberá especificar el número de objetivos (`n_objs`). Los algoritmos de EvoX a menudo proporcionan valores predeterminados para los hiperparámetros comunes, pero los principiantes deben considerar ajustar estos parámetros según la tarea para obtener un mejor rendimiento.

3. **Ensamblar el Workflow**: Con la instancia del algoritmo y del problema listas, necesita "ensamblarlas" en un workflow, que representa el control total del proceso de optimización. En EvoX, `StdWorkflow` se usa típicamente para combinar el algoritmo y el problema. Si desea monitorear el progreso de la optimización, puede agregar un monitor (como `EvalMonitor`) al workflow. No es obligatorio un monitor, pero puede ser muy útil durante la depuración y el análisis. Ensamblar el workflow generalmente toma una línea de código, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Llame al método de inicialización del workflow para comenzar la optimización. La versión más reciente de EvoX proporciona un método conveniente `StdWorkflow.init_step()` que completa el proceso de inicialización en una sola llamada.

5. **Ejecutar Iteraciones**: Use un bucle para llamar repetidamente a `workflow.step()` para impulsar el proceso evolutivo. Cada llamada realiza una iteración, incluyendo pasos como "generar nuevas soluciones -> evaluar -> seleccionar" dentro del algoritmo. Durante las iteraciones, puede usar un monitor para observar los resultados en tiempo real, como imprimir el mejor fitness actual cada pocas generaciones. Los criterios de terminación se pueden establecer según sus necesidades; los comunes incluyen un número fijo de generaciones (por ejemplo, ejecutar durante 100 generaciones) o detenerse cuando las métricas monitoreadas convergen (por ejemplo, sin mejoras significativas durante varias generaciones).

6. **Obtener Resultados**: Después de que terminen las iteraciones, debe extraer los resultados finales del algoritmo, como la mejor solución y su valor objetivo. En EvoX, estos se obtienen típicamente a través del monitor. Por ejemplo, `EvalMonitor.get_best_fitness()` devuelve el mejor valor de fitness. Para obtener el vector de la mejor solución, una forma es que el objeto del problema almacene el mejor candidato durante la evaluación, o usar la interfaz del monitor. En la implementación estándar de EvoX, `EvalMonitor` registra el mejor individuo y fitness de cada generación, accesibles a través de sus propiedades. Suponiendo que `monitor.history` almacena el historial, puede recuperar el mejor individuo de la última generación. Por supuesto, también puede omitir `EvalMonitor` y consultar directamente el objeto del algoritmo después del bucle; esto depende de la implementación del algoritmo. Si su algoritmo personalizado implementa `get_best()` o almacena el mejor individuo en su estado, puede extraerlo directamente. Sin embargo, dado que EvoX enfatiza las funciones puras y la modularidad, los resultados generalmente se acceden a través de módulos de monitoreo.

Al seguir estos pasos, puede estructurar claramente el código de su tarea de optimización. Para los principiantes, es importante entender cómo el trío **algoritmo-problema-workflow** trabaja en conjunto: el algoritmo se encarga de generar y mejorar las soluciones, el problema evalúa su calidad y el workflow los conecta en un bucle iterativo.

A continuación, presentaremos algunos comandos básicos y llamadas a funciones disponibles en EvoX para ayudar a profundizar su comprensión del proceso de optimización.

## Resumen de Comandos Básicos

Al usar EvoX, hay algunos **métodos y funciones de uso común** que actúan como "comandos" con los que querrá familiarizarse:

### Métodos Relacionados con el Workflow

- **`StdWorkflow.init_step()`**: Inicialización. Este es un comando de inicio rápido para lanzar el proceso de optimización, a menudo utilizado al principio de un script. Llama a la lógica de inicialización tanto para el algoritmo como para el problema, genera la población inicial y evalúa el fitness. Después de esto, el workflow contiene el estado inicial y está listo para la iteración.

- **`StdWorkflow.step()`**: Avanzar un paso en la optimización. Cada llamada hace que el algoritmo genere nuevas soluciones candidatas basadas en el estado actual de la población, las evalúe y seleccione la siguiente generación. Los usuarios suelen llamar a esto varias veces dentro de un bucle. La función `step()` generalmente no devuelve nada (el estado interno se actualiza dentro del workflow), aunque las versiones anteriores pueden devolver un nuevo estado. Para los principiantes, simplemente puede llamarlo sin preocuparse por el valor de retorno.

### Métodos Relacionados con el Monitor

Usando `EvalMonitor` como ejemplo, los métodos comunes incluyen:

- `EvalMonitor.get_best_fitness()`: Devuelve el fitness más bajo registrado (para problemas de minimización) o el fitness más alto (para problemas de maximización; el monitor suele distinguir esto). Útil para conocer el mejor resultado actual.
- `EvalMonitor.get_history()` o `monitor.history`: Recupera el historial completo, como el mejor valor de cada generación. Útil para analizar las tendencias de convergencia.
- `EvalMonitor.plot()`: Grafica las curvas de convergencia o rendimiento; requiere un entorno gráfico o Notebook. El monitor suele usar Plotly para renderizar gráficos, lo que le ayuda a evaluar visualmente el rendimiento del algoritmo.
  Internally, el monitor registra el número de evaluaciones y sus resultados en cada generación; normalmente no necesita intervenir, solo extraer los datos cuando sea necesario.

### Métodos Relacionados con el Algoritmo

- Método `Algorithm.__init__()`: Método de inicialización de un algoritmo. Las variables suelen envolverse usando `evox.core.Mutable()` y los hiperparámetros con `evox.core.Parameter()`.

- Método `Algorithm.step()`: En escenarios específicos o al usar algoritmos/problemas personalizados, podría llamar directamente al método `step()` del algoritmo, que típicamente encapsula toda la lógica de iteración del algoritmo.

- Método `Algorithm.init_step()`: El método `init_step()` incluye la primera iteración del algoritmo. Si no se anula, simplemente llama al método `step()`. Para casos típicos, la primera iteración no es diferente de las demás, por lo que muchos algoritmos pueden no necesitar un `init_step()` personalizado. Pero para algoritmos que involucran el ajuste de hiperparámetros, es posible que deba actualizar los hiperparámetros o las variables relacionadas aquí.

### Control de Dispositivos y Paralelismo

- Método `.to(device)`: Si necesita cambiar los dispositivos de computación en su programa, use el método `.to(device)` de PyTorch para mover tensores (`torch.Tensor`) a GPU/CPU (algunos métodos de PyTorch como `torch.randn` también necesitan que se especifique el dispositivo). Generalmente, si configura el dispositivo usando `torch.set_default_device()` a `cuda:0` (suponiendo que su sistema lo soporte y que EvoX y las dependencias estén instaladas correctamente; verifíquelo con `torch.cuda.is_available()`), la mayoría de las computaciones paralelas de alto rendimiento de EvoX se ejecutarán en la GPU automáticamente. Al escribir algoritmos, problemas o monitores personalizados, si crea nuevos tensores o usa métodos de PyTorch sensibles al dispositivo, se recomienda especificar explícitamente el `device` como `cuda:0` o usar `torch.get_default_device()` para evitar caídas de rendimiento por computaciones distribuidas en diferentes dispositivos.

Para los principiantes, los métodos anteriores son suficientes para manejar tareas de optimización típicas. En resumen: **Inicializar problema/algoritmo – configurar monitor – ensamblar workflow – ejecutar y recuperar resultados** es el flujo de trabajo más común de EvoX. Dominar estos le permite abordar tareas de optimización básicas usando EvoX.

Antes de pasar al siguiente capítulo, intente modificar el ejemplo: cambie de PSO a otro algoritmo, reemplace la función Ackley con otra función de prueba o use el monitor para extraer más información; esto le ayudará a apreciar la flexibilidad de configurar proyectos de EvoX.