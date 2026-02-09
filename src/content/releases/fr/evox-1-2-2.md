---
title: "Note de version EvoX v1.2.2"
pubDate: 2025-06-03
summary: "Une version mineure axée sur la correction de bugs, incluant des correctifs pour les algorithmes DE et des améliorations de la documentation."
---

Il s'agit d'une version mineure axée uniquement sur des corrections de bugs :

- Suppression des imports inutilisés pour améliorer la propreté du code.
- Correction d'un comportement involontaire dans certains algorithmes d'Évolution Différentielle (DE) où `step` était appelé à l'intérieur de `init_step`.
- Diverses corrections dans la documentation.

**Journal complet des modifications** : [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)