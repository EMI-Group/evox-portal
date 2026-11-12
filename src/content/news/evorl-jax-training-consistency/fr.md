---
title: "EvoRL : garder gradients, appareils et indicateurs cohérents"
pubDate: 2026-11-08
summary: "Les évolutions du 8 novembre traitent la différentiation JAX et Playground, après les corrections de placement et de métriques de population."
---

Un entraînement peut échouer avant d'apprendre, ou finir avec des journaux masquant ce qui a été mesuré. Les changements main d'EvoRL du 8 novembre 2026 concernent différentiation JAX et compatibilité des environnements, après les corrections d'octobre sur placement et indicateurs. Le [tag source v0.2.0][s1] conserve cet état de développement pour une inspection reproductible.

![Un robot simulé aligné avec des cadres de calibration et une grille](./cover.webp)

*Illustration conceptuelle : un entraînement cohérent dépend de plusieurs contrats d'exécution alignés.*

## Un chemin de gradient sensible à la version JAX

Le [correctif du 8 novembre][s2] étend le contournement local à JAX 0.12.0.1. Dans JAX 0.12.0 et 0.12.0.1, les dérivées de `erf` et `erfc` à l'intérieur de `shard_map` peuvent échouer aux contrôles VMA. Le chemin Tanh Normal concerné utilise alors un autre calcul du logarithme de la CDF normale, avec développement de queue.

En contrôle continu, la distribution de politique doit fournir des probabilités différentiables pour actualiser les paramètres. L'environnement peut s'initialiser correctement puis échouer au calcul du gradient. Le correctif est limité à ces versions ; les autres gardent le chemin initial. Le README du tag recommande JAX 0.11.0 avec CUDA 13 comme combinaison testée pour cet instantané.

## Expliciter les hypothèses de placement et d'environnement

Le même commit impose `playground>=0.2.0,<1` afin de conserver l'interface JAX/MJX de l'adaptateur. Une mise à jour qui change cette interface modifie la base de l'entraînement même si sa configuration reste identique.

Les travaux d'octobre reconstruisent aussi les valeurs de tableaux capturées par une copie explicite, pour respecter le maillage actif en JAX eager. ARS utilise l'évaluateur ordinaire lorsque la normalisation des observations est désactivée, évitant des statistiques absentes dans ce mode. Placement et normalisation deviennent ainsi des contrats explicites plutôt que des suppositions d'initialisation. [Correction appareils et ARS][s3]

## Une population n'est pas une politique

La [correction des indicateurs du 28 octobre][s4] distingue collections et résultats individuels. `pop_episode_returns` et `pop_episode_lengths` conservent l'axe population ; les résultats individuels ou de politique centrale emploient le singulier quand il convient. L'apprenant unique d'ERL-EDA reçoit des métriques scalaires, les collections gardent leurs tableaux.

Comparer une méthode de population à une politique unique peut devenir trompeur si l'on moyenne à nouveau un champ déjà agrégé ou traite un vecteur comme un scalaire. Avant de réutiliser les scripts d'analyse, inspectez noms et formes à la frontière des journaux. La migration doit préserver les réductions voulues sur populations, épisodes et apprenants.

## Reproduire un petit essai avant de reprendre l'étude

Le tag exige Python 3.12 ou ultérieur et JAX/jaxlib 0.10.0 ou ultérieur. La distribution est `evorl-jax`, l'import reste `evorl`. Pour les scripts et configurations, récupérez le tag et suivez ses instructions. L'exemple de base est `python scripts/train.py agent=ppo env=brax/ant`.

Avant de comparer les courbes, vérifiez sur un petit essai les gradients, le placement et la forme des métriques. Aim est inclus par défaut ; les autres enregistreurs nécessitent leur SDK. Conservez environnement, graine et budget. La [présentation EvoRL][related] explique apprentissage et évolution ; ces corrections facilitent la vérification des hypothèses de chaque expérience.

[s1]: https://github.com/EMI-Group/evorl/blob/v0.2.0/README.md
[s2]: https://github.com/EMI-Group/evorl/commit/5c889cad465ca88e3ec0d9112b0ec55835eb68fc
[s3]: https://github.com/EMI-Group/evorl/commit/a1ca25e9b232fdb6a6160c12cfc8bd702477096b
[s4]: https://github.com/EMI-Group/evorl/commit/992a554eb164a87ef9249592711cebd319ad9ebc
[related]: /fr/news/evorl
