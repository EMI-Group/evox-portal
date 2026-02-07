---
title: "6. Dépannage et optimisation"
order: 6
---

# 6. Dépannage et optimisation

Lors de l'utilisation d'EvoX, vous pouvez rencontrer des problèmes ou vouloir affiner vos algorithmes. Ce chapitre présente les problèmes courants et leurs solutions, ainsi que des stratégies de débogage et des conseils d'optimisation des performances pour vous aider à résoudre les problèmes et optimiser votre expérience.

---

## 6.1 Problèmes courants et solutions

Voici quelques problèmes fréquemment rencontrés et comment les résoudre :

**(1) Erreurs d'installation ou d'importation** :

- **Symptôme** : Erreur lors de l'exécution de `import evox`.
- **Solution** :
  - **Vérifier l'installation** : Exécutez `pip show evox` pour vérifier. S'il n'est pas installé, vérifiez votre environnement virtuel et réinstallez.
  - **Dépendances manquantes** : Si vous voyez `ModuleNotFoundError: No module named 'torch'`, installez PyTorch comme indiqué au Chapitre 2.
  - **Incompatibilité CUDA** : Assurez-vous que votre version de PyTorch correspond à vos pilotes CUDA installés.

**(2) Le GPU n'est pas utilisé** :

- **Symptôme** : EvoX s'exécute sur le CPU au lieu du GPU.
- **Solution** :
  - Vérifiez avec `torch.cuda.is_available()`. Si `False`, réinstallez un PyTorch compatible GPU et vérifiez l'installation CUDA.
  - Si `True` mais qu'EvoX utilise toujours le CPU, assurez-vous que vos tenseurs sont déplacés vers le GPU (voir le Chapitre 3 pour la configuration).

**(3) Mémoire insuffisante (RAM/VRAM)** :

- **Symptôme** : Vous voyez `OutOfMemoryError`.
- **Solution** :
  - Réduisez la taille de la population, la dimension du problème ou la fréquence d'évaluation.
  - Utilisez float16 (demi-précision) ou le fractionnement de l'évaluation par lots.
  - Désactivez les modes debug/déterministe dans PyTorch.
  - Stockez uniquement les statistiques au lieu des fronts de Pareto complets (pour le multi-objectif).
  - La mise à niveau du matériel est la solution ultime pour les goulots d'étranglement mémoire.

**(4) Stagnation de la convergence** :

- **Symptôme** : L'algorithme reste bloqué dans un optimum local.
- **Solution** :
  - Augmentez la diversité de la population (par exemple, taux de mutation plus élevé).
  - Essayez différents algorithmes ou paramètres.
  - Assurez-vous que la fonction objectif est bien définie (pas trop bruitée ou plate).
  - Exécutez plusieurs essais et choisissez le meilleur — EvoX facilite les exécutions parallèles.

**(5) Résultats d'optimisation médiocres** :

- **Symptôme** : Les résultats finaux sont en dessous des attentes.
- **Solution** :
  - **Vérifier la définition du problème** : Assurez-vous que la fitness est calculée correctement (par exemple, signes, mise à l'échelle).
  - **Adéquation de l'algorithme** : Essayez d'autres algorithmes ou ajustez les hyperparamètres.
  - **Utilisez les courbes de convergence** :
    - Plateau précoce → convergence prématurée.
    - Oscillation → aléatoire trop élevé.
  - Ajustez les paramètres de l'algorithme et analysez le comportement au fil du temps.

**(6) Conflits de backend (JAX vs PyTorch)** :

- **Symptôme** : Installation accidentelle de la version JAX d'EvoX alors que vous utilisez des exemples PyTorch.
- **Solution** : Le `pip install evox` par défaut vous donne la version PyTorch. Si vous avez installé une version JAX, réinstallez en suivant les instructions PyTorch (voir le Chapitre 2). Les fonctionnalités JAX sont documentées séparément.

**(7) Incompatibilité de version** :

- **Symptôme** : Les appels API ne correspondent pas à la version installée.
- **Solution** :
  - Les mises à jour d'EvoX peuvent changer les noms de méthodes (par exemple, `ask/tell` → `step`).
  - Utilisez la dernière version stable et consultez sa documentation.
  - Adaptez le code pour correspondre à votre version d'EvoX ou envisagez une mise à niveau.

---

## 6.2 Conseils de débogage

Le débogage des algorithmes évolutifs peut être délicat en raison de leur nature stochastique. Voici des conseils pratiques :

**(1) Utilisez des tests à petite échelle** :

- Réduisez la taille de la population et le nombre d'itérations pour simplifier le débogage.
- Exemple : `pop_size=5`, `iterations=20`.
- Facilite le suivi du comportement de la population et l'isolation des problèmes.

**(2) Insérez des instructions d'affichage** :

- Affichez la fitness de la population, les meilleurs individus et les valeurs intermédiaires.
- Pour les grands tenseurs, affichez les formes ou utilisez `.tolist()` pour les plus petits.
- Aide à comprendre la convergence et les effets des opérateurs.

**(3) Utilisez les points d'arrêt de l'IDE** :

- Utilisez PyCharm ou VS Code pour placer des points d'arrêt dans le `step()` de l'algorithme ou la logique d'évaluation.
- Inspectez les valeurs des variables, le contenu des tenseurs ou les transitions d'état.
- Soyez prudent avec les grands tenseurs — limitez ce que vous inspectez pour éviter les plantages.

**(4) Testez unitairement les composants personnalisés** :

- Testez les fonctions de croisement/mutation séparément.
- Utilisez des entrées synthétiques pour valider les formes de sortie et la logique avant l'intégration complète.

**(5) Profilez l'exécution** :

- Utilisez `torch.autograd.profiler.profile` ou `time.time()` pour mesurer les temps d'étape.
- Aide à localiser les goulots d'étranglement ou les boucles infinies.
- Identifiez si les ralentissements sont dans l'évaluation ou la logique de l'algorithme.

**(6) Journalisez la sortie dans un fichier** :

- Écrivez les journaux dans des fichiers `.csv` pour les longues exécutions.
- Incluez la meilleure fitness par génération, les statistiques de diversité, etc.
- Utile lorsque les plantages empêchent de voir la sortie console.

Globalement, le débogage des projets EvoX nécessite un équilibre entre les vérifications de correction et l'analyse des résultats. Concentrez-vous d'abord sur le bon fonctionnement de l'algorithme, puis optimisez son efficacité.

---

## 6.3 Guide d'optimisation des performances

Ces conseils vous aident à tirer plus de vitesse et de qualité d'EvoX :

**(1) Mise à l'échelle progressive** :

- **Commencez petit** : Testez la logique avec de petites entrées.
- **Augmentez progressivement** et observez comment le temps d'exécution augmente.
- **Identifiez les inefficacités** si la mise à l'échelle est non linéaire (par exemple, 10x population → >10x temps).

**(2) Surveillez l'utilisation du matériel** :

- Utilisez `nvidia-smi` pour le GPU, `htop` pour le CPU.
- Une utilisation GPU élevée (>50%) est idéale.
- Une faible utilisation GPU peut signifier que les données ne sont pas sur le GPU ou que des transferts fréquents CPU-GPU ralentissent les choses.

**(3) Ajustez le parallélisme** :

- Définissez les threads CPU : `torch.set_num_threads(n)`.
- Évitez la sursouscription si vous utilisez des outils d'évaluation multi-threadés.
- Pour le GPU, optimisez les threads `DataLoader` si vous utilisez des environnements par lots ou des jeux de données.

**(4) Exploitez l'évaluation par lots** :

- L'évaluation par lots est plus rapide que l'évaluation par individu.
- Vectorisez toujours `Problem.evaluate()` pour traiter des populations entières.

**(5) Réduisez la surcharge Python** :

- Déplacez la logique lourde à l'intérieur de `Algorithm` ou `Problem`, évitez le code Python complexe dans la boucle principale.
- Utilisez `workflow.step()` pour la plupart des opérations.
- Minimisez les diagnostics par génération s'ils ralentissent les exécutions.

**(6) Ajustez le choix de l'algorithme** :

- Essayez CMA-ES, GA, PSO, RVEA, etc. — aucun algorithme n'est le meilleur pour tous les problèmes.
- Un algorithme convergeant plus rapidement peut faire gagner plus de temps que la micro-optimisation d'un algorithme qui converge lentement.

L'optimisation des performances est itérative. Avec de la patience, vous pouvez passer de heures d'exécution à quelques minutes. EvoX vous offre de nombreux "leviers" — utilisez-les judicieusement pour équilibrer vitesse et qualité des solutions.
