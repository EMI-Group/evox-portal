---
title: "EvoX v1.2.1 Versionshinweise"
pubDate: 2025-05-13
summary: "Stabilitaetsverbesserungen, neue Benchmark-Funktionen (Ellipsoid, Griewank) und Fehlerbehebungen."
---

Dies ist eine kleinere Version mit Fokus auf Stabilitaetsverbesserungen und Fehlerbehebungen sowie einigen Komfortverbesserungen.

**Neue Funktionen**

Neue Benchmark-Funktionen: Einkriterielle numerische Funktionen `Ellipsoid` und `Griewank` hinzugefuegt.

**Fehlerbehebungen**

* Ein Problem wurde behoben, bei dem `StdWorkflow` nicht mit Algorithmen funktionierte, die von anderen Algorithmen erben.

* Ein Fehler in der Funktion `latin_hypercube_sampling_standard` wurde korrigiert.

* Ein Problem mit `non_dominate` unter `torch.compile` wurde behoben.

* Ein Problem wurde korrigiert, bei dem `PSO` in bestimmten Faellen das Standard-Geraet nicht korrekt verwendete.

**Refactoring und Wartung**

* Haeufig verwendete Hilfsfunktionen wurden zur Vereinfachung auf die oberste Ebene re-exportiert, zum Beispiel:

* `evox.compile` anstelle von `evox.core.compile`

* `evox.vmap` anstelle von `evox.core.vmap`.

* Veralteter oder redundanter Code wurde entfernt.

Vollstaendiges Changelog: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Open-Source-Code / Community-Ressourcen**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Upstream-Projekt (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ-Gruppe: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ-Gruppe | Evolving Machine Intelligence
