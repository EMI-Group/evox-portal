---
title: "2. Instalação e Configuração do Ambiente"
order: 2
---

# 2. Instalação e Configuração do Ambiente

Antes de utilizar o EvoX, é necessário instalar corretamente o software e as suas dependências. Este capítulo abrange os passos de instalação para Windows e Linux, bem como a forma de preparar e configurar as dependências necessárias. Certifique-se de que cumpre os requisitos básicos do sistema antes da instalação: **Python 3.10+**, espaço em disco suficiente e, opcionalmente, uma GPU suportada com o driver adequado.

## Dependências e Preparação

- **Ambiente Python**: O EvoX é construído em Python, por isso certifique-se de que o Python 3.10 ou superior está instalado. Recomenda-se a utilização de um ambiente virtual (como o `venv`) para evitar conflitos de dependências.

- **PyTorch**: O EvoX utiliza o PyTorch para operações de tensores e aceleração de hardware. Portanto, o **PyTorch deve ser instalado antes de instalar o EvoX**. Escolha a versão com base no seu hardware: instale a versão CUDA se tiver uma GPU NVIDIA, a versão ROCm para GPUs AMD, ou a versão CPU se não houver uma GPU disponível. Consulte o [guia oficial do PyTorch](https://pytorch.org) para obter o comando apropriado, por exemplo:

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Recomenda-se a atualização do `pip` para a versão mais recente e a garantia de uma ligação estável à Internet antes da instalação (os pacotes serão descarregados do PyPI). Assim que o ambiente estiver pronto, pode instalar o EvoX.

### Instalação em Windows

Os utilizadores de Windows podem escolher entre a **instalação automática por script** ou a **instalação manual**. O instalador oficial de um clique oferece uma forma fácil de configurar o EvoX e as suas dependências num ambiente limpo, mas a instalação manual permite um maior controlo.

**Opção 1: Utilizar o Script de Instalação de Um Clique (win-install.bat)**
O EvoX fornece um [script de instalação rápida](/_static/win-install.bat) para Windows 10/11 (64 bits). O script instala o Miniforge3 (um Conda leve), Python, PyTorch (com CUDA), EvoX e ferramentas úteis como o VSCode e o Git. Para utilizar:

1. Descarregue o `win-install.bat` da documentação do EvoX ou do GitHub. Certifique-se de que tem um [driver NVIDIA](https://www.nvidia.com/en-us/drivers/) instalado e uma ligação estável à Internet.
2. Execute o script. Não requer privilégios de administrador, mas pode solicitar permissão durante a execução — autorize-a. O script irá instalar e configurar tudo automaticamente.
3. Aguarde a conclusão. Em caso de sucesso, verá uma mensagem e possivelmente o VSCode a abrir. O EvoX e as suas dependências estarão instalados.

> **Nota**: Se o script falhar devido a problemas de rede, feche-o e execute-o novamente. O script suporta a retoma em caso de falha.

**Opção 2: Instalação Manual**
Para instalar o EvoX manualmente:

1. **Instalar o Driver da GPU**: Instale o driver NVIDIA mais recente a partir do [site oficial](https://www.nvidia.cn/Download/index.aspx). Se não tiver uma GPU dedicada, ignore este passo.

2. **Instalar o Python**: Descarregue o [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) e ative a opção “Add Python to PATH” durante a instalação.

3. **Instalar o PyTorch**: Abra o CMD ou o PowerShell e instale o PyTorch com base no seu hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar o Compilador Triton**: O PyTorch em Windows não tem suporte para o Triton. Se pretender utilizar o `torch.compile` (disponível no PyTorch 2.0), instale o [triton-windows](https://github.com/woct0rdho/triton-windows) de terceiros. Opcional, mas útil para otimização de desempenho.

5. **Instalar o EvoX**:

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  `> **Nota:**
> Alguns pacotes podem exigir dependências de sistema adicionais. Se for esse o caso, o instalador apresentará uma mensagem como a seguinte:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Quando encontrar tais mensagens, siga as instruções fornecidas para instalar as dependências necessárias antes de prosseguir.
  ````


### Instalação em Linux

A instalação do EvoX em Linux (ex: Ubuntu) é simples e é maioritariamente feita através do `pip`.

1. **Instalar Dependências do Sistema**: Certifique-se de que as ferramentas básicas de desenvolvimento e o Python 3.10+ estão instalados. Pode utilizar um gestor de pacotes (apt, yum) ou o Anaconda.

2. **Instalar o Driver da GPU** (se utilizar GPU): Utilize o gestor de pacotes apropriado (ex: `apt`) para instalar os drivers NVIDIA. Verifique a instalação com `nvidia-smi`. Ignore se estiver a utilizar CPU.

> **Nota:**
> No WSL, **não** instale os drivers NVIDIA dentro do subsistema Linux — instale-os no lado do Windows.

> **Dica:**
> É muito provável que apenas precise de instalar o driver, mas NÃO precise de instalar o CUDA ou outras dependências.
> Essas bibliotecas já estão incluídas na instalação do PyTorch via pip.

> **Dica:**
> A versão do driver necessária depende do seu hardware. Se tiver uma GPU NVIDIA recente, utilizar a versão mais recente do driver é frequentemente a melhor escolha.
> Para garantir uma melhor compatibilidade e acesso aos drivers mais recentes, é geralmente uma boa ideia utilizar uma distribuição Linux mais recente (ex: Ubuntu 25.04 em vez da 22.04).

1. **Instalar o PyTorch**: Tal como no Windows, instale com base no hardware. Consulte o [guia oficial do PyTorch](https://pytorch.org).

2. **Instalar o EvoX**:

   ```bash
   pip install evox
   ```

   Ou com extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Isto instala os módulos de visualização e as dependências de neuroevolução (como o Brax). Também pode escolher extras individuais como `vis` ou `neuroevolution`.

#### Instalação em Contentores (Docker, Podman)

Para utilizadores de GPUs AMD ou para quem procura isolamento de ambiente, recomenda-se o Docker. Por exemplo, utilizando a imagem oficial de Docker do PyTorch com ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro do contentor, instale o EvoX normalmente utilizando o `pip`.

## Verificar a Instalação do EvoX

Para verificar se o EvoX está corretamente instalado:

- **Verificação Básica**: No terminal ou na shell de Python, execute:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Isto imprime informações sobre o PyTorch e a configuração do sistema. Se o EvoX for importado sem erros, a instalação foi bem-sucedida. Também pode verificar a versão:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Definições Opcionais**: Pode ajustar definições relacionadas com o desempenho, tais como:

  - Configurar variáveis de ambiente como `OMP_NUM_THREADS` para controlar a contagem de threads do CPU
  - Aumentar a memória partilhada do Docker com `--shm-size`
  - Garantir que o seu IDE (Jupyter, PyCharm, etc.) utiliza o ambiente Python correto

Assim que a configuração estiver concluída, está pronto para começar a otimizar com o EvoX.