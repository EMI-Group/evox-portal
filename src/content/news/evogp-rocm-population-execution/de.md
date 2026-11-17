---
title: "EvoGP: Populationsberichte mit Tensoroperationen berechnen"
pubDate: 2026-10-16
updatedDate: 2026-11-17
summary: "Eine gezielte Korrektur ersetzt Fitnessextrema auf Python-Ebene durch torch-Reduktionen in der Standardpipeline."
---

Fortschrittsberichte sollten nicht den teuren Teil einer Suchgeneration bilden. EvoGPs [Änderung vom 16. Oktober 2026][s1] ersetzt Python-Maximum und -Minimum über dem Fitnesstensor durch Tensorreduktionen. Sie adressiert Reportingkosten der Standardpipeline und erhält die beabsichtigten Extremwerte.

![Eine Messbrücke überspannt Programmbäume und erfasst die Populationsextrema gemeinsam](./reporting-reduction.webp)

*Konzeptillustration: Extrema kollektiv berechnen, statt jeden Kandidaten einzeln zu behandeln.*

## Populationsstatistiken als Tensoroperationen

Python-Maximum und -Minimum über den Fitnesstensor werden durch `torch.max` und `torch.min` ersetzt. Das Durchlaufen großer Gerätetensoren in Python erzeugt Aufwand an der Sprachgrenze, den eine Tensorreduktion im numerischen Framework erledigt. Bei günstigen Fitnessfunktionen fällt dies besonders ins Gewicht.

In symbolischer Regression können Ausdrücke parallel ausgewertet werden, während die Ausgabe der Extrema überraschend teuer bleibt. Die Korrektur beseitigt diese Schieflage bei gleicher Statistik. Der PR berichtet starke Verbesserungen für eine Million Individuen, enthält aber kein vollständiges Messprotokoll. Praktisch sollte die gesamte Generation einschließlich Protokollierung profiliert werden.

Vergleichen Sie die vollständige Generationszeit mit und ohne Reporting bei gleichen Eingaben, Seeds und Populationen. Prüfen Sie die gemeldeten Extrema gegen den Fitnesstensor, bevor Sie die Last erhöhen. Der [EvoGP-Überblick][related] erklärt tensorisierte Programmbäume; die separate [AMD-ROCm-Aktualisierung][rocm] behandelt Hardware und Build. Weder eine schnellere Reduktion noch ein unterstütztes Backend allein bestimmen die Leistung der gesamten Suche.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[related]: /de/news/evogp
[rocm]: /de/news/evogp-amd-rocm
