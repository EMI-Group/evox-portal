---
title: "Genesis Assistant : transformer une conversation en tâche de projet"
pubDate: 2026-11-16
updatedDate: 2026-11-22
summary: "Choisissez un projet, approuvez une action précise et suivez le développement en arrière-plan indépendamment de la conversation."
---

Demander de corriger un projet exige une cible, une action approuvée et un moyen de suivre le résultat. Genesis Assistant relie ces étapes dans la PR #172, fusionnée dans `main` le 15 novembre 2026. Cette évolution prolonge la [continuité des conversations][previous] avec un parcours de travail centré sur le projet.

![Un dossier de projet passe par une station d’approbation reliée à un atelier indépendant](./genesis-assistant-project-workflows.webp)

*Illustration conceptuelle : définir le projet et approuver le travail avant de suivre son exécution indépendante.*

## Choisir la cible avant de commencer

Discuter et contrôler les tâches ne nécessite plus de copie de Genesis. La référence au code devient facultative et soumise à approbation. Un projet sur l’hôte sélectionné fournit les chemins omis sans lire les fichiers ni autoriser le développement. Le changement de projet est bloqué pendant une réponse ; un autre chemin explicite reste la cible affichée. [Changements intégrés][workflows]

Son choix est limité au nœud et à la conversation ; une nouvelle conversation sur le même nœud peut en hériter. Le serveur fournit l’identité de la conversation et du nœud aux outils, au lieu de laisser le modèle les inventer. Si une demande indique explicitement un autre chemin, l’approbation doit montrer cette cible réelle. Cela compte lorsque deux dépôts ont des noms proches : vérifier le chemin avant de démarrer évite d’approuver le mauvais travail.

## De l’approbation au suivi d’une tâche

Les onze définitions partagées avec MCP distinguent la consultation d’une mutation. Lire l’état d’une tâche s’exécute directement ; démarrer, annuler ou transmettre des exigences demande une approbation liée à des paramètres structurés immuables. Un refus ou une expiration n’exécute pas l’action. Pour corriger un test, fournissez le contexte de l’échec, examinez la cible et les paramètres proposés, puis approuvez cette demande précise. Après le démarrage, ouvrez le suivi et la revue du résultat plutôt que de déduire la réussite du seul message d’acceptation. [Contrat des outils][workflowguide]

Un démarrage réussi active le suivi ; le sélecteur Tasks permet de rechercher une tâche existante.

## Séparer le travail de la réponse

Envoyer une exigence supplémentaire la met en attente ; cela ne prouve pas que le développeur actif l’a déjà intégrée. De même, **Stop reply** arrête la réponse après le lot d’outils en cours et conserve la session, tandis que la tâche de développement continue. Les cartes affichent des états observés, des compteurs et des dates de rafraîchissement, sans inventer un pourcentage. Si une actualisation échoue, la dernière observation reste disponible. Ces distinctions permettent de choisir entre attendre, consulter le résultat, préciser la demande ou demander une annulation. L’annulation ne défait pas les modifications Git.

Les liens de tâches survivent à la fin de session, mais pas les conversations en mémoire au redémarrage serveur ; les tâches persistantes peuvent être retrouvées. Essayez sur une version contenant la PR #172 et vérifiez l’état avant de répéter une soumission incertaine. [Guide actualisé][workflowguide]

## Apporter les fichiers depuis le bon appareil

Le navigateur accepte texte, PDF, DOCX, images et audio, quatre fichiers par message et 15 MiB chacun ; une pièce jointe terminée peut partir sans texte. L’entrée secondaire de chemin serveur prend en charge le nœud local du tableau de bord, sans le substituer à un nœud distant non pris en charge.

Le téléversement du navigateur prend les fichiers sur l’appareil actuellement utilisé. La lecture d’un chemin serveur vise un autre emplacement et reste limitée au nœud local du tableau de bord. Attendez la fin du téléversement avant de changer de contexte : un changement de conversation ou de nœud annule les transferts en attente. Pour consulter le code de Genesis, la préparation facultative de la référence source reste soumise à approbation ; comparez la version de cette référence à celle du moteur actif. Le contexte d’un projet et la référence du code de Genesis ont ainsi des rôles distincts. [Fichiers et référence source][workflowguide]

Les [changements du 20 novembre](/fr/news/genesis-project-workbench) réunissent navigation par projet, vues Git et brouillons liés au VCT dans un environnement commun.

[previous]: /fr/news/genesis-assistant-interactive-sessions
[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
