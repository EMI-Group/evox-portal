---
title: "Guia de Instalação do Python"
order: 1
section: "install"
---

# Guia de Instalação do Python

Este guia é para aqueles que são novos na linguagem de programação Python e desejam instalá-la em seu sistema.
Ele ajudará você a configurar o ambiente Python necessário para executar o EvoX.

> **Dica:**
> O EvoX é escrito em Python, então você precisará ter o Python instalado em seu sistema.
> O EvoX suporta Python 3.10 e superior, e recomendamos usar a **versão mais recente** do Python.

## Instalar o interpretador Python

### Versão Windows

Acesse [Download Python](https://www.python.org/downloads/) e baixe a versão mais recente do Python.

> **Nota:**
> Certifique-se de marcar a caixa que diz "Add Python to PATH" durante o processo de instalação.

### Versão Linux

Diferentes distribuições Linux têm diferentes formas de instalar o Python.
Depende do gerenciador de pacotes da sua distribuição.
Aqui estão alguns exemplos:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Instalar através do `uv`

`uv` é um gerenciador de pacotes e projetos Python extremamente rápido, que funciona no Windows, Linux e MacOS.
Recomendamos usar o `uv` para instalar o interpretador Python, bem como para gerenciar ambientes Python.
O guia detalhado de instalação pode ser encontrado no [guia de instalação do uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Use `irm` para baixar o script e execute-o com `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Alterar a [política de execução](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permite executar um script da internet.

Solicite uma versão específica incluindo-a na URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux e MacOS
Use `curl` para baixar o script e execute-o com `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Se o seu sistema não tiver `curl`, você pode usar `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Solicite uma versão específica incluindo-a na URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gerenciando Ambientes Python

### Pip e Venv

`pip` é o gerenciador de pacotes do Python. `venv` é a ferramenta integrada para criar ambientes virtuais no Python.
Um ambiente virtual é um diretório autocontido que contém uma instalação do Python para uma versão específica do Python, além de vários pacotes adicionais.
Isso é útil para gerenciar dependências de diferentes projetos separadamente.

Para criar um ambiente virtual, execute o seguinte comando no seu terminal:

```console
$ python -m venv <env_path> # geralmente <env_path> é um diretório `.venv` no seu projeto
```
Isso criará um novo diretório chamado `<env_path>` que contém uma cópia do interpretador Python e da biblioteca padrão.
Para ativar o ambiente virtual, execute o seguinte comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Isso mudará o prompt do seu shell para indicar que você está agora trabalhando dentro do ambiente virtual.
Para desativar o ambiente virtual, execute o seguinte comando:

```console
$ deactivate
```
Isso retornará você ao interpretador Python padrão do seu sistema com todas as suas bibliotecas instaladas.

Enquanto o ambiente virtual estiver ativado, você pode usar o `pip` para instalar pacotes no ambiente virtual.
Por exemplo, para instalar a versão mais recente do `numpy`, execute o seguinte comando:

```console
$ pip install numpy
```
Isso instalará o `numpy` no ambiente virtual, e não afetará a instalação do Python em todo o sistema.
Para instalar uma versão específica do `numpy`, execute o seguinte comando:

```console
$ pip install numpy==1.23.4
```
Isso instalará a versão `1.23.4` do `numpy` no ambiente virtual.
Para listar todos os pacotes instalados no ambiente virtual, execute o seguinte comando:

```console
$ pip list
```
Isso mostrará uma lista de todos os pacotes instalados no ambiente virtual, junto com suas versões.
Para desinstalar um pacote, execute o seguinte comando:

```console
$ pip uninstall numpy
```
Isso desinstalará o `numpy` do ambiente virtual.
Para atualizar um pacote, execute o seguinte comando:

```console
$ pip install --upgrade numpy
```
Isso atualizará o `numpy` para a versão mais recente no ambiente virtual.

### uv

O `uv` pode não apenas gerenciar versões do Python, mas também gerenciar ambientes Python.
Para criar um novo ambiente Python, execute o seguinte comando:

```console
$ uv venv --python <python_version> # ex: 3.10, 3.11, ...
```
Isso criará um novo diretório chamado `.venv` que contém uma cópia do interpretador Python e da biblioteca padrão.
Para ativar o ambiente virtual, execute o seguinte comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Após ativar o ambiente virtual, você pode usar `uv pip` para instalar pacotes no ambiente virtual.
Por exemplo, para instalar a versão mais recente do `numpy`, execute o seguinte comando:

```console
$ uv pip install numpy
```
