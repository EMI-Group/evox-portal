---
title: "Guide d'installation de Python"
order: 1
section: "install"
---

# Guide d'installation de Python

Ce guide est destiné aux personnes qui débutent avec le langage de programmation Python et souhaitent l'installer sur leur système.
Il vous aidera à configurer l'environnement Python nécessaire pour exécuter EvoX.

> **Conseil :**
> EvoX est écrit en Python, vous devrez donc avoir Python installé sur votre système.
> EvoX prend en charge Python 3.10 et versions ultérieures, et nous recommandons d'utiliser la **dernière version** de Python.

## Installer l'interpréteur Python

### Version Windows

Allez sur [Télécharger Python](https://www.python.org/downloads/) et téléchargez la dernière version de Python.

> **Remarque :**
> Assurez-vous de cocher la case indiquant « Add Python to PATH » (Ajouter Python au PATH) pendant le processus d'installation.

### Version Linux

Les différentes distributions Linux ont des manières différentes d'installer Python.
Cela dépend du gestionnaire de paquets de votre distribution.
Voici quelques exemples :
- Debian/Ubuntu : `apt`
- Archlinux : `pacman`
- Fedora : `dnf`

### Installer via `uv`

`uv` est un gestionnaire de paquets et de projets Python extrêmement rapide, fonctionnant sous Windows, Linux et MacOS.
Nous recommandons d'utiliser `uv` pour installer l'interpréteur Python ainsi que pour gérer les environnements Python.
Le guide d'installation détaillé se trouve dans le [guide d'installation de uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Utilisez `irm` pour télécharger le script et exécutez-le avec `iex` :

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Modifier la [politique d'exécution](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permet d'exécuter un script provenant d'Internet.

Demandez une version spécifique en l'incluant dans l'URL :

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux et MacOS
Utilisez `curl` pour télécharger le script et exécutez-le avec `sh` :

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Si votre système ne dispose pas de `curl`, vous pouvez utiliser `wget` :

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Demandez une version spécifique en l'incluant dans l'URL :

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gérer les environnements Python

### Pip et Venv

`pip` est le gestionnaire de paquets pour Python. `venv` est l'outil intégré pour créer des environnements virtuels en Python.
Un environnement virtuel est un répertoire autonome qui contient une installation de Python pour une version particulière de Python, ainsi que plusieurs paquets supplémentaires.
Ceci est utile pour gérer séparément les dépendances de différents projets.

Pour créer un environnement virtuel, exécutez la commande suivante dans votre terminal :

```console
$ python -m venv <env_path> # généralement <env_path> est un répertoire `.venv` dans votre projet
```
Cela créera un nouveau répertoire appelé `<env_path>` contenant une copie de l'interpréteur Python et de la bibliothèque standard.
Pour activer l'environnement virtuel, exécutez la commande suivante :

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Cela modifiera l'invite de votre shell pour indiquer que vous travaillez maintenant à l'intérieur de l'environnement virtuel.
Pour désactiver l'environnement virtuel, exécutez la commande suivante :

```console
$ deactivate
```
Cela vous ramènera à l'interpréteur Python par défaut de votre système avec toutes ses bibliothèques installées.

Tant que l'environnement virtuel est activé, vous pouvez utiliser `pip` pour installer des paquets dans l'environnement virtuel.
Par exemple, pour installer la dernière version de `numpy`, exécutez la commande suivante :

```console
$ pip install numpy
```
Cela installera `numpy` dans l'environnement virtuel, et cela n'affectera pas l'installation de Python à l'échelle du système.
Pour installer une version spécifique de `numpy`, exécutez la commande suivante :

```console
$ pip install numpy==1.23.4
```
Cela installera la version `1.23.4` de `numpy` dans l'environnement virtuel.
Pour lister tous les paquets installés dans l'environnement virtuel, exécutez la commande suivante :

```console
$ pip list
```
Cela vous affichera une liste de tous les paquets installés dans l'environnement virtuel, ainsi que leurs versions.
Pour désinstaller un paquet, exécutez la commande suivante :

```console
$ pip uninstall numpy
```
Cela désinstallera `numpy` de l'environnement virtuel.
Pour mettre à jour un paquet, exécutez la commande suivante :

```console
$ pip install --upgrade numpy
```
Cela mettra à jour `numpy` vers la dernière version dans l'environnement virtuel.

### uv

`uv` peut non seulement gérer les versions de Python, mais aussi gérer les environnements Python.
Pour créer un nouvel environnement Python, exécutez la commande suivante :

```console
$ uv venv --python <python_version> # par ex. 3.10, 3.11, ...
```
Cela créera un nouveau répertoire appelé `.venv` contenant une copie de l'interpréteur Python et de la bibliothèque standard.
Pour activer l'environnement virtuel, exécutez la commande suivante :

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Après avoir activé l'environnement virtuel, vous pouvez utiliser `uv pip` pour installer des paquets dans l'environnement virtuel.
Par exemple, pour installer la dernière version de `numpy`, exécutez la commande suivante :

```console
$ uv pip install numpy
```