---
title: "EvoX 1.4.1 : quand une petite correction change la recherche"
pubDate: 2026-10-30
summary: "Les corrections de SHADE, de l'évolution différentielle et de CMA-ES montrent que l'infrastructure évolutionnaire doit conjuguer efficacité et fidélité algorithmique."
updatedDate: 2026-11-08
---

Une recherche peut se terminer normalement tout en suivant une règle de mise à jour erronée. EvoX 1.4.1, publié le 30 octobre 2026, corrige cet écart dans SHADE, l’évolution différentielle et CMA-ES, en rétablissant l’adaptation, l’échantillonnage et le comportement d’exécution attendus.

![Vérification et correction du comportement algorithmique](./algorithm-behavior-calibration.webp)

*Aligner l’implémentation sur le comportement attendu.*

## Un programme fonctionnel peut rechercher autrement

Dans SHADE, la mémoire de succès de F et CR ne s'adaptait pas. Les améliorations étaient calculées après remplacement des valeurs d'adaptation, et l'arithmétique sur des tableaux remplis de NaN contaminait les valeurs choisies. La correction calcule l'amélioration avant la mise à jour et sélectionne les succès avec `torch.where`. [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

L'opérateur partagé de croisement binomial comparait des échantillons normaux à une probabilité de croisement. Il emploie désormais un échantillonnage uniforme conforme à cette probabilité. Des corrections connexes initialisent aussi CoDE, SaDE et SHADE uniformément dans leurs bornes. Elles modifient les candidats produits, pas seulement l'absence de plantage. [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## Définitions mathématiques et contraintes d'exécution

Les corrections de CMA-ES concernent la mise à jour de covariance de rang un, la constante de cumul et les restrictions d'alias de `torch.cond`. Cette dernière correction réactive également un test CMA-ES désactivé. Formules et contraintes du framework doivent être vérifiées séparément. [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

La version traite aussi l'initialisation et les sous-espaces des stratégies d'évolution, la sélection par tournoi, les transferts de périphérique de PSO et l'hypervolume. [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## La fiabilité appartient à l'infrastructure

La correction SHADE ajoute un test de régression : cinq étapes du workflow, puis vérification que la mémoire d’adaptation change et reste finie. Pour comparer les versions, consignez graine, objectif, population et budget d’évaluation, puis relancez les références concernées. Les [notes de version](/fr/releases/evox-1-4-1) servent de référence pour la mise à jour.
