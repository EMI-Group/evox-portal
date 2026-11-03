---
title: "EvoX Compiler v0.1.0 : graphes de tenseurs explicites et plusieurs backends"
pubDate: 2026-10-29
summary: "La première version d’EvoX Compiler apporte à Python des graphes inspectables, des transformations composables et les voies NumPy, IREE, XLA et TVM."
---

**EvoX Compiler (evoxc) v0.1.0 est sorti le 29 octobre 2026.** Ce compilateur et runtime Python pour graphes de tenseurs s’adresse aux développeurs souhaitant inspecter, transformer, sauvegarder et exécuter le programme lui-même. Sous licence Apache-2.0, il nécessite Python 3.11 ou ultérieur.

## Un programme inspectable

evoxc expose chaque étape via `trace → lower → compile → load → run`. Le frontend représente les calculs dans EvoXIR et exporte StableHLO vers des compilateurs externes, responsables de l’optimisation et de la génération de code. Les graphes et artefacts intermédiaires restent accessibles pour inspection et sauvegarde.

Les transformations comprennent `vmap`, `grad`, `jvp` et `vjp`. Pour la recherche d’architectures neuronales, la programmation génétique et la synthèse d’algorithmes, `batch_functions` combine des programmes candidats aux spécifications d’entrée/sortie identiques en un graphe. Le cache explicite de compilation aide les traitements qui génèrent régulièrement des programmes statiques.

## Quatre voies d’exécution

NumPy est la seule dépendance obligatoire et fournit l’interpréteur CPU par défaut. Des adaptateurs optionnels relient le graphe à IREE, à XLA via un plugin PJRT fourni par l’utilisateur, et à TVM. Le choix du backend et du périphérique est explicite ; la couverture dépend de l’adaptateur. La version documente Vulkan sur Mesa lavapipe et ROCm via TVM uniquement à la compilation.

Le README rapporte **7,511 tests réussis, 77 ignorés, 4 échecs attendus et 0 échec** pour les suites du cœur et d’`evoxc_hf`, avec IREE, TVM et torch installés. Ce sont les résultats du projet dans cette configuration. Le dépôt attribue à EvoX Genesis la production du code, des tests et des documents.

## Premiers pas

Installez cette version avec la commande ci-dessous. Les adaptateurs optionnels sont documentés dans le README versionné ; l’intégration HuggingFace est distribuée séparément sous le nom `evoxc-hf`.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
