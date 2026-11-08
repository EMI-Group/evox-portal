---
title: "EvoX 1.1 Release: Jetzt mit torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 ersetzt TorchScript durch torch.compile. TorchDynamo erfasst Berechnungsgraphen während der Python-Ausführung."
---

![Sichtbare Programmstruktur zur Compilerprüfung](./execution-graph-capture.webp)

## Neues Compiler-Backend

EvoX 1.1 ersetzt TorchScript durch `torch.compile`. TorchDynamo erfasst Berechnungsgraphen während der Python-Ausführung.

## Workflow-Kompilierung

Workflow-Schritte können kompiliert werden, um unterstützte Tensoroperationen gemeinsam mit dem PyTorch-Compiler zu optimieren.

## Kompatibilität

Die Grapherfassung hängt von Operationen und Kontrollfluss ab. Nicht unterstützter Code kann Graph Breaks verursachen; nicht jeder Aufruf einer Python-Bibliothek wird kompiliert.

## Ressourcen

- [GitHub](https://github.com/EMI-Group/evox)
- [Dokumentation](https://evox.readthedocs.io/en/latest/)
