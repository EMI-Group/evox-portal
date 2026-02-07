---
title: "Ambiente di Sviluppo"
order: 3
section: "developer"
---

# Ambiente di Sviluppo

## Clona il repository e installalo in modalità modificabile (consigliato)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # installa il pacchetto in modalità modificabile con le dipendenze di test
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
2. Assicurati che non ci siano spazi bianchi finali.

## Pre-commit

Consigliamo di usare [pre-commit](https://pre-commit.com/) per applicare la guida di stile.
Dopo aver installato pre-commit, esegui il seguente comando per installare gli hook nel tuo repository locale:
```bash
pre-commit install
```

## Esecuzione dei Test Unitari

1. Prepara l'ambiente di test installando i pacchetti richiesti (ad es. `torch`) nel tuo ambiente Python
2. Esegui unittest:
```shell
# esegui tutti i test
python -m unittest
# esegui i test in [percorso], ad es. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# esegui un metodo o modulo di test specifico, ad es. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
