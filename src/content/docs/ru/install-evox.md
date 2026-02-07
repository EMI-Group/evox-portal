---
title: "Руководство по установке EvoX"
order: 2
section: "install"
---

# Руководство по установке EvoX

## Установка EvoX

EvoX доступен на PyPI и может быть установлен через:

```bash
# сначала установите pytorch
# например:
pip install torch

# затем установите EvoX
pip install "evox[default]"
```

Вы также можете указать дополнительные опции при установке. В настоящее время доступны дополнения `vis`, `neuroevolution`, `test`, `docs`, `default`. Например, чтобы установить EvoX со всеми функциями, выполните следующую команду:

```bash
pip install "evox[vis,neuroevolution]"
```

## Установка PyTorch с поддержкой ускорителей

`evox` использует `torch` для обеспечения аппаратного ускорения.
Общая архитектура этих Python-пакетов выглядит следующим образом:

```{mermaid}
stateDiagram-v2
    torch : torch
    nv_gpu : NVIDIA GPU
    amd_gpu : AMD GPU
    cpu : CPU

    direction LR

    evox --> torch
    torch --> nv_gpu
    torch --> amd_gpu
    torch --> cpu
```

Подводя итог, поддержка CPU, GPU Nvidia (CUDA) или GPU AMD (ROCm) в `evox` зависит от установленной версии PyTorch. Обратитесь к официальному сайту PyTorch для получения дополнительной помощи по установке: [`torch`](https://pytorch.org/)


## Поддержка GPU Nvidia на Windows

EvoX поддерживает ускорение на GPU через PyTorch.
Есть два способа использования PyTorch с ускорением на GPU в Windows:

1. Использование WSL 2 (подсистема Windows для Linux) и установка PyTorch на стороне Linux.
2. Прямая установка PyTorch на Windows.

Для варианта 2 мы предоставляем [скрипт установки в один клик](/_static/win-install.bat) для быстрого развёртывания на свежеустановленных Windows 10/11 64-бит с GPU Nvidia. Скрипт не использует WSL 2 и устанавливает нативную версию Pytorch на Windows. Он автоматически установит связанные приложения, такие как VSCode, Git и MiniForge3.

* Убедитесь, что [драйвер Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) правильно установлен. В противном случае скрипт переключится в режим CPU.
* При запуске скрипта обеспечьте стабильную сеть (доступ к `github.com` и т.д.).
* Если скрипт завершился с ошибкой из-за сбоя сети, закройте и откройте его снова для продолжения установки.

### Ручная установка на Windows

Если вы предпочитаете установить PyTorch на Windows вручную, выполните следующие шаги:
1. Установите драйвер Nvidia, как указано выше.
2. Установите Python 3.10 или выше с [python.org](https://www.python.org/downloads/).
3. Установите PyTorch.
4. (Опционально) Установите [`triton-windows`](https://github.com/woct0rdho/triton-windows) для поддержки `torch.compile` на Windows.
5. Установите EvoX.

### Windows WSL 2

Скачайте [последний драйвер NVIDIA Windows GPU](https://www.nvidia.com/Download/index.aspx?lang=en-us) и установите его. После этого ваш WSL 2 будет поддерживать GPU Nvidia в своих окружениях Linux.

> **Предупреждение:**
> **НЕ** устанавливайте драйвер NVIDIA GPU для Linux внутри WSL 2. Установите драйвер на стороне Windows.

```{seealso}
NVIDIA имеет подробное [Руководство пользователя CUDA на WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## Поддержка GPU AMD (ROCm)

Мы рекомендуем использовать Docker-контейнер из [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Проверка установки

Откройте терминал Python и выполните следующее:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
