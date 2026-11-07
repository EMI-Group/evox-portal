---
title: "EvoX Compiler v0.1.0: Eine Rechengrundlage für evolvierende Programme"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "EvoX Compiler trennt Programmrepräsentation, Transformation und Ausführung als Grundlage für Experimente mit Programmpopulationen und verschiedenen Backends."
---

*Aktualisiert am 7. November 2026. Historische Ergebnisse behalten ihren ursprünglichen Bezugszeitpunkt.*

EvoXs Vision evolutionärer KI erfordert Rechensysteme für veränderliche Kandidaten, darunter Programme mit unterschiedlichen Strukturen. EvoX Compiler setzt an dieser Grundlage an: Explizite Graphen erlauben Prüfung und Transformation vor der Ausführung; Backend-Schnittstellen verbinden unterstützte Berechnungen mit verschiedenen Ausführungssystemen.

Bei numerischen Programmen zählt nicht nur das Ergebnis: Forschende möchten Graphen untersuchen, transformieren, Backends vergleichen und Kompilate speichern. **EvoX Compiler (evoxc) v0.1.0**, veröffentlicht am 29. Oktober 2026, macht diese Schritte explizit. Das Python-Frontend mit Laufzeitumgebung für Tensorgraphen nutzt Apache-2.0 und benötigt Python ab 3.11.

## Von der Definition zum ausführbaren Objekt

Die Pipeline lautet `trace → lower → compile → load → run`. Tracing erzeugt EvoXIR aus Definition und Eingabespezifikationen. Lowering bereitet die Backend-Darstellung vor; Kompilierung erzeugt ein Artefakt, das geladen, an ein Gerät gebunden und mit Daten ausgeführt wird. Jede Stufe liefert ein untersuchbares Objekt.

Ungültige Graphen, nicht unterstützte Operationen und Gerätefehler lassen sich so unterscheiden. Graphen und unterstützte Artefakte sind speicherbar. Externe Compiler übernehmen Optimierung, Scheduling und Codegenerierung; evoxc stellt Frontend und Stufenvertrag bereit.

## Graphtransformationen für evolutionäre Suche

`vmap`, `grad`, `jvp` und `vjp` erzeugen vor der Ausführung kombinierbare Graphen. `batch_functions` fasst Kandidatenfunktionen mit passenden Ein- und Ausgabespezifikationen zu einem Populationsgraphen zusammen.

Das betrifft genetische Programmierung, Architektursuche und Algorithmussynthese: Kandidaten können unterschiedliche Programme statt nur Parametervektoren sein. Zusammenführen kann Kompilierung und Aufrufe reduzieren; der Nutzen hängt aber von Struktur und Backend ab und ist nicht garantiert.

## Einen Ausführungspfad wählen

NumPy ist die einzige Pflichtabhängigkeit und liefert den CPU-Referenzinterpreter. Optionale Adapter verbinden IREE, XLA über ein bereitgestelltes PJRT-Plugin und TVM über StableHLO. Operator- und Hardwareabdeckung sind unterschiedlich.

Die versionierte README dokumentiert Vulkan auf dem Softwaregerät Mesa lavapipe und TVM ROCm lediglich als kompiliert. GPU-Eingaben und Gerätezuordnung sind explizit. Prüfen Sie unterstützte Operationen, bevor Sie einen CPU-Graphen übertragen.

## Mit der Referenz beginnen

Installieren Sie die feste Version, führen Sie das CPU-Beispiel der README aus, prüfen Sie den Graphen und wählen Sie danach einen Compiler-Backend:

```bash
pip install evoxc==0.1.0
```

Die HuggingFace-Integration heißt separat `evoxc-hf`. Compiler und EvoX-Optimierungspaket haben unterschiedliche Versionsnummern.

## Validierung als Teil der Rechengrundlage

Die README meldet **7.511 bestandene, 77 übersprungene und 4 erwartete Fehlschläge**, ohne Fehler, in der dokumentierten Kern- und Integrationsumgebung. Das validiert nicht jede Hardware. Das Repository nennt Genesis als Werkzeug für Code, Tests und Dokumentation.

API und Unterstützung stehen in der [versionierten README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), Artefakte im [Release](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0), weitere Entwicklung auf [GitHub](https://github.com/EMI-Group/evoxc).
