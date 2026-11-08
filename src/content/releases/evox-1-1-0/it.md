---
title: "EvoX 1.1: ora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 sostituisce TorchScript con torch.compile. TorchDynamo cattura i grafi di calcolo durante l’esecuzione Python."
---

![Struttura del programma resa visibile per l’ispezione](./execution-graph-capture.webp)

## Aggiornamento del compilatore

EvoX 1.1 sostituisce TorchScript con `torch.compile`. TorchDynamo cattura i grafi di calcolo durante l’esecuzione Python.

## Compilazione dei workflow

I passaggi del workflow possono essere compilati per ottimizzare insieme le operazioni tensoriali supportate dal compilatore PyTorch.

## Compatibilità

La cattura dipende dalle operazioni e dal flusso di controllo. Il codice non supportato può interrompere il grafo; non tutte le chiamate alle librerie Python vengono compilate.

## Risorse

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentazione](https://evox.readthedocs.io/en/latest/)
