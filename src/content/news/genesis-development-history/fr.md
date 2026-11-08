---
title: "Genesis : conserver les contributions des agents dans l'histoire du logiciel"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 relie l'historique Git des tâches aux couloirs des agents pour conserver des contributions inspectables après leur arrêt."
updatedDate: 2026-11-08
---

L'arbre des agents montre qui travaille maintenant. L'histoire du projet doit aussi expliquer ce qui reste ensuite. Publié le 26 septembre 2026, Genesis 0.13.4 développe la vue des commits de 0.13.2 et les références durables des tâches de 0.13.3, reliant une activité temporaire à des versions inspectables.

![Des rails ramifiés portant des commits rejoignent une archive en couches](./durable-agent-history.webp)

## Des agents actifs aux références durables

L'API d'historique par tâche résout les références durables et le commit de base. La vue temporelle peut ainsi conserver les commits d'agents recyclés. L'API précédente interroge plages de commits et références entre dépôts ; la couche tâche apporte le contexte pour suivre un effort de développement particulier. [v0.13.2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [v0.13.3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3)

Quand un agent délègue un module puis termine, sa contribution peut encore nécessiter une revue. Git donne au changement une identité durable et la vue de tâche aide à le situer. La fin d'une exécution ne doit pas effacer le lien entre objectif et code produit.

## Montrer les relations entre contributions

La version 0.13.4 organise les commits en couloirs d'agents, regroupe les sous-arbres et représente délégation et fusion en retour. Les commits sans propriétaire ont un couloir neutre. Sélection, survol synchronisé et clavier facilitent l'inspection ; un échec partiel de lecture des dépôts ne masque plus tout le graphe. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

La vue signale la troncature à sa limite de 100 commits. Pour examiner une modification antérieure, utilisez les références de base et de tête de la tâche afin d’inspecter la plage Git concernée.

## Suivre une contribution jusqu’à son intégration

Partez d’une tâche, repérez son commit de base et suivez une voie d’agent à travers délégation et fusion retour. Consultez les diffs et résultats de tests pour décider quoi conserver. Pour plusieurs bases de code, la [revue multi-dépôts](/fr/news/genesis-multi-repository) prépare l’intégration.
