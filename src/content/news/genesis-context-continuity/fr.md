---
title: "Genesis : poursuivre le développement au-delà d'une fenêtre de contexte"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 associe compression du contexte, tâches en arrière-plan et points de reprise soumis à un budget pour les travaux prolongés."
---

Une compilation longue, une réponse volumineuse d'un outil et une conversation croissante exercent des pressions différentes sur une tâche de développement. Publié le 29 octobre 2026, Genesis 0.13.10 prolonge les changements de 0.13.8 en séparant l'exécution en cours de la conversation limitée accessible au modèle. La continuité de l'infrastructure de développement d'EvoX dépend de ces deux dimensions.

## Une compression adaptée au budget du modèle

La version 0.13.8 introduit deux étapes : élaguer les résultats d'outils sans appel au modèle, puis produire un résumé de reprise. Le déclenchement dépend de la fenêtre de contexte, avec un réglage par agent et une actualisation de l'état d'exécution. Une jauge indique l'utilisation et le nombre de compressions.

La version 0.13.10 traite le cas où un message récent trop volumineux empêche une réduction suffisante. Les messages récents sont soumis à un budget de tokens ; les paires appel/résultat restent intactes et les anciennes actualisations sont supprimées, pour ne conserver qu'un état courant. Il s'agit de préserver un contexte exploitable, sans prétendre à une mémoire sans perte.

## L'exécution dépasse un segment de conversation

Introduites dans 0.13.8, les tâches shell détachées survivent à la compression et signalent leur achèvement. L'agent peut consulter leur sortie, les lister ou les arrêter sans maintenir toute l'opération dans un appel bloquant. La version 0.13.9 corrige aussi les tâches restant indéfiniment en cours dans le bac à sable systemd.

## Une continuité fondée sur un état observable

Un test prolongé exige un cycle de vie pour son exécution, son état et sa sortie, indépendant du résumé de la conversation. Ces changements rendent cette séparation explicite. Ils ne garantissent ni l'achèvement de toute tâche ni la conservation de chaque détail. Ils offrent une base plus inspectable pour continuer malgré un contexte fini.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)
