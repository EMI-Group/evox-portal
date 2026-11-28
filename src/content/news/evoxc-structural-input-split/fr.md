---
title: "EvoX Compiler sépare la préparation réutilisable des entrées variables"
pubDate: 2026-11-28
summary: "De nouvelles transformations structurelles exposent une frontière prepare/apply pour examiner ce qui peut être réutilisé et ce qui doit être exécuté à chaque appel."
---

Un calcul répété mélange souvent entrées fixes et variables. Recalculer la contribution fixe peut gaspiller des ressources, mais conserver arbitrairement un intermédiaire peut modifier silencieusement le comportement. EvoX Compiler main expose maintenant split_by_inputs et analyze_inputs : une transformation structurelle sépare un graphe tracé en graphes de préparation et d’application, avec une frontière de tenseurs inspectable. Le graphe source reste intact. Les changements des 27–28 novembre font de la réutilisation une décision explicite plutôt qu’un cache implicite. [Implémentation et contrat][contract]

![Une presse maintient une plaque gravée préparée tandis que des feuilles différentes arrivent par un dispositif séparé](./cover.webp)

*Illustration conceptuelle : préparer une fois la contribution fixe, puis la réutiliser pour les entrées variables.*

## Choisir les entrées fixes

Imaginez évaluer de nombreux tenseurs candidats sur les mêmes références. Si un graphe linéaire calcule un intermédiaire à partir des seules références avant de le combiner aux candidats, cette dérivation peut appartenir à prepare. Le candidat variable va dans apply, qui reçoit l’arbre variable et le tuple préparé. Cet exemple décrit une structure appropriée, pas une accélération mesurée.

Le masque fixed reflète le pytree d’entrée : True fixe un tenseur, False ou None le rend variable. fixed_leaves permet aussi de donner les indices plats des entrées tenseurs. Fournissez exactement un sélecteur. Les feuilles statiques spécialisent déjà le graphe et ne traversent pas la frontière ; un masque non-None y est refusé. Les deux moitiés doivent recevoir des tenseurs : tout fixer ou ne rien fixer est invalide. Tuples, listes et dictionnaires ordinaires sont élagués par feuille ; un nœud enregistré à arité fixe, dataclass ou namedtuple partiellement élagué est refusé. [Sélection][split]

## Examiner le coût de la frontière

La passe propage les masques de dépendance dans le SSA linéaire, remonte des sorties pour supprimer les opérations mortes et sélectionne les valeurs fixes nécessaires aux opérations mixtes ou aux sorties. Elle clone les opérations dans de nouveaux modules. Les constantes sont recopiées dans la partie concernée plutôt que transmises comme sorties préparées. Les entrées variables inutilisées restent dans la signature apply.

SplitPlan expose frontière, formes, types, octets estimés et nombres d’opérations. Une taille statique inconnue rend l’estimation inconnue. Les comptes portent sur les identifiants distincts des opérations sources : une constante copiée des deux côtés compte dans chacun, mais une seule fois dans l’union servant aux suppressions. Leur somme ne reproduit donc pas forcément le compte source. Le rapport compare stockage retenu et calcul récurrent sans faire passer le nombre d’opérations pour une prédiction du temps réel. [API d’analyse][analysis]

## Un instantané aux limites explicites

Modifier une entrée fixe exige de relancer prepare. Aucun graphe ne gère l’invalidation. Les effets autres que pure/read sont refusés : ne pas dépendre des entrées variables ne rend pas une opération exécutable une seule fois sans risque. La première passe refuse aussi les régions imbriquées de cond, while_loop et scan. Collectives, callbacks et appels externes ou personnalisés nécessitent une autre approche lorsqu’ils sont bloqués.

analyze_inputs utilise la même analyse sans exécuter, tracer ni importer de backend. Il indique possibilité de découpage, motif de refus, consommateurs, sorties affectées et coût de frontière pour chaque entrée fixée seule lorsque cela est permis. Commencez ici : une grosse frontière ou peu de calcul fixe peut rendre le découpage peu intéressant. Un refus renseigne sur le graphe ; il ne justifie pas de supprimer un effet.

## Comparer les deux parties à l’original

Utilisez les sources contenant ces commits. Obtenez un SplitPlan et appelez verify pour contrôler invariants et connexions. Faites passer chaque Graph par lower, compile et load ; build refuse délibérément un Graph déjà tracé. Exécutez prepare avec les seuls arguments fixes, puis apply avec l’arbre variable et le tuple préparé. Comparez plusieurs entrées variables à l’original selon les tolérances du backend, puis changez les entrées fixes et recommencez la préparation. Mesurez séparément préparation, exécution répétée et mémoire retenue. L’[article sur le pipeline][related] décrit les étapes environnantes.

[contract]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/CONTEXT.md
[split]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/split.py
[analysis]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/analyze.py
[related]: /fr/news/evoxc-custom-compilation-pipeline
