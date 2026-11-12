---
title: "EvoMO v0.3.1: Ein breiteres Werkzeugset für Mehrzielexperimente"
pubDate: 2026-10-08
summary: "Die v0.3-Reihe erweitert tensorisierte Verfahren, korrigiert Auswahl und Benchmarks und dokumentiert reproduzierbare Vergleiche."
---

Mehrzieloptimierung braucht mehr als schnelle Auswertung: Auswahl muss Kompromisse bewahren, Benchmarkformeln müssen stimmen und Zustände wiederherstellbar sein. [EvoMO v0.3.1][s1], veröffentlicht am 8. Oktober 2026 nach Pekinger Zeit, ergänzt die Dokumentation. Die wesentlichen Erweiterungen und Korrekturen kamen mit [v0.3.0 am 24. September][s2].

![Verschiedene Suchinstrumente über einer Landschaft konkurrierender Ziele](./cover.webp)

*Konzeptillustration: Unterschiedliche Algorithmen erkunden unterschiedliche nützliche Kompromisse.*

## Mehr Verfahren auf gemeinsamer Tensorbasis

v0.3.0 ergänzt 48 tensorisierte Mehrzielalgorithmen. Eine gemeinsame Grundlage erleichtert Vergleiche im selben Auswertungsablauf, während Auswahl-, Variations- und Zustandsregeln unterschiedlich bleiben.

Für konkurrierende Ziele können Problem, Grenzen, Population und Budget fixiert und nur das Verfahren gewechselt werden. Der Nutzen liegt im Zugang zu anderem Suchverhalten. Die Anzahl allein beweist keine besseren Kompromisse für eine bestimmte Aufgabe.

## Korrekturen beeinflussen auch den Vergleich

Die Version korrigiert Populationserneuerung und Auswahl mehrerer Verfahren. Nichtdominiertes Sortieren endet nach der vollständig benötigten Grenzfront. Crowding-Distanzen behandeln konstante Ziele, kleine Populationen, Masken und Platzierung. PyTorch bleibt Standard; Triton ist ein ausdrücklich gewähltes experimentelles Backend. [Auswahländerungen][s3]

ZDT1–4 und ZDT6 erhalten zeilenweise Auswertungskorrekturen, darunter die dimensionsabhängige ZDT6-Formel. Monte-Carlo-Hypervolumen wird für Minimierung, Referenzpunkte, leere Eingaben und Sampling-Geräte korrigiert. Bei betroffenen Studien alte Ergebnisse behalten und kontrolliert neu vergleichen, statt Werte unterschiedlicher Definitionen zu vermischen.

## Nebenbedingungen und Simulation getrennt prüfen

Die Reihe baut auf 86 beschränkten Benchmarks, nebenbedingungsbewusstem NSGA-II und `UnifiedWorkflow` aus v0.2.2 auf. Hinzu kommen verzögerte Registrierung von Nebenbedingungspuffern, Checkpoint-Wiederherstellung und mitgelieferte Pareto-Front-Ressourcen. [Grundlage der Nebenbedingungen][s4]

MoRobtrol erhält Playground/MJX, aufgabenspezifische Ziele und Visualisierung sowie Verbesserungen an Normalisierung und Checkpoints. In Robotikvergleichen Simulator und Zieldefinitionen genauso sorgfältig wie den Optimierer dokumentieren. Ein besserer Pareto-Satz kann sonst nur eine geänderte Aufgabe oder Metrik widerspiegeln. [Simulation und Integration][s5]

## Mit kleinem Referenzversuch aktualisieren

Die [versionierte Anleitung][s6] installiert EvoX vor EvoMO. Nutzen Sie `pip install evox` und anschließend `pip install evomo==0.3.1`; erfassen Sie aufgelöste Abhängigkeiten. Quellinstallationen können den Tag v0.3.1 fixieren. Der Patch ergänzt Dokumentation, funktionale Änderungen stehen in v0.3.0.

Prüfen Sie vor großen Benchmarks einen bekannten Zielwert, einen kleinen Auswahlfall und die Zustandswiederherstellung. Bei Nebenbedingungen Zulässigkeit und Qualität gemeinsam prüfen; beim Hypervolumen Referenzpunkt und Sampling beibehalten. Der [GPU-Mehrziel-Forschungsüberblick][related] erläutert Tensorisierung, v0.3 bietet die breitere und präzisere Experimentbasis.

[s1]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.1
[s2]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.0
[s3]: https://github.com/EMI-Group/evomo/pull/38
[s4]: https://github.com/EMI-Group/evomo/pull/34
[s5]: https://github.com/EMI-Group/evomo/pull/39
[s6]: https://github.com/EMI-Group/evomo/blob/v0.3.1/README.md
[related]: /de/news/gpu-accelerated-emo
