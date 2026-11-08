---
title: "EvoX VirtualES : davantage de candidats, moins de poids stockés"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "Un centre partagé et des graines aléatoires par candidat permettent à VirtualES de reconstruire les perturbations à la demande et de repenser le budget mémoire de la recherche."
---

Agrandir une population de réseaux neuronaux demande généralement de stocker davantage de copies des poids. Les changements EvoX des 7 et 8 juillet 2026 empruntent une autre voie : VirtualES conserve un centre de paramètres commun et une graine par candidat, puis reconstruit les différences pendant l’évaluation. Quelle diversité de recherche peut-on ainsi représenter avant de saturer la mémoire ?

![Une forme pleine commune, des graines rouges et des variations transparentes évoquent une population virtuelle](./virtuales-shared-center.webp)

*Illustration conceptuelle : un centre partagé, plusieurs candidats reconstructibles.*

## Conserver la recette d’un candidat

Avec P candidats de D paramètres, le stockage explicite croît comme P × D. La représentation par centre et graines utilise environ D + P éléments. Cette comparaison concerne les paramètres de la population ; activations, état de l’optimiseur et tampons d’évaluation occupent aussi de la mémoire. [Implémentation de VirtualES](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

VirtualES transmet `(center, seeds, sigma)` au workflow. VirtualProblem évalue les couches avec une opération Triton fusionnée combinant calcul linéaire de base et perturbations des poids et biais issues des graines. L’aptitude guide ensuite la mise à jour du centre. L’implémentation utilise des perturbations gaussiennes complètes, remplaçant la formulation LoRA de faible rang. [Implémentation de l’évaluation](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## Préserver un retour propre à chaque candidat

Commencez par un réseau `nn.Sequential` contenant des couches linéaires et les activations documentées. Réglez la fonction de perte sur `reduction='none'` pour que VirtualProblem agrège séparément les pertes de chaque candidat. Une perte scalaire serait étendue à toute la population, effaçant cette distinction. Ce choix d’interface influence directement la recherche.

Le chemin virtuel omet l’évaluation distribuée et les transformations des solutions ; VirtualProblem exclut aussi le wrapper HPO. Vérifiez ces limites avant d’adapter une expérience. [Intégration au workflow](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## Mesurer les possibilités de cette représentation

Partez d’un réseau compatible, puis faites varier la population en relevant le pic mémoire, le temps d’évaluation et l’aptitude à budget d’évaluation constant. Vous distinguerez l’économie de stockage du coût de régénération du bruit et du traitement des activations. Les changements de juillet incluent un [correctif de compilation Triton](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef) pour la fonction auxiliaire de bruit.

Le [guide de démarrage](/fr/news/evox-quickstart) présente la structure des expériences EvoX. VirtualES permet ensuite d’examiner une question concrète : comment une population plus grande change-t-elle votre expérience quand stocker tous ses poids n’est plus un préalable ?
