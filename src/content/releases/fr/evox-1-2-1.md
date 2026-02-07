---
title: "EvoX v1.2.1 - Notes de version"
pubDate: 2025-05-13
summary: "Améliorations de stabilité, nouvelles fonctions de benchmark (Ellipsoid, Griewank) et corrections de bugs."
---

Il s'agit d'une version mineure axée sur l'amélioration de la stabilité et la correction de bugs, avec quelques améliorations de confort d'utilisation.

**Nouvelles fonctionnalités**

Nouvelles fonctions de benchmark : Ajout de fonctions numériques mono-objectif : `Ellipsoid` et `Griewank`.

**Corrections de bugs**

* Correction d'un problème où `StdWorkflow` ne fonctionnait pas avec les algorithmes héritant d'autres algorithmes.

* Correction d'un bug dans la fonction `latin_hypercube_sampling_standard`.

* Résolution d'un problème avec `non_dominate` qui échouait sous `torch.compile`.

* Correction d'un problème où `PSO` n'utilisait pas correctement le périphérique par défaut dans certains cas.

**Refactorisation et maintenance**

* Réexportation des utilitaires couramment utilisés au niveau supérieur pour plus de commodité, par exemple :

* `evox.compile` au lieu de `evox.core.compile`

* `evox.vmap` au lieu de `evox.core.vmap`.

* Suppression du code obsolète ou redondant.

Journal des modifications complet : [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Code open source / Ressources communautaires**

Article :

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub :

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projet amont (EvoX) :

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Groupe QQ : 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Groupe QQ | Evolving Machine Intelligence
