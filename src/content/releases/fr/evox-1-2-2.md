---
title: "EvoX v1.2.2 - Notes de version"
pubDate: 2025-06-03
summary: "Version mineure axée sur les corrections de l'algorithme DE et les améliorations de la documentation."
---

Il s'agit d'une version mineure axée exclusivement sur les corrections de bugs :

- Suppression des imports inutilisés pour améliorer la propreté du code.
- Correction d'un comportement non souhaité dans certains algorithmes de Differential Evolution (DE) où `step` était appelé à l'intérieur de `init_step`.
- Diverses corrections dans la documentation.

**Journal des modifications complet** : [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
