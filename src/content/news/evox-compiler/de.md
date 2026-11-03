---
title: "EvoX Compiler v0.1.0: Explizite Tensorgraphen, mehrere Backends"
pubDate: 2026-10-29
summary: "Die erste Version von EvoX Compiler bringt prüfbare Berechnungsgraphen, kombinierbare Transformationen und NumPy-, IREE-, XLA- und TVM-Ausführung nach Python."
---

**EvoX Compiler (evoxc) v0.1.0 wurde am 29. Oktober 2026 veröffentlicht.** Der Tensorgraph-Compiler samt Laufzeit für Python richtet sich an Entwickler, die Programme selbst prüfen, transformieren, speichern und ausführen möchten. Das Projekt nutzt Apache-2.0 und benötigt Python 3.11 oder neuer.

## Ein prüfbares Programm

evoxc macht jede Stufe über `trace → lower → compile → load → run` zugänglich. Das Frontend stellt Berechnungen in EvoXIR dar und exportiert StableHLO für externe Compiler, die Optimierung und Codegenerierung übernehmen. Zwischengraphen und Artefakte bleiben prüfbar und speicherbar.

Graphtransformationen umfassen `vmap`, `grad`, `jvp` und `vjp`. Für neuronale Architektursuche, genetische Programmierung und Algorithmensynthese kann `batch_functions` Kandidaten mit übereinstimmenden Ein-/Ausgabespezifikationen in einem Graphen zusammenführen. Ein expliziter Kompilierungscache unterstützt wiederholt erzeugte statische Programme.

## Vier Ausführungspfade

NumPy ist die einzige Pflichtabhängigkeit und liefert den standardmäßigen CPU-Interpreter. Optionale Adapter verbinden den Graphen mit IREE, XLA über ein vom Nutzer bereitgestelltes PJRT-Plugin und TVM. Backend und Gerät werden explizit gewählt; die Abdeckung hängt vom Adapter ab. Dokumentiert sind Vulkan auf Mesa lavapipe und TVM-ROCm-Unterstützung nur beim Kompilieren.

Die Release-README meldet **7,511 bestandene, 77 übersprungene, 4 erwartungsgemäß fehlgeschlagene Tests und 0 Fehler** für Kern und `evoxc_hf` mit installiertem IREE, TVM und torch. Dies sind Projektangaben für diese Konfiguration. Laut Repository wurden Code, Tests und Dokumentation mit EvoX Genesis erstellt.

## Einstieg

Installieren Sie diese Version mit dem folgenden Befehl. Optionale Compileradapter sind in der versionierten README beschrieben; die HuggingFace-Anbindung wird separat als `evoxc-hf` verteilt.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
