---
title: "Workflow multi-GPU et distribué"
order: 8
section: "experimental"
---

# Workflow multi-GPU et distribué

EvoX prend en charge de manière expérimentale les workflows distribués, vous permettant d'exécuter n'importe quel algorithme évolutionnaire standard sur plusieurs GPU ou même plusieurs machines. Cela peut accélérer considérablement le processus d'optimisation, en particulier pour les problèmes coûteux en temps de calcul.

## Comment l'utiliser

Pour utiliser le workflow distribué, vous devez configurer quelques éléments :
1. Assurez-vous d'avoir fixé manuellement la graine (seed) du générateur de nombres aléatoires.
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **Important :**
> Assurez-vous de définir la graine pour tous les générateurs de nombres aléatoires **avant** toute opération torch ou numpy. Cela garantit que le générateur de nombres aléatoires est dans un état connu avant l'exécution de toute opération.
2. Utilisez la commande `torch.distributed` ou `torchrun` pour lancer votre script. Par exemple :
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Conseil :**
> `torchrun` est la méthode recommandée pour lancer des programmes torch distribués. Pour plus d'informations, consultez la [documentation PyTorch](https://pytorch.org/docs/stable/elastic/run.html).