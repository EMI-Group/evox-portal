---
title: "开发环境"
order: 3
section: "developer"
---

# 开发环境

## 克隆仓库并以可编辑模式安装（推荐）

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

运行以下命令以启用 Nix 环境：
```bash
nix develop .
```
这将创建一个包含所有必要依赖项的 shell，以及一个包含 Python 环境的 `.venv` 目录。

## 代码风格指南

EvoX 遵循以下代码风格指南：
1. 请确保使用 [ruff](https://docs.astral.sh/ruff/) 来检查代码（lint）。
2. 请确保没有尾随空格（trailing whitespaces）。

## Pre-commit

我们建议使用 [pre-commit](https://pre-commit.com/) 来强制执行代码风格指南。
安装 pre-commit 后，运行以下命令将钩子（hooks）安装到本地仓库中：
```bash
pre-commit install
```

## 运行单元测试

1. 在 Python 环境中安装所需的包（例如 `torch`）以准备测试环境
2. 运行 unittest：
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```