---
title: "7. Exemplos Práticos"
order: 7
---

# 7. Exemplos Práticos

Este capítulo apresenta vários exemplos práticos e completos para demonstrar como aplicar o conhecimento dos capítulos anteriores. Construiremos um projeto de otimização do zero e mostraremos como o EvoX pode ser integrado a outras ferramentas. Estes exemplos abrangem uma variedade de tipos de problemas para ajudá-lo a aplicar o EvoX em cenários do mundo real.

---

## Exemplo 1: Otimização de Objetivo Único

**Problema**: Otimizar a clássica função Rastrigin:

```math
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

onde $\mathbf{x} \in \mathbb{R}^d$ e $d$ é a dimensionalidade. O ótimo global é 0 na origem. A função é altamente multimodal, tornando-a ideal para testar algoritmos de otimização global. Aqui está um gráfico da função Rastrigin:

![Um gráfico da função Rastrigin](/_static/rastrigin_function.svg)

*Função Rastrigin*

Neste exemplo, usaremos o algoritmo Particle Swarm Optimization (PSO) para otimizar a função Rastrigin de 10 dimensões.

**Passo 1: Configuração**

Assumindo que você configurou seu ambiente EvoX conforme explicado no Capítulo 2.

**Passo 2: Configuração do Workflow**

Crie um script Python `opt_rastrigin_10.py`:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Defina o algoritmo PSO:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

Configure o problema e o workflow:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Passo 3: Executar a Otimização**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Exemplo de Saída**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

O algoritmo PSO encontra uma solução quase ótima próxima à origem, como esperado.

---

## Exemplo 2: Otimização Multiobjetivo

**Problema**: Minimizar dois objetivos:

```math
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

A fronteira de Pareto (Pareto front) situa-se entre $x = 0$ (ótimo para $f_1$) e $x = 2$ (ótimo para $f_2$).

**Passo 1: Configuração do Ambiente**

Certifique-se de ter o EvoX instalado com suporte ao NSGA-II.

**Passo 2: Definir o Problema Personalizado**

O EvoX possui muitos problemas de teste multiobjetivo integrados, mas para este exemplo, definiremos um problema personalizado para otimizar os dois objetivos:

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

**Passo 3: Definir Algoritmo e Workflow**

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

**Passo 4: Otimização e Visualização**

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

Podemos visualizar os resultados usando Matplotlib. Os pontos azuis representam a população otimizada, enquanto a linha vermelha mostra a fronteira de Pareto.

![Um gráfico da população do NSGA-II](/_static/example_nsga2_result.svg)

*Um gráfico da população do NSGA-II após a otimização*

No Jupyter Notebook, você pode usar os recursos de plotagem integrados do EvoX para visualizar o processo de otimização e monitorar como a população evolui ao longo das gerações.

```python
monitor.plot()
```

---

## Exemplo 3: Otimização de Hiperparâmetros (HPO)

**Problema**: Ajustar `C` e `max_iter` de um classificador de regressão logística no conjunto de dados de câncer de mama para maximizar a acurácia de validação.

**Passo 1: Carregar Dados e Modelo**

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

**Passo 2: Definir o Problema**

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

**Passo 3: Configuração do Workflow**

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

**Passo 4: Otimização**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Exemplo de Saída**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Com apenas algumas linhas de código, o EvoX automatiza o tedioso processo de tentativa e erro do ajuste de hiperparâmetros.

---

Estes exemplos práticos ilustram como o EvoX pode ser aplicado de forma eficaz em vários domínios, desde funções de teste matemáticas até workflows de machine learning. Uma vez que você esteja confortável com a estrutura básica — **Algorithm + Problem + Monitor + Workflow** — você poderá adaptar o EvoX para atender a quase qualquer tarefa de otimização.