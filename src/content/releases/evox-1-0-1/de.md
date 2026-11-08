---
title: "EvoX v1.0.1 Release Notes"
pubDate: 2025-01-20
summary: "Fehlerkorrekturen am Windows-Installer, an der Basisvektorauswahl der DE-Verfahren und an SHADE bei größeren Populationen."
---

![Prüfung und Korrektur des Algorithmusverhaltens](./bounded-random-selection.webp)

**EvoX v1.0.1** ist ein Wartungsrelease mit drei Korrekturen:

- Windows-Installationsskript `win-install.bat` aktualisiert ([#204](https://github.com/EMI-Group/evox/pull/204)).
- Basisvektorauswahl in DE, ODE und JaDE auf echte Zufallsauswahl korrigiert ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Array-Indexüberschreitung in SHADE bei `pop_size > 100` behoben ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Release**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Vollständiges Änderungsprotokoll**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
