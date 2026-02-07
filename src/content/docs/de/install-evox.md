---
title: "EvoX-Installationsanleitung"
order: 2
section: "install"
---

# EvoX-Installationsanleitung

## EvoX installieren

EvoX ist auf PyPI verfügbar und kann installiert werden über:

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

Sie können auch zusätzliche Optionen während der Installation angeben. Derzeit verfügbare Extras sind `vis`, `neuroevolution`, `test`, `docs`, `default`. Um beispielsweise EvoX mit allen Funktionen zu installieren, führen Sie den folgenden Befehl aus:

```bash
pip install "evox[vis,neuroevolution]"
```

## PyTorch mit Beschleuniger-Unterstützung installieren

`evox` basiert auf `torch` für Hardware-Beschleunigung.
Die Gesamtarchitektur dieser Python-Pakete sieht wie folgt aus:

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

Zusammenfassend hängt es von der installierten PyTorch-Version ab, ob `evox` CPU-Unterstützung oder Nvidia-GPU-Unterstützung (CUDA) oder AMD-GPU-Unterstützung (ROCm) hat. Bitte beziehen Sie sich auf die offizielle PyTorch-Website für weitere Installationshilfe: [`torch`](https://pytorch.org/)


## Nvidia-GPU-Unterstützung unter Windows

EvoX unterstützt GPU-Beschleunigung über PyTorch.
Es gibt zwei Möglichkeiten, PyTorch mit GPU-Beschleunigung unter Windows zu verwenden:

1. Verwendung von WSL 2 (Windows Subsystem for Linux) und Installation von PyTorch auf der Linux-Seite.
2. Direkte Installation von PyTorch unter Windows.

Für Option 2 bieten wir ein [Ein-Klick-Skript](/_static/win-install.bat) für die schnelle Bereitstellung auf frisch installiertem Windows 10/11 64-Bit mit Nvidia-GPUs. Das Skript verwendet kein WSL 2 und installiert die native PyTorch-Version unter Windows. Es installiert automatisch zugehörige Anwendungen wie VSCode, Git und MiniForge3.

* Stellen Sie sicher, dass der [Nvidia-Treiber](https://www.nvidia.com/Download/index.aspx?lang=en-us) zuerst ordnungsgemäß installiert ist. Andernfalls fällt das Skript auf den CPU-Modus zurück.
* Stellen Sie beim Ausführen des Skripts eine stabile Netzwerkverbindung sicher (Zugang zu `github.com` usw.).
* Wenn das Skript aufgrund eines Netzwerkfehlers fehlschlägt, schließen Sie es und öffnen Sie es erneut, um die Installation fortzusetzen.

### Manuelle Installation unter Windows

Wenn Sie PyTorch lieber manuell direkt unter Windows installieren möchten, können Sie die folgenden Schritte befolgen:
1. Installieren Sie den Nvidia-Treiber wie oben erwähnt.
2. Installieren Sie Python 3.10 oder höher von [python.org](https://www.python.org/downloads/).
3. Installieren Sie PyTorch.
4. (Optional) Installieren Sie [`triton-windows`](https://github.com/woct0rdho/triton-windows) für `torch.compile`-Unterstützung unter Windows.
5. Installieren Sie EvoX.

### Windows WSL 2

Laden Sie den [neuesten NVIDIA Windows GPU-Treiber](https://www.nvidia.com/Download/index.aspx?lang=en-us) herunter und installieren Sie ihn. Dann unterstützt Ihr WSL 2 Nvidia-GPUs in seinen Linux-Umgebungen.

> **Warnung:**
> Installieren Sie **KEINEN** NVIDIA GPU Linux-Treiber innerhalb von WSL 2. Installieren Sie den Treiber auf der Windows-Seite.

```{seealso}
NVIDIA hat einen detaillierten [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## AMD-GPU (ROCm)-Unterstützung

Wir empfehlen die Verwendung eines Docker-Containers von [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Installation überprüfen

Öffnen Sie ein Python-Terminal und führen Sie Folgendes aus:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
