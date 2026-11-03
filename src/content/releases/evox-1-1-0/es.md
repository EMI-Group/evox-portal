---
title: "Lanzamiento de EvoX 1.1: Ahora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 sustituye TorchScript por torch.compile. TorchDynamo captura grafos de cálculo durante la ejecución de Python."
---

## Actualización del compilador

EvoX 1.1 sustituye TorchScript por `torch.compile`. TorchDynamo captura grafos de cálculo durante la ejecución de Python.

## Compilación de flujos de trabajo

Los pasos del flujo pueden compilarse para optimizar conjuntamente las operaciones tensoriales compatibles con el compilador de PyTorch.

## Compatibilidad

La captura depende de las operaciones y del flujo de control. El código no compatible puede interrumpir el grafo; no todas las llamadas a bibliotecas Python se compilan.

## Recursos

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentación](https://evox.readthedocs.io/en/latest/)
