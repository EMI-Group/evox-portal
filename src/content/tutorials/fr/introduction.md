---
title: "1. Introduction"
order: 1
---

# 1. Introduction

## Qu'est-ce qu'EvoX ?

EvoX est une bibliothèque open source de calcul évolutif, principalement utilisée pour résoudre divers problèmes d'optimisation complexes. Le calcul évolutif est une catégorie d'algorithmes qui simulent l'évolution naturelle pour rechercher des solutions optimales, incluant les Algorithmes Génétiques (GA), les Stratégies d'Évolution (ES), l'Optimisation par Essaim de Particules (PSO), etc.

Les frameworks évolutifs traditionnels sont souvent limités par les ressources de calcul et les modèles de programmation, ce qui les rend inefficaces pour les problèmes à grande échelle. EvoX surmonte ces défis en combinant **l'accélération GPU** et le **calcul distribué**, offrant une solution efficace et évolutive qui permet aux utilisateurs de trouver de meilleures solutions plus rapidement dans des espaces de recherche complexes.

## Caractéristiques clés d'EvoX

- **Architecture modulaire** : EvoX décompose le processus d'optimisation en modules indépendants : Algorithme, Problème, Moniteur et Workflow. Les utilisateurs n'ont pas besoin de se soucier des implémentations parallèles de bas niveau — EvoX exploite automatiquement le matériel pour améliorer les performances.
- **Exécution distribuée** : EvoX prend en charge l'exécution distribuée multi-GPU et même multi-nœuds. Le même code peut s'exécuter sur une seule machine ou être mis à l'échelle sur un cluster GPU avec peu ou pas d'effort de programmation parallèle supplémentaire. Cela signifie que vos tâches d'optimisation peuvent facilement passer d'un ordinateur portable à un environnement de cluster de serveurs.
- **Interface de programmation fonctionnelle** : EvoX fournit une interface de programmation fonctionnelle qui s'aligne étroitement avec les modèles mathématiques. Les algorithmes principaux sont implémentés comme des fonctions pures sans effets de bord, simplifiant la parallélisation et le débogage. Les utilisateurs n'ont qu'à implémenter les fonctions requises telles que définies par le framework, sans gérer manuellement les états complexes des algorithmes.
- **Visualisation et surveillance** : EvoX inclut des outils de visualisation riches et des modules de surveillance pour suivre le processus évolutif en temps réel. Il utilise un format de données dédié `.exv` pour le streaming et la journalisation efficaces des données d'optimisation et fournit des modules de visualisation conviviaux pour tracer les courbes de convergence et plus encore. Ces outils donnent aux utilisateurs une compréhension intuitive des performances de l'algorithme et de l'état de convergence.
- **Bibliothèques étendues d'algorithmes et de problèmes** : EvoX inclut plus de 50 algorithmes évolutifs mono-objectif et multi-objectif et plus de 100 problèmes d'optimisation de référence. Qu'il s'agisse d'optimisation de fonctions classiques, de défis d'ingénierie complexes ou de tâches d'apprentissage automatique comme l'optimisation d'hyperparamètres (HPO) et la neuroévolution, EvoX fournit des algorithmes et des interfaces de problèmes prêts à l'emploi.

## Cas d'utilisation

Grâce aux caractéristiques ci-dessus, EvoX est particulièrement adapté aux scénarios suivants :

- **Optimisation de paramètres à grande échelle** : Pour les problèmes de haute dimension avec de grands espaces de recherche, le calcul parallèle basé sur GPU d'EvoX et ses algorithmes efficaces peuvent réduire considérablement le temps de résolution. Les exemples incluent l'optimisation des poids de réseaux de neurones ou la conception de paramètres de systèmes complexes — EvoX peut accélérer le processus.
- **Optimisation multi-objectif** : Lorsque vous devez optimiser simultanément plusieurs objectifs (souvent contradictoires) — comme équilibrer le coût et la performance dans la conception d'ingénierie — EvoX inclut une variété d'algorithmes évolutifs multi-objectif (comme NSGA-II, RVEA, etc.) pour rechercher l'ensemble Pareto-optimal.
- **Optimisation d'hyperparamètres (HPO)** : La recherche des meilleures combinaisons d'hyperparamètres pour les modèles d'apprentissage automatique peut être chronophage. EvoX permet l'utilisation de stratégies évolutives pour rechercher efficacement des configurations d'hyperparamètres, trouvant souvent de meilleures solutions plus rapidement que la recherche par grille ou la recherche aléatoire.
- **Apprentissage par renforcement et neuroévolution** : EvoX prend nativement en charge les environnements d'apprentissage par renforcement (comme OpenAI Gym et Google Brax) et les jeux de données d'apprentissage profond (comme CIFAR-10). Cela permet aux utilisateurs d'entraîner des politiques de contrôle ou des architectures de réseaux de neurones en utilisant des algorithmes évolutifs (c'est-à-dire la neuroévolution) — par exemple, utiliser des algorithmes génétiques pour optimiser les paramètres de politique RL.
- **Recherche académique et applications d'ingénierie** : Pour les chercheurs en algorithmes évolutifs, EvoX offre une plateforme hautement flexible pour implémenter et tester de nouvelles méthodes. Pour les tâches d'optimisation en ingénierie (comme le réglage des paramètres de processus industriels ou l'ajustement des systèmes de contrôle), EvoX fournit un solveur haute performance capable d'obtenir des solutions quasi-optimales dans un délai raisonnable.

En résumé, EvoX convient à toute tâche d'optimisation qui **nécessite d'explorer rapidement un grand espace de solutions**, tant que la tâche peut être massivement parallélisée sur un GPU. Que vous soyez un chercheur en IA ou un développeur en ingénierie confronté à des problèmes d'optimisation complexes, EvoX est un outil puissant pour améliorer votre efficacité de résolution.

> **Astuce :**
> EvoX peut fonctionner sur de nombreux appareils GPU, y compris les GPU NVIDIA et les GPU AMD, ou même le GPU de votre Mac.
