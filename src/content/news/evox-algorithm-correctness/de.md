---
title: "EvoX 1.4.1: Algorithmische Bedeutung in paralleler Suche bewahren"
pubDate: 2026-10-30
summary: "Korrekturen an SHADE, Differential Evolution und CMA-ES zeigen, warum evolutionäre Infrastruktur Effizienz und originalgetreues Algorithmusverhalten benötigt."
---

EvoX 1.4.1 vom 30. Oktober 2026 korrigiert Algorithmen und Laufzeitverhalten. Werden Tausende Kandidaten gemeinsam bewertet, kann ein kleiner Implementierungsfehler die Suche systematisch verändern. Evolutionäre Infrastruktur muss den beabsichtigten Algorithmus ebenso bewahren wie effizient ausführen.

## Laufender Code kann anders suchen

Bei SHADE passte sich der Erfolgshistorienspeicher für F und CR nicht an. Verbesserungen wurden nach dem Ersetzen der Fitness berechnet; Arithmetik mit NaN-gefüllten Arrays verunreinigte ausgewählte Werte. Die Korrektur berechnet Verbesserungen vor dem Update und wählt erfolgreiche Einträge mit `torch.where`.

Der gemeinsame binomiale Kreuzungsoperator verglich normalverteilte Zufallswerte mit einer Kreuzungswahrscheinlichkeit. Nun wird passend zur Wahrscheinlichkeit gleichverteilt gezogen. Verwandte Korrekturen initialisieren CoDE, SaDE und SHADE gleichverteilt innerhalb ihrer Grenzen. Das verändert erzeugte Kandidaten, nicht nur die Absturzfreiheit.

## Mathematik und Laufzeitbedingungen

CMA-ES-Korrekturen betreffen das Rang-eins-Kovarianzupdate, die Kumulationskonstante und Aliasing-Beschränkungen in `torch.cond`. Letztere reaktiviert auch einen abgeschalteten CMA-ES-Test. Formeln und Frameworkbedingungen müssen unabhängig geprüft werden.

Weitere Änderungen betreffen Initialisierung und Unterräume von Evolutionsstrategien, Turnierselektion, PSO-Gerätewechsel und Hypervolumen. Dokumentierte Korrekturen belegen keine Überlegenheit aller Algorithmen auf jedem Benchmark.

## Zuverlässigkeit gehört zur Infrastruktur

Bei Vergleichen sollten Version und Seed neben Zielfunktion, Population und Auswertungsbudget festgehalten werden. Betroffene Ergebnisse benötigen möglicherweise eine erneute Auswertung. Für EvoX müssen Tests der Algorithmussemantik gemeinsam mit Tensorisierung und Beschleunigung wachsen, damit experimentelle Rückmeldung der tatsächlich beabsichtigten Suche entspricht.

[1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · [2](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3) · [3](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716) · [4](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)
