---
title: "EvoX Compiler v0.1.0 : une base de calcul pour faire évoluer les programmes"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "EvoX Compiler sépare représentation, transformation et exécution des programmes, offrant une base de calcul pour expérimenter sur plusieurs populations et backends."
---

*Mis à jour le 7 novembre 2026. Les résultats historiques conservent leur date de référence.*

La vision d'IA évolutionnaire d'EvoX exige un calcul capable d'accueillir des candidats changeants, y compris des programmes de structures différentes. EvoX Compiler développe cette base : les graphes explicites rendent les programmes inspectables et transformables avant leur exécution, tandis que les interfaces de backend relient les calculs pris en charge à différents systèmes d'exécution.

Un programme numérique ne se résume pas à sa sortie : on peut vouloir inspecter son graphe, le transformer, comparer des backends ou conserver un artefact compilé. **EvoX Compiler (evoxc) v0.1.0**, publié le 29 octobre 2026, rend ces étapes explicites. Ce frontend et runtime Python pour graphes de tenseurs utilise la licence Apache-2.0 et requiert Python 3.11 ou ultérieur.

## De la définition à l’exécutable

Le pipeline est `trace → lower → compile → load → run`. Le traçage construit EvoXIR depuis une définition et des spécifications d’entrée ; l’abaissement prépare la représentation du backend ; la compilation crée un artefact, chargé sur un périphérique puis exécuté avec les données. Chaque étape fournit un objet inspectable.

Cela distingue un graphe invalide, une opération non prise en charge et une incompatibilité de périphérique. Graphes et artefacts compatibles peuvent être sauvegardés. Les compilateurs externes assurent optimisation, ordonnancement et génération de code ; evoxc fournit le frontend et le contrat entre étapes.

## Transformations et évolution

`vmap`, `grad`, `jvp` et `vjp` produisent des graphes composables avant exécution. `batch_functions` regroupe des fonctions candidates dont les spécifications d’entrée et de sortie correspondent.

En programmation génétique, recherche d’architectures ou synthèse d’algorithmes, les candidats peuvent être des programmes différents. Leur regroupement peut réduire compilations et lancements répétés, mais le gain dépend de la structure et du backend : il n’est pas automatique.

## Choisir un chemin d’exécution

NumPy est la seule dépendance obligatoire et fournit l’interpréteur CPU de référence. Des adaptateurs optionnels relient IREE, XLA via un plugin PJRT fourni par l’utilisateur, et TVM via StableHLO. Leur couverture des opérations et du matériel diffère.

Le README versionné rapporte une validation Vulkan sur Mesa lavapipe, un périphérique logiciel, et une validation TVM ROCm limitée à la compilation. Les entrées GPU et leur placement sont explicites. Vérifiez les opérations compatibles avant de migrer un graphe CPU.

## Commencer par la référence

Installez cette version, exécutez l’exemple CPU du README, inspectez le graphe puis choisissez un backend compilé :

```bash
pip install evoxc==0.1.0
```

L’intégration HuggingFace est le paquet séparé `evoxc-hf`. Ne confondez pas ce compilateur avec le paquet d’optimisation EvoX ni leurs numéros de version.

## La validation dans l'infrastructure de calcul

Le README rapporte **7 511 tests réussis, 77 ignorés et 4 échecs attendus**, sans échec, dans l’environnement documenté des suites principales et d’intégration. Ce n’est pas une validation universelle du matériel. Le dépôt attribue à Genesis la production du code, des tests et de la documentation.

Consultez le [README versionné](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), la [publication](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) et le [dépôt](https://github.com/EMI-Group/evoxc) pour l’API, les artefacts et la suite du développement.
