---
title: "Genesis met tout l’arbre de tâches en pause sans terminer les enfants inachevés"
pubDate: 2026-11-26
summary: "Un instantané coordonné conserve les attentes des parents, les identités des enfants et les checkpoints des arbres de travail, puis reprend la même tâche, avec réparation si nécessaire."
---

Une tâche de développement peut attendre plusieurs agents enfants lorsque son propriétaire appuie sur Pause. Déclarer leurs lots terminés uniquement pour s’arrêter modifierait le travail à préserver. Les changements de Genesis sur main du 25 novembre 2026 introduisent un instantané coordonné de l’arbre entier : les parents gardent leur position d’attente, les enfants leurs identités et checkpoints, et la reprise reconstitue cette relation sous le même identifiant de tâche. [Conception et implémentation][design]

![Un mobile ramifié maintenu en position par un cadre de soutien](./cover.webp)

*Illustration conceptuelle : conserver chaque branche inachevée avant de reprendre toute la structure.*

## Une étape du cycle de vie, pas un frein global

La pause globale du planificateur bloque l’admission de nouveaux travaux ; elle ne place pas une tâche en cours dans un état de repos durable. Le protocole propre à la tâche passe par pausing puis paused, conserve son contexte de résultat et laisse sa date de fin vide. L’annulation reste distincte et l’emporte si elle arrive pendant la pause. Les sessions interactives sont hors de ce protocole. [Intégration au registre][registry]

Par exemple, un agent coordonnant un parseur et ses tests peut attendre deux enfants. La pause doit préserver cette attente, sans inventer des résultats terminés. Le coordinateur marque les membres actifs pour la pause, retire les demandes en file de créneaux de modèles ou d’outils et immobilise les parents attendant leur lot de sous-agents. Chaque agent s’arrête à une frontière de tour après son lot d’outils, ou à sa position d’attente. [Coordinateur de gel][coordinator]

## Préserver le travail avant de récupérer les ressources

Avant de s’arrêter, un agent récupère ses tâches d’arrière-plan, crée un checkpoint de son arbre de travail, conserve le marqueur durable d’outil en attente et écrit son état. Les commits de checkpoint sont ancrés pour survivre à la récupération ultérieure des arbres de travail. L’instantané note si l’agent se trouvait à une frontière de tour, attendait des enfants ou était dans un lot interrompu. La pause rapporte son propre résultat ; elle ne déclare pas un enfant inachevé réussi et ne fusionne pas son travail. [Chemin de gel de l’agent][agent]

L’attente est bornée. Le réglage documenté laisse 120 secondes pour atteindre le repos, puis 10 secondes de grâce pour un gel forcé. Une pause clean exige que chaque agent prouve un arrêt durable non interrompu. Si le délai expire ou si cette preuve manque, la tâche enregistre une pause dirty. Cette distinction décrit l’état d’exécution sauvegardé ; elle ne promet pas l’annulation de n’importe quel effet externe.

## Reconstituer la collaboration existante

La reprise remet la même tâche en file avec ses options persistées. Un enregistrement racine durable est nécessaire ; des lignes enfants seules ne suffisent pas, et un stockage illisible produit une erreur explicite. Le plan de restauration reconstruit identités, topologie et positions. Un enfant terminé fournit son résultat stocké, un enfant actif redémarre avec sa propre identité et son checkpoint, et un enfant gelé avant son enregistrement peut partir de sa spécification d’appel initiale. Le parent attend de vrais résultats. [Chemin de dégel][thaw]

Un lot gelé proprement est restauré sans la réparation d’outils pendants employée pour le travail interrompu. Un instantané dirty applique cette réparation et un avis de reprise, distinguant le travail dont l’achèvement est connu de l’exécution incertaine. Un checkpoint non prouvé ne doit pas être adopté silencieusement comme checkpoint enfant propre. Au redémarrage ou à la réconciliation des baux, une tâche running ou pausing avec persistance et ligne racine durable devient paused avec le type dirty ; une tâche non reprenable conserve l’échec par expiration du bail.

## Vérifier une pause et une reprise avant de s’y fier

Utilisez une construction des sources incluant ces commits et activez la persistance des agents. Mettez en pause une tâche avec des enfants actifs, attendez l’état paused, puis reprenez et vérifiez l’identité de la tâche, les liens entre enfants et le travail conservé. Examinez tout avis de pause dirty avant de poursuivre des opérations externes. Sans persistance, la pause est refusée ; la récupération dépend des checkpoints durables. Le [workflow précédent][related] explique le contexte de projet et d’approbation ; cette évolution définit la conservation de l’exécution inachevée.

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /fr/news/genesis-assistant-project-workflows
