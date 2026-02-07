---
title: "Python 安装指南"
order: 1
section: "install"
---

# Python 安装指南

本指南面向 Python 编程语言的新手，帮助你在系统上安装 Python。
它将帮助你搭建运行 EvoX 所需的 Python 环境。

> **提示：**
> EvoX 使用 Python 编写，因此你需要在系统上安装 Python。
> EvoX 支持 Python 3.10 及以上版本，我们建议使用**最新版本**的 Python。

## 安装 Python 解释器

### Windows 版本

前往 [下载 Python](https://www.python.org/downloads/) 并下载最新版本的 Python。

> **注意：**
> 安装过程中请确保勾选"Add Python to PATH"选项。

### Linux 版本

不同的 Linux 发行版有不同的 Python 安装方式，
取决于你所使用的包管理器。
以下是一些示例：
- Debian/Ubuntu：`apt`
- Archlinux：`pacman`
- Fedora：`dnf`

### 通过 `uv` 安装

`uv` 是一个极其快速的 Python 包和项目管理器，支持 Windows、Linux 和 MacOS。
我们建议使用 `uv` 来安装 Python 解释器以及管理 Python 环境。
详细的安装指南可以在 [uv 安装指南](https://docs.astral.sh/uv/getting-started/installation/#installation-methods) 中找到。


### Windows
使用 `irm` 下载脚本并用 `iex` 执行：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

更改[执行策略](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)允许运行来自互联网的脚本。

通过在 URL 中包含版本号来请求特定版本：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux 和 MacOS
使用 `curl` 下载脚本并用 `sh` 执行：

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

如果你的系统没有 `curl`，可以使用 `wget`：

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

通过在 URL 中包含版本号来请求特定版本：

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## 管理 Python 环境

### Pip 和 Venv

`pip` 是 Python 的包管理器。`venv` 是 Python 内置的创建虚拟环境的工具。
虚拟环境是一个独立的目录，包含特定版本的 Python 安装以及若干额外的包。
这对于分别管理不同项目的依赖非常有用。

要创建虚拟环境，请在终端中运行以下命令：

```console
$ python -m venv <env_path> # 通常 <env_path> 是项目中的 `.venv` 目录
```
这将创建一个名为 `<env_path>` 的新目录，其中包含 Python 解释器和标准库的副本。
要激活虚拟环境，请运行以下命令：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
这将更改你的 shell 提示符，表示你现在正在虚拟环境中工作。
要停用虚拟环境，请运行以下命令：

```console
$ deactivate
```
这将返回到系统默认的 Python 解释器及其所有已安装的库。

在虚拟环境激活后，你可以使用 `pip` 将包安装到虚拟环境中。
例如，要安装最新版本的 `numpy`，请运行以下命令：

```console
$ pip install numpy
```
这将把 `numpy` 安装到虚拟环境中，不会影响系统级的 Python 安装。
要安装特定版本的 `numpy`，请运行以下命令：

```console
$ pip install numpy==1.23.4
```
这将把 `numpy` 的 `1.23.4` 版本安装到虚拟环境中。
要列出虚拟环境中安装的所有包，请运行以下命令：

```console
$ pip list
```
这将显示虚拟环境中安装的所有包及其版本。
要卸载一个包，请运行以下命令：

```console
$ pip uninstall numpy
```
这将从虚拟环境中卸载 `numpy`。
要升级一个包，请运行以下命令：

```console
$ pip install --upgrade numpy
```
这将把虚拟环境中的 `numpy` 升级到最新版本。

### uv

`uv` 不仅可以管理 Python 版本，还可以管理 Python 环境。
要创建新的 Python 环境，请运行以下命令：

```console
$ uv venv --python <python_version> # 例如 3.10、3.11 等
```
这将创建一个名为 `.venv` 的新目录，其中包含 Python 解释器和标准库的副本。
要激活虚拟环境，请运行以下命令：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

激活虚拟环境后，你可以使用 `uv pip` 将包安装到虚拟环境中。
例如，要安装最新版本的 `numpy`，请运行以下命令：

```console
$ uv pip install numpy
```
