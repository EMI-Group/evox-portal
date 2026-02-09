---
title: "Python 安裝指南"
order: 1
section: "install"
---

# Python 安裝指南

本指南專為剛接觸 Python 程式語言並希望在系統上安裝它的使用者而設。
它將協助您設定執行 EvoX 所需的 Python 環境。

> **提示：**
> EvoX 是用 Python 編寫的，因此您的系統需要安裝 Python。
> EvoX 支援 Python 3.10 及以上版本，我們建議使用 **最新版本** 的 Python。

## 安裝 Python 直譯器

### Windows 版本

前往 [Download Python](https://www.python.org/downloads/) 下載最新版本的 Python。

> **注意：**
> 請務必在安裝過程中勾選「Add Python to PATH」選項。

### Linux 版本

不同的 Linux 發行版有不同的 Python 安裝方式。
這取決於您發行版的套件管理器。
以下是一些範例：
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### 透過 `uv` 安裝

`uv` 是一個極快的 Python 套件和專案管理器，適用於 Windows、Linux 和 MacOS。
我們建議使用 `uv` 來安裝 Python 直譯器以及管理 Python 環境。
詳細的安裝指南可以在 [uv 安裝指南](https://docs.astral.sh/uv/getting-started/installation/#installation-methods) 中找到。


### Windows
使用 `irm` 下載腳本並透過 `iex` 執行：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

更改 [執行策略 (execution policy)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) 允許執行來自網際網路的腳本。

透過在 URL 中包含版本號來請求特定版本：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux 和 MacOS
使用 `curl` 下載腳本並透過 `sh` 執行：

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

如果您的系統沒有 `curl`，可以使用 `wget`：

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

透過在 URL 中包含版本號來請求特定版本：

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## 管理 Python 環境

### Pip 和 Venv

`pip` 是 Python 的套件管理器。`venv` 是 Python 內建的虛擬環境建立工具。
虛擬環境是一個獨立的目錄，其中包含特定版本的 Python 安裝以及一些額外的套件。
這對於分開管理不同專案的依賴項非常有用。

要建立虛擬環境，請在終端機中執行以下指令：

```console
$ python -m venv <env_path> # 通常 <env_path> 是專案中的 `.venv` 目錄
```
這將建立一個名為 `<env_path>` 的新目錄，其中包含 Python 直譯器和標準函式庫的副本。
要啟用虛擬環境，請執行以下指令：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
這將更改您的 Shell 提示字元，以顯示您現在正在虛擬環境中工作。
要停用虛擬環境，請執行以下指令：

```console
$ deactivate
```
這將使您返回到系統預設的 Python 直譯器及其所有已安裝的函式庫。

當虛擬環境啟用時，您可以使用 `pip` 將套件安裝到虛擬環境中。
例如，要安裝最新版本的 `numpy`，請執行以下指令：

```console
$ pip install numpy
```
這將把 `numpy` 安裝到虛擬環境中，而不會影響系統範圍的 Python 安裝。
要安裝特定版本的 `numpy`，請執行以下指令：

```console
$ pip install numpy==1.23.4
```
這將把 `1.23.4` 版本的 `numpy` 安裝到虛擬環境中。
要列出虛擬環境中安裝的所有套件，請執行以下指令：

```console
$ pip list
```
這將顯示虛擬環境中安裝的所有套件及其版本的列表。
要解除安裝套件，請執行以下指令：

```console
$ pip uninstall numpy
```
這將從虛擬環境中解除安裝 `numpy`。
要升級套件，請執行以下指令：

```console
$ pip install --upgrade numpy
```
這將把虛擬環境中的 `numpy` 升級到最新版本。

### uv

`uv` 不僅可以管理 Python 版本，還可以管理 Python 環境。
要建立新的 Python 環境，請執行以下指令：

```console
$ uv venv --python <python_version> # 例如 3.10, 3.11, ...
```
這將建立一個名為 `.venv` 的新目錄，其中包含 Python 直譯器和標準函式庫的副本。
要啟用虛擬環境，請執行以下指令：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

啟用虛擬環境後，您可以使用 `uv pip` 將套件安裝到虛擬環境中。
例如，要安裝最新版本的 `numpy`，請執行以下指令：

```console
$ uv pip install numpy
```