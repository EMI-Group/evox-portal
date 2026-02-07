---
title: "Pythonインストールガイド"
order: 1
section: "install"
---

# Pythonインストールガイド

このガイドは、Pythonプログラミング言語を初めて使用し、システムにインストールしたい方向けです。
EvoXの実行に必要なPython環境のセットアップを支援します。

> **ヒント:**
> EvoXはPythonで書かれているため、システムにPythonがインストールされている必要があります。
> EvoXはPython 3.10以上をサポートしており、**最新バージョン**のPythonの使用を推奨します。

## Pythonインタプリタのインストール

### Windowsバージョン

[Download Python](https://www.python.org/downloads/)にアクセスし、最新バージョンのPythonをダウンロードします。

> **注意:**
> インストールプロセス中に「Add Python to PATH」のチェックボックスにチェックを入れてください。

### Linuxバージョン

LinuxディストリビューションによってPythonのインストール方法が異なります。
ディストリビューションのパッケージマネージャーに依存します。
以下はいくつかの例です：
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### `uv`を通じたインストール

`uv`は非常に高速なPythonパッケージおよびプロジェクトマネージャーで、Windows、Linux、MacOSで動作します。
Pythonインタプリタのインストールおよびpython環境の管理に`uv`の使用を推奨します。
詳細なインストールガイドは[uvインストールガイド](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)にあります。


### Windows
`irm`を使用してスクリプトをダウンロードし、`iex`で実行します：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

[実行ポリシー](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)を変更すると、インターネットからのスクリプトの実行が許可されます。

URLにバージョンを含めることで特定のバージョンをリクエストできます：

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### LinuxおよびMacOS
`curl`を使用してスクリプトをダウンロードし、`sh`で実行します：

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

システムに`curl`がない場合は、`wget`を使用できます：

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

URLにバージョンを含めることで特定のバージョンをリクエストできます：

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Python環境の管理

### PipとVenv

`pip`はPythonのパッケージマネージャーです。`venv`はPythonで仮想環境を作成するための組み込みツールです。
仮想環境は、特定のバージョンのPythonインストールといくつかの追加パッケージを含む自己完結型のディレクトリです。
これは、異なるプロジェクトの依存関係を個別に管理するのに便利です。

仮想環境を作成するには、ターミナルで以下のコマンドを実行します：

```console
$ python -m venv <env_path> # usually <env_path> is a `.venv` directory in your project
```
これにより、Pythonインタプリタと標準ライブラリのコピーを含む`<env_path>`という新しいディレクトリが作成されます。
仮想環境を有効にするには、以下のコマンドを実行します：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
これにより、シェルプロンプトが変更され、仮想環境内で作業していることが示されます。
仮想環境を無効にするには、以下のコマンドを実行します：

```console
$ deactivate
```
これにより、インストールされたすべてのライブラリを含むシステムのデフォルトPythonインタプリタに戻ります。

仮想環境が有効な間、`pip`を使用して仮想環境にパッケージをインストールできます。
例えば、最新バージョンの`numpy`をインストールするには、以下のコマンドを実行します：

```console
$ pip install numpy
```
これにより、仮想環境に`numpy`がインストールされ、システム全体のPythonインストールには影響しません。
特定のバージョンの`numpy`をインストールするには、以下のコマンドを実行します：

```console
$ pip install numpy==1.23.4
```
これにより、仮想環境にバージョン`1.23.4`の`numpy`がインストールされます。
仮想環境にインストールされているすべてのパッケージを一覧表示するには、以下のコマンドを実行します：

```console
$ pip list
```
これにより、仮想環境にインストールされているすべてのパッケージとそのバージョンの一覧が表示されます。
パッケージをアンインストールするには、以下のコマンドを実行します：

```console
$ pip uninstall numpy
```
これにより、仮想環境から`numpy`がアンインストールされます。
パッケージをアップグレードするには、以下のコマンドを実行します：

```console
$ pip install --upgrade numpy
```
これにより、仮想環境の`numpy`が最新バージョンにアップグレードされます。

### uv

`uv`はPythonバージョンだけでなく、Python環境も管理できます。
新しいPython環境を作成するには、以下のコマンドを実行します：

```console
$ uv venv --python <python_version> # e.g. 3.10, 3.11, ...
```
これにより、Pythonインタプリタと標準ライブラリのコピーを含む`.venv`という新しいディレクトリが作成されます。
仮想環境を有効にするには、以下のコマンドを実行します：

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

仮想環境を有効にした後、`uv pip`を使用して仮想環境にパッケージをインストールできます。
例えば、最新バージョンの`numpy`をインストールするには、以下のコマンドを実行します：

```console
$ uv pip install numpy
```
