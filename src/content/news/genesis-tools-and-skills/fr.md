---
title: "Outils et compétences Genesis : intégrer les méthodes du projet"
pubDate: 2026-09-26
summary: "Les outils personnalisés de Genesis 0.13.1 et les modifications de compétences dans les worktrees de 0.13.4 relient opérations dédiées et consignes réutilisables au développement."
---

Un projet conserve du code, mais aussi des façons de le construire, vérifier et modifier. Genesis 0.13.4, publié le 26 septembre 2026, place les modifications des outils de compétences dans le worktree et les rend révisables dans Git. Avec les outils personnalisés de 0.13.1, publiés le 21 septembre, il offre deux voies distinctes pour intégrer les méthodes du projet.

## Exposer des opérations par des outils personnalisés

La version 0.13.1 charge les outils définis par l'utilisateur depuis le répertoire tools de la configuration. Ils apparaissent dans les réglages, peuvent intégrer les listes d'outils autorisés des agents personnalisés et passent par le répartiteur central. Le projet peut exposer une opération explicite plutôt que dépendre uniquement d'un shell généraliste.

Une équipe pourrait, par exemple, envelopper son vérificateur existant d'un contrat d'entrée et de sortie défini. C'est un usage possible de l'extension, pas une intégration fournie. Implémentation, permissions et signification des résultats restent à définir par le projet.

## Placer les compétences là où le code est relu

La version 0.13.4 lit et écrit les compétences dans le worktree de l'agent et permet d'enregistrer les changements par commit, avec un indicateur optionnel. Les consignes rédigées par l'agent deviennent inspectables sur sa branche. La découverte et la suppression des compétences sont également corrigées.

Les outils exposent des opérations appelables ; les compétences portent des consignes réutilisables. Ces rôles se complètent sans se confondre. Git rend une modification visible et versionnée, sans prouver sa correction ou son utilité.

## Étendre les capacités sans perdre la revue

Ces extensions rapprochent l'examen des méthodes générées de celui du code. Dans l'écosystème EvoX, l'amélioration peut concerner l'implémentation comme les consignes utilisées pour la développer. Acceptation et validation restent nécessaires pour transformer une proposition en base fiable pour la suite.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
