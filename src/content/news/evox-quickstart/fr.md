---
title: "Débuter avec EvoX : votre premier workflow évolutionnaire"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "Réalisez une expérience complète avec EvoX 1.4.1 et découvrez comment problèmes, populations, évaluation et exécution forment un workflow réutilisable."
---

Ce tutoriel minimise la fonction Ackley en deux dimensions avec PSO, vérifie le matériel utilisé et trace l’historique. Il cible **EvoX 1.4.1 avec PyTorch**, et non l’API expérimentale 2.x. Cette petite tâche enseigne le workflow ; ce n’est pas un benchmark GPU.

![Des billes candidates sur un relief de recherche relié à des cadres de workflow](./first-search-workflow.webp)

## Préparer un environnement isolé

Utilisez Python 3.10 ou ultérieur. Créez un environnement virtuel, puis activez-le selon votre terminal.

```bash
python -m venv .venv
```

Sous macOS/Linux :

```bash
source .venv/bin/activate
```

Sous Windows PowerShell :

```powershell
.\.venv\Scripts\Activate.ps1
```

## Installer les paquets adaptés

Choisissez la commande PyTorch correspondant à votre système et matériel dans l’[installateur officiel](https://pytorch.org/get-started/locally/). CUDA exige un pilote compatible ; installer EvoX ne garantit pas un GPU utilisable. Installez ensuite la version fixée :

```bash
python -m pip install "evox[vis]==1.4.1"
```

## Exécuter une expérience complète

Enregistrez le code dans un script Python. Il choisit CUDA si disponible, sinon le CPU, affiche ce choix et conserve état et suivi sur ce périphérique. Une graine fixe aide à répéter l’expérience, sans garantir des résultats identiques entre matériels et versions.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## Comprendre et visualiser le résultat

PSO conserve les candidats, Ackley les évalue, StdWorkflow relie les composants et EvalMonitor suit la progression. Une valeur plus faible est meilleure ; l’optimum théorique est zéro à l’origine. Le résultat exact reste aléatoire.

Exécutez la commande suivante après la recherche, dans le même processus. Les dépendances de visualisation sont incluses. L’image provient du tutoriel initial ; ce n’est pas la sortie garantie de cette graine.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## Étendre l’expérience avec méthode

Changez une dimension à la fois : nombre de variables, taille de population ou graine. Un problème personnalisé doit renvoyer une valeur par candidat. Le multiobjectif exige aussi un algorithme, une forme de sortie et un moniteur adaptés.

Pour mesurer le temps, séparez compilation et échauffement de l’exécution stable, synchronisez CUDA et comparez les mêmes budgets d’évaluation. Une petite tâche peut être plus rapide sur CPU. Étudiez la compilation après avoir validé la référence.

## Ressources et remerciements

Le tutoriel original a été écrit par Boqing Xu, Xinmeng Yu, Bowen Zheng et Xinyao Li, puis édité et publié par Beichen Huang. Sa figure de présentation est conservée ci-dessous.

![EvoX overview](./quickstart-8.png)

Consultez le [code versionné](https://github.com/EMI-Group/evox/tree/v1.4.1) pour cet exemple et la [documentation](https://evox.readthedocs.io/en/latest/) pour la suite. Vérifiez la version avant de reprendre une API récente.

Avant d’étendre cet exemple, conservez ensemble versions des paquets, périphérique, graine et meilleure valeur d’adaptation. Modifiez un seul réglage et relancez avec le même budget. L’[explication d’EvoMO](/fr/news/gpu-accelerated-emo) présente les choix supplémentaires pour des objectifs concurrents.
