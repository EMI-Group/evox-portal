---
title: "Entwicklungsumgebung"
order: 3
section: "developer"
---

# Entwicklungsumgebung

## Das Repository klonen und im bearbeitbaren Modus installieren (empfohlen)

```bash
git clone https://github.com/EMI-Group/evox.git
cd evox
pip install -e ".[test]" # install the package in editable mode with test dependencies
```

## Nix

Aktivieren Sie die Nix-Umgebung, indem Sie den folgenden Befehl ausführen:
```bash
nix develop .
```
Dies erstellt eine Shell mit allen notwendigen Abhängigkeiten und einem `.venv`-Verzeichnis mit der Python-Umgebung.

## Style Guide

EvoX hat den folgenden Style Guide:
1. Stellen Sie sicher, dass Sie [ruff](https://docs.astral.sh/ruff/) verwenden, um Ihren Code zu linten.
2. Stellen Sie sicher, dass keine nachgestellten Leerzeichen (trailing whitespaces) vorhanden sind.

## Pre-commit

Wir empfehlen die Verwendung von [pre-commit](https://pre-commit.com/), um den Style Guide durchzusetzen.
Führen Sie nach der Installation von pre-commit den folgenden Befehl aus, um die Hooks in Ihrem lokalen Repository zu installieren:
```bash
pre-commit install
```

## Unit-Tests ausführen

1. Bereiten Sie die Testumgebung vor, indem Sie die erforderlichen Pakete (z. B. `torch`) in Ihrer Python-Umgebung installieren.
2. Führen Sie unittest aus:
```shell
# run all tests
python -m unittest
# run tests in [path], e.g. python -m unittest unit_test/core/test_jit_util.py
python -m unittest [path-to-test-file]
# run a specific test method or module, e.g. python -m unittest unit_test.core.test_jit_util.TestJitUtil.test_single_eval
python -m unittest [path-to-method-or-module]
```