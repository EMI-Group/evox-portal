---
title: "EvoGP : davantage de GPU, moins de travail dans les journaux"
pubDate: 2026-10-16
summary: "Le support AMD ROCm et une correction de réduction tensorielle lèvent deux obstacles pratiques aux grandes populations de programmes."
---

Un noyau rapide ne suffit pas à rendre une recherche utilisable. Le GPU disponible doit être compatible et le suivi ne doit pas dominer chaque génération. L'[intégration EvoGP du 16 octobre 2026][s1] remplace les réductions Python de fitness dans le pipeline standard. Elle suit le [support AMD ROCm du 17 juin][s2], qui élargit l'accès au même système de recherche arborescente.

![Les mêmes arbres de programmes au-dessus de deux cartes différentes](./cover.webp)

*Illustration conceptuelle : une même représentation traverse les frontières des moteurs GPU.*

## Conserver les statistiques dans les opérations tensorielles

Les maximum et minimum Python sur le tenseur de fitness deviennent `torch.max` et `torch.min`. Parcourir un grand tenseur d'appareil en Python crée du travail à la frontière du langage qu'une réduction peut effectuer dans le framework numérique. L'effet compte particulièrement quand l'évaluation elle-même est peu coûteuse.

En régression symbolique à grande population, l'évaluation des expressions peut être parallèle tandis que l'affichage des extrema reste coûteux. Le correctif supprime ce déséquilibre sans changer la statistique. La PR rapporte une forte amélioration sur un million d'individus, sans protocole complet de benchmark ; l'action utile consiste à profiler la génération entière, suivi compris.

## Une source commune pour CUDA et ROCm

L'intégration de juin utilise la conversion HIP de PyTorch lors de la construction pour compiler les extensions CUDA d'EvoGP sur AMD. Les options dépendent du moteur et un en-tête réservé à CUDA est protégé pour ne pas casser HIP. Un PyTorch ROCm permet donc de construire l'extension sans maintenir une autre implémentation des algorithmes.

L'allocation dynamique des piles d'interpréteurs est aussi remplacée par des tableaux locaux de taille fixe. Le contributeur a relié les erreurs AMD à des alias d'allocation entre wavefronts résidents. Séparer les piles est essentiel : utiliser l'état temporaire d'un autre thread peut fausser la fitness et donc la sélection.

## Préparer l'environnement du moteur choisi

Les [instructions source][s3] demandent une chaîne GPU, un compilateur C++ et un PyTorch compatibles. Pour AMD, utilisez ROCm avec `hipcc` et PyTorch ROCm, puis construisez EvoGP avec `--no-build-isolation` pour employer cet environnement PyTorch installé.

Les exemples gardent les chaînes d'appareil `cuda` sous ROCm, conformément à l'interface PyTorch. `PYTORCH_ROCM_ARCH` sélectionne une architecture AMD précise. Il s'agit d'un choix de construction, pas d'une réécriture des arbres ni des opérateurs évolutionnaires.

## Valider une petite recherche avant de grandir

Le contributeur rapporte des vérifications sur MI250X, W7800, RX 9070 XT et PRO V710, avec OS et versions ROCm précisés dans la PR. Elles utilisent 1 000 individus, 100 générations et une graine fixe. Ce sont des validations rapportées pour ces configurations, pas une garantie indépendante du matériel.

Après construction, lancez `python -m evogp.sr_test` et vérifiez fitness finie et fin normale. Comparez ensuite une expérience avec et sans suivi, en gardant entrées, graine et population fixes. Vous séparerez évaluation et gestion avant de changer d'échelle. La [présentation de recherche EvoGP][related] décrit les arbres tensorisés ; ces changements les rapprochent d'une recherche opérationnelle sur le matériel disponible.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/85c9f96490185b371438768668da53de930cc3f6/README.md
[related]: /fr/news/evogp
