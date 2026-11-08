---
title: "Genesis : poursuivre les tâches longues quand le contexte se réduit"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 associe compression du contexte, tâches en arrière-plan et points de reprise soumis à un budget pour les travaux prolongés."
updatedDate: 2026-11-08
---

Un test peut encore tourner quand la conversation d’un agent est pleine. Genesis 0.13.8–0.13.10, publié du 26 au 29 octobre 2026, sépare ces deux cycles : compresser le contexte de travail du modèle tout en gardant accessibles la sortie et l’état final des tâches shell détachées.

![Contexte long condensé pendant la poursuite des tâches](./context-compression-continuity.webp)

*Comprimer le contexte de travail, poursuivre l’exécution.*

## Une compression adaptée au budget du modèle

La version 0.13.8 introduit deux étapes : élaguer les résultats d'outils sans appel au modèle, puis produire un résumé de reprise. Le déclenchement dépend de la fenêtre de contexte, avec un réglage par agent et une actualisation de l'état d'exécution. Une jauge indique l'utilisation et le nombre de compressions. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

La version 0.13.10 traite le cas où un message récent trop volumineux empêche une réduction suffisante. Les messages récents sont soumis à un budget de tokens ; les paires appel/résultat restent intactes et les anciennes actualisations sont supprimées, pour ne conserver qu'un état courant. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## L'exécution dépasse un segment de conversation

Introduites dans 0.13.8, les tâches shell détachées survivent à la compression et signalent leur achèvement. L'agent peut consulter leur sortie, les lister ou les arrêter sans maintenir toute l'opération dans un appel bloquant. La version 0.13.9 corrige aussi les tâches restant indéfiniment en cours dans le bac à sable systemd. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## Une continuité fondée sur un état observable

Pour une compilation ou un test long, utilisez une tâche détachée et suivez son état et sa sortie après compression. Le compteur de contexte montre l’usage et le nombre de compressions ; l’état terminal indique si l’exécution a abouti ou échoué. Ces signaux se complètent pour décider de la suite. La [présentation de Genesis](/fr/news/evox-genesis) décrit le workflow global.
