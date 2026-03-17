---
title: "Guide de rédaction de la documentation"
order: 7
section: "developer"
---

# Guide de rédaction de la documentation

Ce guide décrit les meilleures pratiques pour rédiger et maintenir la documentation dans la base de code et les fichiers supplémentaires.

---

## Documentation dans le code (Docstrings)

Les docstrings sont essentielles pour comprendre l'objectif, l'utilisation et le comportement de votre code. Veuillez respecter les conventions suivantes :

### Règles générales

- Documentez **toutes les classes, méthodes et fonctions publiques** à l'aide de docstrings.
- Utilisez des docstrings de style **Sphinx**.
- **N'incluez pas** les types de paramètres dans la docstring — ils doivent être déclarés dans la signature de la fonction à l'aide de type hints.

### Format et directives

Utilisez les directives suivantes pour décrire les différents éléments :

- `:param <name>:` — Décrit un paramètre.
- `:return:` — Décrit la valeur de retour.
- `:raises <exception>:` — Décrit les exceptions que la fonction pourrait lever.

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

## Documentation externe (Répertoire `docs/`)

Toute la documentation au niveau du projet se trouve dans le répertoire `docs/`. Ces documents aident à la fois les utilisateurs et les développeurs en fournissant des guides, des exemples et des références.

### Format

- Utilisez **Markdown (`.md`)** ou des **Jupyter Notebooks (`.ipynb`)** pour la documentation.
- Le Markdown est privilégié pour le contenu narratif et la documentation statique.
- Utilisez les Jupyter Notebooks pour le contenu exécutable et interactif (par exemple, des tutoriels ou des démos).

### Directives pour les Jupyter Notebooks

- Assurez-vous que tous les notebooks sont **entièrement exécutables**.
- **Exécutez toujours toutes les cellules** et **sauvegardez la sortie** avant de commiter.
- Notre environnement CI/CD ne **prend pas en charge l'exécution sur GPU**, les notebooks doivent donc être pré-exécutés localement.

### Directives Markdown & Notebook

Utilisez les modèles suivants pour un formatage riche :

- `[name](#ref)` — Référence croisée interne, par ex. `[ModuleBase](#evox.core.module.ModuleBase)` ou `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Intégrer des images, par ex. `![Module base](/_static/modulebase.png)`

---

## Traduction

La documentation prend en charge le contenu multilingue. Suivez les étapes ci-dessous pour mettre à jour ou générer des traductions.

### Mise à jour des traductions (par ex. pour `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```