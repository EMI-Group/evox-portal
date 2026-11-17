---
title: "EvoGP : rechercher des programmes arborescents sur GPU AMD"
pubDate: 2026-06-18
updatedDate: 2026-11-17
summary: "ROCm relie l’extension PyTorch d’EvoGP au matériel AMD grâce à une compilation adaptée au backend et à une correction des piles privées des interpréteurs."
---

Avec un GPU AMD, explorer la programmation génétique arborescente d’EvoGP ne devrait pas imposer un autre moteur de recherche. La [PR #12][s2], fusionnée le 17 juin 2026 UTC (18 juin à Pékin), ouvre cette voie avec ROCm/HIP. Elle traite la compilation de l’extension et la préservation du sens des programmes à l’exécution.

![Les mêmes arbres de programmes au-dessus de deux cartes différentes](./rocm-backend.webp)

*Illustration conceptuelle : une même représentation traverse les frontières des moteurs GPU.*

## Une source commune pour CUDA et ROCm

L'intégration de juin utilise la conversion HIP de PyTorch lors de la construction pour compiler les extensions CUDA d'EvoGP sur AMD. Les options dépendent du moteur et un en-tête réservé à CUDA est protégé pour ne pas casser HIP. Un PyTorch ROCm permet donc de construire l'extension sans maintenir une autre implémentation des algorithmes.

L'allocation dynamique des piles d'interpréteurs est aussi remplacée par des tableaux locaux de taille fixe. Le contributeur a relié les erreurs AMD à des alias d'allocation entre wavefronts résidents. Séparer les piles est essentiel : utiliser l'état temporaire d'un autre thread peut fausser la fitness et donc la sélection.

## Traduire les sources des noyaux ne suffit pas

La conversion HIP de PyTorch traduit les sources CUDA, mais les arguments sont transmis au compilateur de périphérique. Les options NVIDIA ne peuvent pas être simplement passées à `hipcc`. La configuration conserve la liste CUDA et utilise `-O3` pour ROCm ; un en-tête propre à CUDA est protégé séparément. ROCm PyTorch fournit la conversion, mais EvoGP doit aussi rendre sa configuration de compilation compatible. [Modifications de compilation][s2]

## Préparer l'environnement du moteur choisi

Les [instructions source][s3] demandent une chaîne GPU, un compilateur C++ et un PyTorch compatibles. Pour AMD, utilisez ROCm avec `hipcc` et PyTorch ROCm, puis construisez EvoGP avec `--no-build-isolation` pour employer cet environnement PyTorch installé.

Les exemples gardent les chaînes d'appareil `cuda` sous ROCm, conformément à l'interface PyTorch. `PYTORCH_ROCM_ARCH` sélectionne une architecture AMD précise. Il s'agit d'un choix de construction, pas d'une réécriture des arbres ni des opérateurs évolutionnaires.

## Exécuter la même recherche sur un backend vérifié

Le contributeur rapporte des vérifications sur MI250X, W7800, RX 9070 XT et PRO V710, avec OS et versions ROCm précisés dans la PR. Elles utilisent 1 000 individus, 100 générations et une graine fixe. Ce sont des validations rapportées pour ces configurations, pas une garantie indépendante du matériel.

```bash
python -m evogp.sr_test
```

Pour une régression symbolique, commencez par vérifier la compilation et la fin du petit test avec une fitness finie. Les vérifications du contributeur couvrent des appareils wave32 et wave64 et rapportent des trajectoires identiques à graine fixe, sans nouvelle promesse générale d’accélération. Gardez ensuite données, population et graine constantes pour comparer votre matériel. La [présentation d’EvoGP][related] explique les programmes ; la [correction ultérieure du reporting][logging] traite un autre coût par génération.

[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/5538d75470ee0fa444ee6bbe5ea98b2eed6e99f8/README.md
[related]: /fr/news/evogp
[logging]: /fr/news/evogp-rocm-population-execution
