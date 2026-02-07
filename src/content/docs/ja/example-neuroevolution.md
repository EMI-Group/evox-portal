---
title: "機械学習のためのニューロエボリューション"
order: 12
section: "examples"
---

# 機械学習のためのニューロエボリューション

EvoXはニューロエボリューションに基づく教師あり学習タスクのソリューションを提供しており、主要なモジュールには`SupervisedLearningProblem`と`ParamsAndVector`が含まれます。MNIST分類タスクを例として、EvoXのモジュールを採用した教師あり学習のニューロエボリューションプロセスを説明します。

## 基本セットアップ

基本的なコンポーネントのインポートとデバイス設定は、ニューロエボリューションプロセスの必須の開始ステップです。

ここでは、結果の再現性を確保するために、オプションでランダムシードを設定できます。

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

このステップでは、PyTorchフレームワーク上でサンプルの畳み込みニューラルネットワーク（CNN）モデルを直接定義し、デバイスにロードします。

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

データセットの設定はタスクの選択を意味します。PyTorchの組み込みサポートに基づいてデータローダーを初期化する必要があります。
ここでは、PyTorchバージョンに応じて、パッケージ`torchvision`を事前にインストールする必要があります（まだ利用できない場合）。

MNISTデータセットが`data_root`ディレクトリにまだ存在しない場合、`download=True`フラグが設定されているため、データセットが自動的にダウンロードされます。そのため、初回実行時にはセットアップに時間がかかる場合があります。

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

後続のプロセスを高速化するために、すべてのMNISTデータを事前にロードします。以下では、勾配降下トレーニング、ニューロエボリューション微調整、モデルテストの3つの異なるステージ用に3つのデータセットを事前にロードします。

これはスペースと時間のトレードオフであるオプションの操作であることに注意してください。採用はGPU容量に依存し、準備には常に時間がかかります。

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

ここでは、後続のステージでテストデータセットに対するモデルの予測精度の評価を簡素化するために、`model_test`関数を事前に定義します。

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

## 勾配降下トレーニング（オプション）

まず勾配降下ベースのモデルトレーニングを実行します。この例では、このトレーニングはモデルを初期化し、後続のニューロエボリューションプロセスに備えるために採用されています。

PyTorchでのモデルトレーニングプロセスはEvoXのニューロエボリューションと互換性があり、さらなるステップで同じモデル実装を再利用するのに便利です。

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

## ニューロエボリューション微調整

前の勾配降下プロセスで事前トレーニングされたモデルに基づいて、ニューロエボリューションを段階的に適用してモデルを微調整します。

まず、`ParamsAndVector`コンポーネントを使用して、事前トレーニングされたモデルの重みをベクトルにフラット化します。これは後続のニューロエボリューションプロセスの初期中心個体として機能します。

```python
adapter = ParamsAndVector(dummy_model=model)
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = pop_center - 0.01
upper_bound = pop_center + 0.01
```

> ニューロエボリューション専用に設計されたアルゴリズムで、バッチ化されたパラメータの辞書を直接入力として受け取れる場合、`ParamsAndVector`の使用は不要になる場合があります。

さらに、サンプルの基準を定義します。ここでは、個々のモデルの損失と精度の両方を選択し、重み付けしてニューロエボリューションプロセスの適応度関数として使用します。このステップは最適化の方向に合わせてカスタマイズ可能です。

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

同時に、勾配降下トレーニングやモデルテストプロセスと同様に、ニューロエボリューション微調整プロセスも後続のステージで便利に使用するために関数にカプセル化されています。

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

### 集団ベースのニューロエボリューションテスト

この例では、まず集団ベースのニューロエボリューションアルゴリズムをテストします。代表として粒子群最適化（[PSO](#evox.algorithms.so.pso_variants.pso.PSO)）を使用します。ニューロエボリューションの設定は他の最適化タスクと同様です。問題、アルゴリズム、モニター、ワークフローを定義し、それぞれの`setup()`関数を呼び出して初期化を完了する必要があります。

ここで注意すべき重要な点は、潜在的なエラーを避けるために、集団サイズ（この場合は`POP_SIZE`）を**問題とアルゴリズムの両方**で初期化する必要があることです。

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

### 単一個体ニューロエボリューションテスト

次に、単一個体アルゴリズムベースのニューロエボリューションをテストします。集団ベースの場合と同様に、問題、アルゴリズム、モニター、ワークフローを定義し、初期化時にそれぞれの`setup()`関数を呼び出す必要があります。この場合、アルゴリズムとしてランダムサーチ戦略を選択します。

ここで注意すべき重要な点は、単一個体のみを探索するため、`SupervisedLearningProblem`は`pop_size=None`に設定し、`EvalMonitor`は`topk=1`にする必要があることです。慎重なハイパーパラメータ設定は不要な問題を避けるのに役立ちます。

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
