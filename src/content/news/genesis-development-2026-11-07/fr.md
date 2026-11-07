---
title: "Développement de Genesis : Assistant et serveur distant partagé"
pubDate: 2026-11-07
summary: "La branche main reçoit un chat de pilotage, un serveur distant partagé et une gestion simplifiée des tâches en arrière-plan."
---

Les changements intégrés à la branche `main` de Genesis du 4 au 7 novembre 2026 améliorent l’exploitation quotidienne.

Genesis Assistant devient un chat de pilotage dans le tableau de bord : il peut examiner les tâches et la capacité du système, puis demander des opérations ou des changements de configuration. Ses niveaux read/write/sudo distinguent la consultation des opérations nécessitant l’approbation du code exact ; sudo dispose d’une carte distincte. Consultez le [guide Assistant][assistant] pour connaître les limites.

Le développement distant partage désormais une instance serveur avec le tableau de bord HTTP. `genesis remote stop` désactive la distribution distante en laissant HTTP actif. Les tâches en arrière-plan reçoivent des identifiants courts comme `bash-1` ; `job_output` peut omettre `job_id` lorsque l’agent appelant ne possède qu’une tâche.

Dans les builds de développement, le chemin personnalisé du fichier d’identifiants OAuth appartient désormais à chaque profil de modèle (`[[llm.models]]`), plutôt qu’au paramètre global `[llm] oauth_file`.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

