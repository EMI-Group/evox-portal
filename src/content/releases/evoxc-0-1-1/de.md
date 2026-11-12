---
title: "EvoX Compiler v0.1.1: Weniger Vorbereitung vor dem Populationslauf"
pubDate: 2026-10-30
summary: "Die Veröffentlichung vom 30. Oktober verbessert Programmbündelung, Graphvorbereitung und Backend-Fehlerbehandlung einschließlich einer XLA-Sperrkorrektur."
---

Bei der Suche nach Programmen gehört die Kompilierung zum Versuchsbudget. Dauert die Graphvorbereitung jeder Generation lange, löst schnellere Geräteausführung nur einen Teil des Problems. [EvoX Compiler v0.1.1][s1] vom 30. Oktober 2026 verbessert diese Vorbereitung und korrigiert Backend-Fehlerfälle. Die [45 Commits][s2] bauen auf der expliziten Graphpipeline von v0.1.0 auf.

![Unterschiedliche Programmstrukturen werden in kompakte parallele Gruppen geordnet](./cover.webp)

*Konzeptillustration: Eine Programmpopulation wird vor der Kompilierung organisiert.*

## Programmgruppen brauchen ein Kostenmodell

`batch_functions` verbindet kompatible Kandidatenprogramme zu einem Graphen. Die Version propagiert Zeilenabhängigkeiten durch den internen Klassengraphen und erweitert die geometrische Bandsuche von `bands="auto"`. Damit wird genauer erfasst, welche Arbeit von einzelnen Populationsmitgliedern abhängt und wie Kandidaten gruppiert werden können.

In genetischer Programmierung können Programme dieselbe Eingabesignatur, aber unterschiedliche Operationen besitzen. Eine einzige flache Gruppe ist nicht zwangsläufig am günstigsten. Bänder bieten eine weitere Organisation; die automatische Strategie vergleicht sie anhand ihres Kostenmodells. Entscheidend bleibt die Semantik: Zeile i des vereinten Ergebnisses muss dem Einzellauf von Kandidat i entsprechen. Die Version aktualisiert entsprechende Regressionstests.

## Wiederholte Vorbereitungsarbeit entfernen

Mehrere Änderungen reduzieren CPU-Arbeit vor der Ausführung: Quellpositionen werden durch direktes Durchlaufen von Frames erfasst, doppelte Prüfungen beim Lowering entfallen, und IR-Verifikation nutzt lineare Verwendungsverfolgung sowie zwischengespeicherte Ergebnistypinferenz. StableHLO gewinnt gebündelte Konstantentextausgabe, Typtext-Caches und tabellengesteuerte Operationszuordnung.

Die Verbesserungen betreffen unterschiedliche Stufen. Schnellere Ausgabe bedeutet keinen schnelleren GPU-Kernel. Messen Sie Tracing, Transformation, Lowering, Kompilierung und stationäre Ausführung getrennt. Große Populationen mit vielen Konstanten können andere Kosten haben als kleine Graphen mit teuren numerischen Kerneln.

## Backend-Fehler besser einordnen

IREE meldet eine HAL-Bindungsgrenze pro Dispatch jetzt als handlungsorientierten `BackendError`. Ressourcenlimits lassen sich dadurch besser von Fehlern des numerischen Programms unterscheiden. XLA hält die Sperre gemeinsam genutzter Clients nicht mehr über `PJRT_Client_Create` hinweg und verhindert damit einen Deadlock durch einen Finalizer desselben Threads. Ein Regressionstest begleitet die Korrektur.

Die Unterstützung folgt weiterhin der versionierten Matrix. NumPy bietet den CPU-Interpreter; IREE, XLA und TVM haben verschiedene Abhängigkeiten und Geräteanforderungen. Der Interpreter ist eine hilfreiche Referenz vor der kompilierten Ausführung. Das [versionierte README][s3] erklärt Grenzen und explizite Datenübertragungen.

## Mit einer repräsentativen Population aktualisieren

Installieren Sie die Basis mit `pip install evoxc==0.1.1`, IREE mit `pip install "evoxc[iree]==0.1.1"`. Python 3.11 oder neuer ist erforderlich. Die separate Distribution `evoxc-hf` hat einen eigenen Versionszyklus. Bewahren Sie vorhandene Backend-Plugin-Einstellungen auf.

Vergleichen Sie für eine gespeicherte Population und feste Eingaben vereinte Ausgaben mit einzelnen Referenzläufen. Messen Sie anschließend Vorbereitung und Ausführung separat. Bei Bindungsfehlern Graph und Backend-Details zur Diagnose aufbewahren, statt das Experiment stillschweigend zu verändern. Der [v0.1.0-Überblick][related] erklärt die Pipeline; v0.1.1 macht ihre Vorbereitung und Grenzen praktikabler.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /de/releases/evoxc-0-1-0
