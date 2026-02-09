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

Você também pode atribuir opções extras durante a instalação; os extras disponíveis atualmente são `vis`, `neuroevolution`, `test`, `docs`, `default`. Por exemplo, para instalar o EvoX com todos os recursos, execute o seguinte comando:

```bash
pip install "evox[vis,neuroevolution]"
```

## Instalar o PyTorch com suporte a aceleradores

O `evox` depende do `torch` para fornecer aceleração de hardware.
A arquitetura geral desses pacotes Python se parece com isto:

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

Em resumo, se o `evox` terá suporte a CPU, suporte a GPU Nvidia (CUDA) ou suporte a GPU AMD (ROCm) depende da versão instalada do PyTorch. Consulte o site oficial do PyTorch para obter mais ajuda com a instalação: [`torch`](https://pytorch.org/)


## Suporte a GPU Nvidia no Windows

O EvoX suporta aceleração por GPU através do PyTorch.
Existem duas maneiras de usar o PyTorch com aceleração por GPU no Windows:

1. Usando o WSL 2 (Windows Subsystem for Linux) e instalando o PyTorch no lado do Linux.
2. Instalando o PyTorch diretamente no Windows.

Para a opção 2, fornecemos um [script de um clique](/_static/win-install.bat) para implantação rápida em sistemas Windows 10/11 de 64 bits recém-instalados com GPUs Nvidia. O script não usará o WSL 2 e instalará a versão nativa do PyTorch no Windows. Ele instalará automaticamente aplicativos relacionados, como VSCode, Git e MiniForge3.

* Certifique-se de que o [driver da Nvidia](https://www.nvidia.com/Download/index.aspx?lang=en-us) esteja instalado corretamente primeiro. Caso contrário, o script voltará para o modo cpu.
* Ao executar o script, certifique-se de ter uma rede estável (com acesso ao `github.com`, etc.).
* Se o script falhar devido a uma falha de rede, feche-o e abra-o novamente para continuar a instalação.

### Instalação manual no Windows

Se preferir instalar o PyTorch diretamente no Windows manualmente, você pode seguir as etapas abaixo:
1. Instale o driver da Nvidia conforme mencionado acima.
2. Instale o Python 3.10 ou superior em [python.org](https://www.python.org/downloads/).
3. Instale o PyTorch.
4. (Opcional) Instale o [`triton-windows`](https://github.com/woct0rdho/triton-windows) para suporte ao `torch.compile` no Windows.
5. Instale o EvoX.

### Windows WSL 2

Baixe o [driver de GPU NVIDIA para Windows mais recente](https://www.nvidia.com/Download/index.aspx?lang=en-us) e instale-o. Assim, seu WSL 2 suportará GPUs Nvidia em seus ambientes Linux.

> **Aviso:**
> **NÃO** instale nenhum driver Linux de GPU NVIDIA dentro do WSL 2. Instale o driver no lado do Windows.

```{seealso}
A NVIDIA possui um [Guia do Usuário de CUDA no WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) detalhado.
```

## Suporte a GPU AMD (ROCm)

Recomendamos o uso de um contêiner Docker de [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch).

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