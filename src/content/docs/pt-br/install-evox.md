---
title: "Guia de Instalação do EvoX"
order: 2
section: "install"
---

# Guia de Instalação do EvoX

## Instalar o EvoX

O EvoX está disponível no PyPI e pode ser instalado via:

```bash
# instale o pytorch primeiro
# por exemplo:
pip install torch

# depois instale o EvoX
pip install "evox[default]"
```

Você também pode atribuir opções extras durante a instalação. Os extras atualmente disponíveis são `vis`, `neuroevolution`, `test`, `docs`, `default`. Por exemplo, para instalar o EvoX com todos os recursos, execute o seguinte comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Instalar o PyTorch com suporte a acelerador

O `evox` depende do `torch` para fornecer aceleração de hardware.
A arquitetura geral desses pacotes Python é assim:

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

Em resumo, se o `evox` tem suporte a CPU ou suporte a GPU Nvidia (CUDA) ou suporte a GPU AMD (ROCm) depende da versão do PyTorch instalada. Consulte o site oficial do PyTorch para mais ajuda com a instalação: [`torch`](https://pytorch.org/)


## Suporte a GPU Nvidia no Windows

O EvoX suporta aceleração por GPU através do PyTorch.
Existem duas formas de usar o PyTorch com aceleração por GPU no Windows:

1. Usando WSL 2 (Subsistema Windows para Linux) e instalar o PyTorch no lado Linux.
2. Instalar o PyTorch diretamente no Windows.

Para a opção 2, fornecemos um [script de um clique](/_static/win-install.bat) para implantação rápida em Windows 10/11 64 bits recém-instalado com GPUs Nvidia. O script não usará WSL 2 e instalará a versão nativa do Pytorch no Windows. Ele instalará automaticamente aplicativos relacionados como VSCode, Git e MiniForge3.

* Certifique-se de que o [driver Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) esteja instalado corretamente primeiro. Caso contrário, o script voltará ao modo CPU.
* Ao executar o script, garanta uma rede estável (acessível a `github.com` etc.).
* Se o script falhar devido a falha de rede, feche e reabra para continuar a instalação.

### Instalação manual no Windows

Se você preferir instalar o PyTorch diretamente no Windows manualmente, pode seguir os passos abaixo:
1. Instale o driver Nvidia conforme mencionado acima.
2. Instale o Python 3.10 ou superior de [python.org](https://www.python.org/downloads/).
3. Instale o PyTorch.
4. (Opcional) Instale o [`triton-windows`](https://github.com/woct0rdho/triton-windows) para suporte ao `torch.compile` no Windows.
5. Instale o EvoX.

### Windows WSL 2

Baixe o [driver GPU NVIDIA mais recente para Windows](https://www.nvidia.com/Download/index.aspx?lang=en-us) e instale-o. Então seu WSL 2 suportará GPUs Nvidia em seus ambientes Linux.

> **Aviso:**
> **NÃO** instale nenhum driver GPU Linux da NVIDIA dentro do WSL 2. Instale o driver no lado do Windows.

```{seealso}
A NVIDIA tem um [Guia do Usuário CUDA no WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) detalhado
```

## Suporte a GPU AMD (ROCm)

Recomendamos usar um container Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

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
