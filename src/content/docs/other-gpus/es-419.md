---
title: "Uso de GPUs que no sean NVIDIA"
order: 16
section: "misc"
---

# Uso de GPUs que no sean NVIDIA

Esta guía explica cómo utilizar GPUs AMD y GPUs Apple Silicon con PyTorch en el contexto de EvoX.

Si bien las GPUs NVIDIA son una opción confiable y generalmente ofrecen un alto rendimiento, los modelos más nuevos están optimizados para cargas de trabajo de deep learning y modelos de lenguaje de gran tamaño. Muchas de sus funciones avanzadas, como el soporte para tipos de datos de baja precisión, están actualmente subutilizadas en EvoX. En algunos casos, las GPUs que no son NVIDIA pueden proporcionar un mejor rendimiento y un menor costo para tareas evolutivas.

## Soporte para GPUs AMD

El soporte para GPUs AMD en PyTorch se proporciona a través de ROCm. Los dispositivos AMD se reconocen como dispositivos `cuda` (al igual que las GPUs NVIDIA). Para usar una GPU AMD:

1. Instala la versión de PyTorch compatible con ROCm.
2. Utiliza la configuración de dispositivo estándar, por ejemplo, `device = torch.device("cuda")`.

No se necesitan cambios adicionales más allá de usar la compilación de ROCm.

## Soporte para GPUs Apple Silicon

Si tienes una Mac con Apple Silicon, puedes aprovechar la GPU integrada para acelerar tus cargas de trabajo de EvoX.
Las GPUs Apple Silicon son compatibles a través del backend Metal Performance Shaders (MPS) y son accesibles utilizando el dispositivo `mps` en PyTorch.

Para usar una GPU Apple Silicon:

1. Asegúrate de tener instalada la versión de PyTorch compatible con MPS.
2. Mueve tus tensores y modelos al dispositivo `mps`, por ejemplo, `device = torch.device("mps")`.

> **Nota:**
> El dispositivo `mps` **no** admite la compilación (por ejemplo, `#evox.compile`).