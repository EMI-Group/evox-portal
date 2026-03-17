---
title: "Environnement de développement"
order: 3
section: "developer"
---

# Environnement de développement

## Cloner le dépôt et l'installer en mode éditable (recommandé)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Activez l'environnement Nix en exécutant la commande suivante :
```bash
nix develop .
```
Cela créera un shell avec toutes les dépendances nécessaires et un répertoire `.venv` contenant l'environnement Python.

## Guide de style

EvoX suit le guide de style suivant :
1. Assurez-vous d'utiliser [ruff](https://docs.astral.sh/ruff/) pour linter votre code.
2. Assurez-vous qu'il n'y a pas d'espaces en fin de ligne.

## Pre-commit

Nous recommandons d'utiliser [pre-commit](https://pre-commit.com/) pour faire respecter le guide de style.
Après avoir installé pre-commit, exécutez la commande suivante pour installer les hooks dans votre dépôt local :
```bash
pre-commit install
```

## Exécuter les tests unitaires

1. préparez l'environnement de test en installant les paquets requis (par exemple, `torch`) dans votre environnement Python
2. lancez unittest :
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```