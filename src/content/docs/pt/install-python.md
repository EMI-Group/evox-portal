---
title: "Guia de Instalação do Python"
order: 1
section: "install"
---

# Guia de Instalação do Python

Este guia destina-se a quem é novo na linguagem de programação Python e pretende instalá-la no seu sistema.
Irá ajudá-lo a configurar o ambiente Python necessário para executar o EvoX.

> **Dica:**
> O EvoX é escrito em Python, portanto precisará de ter o Python instalado no seu sistema.
> O EvoX suporta Python 3.10 e superior, e recomendamos a utilização da **versão mais recente** do Python.

## Instalar o interpretador Python

### Versão Windows

Aceda a [Download Python](https://www.python.org/downloads/) e descarregue a versão mais recente do Python.

> **Nota:**
> Certifique-se de marcar a caixa que diz "Add Python to PATH" durante o processo de instalação.

### Versão Linux

Diferentes distribuições Linux têm diferentes formas de instalar o Python.
Depende do gestor de pacotes da sua distribuição.
Aqui estão alguns exemplos:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Instalar através do `uv`

O `uv` é um gestor de pacotes e projetos Python extremamente rápido, que funciona em Windows, Linux e MacOS.
Recomendamos a utilização do `uv` para instalar o interpretador Python bem como para gerir ambientes Python.
O guia de instalação detalhado pode ser encontrado no [guia de instalação do uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Utilize `irm` para descarregar o script e execute-o com `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Alterar a [política de execução](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permite executar um script da internet.

Solicite uma versão específica incluindo-a no URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux e MacOS
Utilize `curl` para descarregar o script e execute-o com `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Se o seu sistema não tiver `curl`, pode utilizar `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Solicite uma versão específica incluindo-a no URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gerir Ambientes Python

### Pip e Venv

O `pip` é o gestor de pacotes para Python. O `venv` é a ferramenta integrada para criar ambientes virtuais em Python.
Um ambiente virtual é um diretório autocontido que contém uma instalação Python para uma versão particular do Python, mais vários pacotes adicionais.
Isto é útil para gerir dependências de diferentes projetos separadamente.

Para criar um ambiente virtual, execute o seguinte comando no seu terminal:

```console
$ python -m venv <env_path> # usually <env_path> is a `.venv` directory in your project
```
Isto criará um novo diretório chamado `<env_path>` que contém uma cópia do interpretador Python e da biblioteca padrão.
Para ativar o ambiente virtual, execute o seguinte comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Isto alterará o prompt da sua shell para indicar que está agora a trabalhar dentro do ambiente virtual.
Para desativar o ambiente virtual, execute o seguinte comando:

```console
$ deactivate
```
Isto retornará ao interpretador Python padrão do seu sistema com todas as suas bibliotecas instaladas.

Enquanto o ambiente virtual estiver ativado, pode utilizar o `pip` para instalar pacotes no ambiente virtual.
Por exemplo, para instalar a versão mais recente do `numpy`, execute o seguinte comando:

```console
$ pip install numpy
```
Isto instalará o `numpy` no ambiente virtual, e não afetará a instalação Python do sistema.
Para instalar uma versão específica do `numpy`, execute o seguinte comando:

```console
$ pip install numpy==1.23.4
```
Isto instalará a versão `1.23.4` do `numpy` no ambiente virtual.
Para listar todos os pacotes instalados no ambiente virtual, execute o seguinte comando:

```console
$ pip list
```
Isto mostrará uma lista de todos os pacotes instalados no ambiente virtual, juntamente com as suas versões.
Para desinstalar um pacote, execute o seguinte comando:

```console
$ pip uninstall numpy
```
Isto desinstalará o `numpy` do ambiente virtual.
Para atualizar um pacote, execute o seguinte comando:

```console
$ pip install --upgrade numpy
```
Isto atualizará o `numpy` para a versão mais recente no ambiente virtual.

### uv

O `uv` pode não só gerir versões do Python, mas também gerir ambientes Python.
Para criar um novo ambiente Python, execute o seguinte comando:

```console
$ uv venv --python <python_version> # e.g. 3.10, 3.11, ...
```
Isto criará um novo diretório chamado `.venv` que contém uma cópia do interpretador Python e da biblioteca padrão.
Para ativar o ambiente virtual, execute o seguinte comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Após ativar o ambiente virtual, pode utilizar `uv pip` para instalar pacotes no ambiente virtual.
Por exemplo, para instalar a versão mais recente do `numpy`, execute o seguinte comando:

```console
$ uv pip install numpy
```
