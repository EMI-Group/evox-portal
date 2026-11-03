---
title: "Notes de version d’EvoX v1.4.1"
pubDate: 2026-10-30
summary: "Corrections de CMA-ES, des variantes DE, de PSO, des stratégies d’évolution, de la sélection par tournoi et du calcul de l’hypervolume."
---

**EvoX v1.4.1** corrige des erreurs algorithmiques et d’exécution dans la branche stable 1.x.

## Corrections des algorithmes

- **CMA-ES :** correction de la mise à jour de covariance de rang un et de la constante de cumul `c_c` ; correction d’un plantage dans `torch.cond` et réactivation du test ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **Variantes DE :** remplacement de la loi normale par une loi uniforme dans `DE_binary_crossover`. Correction de l’adaptation de `F` et `CR` dans SHADE et de l’échantillonnage des populations initiales des variantes DE dans les bornes ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO :** correction du transfert des bornes vers le périphérique ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **Stratégies d’évolution :** corrections d’ASEBO après activation de son sous-espace de gradient, du `pop_size` par défaut de XNES/SeparableNES et des plantages liés aux sous-espaces de Guided ES ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## Opérateurs et métriques

- Correction des plantages de la sélection par tournoi avec `n_round=1` ([#259](https://github.com/EMI-Group/evox/pull/259)).
- Le calcul de l’hypervolume (`hv`) ignore désormais les points qui ne dominent pas le point de référence ([#254](https://github.com/EMI-Group/evox/pull/254)).

Merci à @bbopen, @raashish1601, @Arthur031221 et @flyingdoubleG pour leurs premières contributions.

**Publication**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **Historique complet**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
