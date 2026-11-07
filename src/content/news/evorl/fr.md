---
title: "EvoRL : réunir recherche évolutionnaire et apprentissage par renforcement sur GPU"
pubDate: 2025-01-14
updatedDate: 2026-11-07
summary: "EvoRL relie recherche par populations, apprentissage par renforcement et simulation parallèle pour expérimenter des approches évolutionnaires de Physical AI."
---

*Mis à jour le 7 novembre 2026. Cet article enrichi reflète l’implémentation actuelle du projet.*

Physical AI doit explorer des comportements différents, les tester par l'interaction et réutiliser l'expérience acquise. EvoRL inscrit ce cycle dans la simulation parallèle : les politiques individuelles apprennent, tandis que la recherche par populations explore des alternatives et des configurations d'apprentissage. La relation entre apprentissage et évolution devient ainsi un objet d'expérimentation.

EvoRL est un framework de recherche open source conçu autour de ces questions. Basé sur JAX, il rassemble apprentissage par renforcement, calcul évolutionnaire et simulation dans un workflow commun pour développer et évaluer des méthodes classiques et hybrides. Projet frère d’EvoX, il se concentre sur leur combinaison afin que la recherche à l’échelle d’une population profite des GPU modernes. [Présentation du projet](https://github.com/EMI-Group/evorl)

## Pourquoi associer évolution et apprentissage par renforcement ?

Prenons un robot qui apprend à marcher. Plusieurs politiques peuvent résoudre la même tâche, avec des démarches, des compromis entre vitesse et stabilité et des besoins énergétiques différents. Améliorer une politique selon une seule trajectoire d’apprentissage peut laisser de nombreuses possibilités inexplorées.

L’apprentissage par renforcement exploite les données d’interaction pour affiner les politiques. Le calcul évolutionnaire maintient un ensemble de candidats, les évalue, les sélectionne et les fait varier pour conserver plusieurs directions de recherche. Leur combinaison permet d’étudier un processus plus riche : les individus progressent par l’expérience et la population diffuse les résultats utiles.

La recherche évolutionnaire peut agir directement sur les paramètres des politiques ou ajuster les hyperparamètres de l’apprentissage. Il s’agit de deux questions distinctes : quelles politiques rechercher, et comment les aider à mieux apprendre ?

Cette complémentarité ne signifie pas que les méthodes hybrides surpassent l’apprentissage par renforcement seul dans toutes les tâches. Elle offre davantage de choix de conception à tester ; EvoRL vise à en réduire le coût d’ingénierie et de calcul.

## Une conception centrée sur un pipeline adapté aux GPU

La diversité fait l’intérêt des méthodes à population, mais elle a un coût. Chaque politique supplémentaire peut nécessiter davantage d’interactions, d’évaluations et de mises à jour. Lorsque ces étapes sont réparties entre CPU et GPU, les transferts répétés et l’ordonnancement peuvent devenir des goulots d’étranglement.

Avec des environnements de simulation GPU compatibles, EvoRL organise interactions, calcul des politiques, opérations évolutionnaires et mises à jour dans un pipeline GPU de bout en bout. La vectorisation et la compilation à la volée de JAX regroupent les calculs répétés et optimisent le graphe de calcul de chaque étape d’entraînement. [Présentation technique](https://evorl.readthedocs.io/latest/)

Le parallélisme intervient à trois niveaux :

- **Environnements parallèles** : une politique interagit avec plusieurs instances pour collecter l’expérience par lots.
- **Individus parallèles** : plusieurs politiques candidates d’une population sont évaluées simultanément.
- **Entraînements parallèles** : plusieurs agents apprennent simultanément, ce qui soutient les méthodes hybrides et l’entraînement de populations.

Il devient ainsi plus simple d’expérimenter avec davantage de politiques à la fois. La taille de la population reste à choisir selon la mémoire GPU, le coût de l’environnement et la taille du réseau. [Article sur l’architecture](https://arxiv.org/abs/2501.15129)

## Comparer quatre familles de méthodes dans un même framework

EvoRL fournit une base expérimentale commune pour établir des références, puis ajouter des mécanismes de recherche ou d’apprentissage.

| Famille de méthodes | Algorithmes représentatifs | Question principale |
| --- | --- | --- |
| Apprentissage par renforcement | PPO, TD3, SAC, entre autres | Comment améliorer une politique à partir des interactions ? |
| Algorithmes évolutionnaires | OpenES, ARS, CMA-ES, entre autres | Comment orienter la recherche à partir de l’évaluation des candidats ? |
| Apprentissage par renforcement guidé par l’évolution | ERL, CEM-RL et variantes | Comment faire coopérer recherche évolutionnaire et apprentissage par gradient ? |
| AutoRL fondé sur une population | PBT-PPO, PBT-SAC, entre autres | Comment adapter les configurations pendant l’entraînement ? |

Deux orientations hybrides méritent une attention particulière.

**L’apprentissage par renforcement guidé par l’évolution** relie recherche collective et apprentissage individuel. Une population peut explorer différentes régions de l’espace des paramètres, tandis que les mises à jour par renforcement améliorent les candidats. Les algorithmes diffèrent par le partage d’expérience, les mises à jour individuelles et la sélection ; EvoRL propose des implémentations pour étudier ces choix.

**L’AutoRL fondé sur une population** explore les configurations d’entraînement. Dans PBT, par exemple, plusieurs individus s’entraînent séparément. Des évaluations périodiques leur permettent d’hériter de l’état d’entraînement d’individus plus performants, puis de perturber les hyperparamètres pour poursuivre l’exploration. Ceux-ci peuvent donc évoluer pendant l’apprentissage.

Les algorithmes et variantes disponibles dépendent de l’implémentation actuelle du dépôt. [Liste des algorithmes](https://github.com/EMI-Group/evorl#algorithms)

## La modularité pour transformer les idées en expériences

Développer un algorithme hybride demande souvent beaucoup de travail d’adaptation des environnements, d’organisation des données, d’évaluation et de coordination des interfaces. EvoRL structure ces responsabilités avec quelques abstractions centrales :

- **Env** fournit une interface commune d’interaction avec les environnements.
- **Agent** définit le comportement de l’agent et la logique d’apprentissage associée.
- **SampleBatch** organise trajectoires et échantillons.
- **Workflow** définit les étapes d’entraînement de l’algorithme.
- **EC** fournit les algorithmes évolutionnaires et leurs opérateurs.

Vous pouvez ainsi modifier une partie précise de l’expérience : remplacer la recherche en conservant l’environnement et le réseau de politique, ou comparer l’apprentissage avant et après l’ajout d’opérations évolutionnaires. [Documentation du framework et de l’API](https://evorl.readthedocs.io/latest/)

Une implémentation commune facilite aussi le contrôle des variables. Aligner tâches, procédures d’évaluation et budgets de calcul aide à distinguer les progrès algorithmiques des différences d’implémentation. Le framework facilite ces comparaisons, mais la rigueur du protocole reste de la responsabilité des chercheurs.

## Que signifient les gains de performance ?

L’article EvoRL compare l’efficacité de calcul sur Swimmer de Brax, avec deux CPU Intel Xeon Gold 6132, 128 GiB de RAM et un GPU RTX 3090. Dans les configurations testées, OpenES atteint une accélération maximale supérieure à 60× par rapport à l’implémentation distribuée sur CPU de RLlib ; CEM-RL atteint environ 5–9× par rapport à son implémentation officielle.

Ces résultats concernent des tâches, tailles de population et références précises. Ils n’impliquent ni le même gain partout, ni une réduction équivalente du nombre d’échantillons nécessaire pour atteindre une récompense cible. [Protocole et résultats](https://arxiv.org/html/2501.15129v1#S5)

Pour planifier des expériences, un débit supérieur permet d’envisager davantage de graines aléatoires, des études d’ablation plus complètes ou des populations plus grandes. L’intérêt pratique est de pouvoir tester davantage d’idées avec le budget disponible.

## Du contrôle robotique à de nouvelles tâches de décision

EvoRL prend en charge Brax et MuJoCo Playground pour le contrôle continu, la recherche de politiques et l’entraînement de populations. Des intégrations expérimentales avec gymnax, Jumanji et JaxMARL couvrent le contrôle classique, les jeux, l’optimisation combinatoire et les systèmes multi-agents ; la compatibilité des algorithmes doit être vérifiée pour chaque configuration. Certains environnements CPU sont également pris en charge : un pipeline entièrement sur GPU dépend donc de la combinaison retenue. [Environnements pris en charge](https://github.com/EMI-Group/evorl#rl-environments)

Vous pouvez établir une référence avec les algorithmes existants avant de modifier la coopération entre recherche collective et apprentissage des politiques. Pour l’AutoRL, PBT constitue un point de départ pour étudier l’effet des configurations. Si vous développez une nouvelle méthode d’optimisation, les interfaces communes permettent d’intégrer progressivement vos composants.

## Lancer votre première expérience

Suivez d’abord le [guide d’installation](https://evorl.readthedocs.io/latest/guide/installation.html) pour adapter JAX à votre matériel. Installez ensuite EvoRL depuis les sources pour obtenir les scripts et configurations de l’exemple :

```bash
git clone https://github.com/EMI-Group/evorl.git
cd evorl
pip install -e .
```

Commencez par une référence PPO dans l’environnement Ant de Brax :

```bash
python scripts/train.py agent=ppo env=brax/ant
```

EvoRL utilise Hydra pour gérer les configurations. Une fois la référence fonctionnelle, faites varier les graines aléatoires, les configurations des algorithmes et les environnements avant de passer aux méthodes hybrides ou aux populations. Consultez le [démarrage rapide](https://evorl.readthedocs.io/latest/guide/quickstart.html).

EvoRL vise à rendre l’association de l’évolution et de l’apprentissage plus accessible : poser des questions, composer des méthodes, mener des expériences et confronter les idées aux résultats dans un même framework. Visitez le [dépôt GitHub](https://github.com/EMI-Group/evorl) pour essayer les algorithmes, proposer des implémentations ou partager vos recherches et expériences dans [Discussions](https://github.com/EMI-Group/evorl/discussions).
