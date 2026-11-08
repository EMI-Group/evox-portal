---
title: "EvoX 1.4.1: Wenn eine kleine Korrektur die Suche verändert"
pubDate: 2026-10-30
summary: "Korrekturen an SHADE, Differential Evolution und CMA-ES zeigen, warum evolutionäre Infrastruktur Effizienz und originalgetreues Algorithmusverhalten benötigt."
updatedDate: 2026-11-08
---

Eine Suche kann erfolgreich enden und dennoch einer falschen Aktualisierungsregel folgen. EvoX 1.4.1 vom 30. Oktober 2026 korrigiert solche Abweichungen in SHADE, Differential Evolution und CMA-ES und stellt benötigtes Anpassungs-, Stichproben- und Ausführungsverhalten wieder her.

![Ein Kalibrierinstrument richtet eine dunkle Suchkontur an einer roten Referenz aus](./algorithm-behavior-calibration.webp)

*Implementierung am beabsichtigten Algorithmusverhalten ausrichten.*

## Laufender Code kann anders suchen

Bei SHADE passte sich der Erfolgshistorienspeicher für F und CR nicht an. Verbesserungen wurden nach dem Ersetzen der Fitness berechnet; Arithmetik mit NaN-gefüllten Arrays verunreinigte ausgewählte Werte. Die Korrektur berechnet Verbesserungen vor dem Update und wählt erfolgreiche Einträge mit `torch.where`. [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

Der gemeinsame binomiale Kreuzungsoperator verglich normalverteilte Zufallswerte mit einer Kreuzungswahrscheinlichkeit. Nun wird passend zur Wahrscheinlichkeit gleichverteilt gezogen. Verwandte Korrekturen initialisieren CoDE, SaDE und SHADE gleichverteilt innerhalb ihrer Grenzen. Das verändert erzeugte Kandidaten, nicht nur die Absturzfreiheit. [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## Mathematik und Laufzeitbedingungen

CMA-ES-Korrekturen betreffen das Rang-eins-Kovarianzupdate, die Kumulationskonstante und Aliasing-Beschränkungen in `torch.cond`. Letztere reaktiviert auch einen abgeschalteten CMA-ES-Test. Formeln und Frameworkbedingungen müssen unabhängig geprüft werden. [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

Weitere Änderungen betreffen Initialisierung und Unterräume von Evolutionsstrategien, Turnierselektion, PSO-Gerätewechsel und Hypervolumen. [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## Zuverlässigkeit gehört zur Infrastruktur

Die SHADE-Korrektur ergänzt einen Regressionstest: fünf Workflow-Schritte, danach die Prüfung, dass sich der Anpassungsspeicher verändert und endlich bleibt. Halten Sie für Versionsvergleiche Seed, Ziel, Population und Bewertungsbudget fest und wiederholen Sie betroffene Basisläufe. Die [Versionshinweise](/de/releases/evox-1-4-1) dienen als Upgrade-Referenz.
