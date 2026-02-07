---
title: "Guia de Instalacion de EvoX"
order: 2
section: "install"
---

# Guia de Instalacion de EvoX

## Instalar EvoX

EvoX esta disponible en PyPI y se puede instalar mediante:

```bash
# instalar pytorch primero
# por ejemplo:
pip install torch

# luego instalar EvoX
pip install "evox[default]"
```

Tambien puede asignar opciones extras durante la instalacion, los extras actualmente disponibles son `vis`, `neuroevolution`, `test`, `docs`, `default`. Por ejemplo, para instalar EvoX con todas las caracteristicas, ejecute el siguiente comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Instalar PyTorch con soporte de acelerador

`evox` depende de `torch` para proporcionar aceleracion por hardware.
La arquitectura general de estos paquetes Python se ve asi:

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

En resumen, si `evox` tiene soporte para CPU o soporte para GPU Nvidia (CUDA) o soporte para GPU AMD (ROCm) depende de la version de PyTorch instalada. Consulte el sitio web oficial de PyTorch para mas ayuda con la instalacion: [`torch`](https://pytorch.org/)


## Soporte de GPU Nvidia en Windows

EvoX soporta aceleracion por GPU a traves de PyTorch.
Hay dos formas de usar PyTorch con aceleracion por GPU en Windows:

1. Usando WSL 2 (Subsistema de Windows para Linux) e instalar PyTorch en el lado de Linux.
2. Instalar PyTorch directamente en Windows.

Para la opcion 2, proporcionamos un [script de un clic](/_static/win-install.bat) para despliegue rapido en Windows 10/11 64 bits recien instalado con GPUs Nvidia. El script no usara WSL 2 e instalara la version nativa de Pytorch en Windows. Instalara automaticamente aplicaciones relacionadas como VSCode, Git y MiniForge3.

* Asegurese de que el [controlador Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) este correctamente instalado primero. De lo contrario, el script recurrira al modo CPU.
* Al ejecutar el script, asegure una red estable (accesible a `github.com` etc.).
* Si el script falla debido a un fallo de red, cierrelo y vuelva a abrirlo para continuar la instalacion.

### Instalacion manual en Windows

Si prefiere instalar PyTorch directamente en Windows manualmente, puede seguir los pasos a continuacion:
1. Instale el controlador Nvidia como se menciono anteriormente.
2. Instale Python 3.10 o superior desde [python.org](https://www.python.org/downloads/).
3. Instale PyTorch.
4. (Opcional) Instale [`triton-windows`](https://github.com/woct0rdho/triton-windows) para soporte de `torch.compile` en Windows.
5. Instale EvoX.

### Windows WSL 2

Descargue el [ultimo controlador de GPU NVIDIA para Windows](https://www.nvidia.com/Download/index.aspx?lang=en-us) e instalelo. Luego su WSL 2 soportara GPUs Nvidia en sus entornos Linux.

> **Advertencia:**
> **NO** instale ningun controlador de GPU Linux de NVIDIA dentro de WSL 2. Instale el controlador en el lado de Windows.

```{seealso}
NVIDIA tiene una [Guia de Usuario de CUDA en WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) detallada
```

## Soporte de GPU AMD (ROCm)

Recomendamos usar un contenedor Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Verificar la instalacion

Abra una terminal de Python y ejecute lo siguiente:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
