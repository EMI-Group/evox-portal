---
title: "Начало работы с EvoX: первый эволюционный процесс"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "Выполните полный эксперимент с EvoX 1.4.1 и узнайте, как задачи, популяции, оценка и выполнение образуют повторно используемый эволюционный процесс."
---

В этом примере PSO минимизирует двумерную функцию Ackley; мы проверим устройство и построим историю поиска. Используются **EvoX 1.4.1 и PyTorch**, а не экспериментальный API 2.x. Небольшая задача объясняет процесс, но не служит тестом производительности GPU.

![Частицы-кандидаты исследуют пространство поиска](./first-search-workflow.webp)

## Изолированная среда

Используйте Python 3.10 или новее. Создайте виртуальную среду и активируйте её командой своей оболочки.

```bash
python -m venv .venv
```

В macOS/Linux:

```bash
source .venv/bin/activate
```

В Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## Установка подходящих пакетов

Выберите команду для своей ОС и оборудования в [официальном установщике PyTorch](https://pytorch.org/get-started/locally/). CUDA требует поддерживаемого драйвера; одна установка EvoX не гарантирует доступность GPU. Затем установите фиксированную версию:

```bash
python -m pip install "evox[vis]==1.4.1"
```

## Полный эксперимент

Сохраните код как сценарий Python. Он выбирает CUDA при наличии, иначе CPU, выводит выбор и размещает состояние и мониторинг на этом устройстве. Фиксированный seed помогает повторению, но результаты могут отличаться между устройствами и версиями.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## Интерпретация и визуализация

PSO хранит кандидатов, Ackley оценивает их, StdWorkflow связывает компоненты, EvalMonitor записывает прогресс. Меньшее значение лучше; теоретический оптимум равен нулю в начале координат. Итог случаен, фиксированный результат не гарантируется.

Выполните следующую команду после поиска в том же процессе. Зависимости визуализации уже включены. Изображение взято из исходного руководства и не гарантирует вывод для данного seed.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## Осмысленное расширение

Меняйте размерность, популяцию или seed по одному. Пользовательская задача должна возвращать значение для каждого кандидата. Многокритериальная оптимизация требует совместимого алгоритма, формы результата и монитора.

Отделяйте компиляцию и прогрев от основного выполнения, синхронизируйте CUDA при измерениях и сравнивайте одинаковые бюджеты оценок. Малые задачи могут быть быстрее на CPU. Изучайте компиляцию после проверки базового запуска.

## Материалы и благодарности

Исходное руководство написали Boqing Xu, Xinmeng Yu, Bowen Zheng и Xinyao Li; редактуру и публикацию выполнил Beichen Huang. Ниже сохранена обзорная иллюстрация.

![EvoX overview](./quickstart-8.png)

Сверяйтесь с [исходным кодом версии](https://github.com/EMI-Group/evox/tree/v1.4.1) и [документацией](https://evox.readthedocs.io/en/latest/). Проверяйте версию перед использованием API из новых материалов.

Перед расширением примера сохраните вместе версии пакетов, устройство, seed и лучшую приспособленность. Меняйте одну настройку и повторяйте тот же бюджет. [Обзор EvoMO](/ru/news/gpu-accelerated-emo) объясняет дополнительные решения для конкурирующих целей.
