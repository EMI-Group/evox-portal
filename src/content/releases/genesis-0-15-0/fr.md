---
title: "Genesis v0.15.0 : relier le travail de projet, de la connexion à la reprise"
pubDate: 2026-11-28
summary: "Un workbench unifié, la connexion ChatGPT dans le navigateur et la pause de tout l’arbre arrivent ensemble, avec des résultats de revue plus clairs et une configuration mieux protégée."
---

Genesis v0.15.0 a été publié le 27 novembre 2026. Il réunit les évolutions récentes du workbench, des comptes et de la récupération des tâches. L’intérêt pratique est la continuité : choisir hôte et projet, configurer le compte du modèle, suivre le développement et revenir au travail inachevé sans confondre réponse de chat et tâche terminée. La revue, les travaux en arrière-plan et la gestion du contexte évoluent aussi : la mise à niveau dépasse le rafraîchissement visuel. [Notes complètes][release]

![Un pupitre mécanique relie un registre de projet, une clé et une structure ramifiée suspendue](./cover.webp)

*Illustration conceptuelle : identité, contexte de projet et travail récupérable partagent un point de contrôle.*

## Garder le projet et l’hôte explicites

Le workbench rassemble vue d’ensemble, inspection des agents par tâche, éditeur partagé et options intégrées. Projets récents et navigation par dossiers facilitent le choix ; les workspaces VCT regroupent des projets avec un sélecteur de membres. Choisissez un membre concret avant de lancer le travail : un groupe n’a pas de répertoire d’exécution. Source Control expose historique et différences. Onglets de prévisualisation ou épinglés, maintien par clic central, navigation Alt+Arrow et menu de débordement font du rail la liste unique des vues ouvertes.

Lors d’un passage entre bibliothèque et application, brouillon, modèle et dépôt doivent encore désigner la tâche voulue. Les brouillons indexés par projet restaurent désormais leurs champs non textuels après chargement asynchrone. Recherche et filtres d’historique conservent leur périmètre ; positions de revue et filtres de tâches survivent au changement de nœud. Une activation tardive ne ferme plus la palette et ne détourne plus une sélection explicite de sa vue d’ensemble. [Contexte du workbench][workbench]

## Configurer le compte puis confirmer le modèle

Sign in with ChatGPT dans le navigateur est partagé par le tableau de bord, les assistants de configuration, l’accueil et la CLI. Les hôtes distants disposent d’un collage manuel de l’URL de redirection ; quitter ou fermer annule le processus. Les comptes existants peuvent se connecter depuis Settings. L’authentification achevée rafraîchit l’instantané de configuration et le sélecteur de modèles. Les assistants proposent des niveaux de raisonnement canoniques et des horaires prédéfinis. off_peak_holidays utilise un calendrier statique des jours fériés et journées travaillées de rattrapage en Chine pour 2025–2027, pas un service mondial.

Les comptes personnalisés utilisent OpenAI Chat Completions ; les requêtes d’abonnement ChatGPT incluent les en-têtes d’attribution d’usage et d’identité de cache de prompts. Keenable est une recherche sans clé à activer volontairement. Revérifiez routage et horaires. Un compte partiellement sauvegardé revient maintenant au modèle par défaut avec avertissement, au lieu de faire tomber le planificateur. Settings refuse une sauvegarde si l’identité locale du nœud a changé : rechargez son contexte. Les clés sont masquées dans les journaux et les opérations Git vérifient l’appartenance au projet. [Parcours des comptes][accounts]

## Pauser le travail sans terminer ses enfants

La pause fige tout l’arbre d’agents et le reprend avec les mêmes identités, remplaçant l’ancien drainage. Avec la persistance activée, les checkpoints préservent les attentes des parents et le travail des enfants ; pause propre et récupération interrompue restent distinctes. Review affiche clairement échec, annulation et absence de rapport, retire les actions inapplicables et propose de préparer une tâche de suivi. Le filtre needs-review rend ces résultats accessibles. [Mécanisme de pause][pause]

Les travaux de fond reçoivent des identifiants courts base36 globalement uniques, des journaux par tâche et des noms de registre sans collision. La rétention protège les propriétaires actifs et garde des marqueurs de suppression au lieu d’identifiants soudain inconnus ; la croissance mémoire du registre est corrigée. Les agents committent automatiquement lorsque l’étape principale échoue, et la cosignature activée figure dans les merges. Cette traçabilité ne remplace pas l’examen de l’état et des changements du dépôt avant acceptation.

## Mettre à niveau et vérifier ses parcours

CONTEXT.md reçoit les portées Shared/Local : les ancêtres ne fournissent que Shared, le nœud attribué voit le fichier entier. Lecture et édition ciblées ainsi que consolidation des commits évitent d’injecter des notes locales dans des prompts sans rapport. Sont aussi corrigés remontage pendant streaming, outils affichés deux fois, contrôles d’archives et d’historique replié, fuseaux horaires et chargements distants perdus. Phoenix, LiveView, Bandit, idna, jsv et dépendances associées intègrent des correctifs de sécurité. Densité et cibles tactiles sont unifiées ; anciennes animations d’entrée et liste latérale redondante disparaissent. Une barre de titre sans cadre avec commandes par plateforme est proposée sur desktop.

Choisissez l’asset desktop v0.15.0 de votre système. Le serveur headless prend en charge Linux x64/ARM64 et macOS ARM64. Exécutez `genesis update --check`, puis `genesis update` pour installer la mise à jour disponible et redémarrer le serveur. Conservez le répertoire de données configuré et consultez les instructions versionnées. Ensuite, vérifiez version active, rafraîchissement compte/modèle, brouillon lié au projet et petit cycle pause/reprise ; examinez son résultat de revue et son journal. [Installation versionnée][guide]

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.15.0
[guide]: https://github.com/EMI-Group/genesis/blob/v0.15.0/README.md
[workbench]: /fr/news/genesis-project-workbench
[accounts]: /fr/news/genesis-provider-account-setup
[pause]: /fr/news/genesis-whole-tree-pause
