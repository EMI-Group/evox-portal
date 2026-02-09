---
title: "7. Ejemplos prácticos"
order: 7
---

# 7. Ejemplos prácticos

Este capítulo presenta varios ejemplos prácticos y completos para demostrar cómo aplicar los conocimientos de los capítulos anteriores. Construiremos un proyecto de optimización desde cero y mostraremos cómo se puede integrar EvoX con otras herramientas. Estos ejemplos cubren diversos tipos de problemas para ayudarte a aplicar EvoX en escenarios del mundo real.

---

## Ejemplo 1: Optimización mono-objetivo

**Problema**: Optimizar la clásica función Rastrigin:

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

donde $\mathbf{x} \in \mathbb{R}^d$ y $d$ es la dimensionalidad. El óptimo global es 0 en el origen. La función es altamente multimodal, lo que la hace ideal para probar algoritmos de optimización global. Aquí tienes una gráfica de la función Rastrigin:

```{figure} /_static/rastrigin_function.svg
:alt: Una gráfica de la función Rastrigin
:figwidth: 70%
:align: center

Función Rastrigin
```

En este ejemplo, utilizaremos el algoritmo Particle Swarm Optimization (PSO) para optimizar la función Rastrigin de 10 dimensiones.

**Paso 1: Configuración**

Asumiendo que has configurado tu entorno EvoX como se explicó en el Capítulo 2.

**Paso 2: Configuración del flujo de trabajo (Workflow)**

Crea un script de Python `opt_rastrigin_10.py`:

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

**Paso 3: Ejecutar la optimización**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Ejemplo de salida**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

El algoritmo PSO encuentra una solución casi óptima cerca del origen, como era de esperar.

---

## Ejemplo 2: Optimización multi-objetivo

**Problema**: Minimizar dos objetivos:

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

El frente de Pareto se encuentra entre $x = 0$ (óptimo para $f_1$) y $x = 2$ (óptimo para $f_2$).

**Paso 1: Configuración del entorno**

Asegúrate de tener instalado EvoX con soporte para NSGA-II.

**Paso 2: Definir el problema personalizado**

EvoX tiene muchos problemas de prueba multi-objetivo integrados, pero para este ejemplo, definiremos un problema personalizado para optimizar los dos objetivos:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Import evox core classes, see Chapter 5 for details
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

    # Optional: Define the Pareto front function
    def pf(self) -> torch.Tensor:
        pass
```

**Paso 3: Definir el algoritmo y el flujo de trabajo**

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

**Paso 4: Optimización y visualización**

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
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Podemos visualizar los resultados utilizando Matplotlib. Los puntos azules representan la población optimizada, mientras que la línea roja muestra el frente de Pareto.

```{figure} /_static/example_nsga2_result.svg
:alt: Una gráfica de la población de NSGA-II
:figwidth: 70%
:align: center

Una gráfica de la población de NSGA-II tras la optimización
```

En Jupyter Notebook, puedes usar las capacidades de visualización integradas de EvoX para visualizar el proceso de optimización y monitorizar cómo evoluciona la población a lo largo de las generaciones.

```python
monitor.plot()
```

---

## Ejemplo 3: Optimización de hiperparámetros (HPO)

**Problema**: Ajustar `C` y `max_iter` de un clasificador de regresión logística en el conjunto de datos de cáncer de mama para maximizar la precisión de validación.

**Paso 1: Cargar datos y modelo**

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

**Paso 2: Definir el problema**

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
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```

**Paso 3: Configuración del flujo de trabajo**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Paso 4: Optimización**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Ejemplo de salida**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Con solo unas pocas líneas de código, EvoX automatiza el tedioso proceso de prueba y error del ajuste de hiperparámetros.

---

Estos ejemplos prácticos ilustran cómo se puede aplicar EvoX de manera efectiva en diversos dominios, desde funciones de prueba matemáticas hasta flujos de trabajo de machine learning. Una vez que te sientas cómodo con la estructura básica —**Algorithm + Problem + Monitor + Workflow**— podrás adaptar EvoX para que se ajuste a casi cualquier tarea de optimización.