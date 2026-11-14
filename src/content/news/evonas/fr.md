---
title: "EvoNAS : avant de chercher un meilleur réseau, rendre la comparaison utile"
pubDate: 2026-11-14
summary: "Partager les poids réduit le coût de la recherche, mais peut modifier le classement. EvoNAS relie apprentissage et évaluation pour mieux guider le choix suivant."
---

Un réseau peut gagner pendant la recherche et décevoir après un entraînement indépendant. Dans une recherche évolutive, cette erreur coûte cher : chaque génération utilise les évaluations précédentes pour choisir les candidats à conserver. Si le classement est faussé, poursuivre la recherche peut renforcer le mauvais choix. EvoNAS relie apprentissage du super-réseau, évaluation des candidats et compromis entre précision et coût de calcul.

![Illustration conceptuelle : plusieurs cadres en forme de réseaux observent la même rue et un contour géométrique fin.](./evonas-editorial.webp)

## La recherche dépend de la qualité des évaluations

Entraîner chaque candidat séparément ferait exploser la facture. Partager les poids évite de repartir de zéro, mais lie aussi les apprentissages. L’architecture la plus avantagée par les paramètres partagés ne sera pas forcément la meilleure une fois entraînée seule. Puisque la sélection façonne la génération suivante, une comparaison déformée peut orienter toute la recherche.

Un super-réseau partage ses paramètres entre architectures. Mais les performances obtenues avec ces poids hérités ne reflètent pas forcément le potentiel de chaque candidat. Le travail soumis le 20 mars 2026 propose un super-réseau hybride VSS–ViT et CA-DDKD, une distillation qui aligne les représentations dans les domaines spatial et fréquentiel. PST étend progressivement l’apprentissage des grandes configurations aux variantes compactes.

Reconnaître un bâtiment et situer précisément son contour sont deux capacités différentes. En profondeur ou en segmentation, une rambarde fine, un angle de mur ou une frontière entre plans peuvent compter. CA-DDKD utilise des contraintes de transformée en cosinus discrète pour aider à préserver cette information géométrique. Position spatiale et variations qui dessinent les contours et textures se complètent.

L’apprentissage fait ainsi partie de la méthode de recherche. De meilleures représentations partagées donnent de meilleures bases de comparaison ; augmenter seulement le nombre de candidats ne répare pas un classement peu fiable.

## Comparer selon les contraintes

En estimation de profondeur, on peut accepter un compromis de précision pour respecter une limite de latence. La recherche multiobjectif fournit plusieurs options à examiner. DMMPE évalue plusieurs modèles grâce à un pool de ressources GPU et à un ordonnancement asynchrone. Le choix final dépend du matériel, du jeu de données et du protocole de mesure.

Les candidats doivent être mesurés dans des conditions matérielles et d’exécution comparables. La configuration de recherche définit ce qui semble prometteur ; le réentraînement montre ce que l’architecture choisie peut apprendre. Relier ces étapes permet de revenir au problème de classement qui motive EvoNAS.

## Avant de lancer une expérience

Le parcours comprend le préentraînement sur ImageNet-1k, l’ajustement PST sur les données cibles, la recherche évolutive et le réentraînement du sous-réseau choisi. Le guide couvre KITTI et NYU Depth v2 pour la profondeur, COCO pour la détection et ADE20K pour la segmentation. Suivez un seul jeu de données à travers les chemins, les configurations et les objectifs pour relier le score de recherche au modèle final.

Le README annonce encore le téléchargement du super-réseau préentraîné comme à venir. Avant de commencer, vérifiez la disponibilité des poids et faites correspondre le wheel Mamba SSM à l’environnement Python, CUDA et PyTorch documenté.

[Code et installation](https://github.com/EMI-Group/evonas/blob/e4f6866e8092545b2b9b28f3fe0162e038e34f3c/README.md) · [Article scientifique](https://arxiv.org/abs/2603.19563v1)

[EvoX](/fr/libs)
