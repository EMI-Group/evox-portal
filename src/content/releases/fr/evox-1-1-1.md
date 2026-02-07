---
title: "EvoX v1.1.1 - Notes de version"
pubDate: 2025-03-16
summary: "Corrections de bugs pour la capture de graphe torch.compile, les interruptions de graphe use_state et les fuites BatchedTensor."
---

**Changements apportés**

**Cette version mineure comprend principalement des corrections de bugs et des améliorations :**

- Correction d'un problème où `torch.compile` ne capturait pas correctement `workflow.step`.

- Correction d'un problème où `use_state` provoquait une interruption de graphe.

- Correction de certaines utilisations incorrectes de tampons de modèle.

- Correction d'un problème où monitor.plot ne fonctionnait pas comme prévu.

- Introduction d'un nouveau wrapper, `evox.compile`, pour contourner certaines limitations de `torch.compile` et `torch.vmap`.

- Résolution de divers problèmes liés à `BatchedTensor` : correction d'un bug où l'application de vmap à un workflow avec EvalMonitor pouvait provoquer des fuites de BatchedTensor.

- Correction d'un problème empêchant HPOProblem de fonctionner avec BraxProblem.

- Amélioration des implémentations de RVEA et CSO pour de meilleures performances et fiabilité.

- Amélioration de l'implémentation de BraxProblem.

- Diverses petites corrections et améliorations.

**Code open source et communauté**

**Article** : [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub** : [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projet amont (EvoX)** : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Groupe QQ** : 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Groupe QQ | Evolving Machine Intelligence
