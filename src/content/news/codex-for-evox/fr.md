---
title: "Codex pour EvoX : Concevoir des algorithmes, migrer du code et exécuter des expériences reproductibles par la conversation"
pubDate: 2026-08-08
summary: "Le calcul évolutionnaire entre dans l'ère native de l'IA. Avec Codex comme agent de codage IA représentatif, EvoX transforme une intention en langage naturel en workflows de calcul évolutionnaire exécutables — couvrant la modélisation de problèmes, la migration d'algorithmes, la neuroévolution sans rétropropagation et la tensorisation GPU."
---

# Codex pour EvoX : Concevoir des algorithmes, migrer du code et exécuter des expériences reproductibles par la conversation

Le calcul évolutionnaire entre dans l'ère native de l'IA.

[EvoX](https://github.com/EMI-Group/evox) est un framework distribué et accéléré par GPU pour le calcul évolutionnaire à grande échelle. Grâce à ses interfaces unifiées `Algorithm`, `Problem` et `Workflow`, EvoX réunit la recherche par population, l'évaluation par lots, l'exécution d'expériences et l'accélération matérielle au sein d'une architecture de calcul cohérente. Il prend en charge des applications allant de l'optimisation mono- et multi-objectif à la neuroévolution, aux environnements d'apprentissage par renforcement et à la conception de systèmes complexes.

Depuis sa publication open source, EvoX n'a cessé d'évoluer autour d'une mission claire :

> **Construire une infrastructure de nouvelle génération pour le calcul évolutionnaire, conçue spécifiquement pour le matériel moderne et l'informatique à grande échelle.**

## Prologue : Le langage naturel devient un nouveau point d'entrée pour EvoX

Des années de développement open source ont rendu les interfaces, la documentation, les exemples et le modèle de programmation d'EvoX publics, structurés et exécutables. Des agents de codage IA à usage général ayant accès à ces ressources et à un environnement de développement exécutable peuvent comprendre le framework et assister la configuration de l'environnement, la modélisation de problèmes, le développement d'algorithmes, la migration de code, l'expérimentation par lots et l'optimisation des performances.

C'est ce que signifie le **support natif** dans cet article : Codex n'a pas besoin d'un plugin EvoX dédié pour travailler avec le framework. Il peut utiliser directement la documentation publique, le code source et le contexte du projet d'EvoX.

Auparavant, les chercheurs devaient généralement apprendre un framework d'abord, puis traduire leurs problèmes en code compréhensible par le framework. Ce processus peut désormais démarrer dans la direction opposée. Dans les exemples ci-dessous — de la modélisation en langage naturel et la migration d'algorithmes au contrôle sans rétropropagation et à la tensorisation GPU — Codex traduit l'intention humaine en implémentation, tandis qu'EvoX fournit une fondation unifiée pour les algorithmes, les expériences et le calcul parallèle.

**Les humains définissent le problème, Codex organise l'implémentation et EvoX exécute le processus évolutionnaire.**

## Point de départ : De l'installation du framework à la description directe du problème

### 1. Entrer dans EvoX en une phrase

Commencez par l'instruction la plus simple :

> **Installez EvoX pour moi.**

![Codex installant et vérifiant EvoX](./codex-for-evox-1.png)

Codex peut inspecter l'environnement Python, PyTorch et GPU existant, sélectionner une méthode d'installation appropriée et effectuer une vérification de base. Cela réduit considérablement les connaissances spécifiques au framework et la configuration manuelle de l'environnement requises avant que les utilisateurs ne puissent se concentrer sur le problème qu'ils veulent réellement résoudre.

### 2. D'exigences vagues à une tâche complète de calcul évolutionnaire

Les problèmes réels arrivent rarement avec des variables de décision, des fonctions objectif et des contraintes prédéfinies. Le plus souvent, nous ne connaissons que ce que nous avons et le résultat que nous souhaitons :

> **Utilisez EvoX pour écrire un algorithme résolvant le problème suivant : un robot d'entrepôt se déplace de l'entrée à la sortie et doit éviter les étagères en chemin. Construisez une disposition d'entrepôt fixe et reproductible ; trouvez un itinéraire aussi court que possible, sans collision et fluide ; exécutez l'expérience ; et visualisez le processus d'optimisation.**

![Requête en langage naturel pour la planification d'itinéraire de robot d'entrepôt](./codex-for-evox-2.png)

Aucun modèle mathématique ni algorithme spécifique n'est fourni. Codex construit la disposition de l'entrepôt, traduit « court, sans collision et fluide » en objectifs et contraintes, et implémente l'encodage de l'itinéraire et l'expérience.

![Disposition de l'entrepôt, itinéraire optimisé et progression évolutive](./codex-for-evox-3.png)

EvoX fournit l'épine dorsale d'exécution tout au long de ce processus :

- Les itinéraires candidats sont représentés comme une population.
- Les fonctions objectif sont évaluées par lots via l'interface `Problem`.
- NSGA-II effectue la recherche itérative.
- `Workflow` connecte l'algorithme, le problème et le processus de surveillance.

Le résultat est un itinéraire sans collision reproductible, mesurable et visualisé. Mais traduire une intention en une expérience EvoX exécutable n'est que le début ; les scénarios de recherche nécessitent une expérimentation plus structurée.

## Aller plus loin : De la génération de code à la recherche expérimentale reproductible

### 3. D'une exécution unique à une comparaison d'algorithmes reproductible

Une exécution unique réussie montre seulement qu'une implémentation n'a pas immédiatement échoué. Une comparaison crédible nécessite un budget d'évaluation commun, des exécutions indépendantes, des enregistrements de convergence, des métriques standard, des tests statistiques et des limites explicites sur les conclusions :

> **Utilisez EvoX pour mener une expérience de comparaison d'algorithmes multi-objectif avec un budget unifié et 30 exécutions indépendantes, comparant NSGA-II, MOEA/D, HypE, AGE-MOEA et la recherche aléatoire. Suivez les pratiques expérimentales courantes d'IEEE TEVC pour HV/IGD+, les tailles d'effet et les analyses statistiques non paramétriques, et générez un rapport de visualisation avec des courbes de convergence, des fronts de Pareto et des limitations clairement énoncées.**

![Requête en langage naturel et résumé Codex pour la comparaison multi-objectif](./codex-for-evox-4.png)

Codex organise le protocole, tandis que quatre algorithmes évolutionnaires basés sur EvoX — NSGA-II, MOEA/D, HypE et le port local d'AGE-MOEA — sont évalués sous la même interface de problème, taille de population, budget d'évaluation et protocole de surveillance. Une ligne de base de recherche aléatoire indépendante est incluse pour le contexte. Les métriques, les historiques de convergence, les ensembles de solutions finaux et les analyses statistiques sont enregistrés au sein de la même structure d'expérience.

![Benchmark multi-objectif EvoX sur 30 exécutions indépendantes](./codex-for-evox-5.png)

Les panneaux supérieurs montrent la convergence de l'hypervolume. Sous le budget fixe de 3,000-evaluation, tous les algorithmes obtiennent encore un HV nul sur le problème ZDT4 plus difficile. Les panneaux inférieurs fournissent donc une vue supplémentaire de la manière dont les solutions non dominées finales regroupées se rapportent au front de Pareto de référence.

Les expériences générées par IA nécessitent encore une revue et une vérification humaines. Néanmoins, cet exemple montre comment une conversation continue peut utiliser EvoX pour transformer une exécution unique en une étude algorithmique comparable et reproductible.

### 4. De la compréhension du code existant à la réutilisation d'actifs de recherche

La recherche ne démarre pas toujours de zéro. De nombreux algorithmes précieux existent encore dans MATLAB, NumPy et des dépôts hérités. Les déplacer vers EvoX nécessite de comprendre comment l'implémentation originale organise l'état, les mises à jour de population, les opérateurs, les évaluations et la boucle expérimentale. Codex peut aider lorsque les fichiers source pertinents sont fournis :

> **Lisez le fichier d'entrée et les fonctions d'assistance associées dans ce répertoire, expliquez le flux algorithmique, migrez-le vers une implémentation EvoX et validez-le expérimentalement sur des problèmes de benchmark multi-objectif standard.**

![Explication et migration par Codex d'AGE-MOEA de PlatEMO](./codex-for-evox-6.png)

Codex réimplémente la détection de points extrêmes, la normalisation des objectifs, l'estimation de la géométrie du front de Pareto et le scoring de survie, puis organise l'état de population, l'évaluation de fitness, l'accouplement et la sélection environnementale selon les interfaces EvoX. L'AGE-MOEA migré réutilise les opérateurs de croisement, mutation et sélection d'EvoX, se connecte aux interfaces standard `Problem` et `Workflow`, et partage la structure d'exécution et de surveillance de la plateforme.

![Validation d'AGE-MOEA sur ZDT1 et ZDT4](./codex-for-evox-7.png)

La validation sur benchmark standard montre que l'implémentation migrée fonctionne correctement dans EvoX et s'approche des fronts de Pareto de référence. Un algorithme qui dépendait auparavant de MATLAB est ainsi devenu une implémentation EvoX qui peut être reproduite, comparée et étendue au sein de l'écosystème PyTorch, avec une voie claire vers une tensorisation et une accélération matérielle ultérieures.

Ces exemples montrent que Codex peut aider les utilisateurs à exploiter EvoX, à organiser des expériences standardisées et à porter des actifs de recherche existants dans le framework. Les objets d'évolution possibles, cependant, s'étendent bien au-delà des vecteurs d'optimisation conventionnels.

## Au-delà : Étendre les objets évolutifs et les frontières de calcul

### 5. Ce que vous faites évoluer dépend de vous

La conception hiérarchique et modulaire d'EvoX permet aux tâches suivant le schéma « solutions candidates → évaluation par lots → mise à jour itérative » d'être intégrées dans un workflow évolutionnaire. L'objet évolué peut être un vecteur numérique, un itinéraire, un réseau de neurones, une politique de contrôle ou un espace de conception caractérisé par des comportements divers.

Considérez une tâche de contrôle classique résolue par neuroévolution :

> **Utilisez EvoX pour faire évoluer un petit contrôleur à réseau de neurones sans rétropropagation, lui permettant d'équilibrer un pendule inversé. Complétez une implémentation minimale exécutable, et produisez la courbe d'entraînement et l'animation de contrôle finale.**

![Résumé Codex de l'expérience CartPole EvoX](./codex-for-evox-8.png)

Codex construit l'environnement CartPole et un petit réseau avec seulement 49 paramètres. EvoX utilise OpenES pour générer et mettre à jour la population de réseaux candidats, laisse chaque contrôleur agir dans l'environnement, et l'évalue selon la durée pendant laquelle le pendule reste équilibré. Le processus d'entraînement ne calcule aucun gradient et n'invoque aucune rétropropagation.

![Courbe d'entraînement CartPole](./codex-for-evox-9.svg)

![Contrôleur CartPole final évolué](./codex-for-evox-10.gif)

Dans cette expérience, la survie moyenne augmente d'environ 12.5 steps à la limite configurée de 400 steps. Cela montre qu'EvoX peut intégrer les paramètres de modèle, les politiques de contrôle et les environnements externes dans un workflow évolutionnaire plutôt que d'être limité aux fonctions de test numériques conventionnelles.

La même interface peut également prendre en charge des tâches de qualité-diversité telles que la génération procédurale de labyrinthes :

> **Utilisez EvoX et MAP-Elites pour générer automatiquement un ensemble divers de labyrinthes résolvables, cartographiez le paysage de diversité par sinuosité d'itinéraire et richesse de branches, et comparez les résultats avec la génération aléatoire sous le même budget.**

![Requête en langage naturel et résumé Codex pour la génération de labyrinthes MAP-Elites](./codex-for-evox-11.png)

Codex conçoit la tâche, tandis qu'EvoX gère la génération, l'évaluation et la sélection répétées des niveaux candidats. MAP-Elites conserve des représentants de différents styles selon la sinuosité d'itinéraire et la richesse de branches.

![Galerie MAP-Elites de labyrinthes résolvables divers](./codex-for-evox-12.png)

Avec un budget fixe de 5,000 candidats labyrinthes, MAP-Elites a occupé 22 des 36 niches prédéfinies, contre 24 pour la génération aléatoire ; les deux méthodes ont atteint 100% de résolvabilité car le décodeur garantit des labyrinthes résolvables. Cette petite expérience n'établit pas un avantage de couverture universel. Elle démontre plutôt comment EvoX peut maintenir une archive structurée de représentants de haute qualité à travers des niches comportementales explicitement définies.

### 6. Accélération du calcul : Réorganiser le travail autour du GPU

Les cas précédents se concentrent sur la compréhension des problèmes, la génération de code et l'organisation d'expériences. Ce dernier cas pénètre dans le calcul lui-même. Lorsque l'évaluateur de pendule inversé a été déplacé pour la première fois vers le GPU, il fonctionnait plus lentement que la version CPU. Le réseau était minuscule et chaque étape de simulation lançait de nombreuses petites opérations, de sorte que le surcoût de lancement de noyau et de planification Python dépassait l'arithmétique.

La demande de suivi était directe :

> **L'expérience actuelle du pendule inversé s'exécute plus lentement sur GPU que sur CPU. Analysez le goulot d'étranglement de performance ; tensorisez l'évaluation de population, l'inférence du contrôleur et la simulation d'environnement sur le GPU ; comparez les performances CPU et GPU avant et après optimisation ; et visualisez les résultats.**

![Requête en langage naturel et analyse de performance Codex](./codex-for-evox-13.png)

Codex utilise EvoX et PyTorch pour réorganiser l'évaluateur. Les contrôleurs, les épisodes et les états d'environnement restent dans des tenseurs par lots, tandis que les opérations matricielles par lots et la relecture de CUDA Graph réduisent les lancements GPU fragmentés. Le temps d'une évaluation de population passe de **427.47 ms** avec l'implémentation GPU d'origine à **22.10 ms** avec la relecture de CUDA Graph : une accélération d'environ **19.34×** par rapport à l'implémentation GPU d'origine, tout en conservant des résultats d'évaluation identiques.

![Performances CPU, GPU eager, GPU tensorisé et CUDA Graph](./codex-for-evox-14.png)

Cette charge de travail ne contient que 32 contrôleurs et un réseau à 49 paramètres, donc les rapports mesurés ne se généralisent pas à toutes les tâches. Néanmoins, elle valide une capacité importante d'EvoX : organiser les candidats en populations, les évaluer par lots et étendre le workflow aux GPU et aux charges de travail plus importantes. **Ensemble, l'implémentation assistée par IA et EvoX peuvent réorganiser le calcul évolutionnaire autour du matériel moderne.**

## D'une phrase à un workflow de calcul évolutionnaire évolutif

EvoX offre bien plus qu'une liste isolée d'algorithmes. Il fournit un écosystème de calcul évolutionnaire extensible :

- `Problem` apporte les tâches du monde réel, les simulateurs et les évaluations de modèles dans le calcul évolutionnaire.
- Les interfaces `Algorithm` et d'opérateurs prennent en charge à la fois les algorithmes existants et le développement personnalisé.
- `Workflow` connecte les populations, les problèmes, les moniteurs et les expériences.
- PyTorch permet au calcul de population d'être tensorisé et déplacé vers le matériel moderne.
- Les interfaces unifiées permettent à une exécution d'optimisation de devenir des expériences par lots, des comparaisons d'algorithmes et des workflows de neuroévolution.

Auparavant, les chercheurs devaient constamment basculer entre les descriptions de problèmes, les modèles mathématiques, les API de framework, le code d'algorithme, les scripts d'expérience, les outils statistiques et l'optimisation GPU. Désormais, le processus peut commencer en langage naturel et devenir progressivement un workflow de calcul complet, exécutable et reproductible au sein de la même conversation.

**Les humains définissent les objectifs, l'IA organise l'implémentation et EvoX exécute l'évolution.**

Commencez par une phrase, et explorez votre propre espace évolutionnaire.

---

**Note 1 :** Cet article utilise Codex comme agent de codage IA représentatif. D'autres agents capables de lire, générer, exécuter et déboguer du code peuvent utiliser EvoX de manières similaires. Les résultats dépendent du modèle, du contexte, de l'environnement d'exécution et des permissions d'outils.

**Note 2 :** Les démonstrations ont été exécutées avec le modèle GPT-5.5 Terra en utilisant medium intelligence, medium reasoning effort et standard speed.

**Note 3 :** Les résultats expérimentaux s'appliquent uniquement aux tâches, environnements, implémentations, budgets et matériel décrits ici. Ils ne représentent pas des garanties générales de performance ou d'accélération.
