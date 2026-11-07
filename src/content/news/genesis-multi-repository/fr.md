---
title: "Genesis multi-dépôts : un objectif, des historiques distincts"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 ajoute des worktrees persistants aux dépôts associés modifiables, avec des frontières explicites d'exécution, de revue et d'intégration."
---

Une fonctionnalité peut concerner un service API, une application cliente et une bibliothèque partagée. L'objectif est commun, mais les dépôts Git peuvent être distincts. Genesis 0.13.4, publié le 26 septembre 2026, ajoute des worktrees persistants aux dépôts associés modifiables afin de clarifier le lieu d'exécution.

## De l'accès à l'isolation du travail

La version 0.11.4 introduit la lecture-écriture dans des dépôts supplémentaires, leur revue individuelle et les restrictions d'écriture des dépôts en lecture seule. La version 0.13.4 permet aux agents de travailler dans un worktree persistant par dépôt modifiable, sans déplacer son HEAD principal ni perturber son espace de travail principal.

Les chemins sont résolus par rapport à ce worktree. Le contexte initial en indique l'emplacement et la délégation inter-dépôts l'utilise comme base. Le lieu des modifications devient explicite, même si les structures de dossiers ou les activités de développement diffèrent.

## Une décision d'intégration par dépôt

La version 0.13.0 introduit des cartes de revue avec fusion, rejet, vérifications et états de résolution distincts. Le raccourci de fusion globale accepte les dépôts restants tout en affichant leurs résultats individuels. Il corrige aussi les revues des tâches ne modifiant que des dépôts associés.

Pour une modification d'API, les contributions au service, au client et à la bibliothèque se vérifient dans leurs historiques respectifs. Des interfaces compatibles et des tests adaptés restent nécessaires : une fusion multi-dépôts ne prouve ni une transaction atomique ni une compatibilité automatique.

## Une base pour des systèmes plus vastes

L'étape concerne autant l'organisation que la génération du travail. Genesis coordonne les contributions entre dépôts en préservant les endroits où les utilisateurs les examinent et les acceptent. Cette évolution étend l'approche logicielle d'EvoX à des systèmes composés de parties maintenues indépendamment, dont les versions acceptées deviennent les prochains points de départ.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.11.4) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
