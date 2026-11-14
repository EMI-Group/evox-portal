---
title: "Genesis Assistant : reprendre une conversation en attente"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "La branche main de Genesis maintient les conversations de l’Assistant dans des sessions interactives et affiche le code exact et le nœud cible dans la boîte d’approbation."
---

Une personne peut demander à Genesis Assistant d’examiner une tâche en échec, quitter la conversation pour relire les changements, puis revenir avec une question. Il faut retrouver la conversation et disposer du contexte pour continuer. Les changements intégrés à Genesis `main` du 10 au 12 novembre 2026 maintiennent une session interactive pendant la durée de la conversation et déplacent la liste des conversations dans la barre latérale. [Guide de l’Assistant][guide]

![Une personne revient à une conversation marquée et examine une action proposée](./genesis-assistant-interactive-sessions.webp)

*Illustration éditoriale de la reprise d’une conversation de l’Assistant et de l’examen d’une action.*

## Revenir à une conversation en attente

Ouvrez **Conversations** sous **Active Tasks**. La liste regroupe les sessions actives du nœud sélectionné et les conversations mises en cache localement. Elle distingue les sessions en attente de saisie, en cours et terminées. Sélectionner une conversation ouvre `/assistant?session=<agent_id>`. Les anciens liens `/help` redirigent vers `/assistant` en conservant leurs paramètres. [Modification de la route][route]

Après un échange, la session peut libérer son créneau d’exécution tout en gardant son contexte et son worktree. Le message suivant reprend la même session d’agent avec le même identifiant de cache du prompt. **New chat** ouvre une autre conversation et laisse la précédente dans la liste. Une conversation terminée peut rester visible dans l’historique. [Implémentation des sessions][session]

## Examiner la tâche avant de choisir une action

Prenons une tâche de test en échec. Demandez à l’Assistant de lire son état, son erreur et son résultat sur le nœud consulté. Ouvrez la page de revue, comparez les changements à l’erreur, puis revenez par **Conversations** avec une question plus précise. La conversation existante conserve le contexte. Sur une instance locale, téléchargez les sources de Genesis lorsque l’interface le demande pour que l’Assistant puisse les consulter.

Pour réessayer, demandez à l’Assistant de proposer une nouvelle tâche en s’appuyant sur la précédente. L’inspection utilise le niveau de lecture, tandis que le lancement exige un appel d’écriture. La décision porte sur cet appel précis et sur le nœud sélectionné. [Inspection et niveaux d’exécution][guide]

## Examiner une écriture sans perdre le fil

Une barre fixe entre la conversation et la zone de saisie indique les demandes en attente. **Review** ouvre une boîte de dialogue qui présente une demande à la fois. Vérifiez le code exact et la cible, puis choisissez **Allow once** ou **Deny**. Le niveau `sudo` affiche un avertissement bien visible, car il exécute de l’Elixir natif sous l’identité du serveur Genesis.

La boîte affiche désormais le nœud cible indiqué par le moteur d’exécution ainsi que tout avertissement associé. Vous pouvez parcourir les demandes en file une à une. Une demande restaurée peut s’afficher tant qu’elle reste en attente. Le texte de la conversation et la saisie gardent leur position lorsque la barre change. [Modifications de l’approbation][approval]

## Retrouver le résultat dans la tâche

Après avoir accepté une écriture, consultez la tâche créée et vérifiez son état. Si la réponse a été interrompue ou si l’écriture a expiré, vérifiez l’état actuel avant de réessayer. Sur une compilation intégrant ces changements, commencez par une inspection en lecture seule, changez de page et revenez via **Conversations** pour poser une autre question. La [présentation précédente de l’Assistant][related] décrit les outils sur lesquels repose ce parcours. [Guide actuel][guide]

## Conserver la réponse finale à la fin d’une session

Ajout du 14 novembre : les changements intégrés à `main` le 13 novembre transmettent un instantané final faisant autorité à Assistant et à l’inspecteur de l’agent sélectionné. Transcription et statut terminal sont appliqués ensemble ; les notifications tardives ne rouvrent pas la conversation close. Si le transfert est indisponible, le dernier texte cohérent en cache reste visible, sans lecture indépendante de l’historique. L’inspecteur peut conserver les détails d’un agent terminé hors de l’arbre actif. Sur une version contenant ce changement, gardez la conversation sélectionnée jusqu’à sa fin et vérifiez l’accord entre texte final et statut avant de relancer le travail. [Implémentation du transfert final][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /fr/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
