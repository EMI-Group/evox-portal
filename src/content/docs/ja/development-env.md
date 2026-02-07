---
title: "開発環境"
order: 3
section: "developer"
---

# 開発環境

## リポジトリをクローンして編集可能モードでインストール（推奨）

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # テスト依存関係付きで編集可能モードでパッケージをインストール
```

## Nix

以下のコマンドを実行してNix環境を有効にします：
```bash
nix develop .
```
これにより、必要なすべての依存関係を含むシェルと、Python環境を含む`.venv`ディレクトリが作成されます。

## スタイルガイド

EvoXのスタイルガイドは以下の通りです：
1. [ruff](https://docs.astral.sh/ruff/)を使用してコードをリントしてください。
2. 末尾の空白がないことを確認してください。

## Pre-commit

スタイルガイドを強制するために[pre-commit](https://pre-commit.com/)の使用を推奨します。
pre-commitをインストールした後、以下のコマンドを実行してローカルリポジトリにフックをインストールします：
```bash
pre-commit install
```

## ユニットテストの実行

1. Python環境に必要なパッケージ（例：`torch`）をインストールしてテスト環境を準備します
2. unittestを実行します：
```shell
# すべてのテストを実行
python -m unittest
# [path]のテストを実行、例：python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# 特定のテストメソッドまたはモジュールを実行、例：python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
