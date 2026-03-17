---
title: "Uso de GPUs no NVIDIA"
order: 16
section: "misc"
---

# Uso de GPUs no NVIDIA

Esta guía explica cómo utilizar GPUs de AMD y GPUs de Apple Silicon con PyTorch en el contexto de EvoX.

Aunque las GPUs de NVIDIA son una opción fiable y generalmente ofrecen un rendimiento sólido, los modelos más recientes están optimizados para cargas de trabajo de deep learning y modelos de lenguaje de gran tamaño. Muchas de sus funciones avanzadas, como el soporte para tipos de datos de baja precisión, están actualmente infrautilizadas en EvoX. En algunos casos, las GPUs que no son de NVIDIA pueden proporcionar un mejor rendimiento y un menor coste para tareas evolutivas.

## Soporte para GPUs de AMD

El soporte para GPUs de AMD en PyTorch se proporciona a través de ROCm. Los dispositivos AMD se reconocen como dispositivos `cuda` (al igual que las GPUs de NVIDIA). Para utilizar una GPU de AMD:

1. Instale la versión de PyTorch compatible con ROCm.
2. Utilice la configuración de dispositivo estándar, por ejemplo, `device = torch.device("cuda")`.

No se necesitan cambios adicionales más allá de utilizar la compilación de ROCm.

## Soporte para GPUs de Apple Silicon

Si tiene un Mac con Apple Silicon, puede aprovechar la GPU integrada para acelerar sus cargas de trabajo de EvoX.
Las GPUs de Apple Silicon son compatibles a través del backend Metal Performance Shaders (MPS) y son accesibles utilizando el dispositivo `mps` en PyTorch.

Para utilizar una GPU de Apple Silicon:

1. Asegúrese de tener instalada la versión de PyTorch compatible con MPS.
2. Mueva sus tensores y modelos al dispositivo `mps`, por ejemplo, `device = torch.device("mps")`.

> **Nota:**
> El dispositivo `mps` **no** admite la compilación (por ejemplo, `#evox.compile`).