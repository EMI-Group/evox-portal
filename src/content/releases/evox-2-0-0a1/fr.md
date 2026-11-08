---
title: "EvoX v2.0.0a1 : réécrit sur EvoX Compiler"
pubDate: 2026-10-30
summary: "Une alpha expérimentale avec une nouvelle API fonctionnelle et un compilateur de graphes de tenseurs explicites. La branche stable 1.x reste recommandée en production."
---

![Structure du programme rendue visible pour inspection](./experimental-compiler-runtime.webp)

**EvoX v2.0.0a1** est la première alpha d’une réécriture complète fondée sur [EvoX Compiler (`evoxc`)](https://github.com/EMI-Group/evoxc).

> **Préversion expérimentale :** la nouvelle API est incompatible avec 1.x et ne permet pas une mise à niveau directe. La branche stable 1.x reste recommandée en production. Essayez l’alpha dans un environnement séparé.

## Un pipeline de compilation explicite

EvoX Compiler rend les graphes de tenseurs inspectables et transformables, en séparant traçage, transformations, abaissement, compilation et exécution. Il propose les transformations composables `vectorize`/`vmap`, `grad`, `jvp`, `vjp` et `batch_functions`, avec les backends NumPy, IREE, TVM et XLA/PJRT. StableHLO fournit une frontière d’abaissement commune aux backends compilés.

EvoX 2.0 ne dépend plus de PyTorch ni de JAX. NumPy est la seule dépendance d’exécution obligatoire d’EvoX Compiler ; les backends compilés sont optionnels.

## Nouvelle API fonctionnelle

- Les algorithmes utilisent `init(config, key)` et `step(config, state, evaluate)`.
- Les problèmes utilisent `evaluate(config, state, candidates)`.
- Les configurations sont immuables, l’état tensoriel est explicite et l’aléatoire repose sur des clés PRNG reproductibles.
- `StdWorkflow` trace une étape évolutive, la compile avec le backend choisi et exécute la boucle d’optimisation.

## Contenu de cette alpha

- **32 classes d’algorithmes** et **15 opérateurs évolutifs**.
- Benchmarks numériques de base, DTLZ, CEC2022 et neuroévolution virtuelle.
- Métriques GD, IGD et hypervolume ; visualisation Plotly et traces `.exv`.
- Optimisation des hyperparamètres côté hôte et découverte d’extensions via `evox_ext`.

La publication amont annonce **552 tests réussis sur le backend NumPy**. Cela n’établit pas une couverture équivalente des backends compilés ou des GPU.

## Installation

**Python 3.11+** est requis. Dans un environnement séparé, choisissez une méthode d’installation :

```bash
pip install --pre "evox==2.0.0a1"
```

Pour ajouter la prise en charge optionnelle des compilateurs :

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## Limites actuelles

Les workflows distribués, Brax/MuJoCo, l’intégration des réseaux de neurones PyTorch et les noyaux Triton ne sont pas encore portés. Les backends compilés et l’exécution GPU restent expérimentaux ; certains opérateurs et schémas de contrôle ne sont pas pris en charge sur tous les backends. Le suivi, la visualisation, les métriques et HPO s’exécutent actuellement hors des graphes compilés. Les API pourront évoluer durant les préversions.

Vos rapports de bugs, benchmarks et retours sur l’API sont les bienvenus dans [GitHub Issues](https://github.com/EMI-Group/evox/issues).

**Publication**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
