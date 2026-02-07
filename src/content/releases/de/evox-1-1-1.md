---
title: "EvoX v1.1.1 Versionshinweise"
pubDate: 2025-03-16
summary: "Fehlerbehebungen fuer torch.compile Graph-Erfassung, use_state Graph-Unterbrechungen und BatchedTensor-Lecks."
---

**Was hat sich geaendert**

**Diese kleinere Version enthaelt hauptsaechlich Fehlerbehebungen und Verbesserungen:**

- Ein Problem wurde behoben, bei dem `torch.compile` `workflow.step` nicht korrekt erfasste.

- Ein Problem wurde behoben, bei dem `use_state` zu einem Graph-Break fuehrte.

- Einige fehlerhafte Model-Buffer-Verwendungen wurden korrigiert.

- Ein Problem wurde behoben, bei dem monitor.plot nicht wie vorgesehen funktionierte.

- Ein neuer Wrapper, `evox.compile`, wurde eingefuehrt, um bestimmte Einschraenkungen von `torch.compile` und `torch.vmap` zu umgehen.

- Verschiedene `BatchedTensor`-bezogene Probleme wurden behoben:- Ein Fehler wurde behoben, bei dem das Vmapping eines Workflows mit EvalMonitor zu BatchedTensor-Lecks fuehren konnte.

- Ein Problem wurde behoben, das die Zusammenarbeit von HPOProblem mit BraxProblem verhinderte.

- Die Implementierungen von RVEA und CSO wurden fuer bessere Leistung und Zuverlaessigkeit verbessert.

- Die Implementierung von BraxProblem wurde verbessert.

- Verschiedene kleine Korrekturen und Verbesserungen.

**Open-Source-Code und Community**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Upstream-Projekt (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ-Gruppe**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQ-Gruppe | Evolving Machine Intelligence
