---
title: "Genesis Server : un environnement persistant pour développer des logiciels"
pubDate: 2026-11-02
summary: "De la distribution sans interface de bureau en 0.13.11 au maintien après déconnexion en 0.14.0, Genesis rend son dashboard et ses agents déployables indépendamment."
---

Genesis 0.14.0, publié le 2 novembre 2026, détecte l'état du lingering systemd au démarrage et propose de l'activer. Il prolonge la distribution headless introduite dans 0.13.11 le 30 octobre. L'environnement d'exécution du développement peut ainsi avoir un cycle de vie distinct de la session de bureau.

## Une distribution serveur avec des commandes d'exploitation

La distribution inclut le dashboard et l'exécution des agents pour Linux x64/arm64 et macOS arm64. La CLI couvre service, démarrage, arrêt, état, journaux, santé et version. Le script d'installation vérifie les sommes de contrôle, installe ou met à niveau le paquet et crée le lien vers l'exécutable.

Ces interfaces servent à exploiter un processus persistant. Le point de santé renvoie état, version et durée de fonctionnement ; les journaux exposent l'activité. Un processus sain ne prouve toutefois ni la correction des changements d'un agent ni la réussite des tests. Santé d'exécution et validation logicielle restent distinctes.

## Gérer le cycle de vie autour de l'exécution

Sous Linux avec systemd, le lingering peut être nécessaire pour maintenir les services utilisateur après déconnexion. La version 0.14.0 vérifie cette condition, configurable avec GENESIS_LINGER ou --no-linger. Ce mécanisme dépend de la plateforme : tous les systèmes ne se comportent pas identiquement.

La version précédente améliore aussi le démarrage distant : enveloppe POSIX shell, traitement des chemins contenant des espaces et raisons d'échec lisibles. Les corrections du mode serveur et le calcul exact de la durée de fonctionnement facilitent le diagnostic.

## Le déploiement fait partie du développement

Pour un travail prolongé, choisir la machine d'exécution fait partie du processus. La distribution serveur fournit un composant déployable doté de commandes explicites de cycle de vie. Elle élargit l'accès à Genesis au-delà du bureau et renforce l'exploitation de l'infrastructure EvoX, sans remplacer revue, validation ou choix des résultats à accepter.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)
