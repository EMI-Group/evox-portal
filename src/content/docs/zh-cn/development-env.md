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
pip install -e ".[test]" # 以可编辑模式安装，包含测试依赖
```

## Nix

通过运行以下命令启用 Nix 环境：
```bash
nix develop .
```
这将创建一个包含所有必要依赖的 shell 以及一个包含 Python 环境的 `.venv` 目录。

## 代码风格指南

EvoX 的代码风格指南如下：
1. 确保使用 [ruff](https://docs.astral.sh/ruff/) 来检查你的代码。
2. 确保没有尾随空格。

## Pre-commit

我们建议使用 [pre-commit](https://pre-commit.com/) 来强制执行代码风格指南。
安装 pre-commit 后，运行以下命令在本地仓库中安装钩子：
```bash
pre-commit install
```

## 运行单元测试

1. 在你的 Python 环境中安装所需的包（例如 `torch`）来准备测试环境
2. 运行单元测试：
```shell
# 运行所有测试
python -m unittest
# 运行 [path] 中的测试，例如 python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# 运行特定的测试方法或模块，例如 python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
