---
title: "EvoX VirtualES : explorer sans stocker tous les réseaux candidats"
pubDate: 2026-07-08
summary: "VirtualES et VirtualProblem génèrent les perturbations à la demande à partir de graines pour réduire le stockage des paramètres des populations."
---

Les changements apportés à EvoX les 7 et 8 juillet 2026 introduisent un parcours de population virtuelle pour la neuroévolution. Une population classique peut nécessiter un vecteur de paramètres par réseau candidat. VirtualES conserve un centre partagé et une graine aléatoire par individu, puis reconstruit les perturbations gaussiennes au besoin. L'enjeu est concret : quelle diversité de candidats un budget mémoire permet-il de représenter ?

## Une population compacte, une évaluation explicite

Pour P candidats de D paramètres, stocker tous les paramètres exige un espace proportionnel à P × D. La représentation par centre et graines nécessite environ D + P éléments. Cette comparaison porte uniquement sur les paramètres : activations, valeurs d'adaptation, état de l'optimiseur et tampons d'évaluation occupent aussi de la mémoire.

VirtualES transmet `(center, seeds, sigma)` au workflow. VirtualProblem évalue les candidats couche par couche. Une opération Triton fusionnée associe le calcul linéaire de base aux perturbations des poids et biais générées à partir des graines, sans construire le tenseur complet des réseaux perturbés. Les valeurs d'adaptation servent ensuite à mettre à jour le centre pour la génération suivante.

## Périmètre de l'implémentation

Cette implémentation utilise des perturbations gaussiennes complètes, remplaçant la formulation LoRA de faible rang. VirtualProblem accepte les réseaux `nn.Sequential` composés de couches linéaires et des fonctions d'activation indiquées. Ce n'est pas un évaluateur universel : l'interface documentée ne prend pas en charge le wrapper HPO. Le parcours virtuel ignore également l'évaluation distribuée et les transformations des solutions.

## L'importance de la représentation

Cette approche relie autrement recherche par population et exécution. Elle permet d'étudier les compromis mémoire sans stocker d'abord tous les poids candidats. Mémoire maximale et débit dépendent néanmoins de l'architecture, de la population, des lots et du matériel ; ces changements ne prouvent aucune accélération universelle. Pour EvoX, ils rendent l'exploration évolutionnaire plus flexible sur le plan informatique.

[1](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6) · [2](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921) · [3](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697) · [4](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)
