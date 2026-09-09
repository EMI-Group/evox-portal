---
title: "EvoX Genesis termine et soumet le défi WASM Render de Terminal-Bench pour 36 dollars"
pubDate: 2026-09-10
summary: "L'équipe EvoX a utilisé Genesis pour terminer et soumettre le défi WASM Render de Terminal-Bench Challenges, avec un coût de modèle enregistré de 36 dollars pour cette exécution — bien en dessous des plus de 1 000 dollars par défi annoncés par Terminal-Bench. À la date de publication, Genesis est peut-être le premier système autonome à rapporter publiquement l'achèvement et la soumission d'un résultat de Terminal-Bench Challenge."
---

![EvoX Genesis termine et soumet le défi WASM Render de Terminal-Bench](./evox-genesis-terminal-bench-hero.png)

L'équipe EvoX a utilisé Genesis pour terminer et soumettre le défi WASM Render de Terminal-Bench Challenges, avec un **coût de modèle enregistré de 36 dollars** pour cette exécution.

À la date de publication, **Genesis est peut-être le premier système autonome à rapporter publiquement l'achèvement et la soumission d'un résultat de Terminal-Bench Challenge**.

## WASM Render : construire une pile logicielle WebGL complète à partir de zéro

WASM Render demande de mettre en œuvre un moteur de rendu logiciel pur JavaScript/WASM fournissant les API WebGL 1.0 et 2.0 à des projets Node.js. L'environnement cible ne peut dépendre ni d'un navigateur, ni d'un GPU, ni de liaisons C++ natives, ni de bibliothèques externes.

Selon la spécification du défi, la solution doit couvrir un compilateur GLSL, la rastérisation de triangles et l'ensemble de la surface de l'API WebGL. Terminal-Bench définit le périmètre de vérification comme 2 071 tests Khronos CTS, accompagnés de suites de régression visuelle pour three.js et Babylon.js. Cela décrit l'objectif d'acceptation du défi ; cela ne signifie pas que la soumission de Genesis a déjà passé une évaluation officielle de Terminal-Bench.

De nombreux benchmarks d'agents de codage évaluent une correction de bug unique ou une fonctionnalité localisée. WASM Render est différent : le travail s'étend sur un grand ensemble de modules interdépendants, et l'ensemble de la base de code doit rester cohérent tout au long de l'implémentation, de l'intégration et de la validation continues.

Les tâches de ce type exposent les problèmes centraux du développement de longue durée : les modifications locales restent-elles cohérentes avec l'architecture globale, les décisions initiales sont-elles correctement héritées par le travail ultérieur, et les preuves de validation peuvent-elles guider de manière fiable l'étape suivante. Terminal-Bench Challenges élargit l'unité d'évaluation à un projet logiciel complet afin d'examiner ces capacités.

![Terminal-Bench Challenges comparé aux tâches de codage de plus courte durée](./evox-genesis-terminal-bench-comparison.jpg)

## Comment Genesis soutient le développement de longue durée

Genesis ne s'appuie pas sur un agent persistant unique ni sur un contexte sans cesse croissant pour conserver l'intégralité de l'état de développement. Le projet logiciel constitue lui-même le « monde » persistant : la version acceptée du logiciel enregistre l'état actuel, tandis que les chemins du dépôt délimitent la position d'un agent et son périmètre de responsabilité.

Des agents à durée de vie limitée se déploient récursivement autour de la structure du dépôt. Dans des périmètres bornés, ils implémentent, inspectent et valident les modifications candidates. Les sorties des agents commencent par être des propositions ; seuls le code accepté et les preuves de validation entrent dans l'historique du projet et deviennent héritables par les agents suivants.

Pour un projet système comme WASM Render, cela permet à chaque agent de traiter un problème ciblé et borné, tandis que le compilateur, le pipeline de rendu, la gestion d'état et les travaux de compatibilité continuent d'évoluer à travers un historique partagé de code et de validation.

Genesis a terminé le défi WASM Render pour seulement 36 dollars, très en dessous des plus de 1 000 dollars par défi annoncés par Terminal-Bench.

Nos tests internes non formels indiquent également que Genesis peut travailler efficacement sur des bases de code d'environ 100 000 lignes. Nous avons moins d'expérience avec les bases de code d'un million de lignes ou plus, mais nos tentatives jusqu'à présent se sont déroulées sans difficulté.

🌐 Site web du projet :

https://genesis.evox.group/

🔗 **GitHub** :

https://github.com/EMI-Group/genesis

🌐 Groupe QQ : 297969717

![Code QR du groupe QQ](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>Groupe QQ｜</strong>Evolutionary Machine Intelligence</center>
