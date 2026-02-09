---
title: "Руководство по установке EvoX"
order: 2
section: "install"
---

# Руководство по установке EvoX

## Установка EvoX

EvoX доступен в PyPI и может быть установлен с помощью:

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

Вы также можете указать дополнительные опции во время установки. В настоящее время доступны следующие дополнения: `vis`, `neuroevolution`, `test`, `docs`, `default`. Например, чтобы установить EvoX со всеми функциями, выполните следующую команду:

```bash
pip install "evox[vis,neuroevolution]"
```

## Установка PyTorch с поддержкой ускорителей

`evox` полагается на `torch` для обеспечения аппаратного ускорения.
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

Подводя итог, наличие поддержки CPU, Nvidia GPU (CUDA) или AMD GPU (ROCm) в `evox` зависит от установленной версии PyTorch. Пожалуйста, обратитесь к официальному сайту PyTorch для получения дополнительной помощи по установке: [`torch`](https://pytorch.org/)


## Поддержка Nvidia GPU на Windows

EvoX поддерживает GPU-ускорение через PyTorch.
Существует два способа использования PyTorch с GPU-ускорением на Windows:

1. Использование WSL 2 (Windows Subsystem for Linux) и установка PyTorch на стороне Linux.
2. Прямая установка PyTorch на Windows.

Для варианта 2 мы предоставляем [скрипт установки в один клик](/_static/win-install.bat) для быстрого развертывания на чистых системах Windows 10/11 64-бит с GPU Nvidia. Скрипт не использует WSL 2 и устанавливает нативную версию PyTorch для Windows. Он автоматически установит сопутствующие приложения, такие как VSCode, Git и MiniForge3.

* Сначала убедитесь, что [драйвер Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) установлен правильно. В противном случае скрипт переключится в режим CPU.
* При запуске скрипта обеспечьте стабильное сетевое соединение (доступ к `github.com` и т. д.).
* Если работа скрипта прервалась из-за сбоя сети, закройте и снова откройте его, чтобы продолжить установку.

### Ручная установка на Windows

Если вы предпочитаете установить PyTorch на Windows вручную, вы можете выполнить следующие шаги:
1. Установите драйвер Nvidia, как указано выше.
2. Установите Python 3.10 или выше с [python.org](https://www.python.org/downloads/).
3. Установите PyTorch.
4. (Опционально) Установите [`triton-windows`](https://github.com/woct0rdho/triton-windows) для поддержки `torch.compile` на Windows.
5. Установите EvoX.

### Windows WSL 2

Скачайте [последнюю версию драйвера NVIDIA Windows GPU](https://www.nvidia.com/Download/index.aspx?lang=en-us) и установите её. После этого WSL 2 будет поддерживать GPU Nvidia в среде Linux.

> **Внимание:**
> НЕ устанавливайте драйверы NVIDIA GPU для Linux внутри WSL 2. Устанавливайте драйвер на стороне Windows.

```{seealso}
У NVIDIA есть подробное [руководство пользователя CUDA на WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## Поддержка AMD GPU (ROCm)

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