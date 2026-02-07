---
title: "2. Installation et configuration de l'environnement"
order: 2
---

# 2. Installation et configuration de l'environnement

Avant d'utiliser EvoX, vous devez installer correctement le logiciel et ses dépendances. Ce chapitre couvre les étapes d'installation pour Windows et Linux, ainsi que la préparation et la configuration des dépendances requises. Assurez-vous de remplir les conditions système de base avant l'installation : **Python 3.10+**, un espace disque suffisant, et optionnellement un GPU supporté avec le pilote approprié.

## Dépendances et préparations

- **Environnement Python** : EvoX est construit sur Python, assurez-vous donc que Python 3.10 ou supérieur est installé. Il est recommandé d'utiliser un environnement virtuel (comme `venv`) pour éviter les conflits de dépendances.

- **PyTorch** : EvoX utilise PyTorch pour les opérations sur les tenseurs et l'accélération matérielle. Par conséquent, **PyTorch doit être installé avant d'installer EvoX**. Choisissez la version en fonction de votre matériel : installez la version CUDA si vous avez un GPU NVIDIA, la version ROCm pour les GPU AMD, ou la version CPU si aucun GPU n'est disponible. Consultez le [guide officiel PyTorch](https://pytorch.org) pour la commande appropriée, par exemple :

  ```bash
  # Pour les GPU NVIDIA (CUDA)
  pip install torch torchvision torchaudio

  # Pour les GPU AMD (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Pour CPU uniquement
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Il est recommandé de mettre à jour `pip` vers la dernière version et d'assurer une connexion internet stable avant l'installation (les paquets seront téléchargés depuis PyPI). Une fois l'environnement prêt, vous pouvez installer EvoX.

### Installation sur Windows

Les utilisateurs Windows peuvent choisir **l'installation automatique par script** ou **l'installation manuelle**. L'installateur officiel en un clic offre un moyen facile de configurer EvoX et ses dépendances dans un environnement propre, mais l'installation manuelle permet plus de contrôle.

**Option 1 : Utilisation du script d'installation en un clic (win-install.bat)**
EvoX fournit un [script d'installation rapide](/_static/win-install.bat) pour Windows 10/11 (64 bits). Le script installe Miniforge3 (un Conda léger), Python, PyTorch (avec CUDA), EvoX, et des outils utiles comme VSCode et Git. Pour l'utiliser :

1. Téléchargez `win-install.bat` depuis la documentation EvoX ou GitHub. Assurez-vous d'avoir un [pilote NVIDIA](https://www.nvidia.com/en-us/drivers/) installé et une connexion internet stable.
2. Exécutez le script. Il ne nécessite pas de privilèges administrateur, mais peut demander une autorisation pendant l'exécution — accordez-la. Le script installera et configurera tout automatiquement.
3. Attendez la fin. En cas de succès, vous verrez un message et possiblement VSCode s'ouvrir. EvoX et ses dépendances seront installés.

> **Note** : Si le script échoue en raison de problèmes réseau, fermez-le et relancez-le. Il prend en charge la reprise en cas d'échec.

**Option 2 : Installation manuelle**
Pour installer EvoX manuellement :

1. **Installer le pilote GPU** : Installez le dernier pilote NVIDIA depuis le [site officiel](https://www.nvidia.cn/Download/index.aspx). Si vous n'avez pas de GPU dédié, ignorez cette étape.

2. **Installer Python** : Téléchargez [Python 3.10+ pour Windows](https://www.python.org/downloads/windows/) et activez "Add Python to PATH" pendant l'installation.

3. **Installer PyTorch** : Ouvrez CMD ou PowerShell et installez PyTorch en fonction de votre matériel :

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Optionnel) Installer le compilateur Triton** : PyTorch sur Windows ne prend pas en charge Triton. Si vous souhaitez utiliser `torch.compile` (disponible dans PyTorch 2.0), installez le [triton-windows](https://github.com/woct0rdho/triton-windows) tiers. Optionnel mais utile pour l'optimisation des performances.

5. **Installer EvoX** :

   ```bash
   pip install "evox[default]"

   # Extras optionnels :
   pip install "evox[vis]"           # Support de visualisation
   pip install "evox[neuroevolution]" # Support de neuroévolution
   ```


  `> **Note :**
> Certains paquets peuvent nécessiter des dépendances système supplémentaires. Si c'est le cas, l'installateur vous affichera un message comme le suivant :console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Lorsque vous rencontrez de tels messages, suivez les instructions fournies pour installer les dépendances nécessaires avant de continuer.
  ````


### Installation sur Linux

L'installation d'EvoX sur Linux (par exemple Ubuntu) est simple et principalement gérée via `pip`.

1. **Installer les dépendances système** : Assurez-vous que les outils de développement de base et Python 3.10+ sont installés. Vous pouvez utiliser un gestionnaire de paquets (apt, yum) ou Anaconda.

2. **Installer le pilote GPU** (si vous utilisez un GPU) : Utilisez le gestionnaire de paquets approprié (par exemple `apt`) pour installer les pilotes NVIDIA. Vérifiez l'installation avec `nvidia-smi`. Ignorez si vous utilisez le CPU.

> **Note :**
> Sur WSL, **n'installez pas** les pilotes NVIDIA à l'intérieur du sous-système Linux — installez-les côté Windows.

> **Astuce :**
> Il est très probable que vous n'ayez besoin d'installer que le pilote, mais que vous n'ayez PAS besoin d'installer CUDA ou d'autres dépendances.
> Ces bibliothèques sont déjà incluses dans l'installation de PyTorch via pip.

> **Astuce :**
> La version du pilote requise dépend de votre matériel. Si vous avez un GPU NVIDIA récent, utiliser la dernière version du pilote est souvent le meilleur choix.
> Pour assurer une meilleure compatibilité et un accès aux derniers pilotes, il est généralement judicieux d'utiliser une distribution Linux plus récente (par exemple Ubuntu 25.04 au lieu de 22.04).

1. **Installer PyTorch** : Comme sur Windows, installez en fonction du matériel. Consultez le [guide officiel PyTorch](https://pytorch.org).

2. **Installer EvoX** :

   ```bash
   pip install evox
   ```

   Ou avec des extras :

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Cela installe les modules de visualisation et les dépendances de neuroévolution (comme Brax). Vous pouvez également choisir des extras individuels comme `vis` ou `neuroevolution`.

#### Installation par conteneur (Docker, Podman)

Pour les utilisateurs de GPU AMD ou ceux recherchant l'isolation de l'environnement, Docker est recommandé. Par exemple, en utilisant l'image Docker officielle PyTorch avec ROCm :

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

À l'intérieur du conteneur, installez EvoX comme d'habitude en utilisant `pip`.

## Vérification de l'installation d'EvoX

Pour vérifier qu'EvoX est correctement installé :

- **Vérification de base** : Dans le terminal ou le shell Python, exécutez :

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Cela affiche les informations de configuration de PyTorch et du système. Si EvoX est importé sans erreurs, l'installation a réussi. Vous pouvez également vérifier la version :

  ```python
  import evox
  print(evox.__version__)
  ```

- **Paramètres optionnels** : Vous pouvez ajuster les paramètres liés aux performances, tels que :

  - Définir des variables d'environnement comme `OMP_NUM_THREADS` pour contrôler le nombre de threads CPU
  - Augmenter la mémoire partagée Docker avec `--shm-size`
  - S'assurer que votre IDE (Jupyter, PyCharm, etc.) utilise le bon environnement Python

Une fois la configuration terminée, vous êtes prêt à commencer l'optimisation avec EvoX.
