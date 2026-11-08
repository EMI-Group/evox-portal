---
title: "EvoX Compiler v0.1.0: Das Programm vor der Ausführung prüfen"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "Explizite Graphen, kombinierbare Transformationen und getrennte Ausführungsstufen machen Kandidatenprogramme prüfbar und gemeinsam auswertbar."
---

Sind die Kandidaten einer Suche selbst Programme, bleibt beim Debuggen nur der Endausgabe vieles verborgen. EvoX Compiler macht das Programm selbst zugänglich: Forschende können seinen Graphen aufbewahren, transformieren und über getrennte, sichtbare Stufen ein Ausführungsbackend wählen.

![Schwebende Graphschichten werden zu einer ausgerichteten Struktur und einem kompakten roten Artefakt](./evoxc-visible-stages.webp)

*Konzeptillustration: Zwischen Definition und Ausführung wird die Programmstruktur sichtbar.*

**EvoX Compiler (evoxc) v0.1.0** erschien am 29. Oktober 2026. Das Python-Frontend samt Laufzeit für Tensorgraphen benötigt Python 3.11 oder neuer und steht unter Apache-2.0. [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## Von der Definition zum prüfbaren ausführbaren Objekt

Die Pipeline lautet `trace → lower → compile → load → run`. Tracing erzeugt EvoXIR aus Definition und Eingabespezifikationen. Lowering bereitet die Backend-Darstellung vor; Kompilierung erzeugt ein Artefakt, das geladen, an ein Gerät gebunden und mit Daten ausgeführt wird. Jede Stufe liefert ein untersuchbares Objekt.

Ungültige Graphen, nicht unterstützte Operationen und Gerätefehler lassen sich so unterscheiden. Graphen und unterstützte Artefakte sind speicherbar. Externe Compiler übernehmen Optimierung, Scheduling und Codegenerierung; evoxc stellt Frontend und Stufenvertrag bereit.

## Eine Programmpopulation in einem Graphen bündeln

`vmap`, `grad`, `jvp` und `vjp` erzeugen vor der Ausführung kombinierbare Graphen. [`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) fasst Kandidatenfunktionen mit passenden Ein- und Ausgabespezifikationen zu einem Populationsgraphen zusammen.

Das betrifft genetische Programmierung, Architektursuche und Algorithmussynthese: Kandidaten können unterschiedliche Programme statt nur Parametervektoren sein. Zusammenführen kann Kompilierung und Aufrufe reduzieren; der Nutzen hängt aber von Struktur und Backend ab und ist nicht garantiert.

## Das Backend nach benötigten Operationen wählen

NumPy ist die einzige Pflichtabhängigkeit und liefert den CPU-Referenzinterpreter. Optionale Adapter verbinden IREE, XLA über ein bereitgestelltes PJRT-Plugin und TVM über StableHLO. Operator- und Hardwareabdeckung sind unterschiedlich.

Die versionierte README dokumentiert Vulkan auf dem Softwaregerät Mesa lavapipe und TVM ROCm lediglich als kompiliert. GPU-Eingaben und Gerätezuordnung sind explizit. Prüfen Sie unterstützte Operationen, bevor Sie einen CPU-Graphen übertragen.

## Auf der CPU beginnen, dann den Graphen übertragen

Installieren Sie die feste Version, führen Sie das CPU-Beispiel der README aus, prüfen Sie den Graphen und wählen Sie danach einen Compiler-Backend:

```bash
pip install evoxc==0.1.0
```

Die separate HuggingFace-Integration wird als `evoxc-hf` installiert und besitzt einen eigenen Veröffentlichungs- und Aktualisierungszyklus.

## Validierung im Kontext ihrer Umgebung lesen

Mit den dokumentierten optionalen Abhängigkeiten meldet die Release-README **7.511 bestandene, 77 übersprungene und 4 erwartete Fehlschläge**, ohne unerwartete Fehler, in Kern- und Integrationstests. Übersprungene Tests umfassen Hardware- und Abhängigkeitsbedingungen. Das Repository nennt Genesis als Erzeuger von Code, Tests und Dokumentation.

API und Unterstützung stehen in der [versionierten README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), Artefakte im [Release](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0), weitere Entwicklung auf [GitHub](https://github.com/EMI-Group/evoxc).

Die Entwicklung mit Agenten beschreibt [Genesis und EvoX Compiler](/de/news/genesis-evoxc). Bewahren Sie für Ihr Experiment einen Referenzgraphen auf und prüfen Sie jede Transformation, bevor Sie das Verhalten der Backends vergleichen.
