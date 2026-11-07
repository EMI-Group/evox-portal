---
title: "Genesis : conserver les contributions des agents dans l'histoire du logiciel"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 relie l'historique Git des tâches aux couloirs des agents pour conserver des contributions inspectables après leur arrêt."
---

L'arbre des agents montre qui travaille maintenant. L'histoire du projet doit aussi expliquer ce qui reste ensuite. Publié le 26 septembre 2026, Genesis 0.13.4 développe la vue des commits de 0.13.2 et les références durables des tâches de 0.13.3, reliant une activité temporaire à des versions inspectables.

## Des agents actifs aux références durables

L'API d'historique par tâche résout les références durables et le commit de base. La vue temporelle peut ainsi conserver les commits d'agents recyclés. L'API précédente interroge plages de commits et références entre dépôts ; la couche tâche apporte le contexte pour suivre un effort de développement particulier.

Quand un agent délègue un module puis termine, sa contribution peut encore nécessiter une revue. Git donne au changement une identité durable et la vue de tâche aide à le situer. La fin d'une exécution ne doit pas effacer le lien entre objectif et code produit.

## Montrer les relations entre contributions

La version 0.13.4 organise les commits en couloirs d'agents, regroupe les sous-arbres et représente délégation et fusion en retour. Les commits sans propriétaire ont un couloir neutre. Sélection, survol synchronisé et clavier facilitent l'inspection ; un échec partiel de lecture des dépôts ne masque plus tout le graphe.

La vue indique la troncature à la limite de 100 commits. C'est un moyen de parcourir le développement, pas une archive illimitée ni une explication complète de chaque décision.

## La traçabilité soutient la sélection

Le graphe montre l'origine d'un changement et son intégration dans une branche, sans prouver sa correction. Diffs, tests et revue restent nécessaires. Pour l'évolution logicielle d'EvoX, il rend plus visible le rapport entre contributions proposées et versions retenues, afin de choisir ce qui alimentera la suite.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
