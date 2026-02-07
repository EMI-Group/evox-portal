---
title: "Ambiente de desenvolvimento"
order: 3
section: "developer"
---

# Ambiente de desenvolvimento

## Clonar o repositório e instalar em modo editável (recomendado)

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
Isto criará uma shell com todas as dependências necessárias e um diretório `.venv` com o ambiente Python.

## Guia de estilo

O EvoX tem o seguinte guia de estilo:
1. Certifique-se de utilizar o [ruff](https://docs.astral.sh/ruff/) para verificar o seu código.
2. Certifique-se de que não existem espaços em branco no final das linhas.

## Pre-commit

Recomendamos a utilização do [pre-commit](https://pre-commit.com/) para aplicar o guia de estilo.
Após instalar o pre-commit, execute o seguinte comando para instalar os hooks no seu repositório local:
```bash
pre-commit install
```

## Executar Testes Unitários

1. Prepare o ambiente de teste instalando os pacotes necessários (por exemplo, `torch`) no seu ambiente Python
2. Execute os testes unitários:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
