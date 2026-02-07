---
title: "Neuroevoluzione per il machine learning"
order: 12
section: "examples"
---

# Neuroevoluzione per il machine learning

EvoX fornisce soluzioni per attività di apprendimento supervisionato basate sulla neuroevoluzione, con moduli chiave tra cui `SupervisedLearningProblem` e `ParamsAndVector`. Prendendo come esempio l'attività di classificazione MNIST, questa sezione illustra il processo di neuroevoluzione per l'apprendimento supervisionato adottando i moduli di EvoX.

## Configurazione di Base

Le importazioni dei componenti di base e la configurazione del dispositivo servono come passaggi iniziali essenziali per il processo di neuroevoluzione.

Qui, per garantire la riproducibilità dei risultati, è possibile impostare opzionalmente un seed casuale.

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

In questo passaggio, un modello di rete neurale convoluzionale (CNN) di esempio viene definito direttamente sul framework PyTorch e poi caricato sul dispositivo.

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

L'impostazione del dataset implica la selezione dell'attività. Il data loader deve ora essere inizializzato basandosi sul supporto integrato di PyTorch.
Qui, il pacchetto `torchvision` deve essere installato in anticipo a seconda della versione di PyTorch, se non è già disponibile.

Nel caso in cui il dataset MNIST non sia già presente nella directory `data_root`, il flag `download=True` è impostato per garantire che il dataset venga scaricato automaticamente. Pertanto, la configurazione potrebbe richiedere del tempo durante la prima esecuzione.

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

Per accelerare i processi successivi, tutti i dati MNIST vengono pre-caricati per un'esecuzione più veloce. Di seguito, tre dataset vengono pre-caricati per diverse fasi &ndash; addestramento con discesa del gradiente, fine-tuning con neuroevoluzione e test del modello.

Va notato che questa è un'operazione opzionale che scambia spazio per tempo. La sua adozione dipende dalla capacità della tua GPU, e richiederà sempre del tempo per la preparazione.

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

Qui, una funzione `model_test` viene pre-definita per semplificare la valutazione dell'accuratezza di predizione del modello sul dataset di test durante le fasi successive.

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

## Addestramento con Discesa del Gradiente (Opzionale)

L'addestramento del modello basato sulla discesa del gradiente viene eseguito per primo. In questo esempio, questo addestramento viene adottato per inizializzare il modello, preparandolo per i successivi processi di neuroevoluzione.

Il processo di addestramento del modello in PyTorch è compatibile con la neuroevoluzione in EvoX, rendendo conveniente riutilizzare la stessa implementazione del modello per i passaggi successivi.

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

## Fine-Tuning con Neuroevoluzione

Basandosi sul modello pre-addestrato dal precedente processo di discesa del gradiente, la neuroevoluzione viene applicata progressivamente per affinare il modello.

Per prima cosa, il componente `ParamsAndVector` viene usato per appiattire i pesi del modello pre-addestrato in un vettore, che serve come individuo centro iniziale per il successivo processo di neuroevoluzione.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> Nel caso di algoritmi specificamente progettati per la neuroevoluzione, che possono accettare direttamente un dizionario di parametri batch come input, l'uso di `ParamsAndVector` può non essere necessario.

Inoltre, viene definito un criterio di esempio. Qui, sia la perdita che l'accuratezza del modello individuale vengono selezionate e pesate per servire come funzione di fitness nel processo di neuroevoluzione. Questo passaggio è personalizzabile per adattarsi alla direzione di ottimizzazione.

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

Allo stesso tempo, similmente ai processi di addestramento con discesa del gradiente e test del modello, anche il processo di fine-tuning con neuroevoluzione viene incapsulato in una funzione per un uso conveniente nelle fasi successive.

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

### Test di Neuroevoluzione Basata sulla Popolazione

In questo esempio, l'algoritmo basato sulla popolazione per la neuroevoluzione viene testato per primo, usando l'Ottimizzazione a Sciame di Particelle ([PSO](#evox.algorithms.so.pso_variants.pso.PSO)) come rappresentazione. La configurazione per la neuroevoluzione è simile a quella di altre attività di ottimizzazione &ndash; dobbiamo definire il problema, l'algoritmo, il monitor e il workflow, insieme alle rispettive funzioni `setup()` per completare l'inizializzazione.

Un punto chiave da notare qui è che la dimensione della popolazione (`POP_SIZE` in questo caso) deve essere inizializzata **sia nel problema che nell'algoritmo** per evitare potenziali errori.

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

### Test di Neuroevoluzione a Singolo Individuo

Successivamente, viene testata la neuroevoluzione basata su algoritmo a singolo individuo. Similmente al caso basato sulla popolazione, dobbiamo definire il problema, l'algoritmo, il monitor e il workflow, e chiamare le rispettive funzioni `setup()` durante l'inizializzazione. In questo caso, viene selezionata una strategia di ricerca casuale come algoritmo.

Un punto chiave da notare qui è che `SupervisedLearningProblem` dovrebbe essere impostato con `pop_size=None`, e `EvalMonitor` dovrebbe avere `topk=1`, poiché viene cercato un solo individuo. Una configurazione attenta degli iperparametri aiuta a evitare problemi inutili.

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
