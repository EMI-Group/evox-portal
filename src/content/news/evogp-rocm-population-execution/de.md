---
title: "EvoGP: Mehr GPU-Auswahl, weniger Aufwand für Populationsprotokolle"
pubDate: 2026-10-16
summary: "AMD-ROCm-Unterstützung und eine Tensorreduktion beheben zwei praktische Hindernisse großer Programmpopulationen."
---

Ein schneller Kernel allein macht eine Suche noch nicht nutzbar. Die vorhandene GPU muss unterstützt werden, und Fortschrittsausgaben dürfen nicht jede Generation dominieren. Die [EvoGP-Integration vom 16. Oktober 2026][s1] ersetzt Fitnessreduktionen auf Python-Ebene. Sie folgt auf die [AMD-ROCm-Unterstützung vom 17. Juni][s2] und erweitert den Zugang zur selben baumbasierten Suche.

![Identische Programmbäume über zwei unterschiedlichen Beschleunigerkarten](./cover.webp)

*Konzeptillustration: Dieselbe Programmdarstellung überschreitet GPU-Backend-Grenzen.*

## Populationsstatistiken als Tensoroperationen

Python-Maximum und -Minimum über den Fitnesstensor werden durch `torch.max` und `torch.min` ersetzt. Das Durchlaufen großer Gerätetensoren in Python erzeugt Aufwand an der Sprachgrenze, den eine Tensorreduktion im numerischen Framework erledigt. Bei günstigen Fitnessfunktionen fällt dies besonders ins Gewicht.

In symbolischer Regression können Ausdrücke parallel ausgewertet werden, während die Ausgabe der Extrema überraschend teuer bleibt. Die Korrektur beseitigt diese Schieflage bei gleicher Statistik. Der PR berichtet starke Verbesserungen für eine Million Individuen, enthält aber kein vollständiges Messprotokoll. Praktisch sollte die gesamte Generation einschließlich Protokollierung profiliert werden.

## Eine Quellbasis für CUDA und ROCm

Die Juni-Integration verwendet PyTorchs HIP-Konvertierung beim Build für AMD. Compileroptionen richten sich nach dem Backend, ein CUDA-spezifischer Header wird geschützt. Mit ROCm-PyTorch lässt sich die Erweiterung bauen, ohne einen zweiten Algorithmusbestand zu pflegen.

Dynamische Gerätestacks in den Bauminterpretern werden durch lokale Arrays fester Größe ersetzt. Der Beitrag führt falsche AMD-Ergebnisse auf Speicher-Aliasing zwischen gleichzeitig aktiven Wavefronts zurück. Getrennte Threadstacks sind entscheidend: Fremder temporärer Zustand kann Fitnesswerte verfälschen und damit die Auswahl beeinträchtigen.

## Die Build-Umgebung an das Backend anpassen

Die [Quellanleitung][s3] verlangt GPU-Werkzeuge, C++-Compiler und ein passendes PyTorch. Für AMD sind dies ROCm mit `hipcc` und ROCm-PyTorch. `--no-build-isolation` nutzt beim Erweiterungsbau die installierte PyTorch-Umgebung.

Die Beispiele behalten unter ROCm die Gerätezeichenfolge `cuda`, entsprechend der PyTorch-Schnittstelle. `PYTORCH_ROCM_ARCH` wählt eine konkrete AMD-Architektur. Dies ist eine Build-Entscheidung, keine Neuschreibung der Baumdarstellung oder evolutionären Operatoren.

## Kleine Suche prüfen, dann skalieren

Der Beitrag berichtet symbolische Regression auf MI250X, W7800, RX 9070 XT und PRO V710; Betriebssysteme und ROCm-Versionen stehen im PR. Verwendet wurden 1.000 Individuen, 100 Generationen und ein fester Seed. Das sind gemeldete Prüfungen dieser Konfigurationen, keine hardwareunabhängige Leistungszusage.

Führen Sie nach dem Build `python -m evogp.sr_test` aus und prüfen Sie endliche Fitnesswerte und erfolgreichen Abschluss. Vergleichen Sie dann bei festen Eingaben, Seed und Population Läufe mit und ohne Berichte. So trennen Sie Evaluator- und Verwaltungsaufwand vor dem Skalieren. Der [EvoGP-Forschungsüberblick][related] erklärt tensorisierte Bäume; diese Änderungen erleichtern ihre tatsächliche Nutzung.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/85c9f96490185b371438768668da53de930cc3f6/README.md
[related]: /de/news/evogp
