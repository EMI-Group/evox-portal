---
title: "Genesis Assistant : mieux comprendre et piloter le travail en cours"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Consulter les tâches, comprendre la capacité du système et agir dans une même conversation. Les changements récents de la branche main simplifient aussi services distants, tâches de fond et identifiants des modèles."
---

Une tâche de développement longue soulève des questions bien après son démarrage : que reste-t-il en cours, pourquoi une tâche a-t-elle échoué et quelle suite donner ? Les changements intégrés à `main` du 4 au 7 novembre 2026 amènent ces questions dans la conversation Assistant du tableau de bord Genesis, tout en améliorant les services sous-jacents.

![Illustration conceptuelle reliant une conversation à plusieurs flux de tâches sur une plateforme partagée](./genesis-assistant-task-flows.webp)

*Une conversation, plusieurs flux de travail : une illustration éditoriale de l’idée centrale de cette mise à jour.*

## Partir de la tâche pour choisir l’action

Genesis Assistant peut lire le code et la documentation de Genesis, examiner les tâches et consulter la capacité actuelle du planificateur. Vous pouvez lui demander d’analyser l’état, l’erreur et le résultat d’une tâche échouée, puis de reprendre un travail antérieur. La conversation relie explication et opérations sur le nœud actuellement consulté.

Le [guide Assistant][assistant] propose des points de départ concrets : lister le travail en cours, vérifier les créneaux de modèles disponibles ou suspendre la planification pendant une fusion. Les tâches déjà lancées continuent pendant cette pause. Réglages temporaires d’exécution et configuration enregistrée restent distincts : une adaptation de session ne devient pas implicitement une valeur permanente.

La consultation utilise le niveau `read`. Les changements passent par `write`, avec approbation du code exact ; `sudo` possède une carte séparée. L’action proposée devient ainsi visible au moment où une question se transforme en opération.

## Un serveur, deux modes de connexion

Le développement distant et le tableau de bord HTTP partagent désormais une seule instance serveur. Les commandes distantes lançaient auparavant une instance séparée, dédiée à la distribution. Avec ce [serveur partagé][remote], `genesis remote stop` désactive la distribution distante tout en laissant le tableau de bord HTTP accessible. Déconnecter le développement distant ne nécessite plus d’arrêter ce service HTTP commun.

## Des détails qui facilitent le suivi

Les [tâches en arrière-plan][jobs] reçoivent désormais des identifiants courts tels que `bash-1`. Si l’agent appelant ne possède qu’une tâche, `job_output` la retrouve sans `job_id`. S’il en possède plusieurs, il renvoie leurs identifiants, états et libellés pour permettre de choisir la bonne.

Les [chemins personnalisés de fichiers d’identifiants OAuth][oauth] appartiennent désormais aux profils de modèles sous `[[llm.models]]`, à la place du réglage global `[llm] oauth_file`. Chaque chemin peut ainsi être géré avec le modèle auquel il sert.

Ces changements clarifient les points de contact avec le travail en cours : une tâche à examiner, une action à approuver et un état de service plus facile à suivre. Découvrez le système dans la [présentation de Genesis][intro], puis consultez le [guide Assistant][assistant] pour les opérations précises.

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /fr/news/evox-genesis

