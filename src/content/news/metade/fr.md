---
title: "MetaDE : Faire évoluer l'Évolution Différentielle par l'Évolution Différentielle"
pubDate: 2025-02-15
summary: "MetaDE est une méthode méta-évolutionnaire qui utilise l'Évolution Différentielle pour faire évoluer ses propres hyperparamètres et stratégies, publiée dans IEEE TEVC."
---

L'Évolution Différentielle (DE), l'un des algorithmes fondamentaux du calcul évolutionnaire, a été largement utilisée dans les problèmes d'optimisation boîte noire en raison de sa simplicité et de sa grande efficacité. Néanmoins, ses performances dépendent fortement de la sélection des hyperparamètres et des stratégies, un problème persistant pour les chercheurs. Pour relever ce défi, l'équipe EvoX a récemment publié une étude dans *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* intitulée "MetaDE: Evolving Differential Evolution by Differential Evolution". En tant que méthode méta-évolutionnaire exploitant DE pour faire évoluer ses propres hyperparamètres et stratégies, MetaDE permet l'ajustement dynamique des paramètres et des stratégies tout en intégrant le calcul parallèle accéléré par GPU. Cette conception améliore considérablement l'efficacité de calcul ainsi que les performances d'optimisation. Les résultats expérimentaux démontrent que MetaDE offre des performances exceptionnelles tant sur la suite de benchmarks CEC2022 que sur les tâches de contrôle de robots. Le code source de MetaDE est disponible en open source sur GitHub à l'adresse [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Contexte**

Dans le domaine du Calcul Évolutionnaire, la performance des algorithmes est souvent influencée de manière significative par le choix des hyperparamètres. Déterminer les réglages de paramètres les plus appropriés pour un problème spécifique est un défi de recherche de longue date. L'Évolution Différentielle (DE), en tant qu'algorithme évolutionnaire classique, est largement appréciée pour sa simplicité et sa capacité de recherche globale robuste ; néanmoins, sa performance est très sensible à la sélection des hyperparamètres. Les méthodes conventionnelles reposent généralement soit sur un réglage basé sur l'expérience, soit sur des mécanismes adaptatifs pour améliorer les performances. Cependant, face à divers scénarios de problèmes, ces approches peinent souvent à équilibrer efficacité et applicabilité générale.

Le concept de "Méta-Évolution" a été introduit dès le siècle dernier, visant à utiliser les algorithmes évolutionnaires eux-mêmes pour optimiser les configurations d'hyperparamètres de ces algorithmes. Bien que la méta-évolution existe depuis de nombreuses années, son application pratique a été limitée par les exigences élevées en matière de calcul. Les progrès récents du calcul GPU ont allégé ces contraintes, fournissant un support matériel solide pour les algorithmes évolutionnaires. En particulier, l'introduction du framework EvoX distribué et accéléré par GPU a grandement facilité le développement d'algorithmes évolutionnaires basés sur GPU. Dans ce contexte, notre équipe de recherche a proposé une nouvelle approche de méta-évolution qui exploite DE pour faire évoluer ses propres hyperparamètres et stratégies, offrant ainsi une nouvelle voie pour résoudre le problème de longue date du réglage des paramètres dans les algorithmes évolutionnaires.

**Qu'est-ce que la Méta-Évolution ?**

L'idée centrale derrière la méta-évolution peut être résumée comme "**utiliser un algorithme évolutionnaire pour se faire évoluer lui-même**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Ce concept transcende les méthodes traditionnelles de calcul évolutionnaire en employant non seulement des algorithmes évolutionnaires pour rechercher des solutions optimales à un problème, mais aussi en adaptant les hyperparamètres et les stratégies des algorithmes à travers leurs propres processus évolutionnaires.

En d'autres termes, la méta-évolution introduit un paradigme d'**"auto-évolution"**, permettant aux algorithmes de s'optimiser eux-mêmes tout en explorant l'espace de recherche pour trouver des solutions aux problèmes. En s'affinant continuellement au cours du processus évolutionnaire, les algorithmes deviennent plus adaptatifs et peuvent maintenir une efficacité élevée dans divers scénarios de problèmes.

En prenant MetaDE comme exemple, sa conception est ancrée dans cette philosophie. Dans une structure à deux couches, la couche inférieure (l'**"exécuteur"**) résout le problème d'optimisation donné en utilisant un DE paramétré. La couche supérieure (l'**"évolueur"**) emploie simultanément DE pour optimiser les configurations d'hyperparamètres de l'exécuteur. Ce cadre permet à DE non seulement de servir de résolveur, mais aussi d'"explorer" la meilleure façon d'ajuster ses propres paramètres et stratégies pour résoudre plus efficacement différents problèmes. Un tel processus s'apparente à un système qui se comprend et s'affine progressivement — une transformation de **"résoudre passivement un problème" à "s'auto-évoluer activement".** Par conséquent, il peut mieux s'adapter à diverses tâches. **Si nous considérons DE comme un système complexe, MetaDE permet effectivement une manière "récursive" d'auto-compréhension et d'auto-amélioration au sein de ce système.**

Le terme **"récursion"** en informatique décrit généralement une fonction ou une procédure qui s'appelle elle-même. Au sein de MetaDE, ce concept prend un nouveau sens : c'est un mécanisme d'optimisation **récursif en interne** qui emploie DE pour faire évoluer les hyperparamètres de DE. Ce schéma auto-référentiel incarne non seulement une puissante adaptabilité, mais offre également une nouvelle perspective sur le théorème du "no free lunch". Comme il n'existe pas un ensemble unique et universellement optimal de paramètres pour tous les problèmes, permettre à l'algorithme d'évoluer de manière autonome est la clé pour trouver les meilleures configurations de paramètres pour une tâche donnée.

Grâce à cette approche méta-évolutionnaire récursive, MetaDE obtient plusieurs avantages :

**1. Réglage Automatisé des Paramètres**

     Le processus laborieux de réglage manuel est éliminé. L'algorithme apprend lui-même comment ajuster ses hyperparamètres, réduisant l'intervention humaine et améliorant l'efficacité.

**2. Adaptabilité Améliorée**

     MetaDE réagit dynamiquement aux caractéristiques et conditions changeantes du problème, modifiant les stratégies en temps réel pour améliorer les performances. Cela augmente considérablement la flexibilité de l'algorithme.

**3. Recherche Efficace**
      En tirant parti du parallélisme inhérent, MetaDE accélère grandement les recherches dans les problèmes d'optimisation à grande échelle. Il fournit des solutions réalisables à des problèmes complexes et de haute dimension dans des délais raisonnables.

**Implémentation Algorithmique**

MetaDE utilise des techniques basées sur les tenseurs et l'accélération GPU pour permettre un calcul parallèle efficace. En traitant simultanément de nombreux individus d'une population, l'efficacité globale du calcul est nettement améliorée, ce qui le rend particulièrement avantageux dans l'optimisation boîte noire mono-objectif et les problèmes d'optimisation à grande échelle. Grâce à la tensorisation des paramètres clés et des structures de données (par exemple, population, fitness, paramètres de stratégie), MetaDE atteint non seulement une efficacité de calcul plus élevée, mais améliore également sa capacité à relever des défis d'optimisation complexes. Comparé au DE classique et à d'autres algorithmes évolutionnaires (EAs), MetaDE montre des performances supérieures dans la résolution de problèmes à grande échelle. Grâce à l'approche basée sur les tenseurs, MetaDE exploite les ressources de calcul plus efficacement, produisant des solutions plus rapides et des résultats d'optimisation plus précis que les méthodes traditionnelles.

![1.png](/images/articles/metade-4.png "1.png")

Architecture PDE

L'équipe de recherche a d'abord proposé un cadre d'algorithme DE paramétré (PDE) qui prend entièrement en charge les modifications des paramètres et des stratégies. Dans ce cadre, F et CR sont des paramètres continus, tandis que les autres paramètres sont discrets. Les boîtes en pointillés indiquent la plage de valeurs de paramètres autorisées. La fonction de mutation est dérivée des vecteurs de base gauche et droit, ainsi que du paramètre contrôlant le nombre de vecteurs de différence.

![2.png](/images/articles/metade-5.png "2.png")

Architecture MetaDE

MetaDE adopte une structure à deux couches, comprenant **un évolueur** (couche supérieure) et **plusieurs exécuteurs** (couche inférieure). L'évolueur est un DE (ou potentiellement un autre algorithme évolutionnaire), responsable de l'optimisation des paramètres du PDE. Chaque individu ![spacer.gif](/images/articles/metade-6.gif) x_i dans la population de l'évolueur correspond à une configuration de paramètres unique θ_i. Ces configurations sont transmises au PDE pour instancier différentes variantes de DE, chacune gérée par un exécuteur qui s'exécute indépendamment sur la tâche d'optimisation donnée. Chaque exécuteur renvoie sa meilleure valeur de fitness y^* à l'évolueur, qui attribue cette valeur de fitness y_i à l'individu correspondant x_i.

**Performance Expérimentale**

Pour évaluer de manière exhaustive l'efficacité de MetaDE, l'équipe de recherche a effectué des expériences systématiques couvrant plusieurs tests de benchmark et des scénarios du monde réel. Chaque expérience a utilisé un évolueur (DE avec la stratégie rand/1/bin) et des exécuteurs (PDE avec une taille de population de 100). Les composants clés de l'expérience comprennent :

**Benchmark CEC2022**
 Comparaison de MetaDE à diverses variantes de DE dans des tâches d'optimisation mono-objectif.

**Comparaison avec les Quatre Meilleurs Algorithmes CEC2022**
 Évaluation de MetaDE par rapport aux quatre algorithmes les plus performants de la compétition CEC2022 sous des budgets identiques d'évaluations de fonction (FEs).

**Évaluations de Fonction (FEs) sous Temps Réel Fixe**
 Analyse de l'efficacité de calcul de MetaDE sous accélération GPU.

**Tâches de Contrôle de Robots**
 Application de MetaDE à des tâches de contrôle de robots dans un environnement de plateforme Brax pour valider son utilité pratique.

**Benchmark CEC2022 : Comparaison avec les Variantes DE Courantes**

L'équipe a comparé MetaDE à plusieurs variantes représentatives de DE sur la suite de benchmarks CEC2022, notamment :

* **DE Standard (rand/1/bin)**
* **SaDE et JaDE (algorithmes DE adaptatifs)**
* **CoDE (DE avec intégration de stratégies)**
* **SHADE et LSHADE-RSP (DE adaptatif basé sur l'historique de succès)**
* **EDEV (variantes DE intégrées)**

Tous les algorithmes ont été implémentés sur la plateforme EvoX, utilisant l'accélération GPU avec une taille de population de 100 pour l'équité. Les expériences ont été menées sur différentes dimensionnalités (10D et 20D) sous **la même contrainte de temps de calcul (60 secondes)**.

![3.png](/images/articles/metade-7.png "3.png")

Résultats d'Optimisation CEC2022 10D

![4.png](/images/articles/metade-8.png "4.png")

Résultats d'Optimisation CEC2022 20D

MetaDE atteint généralement une convergence plus rapide et plus stable sur la plupart des fonctions de test. Son DE paramétré (PDE) couplé à l'optimisation de la couche supérieure permet une adaptation dynamique aux différents espaces de problèmes, améliorant la robustesse globale et les performances de recherche.

**Comparaison avec les Quatre Meilleurs Algorithmes CEC2022 (Sous FEs Identiques)**

Pour évaluer davantage la capacité d'optimisation de MetaDE, nous l'avons comparé aux quatre meilleurs algorithmes de la compétition CEC2022 avec **le même budget d'évaluation de fonction** :

* **EA4eig** : Une méthode hybride intégrant plusieurs EAs
* **NL-SHADE-LBC** : Un DE adaptatif amélioré
* **NL-SHADE-RSP-MID** : Un SHADE amélioré avec estimation du point médian
* **S-LSHADE-DP** : Une variante de DE maintenant la diversité de la population par perturbation dynamique

Chacun de ces algorithmes a été exécuté avec ses paramètres officiels et son code source sous **les mêmes contraintes de FE**. Des comparaisons statistiques (test de la somme des rangs de Wilcoxon, niveau de significativité de 0,05)

ont été menées entre MetaDE et chaque référence sur la suite de tests CEC2022. La dernière ligne du tableau montre la performance de chaque algorithme comparée à MetaDE sur les différentes fonctions de test : + (significativement meilleur), ≈ (pas de différence significative), et − (significativement pire).

![5.png](/images/articles/metade-9.png "5.png")

Comparaison des Algorithmes de Compétition CEC2022 10D (Mêmes FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparaison des Algorithmes de Compétition CEC2022 20D (Mêmes FEs)

MetaDE démontre constamment de solides performances, en particulier sur des problèmes complexes nécessitant une convergence robuste. Grâce à son **mécanisme auto-adaptatif**, MetaDE ajuste efficacement sa stratégie pour différents paysages de recherche, améliorant ainsi l'efficacité de la recherche et la capacité d'optimisation globale. Ces résultats indiquent que MetaDE surpasse non seulement les variantes DE courantes, mais présente également une forte compétitivité face aux algorithmes de compétition de haut niveau.

**Efficacité de Calcul : FEs dans un Temps Fixe (60 secondes)**

L'équipe de recherche a également enregistré **le nombre d'évaluations de fonction (FEs) complétées par différents algorithmes dans le même temps d'exécution fixe (60 secondes)**.

![图片2.png](/images/articles/metade-11.png)

           FEs Atteintes par Chaque Algorithme en 60 Secondes

Sous le même framework EvoX avec calcul parallèle accéléré par GPU, MetaDE a atteint en moyenne des FEs de l'ordre de **10****⁹**, tandis que les variantes DE traditionnelles n'atteignaient qu'environ ***10^6*** FEs. Cet avantage découle de l'approche paramétrée de MetaDE, qui effectue des **évaluations parallèles à grande échelle** des individus, permettant une **utilisation plus efficace des ressources matérielles.** Par conséquent, l'algorithme explore plus de solutions dans la même fenêtre de temps, améliorant à la fois la qualité et la stabilité de la solution.

**Apprentissage par Renforcement Évolutionnaire : Tâches de Contrôle de Robots**

Dans l'Apprentissage par Renforcement (RL), l'efficacité et la stabilité de l'optimisation de la politique sont cruciales. Les méthodes basées sur le gradient telles que PPO et SAC peuvent souffrir de la disparition ou de l'explosion du gradient dans des environnements à haute dimension. En revanche, l'Apprentissage par Renforcement Évolutionnaire (EvoRL) contourne ces problèmes en utilisant des **recherches sans gradient** pour optimiser directement les paramètres de la politique.

![8.png](/images/articles/metade-12.png "8.png")

Processus d'Apprentissage par Renforcement Évolutionnaire

Au sein du framework EvoRL, MetaDE :

* **Optimise automatiquement les paramètres du réseau de neurones**, augmentant l'adaptabilité des modèles de politique.
* **Ajuste dynamiquement les hyperparamètres**, améliorant la stabilité de l'entraînement.
* **Exploite l'accélération GPU** pour accélérer l'optimisation de la politique.

Pour évaluer les performances de MetaDE sur des tâches d'optimisation complexes, nous l'avons appliqué à des **problèmes de contrôle de robots** en utilisant l'optimisation accélérée par GPU dans la **plateforme de simulation Brax**. L'étude comprenait trois tâches — **Swimmer**, **Hopper** et **Reacher** — chacune modélisée par un réseau de neurones entièrement connecté (MLP) à trois couches avec pour objectif de **maximiser la récompense**. Notamment, chaque MLP contient environ **1 500 paramètres**, créant un **défi d'optimisation à 1 500 dimensions** pour les algorithmes évolutionnaires (EAs). Cela impose des exigences strictes tant sur la capacité de recherche que sur l'efficacité de calcul.

![9.png](/images/articles/metade-13.png "9.png")

Courbes de Convergence pour Trois Environnements Brax

Comme le montre la figure, MetaDE démontre de solides performances dans les tâches de contrôle de robots basées sur Brax, obtenant les meilleurs résultats sur la tâche Swimmer et des résultats quasi optimaux sur Hopper et Reacher. Son principal avantage réside dans la haute qualité de la population initiale, permettant une convergence rapide au stade précoce et produisant des solutions de haute qualité. Ces résultats suggèrent que MetaDE peut **optimiser efficacement les politiques de réseaux de neurones**, ce qui le rend **bien adapté aux tâches de contrôle de robots avec des simulations physiques complexes** et **offre un large potentiel pour des applications pratiques**.

**Conclusion et Directions Futures**

MetaDE est une approche de méta-évolution innovante qui excelle non seulement dans la résolution de tâches d'optimisation, mais qui règle et affine également de manière autonome ses propres stratégies. En capitalisant sur les forces de l'Évolution Différentielle, MetaDE présente un fort potentiel dans la configuration adaptative des paramètres et l'évolution des stratégies. Les résultats expérimentaux montrent une robustesse supérieure dans une gamme de tests de benchmark, et son applicabilité dans le monde réel est soulignée par le succès dans les tâches de contrôle de robots via l'apprentissage par renforcement évolutionnaire. Un défi central consiste à maintenir un équilibre optimal entre généralisation et spécialisation — s'assurer que l'algorithme peut s'adapter à diverses tâches tout en optimisant efficacement pour des problèmes spécifiques. Cette recherche offre de nouvelles perspectives pour les algorithmes évolutionnaires auto-adaptatifs et pourrait stimuler de nouvelles avancées dans la méta-évolution pour les systèmes complexes.

**Code Open Source et Communauté**

**Article** : [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub** : [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projet Amont (EvoX)** : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Groupe QQ** : 297969717

![image.png](/images/articles/metade-3.png "image.png")

  Groupe QQ | Evolving Machine Intelligence

MetaDE est construit sur le framework EvoX. Si vous êtes intéressé par EvoX, veuillez consulter l'article sur EvoX 1.0 pour plus de détails.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")