---
title: "Genesis multi-dépôts : un objectif, des historiques distincts"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 ajoute des worktrees persistants aux dépôts associés modifiables, avec des frontières explicites d'exécution, de revue et d'intégration."
updatedDate: 2026-11-08
---

Une fonctionnalité peut concerner un service API, une application cliente et une bibliothèque partagée. L'objectif est commun, mais les dépôts Git peuvent être distincts. Genesis 0.13.4, publié le 26 septembre 2026, ajoute des worktrees persistants aux dépôts associés modifiables afin de clarifier le lieu d'exécution.

![Historiques de dépôts distincts reliés à un même projet](./companion-worktrees.webp)

## De l'accès à l'isolation du travail

La version 0.11.4 introduit la lecture-écriture dans des dépôts supplémentaires, leur revue individuelle et les restrictions d'écriture des dépôts en lecture seule. La version 0.13.4 permet aux agents de travailler dans un worktree persistant par dépôt modifiable, sans déplacer son HEAD principal ni perturber son espace de travail principal. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

Les chemins sont résolus par rapport à ce worktree. Le contexte initial en indique l'emplacement et la délégation inter-dépôts l'utilise comme base. Le lieu des modifications devient explicite, même si les structures de dossiers ou les activités de développement diffèrent. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Une décision d'intégration par dépôt

La version 0.13.0 introduit des cartes de revue avec fusion, rejet, vérifications et états de résolution distincts. Le raccourci de fusion globale accepte les dépôts restants tout en affichant leurs résultats individuels. Il corrige aussi les revues des tâches ne modifiant que des dépôts associés. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

Pour modifier une API, examinez séparément les contributions du service, du client et de la bibliothèque. Convenez des versions d’interface et de l’ordre d’intégration, puis testez le résultat combiné.

## Préparer la revue entre dépôts

Avant de déléguer, identifiez le worktree modifiable de chaque dépôt. Ensuite, sa carte de revue permet d’inspecter modifications, contrôles de fusion et état de résolution. Le travail transversal devient un ensemble de décisions d’acceptation concrètes. La [vue historique](/fr/news/genesis-development-history) aide à retrouver les commits correspondants.
