---
title: "TensorNEAT : conserver la population, limiter la mémoire de travail"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Les lots de population et des intermédiaires de recherche plus petits réduisent l’ensemble de travail simultané de NEAT sans réduire la population explorée."
---

Même si les génomes tiennent en mémoire, leurs tableaux de transformation et d’évaluation peuvent épuiser le GPU. La [mise à jour du 4 avril 2026][s2] de TensorNEAT place la transformation dans des lots séquentiels et réduit les intermédiaires de recherche. Le nombre de candidats est conservé tandis que l’ensemble de travail devient réglable.

![Des réseaux différents passent par groupes dans une petite ouverture](./cover.webp)

*Illustration conceptuelle : préserver la population en limitant le lot de travail actif.*

## Découper l'ensemble de travail, pas l'espace de recherche

La mise à jour ajoute `pop_batch_size` à NEAT et Pipeline. La valeur Pipeline remplace celle de l'algorithme et doit diviser la population. L'ancien argument `eval_batch_size` est remplacé : les configurations qui l'utilisent doivent migrer.

Sur un seul appareil, la transformation passe dans une boucle `jax.lax.scan`. Au lieu de matérialiser d'abord les intermédiaires d'adjacence dense de toute la population, le pipeline transforme et évalue un lot à la fois. La mutation utilise aussi ce réglage. La population garde sa taille ; seul l'ensemble actif simultané change. Cela aide à préserver la diversité en atteignant les limites mémoire du GPU.

Le point où commence le lot est essentiel. Diviser l’évaluation après avoir transformé toute la population laisse déjà alloué le grand intermédiaire d’adjacence. Déplacer les deux opérations dans scan change sa durée de vie. Le commit décrit le passage de population × nœuds × nœuds à lot × nœuds × nœuds. Cette comparaison d’implémentation n’est pas une formule de mémoire totale : génomes, état persistant et autres tampons occupent encore de la place. [Transformation][s2]

Le traitement par lots est un choix d’exécution. Il ne sélectionne pas moins de survivants et ne change pas la population demandée. Réduire la population change au contraire les participants et peut modifier la recherche. Distinguez ces réglages pour diagnostiquer un manque de mémoire. Une première comparaison utile conserve la population et ne fait varier qu’un diviseur valide pour le lot.

## Des recherches sans vastes intermédiaires de comparaison

Les comparaisons imbriquées du croisement sont remplacées par correspondances hachées et recherches triées. Les clés de connexions sont reliées aux indices des nœuds par tri et recherche. Ces changements ciblent les grands tableaux temporaires qui grossissent avec la population et la capacité des réseaux.

Le commit rapporte des trajectoires identiques sur 15 générations avec graine fixe pour DefaultGene et OriginGene. C'est un résultat de régression précis, pas une promesse pour toute dépendance ou tout matériel. Des scripts de correction et de profilage mémoire permettent d'examiner l'implémentation avec ces affirmations.

## Choisir le lot dans une expérience reproductible

Commencez par un petit ajustement de fonction, en fixant les limites de nœuds et connexions. Enregistrez la séquence sans lots puis choisissez une taille divisant la population. Vérifiez la correction avant de mesurer séparément pic mémoire, compilation et temps par pas. Un lot plus petit réduit la mémoire mais modifie le parallélisme disponible.

Utilisez le [snapshot d’avril][s4] pour fixer la sémantique des paramètres, y compris celui du lot renommé. TensorNEAT repose sur JAX ; son intégration EvoX documentée vise la branche de l’époque JAX. Notez les versions des dépendances avec les mesures. L’article distinct sur les [gradients de population][gradient] décrit l’ajustement des paramètres. Vérifiez d’abord que le changement de lot préserve votre exécution, puis évaluez le compromis mémoire-temps.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /fr/news/tensorneat-population-gradients
