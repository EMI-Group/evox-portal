---
title: "EvoX 1.4.1 : préserver le sens des algorithmes en recherche parallèle"
pubDate: 2026-10-30
summary: "Les corrections de SHADE, de l'évolution différentielle et de CMA-ES montrent que l'infrastructure évolutionnaire doit conjuguer efficacité et fidélité algorithmique."
---

EvoX 1.4.1, publié le 30 octobre 2026, corrige plusieurs comportements algorithmiques et d'exécution. Lorsque des milliers de candidats sont évalués ensemble, une petite erreur peut modifier systématiquement la recherche. Une infrastructure évolutionnaire doit préserver l'algorithme voulu autant que l'exécuter efficacement.

## Un programme fonctionnel peut rechercher autrement

Dans SHADE, la mémoire de succès de F et CR ne s'adaptait pas. Les améliorations étaient calculées après remplacement des valeurs d'adaptation, et l'arithmétique sur des tableaux remplis de NaN contaminait les valeurs choisies. La correction calcule l'amélioration avant la mise à jour et sélectionne les succès avec `torch.where`.

L'opérateur partagé de croisement binomial comparait des échantillons normaux à une probabilité de croisement. Il emploie désormais un échantillonnage uniforme conforme à cette probabilité. Des corrections connexes initialisent aussi CoDE, SaDE et SHADE uniformément dans leurs bornes. Elles modifient les candidats produits, pas seulement l'absence de plantage.

## Définitions mathématiques et contraintes d'exécution

Les corrections de CMA-ES concernent la mise à jour de covariance de rang un, la constante de cumul et les restrictions d'alias de `torch.cond`. Cette dernière correction réactive également un test CMA-ES désactivé. Formules et contraintes du framework doivent être vérifiées séparément.

La version traite aussi l'initialisation et les sous-espaces des stratégies d'évolution, la sélection par tournoi, les transferts de périphérique de PSO et l'hypervolume. Ces corrections documentées ne prouvent pas une supériorité systématique sur toutes les évaluations.

## La fiabilité appartient à l'infrastructure

Pour comparer des expériences, version et graine doivent accompagner objectif, population et budget d'évaluation. Les résultats touchés peuvent nécessiter une réévaluation. Pour EvoX, les tests de sémantique algorithmique doivent progresser avec tensorisation et accélération, afin que le retour expérimental corresponde à la recherche réellement souhaitée.

[1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · [2](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3) · [3](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716) · [4](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)
