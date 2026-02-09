---
title: "머신러닝을 위한 신경진화"
order: 12
section: "examples"
---

# 머신러닝을 위한 신경진화

EvoX는 `SupervisedLearningProblem` 및 `ParamsAndVector`와 같은 주요 모듈을 통해 신경진화(neuroevolution) 기반의 지도 학습(supervised learning) 작업을 위한 솔루션을 제공합니다. 이 섹션에서는 MNIST 분류 작업을 예로 들어, EvoX 모듈을 활용한 지도 학습의 신경진화 과정을 설명합니다.

## 기본 설정

기본 컴포넌트 임포트와 디바이스 설정은 신경진화 과정의 필수적인 시작 단계입니다.

여기서는 결과의 재현성을 보장하기 위해 선택적으로 랜덤 시드(random seed)를 설정할 수 있습니다.

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

이 단계에서는 PyTorch 프레임워크를 기반으로 샘플 합성곱 신경망(CNN) 모델을 직접 정의한 다음 디바이스에 로드합니다.

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

데이터셋 설정은 작업(task)의 선택을 의미합니다. 이제 PyTorch의 내장 기능을 기반으로 데이터 로더를 초기화해야 합니다.
여기서 `torchvision` 패키지가 아직 없다면, 사용 중인 PyTorch 버전에 맞춰 미리 설치해야 합니다.

MNIST 데이터셋이 `data_root` 디렉토리에 없는 경우, `download=True` 플래그를 설정하여 데이터셋이 자동으로 다운로드되도록 합니다. 따라서 첫 실행 시 설정에 시간이 다소 걸릴 수 있습니다.

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

이후 프로세스를 가속화하기 위해, 모든 MNIST 데이터를 미리 로드하여 실행 속도를 높입니다. 아래에서는 경사 하강법(gradient descent) 학습, 신경진화 미세 조정(fine-tuning), 모델 테스트의 세 가지 단계를 위해 세 개의 데이터셋을 미리 로드합니다.

이는 공간을 시간과 맞바꾸는 선택적인 작업이라는 점에 유의해야 합니다. 이 방식의 채택 여부는 GPU 용량에 따라 달라지며, 준비하는 데 항상 약간의 시간이 소요됩니다.

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

여기서는 이후 단계에서 테스트 데이터셋에 대한 모델의 예측 정확도를 간편하게 평가하기 위해 `model_test` 함수를 미리 정의합니다.

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

## 경사 하강법 학습 (선택 사항)

먼저 경사 하강법 기반의 모델 학습을 수행합니다. 이 예제에서는 이 학습을 통해 모델을 초기화하고, 이후의 신경진화 과정을 준비합니다.

PyTorch의 모델 학습 과정은 EvoX의 신경진화와 호환되므로, 동일한 모델 구현을 후속 단계에서 재사용하기 편리합니다.

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

## 신경진화 미세 조정 (Fine-Tuning)

이전 경사 하강법 과정에서 사전 학습된 모델을 바탕으로, 신경진화를 점진적으로 적용하여 모델을 미세 조정합니다.

먼저 `ParamsAndVector` 컴포넌트를 사용하여 사전 학습된 모델의 가중치를 벡터로 평탄화(flatten)하며, 이는 이후 신경진화 과정의 초기 중심 개체(center individual) 역할을 합니다.

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> 배치(batched) 파라미터 딕셔너리를 입력으로 직접 받을 수 있도록 설계된 신경진화 알고리즘의 경우, `ParamsAndVector`의 사용이 불필요할 수 있습니다.

추가로 샘플 기준(criterion)을 정의합니다. 여기서는 개별 모델의 손실(loss)과 정확도(accuracy)를 모두 선택하고 가중치를 부여하여 신경진화 과정의 적합도 함수(fitness function)로 사용합니다. 이 단계는 최적화 방향에 맞춰 사용자 정의할 수 있습니다.

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

동시에, 경사 하강법 학습 및 모델 테스트 과정과 유사하게, 신경진화 미세 조정 과정도 이후 단계에서 편리하게 사용할 수 있도록 함수로 캡슐화합니다.

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

### 개체군 기반 신경진화 테스트

이 예제에서는 입자 군집 최적화(Particle Swarm Optimization, [PSO](#evox.algorithms.so.pso_variants.pso.PSO))를 대표로 사용하여 개체군 기반 신경진화 알고리즘을 먼저 테스트합니다. 신경진화 설정은 다른 최적화 작업과 유사합니다. 문제(problem), 알고리즘(algorithm), 모니터(monitor), 워크플로우(workflow)를 정의하고 각각의 `setup()` 함수를 호출하여 초기화를 완료해야 합니다.

여기서 주의할 점은 잠재적인 오류를 방지하기 위해 개체군 크기(이 경우 `POP_SIZE`)를 **문제와 알고리즘 모두**에서 초기화해야 한다는 것입니다.

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

### 단일 개체 신경진화 테스트

다음으로 단일 개체 알고리즘 기반의 신경진화를 테스트합니다. 개체군 기반의 경우와 마찬가지로 문제, 알고리즘, 모니터, 워크플로우를 정의하고 초기화 시 각각의 `setup()` 함수를 호출해야 합니다. 이 경우 알고리즘으로 무작위 탐색(random search) 전략을 선택했습니다.

여기서 주의할 점은 단 하나의 개체만 탐색하므로 `SupervisedLearningProblem`은 `pop_size=None`으로 설정하고, `EvalMonitor`는 `topk=1`로 설정해야 한다는 것입니다. 신중한 하이퍼파라미터 설정은 불필요한 문제를 피하는 데 도움이 됩니다.

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