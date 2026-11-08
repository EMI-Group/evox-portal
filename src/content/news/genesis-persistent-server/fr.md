---
title: "Genesis Server : un environnement persistant pour développer des logiciels"
pubDate: 2026-11-02
summary: "De la distribution sans interface de bureau en 0.13.11 au maintien après déconnexion en 0.14.0, Genesis rend son dashboard et ses agents déployables indépendamment."
updatedDate: 2026-11-08
---

Genesis 0.14.0, publié le 2 novembre 2026, détecte l'état du lingering systemd au démarrage et propose de l'activer. Il prolonge la distribution headless introduite dans 0.13.11 le 30 octobre. L'environnement d'exécution du développement peut ainsi avoir un cycle de vie distinct de la session de bureau.

![Un serveur anthracite reste allumé près d’un paravent](./persistent-server-session.webp)

## Une distribution serveur avec des commandes d'exploitation

La distribution inclut le dashboard et l'exécution des agents pour Linux x64/arm64 et macOS arm64. La CLI couvre service, démarrage, arrêt, état, journaux, santé et version. Le script d'installation vérifie les sommes de contrôle, installe ou met à niveau le paquet et crée le lien vers l'exécutable. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Gérer le cycle de vie autour de l'exécution

Sous Linux avec systemd, le lingering peut être nécessaire pour maintenir les services utilisateur après déconnexion. La version 0.14.0 vérifie cette condition, configurable avec `GENESIS_LINGER` ou `--no-linger`. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

La version précédente améliore aussi le démarrage distant : enveloppe POSIX shell, traitement des chemins contenant des espaces et raisons d'échec lisibles. Les corrections du mode serveur et le calcul exact de la durée de fonctionnement facilitent le diagnostic. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Avant de laisser le serveur fonctionner

Avant de déplacer une tâche longue vers le serveur, vérifiez son état, ses journaux et la réponse de `/health`. Sur un hôte systemd, confirmez le réglage de lingering, puis vérifiez la disponibilité après déconnexion. Ces contrôles établissent la référence d’exécution ; l’[historique de développement](/fr/news/genesis-development-history) permet ensuite de suivre le code produit.
