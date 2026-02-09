---
title: "2. Installation et configuration de l'environnement"
order: 2
---

# 2. Installation et configuration de l'environnement

Avant d'utiliser EvoX, vous devez installer correctement le logiciel et ses dépendances. Ce chapitre couvre les étapes d'installation pour Windows et Linux, ainsi que la manière de préparer et de configurer les dépendances requises. Assurez-vous de respecter la configuration système de base avant l'installation : **Python 3.10+**, un espace disque suffisant et éventuellement un GPU pris en charge avec le pilote approprié.

## Dépendances et préparatifs

- **Environnement Python** : EvoX est construit sur Python, assurez-vous donc que Python 3.10 ou une version supérieure est installée. Il est recommandé d'utiliser un environnement virtuel (tel que `venv`) pour éviter les conflits de dépendances.

- **PyTorch** : EvoX utilise PyTorch pour les opérations tensorielles et l'accélération matérielle. Par conséquent, **PyTorch doit être installé avant d'installer EvoX**. Choisissez la version en fonction de votre matériel : installez la version CUDA si vous avez un GPU NVIDIA, la version ROCm pour les GPU AMD, ou la version CPU si aucun GPU n'est disponible. Référez-vous au [guide officiel de PyTorch](https://pytorch.org) pour la commande appropriée, par exemple :

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Il est recommandé de mettre à jour `pip` vers la dernière version et de s'assurer d'une connexion Internet stable avant l'installation (les paquets seront téléchargés depuis PyPI). Une fois l'environnement prêt, vous pouvez installer EvoX.

### Installation sur Windows

Les utilisateurs de Windows peuvent choisir entre l'**installation automatique par script** ou l'**installation manuelle**. L'installateur officiel en un clic offre un moyen simple de configurer EvoX et ses dépendances dans un environnement propre, mais l'installation manuelle permet plus de contrôle.

**Option 1 : Utilisation du script d'installation en un clic (win-install.bat)**
EvoX fournit un [script d'installation rapide](/_static/win-install.bat) pour Windows 10/11 (64-bit). Le script installe Miniforge3 (un Conda léger), Python, PyTorch (avec CUDA), EvoX et des outils utiles comme VSCode et Git. Pour l'utiliser :

1. Téléchargez `win-install.bat` depuis la documentation EvoX ou GitHub. Assurez-vous d'avoir un [pilote NVIDIA](https://www.nvidia.com/en-us/drivers/) installé et une connexion Internet stable.
2. Exécutez le script. Il ne nécessite pas de privilèges d'administrateur, mais peut demander une permission lors de l'exécution — autorisez-la. Le script installera et configurera tout automatiquement.
3. Attendez la fin de l'opération. En cas de succès, vous verrez un message et éventuellement l'ouverture de VSCode. EvoX et ses dépendances seront installés.

> **Remarque** : Si le script échoue en raison de problèmes réseau, fermez-le et relancez-le. Il prend en charge la reprise après échec.

**Option 2 : Installation manuelle**
Pour installer manuellement EvoX :

1. **Installer le pilote GPU** : Installez le dernier pilote NVIDIA depuis le [site officiel](https://www.nvidia.cn/Download/index.aspx). Si vous n'avez pas de GPU dédié, ignorez cette étape.

2. **Installer Python** : Téléchargez [Python 3.10+ pour Windows](https://www.python.org/downloads/windows/) et activez "Add Python to PATH" lors de l'installation.

3. **Installer PyTorch** : Ouvrez CMD ou PowerShell et installez PyTorch en fonction de votre matériel :

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Optionnel) Installer le compilateur Triton** : PyTorch sur Windows manque de support pour Triton. Si vous souhaitez utiliser `torch.compile` (disponible dans PyTorch 2.0), installez le paquet tiers [triton-windows](https://github.com/woct0rdho/triton-windows). Optionnel mais utile pour l'optimisation des performances.

5. **Installer EvoX** :

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  `> **Remarque :**
> Certains paquets peuvent nécessiter des dépendances système supplémentaires. Si c'est le cas, l'installateur vous invitera avec un message comme le suivant :console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Lorsque vous rencontrez de tels messages, suivez les instructions fournies pour installer les dépendances nécessaires avant de continuer.
  ````


### Installation sur Linux

L'installation d'EvoX sur Linux (par ex. Ubuntu) est simple et principalement gérée via `pip`.

1. **Installer les dépendances système** : Assurez-vous que les outils de développement de base et Python 3.10+ sont installés. Vous pouvez utiliser un gestionnaire de paquets (apt, yum) ou Anaconda.

2. **Installer le pilote GPU** (si vous utilisez un GPU) : Utilisez le gestionnaire de paquets approprié (par ex. `apt`) pour installer les pilotes NVIDIA. Vérifiez l'installation avec `nvidia-smi`. Ignorez si vous utilisez le CPU.

> **Remarque :**
> Sur WSL, **n'installez pas** les pilotes NVIDIA à l'intérieur du sous-système Linux — installez-les du côté Windows.

> **Astuce :**
> Il est très probable que vous n'ayez besoin d'installer que le pilote, mais PAS besoin d'installer CUDA ou d'autres dépendances.
> Ces bibliothèques sont déjà incluses dans l'installation de PyTorch via pip.

> **Astuce :**
> La version requise du pilote dépend de votre matériel. Si vous avez un GPU NVIDIA récent, utiliser la dernière version du pilote est souvent le meilleur choix.
> Pour assurer une meilleure compatibilité et l'accès aux derniers pilotes, il est généralement judicieux d'utiliser une distribution Linux plus récente (par ex. Ubuntu 25.04 au lieu de 22.04).

1. **Installer PyTorch** : Comme sur Windows, installez en fonction du matériel. Référez-vous au [guide officiel de PyTorch](https://pytorch.org).

2. **Installer EvoX** :

   ```bash
   pip install evox
   ```

   Ou avec les extras :

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Cela installe les modules de visualisation et les dépendances de neuroévolution (comme Brax). Vous pouvez également choisir des extras individuels comme `vis` ou `neuroevolution`.

#### Installation via conteneur (Docker, Podman)

Pour les utilisateurs de GPU AMD ou ceux cherchant une isolation de l'environnement, Docker est recommandé. Par exemple, en utilisant l'image Docker officielle de PyTorch avec ROCm :

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

  Cela imprime les informations de configuration de PyTorch et du système. Si EvoX est importé sans erreur, l'installation a réussi. Vous pouvez également vérifier la version :

  ```python
  import evox
  print(evox.__version__)
  ```

- **Paramètres optionnels** : Vous pouvez ajuster les paramètres liés aux performances, tels que :

  - Définir des variables d'environnement comme `OMP_NUM_THREADS` pour contrôler le nombre de threads CPU
  - Augmenter la mémoire partagée Docker avec `--shm-size`
  - S'assurer que votre IDE (Jupyter, PyCharm, etc.) utilise le bon environnement Python

Une fois la configuration terminée, vous êtes prêt à commencer l'optimisation avec EvoX.