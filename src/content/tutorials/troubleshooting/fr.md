---
title: "6. Dépannage et Optimisation"
order: 6
---

# 6. Dépannage et Optimisation

Lors de l'utilisation d'EvoX, vous pouvez rencontrer des problèmes ou vouloir affiner vos algorithmes. Ce chapitre présente les problèmes courants et leurs solutions, ainsi que des stratégies de débogage et des conseils d'optimisation des performances pour vous aider à résoudre les problèmes et à optimiser votre expérience.

---

## 6.1 Problèmes courants et solutions

Voici quelques problèmes fréquemment rencontrés et comment les résoudre :

**(1) Erreurs d'installation ou d'importation** :

- **Symptôme** : Erreur lors de l'exécution de `import evox`.
- **Solution** :
  - **Vérifier l'installation** : Exécutez `pip show evox` pour vérifier. S'il n'est pas installé, vérifiez votre environnement virtuel et réinstallez-le.
  - **Dépendances manquantes** : Si vous voyez `ModuleNotFoundError: No module named 'torch'`, installez PyTorch comme indiqué au Chapitre 2.
  - **Incompatibilité CUDA** : Assurez-vous que votre version de PyTorch correspond à vos pilotes CUDA installés.

**(2) GPU non utilisé** :

- **Symptôme** : EvoX s'exécute sur le CPU au lieu du GPU.
- **Solution** :
  - Vérifiez avec `torch.cuda.is_available()`. Si `False`, réinstallez une version de PyTorch compatible GPU et vérifiez l'installation de CUDA.
  - Si `True` mais qu'EvoX utilise toujours le CPU, assurez-vous que vos tenseurs sont déplacés vers le GPU (voir Chapitre 3 pour la configuration).

**(3) Mémoire insuffisante (RAM/VRAM)** :

- **Symptôme** : Vous voyez une erreur `OutOfMemoryError`.
- **Solution** :
  - Réduisez la taille de la population, la dimension du problème ou la fréquence d'évaluation.
  - Utilisez float16 (demi-précision) ou le fractionnement de l'évaluation par lots (batch evaluation splitting).
  - Désactivez les modes de débogage/déterministes dans PyTorch.
  - Ne stockez que les statistiques au lieu des fronts de Pareto complets (pour le multi-objectif).
  - La mise à niveau du matériel est la solution ultime pour les goulots d'étranglement de mémoire.

**(4) Stagnation de la convergence** :

- **Symptôme** : L'algorithme reste bloqué dans un optimum local.
- **Solution** :
  - Augmentez la diversité de la population (par exemple, un taux de mutation plus élevé).
  - Essayez différents algorithmes ou paramètres.
  - Assurez-vous que la fonction objectif est bien définie (pas trop bruitée ou plate).
  - Exécutez plusieurs essais et choisissez le meilleur — EvoX facilite les exécutions parallèles.

**(5) Mauvais résultats d'optimisation** :

- **Symptôme** : Les résultats finaux sont en deçà des attentes.
- **Solution** :
  - **Vérifier la définition du problème** : Assurez-vous que la fitness est calculée correctement (par exemple, signes, mise à l'échelle).
  - **Adéquation de l'algorithme** : Essayez-en d'autres ou ajustez les hyperparamètres.
  - **Utiliser les courbes de convergence** :
    - Aplatissement précoce → convergence prématurée.
    - Oscillation → aléatoire trop élevé.
  - Ajustez les paramètres de l'algorithme et analysez le comportement au fil du temps.

**(6) Conflits de backend (JAX vs PyTorch)** :

- **Symptôme** : Installation accidentelle de la version JAX d'EvoX tout en utilisant des exemples PyTorch.
- **Solution** : La commande par défaut `pip install evox` vous donne la version PyTorch. Si vous avez installé une version JAX, réinstallez-la en suivant les instructions pour PyTorch (voir Chapitre 2). Les fonctionnalités JAX sont documentées séparément.

**(7) Incompatibilité de version** :

- **Symptôme** : Les appels API ne correspondent pas à la version installée.
- **Solution** :
  - Les mises à jour d'EvoX peuvent changer les noms de méthodes (par exemple, `ask/tell` → `step`).
  - Utilisez la dernière version stable et référez-vous à sa documentation.
  - Ajustez le code pour l'aligner avec votre version d'EvoX ou envisagez une mise à niveau.

---

## 6.2 Conseils de débogage

Le débogage des algorithmes évolutionnaires peut être délicat en raison de leur nature stochastique. Voici des conseils pratiques :

**(1) Utiliser des tests à petite échelle** :

- Réduisez la taille de la population et le nombre d'itérations pour simplifier le débogage.
- Exemple : `pop_size=5`, `iterations=20`.
- Cela facilite le suivi du comportement de la population et l'isolement des problèmes.

**(2) Insérer des instructions d'impression (Print)** :

- Imprimez la fitness de la population, les meilleurs individus et les valeurs intermédiaires.
- Pour les grands tenseurs, imprimez les formes (shapes) ou utilisez `.tolist()` pour les plus petits.
- Cela vous aide à comprendre la convergence et les effets des opérateurs.

**(3) Utiliser les points d'arrêt de l'IDE** :

- Utilisez PyCharm ou VS Code pour définir des points d'arrêt à l'intérieur de la méthode `step()` de l'algorithme ou de la logique d'évaluation.
- Inspectez les valeurs des variables, le contenu des tenseurs ou les transitions d'état.
- Soyez prudent avec les grands tenseurs — limitez ce que vous inspectez pour éviter les plantages.

**(4) Tests unitaires des composants personnalisés** :

- Testez les fonctions de croisement/mutation séparément.
- Utilisez des entrées synthétiques pour valider les formes de sortie et la logique avant l'intégration complète.

**(5) Profiler l'exécution** :

- Utilisez `torch.autograd.profiler.profile` ou `time.time()` pour mesurer les temps d'exécution des étapes.
- Cela vous aide à localiser les goulots d'étranglement ou les boucles infinies.
- Identifiez si les ralentissements se situent dans l'évaluation ou dans la logique de l'algorithme.

**(6) Enregistrer la sortie dans un fichier** :

- Écrivez les journaux dans des fichiers `.csv` pour les longues exécutions.
- Incluez la meilleure fitness par génération, les statistiques de diversité, etc.
- Utile lorsque des plantages empêchent de voir la sortie de la console.

Dans l'ensemble, le débogage des projets EvoX nécessite un équilibre entre les vérifications de correction et l'analyse des résultats. Concentrez-vous d'abord sur le bon fonctionnement de l'algorithme, puis optimisez son efficacité.

---

## 6.3 Guide d'optimisation des performances

Ces conseils vous aident à tirer plus de vitesse et de qualité d'EvoX :

**(1) Mise à l'échelle progressive** :

- **Commencer petit** : Testez la logique avec de petites entrées.
- **Augmenter l'échelle** : Augmentez progressivement et observez comment le temps d'exécution augmente.
- **Identifier les inefficacités** : Si la mise à l'échelle est non linéaire (par exemple, population x10 → temps > x10).

**(2) Surveiller l'utilisation du matériel** :

- Utilisez `nvidia-smi` pour le GPU, `htop` pour le CPU.
- Une utilisation élevée du GPU (>50%) est idéale.
- Une faible utilisation du GPU peut signifier que les données ne sont pas sur le GPU ou que des transferts fréquents CPU-GPU ralentissent les choses.

**(3) Ajuster le parallélisme** :

- Définissez les threads CPU : `torch.set_num_threads(n)`.
- Évitez la sursouscription si vous utilisez des outils d'évaluation multithreadés.
- Pour le GPU, optimisez les threads du `DataLoader` si vous utilisez des environnements par lots ou des jeux de données.

**(4) Tirer parti de l'évaluation par lots** :

- L'évaluation par lots est plus rapide que l'évaluation par individu.
- Vectorisez toujours `Problem.evaluate()` pour traiter des populations entières.

**(5) Réduire la surcharge Python** :

- Déplacez la logique lourde à l'intérieur de `Algorithm` ou `Problem`, évitez le code Python complexe dans la boucle principale.
- Utilisez `workflow.step()` pour la plupart des opérations.
- Minimisez les diagnostics par génération s'ils ralentissent les exécutions.

**(6) Ajuster le choix de l'algorithme** :

- Essayez CMA-ES, GA, PSO, RVEA, etc. — aucun algorithme unique n'est le meilleur pour tous les problèmes.
- Un algorithme convergeant plus rapidement peut faire gagner plus de temps que la micro-optimisation d'un algorithme qui converge lentement.

L'optimisation des performances est itérative. Avec de la patience, vous pouvez passer de plusieurs heures d'exécution à quelques minutes. EvoX vous offre de nombreux « leviers » — utilisez-les judicieusement pour équilibrer la vitesse et la qualité de la solution.