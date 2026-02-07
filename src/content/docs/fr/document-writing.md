---
title: "Guide de rédaction de documentation"
order: 7
section: "developer"
---

# Guide de rédaction de documentation

Ce guide décrit les meilleures pratiques pour rédiger et maintenir la documentation dans le code source et les fichiers supplémentaires.

---

## Documentation dans le code (Docstrings)

Les docstrings sont essentielles pour comprendre l'objectif, l'utilisation et le comportement de votre code. Veuillez respecter les conventions suivantes :

### Règles générales

- Documentez **toutes les classes, méthodes et fonctions publiques** en utilisant des docstrings.
- Utilisez des docstrings de **style Sphinx**.
- **N'incluez pas** les types de paramètres dans la docstring -- ils doivent être déclarés dans la signature de la fonction en utilisant les annotations de type.

### Format et directives

Utilisez les directives suivantes pour décrire les différents éléments :

- `:param <name>:` -- Décrire un paramètre.
- `:return:` -- Décrire la valeur de retour.
- `:raises <exception>:` -- Décrire les exceptions que la fonction pourrait lever.

#### Exemple

```python
def add(a: int, b: int) -> int:
    """
    Add two integers.

    :param a: The first integer.
    :param b: The second integer.
    :return: The sum of the two integers.
    :raises ValueError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise ValueError("Inputs must be integers.")
    return a + b
```

---

## Documentation externe (répertoire `docs/`)

Toute la documentation au niveau du projet se trouve dans le répertoire `docs/`. Ces documents aident à la fois les utilisateurs et les développeurs en fournissant des guides, des exemples et des références.

### Format

- Utilisez **Markdown (`.md`)** ou **Jupyter Notebooks (`.ipynb`)** pour la documentation.
- Le Markdown est préféré pour le contenu narratif et la documentation statique.
- Utilisez les Jupyter Notebooks pour le contenu exécutable et interactif (par exemple, tutoriels ou démos).

### Directives pour les Jupyter Notebooks

- Assurez-vous que tous les notebooks sont **entièrement exécutables**.
- **Exécutez toujours toutes les cellules** et **sauvegardez la sortie** avant de commiter.
- Notre environnement CI/CD ne prend **pas en charge l'exécution GPU**, donc les notebooks doivent être pré-exécutés localement.

### Directives Markdown et Notebook

Utilisez les modèles suivants pour un formatage riche :

- `[name](#ref)` -- Référence croisée interne, par exemple `[ModuleBase](#evox.core.module.ModuleBase)` ou `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` -- Intégrer des images, par exemple `![Module base](/_static/modulebase.png)`

---

## Traduction

La documentation prend en charge le contenu multilingue. Suivez les étapes ci-dessous pour mettre à jour ou générer des traductions.

### Mise à jour des traductions (par exemple pour `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
