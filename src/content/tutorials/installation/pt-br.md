---
title: "2. Instalação e Configuração do Ambiente"
order: 2
---

# 2. Instalação e Configuração do Ambiente

Antes de usar o EvoX, você precisa instalar corretamente o software e suas dependências. Este capítulo aborda as etapas de instalação para Windows e Linux, bem como a preparação e configuração das dependências necessárias. Certifique-se de atender aos requisitos básicos de sistema antes da instalação: **Python 3.10+**, espaço em disco suficiente e, opcionalmente, uma GPU compatível com o driver apropriado.

## Dependências e Preparações

- **Ambiente Python**: O EvoX é construído em Python, portanto, certifique-se de que o Python 3.10 ou superior esteja instalado. Recomenda-se o uso de um ambiente virtual (como `venv`) para evitar conflitos de dependência.

- **PyTorch**: O EvoX utiliza PyTorch para operações de tensores e aceleração de hardware. Portanto, o **PyTorch deve ser instalado antes da instalação do EvoX**. Escolha a versão com base no seu hardware: instale a versão CUDA se tiver uma GPU NVIDIA, a versão ROCm para GPUs AMD ou a versão CPU se não houver GPU disponível. Consulte o [guia oficial do PyTorch](https://pytorch.org) para o comando apropriado, por exemplo:

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Recomenda-se atualizar o `pip` para a versão mais recente e garantir uma conexão estável com a internet antes da instalação (os pacotes serão baixados do PyPI). Assim que o ambiente estiver pronto, você poderá instalar o EvoX.

### Instalação no Windows

Usuários de Windows podem escolher entre a **instalação automática via script** ou a **instalação manual**. O instalador oficial de um clique oferece uma maneira fácil de configurar o EvoX e suas dependências em um ambiente limpo, mas a instalação manual permite mais controle.

**Opção 1: Usando o Script de Instalação de Um Clique (win-install.bat)**
O EvoX fornece um [script de instalação rápida](/_static/win-install.bat) para Windows 10/11 (64 bits). O script instala o Miniforge3 (um Conda leve), Python, PyTorch (com CUDA), EvoX e ferramentas úteis como VSCode e Git. Para usar:

1. Baixe o `win-install.bat` da documentação do EvoX ou do GitHub. Certifique-se de ter um [driver NVIDIA](https://www.nvidia.com/en-us/drivers/) instalado e uma conexão estável com a internet.
2. Execute o script. Ele não requer privilégios de administrador, mas pode solicitar permissão durante a execução — permita-a. O script instalará e configurará tudo automaticamente.
3. Aguarde a conclusão. Em caso de sucesso, você verá uma mensagem e possivelmente o VSCode será aberto. O EvoX e suas dependências estarão instalados.

> **Nota**: Se o script falhar devido a problemas de rede, feche-o e execute-o novamente. Ele suporta a retomada em caso de falha.

**Opção 2: Instalação Manual**
Para instalar o EvoX manualmente:

1. **Instalar o Driver de GPU**: Instale o driver NVIDIA mais recente do [site oficial](https://www.nvidia.cn/Download/index.aspx). Se não houver uma GPU dedicada, pule esta etapa.

2. **Instalar o Python**: Baixe o [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) e habilite a opção “Add Python to PATH” durante a instalação.

3. **Instalar o PyTorch**: Abra o CMD ou PowerShell e instale o PyTorch com base no seu hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar o Compilador Triton**: O PyTorch no Windows não possui suporte ao Triton. Se você deseja usar `torch.compile` (disponível no PyTorch 2.0), instale o [triton-windows](https://github.com/woct0rdho/triton-windows) de terceiros. Opcional, mas útil para otimização de desempenho.

5. **Instalar o EvoX**:

   ```bash
   pip install "evox[default]"

   # Extras opcionais:
   pip install "evox[vis]"           # Suporte para visualização
   pip install "evox[neuroevolution]" # Suporte para neuroevolução
   ```


  `> **Nota:**
> Alguns pacotes podem exigir dependências de sistema adicionais. Se for o caso, o instalador exibirá uma mensagem como a seguinte:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Ao encontrar tais mensagens, siga as instruções fornecidas para instalar as dependências necessárias antes de prosseguir.
  ````


### Instalação no Linux

A instalação do EvoX no Linux (ex: Ubuntu) é direta e realizada principalmente via `pip`.

1. **Instalar Dependências do Sistema**: Certifique-se de que as ferramentas básicas de desenvolvimento e o Python 3.10+ estejam instalados. Você pode usar um gerenciador de pacotes (apt, yum) ou Anaconda.

2. **Instalar o Driver de GPU** (se estiver usando GPU): Use o gerenciador de pacotes apropriado (ex: `apt`) para instalar os drivers NVIDIA. Verifique a instalação com `nvidia-smi`. Pule se estiver usando CPU.

> **Nota:**
> No WSL, **não** instale os drivers NVIDIA dentro do subsistema Linux — instale-os no lado do Windows.

> **Dica:**
> É muito provável que você precise apenas instalar o driver, mas NÃO precise instalar o CUDA ou outras dependências.
> Essas bibliotecas já estão incluídas na instalação do PyTorch via pip.

> **Dica:**
> A versão do driver necessária depende do seu hardware. Se você tiver uma GPU NVIDIA recente, usar a versão mais recente do driver costuma ser a melhor escolha.
> Para garantir melhor compatibilidade e acesso aos drivers mais recentes, geralmente é uma boa ideia usar uma distribuição Linux mais nova (ex: Ubuntu 25.04 em vez de 22.04).

1. **Instalar o PyTorch**: Assim como no Windows, instale com base no hardware. Consulte o [guia oficial do PyTorch](https://pytorch.org).

2. **Instalar o EvoX**:

   ```bash
   pip install evox
   ```

   Ou com extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Isso instala módulos de visualização e dependências de neuroevolução (como o Brax). Você também pode escolher extras individuais como `vis` ou `neuroevolution`.

#### Instalação em Contêiner (Docker, Podman)

Para usuários de GPU AMD ou para aqueles que buscam isolamento de ambiente, o Docker é recomendado. Por exemplo, usando a imagem Docker oficial do PyTorch com ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro do contêiner, instale o EvoX normalmente usando `pip`.

## Verificando a Instalação do EvoX

Para verificar se o EvoX está instalado corretamente:

- **Verificação Básica**: No terminal ou shell Python, execute:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Isso imprime as informações de configuração do PyTorch e do sistema. Se o EvoX for importado sem erros, a instalação foi bem-sucedida. Você também pode verificar a versão:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Configurações Opcionais**: Você pode ajustar configurações relacionadas ao desempenho, como:

  - Configurar variáveis de ambiente como `OMP_NUM_THREADS` para controlar a contagem de threads da CPU
  - Aumentar a memória compartilhada do Docker com `--shm-size`
  - Garantir que sua IDE (Jupyter, PyCharm, etc.) use o ambiente Python correto

Assim que a configuração estiver concluída, você estará pronto para começar a otimizar com o EvoX.