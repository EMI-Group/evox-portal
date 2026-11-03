---
title: "Notes de version EvoX v1.2.1"
pubDate: 2025-05-13
summary: "Améliorations de la stabilité avec de nouvelles fonctions de benchmark (Ellipsoid, Griewank) et corrections de bugs."
---

Il s'agit d'une version mineure axée sur l'amélioration de la stabilité et la correction de bugs, avec quelques améliorations de confort.

## Nouvelles Fonctionnalités
Nouvelles fonctions de benchmark : Ajout de fonctions numériques mono-objectif : `Ellipsoid` et `Griewank`.

## Corrections de Bugs
* Correction d'un problème où `StdWorkflow` ne fonctionnait pas avec des algorithmes héritant d'autres algorithmes.

* Correction d'un bug dans la fonction `latin_hypercube_sampling_standard`.

* Résolution d'un problème où `non_dominate` échouait sous `torch.compile`.

* Correction d'un problème où `PSO` n'utilisait pas correctement le périphérique (device) par défaut dans certains cas.

## Refactorisation & Maintenance
* Réexportation des utilitaires couramment utilisés au niveau supérieur pour plus de commodité, par exemple :

  * `evox.compile` au lieu de `evox.core.compile`

  * `evox.vmap` au lieu de `evox.core.vmap`.

* Suppression du code obsolète ou redondant.

Journal complet des modifications : [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

## Ressources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
