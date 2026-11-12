---
title: "TensorNEAT : affiner des réseaux différents sans garder tous les intermédiaires"
pubDate: 2026-04-04
summary: "Les gradients parallèles et l'exécution à mémoire contrôlée relient recherche de topologies et ajustement des paramètres avec JAX."
---

La recherche de structures neuronales produit des individus différents. L'[intégration des gradients du 3 mars 2026][s1] dans TensorNEAT permet d'affiner leurs paramètres en parallèle. La [mise à jour mémoire du 4 avril][s2] réduit ensuite les intermédiaires et introduit des lots de population, offrant un réglage autre que la réduction de la recherche.

![Des réseaux différents passent par groupes dans une petite ouverture](./cover.webp)

*Illustration conceptuelle : préserver la population en limitant le lot de travail actif.*

## Une opération de gradient pour des structures différentes

TensorNEAT représente les réseaux NEAT par des tableaux de nœuds et connexions. `genome.grad` renvoie une perte scalaire et les gradients des deux tableaux. Les champs structurels, indices et types de fonctions, ainsi que le remplissage NaN reçoivent des gradients nuls. Les paramètres numériques changent, la structure encodée reste préservée.

La vectorisation JAX applique ce calcul même à des topologies différentes. L'[exemple XOR][s3] initialise une population, la diversifie par mutation puis optimise les réseaux par descente de gradient. C'est une brique expérimentale concrète pour étudier ensemble structure et paramètres, sans supposer que le gradient modifie les connexions discrètes.

## Découper l'ensemble de travail, pas l'espace de recherche

La mise à jour ajoute `pop_batch_size` à NEAT et Pipeline. La valeur Pipeline remplace celle de l'algorithme et doit diviser la population. L'ancien argument `eval_batch_size` est remplacé : les configurations qui l'utilisent doivent migrer.

Sur un seul appareil, la transformation passe dans une boucle `jax.lax.scan`. Au lieu de matérialiser d'abord les intermédiaires d'adjacence dense de toute la population, le pipeline transforme et évalue un lot à la fois. La mutation utilise aussi ce réglage. La population garde sa taille ; seul l'ensemble actif simultané change. Cela aide à préserver la diversité en atteignant les limites mémoire du GPU.

## Des recherches sans vastes intermédiaires de comparaison

Les comparaisons imbriquées du croisement sont remplacées par correspondances hachées et recherches triées. Les clés de connexions sont reliées aux indices des nœuds par tri et recherche. Ces changements ciblent les grands tableaux temporaires qui grossissent avec la population et la capacité des réseaux.

Le commit rapporte des trajectoires identiques sur 15 générations avec graine fixe pour DefaultGene et OriginGene. C'est un résultat de régression précis, pas une promesse pour toute dépendance ou tout matériel. Des scripts de correction et de profilage mémoire permettent d'examiner l'implémentation avec ces affirmations.

## Choisir le lot dans une expérience reproductible

Commencez par un petit ajustement de fonction, en fixant les limites de nœuds et connexions. Enregistrez la séquence sans lots puis choisissez une taille divisant la population. Vérifiez la correction avant de mesurer séparément pic mémoire, compilation et temps par pas. Un lot plus petit réduit la mémoire mais modifie le parallélisme disponible.

Pour les gradients, consultez XOR et explicitez perte et taux d'apprentissage. Pour la mémoire, fixez l'[instantané d'avril][s4]. TensorNEAT repose sur JAX ; l'intégration EvoX du README vise la branche de l'époque JAX, point important pour assembler les environnements. Il devient possible d'étudier précisément la quantité de recherche structurelle et paramétrique compatible avec un budget mémoire.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s3]: https://github.com/EMI-Group/tensorneat/blob/ce27fa9f794928c9416d9f12c398f58481c821ce/examples/func_fit/xor_grad.py
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
