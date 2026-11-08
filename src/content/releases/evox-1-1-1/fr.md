---
title: "Notes de version EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Corrections de bugs pour la capture de graphe torch.compile, les ruptures de graphe use_state et les fuites de BatchedTensor."
---

![Structure du programme rendue visible pour inspection](./graph-break-repair.webp)

## Ce qui a changé
**Cette version mineure comprend principalement des corrections de bugs et des améliorations :**

- Correction d'un problème où `torch.compile` ne capturait pas correctement `workflow.step`.

- Correction d'un problème où `use_state` entraînait une rupture de graphe.

- Correction de certaines utilisations incorrectes du buffer de modèle.

- Correction d'un problème où monitor.plot ne fonctionnait pas comme prévu.

- Introduction d'un nouveau wrapper, `evox.compile`, pour contourner certaines limitations de `torch.compile` et `torch.vmap`.

- Résolution de divers problèmes liés à `BatchedTensor` :- Correction d'un bug où le vmapping d'un workflow avec EvalMonitor pouvait causer des fuites de BatchedTensor.

- Correction d'un problème empêchant HPOProblem de fonctionner avec BraxProblem.

- Amélioration des implémentations de RVEA et CSO pour de meilleures performances et une fiabilité accrue.

- Amélioration de l'implémentation de BraxProblem.

- Diverses petites corrections et améliorations.

## Ressources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
