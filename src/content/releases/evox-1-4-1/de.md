---
title: "EvoX v1.4.1 Release Notes"
pubDate: 2026-10-30
summary: "Korrekturen an CMA-ES, DE-Varianten, PSO, Evolutionsstrategien, Turnierselektion und Hypervolumenberechnung."
---

**EvoX v1.4.1** behebt algorithmische Fehler und Laufzeitprobleme in der stabilen 1.x-Reihe.

## Algorithmuskorrekturen

- **CMA-ES:** Rang-eins-Aktualisierung der Kovarianz und Kumulationskonstante `c_c` korrigiert; Absturz in `torch.cond` behoben und Test wieder aktiviert ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **DE-Varianten:** Stichproben in `DE_binary_crossover` von Normal- auf Gleichverteilung umgestellt. Anpassung von `F` und `CR` in SHADE korrigiert und Initialpopulationen der DE-Varianten auf den zulässigen Bereich beschränkt ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO:** Geräteübertragung der Grenzen korrigiert ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **Evolutionsstrategien:** ASEBO nach Aktivierung des Gradientenunterraums, Standardwert von `pop_size` in XNES/SeparableNES und Unterraum-Abstürze in Guided ES korrigiert ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## Operatoren und Metriken

- Abstürze der Turnierselektion bei `n_round=1` behoben ([#259](https://github.com/EMI-Group/evox/pull/259)).
- Hypervolumen (`hv`) ignoriert jetzt Punkte, die den Referenzpunkt nicht dominieren ([#254](https://github.com/EMI-Group/evox/pull/254)).

Vielen Dank an @bbopen, @raashish1601, @Arthur031221 und @flyingdoubleG für ihre ersten Beiträge.

**Release**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **Vollständiges Änderungsprotokoll**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
