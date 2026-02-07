---
title: "Нейроэволюция для машинного обучения"
order: 12
section: "examples"
---

# Нейроэволюция для машинного обучения

EvoX предоставляет решения для задач обучения с учителем на основе нейроэволюции, с ключевыми модулями `SupervisedLearningProblem` и `ParamsAndVector`. На примере задачи классификации MNIST этот раздел иллюстрирует процесс нейроэволюции для обучения с учителем с использованием модулей EvoX.

## Базовая настройка

Импорт базовых компонентов и настройка устройства являются необходимыми начальными шагами для процесса нейроэволюции.

Здесь, для обеспечения воспроизводимости результатов, можно опционально установить случайное зерно.

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

На этом шаге образец свёрточной нейронной сети (CNN) определяется непосредственно на основе фреймворка PyTorch и затем загружается на устройство.

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
Настройка набора данных подразумевает выбор задачи. Загрузчик данных теперь необходимо инициализировать на основе встроенной поддержки PyTorch.
Здесь пакет `torchvision` должен быть предварительно установлен в зависимости от вашей версии PyTorch, если он ещё не доступен.

Если набор данных MNIST ещё не присутствует в каталоге `data_root`, флаг `download=True` установлен для автоматической загрузки набора данных. Поэтому настройка может занять некоторое время при первом запуске.

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

Для ускорения последующих процессов все данные MNIST предварительно загружаются для более быстрого выполнения. Ниже три набора данных предварительно загружаются для различных этапов — обучение градиентным спуском, тонкая настройка нейроэволюцией и тестирование модели.

Следует отметить, что это опциональная операция, которая обменивает пространство на время. Её применение зависит от ёмкости вашего GPU, и подготовка всегда займёт некоторое время.

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

Здесь предварительно определена функция `model_test` для упрощения оценки точности предсказаний модели на тестовом наборе данных на последующих этапах.

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
## Обучение градиентным спуском (опционально)

Сначала выполняется обучение модели на основе градиентного спуска. В этом примере это обучение используется для инициализации модели, подготавливая её к последующим процессам нейроэволюции.

Процесс обучения модели в PyTorch совместим с нейроэволюцией в EvoX, что удобно для повторного использования той же реализации модели на дальнейших этапах.

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

## Тонкая настройка нейроэволюцией

На основе предварительно обученной модели из предыдущего процесса градиентного спуска нейроэволюция постепенно применяется для тонкой настройки модели.

Сначала компонент `ParamsAndVector` используется для преобразования весов предварительно обученной модели в вектор, который служит начальным центральным индивидом для последующего процесса нейроэволюции.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> В случае алгоритмов, специально разработанных для нейроэволюции, которые могут напрямую принимать словарь пакетных параметров в качестве входных данных, использование `ParamsAndVector` может быть необязательным.

Кроме того, определяется образец критерия. Здесь и потери, и точность индивидуальной модели выбираются и взвешиваются для использования в качестве функции приспособленности в процессе нейроэволюции. Этот шаг настраивается в соответствии с направлением оптимизации.

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
Одновременно, аналогично процессам обучения градиентным спуском и тестирования модели, процесс тонкой настройки нейроэволюцией также инкапсулирован в функцию для удобного использования на последующих этапах.

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

### Тест популяционной нейроэволюции

В этом примере сначала тестируется популяционный алгоритм для нейроэволюции, используя оптимизацию роем частиц ([PSO](#evox.algorithms.so.pso_variants.pso.PSO)) в качестве представителя. Конфигурация для нейроэволюции аналогична другим задачам оптимизации — нам нужно определить задачу, алгоритм, монитор и рабочий процесс, а также их соответствующие функции `setup()` для завершения инициализации.

Ключевой момент — размер популяции (`POP_SIZE` в данном случае) должен быть инициализирован **как в задаче, так и в алгоритме** для избежания потенциальных ошибок.

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
### Тест нейроэволюции с одним индивидом

Далее тестируется нейроэволюция на основе алгоритма с одним индивидом. Аналогично популяционному случаю, нам нужно определить задачу, алгоритм, монитор и рабочий процесс, а также вызвать их соответствующие функции `setup()` при инициализации. В данном случае в качестве алгоритма выбрана стратегия случайного поиска.

Ключевой момент — `SupervisedLearningProblem` должен быть установлен с `pop_size=None`, а `EvalMonitor` должен иметь `topk=1`, так как ищется только один индивид. Тщательная настройка гиперпараметров помогает избежать ненужных проблем.

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
