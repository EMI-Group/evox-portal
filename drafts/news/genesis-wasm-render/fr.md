---
title: "EvoX Genesis réalise WASM Render en environ deux jours pour 36 $"
pubDate: 2026-10-14
summary: "Avec DeepSeek V4 Flash, EvoX Genesis a réalisé WASM Render en environ deux jours pour seulement 36 $ de frais de modèle, devenant le premier système d’IA au monde à soumettre un résultat pour ce défi. Les relevés de tests de l’équipe indiquent que 2,017/2,019 tests Khronos CTS ont été réussis (99.90 %), dont l’ensemble des 1,184/1,184 tests de conformité WebGL2.0 exécutés."
---

La capacité à poursuivre des tâches de longue durée jusqu’à la livraison d’un projet d’ingénierie complet devient un indicateur important des capacités de l’IA. Terminal-Bench est l’un des benchmarks représentatifs des agents d’IA : il porte sur des tâches de programmation et de ligne de commande dans des environnements de terminal. Terminal-Bench Challenges va plus loin en évaluant la construction de projets logiciels complets à partir de zéro, avec un coût officiellement estimé à plus de 1,000 dollars US par défi.

EvoX Genesis, le système d’IA récursif pour l’évolution logicielle développé par l’équipe EvoX, a utilisé DeepSeek V4 Flash pour réaliser le défi WASM Render en environ **deux jours**, avec seulement **36 dollars US** de frais de modèle, devenant **le premier système d’IA au monde à soumettre un résultat pour ce défi.** Les relevés de tests de l’équipe indiquent qu’il a réussi 2,017/2,019 tests de la suite Khronos CTS (99.90 %), dont l’ensemble des 1,184/1,184 tests de conformité WebGL2.0.

## Du code local à un système complet : où résident les difficultés ?

WASM Render est un défi de systèmes graphiques de Terminal-Bench Challenges : faire fonctionner des programmes WebGL sans navigateur, sans GPU et sans bibliothèques d’exécution externes.

Cela revient à implémenter un pipeline graphique en logiciel : interpréter les programmes de shaders, calculer les éléments graphiques et garantir la cohérence d’un grand nombre d’interfaces et de changements d’état. Une fonctionnalité isolée qui fonctionne reste bien loin d’un système entier dont tous les composants fonctionnent ensemble. La tâche exige que l’IA reste alignée sur l’objectif au fil de plusieurs cycles de développement, gère les dépendances entre modules, corrige les erreurs à partir des résultats des tests et mène finalement à bien l’intégration du système et la validation de non-régression.

Selon les résultats publiés par l’équipe Terminal-Bench pour un premier essai de 12 heures, Devin, le produit de développement logiciel par IA de Cognition, associé à Fable 5, a obtenu un taux de réussite de 20.5 % aux tests de conformité WebGL2.0, plus exigeants. Après environ deux jours de développement, Genesis a porté à 100 % le taux de réussite des tests de conformité WebGL2.0 qu’il a exécutés.

![Résultats des tests de conformité WebGL2.0 et relevés de tests Khronos CTS de Genesis](./wasm-render-results-en.png)

*Résultats des tests de conformité WebGL2.0 et relevés de tests Khronos CTS de Genesis.*

Le dépôt public des résultats de Genesis contient environ **130,000 lignes de code**, couvrant un compilateur du langage de shaders GLSL, les interfaces WebGL et la gestion des états, la rastérisation logicielle et la présentation des images. Ces implémentations en TypeScript sont compilées pour produire un moteur de rendu JavaScript qui relie le traitement du langage, le calcul graphique et le comportement des interfaces.

Ce cycle de développement a finalement permis de réussir 2,017 tests Khronos CTS, avec environ 36 dollars US de frais de tokens du modèle et un taux de succès du cache d’environ 98 %. Poursuivre et intégrer un projet d’ingénierie logicielle d’une telle ampleur à faible coût de modèle démontre également la capacité de Genesis à mener un développement de longue durée avec des modèles open source économiques.

## Laisser le projet évoluer et faire intervenir les agents selon les besoins

Genesis est un système d’IA récursif pour l’évolution logicielle. Les utilisateurs décrivent un objectif de développement logiciel, puis le système organise les tâches autour de cet objectif, confie le travail aux agents locaux là où ils sont nécessaires et conserve dans le projet logiciel le code accepté ainsi que les résultats de validation.

Pour les grands projets, une approche intuitive consiste à donner davantage aux agents : des contextes plus longs, des sessions plus persistantes et une collaboration prédéfinie plus élaborée. Genesis place la continuité du développement dans le projet logiciel lui-même. Les objectifs et les contraintes de haut niveau guident le développement de bout en bout, tandis que les tâches se déploient récursivement selon la structure du dépôt. Les agents traitent un travail local, puis se retirent une fois celui-ci terminé ; les agents suivants poursuivent à partir du projet déjà constitué.

Auparavant, Genesis était parti d’un dépôt vide, avait construit un compilateur C comprenant environ 250,000 lignes de code et avait poursuivi le développement d’un modèle à l’autre. Les résultats des tests WASM Render valident davantage les capacités de construction et d’intégration autonomes de Genesis dans le développement de systèmes graphiques complexes.

## Open source et communauté

L’équipe EvoX poursuivra le développement de systèmes d’IA récursifs pour l’évolution logicielle, afin de favoriser l’accumulation de code, de résultats de validation et d’expérience de développement dans la communauté open source. Nous invitons davantage de développeurs à participer à une évolution logicielle durable et à construire ensemble un écosystème ouvert de développement logiciel.

🔗 Dépôt Genesis : [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Article scientifique Genesis : [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Dépôt des résultats du défi : [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Projet en amont (EvoX) : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Groupe QQ : 297969717
