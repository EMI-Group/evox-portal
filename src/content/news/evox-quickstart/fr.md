---
title: "Démarrage rapide avec EvoX : Exécutez le calcul évolutif accéléré par GPU en seulement 10 minutes"
pubDate: 2025-04-30
summary: "Un tutoriel pour débutants pour commencer avec le calcul évolutif accéléré par GPU en utilisant EvoX en seulement 10 minutes."
---

D'une part, le calcul évolutif (Evolutionary Computation) est extrêmement puissant pour la recherche et l'ingénierie dans le monde réel, mais difficile à invoquer. D'autre part, les capacités des GPU deviennent de plus en plus puissantes, mais il est difficile pour eux d'exercer leur puissance dans les tâches de calcul évolutif.

Nous avons besoin d'une solution véritablement moderne : support GPU natif, architecture modulaire, interfaces claires, utilisabilité immédiate et évolutivité personnalisable. C'est EvoX - un moteur de calcul évolutif pour l'avenir.

Pour aider les utilisateurs à démarrer rapidement, l'équipe EvoX a publié le « Tutoriel EvoX pour débutants ». Le tutoriel se compose de 8 chapitres, couvrant tout, des bases aux applications pratiques avancées, vous guidant étape par étape sur la façon d'exécuter des algorithmes évolutifs sur un GPU.

## Ressources complètes du tutoriel

Tutoriel en ligne en chinois :

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutoriel PDF en chinois :

Veuillez rejoindre le groupe QQ pour l'obtenir : 297969717

Ensuite, nous vous guiderons à travers l'ensemble du processus, de l'installation à l'opération, en seulement 10 minutes.

## Étape 1 : Configuration de l'environnement

Ouvrez votre terminal et créez un environnement Python propre :

```bash
python -m venv .venv
source .venv/bin/activate
```

Vous pouvez également utiliser votre outil préféré pour créer un environnement Python propre.

## Étape 2 : Installer PyTorch et EvoX

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
pip install "evox[vis]"
```

Vérifiez si le GPU est disponible :

```python
import torch
print(torch.cuda.is_available())
```

## Étape 3 : Exécutez votre premier algorithme évolutif

```python
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
import torch

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2),
    ub=32 * torch.ones(2),
)
problem = Ackley()
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Best fitness:", float(monitor.get_best_fitness()))
```

Que fait ceci ? Il compose un algorithme (PSO), un problème (Ackley) et un moniteur (EvalMonitor) via une interface standard. EvoX s'occupe de tout le parallélisme, de l'accélération et du monitoring !

## Étape 4 : Tracer la courbe de convergence

Une seule ligne suffit :

```python
monitor.plot()
```

![monitor_output.png](./quickstart-7.png)

Voyez-vous cette courbe descendante ? C'est la **trajectoire par laquelle votre algorithme évolutif s'approche de la cible**, et **le chemin qu'il emprunte pour explorer le monde inconnu.**

## Étape 5 : Essayez d'étendre

Si « juste exécuter un Ackley » ne vous satisfait pas, vous pouvez :

- Remplacer PSO par GA, DE, CMA-ES, NSGA-II, RVEA...
 · Remplacer Ackley par Rastrigin, Griewank, CEC2022
 · Passer à un problème multi-objectifs en définissant n_objs >= 2
 · Implémenter votre propre logique avec MyProblem et MyAlgorithm
 · Se connecter aux modèles PyTorch ou aux environnements d'apprentissage par renforcement (Gym, Brax, MuJoCo Playground)

Qu'il s'agisse de réglage d'hyperparamètres, de recherche d'architecture, de neuroévolution ou d'optimisation de stratégie de contrôle, EvoX gère tout cela avec facilité.

## Pourquoi choisir EvoX ?

![表格-英文.png](./quickstart-8.png "表格-英文.png")

## Remerciements

Ce tutoriel a été écrit par **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** et **Xinyao Li**. **Beichen Huang** était responsable de la compilation, de l'édition et de la mise en ligne du tutoriel.

Nous remercions sincèrement chaque membre de la communauté EvoX. Ce sont nos efforts conjoints qui ont permis à EvoX de continuer à évoluer.

## Ressources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
