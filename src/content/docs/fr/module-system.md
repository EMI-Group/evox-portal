---
title: "Travailler avec les Modules dans EvoX"
order: 4
section: "developer"
---

# Travailler avec les Modules dans EvoX

Un **module** est un concept fondamental en programmation qui désigne une unité de code autonome conçue pour effectuer une tâche spécifique ou un ensemble de tâches connexes.

Ce notebook présentera le module de base dans EvoX : `ModuleBase`.

## Introduction aux Modules

Dans le [tutoriel](#/tutorial/index), nous avons mentionné le processus d'exécution de base dans EvoX :

<center><b>Initialiser un algorithme et un problème -- Définir un moniteur -- Initialiser un workflow -- Exécuter le workflow</b></center>

Ce processus nécessite quatre classes de base dans EvoX :

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


Il est nécessaire de fournir un module unifié pour elles. Dans EvoX, les quatre classes héritent toutes du module de base — `ModuleBase`.

![Base de module](/_static/modulebase.png)

## Classe ModuleBase

La classe `ModuleBase` hérite de [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Il existe de nombreuses méthodes dans cette classe, et voici quelques méthodes importantes :

| Méthode           | Signature                                                    | Usage                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Initialise le module.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copie les paramètres et les tampons de `state_dict` dans ce module et ses descendants. Elle remplace [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Définit une valeur mutable dans ce module qui peut être accédée via `self.[name]` et modifiée sur place (in-place). |

## Rôle du Module

Dans EvoX, le `ModuleBase` peut aider à :

- **Contenir des valeurs mutables**

​	Ce module est orienté objet et peut contenir des valeurs mutables.

- **Supporter la programmation fonctionnelle**

​	Le modèle de programmation fonctionnelle est supporté via `self.state_dict()` et `self.load_state_dict(...)`.

- **Standardiser l'initialisation** :

​	Fondamentalement, les sous-modules prédéfinis qui seront AJOUTÉS à ce module et accédés plus tard dans les méthodes membres doivent être traités comme des "membres non statiques", tandis que tous les autres membres doivent être traités comme des "membres statiques".

​	Il est recommandé d'écrire l'initialisation du module pour les membres non statiques dans la méthode surchargée `setup` (ou toute autre méthode membre) plutôt que dans `__init__`.

## Utilisation du Module

Plus précisément, il existe certaines règles pour utiliser `ModuleBase` dans EvoX :

### Méthodes statiques

Les méthodes statiques devant être compilées JIT doivent être définies comme suit :

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Méthodes non statiques

Si une méthode avec des flux de contrôle dynamiques Python comme `if` devait être utilisée avec `vmap`,
veuillez utiliser [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) pour définir explicitement le flux de contrôle.