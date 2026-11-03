---
title: "Notes de version d’EvoX v1.0.1"
pubDate: 2025-01-20
summary: "Corrections de l’installateur Windows, de la sélection des vecteurs de base des algorithmes DE et de SHADE pour les grandes populations."
---

**EvoX v1.0.1** est une version de maintenance comportant trois corrections :

- Mise à jour du script d’installation Windows `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- Correction de la sélection des vecteurs de base dans DE, ODE et JaDE pour utiliser une sélection réellement aléatoire ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Correction d’un dépassement d’indice de tableau dans SHADE lorsque `pop_size > 100` ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Publication**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Historique complet**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
