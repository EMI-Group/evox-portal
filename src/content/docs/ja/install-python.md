---
title: "Python インストールガイド"
order: 1
section: "install"
---

# Python インストールガイド

このガイドは、Pythonプログラミング言語を初めて使用し、システムにインストールしたい方を対象としています。
EvoXを実行するために必要なPython環境のセットアップを支援します。

> **ヒント:**
> EvoXはPythonで記述されているため、システムにPythonをインストールする必要があります。
> EvoXはPython 3.10以上をサポートしており、Pythonの**最新バージョン**を使用することを推奨します。

## Pythonインタプリタのインストール

### Windows版

[Download Python](https://www.python.org/downloads/) にアクセスし、Pythonの最新バージョンをダウンロードしてください。

> **注:**
> インストールプロセス中に「Add Python to PATH」というチェックボックスを必ずオンにしてください。

### Linux版

Linuxディストリビューションによって、Pythonのインストール方法は異なります。
これは、使用しているディストリビューションのパッケージマネージャーに依存します。
以下にいくつかの例を示します：
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### `uv` を使用したインストール

`uv` は非常に高速なPythonパッケージおよびプロジェクトマネージャーであり、Windows、Linux、MacOSで動作します。
PythonインタプリタのインストールやPython環境の管理には、`uv` を使用することを推奨します。
詳細なインストールガイドは、[uv installation guide](https://docs.astral.sh/uv/getting-started/installation/#installation-methods) に記載されています。


### Windows
`irm` を使用してスクリプトをダウンロードし、`iex` で実行します：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

[実行ポリシー](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)を変更することで、インターネット上のスクリプトを実行できるようになります。

URLにバージョンを含めることで、特定のバージョンをリクエストできます：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### LinuxおよびMacOS
`curl` を使用してスクリプトをダウンロードし、`sh` で実行します：

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

システムに `curl` がない場合は、`wget` を使用できます：

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

URLにバージョンを含めることで、特定のバージョンをリクエストできます：

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Python環境の管理

### PipとVenv

`pip` はPythonのパッケージマネージャーです。`venv` はPythonで仮想環境を作成するための組み込みツールです。
仮想環境とは、特定のバージョンのPythonインストールといくつかの追加パッケージを含む、自己完結型のディレクトリのことです。
これは、異なるプロジェクトの依存関係を個別に管理するのに役立ちます。

仮想環境を作成するには、ターミナルで次のコマンドを実行します：

```console
$ python -m venv <env_path> # 通常、<env_path> はプロジェクト内の `.venv` ディレクトリです
```
これにより、Pythonインタプリタと標準ライブラリのコピーを含む `<env_path>` という新しいディレクトリが作成されます。
仮想環境を有効化するには、次のコマンドを実行します：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
これにより、シェルプロンプトが変更され、現在仮想環境内で作業していることが示されます。
仮想環境を無効化するには、次のコマンドを実行します：

```console
$ deactivate
```
これにより、インストールされているすべてのライブラリを含むシステムのデフォルトのPythonインタプリタに戻ります。

仮想環境が有効になっている間は、`pip` を使用して仮想環境にパッケージをインストールできます。
たとえば、`numpy` の最新バージョンをインストールするには、次のコマンドを実行します：

```console
$ pip install numpy
```
これにより、`numpy` が仮想環境にインストールされますが、システム全体のPythonインストールには影響しません。
特定のバージョンの `numpy` をインストールするには、次のコマンドを実行します：

```console
$ pip install numpy==1.23.4
```
これにより、バージョン `1.23.4` の `numpy` が仮想環境にインストールされます。
仮想環境にインストールされているすべてのパッケージを一覧表示するには、次のコマンドを実行します：

```console
$ pip list
```
これにより、仮想環境にインストールされているすべてのパッケージのリストと、そのバージョンが表示されます。
パッケージをアンインストールするには、次のコマンドを実行します：

```console
$ pip uninstall numpy
```
これにより、`numpy` が仮想環境からアンインストールされます。
パッケージをアップグレードするには、次のコマンドを実行します：

```console
$ pip install --upgrade numpy
```
これにより、仮想環境内の `numpy` が最新バージョンにアップグレードされます。

### uv

`uv` はPythonのバージョン管理だけでなく、Python環境の管理も可能です。
新しいPython環境を作成するには、次のコマンドを実行します：

```console
$ uv venv --python <python_version> # 例: 3.10, 3.11, ...
```
これにより、Pythonインタプリタと標準ライブラリのコピーを含む `.venv` という新しいディレクトリが作成されます。
仮想環境を有効化するには、次のコマンドを実行します：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

仮想環境を有効化した後、`uv pip` を使用して仮想環境にパッケージをインストールできます。
たとえば、`numpy` の最新バージョンをインストールするには、次のコマンドを実行します：

```console
$ uv pip install numpy
```