---
title: "Genesis WASM Render : de la génération locale de code à la construction de systèmes"
pubDate: 2026-10-15
updatedDate: 2026-11-08
summary: "Le renderer logiciel de Genesis explore comment interfaces, tests et changements acceptés coordonnent la construction d'une chaîne graphique complète."
---

Construire un système logiciel exige que les changements locaux utiles restent compatibles à mesure que le projet grandit. Le cas WASM Render de Genesis étudie ce défi avec une chaîne graphique, reliant Agentic AI dans EvoX à la construction de systèmes : traitement des shaders, rendu et comportement des API doivent former un ensemble cohérent.

![Une géométrie filaire devient une image ombrée en pixels](./software-graphics-pipeline.webp)

Le dossier public de Genesis décrit un moteur de rendu logiciel TypeScript développé avec DeepSeek V4 Flash. Il rapporte 2 017/2 019 cas Khronos CTS réussis, dont 1 184/1 184 cas WebGL2 dans l'ensemble évalué. Les quelque 36 USD couvrent les tokens, sans le matériel. L'archive indique 65,9 heures entre le premier et le dernier commit des agents : cet intervalle ne mesure pas leur temps de travail actif.

[Genesis Evidence](https://genesis.evox.group/evidence/tbench-wasm/)

## Du code local à un système complet : où résident les difficultés ?

WASM Render est un défi de systèmes graphiques de Terminal-Bench Challenges : faire fonctionner des programmes WebGL sans navigateur, sans GPU et sans bibliothèques d’exécution externes.

Cela revient à implémenter un pipeline graphique en logiciel : interpréter les programmes de shaders, calculer les éléments graphiques et garantir la cohérence d’un grand nombre d’interfaces et de changements d’état. Une fonctionnalité isolée qui fonctionne reste bien loin d’un système entier dont tous les composants fonctionnent ensemble. La tâche exige que l’IA reste alignée sur l’objectif au fil de plusieurs cycles de développement, gère les dépendances entre modules, corrige les erreurs à partir des résultats des tests et mène finalement à bien l’intégration du système et la validation de non-régression.

L'essai initial de 12 heures et cette exécution disposent de budgets de développement différents : leurs taux de réussite ne constituent pas un classement contrôlé. L'archive Evidence rapporte aussi 16/38 cas visuels three.js au seuil strict de 0,1 %, et 13/16 cas Babylon.js, sur des sous-ensembles sélectionnés. La conformité des API ne prouve donc pas une compatibilité graphique complète.

![Résultats des tests de conformité WebGL2.0 et relevés de tests Khronos CTS de Genesis](./wasm-render-results-en.png)

*Résultats des tests de conformité WebGL2.0 et relevés de tests Khronos CTS de Genesis.*

L'archive compte 135 165 lignes de texte suivies, comprenant renderer.js généré, du code tiers, un fichier de verrouillage et de la documentation ; ce ne sont pas uniquement les sources du moteur. Le projet décrit une soumission autonome précoce, sans classement publié par les organisateurs. Ces résultats sont déclarés par le projet et n'ont pas été reproduits indépendamment.

Ce cycle de développement a finalement permis de réussir 2,017 tests Khronos CTS, avec environ 36 dollars US de frais de tokens du modèle et un taux de succès du cache d’environ 98 %. Poursuivre et intégrer un projet d’ingénierie logicielle d’une telle ampleur à faible coût de modèle démontre également la capacité de Genesis à mener un développement de longue durée avec des modèles open source économiques.

## Laisser le projet évoluer et faire intervenir les agents selon les besoins

Genesis est un système d’IA récursif pour l’évolution logicielle. Les utilisateurs décrivent un objectif de développement logiciel, puis le système organise les tâches autour de cet objectif, confie le travail aux agents locaux là où ils sont nécessaires et conserve dans le projet logiciel le code accepté ainsi que les résultats de validation.

Pour les grands projets, une approche intuitive consiste à donner davantage aux agents : des contextes plus longs, des sessions plus persistantes et une collaboration prédéfinie plus élaborée. Genesis place la continuité du développement dans le projet logiciel lui-même. Les objectifs et les contraintes de haut niveau guident le développement de bout en bout, tandis que les tâches se déploient récursivement selon la structure du dépôt. Les agents traitent un travail local, puis se retirent une fois celui-ci terminé ; les agents suivants poursuivent à partir du projet déjà constitué.

Auparavant, Genesis était parti d’un dépôt vide, avait construit un compilateur C comprenant environ 250,000 lignes de code et avait poursuivi le développement d’un modèle à l’autre. Les résultats des tests WASM Render valident davantage les capacités de construction et d’intégration autonomes de Genesis dans le développement de systèmes graphiques complexes.

## Des systèmes ouverts qui continuent d'évoluer

La valeur ouverte de ce cas tient à une construction inspectable : interfaces, implémentations et validations restent disponibles pour les travaux suivants. Il fait progresser l'approche EvoX d'un logiciel accumulant les changements utiles entre tâches d'agents, dont les progrès sont évalués par le comportement du système intégré.

🔗 Dépôt Genesis : [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Article scientifique Genesis : [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Dépôt des résultats du défi : [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Projet en amont (EvoX) : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Groupe QQ : 297969717
