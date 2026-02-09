---
title: "Guia de Instalação do EvoX"
order: 2
section: "install"
---

# Guia de Instalação do EvoX

## Instalar o EvoX

O EvoX está disponível no PyPI e pode ser instalado através de:

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

Também pode atribuir opções extra durante a instalação; os extras atualmente disponíveis são `vis`, `neuroevolution`, `test`, `docs`, `default`. Por exemplo, para instalar o EvoX com todas as funcionalidades, execute o seguinte comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Instalar o PyTorch com suporte para aceleradores

O `evox` depende do `torch` para fornecer aceleração de hardware.
A arquitetura geral destes pacotes Python é a seguinte:

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

Em resumo, o facto de o `evox` ter suporte para CPU, suporte para GPU Nvidia (CUDA) ou suporte para GPU AMD (ROCm) depende da versão do PyTorch instalada. Consulte o website oficial do PyTorch para obter mais ajuda na instalação: [`torch`](https://pytorch.org/)


## Suporte para GPU Nvidia no Windows

O EvoX suporta aceleração por GPU através do PyTorch.
Existem duas formas de utilizar o PyTorch com aceleração por GPU no Windows:

1. Utilizar o WSL 2 (Windows Subsystem for Linux) e instalar o PyTorch no lado do Linux.
2. Instalar o PyTorch diretamente no Windows.

Para a opção 2, fornecemos um [script de um clique](/_static/win-install.bat) para uma implementação rápida em sistemas Windows 10/11 de 64 bits recém-instalados com GPUs Nvidia. O script não utilizará o WSL 2 e instalará a versão nativa do Pytorch no Windows. Instalará automaticamente aplicações relacionadas, como o VSCode, Git e MiniForge3.

* Certifique-se de que o [driver da Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) está devidamente instalado primeiro. Caso contrário, o script reverterá para o modo cpu.
* Ao executar o script, assegure uma ligação de rede estável (com acesso a `github.com`, etc.).
* Se o script falhar devido a uma falha de rede, feche-o e abra-o novamente para continuar a instalação.

### Instalação manual no Windows

Se preferir instalar o PyTorch diretamente no Windows de forma manual, pode seguir os passos abaixo:
1. Instale o driver da Nvidia conforme mencionado acima.
2. Instale o Python 3.10 ou superior a partir de [python.org](https://www.python.org/downloads/).
3. Instale o PyTorch.
4. (Opcional) Instale [`triton-windows`](https://github.com/woct0rdho/triton-windows) para suporte de `torch.compile` no Windows.
5. Instale o EvoX.

### Windows WSL 2

Descarregue o [NVIDIA Windows GPU Driver mais recente](https://www.nvidia.com/Download/index.aspx?lang=en-us) e instale-o. Assim, o seu WSL 2 suportará GPUs Nvidia nos seus ambientes Linux.

> **Aviso:**
> **NÃO** instale nenhum driver Linux para GPU NVIDIA dentro do WSL 2. Instale o driver no lado do Windows.

```{seealso}
A NVIDIA possui um [Guia do Utilizador detalhado sobre CUDA no WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) (em inglês).
```

## Suporte para GPU AMD (ROCm)

Recomendamos a utilização de um contentor Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## Verificar a instalação

Abra um terminal Python e execute o seguinte:

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```