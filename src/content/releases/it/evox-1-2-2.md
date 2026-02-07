---
title: "EvoX v1.2.2 Note di rilascio"
pubDate: 2025-06-03
summary: "Rilascio minore focalizzato su correzioni dell'algoritmo DE e miglioramenti della documentazione."
---

Questo e un rilascio minore focalizzato esclusivamente sulla correzione di bug:

- Rimossi import inutilizzati per migliorare la pulizia del codice.
- Corretto un comportamento indesiderato in alcuni algoritmi Differential Evolution (DE) in cui `step` veniva chiamato all'interno di `init_step`.
- Varie correzioni nella documentazione.

**Changelog completo**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
