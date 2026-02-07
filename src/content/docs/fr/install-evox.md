---
title: "Guide d'installation d'EvoX"
order: 2
section: "install"
---

# Guide d'installation d'EvoX

## Installer EvoX

EvoX est disponible sur PyPI et peut être installé via :

```bash
# installer pytorch d'abord
# par exemple :
pip install torch

# puis installer EvoX
pip install "evox[default]"
```

Vous pouvez également spécifier des options supplémentaires lors de l'installation, les extras actuellement disponibles sont `vis`, `neuroevolution`, `test`, `docs`, `default`. Par exemple, pour installer EvoX avec toutes les fonctionnalités, exécutez la commande suivante :

```bash
pip install "evox[vis,neuroevolution]"
```

## Installer PyTorch avec support d'accélérateur

`evox` s'appuie sur `torch` pour fournir l'accélération matérielle.
L'architecture globale de ces paquets Python ressemble à ceci :

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

En résumé, le support CPU, le support GPU Nvidia (CUDA) ou le support GPU AMD (ROCm) d'`evox` dépend de la version de PyTorch installée. Veuillez consulter le site officiel de PyTorch pour plus d'aide à l'installation : [`torch`](https://pytorch.org/)


## Support GPU Nvidia sur Windows

EvoX supporte l'accélération GPU via PyTorch.
Il existe deux façons d'utiliser PyTorch avec l'accélération GPU sur Windows :

1. Utiliser WSL 2 (Windows Subsystem for Linux) et installer PyTorch côté Linux.
2. Installer directement PyTorch sur Windows.

Pour l'option 2, nous fournissons un [script en un clic](/_static/win-install.bat) pour un déploiement rapide sur Windows 10/11 64 bits fraîchement installé avec des GPU Nvidia. Le script n'utilisera pas WSL 2 et installera la version native de Pytorch sur Windows. Il installera automatiquement les applications associées comme VSCode, Git et MiniForge3.

* Assurez-vous que le [pilote Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) est correctement installé au préalable. Sinon, le script basculera en mode CPU.
* Lors de l'exécution du script, assurez-vous d'avoir un réseau stable (accessible à `github.com` etc.).
* Si le script échoue en raison d'une défaillance réseau, fermez-le et rouvrez-le pour continuer l'installation.

### Installation manuelle sur Windows

Si vous préférez installer PyTorch directement sur Windows manuellement, vous pouvez suivre les étapes ci-dessous :
1. Installez le pilote Nvidia comme mentionné ci-dessus.
2. Installez Python 3.10 ou supérieur depuis [python.org](https://www.python.org/downloads/).
3. Installez PyTorch.
4. (Optionnel) Installez [`triton-windows`](https://github.com/woct0rdho/triton-windows) pour le support de `torch.compile` sur Windows.
5. Installez EvoX.

### Windows WSL 2

Téléchargez le [dernier pilote GPU NVIDIA Windows](https://www.nvidia.com/Download/index.aspx?lang=en-us) et installez-le. Ensuite, votre WSL 2 supportera les GPU Nvidia dans ses environnements Linux.

> **Avertissement :**
> **N'installez PAS** de pilote GPU Linux NVIDIA dans WSL 2. Installez le pilote côté Windows.

```{seealso}
NVIDIA a un [Guide utilisateur CUDA sur WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) détaillé
```

## Support GPU AMD (ROCm)

Nous recommandons d'utiliser un conteneur Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Vérifier l'installation

Ouvrez un terminal Python et exécutez ce qui suit :

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
