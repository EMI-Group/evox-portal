---
title: "Entorno de Desarrollo"
order: 3
section: "developer"
---

# Entorno de Desarrollo

## Clonar el repositorio e instalarlo en modo editable (recomendado)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # instalar el paquete en modo editable con dependencias de prueba
```

## Nix

Habilita el entorno Nix ejecutando el siguiente comando:
```bash
nix develop .
```
Esto creara un shell con todas las dependencias necesarias y un directorio `.venv` con el entorno Python.

## Guia de estilo

EvoX tiene la siguiente guia de estilo:
1. Asegurate de usar [ruff](https://docs.astral.sh/ruff/) para verificar tu codigo.
2. Asegurate de que no haya espacios en blanco al final de las lineas.

## Pre-commit

Recomendamos usar [pre-commit](https://pre-commit.com/) para aplicar la guia de estilo.
Despues de instalar pre-commit, ejecuta el siguiente comando para instalar los hooks en tu repositorio local:
```bash
pre-commit install
```

## Ejecutar Pruebas Unitarias

1. Prepara el entorno de prueba instalando los paquetes requeridos (por ejemplo, `torch`) en tu entorno Python
2. Ejecuta unittest:
```shell
# ejecutar todas las pruebas
python -m unittest
# ejecutar pruebas en [ruta], por ejemplo python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# ejecutar un metodo o modulo de prueba especifico, por ejemplo python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
