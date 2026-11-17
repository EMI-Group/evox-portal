---
title: "EvoGP : calculer les statistiques de population avec des tenseurs"
pubDate: 2026-10-16
updatedDate: 2026-11-17
summary: "Une correction ciblée remplace les extrema de fitness calculés en Python par des réductions torch dans le pipeline standard."
---

Le suivi de progression ne devrait pas devenir la partie coûteuse d’une génération. La [fusion du 16 octobre 2026][s1] remplace les maximum et minimum Python du tenseur de fitness par des réductions tensorielles. Elle cible le coût du reporting tout en conservant les extrema attendus.

![Un pont de mesure couvre de nombreux arbres-programmes pour repérer leurs extrema ensemble](./reporting-reduction.webp)

*Illustration conceptuelle : calculer les extrema collectivement plutôt que manipuler chaque candidat séparément.*

## Conserver les statistiques dans les opérations tensorielles

Les maximum et minimum Python sur le tenseur de fitness deviennent `torch.max` et `torch.min`. Parcourir un grand tenseur d'appareil en Python crée du travail à la frontière du langage qu'une réduction peut effectuer dans le framework numérique. L'effet compte particulièrement quand l'évaluation elle-même est peu coûteuse.

En régression symbolique à grande population, l'évaluation des expressions peut être parallèle tandis que l'affichage des extrema reste coûteux. Le correctif supprime ce déséquilibre sans changer la statistique. La PR rapporte une forte amélioration sur un million d'individus, sans protocole complet de benchmark ; l'action utile consiste à profiler la génération entière, suivi compris.

Comparez le temps complet d’une génération avec et sans reporting, à entrées, graine et population identiques. Vérifiez les extrema rapportés contre le tenseur de fitness avant d’augmenter la charge. La [présentation d’EvoGP][related] explique les arbres tensorisés ; la [mise à jour AMD ROCm][rocm] indépendante couvre le matériel et la compilation. Une réduction plus rapide ou un backend compatible ne suffit pas à établir les performances de toute la recherche.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[related]: /fr/news/evogp
[rocm]: /fr/news/evogp-amd-rocm
