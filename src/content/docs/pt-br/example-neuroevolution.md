---
title: "Neuroevolução para aprendizado de máquina"
order: 12
section: "examples"
---

# Neuroevolução para aprendizado de máquina

O EvoX fornece soluções para tarefas de aprendizado supervisionado baseadas em neuroevolução, com módulos-chave incluindo `SupervisedLearningProblem` e `ParamsAndVector`. Tomando a tarefa de classificação MNIST como exemplo, esta seção ilustra o processo de neuroevolução para aprendizado supervisionado adotando os módulos do EvoX.

## Configuração Básica

Importações de componentes básicos e configuração de dispositivo servem como os passos iniciais essenciais para o processo de neuroevolução.

Aqui, para garantir a reprodutibilidade dos resultados, uma semente aleatória pode ser opcionalmente definida.

```python
import torch
import torch.nn as nn

from evox.utils import ParamsAndVector
from evox.core import Algorithm, Mutable, Parameter, jit_class
from evox.problems.neuroevolution.supervised_learning import SupervisedLearningProblem
from evox.algorithms import PSO
from evox.workflows import EvalMonitor, StdWorkflow


# Definir dispositivo
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Definir semente aleatória
seed = 0
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True
```

Neste passo, um modelo de rede neural convolucional (CNN) de exemplo é definido diretamente sobre o framework PyTorch e então carregado no dispositivo.

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

Definir o conjunto de dados implica a seleção da tarefa. O data loader agora precisa ser inicializado com base no suporte integrado do PyTorch.
Aqui, o pacote `torchvision` deve ser instalado previamente dependendo da sua versão do PyTorch, se ainda não estiver disponível.

Caso o conjunto de dados MNIST não esteja presente no diretório `data_root`, a flag `download=True` é definida para garantir que o conjunto de dados será baixado automaticamente. Portanto, a configuração pode levar algum tempo durante a primeira execução.

```python
import os
import torchvision


data_root = "./data"  # Escolha um caminho para salvar o conjunto de dados
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

Para acelerar os processos subsequentes, todos os dados MNIST são pré-carregados para execução mais rápida. Abaixo, três conjuntos de dados são pré-carregados para diferentes estágios &ndash; treinamento por gradiente descendente, ajuste fino por neuroevolução e teste do modelo.

Deve-se notar que esta é uma operação opcional que troca espaço por tempo. Sua adoção depende da capacidade da sua GPU, e sempre levará algum tempo para preparar.

```python
# Usado para o processo de treinamento por gradiente descendente
pre_gd_train_loader = tuple([(inputs.to(device), labels.to(device)) for inputs, labels in train_loader])

# Usado para o processo de ajuste fino por neuroevolução
pre_ne_train_loader = tuple(
    [
        (
            inputs.to(device),
            labels.type(torch.float).unsqueeze(1).repeat(1, 10).to(device),
        )
        for inputs, labels in train_loader
    ]
)

# Usado para o processo de teste do modelo
pre_test_loader = tuple([(inputs.to(device), labels.to(device)) for inputs, labels in test_loader])
```

Aqui, uma função `model_test` é pré-definida para simplificar a avaliação da acurácia de predição do modelo no conjunto de dados de teste durante os estágios subsequentes.

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

## Treinamento por Gradiente Descendente (Opcional)

O treinamento do modelo baseado em gradiente descendente é realizado primeiro. Neste exemplo, este treinamento é adotado para inicializar o modelo, preparando-o para os processos subsequentes de neuroevolução.

O processo de treinamento do modelo no PyTorch é compatível com a neuroevolução no EvoX, tornando conveniente reutilizar a mesma implementação do modelo para etapas posteriores.

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

## Ajuste Fino por Neuroevolução

Com base no modelo pré-treinado do processo anterior de gradiente descendente, a neuroevolução é progressivamente aplicada para ajustar o modelo.

Primeiro, o componente `ParamsAndVector` é usado para achatar os pesos do modelo pré-treinado em um vetor, que serve como o indivíduo central inicial para o processo subsequente de neuroevolução.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> No caso de algoritmos especificamente projetados para neuroevolução, que podem aceitar diretamente um dicionário de parâmetros em lote como entrada, o uso de `ParamsAndVector` pode ser desnecessário.

Além disso, um critério de exemplo é definido. Aqui, tanto a perda quanto a acurácia do modelo individual são selecionadas e ponderadas para servir como a função de fitness no processo de neuroevolução. Este passo é personalizável para se adequar à direção de otimização.

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

Ao mesmo tempo, similar aos processos de treinamento por gradiente descendente e teste do modelo, o processo de ajuste fino por neuroevolução também é encapsulado em uma função para uso conveniente nos estágios subsequentes.

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

### Teste de Neuroevolução Baseada em População

Neste exemplo, o algoritmo baseado em população para neuroevolução é testado primeiro, usando a Otimização por Enxame de Partículas ([PSO](#evox.algorithms.so.pso_variants.pso.PSO)) como representação. A configuração para neuroevolução é similar à de outras tarefas de otimização &ndash; precisamos definir o problema, algoritmo, monitor e workflow, junto com suas respectivas funções `setup()` para completar a inicialização.

Um ponto-chave a notar aqui é que o tamanho da população (`POP_SIZE` neste caso) precisa ser inicializado **tanto no problema quanto no algoritmo** para evitar erros potenciais.

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

### Teste de Neuroevolução de Indivíduo Único

Em seguida, a neuroevolução baseada em algoritmo de indivíduo único é testada. Similar ao caso baseado em população, precisamos definir o problema, algoritmo, monitor e workflow, e chamar suas respectivas funções `setup()` durante a inicialização. Neste caso, uma estratégia de busca aleatória é selecionada como o algoritmo.

Um ponto-chave a notar aqui é que `SupervisedLearningProblem` deve ser definido com `pop_size=None`, e `EvalMonitor` deve ter `topk=1`, pois apenas um único indivíduo está sendo buscado. Uma configuração cuidadosa de hiperparâmetros ajuda a evitar problemas desnecessários.

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
