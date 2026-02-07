---
title: "Guida all'Installazione di EvoX"
order: 2
section: "install"
---

# Guida all'Installazione di EvoX

## Installare EvoX

EvoX è disponibile su PyPI e può essere installato tramite:

```bash
# installa prima pytorch
# ad esempio:
pip install torch

# poi installa EvoX
pip install "evox[default]"
```

Puoi anche assegnare opzioni extra durante l'installazione, gli extra attualmente disponibili sono `vis`, `neuroevolution`, `test`, `docs`, `default`. Ad esempio, per installare EvoX con tutte le funzionalità, esegui il seguente comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Installare PyTorch con supporto acceleratore

`evox` si basa su `torch` per fornire l'accelerazione hardware.
L'architettura complessiva di questi pacchetti Python è la seguente:

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

In sintesi, se `evox` ha supporto CPU o supporto GPU Nvidia (CUDA) o supporto GPU AMD (ROCm) dipende dalla versione di PyTorch installata. Consulta il sito ufficiale di PyTorch per ulteriore aiuto sull'installazione: [`torch`](https://pytorch.org/)


## Supporto GPU Nvidia su Windows

EvoX supporta l'accelerazione GPU tramite PyTorch.
Ci sono due modi per usare PyTorch con accelerazione GPU su Windows:

1. Usare WSL 2 (Windows Subsystem for Linux) e installare PyTorch sul lato Linux.
2. Installare direttamente PyTorch su Windows.

Per l'opzione 2, forniamo uno [script one-click](/_static/win-install.bat) per il deployment rapido su Windows 10/11 64bit appena installato con GPU Nvidia. Lo script non userà WSL 2 e installerà la versione nativa di Pytorch su Windows. Installerà automaticamente applicazioni correlate come VSCode, Git e MiniForge3.

* Assicurati che il [driver Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) sia installato correttamente prima. Altrimenti lo script passerà alla modalità cpu.
* Quando esegui lo script, assicurati di avere una rete stabile (accessibile a `github.com` ecc.).
* Se lo script fallisce a causa di un errore di rete, chiudilo e riaprilo per continuare l'installazione.

### Installazione manuale su Windows

Se preferisci installare PyTorch direttamente su Windows manualmente, puoi seguire i passaggi seguenti:
1. Installa il driver Nvidia come menzionato sopra.
2. Installa Python 3.10 o superiore da [python.org](https://www.python.org/downloads/).
3. Installa PyTorch.
4. (Opzionale) Installa [`triton-windows`](https://github.com/woct0rdho/triton-windows) per il supporto `torch.compile` su Windows.
5. Installa EvoX.

### Windows WSL 2

Scarica l'[ultimo driver GPU NVIDIA per Windows](https://www.nvidia.com/Download/index.aspx?lang=en-us) e installalo. Poi il tuo WSL 2 supporterà le GPU Nvidia nei suoi ambienti Linux.

> **Attenzione:**
> **NON** installare alcun driver GPU Linux NVIDIA all'interno di WSL 2. Installa il driver sul lato Windows.

```{seealso}
NVIDIA ha una dettagliata [Guida Utente CUDA su WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## Supporto GPU AMD (ROCm)

Consigliamo di usare un container Docker da [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Verifica dell'installazione

Apri un terminale Python ed esegui il seguente:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
