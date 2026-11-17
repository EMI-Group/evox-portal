---
title: "TensorNEAT : apprendre les paramètres de réseaux aux topologies différentes"
pubDate: 2026-03-03
updatedDate: 2026-11-17
summary: "Des gradients parallèles sur la population affinent les paramètres continus tout en conservant la structure discrète de chaque candidat."
---

Une population de réseaux peut avoir des connexions variées sans exiger une boucle d’apprentissage par structure. La [PR #37][s1] de TensorNEAT, fusionnée dans main le 3 mars 2026, ajoute les gradients à ses génomes tensorisés et une voie vectorisée avec JAX pour affiner la population.

![Des réseaux différents gardent leurs connexions tandis que leurs poids sont réglés](./topology-gradients.webp)

*Illustration conceptuelle : ajuster les paramètres continus sans remplacer la topologie de chaque réseau.*

## Une opération de gradient pour des structures différentes

TensorNEAT représente les réseaux NEAT par des tableaux de nœuds et connexions. `genome.grad` renvoie une perte scalaire et les gradients des deux tableaux. Les champs structurels, indices et types de fonctions, ainsi que le remplissage NaN reçoivent des gradients nuls. Les paramètres numériques changent, la structure encodée reste préservée.

La vectorisation JAX applique ce calcul même à des topologies différentes. L'[exemple XOR][s3] initialise une population, la diversifie par mutation puis optimise les réseaux par descente de gradient. C'est une brique expérimentale concrète pour étudier ensemble structure et paramètres, sans supposer que le gradient modifie les connexions discrètes.

## Rendre le calcul direct différentiable

L’implémentation calcule une perte scalaire via la transformation et le calcul direct du génome, puis utilise `jax.value_and_grad` pour dériver les tableaux de nœuds et de connexions. Un vecteur d’entrée suit un calcul unique ; un lot utilise une évaluation vectorisée. L’objectif reste explicite : le modifier relève de l’appelant, pas d’une propriété implicite de la représentation. [Implémentation du gradient][implementation]

Cela nécessite aussi des changements sous l’API. Le génome par défaut utilise une boucle bornée `jax.lax.fori_loop` ; connexions et agrégations transmettent des masques de validité pour éviter que les NaN inutilisés contaminent les calculs. Le remplissage appartient à la représentation, pas aux connexions entraînables. Mutation structurelle et ajustement numérique restent donc distincts, même avec les mêmes tableaux.

## Un exemple XOR sépare diversité et apprentissage

L’exemple fusionné initialise 1 000 réseaux pour un XOR à trois entrées et effectue 20 tours de mutation avec des clés aléatoires distinctes. Ensuite seulement vient la descente de gradient, avec un taux de 0,5 et 500 étapes au maximum. Cette phase utilise `jax.jit(jax.vmap(...))` sur les individus sans sélection évolutionnaire. L’exemple amont démontre l’ajustement de structures variées, sans prouver que le gradient remplace la recherche de topologie. [Exemple complet][s3]

Lisez le nombre d’individus valides avec les pertes minimale et moyenne. Un candidat déconnecté peut produire des sorties non finies ; l’exemple filtre les pertes finies dans son rapport et les tests conservent les sorties NaN des réseaux déconnectés. Une meilleure perte minimale ne dit pas quelle part de la population reste utilisable. Vérifiez aussi les prédictions du réseau sélectionné après optimisation.

## Vérifier les dérivées avant d’étendre l’expérience

Les tests ajoutés couvrent les gradients finis des génomes connectés par défaut et récurrents, la différentiation compilée, les lots de population, la baisse de perte et les différences finies. Pour une tâche personnalisée, partez de l’exemple XOR versionné, puis changez la perte en gardant explicites les entrées et limites topologiques. Vérifiez gradients finis et champs structurels avant d’alterner apprentissage et mutation. La [mise à jour de gestion mémoire][memory] modifie le lot de travail, un réglage distinct de l’apprentissage.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s3]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/examples/func_fit/xor_grad.py
[implementation]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/src/tensorneat/genome/base.py
[memory]: /fr/news/tensorneat-gradient-memory
