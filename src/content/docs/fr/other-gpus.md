---
title: "Utiliser des GPU non-NVIDIA"
order: 16
section: "misc"
---

# Utiliser des GPU non-NVIDIA

Ce guide explique comment utiliser les GPU AMD et les GPU Apple Silicon avec PyTorch dans le contexte d'EvoX.

Bien que les GPU NVIDIA soient un choix fiable et offrent généralement de solides performances, les modèles les plus récents sont optimisés pour les charges de travail de deep learning et les grands modèles de langage (LLM). Beaucoup de leurs fonctionnalités avancées, telles que la prise en charge des types de données à faible précision, sont actuellement sous-utilisées dans EvoX. Dans certains cas, les GPU non-NVIDIA peuvent offrir de meilleures performances et un coût inférieur pour les tâches évolutives.

## Prise en charge des GPU AMD

La prise en charge des GPU AMD dans PyTorch est assurée via ROCm. Les périphériques AMD sont reconnus comme des périphériques `cuda` (tout comme les GPU NVIDIA). Pour utiliser un GPU AMD :

1. Installez la version de PyTorch compatible avec ROCm.
2. Utilisez la configuration de périphérique standard, par ex. `device = torch.device("cuda")`.

Aucun changement supplémentaire n'est nécessaire au-delà de l'utilisation de la version ROCm.

## Prise en charge des GPU Apple Silicon

Si vous possédez un Mac Apple Silicon, vous pouvez tirer parti du GPU intégré pour accélérer vos charges de travail EvoX.
Les GPU Apple Silicon sont pris en charge via le backend Metal Performance Shaders (MPS) et sont accessibles en utilisant le périphérique `mps` dans PyTorch.

Pour utiliser un GPU Apple Silicon :

1. Assurez-vous d'avoir installé la version de PyTorch compatible avec MPS.
2. Déplacez vos tenseurs et modèles vers le périphérique `mps`, par ex. `device = torch.device("mps")`.

> **Note :**
> Le périphérique `mps` ne prend **pas** en charge la compilation (par ex. `#evox.compile`).