---
title: "Verwendung von Nicht-NVIDIA-GPUs"
order: 16
section: "misc"
---

# Verwendung von Nicht-NVIDIA-GPUs

Diese Anleitung erklärt, wie Sie AMD-GPUs und Apple Silicon-GPUs mit PyTorch im Kontext von EvoX verwenden können.

Während NVIDIA-GPUs eine zuverlässige Wahl sind und im Allgemeinen eine starke Leistung bieten, sind neuere Modelle für Deep-Learning-Workloads und Large Language Models optimiert. Viele ihrer fortschrittlichen Funktionen, wie die Unterstützung für Datentypen mit geringer Präzision, werden derzeit in EvoX nur unzureichend genutzt. In einigen Fällen können Nicht-NVIDIA-GPUs eine bessere Leistung und geringere Kosten für evolutionäre Aufgaben bieten.

## AMD-GPU-Unterstützung

Die Unterstützung für AMD-GPUs in PyTorch wird über ROCm bereitgestellt. AMD-Geräte werden als `cuda`-Geräte erkannt (genau wie NVIDIA-GPUs). Um eine AMD-GPU zu verwenden:

1. Installieren Sie die ROCm-kompatible Version von PyTorch.
2. Verwenden Sie das Standard-Device-Setup, z. B. `device = torch.device("cuda")`.

Abgesehen von der Verwendung des ROCm-Builds sind keine weiteren Änderungen erforderlich.

## Apple Silicon-GPU-Unterstützung

Wenn Sie einen Apple Silicon Mac besitzen, können Sie die integrierte GPU nutzen, um Ihre EvoX-Workloads zu beschleunigen.
Apple Silicon-GPUs werden über das Backend der Metal Performance Shaders (MPS) unterstützt und sind in PyTorch über das `mps`-Device zugänglich.

So verwenden Sie eine Apple Silicon-GPU:

1. Stellen Sie sicher, dass Sie die MPS-kompatible Version von PyTorch installiert haben.
2. Verschieben Sie Ihre Tensoren und Modelle auf das `mps`-Device, z. B. `device = torch.device("mps")`.

> **Hinweis:**
> Das `mps`-Device unterstützt **keine** Kompilierung (z. B. `#evox.compile`).