---
title: "Genesis : déléguer du développement local via MCP"
pubDate: 2026-11-12
summary: "La branche main de Genesis ajoute un point d’accès MCP local pour lancer des tâches, les suivre par identifiant et récupérer leurs résultats depuis un agent de développement."
---

Un agent de développement dispose parfois déjà de l’objectif et du chemin du projet. S’il confie le travail à un autre moteur, il lui faut pouvoir le lancer, le suivre et en récupérer le résultat depuis la même conversation. Le 11 novembre 2026, Genesis a intégré à `main` un point d’accès local au Model Context Protocol (MCP). Les agents compatibles accèdent ainsi aux API de tâches existantes par une seule connexion. [Modification intégrée][pr]

![Deux terminaux sur un même établi échangent une fiche de tâche et le résultat associé](./genesis-local-mcp.webp)

*Illustration éditoriale du passage de relais local entre un agent de développement et Genesis.*

## Se connecter au processus Genesis qui exécute le travail

Le point d’accès Streamable HTTP `/mcp` est monté sur le serveur Genesis en cours d’exécution. Le serveur authentifie la requête, vérifie ses arguments et appelle l’API de tâches ou de planification existante. Le travail se poursuit après la fin de la requête HTTP. La connexion est sans état : conservez l’identifiant de la tâche pour la retrouver.

Genesis accepte les connexions en boucle locale et vérifie Host et Origin. Les requêtes utilisent un jeton bearer provenant du fichier `mcp-token` de l’instance en cours d’exécution. L’hôte de l’agent doit prendre en charge Streamable HTTP et conserver l’en-tête d’autorisation. Genesis et le répertoire de projet accessible en écriture doivent être sur la même machine. Le [guide de connexion][guide] explique la configuration d’une compilation intégrant ce changement. Pour la configuration du serveur publié, consultez [Genesis 0.14.1][related].

## Donner un objectif exploitable

Imaginez qu’un agent a identifié un défaut dans un analyseur et que vous lui demandez de déléguer un test de régression. Il peut vérifier la configuration locale avec `genesis_check`, puis appeler `genesis_start_task` avec le chemin absolu de la copie de travail principale et un objectif précisant l’entrée problématique, le comportement attendu et le test à lancer. Genesis utilise son propre modèle configuré. L’objectif doit donc inclure les éléments pertinents de la conversation initiale.

Les neuf outils couvrent la vérification de l’état de préparation, le rechargement de la configuration, la découverte des modèles, la soumission, la liste, l’état et les résultats des tâches, ainsi que les messages et l’annulation. Un dépôt Git existant doit avoir un premier commit. Ce point d’entrée exige une copie de travail principale dotée d’un répertoire `.git` et rejette les worktrees liés et les racines de sous-modules. [Conditions relatives aux tâches et dépôts][guide]

## Retrouver la tâche après une reconnexion

Conservez l’identifiant retourné à la soumission. Après une reconnexion, interrogez `genesis_get_task` avec cet identifiant ou listez les tâches récentes du projet avant de renvoyer la requête. L’état présente une vue limitée de la progression issue du planificateur et des données enregistrées. Lors du suivi, le client peut omettre le résultat complet et utiliser le jeton de changement pour une attente de durée limitée.

La réponse à un message atteste sa mise en file. La réponse à une annulation décrit la demande acceptée et l’état enregistré. Pour établir le résultat, consultez l’état final, récupérez le résultat enregistré avec `genesis_get_result` et examinez les commits et les preuves de tests signalés. [Observation et contrôle des tâches][guide]

## Vérifier la connexion avant de déléguer

Compilez la révision concernée et configurez le fournisseur sur l’instance Genesis qui exécutera le travail. Suivez le guide pour créer un jeton privé et enregistrer l’adresse de boucle locale réelle dans le client. Ouvrez ensuite une nouvelle session cliente et appelez `genesis_check` pour vérifier séparément la connexion MCP et la disponibilité du modèle avant de soumettre une tâche. [Configuration et vérifications][guide]

[pr]: https://github.com/EMI-Group/genesis/pull/171
[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/agent-mcp.md
[related]: /fr/releases/genesis-0-14-1
