---
title: "Outils et compétences Genesis : intégrer les méthodes du projet"
pubDate: 2026-09-26
summary: "Les outils personnalisés de Genesis 0.13.1 et les modifications de compétences dans les worktrees de 0.13.4 relient opérations dédiées et consignes réutilisables au développement."
updatedDate: 2026-11-08
---

Un projet conserve du code, mais aussi des façons de le construire, vérifier et modifier. Genesis 0.13.4, publié le 26 septembre 2026, place les modifications des outils de compétences dans le worktree et les rend révisables dans Git. Avec les outils personnalisés de 0.13.1, publiés le 21 septembre, il offre deux voies distinctes pour intégrer les méthodes du projet.

![Une boîte à outils sombre reliée par un fil rouge à un manuel ivoire](./project-tools-guidance.webp)

## Exposer des opérations par des outils personnalisés

La version 0.13.1 charge les outils définis par l'utilisateur depuis le répertoire tools de la configuration. Ils apparaissent dans les réglages, peuvent intégrer les listes d'outils autorisés des agents personnalisés et passent par le répartiteur central. Le projet peut exposer une opération explicite plutôt que dépendre uniquement d'un shell généraliste. [v0.13.1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1)

Une équipe pourrait, par exemple, envelopper son vérificateur existant d'un contrat d'entrée et de sortie défini.

La version 0.13.4 permet aussi de combiner texte et images ou audio dans les résultats des outils. Une opération peut ainsi fournir un artefact inspectable par l’agent en complément du rapport écrit. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Placer les compétences là où le code est relu

La version 0.13.4 lit et écrit les compétences dans le worktree de l'agent et permet d'enregistrer les changements par commit, avec un indicateur optionnel. Les consignes rédigées par l'agent deviennent inspectables sur sa branche. La découverte et la suppression des compétences sont également corrigées. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

Les outils définissent les opérations appelables ; les skills indiquent quand les appeler et comment utiliser leurs résultats. Un vérificateur de projet et son guide d’interprétation associent opération exécutable et instructions révisables.

## Commencer par une opération du projet

Choisissez un contrôle répétable. Définissez entrées, sorties et permissions de l’outil personnalisé, puis rédigez un skill indiquant son moment d’utilisation. Avant réutilisation, examinez le diff du skill sur la branche de l’agent et exécutez l’outil. La [vue historique](/fr/news/genesis-development-history) permet de suivre les révisions.
