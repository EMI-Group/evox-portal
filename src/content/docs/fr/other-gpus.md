---
title: "Utiliser des GPU non-NVIDIA"
order: 16
section: "misc"
---

# Utiliser des GPU non-NVIDIA

Ce guide explique comment utiliser les GPU AMD et les GPU Apple Silicon avec PyTorch dans le contexte d'EvoX.

Bien que les GPU NVIDIA soient un choix fiable et offrent généralement de bonnes performances, les modèles plus récents sont optimisés pour les charges de travail d'apprentissage profond et les grands modèles de langage. Beaucoup de leurs fonctionnalités avancées, comme le support des types de données à faible précision, sont actuellement sous-utilisées dans EvoX. Dans certains cas, les GPU non-NVIDIA peuvent offrir de meilleures performances et un coût inférieur pour les tâches évolutives.

## Support GPU AMD

Le support GPU AMD dans PyTorch est fourni via ROCm. Les appareils AMD sont reconnus comme des appareils `cuda` (tout comme les GPU NVIDIA). Pour utiliser un GPU AMD :

1. Installez la version de PyTorch compatible ROCm.
2. Utilisez la configuration standard de l'appareil, par exemple `device = torch.device("cuda")`.

Aucun changement supplémentaire n'est nécessaire au-delà de l'utilisation de la version ROCm.

## Support GPU Apple Silicon

Si vous possédez un Mac Apple Silicon, vous pouvez exploiter le GPU intégré pour accélérer vos charges de travail EvoX.
Les GPU Apple Silicon sont supportés via le backend Metal Performance Shaders (MPS) et sont accessibles en utilisant l'appareil `mps` dans PyTorch.

Pour utiliser un GPU Apple Silicon :

1. Assurez-vous d'avoir la version de PyTorch compatible MPS installée.
2. Déplacez vos tenseurs et modèles vers l'appareil `mps`, par exemple `device = torch.device("mps")`.

> **Note :**
> L'appareil `mps` ne prend **pas** en charge la compilation (par exemple `#evox.compile`).
