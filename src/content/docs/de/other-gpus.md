---
title: "Nicht-NVIDIA-GPUs verwenden"
order: 16
section: "misc"
---

# Nicht-NVIDIA-GPUs verwenden

Dieser Leitfaden erklärt, wie Sie AMD-GPUs und Apple-Silicon-GPUs mit PyTorch im Kontext von EvoX verwenden.

Während NVIDIA-GPUs eine zuverlässige Wahl sind und im Allgemeinen eine starke Leistung bieten, sind neuere Modelle für Deep-Learning-Workloads und große Sprachmodelle optimiert. Viele ihrer erweiterten Funktionen, wie die Unterstützung von Datentypen mit niedriger Präzision, werden in EvoX derzeit nicht ausreichend genutzt. In einigen Fällen können Nicht-NVIDIA-GPUs eine bessere Leistung und niedrigere Kosten für evolutionäre Aufgaben bieten.

## AMD-GPU-Unterstützung

Die AMD-GPU-Unterstützung in PyTorch wird über ROCm bereitgestellt. AMD-Geräte werden als `cuda`-Geräte erkannt (genau wie NVIDIA-GPUs). Um eine AMD-GPU zu verwenden:

1. Installieren Sie die ROCm-kompatible Version von PyTorch.
2. Verwenden Sie die Standard-Geräteeinrichtung, z.B. `device = torch.device("cuda")`.

Über die Verwendung des ROCm-Builds hinaus sind keine zusätzlichen Änderungen erforderlich.

## Apple-Silicon-GPU-Unterstützung

Wenn Sie einen Apple-Silicon-Mac besitzen, können Sie die eingebaute GPU nutzen, um Ihre EvoX-Workloads zu beschleunigen.
Apple-Silicon-GPUs werden über das Metal Performance Shaders (MPS)-Backend unterstützt und sind über das `mps`-Gerät in PyTorch zugänglich.

Um eine Apple-Silicon-GPU zu verwenden:

1. Stellen Sie sicher, dass die MPS-kompatible Version von PyTorch installiert ist.
2. Verschieben Sie Ihre Tensoren und Modelle auf das `mps`-Gerät, z.B. `device = torch.device("mps")`.

> **Hinweis:**
> Das `mps`-Gerät unterstützt **keine** Kompilierung (z.B. `#evox.compile`).
