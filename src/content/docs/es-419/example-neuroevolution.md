---
title: "Neuroevolucion para aprendizaje automatico"
order: 12
section: "examples"
---

# Neuroevolucion para aprendizaje automatico

EvoX proporciona soluciones para tareas de aprendizaje supervisado basadas en neuroevolucion, con modulos clave que incluyen `SupervisedLearningProblem` y `ParamsAndVector`. Tomando la tarea de clasificacion MNIST como ejemplo, esta seccion ilustra el proceso de neuroevolucion para aprendizaje supervisado adoptando los modulos de EvoX.

## Configuracion Basica

Las importaciones de componentes basicos y la configuracion del dispositivo sirven como los pasos iniciales esenciales para el proceso de neuroevolucion.

Aqui, para asegurar la reproducibilidad de los resultados, se puede establecer opcionalmente una semilla aleatoria.

```python
import torch
import torch.nn as nn

from evox.utils import ParamsAndVector
from evox.core import Algorithm, Mutable, Parameter, jit_class
from evox.problems.neuroevolution.supervised_learning import SupervisedLearningProblem
from evox.algorithms import PSO
from evox.workflows import EvalMonitor, StdWorkflow


# Set device
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Set random seed
seed = 0
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True
```

En este paso, se define directamente un modelo de red neuronal convolucional (CNN) de ejemplo sobre el framework PyTorch y luego se carga en el dispositivo.

```python
class SampleCNN(nn.Module):
    def __init__(self):
        super(SampleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 3, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(3, 3, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(3, 3, kernel_size=3),
            nn.ReLU(),
            nn.Conv2d(3, 3, kernel_size=3),
            nn.ReLU(),
        )
        self.classifier = nn.Sequential(nn.Flatten(), nn.Linear(12, 10))

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x


model = SampleCNN().to(device)

total_params = sum(p.numel() for p in model.parameters())
print(f"Total number of model parameters: {total_params}")
```

La configuracion del conjunto de datos implica la seleccion de la tarea. El cargador de datos ahora necesita ser inicializado basandose en el soporte integrado de PyTorch.
Aqui, el paquete `torchvision` debe estar instalado previamente dependiendo de tu version de PyTorch, si aun no esta disponible.

En caso de que el conjunto de datos MNIST no este ya presente en el directorio `data_root`, la bandera `download=True` se establece para asegurar que el conjunto de datos se descargue automaticamente. Por lo tanto, la configuracion puede tomar algo de tiempo durante la primera ejecucion.

```python
import os
import torchvision


data_root = "./data"  # Choose a path to save dataset
os.makedirs(data_root, exist_ok=True)
train_dataset = torchvision.datasets.MNIST(
    root=data_root,
    train=True,
    download=True,
    transform=torchvision.transforms.ToTensor(),
)
test_dataset = torchvision.datasets.MNIST(
    root=data_root,
    train=False,
    download=True,
    transform=torchvision.transforms.ToTensor(),
)


BATCH_SIZE = 100
train_loader = torch.utils.data.DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    collate_fn=None,
)
test_loader = torch.utils.data.DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    collate_fn=None,
)
```

Para acelerar los procesos subsiguientes, todos los datos MNIST se precargan para una ejecucion mas rapida. A continuacion, se precargan tres conjuntos de datos para diferentes etapas: entrenamiento por descenso de gradiente, ajuste fino por neuroevolucion y prueba del modelo.

Cabe senalar que esta es una operacion opcional que intercambia espacio por tiempo. Su adopcion depende de la capacidad de tu GPU, y siempre tomara algo de tiempo en prepararse.

```python
# Used for gradient descent training process
pre_gd_train_loader = tuple([(inputs.to(device), labels.to(device)) for inputs, labels in train_loader])

# Used for neuroevolution fine-tuning process
pre_ne_train_loader = tuple(
    [
        (
            inputs.to(device),
            labels.type(torch.float).unsqueeze(1).repeat(1, 10).to(device),
        )
        for inputs, labels in train_loader
    ]
)

# Used for model testing process
pre_test_loader = tuple([(inputs.to(device), labels.to(device)) for inputs, labels in test_loader])
```

Aqui, se predefine una funcion `model_test` para simplificar la evaluacion de la precision de prediccion del modelo en el conjunto de datos de prueba durante las etapas subsiguientes.

```python
def model_test(model: nn.Module, data_loader: torch.utils.data.DataLoader, device: torch.device) -> float:
    model.eval()
    with torch.no_grad():
        total = 0
        correct = 0
        for inputs, labels in data_loader:
            inputs: torch.Tensor = inputs.to(device=device, non_blocking=True)
            labels: torch.Tensor = labels.to(device=device, non_blocking=True)

            logits = model(inputs)
            _, predicted = torch.max(logits.data, dim=1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        acc = 100 * correct / total
    return acc
```

## Entrenamiento por Descenso de Gradiente (Opcional)

Primero se realiza el entrenamiento del modelo basado en descenso de gradiente. En este ejemplo, este entrenamiento se adopta para inicializar el modelo, preparandolo para los procesos de neuroevolucion subsiguientes.

El proceso de entrenamiento del modelo en PyTorch es compatible con la neuroevolucion en EvoX, lo que facilita reutilizar la misma implementacion del modelo para pasos posteriores.

```python
def model_train(
    model: nn.Module,
    data_loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    max_epoch: int,
    device: torch.device,
    print_frequent: int = -1,
) -> nn.Module:
    model.train()
    for epoch in range(max_epoch):
        running_loss = 0.0
        for step, (inputs, labels) in enumerate(data_loader, start=1):
            inputs: torch.Tensor = inputs.to(device=device, non_blocking=True)
            labels: torch.Tensor = labels.to(device=device, non_blocking=True)

            optimizer.zero_grad()
            logits = model(inputs)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            if print_frequent > 0 and step % print_frequent == 0:
                print(f"[Epoch {epoch:2d}, step {step:4d}] running loss: {running_loss:.4f} ")
                running_loss = 0.0
    return model
```

```python
model_train(
    model,
    data_loader=pre_gd_train_loader,
    criterion=nn.CrossEntropyLoss(),
    optimizer=torch.optim.Adam(model.parameters(), lr=1e-2),
    max_epoch=3,
    device=device,
    print_frequent=500,
)

gd_acc = model_test(model, pre_test_loader, device)
print(f"Accuracy after gradient descent training: {gd_acc:.4f} %.")
```

## Ajuste Fino por Neuroevolucion

Basandose en el modelo preentrenado del proceso anterior de descenso de gradiente, la neuroevolucion se aplica progresivamente para ajustar el modelo.

Primero, el componente `ParamsAndVector` se usa para aplanar los pesos del modelo preentrenado en un vector, que sirve como el individuo central inicial para el proceso de neuroevolucion subsiguiente.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> En caso de algoritmos especificamente disenados para neuroevolucion, que pueden aceptar directamente un diccionario de parametros por lotes como entrada, el uso de `ParamsAndVector` puede ser innecesario.

Adicionalmente, se define un criterio de ejemplo. Aqui, tanto la perdida como la precision del modelo individual se seleccionan y ponderan para servir como la funcion de aptitud en el proceso de neuroevolucion. Este paso es personalizable para adaptarse a la direccion de optimizacion.

```python
class AccuracyCriterion(nn.Module):
    def __init__(self, data_loader):
        super().__init__()
        data_loader = data_loader

    def forward(self, logits, labels):
        _, predicted = torch.max(logits, dim=1)
        correct = (predicted == labels[:, 0]).sum()
        fitness = -correct
        return fitness


acc_criterion = AccuracyCriterion(pre_ne_train_loader)
loss_criterion = nn.MSELoss()


class WeightedCriterion(nn.Module):
    def __init__(self, loss_weight, loss_criterion, acc_weight, acc_criterion):
        super().__init__()
        self.loss_weight = loss_weight
        self.loss_criterion = loss_criterion
        self.acc_weight = acc_weight
        self.acc_criterion = acc_criterion

    def forward(self, logits, labels):
        weighted_loss = self.loss_weight * loss_criterion(logits, labels)
        weighted_acc = self.acc_weight * acc_criterion(logits, labels)
        return weighted_loss + weighted_acc


weighted_criterion = WeightedCriterion(
    loss_weight=0.5,
    loss_criterion=loss_criterion,
    acc_weight=0.5,
    acc_criterion=acc_criterion,
)
```

Al mismo tiempo, similar a los procesos de entrenamiento por descenso de gradiente y prueba del modelo, el proceso de ajuste fino por neuroevolucion tambien se encapsula en una funcion para uso conveniente en etapas subsiguientes.

```python
import time


def neuroevolution_process(
    workflow: StdWorkflow,
    adapter: ParamsAndVector,
    model: nn.Module,
    test_loader: torch.utils.data.DataLoader,
    device: torch.device,
    best_acc: float,
    max_generation: int = 2,
) -> None:
    for index in range(max_generation):
        print(f"In generation {index}:")
        t = time.time()
        workflow.step()
        print(f"\tTime elapsed: {time.time() - t: .4f}(s).")

        monitor = workflow.get_submodule("monitor")
        print(f"\tTop fitness: {monitor.topk_fitness}")
        best_params = adapter.to_params(monitor.topk_solutions[0])
        model.load_state_dict(best_params)
        acc = model_test(model, test_loader, device)
        if acc > best_acc:
            best_acc = acc
        print(f"\tBest accuracy: {best_acc:.4f} %.")
```

### Prueba de Neuroevolucion Basada en Poblacion

En este ejemplo, primero se prueba el algoritmo basado en poblacion para neuroevolucion, usando la Optimizacion por Enjambre de Particulas ([PSO](#evox.algorithms.so.pso_variants.pso.PSO)) como representacion. La configuracion para neuroevolucion es similar a la de otras tareas de optimizacion: necesitamos definir el problema, algoritmo, monitor y flujo de trabajo, junto con sus respectivas funciones `setup()` para completar la inicializacion.

Un punto clave a notar aqui es que el tamano de la poblacion (`POP_SIZE` en este caso) necesita ser inicializado **tanto en el problema como en el algoritmo** para evitar errores potenciales.

```python
POP_SIZE = 100
vmapped_problem = SupervisedLearningProblem(
    model=model,
    data_loader=pre_ne_train_loader,
    criterion=weighted_criterion,
    pop_size=POP_SIZE,
    device=device,
)
vmapped_problem.setup()

pop_algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)
pop_algorithm.setup()

monitor = EvalMonitor(
    topk=3,
    device=device,
)
monitor.setup()

pop_workflow = StdWorkflow()
pop_workflow.setup(
    algorithm=pop_algorithm,
    problem=vmapped_problem,
    solution_transform=adapter,
    monitor=monitor,
    device=device,
)
```

```python
print("Upon gradient descent, the population-based neuroevolution process start. ")
neuroevolution_process(
    workflow=pop_workflow,
    adapter=adapter,
    model=model,
    test_loader=pre_test_loader,
    device=device,
    best_acc=gd_acc,
    max_generation=10,
)
```

```python
pop_workflow.get_submodule("monitor").plot()
```

### Prueba de Neuroevolucion de Individuo Unico

A continuacion, se prueba la neuroevolucion basada en algoritmo de individuo unico. Similar al caso basado en poblacion, necesitamos definir el problema, algoritmo, monitor y flujo de trabajo, y llamar a sus respectivas funciones `setup()` durante la inicializacion. En este caso, se selecciona una estrategia de busqueda aleatoria como algoritmo.

Un punto clave a notar aqui es que `SupervisedLearningProblem` debe configurarse con `pop_size=None`, y `EvalMonitor` debe tener `topk=1`, ya que solo se busca un individuo unico. Una configuracion cuidadosa de hiperparametros ayuda a evitar problemas innecesarios.

```python
single_problem = SupervisedLearningProblem(
    model=model,
    data_loader=pre_ne_train_loader,
    criterion=weighted_criterion,
    pop_size=None,
    device=device,
)
single_problem.setup()


@jit_class
class RandAlgorithm(Algorithm):
    def __init__(self, lb, ub):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}. "
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}. "
        self.hp = Parameter([1.0, 2.0])
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(1, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(1, dtype=lb.dtype, device=lb.device))

    def step(self):
        pop = torch.rand(
            self.dim,
            dtype=self.lb.dtype,
            device=self.lb.device,
        )
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        pop = pop * self.hp[0]
        self.pop.copy_(pop)
        self.fit.copy_(self.evaluate(pop))


single_algorithm = RandAlgorithm(lb=lower_bound, ub=upper_bound)

single_monitor = EvalMonitor(
    topk=1,
    device=device,
)
single_monitor.setup()

single_workflow = StdWorkflow()
single_workflow.setup(
    algorithm=single_algorithm,
    problem=single_problem,
    solution_transform=adapter,
    monitor=single_monitor,
    device=device,
)
```

```python
print("Upon gradient descent, the single-individual neuroevolution process start. ")
neuroevolution_process(
    workflow=single_workflow,
    adapter=adapter,
    model=model,
    test_loader=pre_test_loader,
    device=device,
    best_acc=gd_acc,
    max_generation=12,
)
```

```python
single_workflow.get_submodule("monitor").plot()
```
