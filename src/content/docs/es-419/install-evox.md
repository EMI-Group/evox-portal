---
title: "Guía de instalación de EvoX"
order: 2
section: "install"
---

# Guía de instalación de EvoX

## Instalar EvoX

EvoX está disponible en PyPI y se puede instalar a través de:

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

También puedes asignar opciones adicionales durante la instalación; los extras disponibles actualmente son `vis`, `neuroevolution`, `test`, `docs`, `default`. Por ejemplo, para instalar EvoX con todas las funciones, ejecuta el siguiente comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Instalar PyTorch con soporte de aceleración

`evox` depende de `torch` para proporcionar aceleración de hardware.
La arquitectura general de estos paquetes de Python se ve así:

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

En resumen, el hecho de que `evox` tenga soporte para CPU, soporte para GPU Nvidia (CUDA) o soporte para GPU AMD (ROCm) depende de la versión de PyTorch instalada. Consulta el sitio web oficial de PyTorch para obtener más ayuda con la instalación: [`torch`](https://pytorch.org/)


## Soporte para GPU Nvidia en Windows

EvoX admite la aceleración por GPU a través de PyTorch.
Hay dos formas de usar PyTorch con aceleración por GPU en Windows:

1. Usar WSL 2 (Windows Subsystem for Linux) e instalar PyTorch en el lado de Linux.
2. Instalar PyTorch directamente en Windows.

Para la opción 2, proporcionamos un [script de un solo clic](/_static/win-install.bat) para una implementación rápida en instalaciones limpias de Windows 10/11 de 64 bits con GPUs Nvidia. El script no utilizará WSL 2 e instalará la versión nativa de PyTorch en Windows. Instalará automáticamente aplicaciones relacionadas como VSCode, Git y MiniForge3.

* Asegúrate de que el [Nvidia driver](https://www.nvidia.com/Download/index.aspx?lang=en-us) esté correctamente instalado primero. De lo contrario, el script volverá al modo cpu.
* Al ejecutar el script, asegúrate de tener una red estable (con acceso a `github.com`, etc.).
* Si el script falla debido a un error de red, ciérralo y vuelve a abrirlo para continuar con la instalación.

### Instalación manual en Windows

Si prefieres instalar PyTorch directamente en Windows de forma manual, puedes seguir los pasos a continuación:
1. Instala el Nvidia driver como se mencionó anteriormente.
2. Instala Python 3.10 o superior desde [python.org](https://www.python.org/downloads/).
3. Instala PyTorch.
4. (Opcional) Instala [`triton-windows`](https://github.com/woct0rdho/triton-windows) para soporte de `torch.compile` en Windows.
5. Instala EvoX.

### Windows WSL 2

Descarga el [NVIDIA Windows GPU Driver más reciente](https://www.nvidia.com/Download/index.aspx?lang=en-us) e instálalo. Luego, tu WSL 2 admitirá GPUs Nvidia en sus entornos Linux.

> **Advertencia:**
> **NO** instales ningún driver de GPU Nvidia para Linux dentro de WSL 2. Instala el driver en el lado de Windows.

```{seealso}
NVIDIA tiene una [Guía de usuario de CUDA en WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) detallada.
```

## Soporte para GPU AMD (ROCm)

Recomendamos usar un contenedor Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Verificar la instalación

Abre una terminal de Python y ejecuta lo siguiente:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```