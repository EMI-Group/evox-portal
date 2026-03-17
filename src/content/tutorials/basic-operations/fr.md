---
title: "3. Opérations de Base"
order: 3
---

# 3. Opérations de Base

Dans ce chapitre, nous vous guiderons à travers l'exécution de votre première tâche d'optimisation avec EvoX, y compris comment **démarrer EvoX** et **initialiser le processus d'optimisation**, comment **configurer un projet EvoX** (sélectionner des algorithmes et des problèmes et les assembler), ainsi que les **commandes de base** (ou méthodes) couramment utilisées pour contrôler le processus d'optimisation. À travers un exemple simple, vous apprendrez l'utilisation de base d'EvoX.

## Démarrage et Initialisation

Après avoir vérifié l'installation, vous pouvez commencer à écrire des scripts d'optimisation en utilisant EvoX. Vous pouvez importer EvoX dans n'importe quel environnement Python (tel qu'un terminal, Jupyter Notebook, IDE, etc.).

Tout d'abord, importons EvoX et ses modules associés, et initialisons une tâche d'optimisation simple. Par exemple, nous utiliserons l'algorithme Particle Swarm Optimization (PSO) pour optimiser la fonction classique Ackley. La fonction Ackley est une fonction de référence courante avec un optimum global connu à \((0,0,\dots,0)\), ce qui la rend adaptée à la démonstration.
Voici un exemple de code minimal EvoX qui montre comment démarrer et exécuter l'optimisation :

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

Le code ci-dessus comprend les étapes suivantes :
- Tout d'abord, nous définissons les paramètres pour l'algorithme PSO : taille de la population de 50 et un espace de recherche en 2D allant de [-32, 32].
- Ensuite, nous définissons le problème Ackley (la fonction Ackley est définie en 2D par défaut).
- Nous créons un workflow standard `StdWorkflow` qui **assemble** l'algorithme et le problème, et passons un moniteur `EvalMonitor` pour enregistrer les données du processus d'optimisation.
- Ensuite, nous terminons le processus d'initialisation en utilisant `workflow.init_step()`, qui initialise automatiquement la population, la graine aléatoire et d'autres états internes.
- Puis, nous exécutons une boucle pour effectuer 100 itérations en continu à l'aide de `workflow.step()`. Chaque fois que `step()` est appelé, l'algorithme génère de nouvelles solutions et évalue leur fitness, se rapprochant continuellement de la solution optimale.
- Enfin, nous utilisons la méthode `get_min_fitness()` fournie par le moniteur pour obtenir la meilleure valeur de fitness durant le processus d'itération et l'affichons.

Lorsque vous exécutez ce script, vous verrez la sortie des itérations d'optimisation, par exemple :

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Comme nous n'avons pas explicitement affiché les résultats intermédiaires dans la boucle, ceux-ci ne seront pas affichés. Cependant, vous pouvez juger si l'algorithme a convergé en vous basant sur la valeur finale de fitness. Par exemple, la valeur optimale de la fonction Ackley est 0, et si la sortie est proche de 0, cela indique que PSO a trouvé une solution proche de l'optimum global. Vous pouvez également appeler `print(monitor.history)` pour voir les données historiques enregistrées par le moniteur ou utiliser `monitor.plot()` pour tracer les courbes de convergence (nécessite un support de visualisation comme Plotly).

> **Remarque :**
> `StdWorkflow` est une encapsulation de **processus d'optimisation standard** fournie par EvoX. Elle implémente en interne la logique "initialisation-mise à jour par itération" trouvée dans les algorithmes évolutionnaires traditionnels et encapsule l'interaction entre l'algorithme et le problème. Pour la plupart des applications simples, utiliser `StdWorkflow` directement suffira. Le `EvalMonitor` est un moniteur qui implémente des méthodes comme `get_best_fitness()` et `plot()` pour collecter et afficher les métriques de performance pendant le processus d'optimisation. Les débutants peuvent temporairement le voir comme un registre qui note les meilleurs résultats de chaque itération pour une analyse ultérieure.

Dans l'exemple ci-dessus, nous avons créé une configuration de base pour un projet EvoX, incluant la sélection d'un algorithme, la définition du problème et l'assemblage du workflow. Généralement, la configuration d'un projet EvoX implique les étapes suivantes :

1.  **Sélectionner/Définir un Problème d'Optimisation** : Clarifiez quel problème d'optimisation vous essayez de résoudre. Par exemple, si vous optimisez une fonction mathématique, EvoX fournit de nombreux **problèmes intégrés** sous le module `evox.problems` (par exemple, des fonctions classiques comme Sphere, Rastrigin, Ackley) que vous pouvez utiliser directement. Si votre problème n'est pas couvert par les options intégrées, vous pouvez définir le vôtre (couvert dans un chapitre ultérieur). Lors de la configuration d'un problème, vous devez généralement connaître la **dimension des variables de décision** et leur **plage de valeurs**.

2.  **Sélectionner/Configurer un Algorithme d'Optimisation** : Choisissez un algorithme évolutionnaire approprié en fonction du type de problème. EvoX fournit un ensemble riche d'algorithmes sous `evox.algorithms`, y compris des algorithmes mono-objectif (comme PSO, GA, CMA-ES) et multi-objectifs (comme NSGA-II, RVEA). Après avoir choisi l'algorithme, vous devrez généralement définir les paramètres de l'algorithme, tels que la taille de la population (`pop_size`) et les paramètres spécifiques à l'algorithme (comme la probabilité de croisement et la probabilité de mutation dans GA). La plupart des algorithmes nécessitent la **plage de variables** (limite inférieure `lb` et limite supérieure `ub`) et la dimension du problème pour initialiser la population. Si vous utilisez un algorithme multi-objectifs, vous devrez également spécifier le nombre d'objectifs (`n_objs`). Les algorithmes d'EvoX fournissent souvent des valeurs par défaut pour les hyperparamètres courants, mais les débutants devraient envisager d'ajuster ces paramètres en fonction de la tâche pour de meilleures performances.

3.  **Assembler le Workflow** : Une fois l'algorithme et l'instance du problème prêts, vous devez les "assembler" dans un workflow, qui représente le contrôle complet du processus d'optimisation. Dans EvoX, `StdWorkflow` est généralement utilisé pour combiner l'algorithme et le problème. Si vous souhaitez surveiller la progression de l'optimisation, vous pouvez ajouter un moniteur (comme `EvalMonitor`) au workflow. Un moniteur n'est pas obligatoire, mais il peut être très utile lors du débogage et de l'analyse. L'assemblage du workflow prend généralement une ligne de code, comme : `workflow = StdWorkflow(algo, prob, monitor)`.

4.  **Initialiser** : Appelez la méthode d'initialisation du workflow pour commencer l'optimisation. La dernière version d'EvoX fournit une méthode pratique `StdWorkflow.init_step()` qui complète le processus d'initialisation en un seul appel.

5.  **Exécuter les Itérations** : Utilisez une boucle pour appeler de manière répétée `workflow.step()` afin de faire avancer le processus évolutionnaire. Chaque appel effectue une itération, incluant des étapes comme "générer de nouvelles solutions -> évaluer -> sélectionner" à l'intérieur de l'algorithme. Pendant les itérations, vous pouvez utiliser un moniteur pour observer les résultats en temps réel, comme afficher la meilleure fitness actuelle toutes les quelques générations. Les critères d'arrêt peuvent être définis en fonction de vos besoins — les plus courants incluent un nombre fixe de générations (par exemple, exécuter pendant 100 générations), ou l'arrêt lorsque les métriques surveillées convergent (par exemple, aucune amélioration significative sur plusieurs générations).

6.  **Obtenir les Résultats** : Une fois les itérations terminées, vous devez extraire les résultats finaux de l'algorithme — tels que la meilleure solution et sa valeur objective. Dans EvoX, ceux-ci sont généralement obtenus via le moniteur. Par exemple, `EvalMonitor.get_best_fitness()` renvoie la meilleure valeur de fitness. Pour obtenir le meilleur vecteur de solution, une façon est de faire en sorte que l'objet problème stocke le meilleur candidat lors de l'évaluation, ou d'utiliser l'interface du moniteur. Dans l'implémentation standard d'EvoX, `EvalMonitor` enregistre le meilleur individu et la meilleure fitness à chaque génération, accessibles via ses propriétés. En supposant que `monitor.history` stocke l'historique, vous pouvez récupérer le meilleur individu de la dernière génération. Bien sûr, vous pouvez également ignorer `EvalMonitor` et interroger directement l'objet algorithme après la boucle — cela dépend de l'implémentation de l'algorithme. Si votre algorithme personnalisé implémente `get_best()` ou stocke le meilleur individu dans son état, vous pouvez l'extraire directement. Cependant, comme EvoX met l'accent sur les fonctions pures et la modularité, les résultats sont généralement accessibles via les modules de surveillance.

En suivant ces étapes, vous pouvez structurer clairement le code de votre tâche d'optimisation. Pour les débutants, il est important de comprendre comment le trio **algorithme-problème-workflow** fonctionne ensemble : l'algorithme gère la génération et l'amélioration des solutions, le problème évalue leur qualité, et le workflow les connecte dans une boucle itérative.

Ensuite, nous présenterons quelques commandes de base et appels de fonction disponibles dans EvoX pour vous aider à approfondir votre compréhension du processus d'optimisation.

## Aperçu des Commandes de Base

Lors de l'utilisation d'EvoX, il existe certaines **méthodes et fonctions couramment utilisées** qui agissent comme des "commandes" avec lesquelles vous voudrez vous familiariser :

### Méthodes Liées au Workflow

- **`StdWorkflow.init_step()`** : Initialisation. C'est une commande de démarrage rapide pour lancer le processus d'optimisation, souvent utilisée au début d'un script. Elle appelle la logique d'initialisation pour l'algorithme et le problème, génère la population initiale et évalue la fitness. Après cela, le workflow contient l'état initial et est prêt pour l'itération.

- **`StdWorkflow.step()`** : Avancer d'une étape dans l'optimisation. Chaque appel fait générer par l'algorithme de nouvelles solutions candidates basées sur l'état actuel de la population, les évaluer et sélectionner la génération suivante. Les utilisateurs appellent généralement cela plusieurs fois à l'intérieur d'une boucle. La fonction `step()` ne renvoie généralement rien (l'état interne est mis à jour au sein du workflow), bien que les anciennes versions puissent renvoyer un nouvel état. Pour les débutants, vous pouvez simplement l'appeler sans vous soucier de la valeur de retour.

### Méthodes Liées au Monitor

En utilisant `EvalMonitor` comme exemple, les méthodes courantes incluent :

- `EvalMonitor.get_best_fitness()` : Renvoie la fitness la plus basse enregistrée (pour les problèmes de minimisation) ou la plus élevée (pour les problèmes de maximisation ; le moniteur fait généralement la distinction). Utile pour connaître le meilleur résultat actuel.
- `EvalMonitor.get_history()` ou `monitor.history` : Récupère l'historique complet, tel que la meilleure valeur de chaque génération. Utile pour analyser les tendances de convergence.
- `EvalMonitor.plot()` : Trace des courbes de convergence ou de performance ; nécessite un environnement graphique ou un Notebook. Le moniteur utilise généralement Plotly pour rendre les graphiques, vous aidant à évaluer visuellement les performances de l'algorithme.
  En interne, le moniteur enregistre le nombre d'évaluations et leurs résultats à chaque génération — vous n'avez généralement pas besoin d'intervenir, il suffit d'extraire les données au besoin.

### Méthodes Liées à l'Algorithme

- Méthode `Algorithm.__init__()` : Méthode d'initialisation d'un algorithme. Les variables sont généralement enveloppées en utilisant `evox.core.Mutable()` et les hyperparamètres avec `evox.core.Parameter()`.

- Méthode `Algorithm.step()` : Dans des scénarios spécifiques ou lors de l'utilisation d'algorithmes/problèmes personnalisés, vous pourriez appeler directement la méthode `step()` de l'algorithme, qui encapsule généralement toute la logique d'itération de l'algorithme.

- Méthode `Algorithm.init_step()` : La méthode `init_step()` inclut la première itération de l'algorithme. Si elle n'est pas surchargée, elle appelle simplement la méthode `step()`. Pour les cas typiques, la première itération n'est pas différente des autres, donc de nombreux algorithmes peuvent ne pas avoir besoin d'un `init_step()` personnalisé. Mais pour les algorithmes impliquant un réglage d'hyperparamètres, vous devrez peut-être mettre à jour les hyperparamètres ou les variables associées ici.

### Contrôle du Périphérique et Parallélisme

- Méthode `.to(device)` : Si vous devez changer de périphérique de calcul dans votre programme, utilisez la méthode `.to(device)` de PyTorch pour déplacer les tenseurs (`torch.Tensor`) vers le GPU/CPU (certaines méthodes PyTorch comme `torch.randn` nécessitent également que le périphérique soit spécifié). Généralement, si vous définissez le périphérique en utilisant `torch.set_default_device()` sur `cuda:0` (en supposant que votre système le supporte et qu'EvoX et les dépendances sont installés correctement — vérifiez avec `torch.cuda.is_available()`), la plupart des calculs parallèles haute performance d'EvoX s'exécuteront automatiquement sur le GPU. Lors de l'écriture d'algorithmes, de problèmes ou de moniteurs personnalisés, si vous créez de nouveaux tenseurs ou utilisez des méthodes PyTorch sensibles au périphérique, il est recommandé de spécifier explicitement le `device` comme `cuda:0` ou d'utiliser `torch.get_default_device()` pour éviter les baisses de performance dues à des calculs répartis sur différents périphériques.

Pour les débutants, les méthodes ci-dessus sont suffisantes pour gérer les tâches d'optimisation typiques. En bref : **Initialiser problème/algorithme – configurer le moniteur – assembler le workflow – exécuter et récupérer les résultats** est le flux de travail EvoX le plus courant. Maîtriser cela vous permet d'aborder les tâches d'optimisation de base en utilisant EvoX.

Avant de passer au chapitre suivant, essayez de modifier l'exemple : passez de PSO à un autre algorithme, remplacez la fonction Ackley par une autre fonction de test, ou utilisez le moniteur pour extraire plus d'informations — cela vous aidera à apprécier la flexibilité de la configuration des projets EvoX.