---
title: "Среда разработки"
order: 3
section: "developer"
---

# Среда разработки

## Клонирование репозитория и установка в режиме редактирования (рекомендуется)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Активируйте окружение Nix, выполнив следующую команду:
```bash
nix develop .
```
Это создаст оболочку со всеми необходимыми зависимостями и директорию `.venv` с окружением Python.

## Руководство по стилю

В EvoX приняты следующие правила оформления кода:
1. Обязательно используйте [ruff](https://docs.astral.sh/ruff/) для линтинга вашего кода.
2. Убедитесь в отсутствии лишних пробелов в конце строк (trailing whitespaces).

## Pre-commit

Мы рекомендуем использовать [pre-commit](https://pre-commit.com/) для соблюдения руководства по стилю.
После установки pre-commit выполните следующую команду, чтобы установить хуки в вашем локальном репозитории:
```bash
pre-commit install
```

## Запуск модульных тестов (Unit Test)

1. Подготовьте тестовую среду, установив необходимые пакеты (например, `torch`) в ваше окружение Python.
2. Запустите unittest:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```