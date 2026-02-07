---
title: "Ambiente de Desenvolvimento"
order: 3
section: "developer"
---

# Ambiente de Desenvolvimento

## Clonar o repositório e instalar em modo editável (recomendado)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # instalar o pacote em modo editável com dependências de teste
```

## Nix

Habilite o ambiente Nix executando o seguinte comando:
```bash
nix develop .
```
Isso criará um shell com todas as dependências necessárias e um diretório `.venv` com o ambiente Python.

## Guia de estilo

O EvoX possui o seguinte guia de estilo:
1. Certifique-se de usar o [ruff](https://docs.astral.sh/ruff/) para verificar seu código.
2. Certifique-se de que não há espaços em branco no final das linhas.

## Pre-commit

Recomendamos usar o [pre-commit](https://pre-commit.com/) para aplicar o guia de estilo.
Após instalar o pre-commit, execute o seguinte comando para instalar os hooks no seu repositório local:
```bash
pre-commit install
```

## Executar Testes Unitários

1. Prepare o ambiente de teste instalando os pacotes necessários (por exemplo, `torch`) no seu ambiente Python
2. Execute os testes unitários:
```shell
# executar todos os testes
python -m unittest
# executar testes em [caminho], ex: python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# executar um método ou módulo de teste específico, ex: python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
