---
title: "Genesis 0.14.1 : conserver les choix de modèle avec le travail"
pubDate: 2026-11-10
summary: "Les profils de compte relient modèle et raisonnement dans Genesis ; le développement distant utilise un serveur partagé."
---

Choisir un modèle implique aussi un compte, des identifiants et des réglages de raisonnement. Publié le 8 novembre 2026, Genesis 0.14.1 transmet ce choix entre Settings, Projects, Assistant, l’ordonnanceur et l’exécution, réduisant les écarts entre la demande et ce qui fonctionne réellement. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![L’onglet de compte sélectionné reste relié aux choix de modèle](./provider-account-continuity.webp)

## Un profil pour une sélection cohérente

Les profils canoniques séparent le compte fournisseur du choix de modèle. Des sélecteurs communs proposent modèle et raisonnement ; les corrections de l’ordonnanceur préservent les choix explicites et la configuration complète enregistrée. Les profils compatibles gagnent aussi OAuth/abonnement, l’état de connexion individuel et l’import des fichiers d’identifiants des CLI fournisseurs.

## Un serveur pour le fonctionnement local et distant

Le développement distant utilise désormais genesis_server, comme le tableau de bord sans interface de bureau. La distribution genesis_remote est retirée. La CLI gère démarrage, arrêt, état et journaux distants ; la distribution peut être basculée à l’exécution tout en maintenant HTTP.

## Vérifier la transmission lors de la mise à jour

Après la mise à jour, vérifiez compte, modèle et raisonnement dans Settings, puis une tâche avec choix explicite. Les chemins OAuth personnalisés appartiennent à chaque profil de modèle. Examinez le serveur partagé avant de réutiliser d’anciens scripts de démon. Les notes de version détaillent migration et corrections. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant : mieux comprendre et piloter le travail en cours](/fr/news/genesis-development-2026-11-07)
