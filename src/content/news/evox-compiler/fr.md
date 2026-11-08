---
title: "EvoX Compiler v0.1.0 : inspecter le programme avant son exécution"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "Graphes explicites, transformations composables et étapes séparées permettent d’inspecter la structure des programmes candidats et de les évaluer ensemble."
---

Lorsque les candidats d’une recherche sont des programmes, déboguer uniquement la sortie finale laisse une grande partie de l’expérience dans l’ombre. EvoX Compiler rend le programme lui-même inspectable : vous pouvez conserver son graphe, le transformer et choisir un backend au fil d’étapes distinctes et visibles.

![Structure du programme rendue visible pour inspection](./evoxc-visible-stages.webp)

*Illustration conceptuelle : la structure du programme devient visible entre définition et exécution.*

**EvoX Compiler (evoxc) v0.1.0** a été publié le 29 octobre 2026. Ce frontend et runtime Python pour graphes de tenseurs requiert Python 3.11 ou ultérieur et utilise la licence Apache-2.0. [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## De la définition à un exécutable inspectable

Le pipeline est `trace → lower → compile → load → run`. Le traçage construit EvoXIR depuis une définition et des spécifications d’entrée ; l’abaissement prépare la représentation du backend ; la compilation crée un artefact, chargé sur un périphérique puis exécuté avec les données. Chaque étape fournit un objet inspectable.

Cela distingue un graphe invalide, une opération non prise en charge et une incompatibilité de périphérique. Graphes et artefacts compatibles peuvent être sauvegardés. Les compilateurs externes assurent optimisation, ordonnancement et génération de code ; evoxc fournit le frontend et le contrat entre étapes.

## Réunir une population de programmes dans un graphe

`vmap`, `grad`, `jvp` et `vjp` produisent des graphes composables avant exécution. [`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) regroupe des fonctions candidates dont les spécifications d’entrée et de sortie correspondent.

En programmation génétique, recherche d’architectures ou synthèse d’algorithmes, les candidats peuvent être des programmes différents. Leur regroupement peut réduire compilations et lancements répétés, mais le gain dépend de la structure et du backend : il n’est pas automatique.

## Choisir le backend selon les opérations nécessaires

NumPy est la seule dépendance obligatoire et fournit l’interpréteur CPU de référence. Des adaptateurs optionnels relient IREE, XLA via un plugin PJRT fourni par l’utilisateur, et TVM via StableHLO. Leur couverture des opérations et du matériel diffère.

Le README versionné rapporte une validation Vulkan sur Mesa lavapipe, un périphérique logiciel, et une validation TVM ROCm limitée à la compilation. Les entrées GPU et leur placement sont explicites. Vérifiez les opérations compatibles avant de migrer un graphe CPU.

## Commencer sur CPU, puis déplacer le graphe

Installez cette version, exécutez l’exemple CPU du README, inspectez le graphe puis choisissez un backend compilé :

```bash
pip install evoxc==0.1.0
```

L’intégration HuggingFace s’installe séparément sous le nom `evoxc-hf`, avec sa propre distribution et son propre cycle de mise à jour.

## Lire la validation avec son environnement

Avec les dépendances optionnelles documentées, le README de la version rapporte **7 511 tests réussis, 77 ignorés et 4 échecs attendus**, sans échec inattendu, dans les suites principales et d’intégration. Les tests ignorés incluent des conditions de matériel et de dépendances. Le dépôt attribue le code, les tests et la documentation à Genesis.

Consultez le [README versionné](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), la [publication](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) et le [dépôt](https://github.com/EMI-Group/evoxc) pour l’API, les artefacts et la suite du développement.

Le récit du développement agentique figure dans [Genesis et EvoX Compiler](/fr/news/genesis-evoxc). Pour votre expérience, conservez un graphe de référence et inspectez chaque transformation avant de comparer les backends.
