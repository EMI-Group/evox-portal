---
title: "Usar GPUs No-NVIDIA"
order: 16
section: "misc"
---

# Usar GPUs No-NVIDIA

Esta guia explica como usar GPUs AMD y GPUs Apple Silicon con PyTorch en el contexto de EvoX.

Aunque las GPUs NVIDIA son una opcion confiable y generalmente ofrecen un rendimiento solido, los modelos mas nuevos estan optimizados para cargas de trabajo de aprendizaje profundo y modelos de lenguaje grandes. Muchas de sus caracteristicas avanzadas, como el soporte para tipos de datos de baja precision, actualmente estan infrautilizadas en EvoX. En algunos casos, las GPUs no-NVIDIA pueden proporcionar mejor rendimiento y menor costo para tareas evolutivas.

## Soporte para GPU AMD

El soporte para GPU AMD en PyTorch se proporciona a traves de ROCm. Los dispositivos AMD se reconocen como dispositivos `cuda` (al igual que las GPUs NVIDIA). Para usar una GPU AMD:

1. Instale la version de PyTorch compatible con ROCm.
2. Use la configuracion estandar de dispositivo, por ejemplo, `device = torch.device("cuda")`.

No se necesitan cambios adicionales mas alla de usar la compilacion ROCm.

## Soporte para GPU Apple Silicon

Si posee un Mac con Apple Silicon, puede aprovechar la GPU integrada para acelerar sus cargas de trabajo de EvoX.
Las GPUs Apple Silicon son compatibles a traves del backend Metal Performance Shaders (MPS) y son accesibles usando el dispositivo `mps` en PyTorch.

Para usar una GPU Apple Silicon:

1. Asegurese de tener instalada la version de PyTorch compatible con MPS.
2. Mueva sus tensores y modelos al dispositivo `mps`, por ejemplo, `device = torch.device("mps")`.

> **Nota:**
> El dispositivo `mps` **no** soporta compilacion (por ejemplo, `#evox.compile`).
