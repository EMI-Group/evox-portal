---
title: "Note di rilascio di EvoX v1.0.1"
pubDate: 2025-01-20
summary: "Correzioni all’installatore Windows, alla selezione dei vettori di base negli algoritmi DE e a SHADE con popolazioni grandi."
---

![Verifica e correzione del comportamento algoritmico](./bounded-random-selection.webp)

**EvoX v1.0.1** è una versione di manutenzione con tre correzioni:

- Aggiornato lo script di installazione Windows `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- Corretta la selezione dei vettori di base in DE, ODE e JaDE affinché sia effettivamente casuale ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Corretto un accesso fuori dai limiti dell’array in SHADE quando `pop_size > 100` ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Release**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Registro completo delle modifiche**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
