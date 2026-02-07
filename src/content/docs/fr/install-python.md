---
title: "Guide d'installation de Python"
order: 1
section: "install"
---

# Guide d'installation de Python

Ce guide est destiné à ceux qui découvrent le langage de programmation Python et souhaitent l'installer sur leur système.
Il vous aidera à configurer l'environnement Python nécessaire pour exécuter EvoX.

> **Astuce :**
> EvoX est écrit en Python, vous devrez donc avoir Python installé sur votre système.
> EvoX supporte Python 3.10 et supérieur, et nous recommandons d'utiliser la **dernière version** de Python.

## Installer l'interpréteur Python

### Version Windows

Allez sur [Télécharger Python](https://www.python.org/downloads/) et téléchargez la dernière version de Python.

> **Note :**
> Assurez-vous de cocher la case "Add Python to PATH" pendant le processus d'installation.

### Version Linux

Différentes distributions Linux ont différentes façons d'installer Python.
Cela dépend du gestionnaire de paquets de votre distribution.
Voici quelques exemples :
- Debian/Ubuntu : `apt`
- Archlinux : `pacman`
- Fedora : `dnf`

### Installation via `uv`

`uv` est un gestionnaire de paquets et de projets Python extrêmement rapide, fonctionnant sur Windows, Linux et MacOS.
Nous recommandons d'utiliser `uv` pour installer l'interpréteur Python ainsi que pour gérer les environnements Python.
Le guide d'installation détaillé se trouve dans le [guide d'installation uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Utilisez `irm` pour télécharger le script et exécutez-le avec `iex` :

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```
Changer la [politique d'exécution](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permet d'exécuter un script depuis internet.

Demandez une version spécifique en l'incluant dans l'URL :

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux et MacOS
Utilisez `curl` pour télécharger le script et exécutez-le avec `sh` :

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Si votre système n'a pas `curl`, vous pouvez utiliser `wget` :

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Demandez une version spécifique en l'incluant dans l'URL :

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gestion des environnements Python

### Pip et Venv

`pip` est le gestionnaire de paquets pour Python. `venv` est l'outil intégré pour créer des environnements virtuels en Python.
Un environnement virtuel est un répertoire autonome qui contient une installation Python pour une version particulière de Python, plus plusieurs paquets supplémentaires.
Ceci est utile pour gérer les dépendances de différents projets séparément.

Pour créer un environnement virtuel, exécutez la commande suivante dans votre terminal :

```console
$ python -m venv <env_path> # habituellement <env_path> est un répertoire `.venv` dans votre projet
```
Cela créera un nouveau répertoire appelé `<env_path>` qui contient une copie de l'interpréteur Python et de la bibliothèque standard.
Pour activer l'environnement virtuel, exécutez la commande suivante :

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Cela changera l'invite de votre shell pour indiquer que vous travaillez maintenant dans l'environnement virtuel.
Pour désactiver l'environnement virtuel, exécutez la commande suivante :

```console
$ deactivate
```
Cela vous ramènera à l'interpréteur Python par défaut de votre système avec toutes ses bibliothèques installées.
Lorsque l'environnement virtuel est activé, vous pouvez utiliser `pip` pour installer des paquets dans l'environnement virtuel.
Par exemple, pour installer la dernière version de `numpy`, exécutez la commande suivante :

```console
$ pip install numpy
```
Cela installera `numpy` dans l'environnement virtuel, et cela n'affectera pas l'installation Python du système.
Pour installer une version spécifique de `numpy`, exécutez la commande suivante :

```console
$ pip install numpy==1.23.4
```
Cela installera la version `1.23.4` de `numpy` dans l'environnement virtuel.
Pour lister tous les paquets installés dans l'environnement virtuel, exécutez la commande suivante :

```console
$ pip list
```
Cela vous montrera une liste de tous les paquets installés dans l'environnement virtuel, avec leurs versions.
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
$ uv venv --python <python_version> # par exemple 3.10, 3.11, ...
```
Cela créera un nouveau répertoire appelé `.venv` qui contient une copie de l'interpréteur Python et de la bibliothèque standard.
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
