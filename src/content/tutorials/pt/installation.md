---
title: "2. Instalação e Configuração do Ambiente"
order: 2
---

# 2. Instalação e Configuração do Ambiente

Antes de utilizar o EvoX, é necessário instalar corretamente o software e as suas dependências. Este capítulo abrange os passos de instalação tanto para Windows como para Linux, bem como a preparação e configuração das dependências necessárias. Certifique-se de que cumpre os requisitos básicos do sistema antes da instalação: **Python 3.10+**, espaço em disco suficiente e, opcionalmente, uma GPU suportada com o driver apropriado.

## Dependências e Preparações

- **Ambiente Python**: O EvoX é construído sobre Python, portanto certifique-se de que o Python 3.10 ou superior está instalado. Recomenda-se a utilização de um ambiente virtual (como `venv`) para evitar conflitos de dependências.

- **PyTorch**: O EvoX utiliza o PyTorch para operações com tensores e aceleração de hardware. Portanto, **o PyTorch deve ser instalado antes de instalar o EvoX**. Escolha a versão com base no seu hardware: instale a versão CUDA se tiver uma GPU NVIDIA, a versão ROCm para GPUs AMD, ou a versão CPU se não tiver GPU disponível. Consulte o [guia oficial do PyTorch](https://pytorch.org) para o comando apropriado, por exemplo:

  ```bash
  # Para GPUs NVIDIA (CUDA)
  pip install torch torchvision torchaudio

  # Para GPUs AMD (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Apenas para CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Recomenda-se atualizar o `pip` para a versão mais recente e garantir uma ligação estável à internet antes da instalação (os pacotes serão descarregados do PyPI). Assim que o ambiente estiver pronto, pode instalar o EvoX.

### Instalação no Windows

Os utilizadores de Windows podem escolher entre **instalação automática por script** ou **instalação manual**. O instalador automático oficial fornece uma forma fácil de configurar o EvoX e as suas dependências num ambiente limpo, mas a instalação manual permite maior controlo.

**Opção 1: Utilizar o Script de Instalação Automática (win-install.bat)**
O EvoX fornece um [script de instalação rápida](/_static/win-install.bat) para Windows 10/11 (64-bit). O script instala o Miniforge3 (um Conda leve), Python, PyTorch (com CUDA), EvoX e ferramentas úteis como VSCode e Git. Para utilizar:

1. Descarregue o `win-install.bat` da documentação do EvoX ou do GitHub. Certifique-se de que tem um [driver NVIDIA](https://www.nvidia.com/en-us/drivers/) instalado e uma ligação estável à internet.
2. Execute o script. Não requer privilégios de administrador, mas pode solicitar permissão durante a execução — permita. O script instalará e configurará tudo automaticamente.
3. Aguarde a conclusão. Após o sucesso, verá uma mensagem e possivelmente o VSCode a abrir. O EvoX e as suas dependências estarão instalados.

> **Nota**: Se o script falhar devido a problemas de rede, feche-o e execute novamente. Suporta retoma em caso de falha.

**Opção 2: Instalação Manual**
Para instalar manualmente o EvoX:

1. **Instalar o Driver GPU**: Instale o driver NVIDIA mais recente a partir do [site oficial](https://www.nvidia.cn/Download/index.aspx). Se não tiver GPU dedicada, ignore este passo.

2. **Instalar o Python**: Descarregue o [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) e ative "Add Python to PATH" durante a instalação.

3. **Instalar o PyTorch**: Abra o CMD ou PowerShell e instale o PyTorch com base no seu hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar o Compilador Triton**: O PyTorch no Windows não tem suporte Triton. Se quiser utilizar `torch.compile` (disponível no PyTorch 2.0), instale o [triton-windows](https://github.com/woct0rdho/triton-windows) de terceiros. Opcional mas útil para otimização de desempenho.

5. **Instalar o EvoX**:

   ```bash
   pip install "evox[default]"

   # Extras opcionais:
   pip install "evox[vis]"           # Suporte de visualização
   pip install "evox[neuroevolution]" # Suporte de neuroevolução
   ```


  `> **Nota:**
> Alguns pacotes podem requerer dependências adicionais do sistema. Se for o caso, o instalador irá apresentar uma mensagem como a seguinte:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Quando encontrar tais mensagens, siga as instruções fornecidas para instalar as dependências necessárias antes de prosseguir.
  ````


### Instalação no Linux

Instalar o EvoX no Linux (por exemplo, Ubuntu) é simples e maioritariamente gerido via `pip`.

1. **Instalar Dependências do Sistema**: Certifique-se de que as ferramentas básicas de desenvolvimento e o Python 3.10+ estão instalados. Pode utilizar um gestor de pacotes (apt, yum) ou Anaconda.

2. **Instalar o Driver GPU** (se utilizar GPU): Utilize o gestor de pacotes apropriado (por exemplo, `apt`) para instalar os drivers NVIDIA. Verifique a instalação com `nvidia-smi`. Ignore se utilizar CPU.

> **Nota:**
> No WSL, **não** instale drivers NVIDIA dentro do subsistema Linux — instale-os no lado do Windows.

> **Dica:**
> É muito provável que apenas precise de instalar o driver, mas NÃO precise de instalar CUDA ou outras dependências.
> Essas bibliotecas já estão incluídas na instalação do PyTorch via pip.

> **Dica:**
> A versão do driver necessária depende do seu hardware. Se tiver uma GPU NVIDIA recente, utilizar a versão mais recente do driver é frequentemente a melhor escolha.
> Para garantir melhor compatibilidade e acesso aos drivers mais recentes, é geralmente uma boa ideia utilizar uma distribuição Linux mais recente (por exemplo, Ubuntu 25.04 em vez de 22.04).

1. **Instalar o PyTorch**: Como no Windows, instale com base no hardware. Consulte o [guia oficial do PyTorch](https://pytorch.org).

2. **Instalar o EvoX**:

   ```bash
   pip install evox
   ```

   Ou com extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Isto instala módulos de visualização e dependências de neuroevolução (como Brax). Também pode escolher extras individuais como `vis` ou `neuroevolution`.

#### Instalação em Contentor (Docker, Podman)

Para utilizadores de GPU AMD ou aqueles que procuram isolamento de ambiente, o Docker é recomendado. Por exemplo, utilizando a imagem Docker oficial do PyTorch com ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro do contentor, instale o EvoX normalmente utilizando `pip`.

## Verificar a Instalação do EvoX

Para verificar que o EvoX está corretamente instalado:

- **Verificação Básica**: No terminal ou shell Python, execute:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Isto imprime informações de configuração do PyTorch e do sistema. Se o EvoX for importado sem erros, a instalação foi bem-sucedida. Também pode verificar a versão:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Definições Opcionais**: Pode ajustar definições relacionadas com o desempenho, tais como:

  - Definir variáveis de ambiente como `OMP_NUM_THREADS` para controlar a contagem de threads do CPU
  - Aumentar a memória partilhada do Docker com `--shm-size`
  - Garantir que o seu IDE (Jupyter, PyCharm, etc.) utiliza o ambiente Python correto

Assim que a configuração estiver completa, está pronto para começar a otimizar com o EvoX.
