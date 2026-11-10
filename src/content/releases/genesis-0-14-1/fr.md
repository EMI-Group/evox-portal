---
title: "Genesis 0.14.1 : conserver les choix de modèle tout au long du travail"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Profils de modèles par compte, authentification par abonnement et serveur distant commun : les mécanismes de Genesis 0.14.1 et les vérifications utiles lors de la mise à jour."
---

Choisir un modèle, c'est aussi choisir le compte facturé, ses identifiants et les paramètres de raisonnement transmis à la tâche. **Genesis 0.14.1, publié officiellement le 8 novembre 2026**, rend cette identité cohérente dans Settings, Projects, Assistant, l'ordonnanceur et le moteur d'exécution. Cette version unifie aussi l'exécution distante autour du serveur sans interface et renforce le contrôle de l'inspection à l'exécution. [Notes de version complètes][release]

![Un onglet de compte sélectionné reste relié aux choix de modèles correspondants](./provider-account-continuity.webp)

## Configurer le compte, préciser le choix de la tâche

Un provider profile regroupe authentification, endpoint, concurrence et horaires. Son inventaire imbriqué décrit les modèles disponibles sur ce compte et leurs paramètres de génération et de raisonnement. La tâche transporte une identité sans secret : ID de profil, ID de modèle et effort de raisonnement facultatif. Un choix concret verrouille cette identité pour la suite ; **Auto** laisse les règles configurées décider.

Deux modèles d'un compte professionnel partagent ainsi ses créneaux de concurrence et son délai de repli après limitation. Ajouter un modèle ne crée pas un nouveau quota. Un compte personnel peut avoir d'autres identifiants et horaires. Pour utiliser des API keys distinctes, il faut aussi des noms d'identifiants distincts, en plus des IDs de profil. [Configuration et règles de sélection][profiles]

Chaque modèle sélectionnable doit figurer dans `[[llm.providers.models]]` ; `default_model` seul ne suffit pas. Le raisonnement par défaut est distinct de la liste des efforts pris en charge. Dans le tableau de bord, une liste non vide sans valeur par défaut résolue sélectionne le premier effort ; un appel à l'API interne qui omet l'effort peut omettre le paramètre. Vérifiez modèle et effort après un changement de profil.

La version corrige la perte des choix explicites entre tâche, agent et système, les pools de repli de l'ordonnanceur et les instantanés incomplets pouvant provoquer `:model_spec_schema_unavailable`. Les réglages archivés sont désormais compatibles JSON et masquent les secrets. Cela concerne aussi bien les nouvelles tâches que la réutilisation d'une configuration enregistrée.

## L'abonnement suit la configuration du compte

Les profils compatibles disposent de l'authentification OAuth/par abonnement et d'un état de connexion individuel. Genesis importe les fichiers de connexion des CLI fournisseurs dans un fichier géré que lit ReqLLM. `openai_codex` est réservé à OAuth ; les profils d'abonnement Anthropic utilisent `auth_mode = "oauth"`. Le guide versionné commence par `codex login` ou une connexion Claude CLI sur le nœud qui utilisera le compte. [Configurer l'abonnement][oauth]

Le fichier géré par défaut est `auth.json`, à côté de `config.toml`. Un `oauth_file` personnalisé appartient au provider profile ; la clé globale `[llm] oauth_file` est supprimée. Les nouveaux fichiers ont le mode `0600` et les imports sont atomiques. Le fichier contient une entrée par provider : des IDs de profil différents n'isolent donc pas à eux seuls plusieurs connexions d'abonnement.

Pour une exécution distante, contrôlez l'état de connexion sur le nœud distant. Si la connexion fournisseur existe mais que la destination gérée est en lecture seule, choisissez un chemin privé accessible en écriture ; vous reconnecter ne corrige pas cette destination. Les OAuth tokens fournis uniquement par l'environnement ne peuvent pas être renouvelés automatiquement. Les nouveaux messages distinguent ces situations.

## Un serveur pour le travail distant et le tableau de bord

La distribution séparée `genesis_remote` est retirée. Les commandes distantes et l'amorçage utilisent `genesis_server`, avec HTTP toujours disponible et une distribution Erlang activable à l'exécution par un protocole de fichiers déclenché par SIGHUP. La CLI expose `genesis remote start`, `stop`, `status` et `logs`. [Serveur et installation][readme]

Si votre tableau de bord reste sur un portable et les tâches sur un hôte SSH, la gestion du service change : examinez les scripts qui nomment l'ancienne distribution et gérez le serveur commun. La version permet aussi les tests de projets distants et la reprise de tests au moment de l'appel. Le serveur HTTP sans interface écoute localhost par défaut, sans authentification intégrée ; l'accès distant documenté passe par un tunnel SSH.

## Reprendre plus facilement les interactions longues

L'évaluateur Elixir à niveaux et médiation ajoute une approbation du code exact et une approbation récupérable dans le chat. La sortie est tronquée au budget restant plutôt que de provoquer un échec. S'ajoutent une courte fenêtre de reprise après la limite de tours, des réponses finales sans outil, des IDs de jobs séquentiels plus courts et des identités de cache de prompt stables par exécution d'agent pour les appels GPT OpenAI/Codex. Le tableau de bord reçoit également un panneau de capsules fusionné et des commandes communes de tâche et de modèle. [Détails des changements][release]

## Mettre à jour en gardant la configuration sous les yeux

1. Prenez les installateurs ou les archives serveur de [v0.14.1][release] pour votre plateforme. Sauvegardez la configuration avant de modifier les comptes. L'ancien `[[llm.models]]` reste compatible ; les provider profiles canoniques priment et une sauvegarde explicite dans Settings/config réalise la migration.
2. Dans **Settings → LLM → Provider profiles**, examinez authentification, inventaire imbriqué, raisonnement par défaut et `oauth_file` personnalisé. Les identifiants doivent être accessibles au processus exécutant la tâche, y compris sur un serveur distant.
3. Après redémarrage du serveur sans interface, utilisez `genesis status`, puis vérifiez une sélection explicite profil/modèle/effort, une sélection Auto et votre connexion distante. Examinez les anciens scripts de daemon avant réutilisation. Ces vérifications découlent des changements documentés.

Pour le travail sur les tâches en cours, poursuivez avec [Genesis Assistant : mieux comprendre le travail en cours](/fr/news/genesis-development-2026-11-07).

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
