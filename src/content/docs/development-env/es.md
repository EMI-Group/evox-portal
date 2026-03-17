---
title: "Entorno de desarrollo"
order: 3
section: "developer"
---

# Entorno de desarrollo

## Clonar el repositorio e instalarlo en modo editable (recomendado)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Activa el entorno Nix ejecutando el siguiente comando:
```bash
nix develop .
```
Esto creará una shell con todas las dependencias necesarias y un directorio `.venv` con el entorno de Python.

## Guía de estilo

EvoX tiene la siguiente guía de estilo:
1. Asegúrate de usar [ruff](https://docs.astral.sh/ruff/) para analizar (lint) tu código.
2. Asegúrate de que no haya espacios en blanco al final de las líneas.

## Pre-commit

Recomendamos usar [pre-commit](https://pre-commit.com/) para aplicar la guía de estilo.
Tras instalar pre-commit, ejecuta el siguiente comando para instalar los hooks en tu repositorio local:
```bash
pre-commit install
```

## Ejecutar pruebas unitarias

1. Prepara el entorno de pruebas instalando los paquetes necesarios (por ejemplo, `torch`) en tu entorno de Python.
2. Ejecuta `unittest`:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```