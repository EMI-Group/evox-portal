---
title: "Neuroevolution für maschinelles Lernen"
order: 12
section: "examples"
---

# Neuroevolution für maschinelles Lernen

EvoX bietet Lösungen für überwachte Lernaufgaben basierend auf Neuroevolution, mit Schlüsselmodulen wie `SupervisedLearningProblem` und `ParamsAndVector`. Am Beispiel der MNIST-Klassifikationsaufgabe veranschaulicht dieser Abschnitt den Neuroevolutionsprozess für überwachtes Lernen unter Verwendung der Module von EvoX.

## Grundlegende Einrichtung

Grundlegende Komponentenimporte und Gerätekonfiguration dienen als wesentliche Startschritte für den Neuroevolutionsprozess.

Hier kann optional ein Zufallsseed gesetzt werden, um die Reproduzierbarkeit der Ergebnisse sicherzustellen.

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

In diesem Schritt wird ein beispielhaftes Convolutional Neural Network (CNN)-Modell direkt auf dem PyTorch-Framework definiert und dann auf das Gerät geladen.

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

Das Festlegen des Datensatzes impliziert die Auswahl der Aufgabe. Der Data Loader muss nun basierend auf der eingebauten Unterstützung von PyTorch initialisiert werden.
Hier muss das Paket `torchvision` je nach Ihrer PyTorch-Version vorab installiert werden, falls es noch nicht verfügbar ist.

Falls der MNIST-Datensatz noch nicht im `data_root`-Verzeichnis vorhanden ist, wird das Flag `download=True` gesetzt, um sicherzustellen, dass der Datensatz automatisch heruntergeladen wird. Daher kann die Einrichtung beim ersten Durchlauf einige Zeit in Anspruch nehmen.

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

Um nachfolgende Prozesse zu beschleunigen, werden alle MNIST-Daten für eine schnellere Ausführung vorgeladen. Im Folgenden werden drei Datensätze für verschiedene Phasen vorgeladen -- Gradientenabstiegs-Training, Neuroevolution-Feinabstimmung und Modelltests.

Es ist zu beachten, dass dies eine optionale Operation ist, die Speicherplatz gegen Zeit tauscht. Ihre Anwendung hängt von Ihrer GPU-Kapazität ab, und sie wird immer einige Zeit zur Vorbereitung benötigen.

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

Hier wird eine `model_test`-Funktion vordefiniert, um die Bewertung der Vorhersagegenauigkeit des Modells auf dem Testdatensatz in nachfolgenden Phasen zu vereinfachen.

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

## Gradientenabstiegs-Training (Optional)

Das gradientenbasierte Modelltraining wird zuerst durchgeführt. In diesem Beispiel wird dieses Training verwendet, um das Modell zu initialisieren und es für nachfolgende Neuroevolutionsprozesse vorzubereiten.

Der Modelltrainingsprozess in PyTorch ist mit der Neuroevolution in EvoX kompatibel, was es bequem macht, dieselbe Modellimplementierung für weitere Schritte wiederzuverwenden.

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

## Neuroevolution-Feinabstimmung

Basierend auf dem vortrainierten Modell aus dem vorherigen Gradientenabstiegsprozess wird die Neuroevolution schrittweise angewendet, um das Modell feinabzustimmen.

Zunächst wird die `ParamsAndVector`-Komponente verwendet, um die Gewichte des vortrainierten Modells in einen Vektor abzuflachen, der als initiales Zentrumsindividuum für den nachfolgenden Neuroevolutionsprozess dient.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> Bei Algorithmen, die speziell für Neuroevolution entwickelt wurden und direkt ein Dictionary von gebatchten Parametern als Eingabe akzeptieren können, kann die Verwendung von `ParamsAndVector` unnötig sein.

Zusätzlich wird ein Beispielkriterium definiert. Hier werden sowohl der Verlust als auch die Genauigkeit des einzelnen Modells ausgewählt und gewichtet, um als Fitnessfunktion im Neuroevolutionsprozess zu dienen. Dieser Schritt ist anpassbar, um der Optimierungsrichtung zu entsprechen.

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

Gleichzeitig wird, ähnlich wie beim Gradientenabstiegs-Training und den Modelltestprozessen, auch der Neuroevolution-Feinabstimmungsprozess in eine Funktion gekapselt, um die bequeme Verwendung in nachfolgenden Phasen zu ermöglichen.

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

### Populationsbasierter Neuroevolution-Test

In diesem Beispiel wird zunächst der populationsbasierte Algorithmus für Neuroevolution getestet, wobei Partikelschwarmoptimierung ([PSO](#evox.algorithms.so.pso_variants.pso.PSO)) als Repräsentant verwendet wird. Die Konfiguration für Neuroevolution ähnelt der anderer Optimierungsaufgaben -- wir müssen das Problem, den Algorithmus, den Monitor und den Workflow definieren, zusammen mit ihren jeweiligen `setup()`-Funktionen, um die Initialisierung abzuschließen.

Ein wichtiger Punkt ist hier, dass die Populationsgröße (`POP_SIZE` in diesem Fall) **sowohl im Problem als auch im Algorithmus** initialisiert werden muss, um potenzielle Fehler zu vermeiden.

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

### Einzelindividuen-Neuroevolution-Test

Als Nächstes wird die auf Einzelindividuen basierende Neuroevolution getestet. Ähnlich wie beim populationsbasierten Fall müssen wir das Problem, den Algorithmus, den Monitor und den Workflow definieren und ihre jeweiligen `setup()`-Funktionen während der Initialisierung aufrufen. In diesem Fall wird eine Zufallssuchstrategie als Algorithmus ausgewählt.

Ein wichtiger Punkt ist hier, dass `SupervisedLearningProblem` mit `pop_size=None` gesetzt werden sollte und `EvalMonitor` `topk=1` haben sollte, da nur ein einzelnes Individuum gesucht wird. Eine sorgfältige Hyperparameter-Einrichtung hilft, unnötige Probleme zu vermeiden.

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
