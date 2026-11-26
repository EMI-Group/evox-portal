---
title: "EvoX Compiler ouvre son pipeline à la compilation personnalisée"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "La branche main accepte les appels personnalisés, le StableHLO intégré et les modules modifiés, avec des capacités explicites pour chaque backend."
---

Une opération expérimentale peut dépasser les possibilités d’une bibliothèque de tenseurs sans imposer de changer tout le programme. Les mises à jour de la branche par défaut d’EvoX Compiler des 23–24 novembre 2026 permettent d’insérer des opérations propres au compilateur, de compiler du code intermédiaire modifié et de choisir des backends personnalisés. Il faut d’abord décider où exécuter l’extension : dans le compilateur, comme noyau à l’exécution ou comme backend complet. [Implémentation et guide][guide]

![Une cartouche optique amovible rejoint un rail modulaire traversé par un rayon rouge continu](./cover.webp)

*Illustration conceptuelle : remplacer une étape en gardant le pipeline environnant explicite.*

## Choisir la frontière du travail personnalisé

`custom_call` émet un appel StableHLO nommé, avec résultats déclarés et configuration optionnelle du backend. Le compilateur externe détermine si la cible existe et peut être abaissée. `inline_stablehlo` insère plutôt un fragment brut : les opérandes utilisent `%in0` et les indices suivants, tandis que les résultats sont affectés à `%out0` et aux indices suivants. Les spécifications de sortie restent explicites. Noms, configuration et fragments sont des valeurs statiques qui spécialisent le graphe. [Contrat des opérations][ops]

Ces interfaces n’enregistrent pas de noyau arbitraire auprès d’IREE ou de PJRT. Pour un noyau Python ou Triton exécuté à l’exécution, le mécanisme existant est l’enregistrement `external_call`. Pour une opération portable exprimée avec les opérations ordinaires d’EvoX Compiler, un bloc avec sa décomposition constitue une autre solution. Cette distinction évite de confondre déclaration au compilateur et implémentation à l’exécution.

## Modifier le programme intermédiaire, puis compiler

Un développeur peut, par exemple, inspecter un exécutable avec `source_text()`, modifier son StableHLO et soumettre le texte à `compile_text` avec les spécifications d’entrée et de sortie. Le traçage et la construction du graphe sont contournés, puis les étapes habituelles de compilation et de chargement s’appliquent. Les spécifications décrivent les tuples extérieurs : le contrat d’exécution doit conserver ces entrées et sorties. Le compilateur externe valide le module ; accepter le texte ne prouve pas la justesse numérique. [Implémentation du pipeline][pipeline]

Conservez un petit jeu d’entrées et comparez les résultats au programme initial après chaque modification. Une cible absente doit être diagnostiquée lors de la légalisation, sans changement silencieux de backend. L’interpréteur NumPy et le moteur CPU natif rejettent explicitement ces extensions. Les nouvelles opérations n’ont pas non plus de règles automatiques de traitement par lots ou de différentiation : choisissez une solution prise en charge si vous en avez besoin. [Capacités et limites][guide]

## Brancher délibérément un backend

Les instances de backend restent désormais cohérentes entre les étapes. L’enregistrement permet remplacement et suppression explicites, et les points d’entrée ouvrent la fourniture de backends aux paquets externes. Un backend compilateur déclare ses capacités et dtypes, puis implémente compilation et chargement ; un ensemble de dtypes vide rejette tous les graphes. Des modules IREE personnalisés, compilateur et runtime, peuvent être sélectionnés par options ou variables d’environnement, pour tester une version spécifique sans la mélanger au runtime standard. [Guide d’extension][guide]

## Vérifier séparément transferts et résultats numériques

La même période de développement modifie les transferts Vulkan : les envois jusqu’à 16 MiB utilisent des tampons cohérents mappés, puis une copie au-delà. Le retour distingue la mémoire hôte de la mémoire GPU simplement visible par l’hôte. Les mesures enregistrées concernent une seule configuration GPU intégré Intel/Mesa/IREE ; mesurez séparément transfert et exécution sur votre matériel. [Transferts][transfer]

Le CPU natif réutilise aussi le stockage des grands tampons et tableaux entrants pour réduire les allocations répétées. Les réductions répartissent les sorties indépendantes en conservant leur ordre d’accumulation. Les adaptateurs exposent `split_reduction_threshold` et `split_reduction_non_exact` : vérifiez résultats numériques et temps lorsque vous changez cette politique. [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

Une correction de `power` sur CPU natif aligne aussi le traitement des exposants sur le calcul flottant de NumPy. Le banc de comparaison distingue les contrôles exacts entiers/booléens des comparaisons flottantes avec tolérance. Avant d’adopter ce code source, gardez vos résultats de référence, testez le compilateur et le périphérique choisis et vérifiez les tolérances. La [version v0.1.1][release] décrit le pipeline de préparation initial ; ces modifications étendent sa personnalisation. [Correction numérique][power]

Mise à jour associée · 2026-11-26: [EvoX Compiler v0.2.3 : installer le backend adapté à votre charge de travail](/fr/releases/evoxc-0-2-3).


[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /fr/releases/evoxc-0-1-1
