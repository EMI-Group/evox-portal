---
title: "Ambiente de desenvolvimento"
order: 3
section: "developer"
---

# Ambiente de desenvolvimento

## Clone o repositório e instale-o em modo editável (recomendado)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Ative o ambiente Nix executando o seguinte comando:
```bash
nix develop .
```
Isso criará um shell com todas as dependências necessárias e um diretório `.venv` com o ambiente Python.

## Guia de estilo

O EvoX possui o seguinte guia de estilo:
1. Certifique-se de usar o [ruff](https://docs.astral.sh/ruff/) para fazer o lint do seu código.
2. Certifique-se de que não haja espaços em branco no final das linhas (trailing whitespaces).

## Pre-commit

Recomendamos o uso do [pre-commit](https://pre-commit.com/) para aplicar o guia de estilo.
Após instalar o pre-commit, execute o seguinte comando para instalar os hooks em seu repositório local:
```bash
pre-commit install
```

## Executar Testes Unitários

1. prepare o ambiente de teste instalando os pacotes necessários (ex: `torch`) em seu ambiente Python
2. execute o unittest:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```