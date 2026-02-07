---
title: "開發環境"
order: 3
section: "developer"
---

# 開發環境

## 複製儲存庫並以可編輯模式安裝（推薦）

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

透過執行以下命令啟用 Nix 環境：
```bash
nix develop .
```
這將建立一個包含所有必要相依項目的 shell 和一個包含 Python 環境的 `.venv` 目錄。

## 程式碼風格指南

EvoX 有以下程式碼風格指南：
1. 確保使用 [ruff](https://docs.astral.sh/ruff/) 來檢查您的程式碼。
2. 確保沒有尾隨空白。

## Pre-commit

我們建議使用 [pre-commit](https://pre-commit.com/) 來強制執行程式碼風格指南。
安裝 pre-commit 後，執行以下命令在您的本地儲存庫中安裝鉤子：
```bash
pre-commit install
```

## 執行單元測試

1. 透過在 Python 環境中安裝所需的套件（例如 `torch`）來準備測試環境
2. 執行 unittest：
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
