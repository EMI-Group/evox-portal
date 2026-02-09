---
title: "Ambiente di sviluppo"
order: 3
section: "developer"
---

# Ambiente di sviluppo

## Clonare il repository e installarlo in modalità modificabile (consigliato)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Abilita l'ambiente Nix eseguendo il seguente comando:
```bash
nix develop .
```
Questo creerà una shell con tutte le dipendenze necessarie e una directory `.venv` con l'ambiente Python.

## Guida di stile

EvoX ha la seguente guida di stile:
1. Assicurati di usare [ruff](https://docs.astral.sh/ruff/) per il linting del tuo codice.
2. Assicurati che non ci siano spazi bianchi in coda.

## Pre-commit

Consigliamo di usare [pre-commit](https://pre-commit.com/) per applicare la guida di stile.
Dopo aver installato pre-commit, esegui il seguente comando per installare gli hook nel tuo repository locale:
```bash
pre-commit install
```

## Eseguire gli Unit Test

1. prepara l'ambiente di test installando i pacchetti richiesti (ad es. `torch`) nel tuo ambiente Python
2. esegui unittest:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```