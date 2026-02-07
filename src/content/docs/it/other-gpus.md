---
title: "Utilizzo di GPU Non-NVIDIA"
order: 16
section: "misc"
---

# Utilizzo di GPU Non-NVIDIA

Questa guida spiega come utilizzare GPU AMD e GPU Apple Silicon con PyTorch nel contesto di EvoX.

Sebbene le GPU NVIDIA siano una scelta affidabile e generalmente offrano prestazioni elevate, i modelli più recenti sono ottimizzati per carichi di lavoro di deep learning e modelli linguistici di grandi dimensioni. Molte delle loro funzionalità avanzate, come il supporto per tipi di dati a bassa precisione, sono attualmente sottoutilizzate in EvoX. In alcuni casi, le GPU non-NVIDIA possono offrire prestazioni migliori e costi inferiori per le attività evolutive.

## Supporto GPU AMD

Il supporto GPU AMD in PyTorch è fornito tramite ROCm. I dispositivi AMD sono riconosciuti come dispositivi `cuda` (proprio come le GPU NVIDIA). Per usare una GPU AMD:

1. Installa la versione di PyTorch compatibile con ROCm.
2. Usa la configurazione standard del dispositivo, ad es. `device = torch.device("cuda")`.

Non sono necessarie modifiche aggiuntive oltre all'uso della build ROCm.

## Supporto GPU Apple Silicon

Se possiedi un Mac con Apple Silicon, puoi sfruttare la GPU integrata per accelerare i tuoi carichi di lavoro EvoX.
Le GPU Apple Silicon sono supportate tramite il backend Metal Performance Shaders (MPS) e sono accessibili usando il dispositivo `mps` in PyTorch.

Per usare una GPU Apple Silicon:

1. Assicurati di avere installata la versione di PyTorch compatibile con MPS.
2. Sposta i tuoi tensori e modelli sul dispositivo `mps`, ad es. `device = torch.device("mps")`.

> **Nota:**
> Il dispositivo `mps` **non** supporta la compilazione (ad es. `#evox.compile`).
