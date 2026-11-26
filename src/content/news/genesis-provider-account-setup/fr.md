---
title: "Genesis relie configuration des comptes, choix des modèles et connexion ChatGPT"
pubDate: 2026-11-22
updatedDate: 2026-11-26
summary: "Un assistant de configuration reconstruit réunit identifiants, inventaire des modèles, raisonnement et horaires, avec une connexion ChatGPT gérée par Genesis."
---

Une connexion de modèle utilisable exige plus qu’un nom : authentification, endpoint, options de raisonnement et limites partagées doivent correspondre. Les changements fusionnés dans Genesis `main` les 19 et 20 novembre 2026 reconstruisent Welcome et Settings autour des comptes fournisseurs. La PR #175 ajoute **Sign in with ChatGPT**, remplaçant l’ancien chemin d’importation des identifiants Codex pour les profils d’abonnement ChatGPT. [Intégration][pr]

![Une clé de compte et les réglages du modèle sélectionné rangés dans une même boîte à instruments](./cover.webp)

*Illustration conceptuelle : authentification et choix des modèles appartiennent à un compte configuré.*

## Configurer le compte, puis ses modèles

Welcome utilise désormais un assistant fournisseur par étapes ; Settings assure la gestion ultérieure des comptes. Les noms et identifiants générés viennent du fournisseur, pas du modèle choisi. Un compte peut servir plusieurs modèles et niveaux de raisonnement partageant identifiants, concurrence et horaires. Des comptes distincts restent adaptés lorsque ces propriétés diffèrent. [Contrat des profils][profiles]

Une équipe utilisant un endpoint compatible OpenAI peut, par exemple, configurer une seule fois URL de base et identifiant, ajouter les modèles réellement disponibles, puis choisir modèle et raisonnement pour une tâche. L’intégration rend accessible la saisie de clé API pour les endpoints personnalisés et route leurs comptes de modèles via OpenAI Chat Completions. Chaque modèle sélectionnable doit figurer dans l’inventaire ; son seul nom comme modèle par défaut ne l’enregistre pas. Testez le modèle choisi, pas seulement le remplissage du champ d’authentification. [Intégration et essais navigateur][pr]

L’assistant sépare les niveaux de raisonnement annoncés par un modèle de sa valeur par défaut. Le choix par défaut est enregistré dans le modèle et envoyé au test de connexion. L’échelle canonique est `none`, `minimal`, `low`, `medium`, `high`, `xhigh` ; l’ancienne valeur `max` est lue comme `xhigh`, puis enregistrée sous cette forme. Les graphies propres aux fournisseurs sont adaptées au moment de la requête. Le modèle réel reste déterminant : afficher l’échelle ne signifie pas que chaque endpoint accepte tous les niveaux. [Règles][profiles]

## Autoriser ChatGPT par Genesis

Choisissez **ChatGPT Subscription** dans Welcome ou **Settings → LLM → Provider accounts**. Le guide versionné fournit `genesis chatgpt login`, `genesis chatgpt status` et `genesis chatgpt models` pour la connexion et l’inspection. Depuis les sources, utilisez `mix genesis.chatgpt login`. Ouvrez l’URL affichée et autorisez Genesis dans le navigateur. [Guide d’abonnement][oauth]

Après connexion, utilisez **Check connection**, choisissez l’enregistrement puis l’un des modèles disponibles pour ce compte. Dans Settings, enregistrez le compte avant **Connection Test** ; Welcome teste le modèle sélectionné avant de terminer. Le profil conserve `provider = "openai_codex"` pour compatibilité, avec `auth_mode = "oauth"` et `siwc_account` pour identifier l’enregistrement Genesis.

Les anciens profils d’abonnement nécessitent une nouvelle autorisation par Genesis : cette connexion n’utilise pas les identifiants autrefois importés de Codex. Si l’ancien modèle n’apparaît plus dans l’inventaire découvert, choisissez-en un disponible. Les comptes OpenAI à clé API restent une option distincte. Pour plusieurs enregistrements, utilisez un alias explicite, par exemple `genesis chatgpt login --account work`, puis sélectionnez cet alias dans le profil. [Migration et alias][oauth]

## Garder la connexion sur l’hôte d’exécution

Les identifiants du compte sélectionné sont résolus et renouvelés sur le nœud d’exécution. Les mises à jour sont sérialisées entre la CLI de connexion et le serveur actif. Un enregistrement visible dans le navigateur n’est ainsi pas confondu avec une connexion sur un autre hôte distant. [Stockage des comptes][store]

Pour un déploiement auto-hébergé, le guide décrit le transfert SSH du port de connexion de bouclage et l’exécution de la connexion avec le même compte et répertoire de configuration que le service Genesis. Il documente aussi un transfert protégé des identifiants et `GENESIS_SIWC_HTTPS_PROXY` pour les hôtes nécessitant un proxy HTTP CONNECT. Suivez les instructions de l’hôte avant de tester l’inférence : une connexion sur un portable ne configure pas un serveur indépendant.

Les vérifications de renouvellement et de streaming ChatGPT de la PR utilisaient des fixtures ; une nouvelle autorisation navigateur avec un vrai compte ChatGPT restait à vérifier lors de cette revue. Pour votre installation, une réponse réelle du modèle sur l’hôte prévu constitue la confirmation pratique. [Portée des vérifications][pr]

## Expliciter les horaires du compte

Le même modèle de compte porte concurrence de pointe et hors pointe, fuseau horaire et politique de planification. De nouveaux préréglages préremplissent les horaires des fournisseurs pris en charge, mais les nombres de créneaux sont des valeurs Genesis modifiables, sans garantie de capacité ni d’économie. Tous les modèles d’un compte partagent ses créneaux ; en ajouter un ne crée pas un autre quota. [Préréglages][presets]

`off_peak_holidays = "CN"` ajoute le calendrier chinois fourni à la planification, jours travaillés de rattrapage compris. Ce calendrier statique couvre 2025–2027 et ne se met pas à jour seul. Vérifiez fuseau, règles de week-end et hypothèses des préréglages. Une concurrence de pointe nulle met les nouvelles requêtes en attente ; réduire la capacité n’interrompt pas celles déjà en cours. [Sémantique des horaires][profiles]

Après passage à une compilation contenant ces changements, revérifiez inventaire, raisonnement par défaut et hôte de chaque compte. Réautorisez un profil ChatGPT et lancez son test de connexion. Pour un compte planifié, inspectez les horaires enregistrés et la prochaine transition prévue. Ces vérifications portent sur les identités et limites réellement utilisées par les futures tâches.

## Actualiser les modèles après l’enregistrement

Les mises à jour de `main` du 23 novembre 2026 relient l’enregistrement des inscriptions ChatGPT à l’actualisation de la configuration. Sur le même nœud d’exécution, une modification recharge le sélecteur de modèles du projet ; fermer les paramètres du workbench demande aussi un rechargement. Les résultats abandonnés produisent désormais une erreur permettant de réessayer, au lieu d’un chargement indéfini. Attendez que la connexion distante soit prête avant de réessayer. [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

Un compte incomplet ne provoque plus de boucle de plantage du planificateur. Celui-ci journalise le modèle par défaut non résolu ; complétez l’inventaire du compte et sélectionnez un modèle valide avant de vous appuyer sur ce choix par défaut. [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex

Depuis le 25 novembre 2026, une sauvegarde des paramètres est refusée si l’identité du nœud BEAM local a changé depuis le montage de la page. Rechargez son contexte de nœud avant de réessayer, pour éviter un accusé de sauvegarde associé à une ancienne portée de configuration. [GitHub](https://github.com/EMI-Group/genesis/commit/5ed383a3e803df692bd105504b36aa65768e7a3b).
