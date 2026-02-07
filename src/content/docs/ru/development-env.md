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
pip install -e ".[test]" # установка пакета в режиме редактирования с тестовыми зависимостями
```

## Nix

Активируйте окружение Nix, выполнив следующую команду:
```bash
nix develop .
```
Это создаст оболочку со всеми необходимыми зависимостями и каталог `.venv` с окружением Python.

## Руководство по стилю

EvoX имеет следующее руководство по стилю:
1. Убедитесь, что используете [ruff](https://docs.astral.sh/ruff/) для проверки кода.
2. Убедитесь, что нет завершающих пробелов.

## Pre-commit

Мы рекомендуем использовать [pre-commit](https://pre-commit.com/) для соблюдения руководства по стилю.
После установки pre-commit выполните следующую команду для установки хуков в вашем локальном репозитории:
```bash
pre-commit install
```

## Запуск модульных тестов

1. Подготовьте тестовое окружение, установив необходимые пакеты (например, `torch`) в вашем окружении Python
2. Запустите unittest:
```shell
# запуск всех тестов
python -m unittest
# запуск тестов в [path], например python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# запуск конкретного тестового метода или модуля, например python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```
