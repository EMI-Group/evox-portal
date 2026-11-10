---
title: "Genesis en développement : un registre durable pour les projets"
pubDate: 2026-11-10
summary: "Les changements de main du 9 novembre remplacent les projets récents par un registre en base de données et séparent les choix locaux et distants."
---

Ouvrir un dépôt sur une autre machine exige de distinguer son identité des projets locaux. Les changements intégrés à Genesis main le 9 novembre 2026 relient Projects et la palette à un registre VCT en base de données, remplaçant la liste des projets récents. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Des dossiers de projet dans des armoires distinctes avec leurs étiquettes de registre](./project-host-registry.webp)

## Une place enregistrée pour chaque projet

Ouvrir ou créer un projet enregistre son montage via l’interface tenant compte du nœud. La palette recherche les chemins enregistrés ; le projet actif peut afficher son point de montage. La liste distante vient de l’hôte choisi et reste séparée des entrées locales pendant la connexion. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Vérifier l’hôte avant de continuer

Dans une version de développement intégrant ces changements, rouvrez un dépôt local et distant pour vérifier identité et suggestions de chemin. Le registre sert à naviguer ; les modifications de code suivent la validation habituelle du projet.

[Genesis multi-dépôts : un objectif, des historiques distincts](/fr/news/genesis-multi-repository)
