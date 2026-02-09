---
title: "開発環境"
order: 3
section: "developer"
---

# 開発環境

## リポジトリのクローンと編集可能モードでのインストール（推奨）

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

以下のコマンドを実行して、Nix 環境を有効にします。
```bash
nix develop .
```
これにより、必要なすべての依存関係を含むシェルと、Python 環境を含む `.venv` ディレクトリが作成されます。

## スタイルガイド

EvoX には以下のスタイルガイドがあります。
1. コードの lint には必ず [ruff](https://docs.astral.sh/ruff/) を使用してください。
2. 行末に余分な空白（trailing whitespaces）がないことを確認してください。

## Pre-commit

スタイルガイドを強制するために、[pre-commit](https://pre-commit.com/) の使用を推奨します。
pre-commit をインストールした後、以下のコマンドを実行してローカルリポジトリにフックをインストールしてください。
```bash
pre-commit install
```

## ユニットテストの実行

1. Python 環境に必要なパッケージ（`torch` など）をインストールして、テスト環境を準備します。
2. unittest を実行します。
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```