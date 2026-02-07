---
title: "7. Ejemplos Practicos"
order: 7
---

# 7. Ejemplos Practicos

Este capitulo presenta varios ejemplos completos y practicos para demostrar como aplicar el conocimiento de los capitulos anteriores. Construiremos un proyecto de optimizacion desde cero y mostraremos como EvoX puede integrarse con otras herramientas. Estos ejemplos cubren una variedad de tipos de problemas para ayudarte a aplicar EvoX en escenarios del mundo real.

---

## Ejemplo 1: Optimizacion de Objetivo Unico

**Problema**: Optimizar la clasica funcion Rastrigin:

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

donde $\mathbf{x} \in \mathbb{R}^d$ y $d$ es la dimensionalidad. El optimo global es 0 en el origen. La funcion es altamente multimodal, lo que la hace ideal para probar algoritmos de optimizacion global. Aqui hay un grafico de la funcion Rastrigin

```{figure} /_static/rastrigin_function.svg
:alt: Un grafico de la funcion Rastrigin
:figwidth: 70%
:align: center

Funcion Rastrigin
```

En este ejemplo, usaremos el algoritmo de Optimizacion por Enjambre de Particulas (PSO) para optimizar la funcion Rastrigin de 10 dimensiones.

**Paso 1: Configuracion**

Asumiendo que has configurado tu entorno EvoX como se explico en el Capitulo 2.

**Paso 2: Configuracion del Flujo de Trabajo**

Crea un script Python `opt_rastrigin_10.py`:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Define el algoritmo PSO:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

Configura el problema y el flujo de trabajo:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Paso 3: Ejecutar la Optimizacion**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Mejor Aptitud: {current_best_fitness}")

print(f"Mejor Solucion Final: {monitor.get_best_solution()}")
```

**Salida de Ejemplo**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

El algoritmo PSO encuentra una solucion casi optima cercana al origen, como se esperaba.

---

## Ejemplo 2: Optimizacion Multiobjetivo

**Problema**: Minimizar dos objetivos:

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

El frente de Pareto se encuentra entre $x = 0$ (optimo para $f_1$) y $x = 2$ (optimo para $f_2$).

**Paso 1: Configuracion del Entorno**

Asegurate de tener EvoX instalado con soporte para NSGA-II.

**Paso 2: Definir el Problema Personalizado**

EvoX tiene muchos problemas de prueba multiobjetivo integrados, pero para este ejemplo, definiremos un problema personalizado para optimizar los dos objetivos:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Importar clases principales de evox, ver Capitulo 5 para detalles
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Opcional: Definir la funcion del frente de Pareto
    def pf(self) -> torch.Tensor:
        pass
```

**Paso 3: Definir Algoritmo y Flujo de Trabajo**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Paso 4: Optimizacion y Visualizacion**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Poblacion Optimizada', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Frente de Pareto')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II en Problema Biobjetivo")
plt.legend()
plt.grid(True)
plt.show()
```

Podemos visualizar los resultados usando Matplotlib. Los puntos azules representan la poblacion optimizada, mientras que la linea roja muestra el frente de Pareto.

```{figure} /_static/example_nsga2_result.svg
:alt: Un grafico de la poblacion NSGA-II
:figwidth: 70%
:align: center

Un grafico de la poblacion NSGA-II despues de la optimizacion
```

En Jupyter Notebook, puedes usar las capacidades de graficado integradas de EvoX para visualizar el proceso de optimizacion y monitorear como evoluciona la poblacion a lo largo de las generaciones.

```python
monitor.plot()
```

---

## Ejemplo 3: Optimizacion de Hiperparametros (HPO)

**Problema**: Ajustar `C` y `max_iter` de un clasificador de regresion logistica en el conjunto de datos de cancer de mama para maximizar la precision de validacion.

**Paso 1: Cargar Datos y Modelo**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**Paso 2: Definir el Problema**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # tasa de error
        return torch.tensor(objs)
```

**Paso 3: Configuracion del Flujo de Trabajo**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Tasa de error inicial:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Paso 4: Optimizacion**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Tasa de error optimizada:", best_error)
```

**Salida de Ejemplo**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Con solo unas pocas lineas de codigo, EvoX automatiza el tedioso proceso de prueba y error del ajuste de hiperparametros.

---

Estos ejemplos practicos ilustran como EvoX puede aplicarse efectivamente en diversos dominios, desde funciones de prueba matematicas hasta flujos de trabajo de aprendizaje automatico. Una vez que te sientas comodo con la estructura basica -- **Algoritmo + Problema + Monitor + Flujo de Trabajo** -- puedes adaptar EvoX para casi cualquier tarea de optimizacion.
