---
title: "EvoX Installationsanleitung"
order: 2
section: "install"
---

# EvoX Installationsanleitung

## EvoX installieren

EvoX ist auf PyPI verfügbar und kann wie folgt installiert werden:

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

Sie können während der Installation auch zusätzliche Optionen zuweisen. Derzeit verfügbare Extras sind `vis`, `neuroevolution`, `test`, `docs`, `default`. Um beispielsweise EvoX mit allen Funktionen zu installieren, führen Sie den folgenden Befehl aus:

```bash
pip install "evox[vis,neuroevolution]"
```

## PyTorch mit Beschleuniger-Unterstützung installieren

`evox` verlässt sich auf `torch`, um Hardwarebeschleunigung bereitzustellen.
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

Zusammenfassend lässt sich sagen, dass die Unterstützung von `evox` für CPU, Nvidia GPU (CUDA) oder AMD GPU (ROCm) von der installierten PyTorch-Version abhängt. Bitte besuchen Sie die offizielle PyTorch-Website für weitere Installationshilfen: [`torch`](https://pytorch.org/)


## Nvidia GPU-Unterstützung unter Windows

EvoX unterstützt GPU-Beschleunigung durch PyTorch.
Es gibt zwei Möglichkeiten, PyTorch mit GPU-Beschleunigung unter Windows zu verwenden:

1. Verwendung von WSL 2 (Windows Subsystem for Linux) und Installation von PyTorch auf der Linux-Seite.
2. Direkte Installation von PyTorch unter Windows.

Für Option 2 stellen wir ein [One-Click-Skript](/_static/win-install.bat) für die schnelle Bereitstellung auf frisch installierten Windows 10/11 64-Bit-Systemen mit Nvidia GPUs zur Verfügung. Das Skript verwendet kein WSL 2 und installiert die native PyTorch-Version unter Windows. Es installiert automatisch verwandte Anwendungen wie VSCode, Git und MiniForge3.

* Stellen Sie sicher, dass der [Nvidia-Treiber](https://www.nvidia.com/Download/index.aspx?lang=en-us) zuerst ordnungsgemäß installiert ist. Andernfalls fällt das Skript in den CPU-Modus zurück.
* Stellen Sie beim Ausführen des Skripts eine stabile Netzwerkverbindung sicher (Zugriff auf `github.com` usw.).
* Wenn das Skript aufgrund eines Netzwerkfehlers fehlschlägt, schließen Sie es und öffnen Sie es erneut, um die Installation fortzusetzen.

### Manuelle Installation unter Windows

Wenn Sie es vorziehen, PyTorch manuell direkt unter Windows zu installieren, können Sie die folgenden Schritte ausführen:
1. Installieren Sie den Nvidia-Treiber wie oben erwähnt.
2. Installieren Sie Python 3.10 oder höher von [python.org](https://www.python.org/downloads/).
3. Installieren Sie PyTorch.
4. (Optional) Installieren Sie [`triton-windows`](https://github.com/woct0rdho/triton-windows) für `torch.compile`-Unterstützung unter Windows.
5. Installieren Sie EvoX.

### Windows WSL 2

Laden Sie den [neuesten NVIDIA Windows GPU-Treiber](https://www.nvidia.com/Download/index.aspx?lang=en-us) herunter und installieren Sie ihn. Dann unterstützt Ihr WSL 2 Nvidia GPUs in seinen Linux-Umgebungen.

> **Warnung:**
> Installieren Sie **KEINEN** NVIDIA GPU Linux-Treiber innerhalb von WSL 2. Installieren Sie den Treiber auf der Windows-Seite.

```{seealso}
NVIDIA bietet ein detailliertes [Benutzerhandbuch für CUDA auf WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## AMD GPU (ROCm) Unterstützung

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