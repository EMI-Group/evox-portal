---
title: "3. Operaciones Basicas"
order: 3
---

# 3. Operaciones Basicas

En este capitulo, le guiaremos a traves de la ejecucion de su primera tarea de optimizacion con EvoX, incluyendo como **iniciar EvoX** e **inicializar el proceso de optimizacion**, como **configurar un proyecto EvoX** (seleccionando algoritmos y problemas y ensamblándolos), y los **comandos basicos** (o metodos) de uso comun para controlar el proceso de optimizacion. A traves de un ejemplo sencillo, aprendera el uso basico de EvoX.

## Inicio e Inicializacion

Despues de verificar la instalacion, puede comenzar a escribir scripts de optimizacion usando EvoX. Puede importar EvoX en cualquier entorno Python (como terminal, Jupyter Notebook, IDE, etc.).

Primero, importemos EvoX y sus modulos relacionados, e inicialicemos una tarea de optimizacion simple. Por ejemplo, usaremos el algoritmo de Optimizacion por Enjambre de Particulas (PSO) para optimizar la clasica funcion Ackley. La funcion Ackley es una funcion de referencia comun con un optimo global conocido en \((0,0,\dots,0)\), lo que la hace adecuada para demostracion.
Aqui hay un ejemplo minimo de codigo EvoX que demuestra como iniciar y ejecutar la optimizacion:

```python
import torch
from evox.algorithms import PSO                      # Importar algoritmo PSO
from evox.problems.numerical import Ackley           # Importar problema de optimizacion Ackley
from evox.workflows import StdWorkflow, EvalMonitor  # Importar flujo de trabajo estandar y monitor

# 1. Definir el algoritmo de optimizacion y el problema
algorithm = PSO(
    pop_size=50,                    # Tamano de poblacion de 50
    lb=-32 * torch.ones(2),         # Limite inferior de variables de decision: vector 2D, cada uno -32
    ub= 32 * torch.ones(2)          # Limite superior de variables de decision: vector 2D, cada uno 32
)
problem = Ackley()                  # Problema de optimizacion: funcion Ackley (dimension por defecto coincide con el algoritmo)

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
- A continuacion, completamos el proceso de inicializacion usando `workflow.init_step()`, que inicializa automaticamente la poblacion, la semilla aleatoria y otros estados internos.
- Luego, ejecutamos un bucle para ejecutar continuamente 100 iteraciones usando `workflow.step()`. Cada vez que se llama a `step()`, el algoritmo genera nuevas soluciones y evalua su aptitud, acercandose continuamente a la solucion optima.
- Finalmente, usamos el metodo `get_min_fitness()` proporcionado por el monitor para obtener el mejor valor de aptitud durante el proceso de iteracion e imprimirlo.

Cuando ejecute este script, vera la salida de las iteraciones de optimizacion, por ejemplo:

```text
Iteracion completada, mejor valor de aptitud encontrado: 9.5367431640625e-07
```

Dado que no imprimimos explicitamente los resultados intermedios en el bucle, los resultados intermedios no se mostraran. Sin embargo, puede juzgar si el algoritmo ha convergido basandose en el valor de aptitud final. Por ejemplo, el valor optimo de la funcion Ackley es 0, y si la salida esta cerca de 0, indica que PSO ha encontrado una solucion cercana al optimo global. Tambien puede llamar a `print(monitor.history)` para ver los datos historicos registrados por el monitor o usar `monitor.plot()` para graficar curvas de convergencia (requiere soporte de visualizacion como Plotly).

> **Nota:**
> `StdWorkflow` es una encapsulacion de **proceso de optimizacion estandar** proporcionada por EvoX. Internamente implementa la logica de "inicializacion-actualizacion iterativa" que se encuentra en los algoritmos evolutivos tradicionales y encapsula la interaccion entre el algoritmo y el problema. Para la mayoria de las aplicaciones simples, usar `StdWorkflow` directamente sera suficiente. El `EvalMonitor` es un monitor que implementa metodos como `get_best_fitness()` y `plot()` para recopilar y mostrar metricas de rendimiento durante el proceso de optimizacion. Los principiantes pueden entenderlo temporalmente como un libro de registro que registra los mejores resultados de cada iteracion para analisis posterior.

En el ejemplo anterior, hemos creado una configuracion basica para un proyecto EvoX, incluyendo la seleccion de un algoritmo, la definicion del problema y el ensamblaje del flujo de trabajo. Generalmente, configurar un proyecto EvoX implica los siguientes pasos:

1. **Seleccionar/Definir un Problema de Optimizacion**: Aclare que problema de optimizacion esta tratando de resolver. Por ejemplo, si esta optimizando una funcion matematica, EvoX proporciona muchos **problemas incorporados** bajo el modulo `evox.problems` (por ejemplo, funciones clasicas como Sphere, Rastrigin, Ackley) que puede usar directamente. Si su problema no esta cubierto por los incorporados, puede definir el suyo propio (cubierto en un capitulo posterior). Al configurar un problema, generalmente necesita conocer la **dimension de las variables de decision** y su **rango de valores**.

2. **Seleccionar/Configurar un Algoritmo de Optimizacion**: Elija un algoritmo evolutivo apropiado segun el tipo de problema. EvoX proporciona un rico conjunto de algoritmos bajo `evox.algorithms`, incluyendo algoritmos de objetivo unico (como PSO, GA, CMA-ES) y algoritmos multiobjetivo (como NSGA-II, RVEA). Despues de elegir el algoritmo, generalmente necesitara establecer parametros del algoritmo, como el tamano de poblacion (`pop_size`) y parametros especificos del algoritmo (como la probabilidad de cruce y la probabilidad de mutacion en GA). La mayoria de los algoritmos requieren el **rango de variables** (limite inferior `lb` y limite superior `ub`) y la dimension del problema para inicializar la poblacion. Si esta usando un algoritmo multiobjetivo, tambien necesitara especificar el numero de objetivos (`n_objs`). Los algoritmos de EvoX a menudo proporcionan valores predeterminados para hiperparametros comunes, pero los principiantes deben considerar ajustar estos parametros segun la tarea para un mejor rendimiento.

3. **Ensamblar el Flujo de Trabajo**: Con las instancias del algoritmo y el problema listas, necesita "ensamblarlas" en un flujo de trabajo, que representa el control completo del proceso de optimizacion. En EvoX, `StdWorkflow` se usa tipicamente para combinar el algoritmo y el problema. Si desea monitorear el progreso de la optimizacion, puede agregar un monitor (como `EvalMonitor`) al flujo de trabajo. Un monitor no es obligatorio, pero puede ser muy util durante la depuracion y el analisis. Ensamblar el flujo de trabajo generalmente toma una linea de codigo, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Llame al metodo de inicializacion del flujo de trabajo para comenzar la optimizacion. La ultima version de EvoX proporciona un conveniente metodo `StdWorkflow.init_step()` que completa el proceso de inicializacion en una sola llamada.

5. **Ejecutar Iteraciones**: Use un bucle para llamar repetidamente a `workflow.step()` para impulsar el proceso evolutivo. Cada llamada realiza una iteracion, incluyendo pasos como "generar nuevas soluciones -> evaluar -> seleccionar" dentro del algoritmo. Durante las iteraciones, puede usar un monitor para observar resultados en tiempo real, como imprimir la mejor aptitud actual cada pocas generaciones. Los criterios de terminacion pueden establecerse segun sus necesidades: los comunes incluyen un numero fijo de generaciones (por ejemplo, ejecutar durante 100 generaciones), o detenerse cuando las metricas monitoreadas converjan (por ejemplo, sin mejora significativa durante varias generaciones).

6. **Obtener Resultados**: Despues de que terminen las iteraciones, necesita extraer los resultados finales del algoritmo, como la mejor solucion y su valor objetivo. En EvoX, estos se obtienen tipicamente a traves del monitor. Por ejemplo, `EvalMonitor.get_best_fitness()` devuelve el mejor valor de aptitud. Para obtener el mejor vector de solucion, una forma es que el objeto del problema almacene el mejor candidato durante la evaluacion, o usar la interfaz del monitor. En la implementacion estandar de EvoX, `EvalMonitor` registra el mejor individuo y aptitud de cada generacion, accesibles a traves de sus propiedades. Suponiendo que `monitor.history` almacena el historial, puede recuperar el mejor individuo de la ultima generacion. Por supuesto, tambien puede omitir `EvalMonitor` y consultar directamente el objeto del algoritmo despues del bucle; esto depende de la implementacion del algoritmo. Si su algoritmo personalizado implementa `get_best()` o almacena el mejor individuo en su estado, puede extraerlo directamente. Sin embargo, dado que EvoX enfatiza las funciones puras y la modularidad, los resultados generalmente se acceden a traves de modulos de monitoreo.

Siguiendo estos pasos, puede estructurar claramente el codigo de su tarea de optimizacion. Para principiantes, es importante entender como funciona el trio **algoritmo-problema-flujo de trabajo**: el algoritmo maneja la generacion y mejora de soluciones, el problema evalua su calidad, y el flujo de trabajo los conecta en un bucle iterativo.

A continuacion, presentaremos algunos comandos basicos y llamadas a funciones disponibles en EvoX para ayudar a profundizar su comprension del proceso de optimizacion.

## Resumen de Comandos Basicos

Al usar EvoX, hay algunos **metodos y funciones de uso comun** que actuan como "comandos" con los que querra familiarizarse:

### Metodos Relacionados con el Flujo de Trabajo

- **`StdWorkflow.init_step()`**: Inicializacion. Este es un comando de inicio rapido para lanzar el proceso de optimizacion, a menudo usado al principio de un script. Llama a la logica de inicializacion tanto del algoritmo como del problema, genera la poblacion inicial y evalua la aptitud. Despues de esto, el flujo de trabajo contiene el estado inicial y esta listo para la iteracion.

- **`StdWorkflow.step()`**: Avanzar un paso en la optimizacion. Cada llamada hace que el algoritmo genere nuevas soluciones candidatas basadas en el estado actual de la poblacion, las evalue y seleccione la siguiente generacion. Los usuarios tipicamente llaman a esto multiples veces dentro de un bucle. La funcion `step()` generalmente no devuelve nada (el estado interno se actualiza dentro del flujo de trabajo), aunque versiones anteriores pueden devolver un nuevo estado. Para principiantes, simplemente puede llamarlo sin preocuparse por el valor de retorno.

### Metodos Relacionados con el Monitor

Usando `EvalMonitor` como ejemplo, los metodos comunes incluyen:

- `EvalMonitor.get_best_fitness()`: Devuelve la aptitud mas baja registrada (para problemas de minimizacion) o la aptitud mas alta (para problemas de maximizacion; el monitor generalmente distingue esto). Util para conocer el mejor resultado actual.
- `EvalMonitor.get_history()` o `monitor.history`: Recupera el historial completo, como el mejor valor de cada generacion. Util para analizar tendencias de convergencia.
- `EvalMonitor.plot()`: Grafica curvas de convergencia o rendimiento; requiere un entorno grafico o Notebook. El monitor generalmente usa Plotly para renderizar graficos, ayudandole a evaluar visualmente el rendimiento del algoritmo.
  Internamente, el monitor registra el numero de evaluaciones y sus resultados en cada generacion; tipicamente no necesita intervenir, solo extraer los datos cuando los necesite.

### Metodos Relacionados con el Algoritmo

- Metodo `Algorithm.__init__()`: Metodo de inicializacion de un algoritmo. Las variables generalmente se envuelven usando `evox.core.Mutable()` y los hiperparametros con `evox.core.Parameter()`.

- Metodo `Algorithm.step()`: En escenarios especificos o al usar algoritmos/problemas personalizados, podria llamar directamente al metodo `step()` del algoritmo, que tipicamente encapsula toda la logica de iteracion del algoritmo.

- Metodo `Algorithm.init_step()`: El metodo `init_step()` incluye la primera iteracion del algoritmo. Si no se sobreescribe, simplemente llama al metodo `step()`. Para casos tipicos, la primera iteracion no es diferente de las demas, por lo que muchos algoritmos pueden no necesitar un `init_step()` personalizado. Pero para algoritmos que involucran ajuste de hiperparametros, puede necesitar actualizar hiperparametros o variables relacionadas aqui.

### Control de Dispositivo y Paralelismo

- Metodo `.to(device)`: Si necesita cambiar dispositivos de computacion en su programa, use el metodo `.to(device)` de PyTorch para mover tensores (`torch.Tensor`) a GPU/CPU (algunos metodos de PyTorch como `torch.randn` tambien necesitan que se especifique el dispositivo). Generalmente, si establece el dispositivo usando `torch.set_default_device()` a `cuda:0` (asumiendo que su sistema lo soporta y EvoX y las dependencias estan instaladas correctamente; verifique con `torch.cuda.is_available()`), la mayoria de los calculos paralelos de alto rendimiento de EvoX se ejecutaran en GPU automaticamente. Al escribir algoritmos, problemas o monitores personalizados, si crea nuevos tensores o usa metodos de PyTorch sensibles al dispositivo, se recomienda especificar explicitamente el `device` como `cuda:0` o usar `torch.get_default_device()` para evitar caidas de rendimiento por calculos distribuidos en diferentes dispositivos.

Para principiantes, los metodos anteriores son suficientes para manejar tareas de optimizacion tipicas. En resumen: **Inicializar problema/algoritmo - configurar monitor - ensamblar flujo de trabajo - ejecutar y obtener resultados** es el flujo de trabajo mas comun de EvoX. Dominar esto le permite abordar tareas basicas de optimizacion usando EvoX.

Antes de pasar al siguiente capitulo, intente modificar el ejemplo: cambie de PSO a otro algoritmo, reemplace la funcion Ackley con otra funcion de prueba, o use el monitor para extraer mas informacion; esto le ayudara a apreciar la flexibilidad de configurar proyectos EvoX.
