---
title: "EvoX v1.1.1 Versionshinweise"
pubDate: 2025-03-16
summary: "Fehlerbehebungen für die torch.compile Graph-Erfassung, use_state Graph-Unterbrechungen und BatchedTensor-Lecks."
---

**Was sich geändert hat**

**Dieses Minor-Release enthält hauptsächlich Fehlerbehebungen und Verbesserungen:**

- Ein Problem wurde behoben, bei dem `torch.compile` `workflow.step` nicht korrekt erfasste.

- Ein Problem wurde behoben, bei dem `use_state` zu einer Graph-Unterbrechung führte.

- Einige inkorrekte Verwendungen von Modellpuffern wurden korrigiert.

- Ein Problem wurde behoben, bei dem `monitor.plot` nicht wie beabsichtigt funktionierte.

- Ein neuer Wrapper, `evox.compile`, wurde eingeführt, um bestimmte Einschränkungen bei `torch.compile` und `torch.vmap` zu umgehen.

- Verschiedene Probleme im Zusammenhang mit `BatchedTensor` wurden gelöst: Ein Fehler wurde behoben, bei dem das Vmapping eines Workflows mit `EvalMonitor` zu `BatchedTensor`-Lecks führen konnte.

- Ein Problem wurde behoben, das verhinderte, dass `HPOProblem` mit `BraxProblem` funktioniert.

- Die Implementierungen von RVEA und CSO wurden für bessere Leistung und Zuverlässigkeit verbessert.

- Die Implementierung von `BraxProblem` wurde verbessert.

- Verschiedene kleine Fehlerbehebungen und Verbesserungen.

**Open-Source-Code und Community**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Upstream-Projekt (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ-Gruppe**: 297969717

![image.png](./evox-1-1-1-1.png)

  QQ-Gruppe | Evolving Machine Intelligence