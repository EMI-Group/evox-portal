---
title: "3. Operaciones Basicas"
order: 3
---

# 3. Operaciones Basicas

En este capitulo, te guiaremos a traves de tu primera tarea de optimizacion con EvoX, incluyendo como **iniciar EvoX** e **inicializar el proceso de optimizacion**, como **configurar un proyecto EvoX** (seleccionando algoritmos y problemas y ensamblándolos), y los **comandos basicos** (o metodos) comunmente usados para controlar el proceso de optimizacion. A traves de un ejemplo simple, aprenderas el uso basico de EvoX.

## Inicio e Inicializacion

Despues de verificar la instalacion, puedes comenzar a escribir scripts de optimizacion usando EvoX. Puedes importar EvoX en cualquier entorno Python (como terminal, Jupyter Notebook, IDE, etc.).

Primero, importemos EvoX y sus modulos relacionados, e inicialicemos una tarea de optimizacion simple. Por ejemplo, usaremos el algoritmo de Optimizacion por Enjambre de Particulas (PSO) para optimizar la clasica funcion Ackley. La funcion Ackley es una funcion de referencia comun con un optimo global conocido en \((0,0,\dots,0)\), lo que la hace adecuada para demostracion.
Aqui hay un codigo de ejemplo minimo de EvoX que demuestra como iniciar y ejecutar la optimizacion:

```python
import torch
from evox.algorithms import PSO                      # Importar algoritmo PSO
from evox.problems.numerical import Ackley           # Importar problema de optimizacion Ackley
from evox.workflows import StdWorkflow, EvalMonitor  # Importar flujo de trabajo estandar y monitor

# 1. Definir el algoritmo de optimizacion y el problema
algorithm = PSO(
    pop_size=50,                    # Tamano de poblacion de 50
    lb=-32 * torch.ones(2),         # Limite inferior de variable de decision: vector 2D, cada uno -32
    ub= 32 * torch.ones(2)          # Limite superior de variable de decision: vector 2D, cada uno 32
)
problem = Ackley()                  # Problema de optimizacion: funcion Ackley (dimension predeterminada coincide con el algoritmo)

# 2. Ensamblar el flujo de trabajo y agregar un monitor para rastrear resultados
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Inicializar el flujo de trabajo
workflow.init_step()  # Inicializar el estado interno del algoritmo y el problema

# 4. Ejecutar iteraciones de optimizacion
for i in range(100):
    workflow.step()   # Avanzar la optimizacion un paso

# 5. Obtener resultados (por ejemplo, imprimir el valor optimo)
best_fitness = monitor.get_best_fitness() # Obtener el mejor valor de aptitud del monitor
print("Iteracion completada, mejor valor de aptitud encontrado:", float(best_fitness))
```

El codigo anterior incluye los siguientes pasos:
- Primero, establecemos los parametros para el algoritmo PSO: tamano de poblacion de 50 y un espacio de busqueda en 2D que va de [-32, 32].
- Luego, definimos el problema Ackley (la funcion Ackley se define como 2D por defecto).
- Creamos un flujo de trabajo estandar `StdWorkflow` que **ensambla** el algoritmo y el problema, y pasamos un monitor `EvalMonitor` para registrar los datos del proceso de optimizacion.
- A continuacion, completamos el proceso de inicializacion usando `workflow.init_step()`, que automaticamente inicializa la poblacion, la semilla aleatoria y otros estados internos.
- Luego, ejecutamos un bucle para ejecutar continuamente 100 iteraciones usando `workflow.step()`. Cada vez que se llama a `step()`, el algoritmo genera nuevas soluciones y evalua su aptitud, acercandose continuamente a la solucion optima.
- Finalmente, usamos el metodo `get_min_fitness()` proporcionado por el monitor para obtener el mejor valor de aptitud durante el proceso de iteracion e imprimirlo.

Cuando ejecutes este script, veras la salida de las iteraciones de optimizacion, por ejemplo:

```text
Iteracion completada, mejor valor de aptitud encontrado: 9.5367431640625e-07
```

Dado que no imprimimos explicitamente los resultados intermedios en el bucle, los resultados intermedios no se mostraran. Sin embargo, puedes juzgar si el algoritmo ha convergido basandote en el valor de aptitud final. Por ejemplo, el valor optimo de la funcion Ackley es 0, y si la salida esta cerca de 0, indica que PSO ha encontrado una solucion cercana al optimo global. Tambien puedes llamar a `print(monitor.history)` para ver los datos historicos registrados por el monitor o usar `monitor.plot()` para graficar curvas de convergencia (requiere soporte de visualizacion como Plotly).

> **Nota:**
> `StdWorkflow` es una encapsulacion de **proceso de optimizacion estandar** proporcionada por EvoX. Internamente implementa la logica de "inicializacion-actualizacion iterativa" encontrada en los algoritmos evolutivos tradicionales y encapsula la interaccion entre el algoritmo y el problema. Para la mayoria de las aplicaciones simples, usar `StdWorkflow` directamente sera suficiente. El `EvalMonitor` es un monitor que implementa metodos como `get_best_fitness()` y `plot()` para recopilar y mostrar metricas de rendimiento durante el proceso de optimizacion. Los principiantes pueden entenderlo temporalmente como un cuaderno de registro que registra los mejores resultados de cada iteracion para analisis posterior.

En el ejemplo anterior, hemos creado una configuracion basica para un proyecto EvoX, incluyendo la seleccion de un algoritmo, la definicion del problema y el ensamblaje del flujo de trabajo. Generalmente, configurar un proyecto EvoX implica los siguientes pasos:

1. **Seleccionar/Definir un Problema de Optimizacion**: Clarifica que problema de optimizacion estas tratando de resolver. Por ejemplo, si estas optimizando una funcion matematica, EvoX proporciona muchos **problemas integrados** bajo el modulo `evox.problems` (por ejemplo, funciones clasicas como Sphere, Rastrigin, Ackley) que puedes usar directamente. Si tu problema no esta cubierto por los integrados, puedes definir el tuyo propio (cubierto en un capitulo posterior). Al configurar un problema, generalmente necesitas conocer la **dimension de las variables de decision** y su **rango de valores**.

2. **Seleccionar/Configurar un Algoritmo de Optimizacion**: Elige un algoritmo evolutivo apropiado segun el tipo de problema. EvoX proporciona un rico conjunto de algoritmos bajo `evox.algorithms`, incluyendo algoritmos de objetivo unico (como PSO, GA, CMA-ES) y algoritmos multiobjetivo (como NSGA-II, RVEA). Despues de elegir el algoritmo, generalmente necesitaras establecer parametros del algoritmo, como el tamano de la poblacion (`pop_size`) y parametros especificos del algoritmo (como la probabilidad de cruce y la probabilidad de mutacion en GA). La mayoria de los algoritmos requieren el **rango de variables** (limite inferior `lb` y limite superior `ub`) y la dimension del problema para inicializar la poblacion. Si usas un algoritmo multiobjetivo, tambien necesitaras especificar el numero de objetivos (`n_objs`). Los algoritmos de EvoX frecuentemente proporcionan valores predeterminados para hiperparametros comunes, pero los principiantes deberian considerar ajustar estos parametros segun la tarea para un mejor rendimiento.

3. **Ensamblar el Flujo de Trabajo**: Con las instancias del algoritmo y el problema listas, necesitas "ensamblarlas" en un flujo de trabajo, que representa el control completo del proceso de optimizacion. En EvoX, tipicamente se usa `StdWorkflow` para combinar el algoritmo y el problema. Si deseas monitorear el progreso de la optimizacion, puedes agregar un monitor (como `EvalMonitor`) al flujo de trabajo. Un monitor no es obligatorio, pero puede ser muy util durante la depuracion y el analisis. Ensamblar el flujo de trabajo generalmente toma una linea de codigo, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Llama al metodo de inicializacion del flujo de trabajo para comenzar la optimizacion. La ultima version de EvoX proporciona un conveniente metodo `StdWorkflow.init_step()` que completa el proceso de inicializacion en una sola llamada.

5. **Ejecutar Iteraciones**: Usa un bucle para llamar repetidamente a `workflow.step()` para impulsar el proceso evolutivo. Cada llamada realiza una iteracion, incluyendo pasos como "generar nuevas soluciones -> evaluar -> seleccionar" dentro del algoritmo. Durante las iteraciones, puedes usar un monitor para observar resultados en tiempo real, como imprimir la mejor aptitud actual cada pocas generaciones. Los criterios de terminacion pueden establecerse segun tus necesidades: los comunes incluyen un numero fijo de generaciones (por ejemplo, ejecutar 100 generaciones), o detenerse cuando las metricas monitoreadas converjan (por ejemplo, sin mejora significativa durante varias generaciones).

6. **Obtener Resultados**: Despues de que las iteraciones terminen, necesitas extraer los resultados finales del algoritmo, como la mejor solucion y su valor objetivo. En EvoX, estos tipicamente se obtienen a traves del monitor. Por ejemplo, `EvalMonitor.get_best_fitness()` devuelve el mejor valor de aptitud. Para obtener el mejor vector de solucion, una forma es que el objeto del problema almacene el mejor candidato durante la evaluacion, o usar la interfaz del monitor. En la implementacion estandar de EvoX, `EvalMonitor` registra el mejor individuo y aptitud de cada generacion, accesibles a traves de sus propiedades. Asumiendo que `monitor.history` almacena el historial, puedes recuperar el mejor individuo de la ultima generacion. Por supuesto, tambien puedes omitir `EvalMonitor` y consultar directamente el objeto del algoritmo despues del bucle; esto depende de la implementacion del algoritmo. Si tu algoritmo personalizado implementa `get_best()` o almacena el mejor individuo en su estado, puedes extraerlo directamente. Sin embargo, dado que EvoX enfatiza funciones puras y modularidad, los resultados generalmente se acceden a traves de modulos de monitoreo.

Siguiendo estos pasos, puedes estructurar claramente el codigo de tu tarea de optimizacion. Para principiantes, es importante entender como funciona el trio **algoritmo-problema-flujo de trabajo**: el algoritmo maneja la generacion y mejora de soluciones, el problema evalua su calidad, y el flujo de trabajo los conecta en un bucle iterativo.

A continuacion, presentaremos algunos comandos basicos y llamadas a funciones disponibles en EvoX para ayudar a profundizar tu comprension del proceso de optimizacion.

## Resumen de Comandos Basicos

Al usar EvoX, hay algunos **metodos y funciones comunmente usados** que actuan como "comandos" con los que querras familiarizarte:

### Metodos Relacionados con el Flujo de Trabajo

- **`StdWorkflow.init_step()`**: Inicializacion. Este es un comando de inicio rapido para lanzar el proceso de optimizacion, frecuentemente usado al inicio de un script. Llama a la logica de inicializacion tanto del algoritmo como del problema, genera la poblacion inicial y evalua la aptitud. Despues de esto, el flujo de trabajo contiene el estado inicial y esta listo para iterar.

- **`StdWorkflow.step()`**: Avanzar un paso en la optimizacion. Cada llamada hace que el algoritmo genere nuevas soluciones candidatas basadas en el estado actual de la poblacion, las evalue y seleccione la siguiente generacion. Los usuarios tipicamente llaman esto multiples veces dentro de un bucle. La funcion `step()` generalmente no devuelve nada (el estado interno se actualiza dentro del flujo de trabajo), aunque versiones anteriores pueden devolver un nuevo estado. Para principiantes, simplemente puedes llamarlo sin preocuparte por el valor de retorno.

### Metodos Relacionados con el Monitor

Usando `EvalMonitor` como ejemplo, los metodos comunes incluyen:

- `EvalMonitor.get_best_fitness()`: Devuelve la aptitud mas baja registrada (para problemas de minimizacion) o la aptitud mas alta (para problemas de maximizacion; el monitor generalmente distingue esto). Util para conocer el mejor resultado actual.
- `EvalMonitor.get_history()` o `monitor.history`: Recupera el historial completo, como el mejor valor de cada generacion. Util para analizar tendencias de convergencia.
- `EvalMonitor.plot()`: Grafica curvas de convergencia o rendimiento; requiere un entorno grafico o Notebook. El monitor generalmente usa Plotly para renderizar graficos, ayudandote a evaluar visualmente el rendimiento del algoritmo.
  Internamente, el monitor registra el numero de evaluaciones y sus resultados en cada generacion; tipicamente no necesitas intervenir, solo extraer los datos cuando los necesites.

### Metodos Relacionados con el Algoritmo

- Metodo `Algorithm.__init__()`: Metodo de inicializacion de un algoritmo. Las variables generalmente se envuelven usando `evox.core.Mutable()` y los hiperparametros con `evox.core.Parameter()`.

- Metodo `Algorithm.step()`: En escenarios especificos o al usar algoritmos/problemas personalizados, podrias llamar directamente al metodo `step()` del algoritmo, que tipicamente encapsula toda la logica de iteracion del algoritmo.

- Metodo `Algorithm.init_step()`: El metodo `init_step()` incluye la primera iteracion del algoritmo. Si no se sobreescribe, simplemente llama al metodo `step()`. Para casos tipicos, la primera iteracion no es diferente de las demas, por lo que muchos algoritmos pueden no necesitar un `init_step()` personalizado. Pero para algoritmos que involucran ajuste de hiperparametros, podrias necesitar actualizar hiperparametros o variables relacionadas aqui.

### Control de Dispositivo y Paralelismo

- Metodo `.to(device)`: Si necesitas cambiar dispositivos de computacion en tu programa, usa el metodo `.to(device)` de PyTorch para mover tensores (`torch.Tensor`) a GPU/CPU (algunos metodos de PyTorch como `torch.randn` tambien necesitan que se especifique el dispositivo). Generalmente, si estableces el dispositivo usando `torch.set_default_device()` a `cuda:0` (asumiendo que tu sistema lo soporta y EvoX y las dependencias estan instaladas correctamente; verifica con `torch.cuda.is_available()`), la mayoria de las computaciones paralelas de alto rendimiento de EvoX se ejecutaran en GPU automaticamente. Al escribir algoritmos, problemas o monitores personalizados, si creas nuevos tensores o usas metodos de PyTorch sensibles al dispositivo, se recomienda especificar explicitamente el `device` como `cuda:0` o usar `torch.get_default_device()` para evitar caidas de rendimiento por computaciones distribuidas en diferentes dispositivos.

Para principiantes, los metodos anteriores son suficientes para manejar tareas de optimizacion tipicas. En resumen: **Inicializar problema/algoritmo -- configurar monitor -- ensamblar flujo de trabajo -- ejecutar y obtener resultados** es el flujo de trabajo mas comun de EvoX. Dominar esto te permite abordar tareas basicas de optimizacion usando EvoX.

Antes de pasar al siguiente capitulo, intenta modificar el ejemplo: cambia de PSO a otro algoritmo, reemplaza la funcion Ackley con otra funcion de prueba, o usa el monitor para extraer mas informacion; esto te ayudara a apreciar la flexibilidad de configurar proyectos EvoX.
