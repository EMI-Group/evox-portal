---
title: "EvoX Genesis : Construire un compilateur C via des étapes inspectables et des jalons de régression"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "Le cas du compilateur C suit une implémentation vide à travers les étapes de compilation, les diagnostics et les bancs d'essai externes, avec des résultats maintenus dans leur périmètre documenté."
---

Partir d'une implémentation vide est un objectif clair ; produire un exécutable au comportement correct est une condition d'acceptation bien plus exigeante. Le cas du compilateur C de Genesis peut être examiné à travers les interfaces qu'il a construites et les couches de vérification qui les entourent.

![Modules sources assemblés dans un projet logiciel en pleine croissance](./software-world-continuity.webp)

Le [registre Evidence du compilateur C](https://genesis.evox.group/evidence/c-compiler/) rapporte **248 989 lignes de Rust**, **1 019 épisodes d'agent archivés**, **123,4 heures** et **44,38 $ US de frais de jetons de modèle**, en utilisant DeepSeek V4 Flash. Il répertorie 220/220 cas de la c-testsuite, 32/36 cas LLVM évalués et 2 904/2 904 tests Rust. Il s'agit de résultats rapportés par le projet, et non d'une nouvelle reproduction pour cet article.

## Faire d'abord transiter un programme par chaque étape

Le compilateur public, jcc, documente une séquence de jalons d'ingénierie : établir l'espace de travail, construire un squelette de compilation de bout en bout, étendre la couverture du langage, ajouter l'optimisation, puis exercer les suites externes et les constructions d'applications. La [feuille de route](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) définit ces jalons ; elle doit être lue comme le registre de développement du dépôt plutôt que comme une transcription horodatée de chaque épisode Genesis.

L'[architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) connecte le prétraitement, l'analyse lexicale et syntaxique, les vérifications sémantiques, l'exécution technique du lowering vers CIR, l'optimisation, la génération de code machine, l'assemblage d'objets et l'édition de liens. Des crates distinctes gèrent ces étapes.

Cette structure crée des artefacts intermédiaires utiles. `-E` s'arrête après le prétraitement ; `-emit-jcc-ir` expose la CIR ; `-S` émet l'assembleur ; `-c` produit un objet. Lorsqu'un programme compilé échoue, ces limites restreignent l'investigation avant de modifier l'ensemble du pipeline.

## Préserver la sémantique C à travers la représentation intermédiaire

La CIR est la représentation SSA typée du compilateur, distincte de l'IR LLVM. L'optimisation transforme la CIR en CIR ; le flux de travail documenté pour les builds de débogage exécute le vérificateur après les passes. Le [guide de test](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) décrit les vérifications pour le lowering, les représentations invalides, les réécritures, l'encodage des instructions et le comportement en ligne de commande.

La vérification de la représentation est une couche, pas une preuve de compilation correcte. Une transformation structurellement valide peut tout de même modifier le résultat d'un programme. C'est pourquoi la stratégie de test compile et exécute également des programmes C et compare leur sortie.

Le corpus inclut des échecs de compilation délibérés : les tests vérifient la sévérité du diagnostic, le message et la plage de code source. Cela préserve le comportement de rejet pour les entrées invalides parallèlement au comportement d'exécution réussi. Le [document de conformité C11](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) du compilateur enregistre les constructions prises en charge et la politique d'extension.

## Des suites externes testent le chemin complet

Le [harnais c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) fournit un jalon externe de test du langage. Le [lanceur LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) pilote CMake avec le compilateur testé, construit des programmes et compare l'exécution par rapport à une sortie de référence. Sa comparaison numérique par défaut utilise une tolérance de 1e-4, tandis que les jetons non numériques et le code de sortie doivent correspondre exactement.

Le [harnais Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) ajoute des tests différentiels de programmes générés par rapport à un compilateur de référence. Dans l'instantané inspecté du README, son exécution sur 100 graines rapporte **93 succès, 0 échec et 7 sauts**, les sauts étant attribués au dépassement de délai des deux compilateurs. Qualifier cela de « 93/93 » sans les graines sautées masquerait une partie de la charge de travail.

Ces vérifications détectent différentes classes d'erreurs : une suite de langage sonde des constructions spécifiées, des programmes aléatoires explorent des combinaisons, et les builds d'applications liées exercent ensemble le pilote, les fichiers objets et les interfaces d'exécution.

## Lier le succès à l'opération testée

Le [README versionné](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) indique que lz4 se construit et réussit ses huit tests essentiels. Il décrit SQLite comme étant analysé et converti proprement (lowering), avec des travaux de vérification de fichiers complets enregistrés ultérieurement. Analyser SQLite est un jalon d'intégration utile ; ce n'est pas la même chose que de réussir la suite complète de tests d'exécution de SQLite.

La même source répertorie l'arithmétique `long double` partielle, les plateformes différées et les jalons documentés de la politique d'extension. Le résultat LLVM de 32/36 doit donc conserver son sous-ensemble évalué et ses exclusions. Le README et la page Evidence présentent également des décomptes de tests d'espace de travail différents ; cet article maintient le total d'Evidence attaché à son propre registre plutôt que de combiner les instantanés.

## Ce qui persiste entre les tâches de développement

Le [modèle de développement documenté](https://genesis.evox.group/getting-started/) de Genesis utilise une décomposition récursive des tâches autour d'un projet logiciel. Dans ce cas, les artefacts d'ingénierie durables sont concrets : modules sources, contrats de représentation, sorties intermédiaires, diagnostics et harnais de régression. Une tâche ultérieure peut s'appuyer sur ces artefacts au lieu de dépendre uniquement de la conversation d'un prédécesseur.

Le [cas de continuation de modèle](/news/genesis-compiler-continuation) examine un transfert ultérieur et son résultat de 1 820 cas au périmètre distinct. La [réécriture MESA](/news/genesis-mesa) utilise le comportement numérique original comme référence, tandis qu'[EvoX Compiler](/news/genesis-evoxc) vérifie les graphes de tenseurs et les contrats de périphériques. Il s'agit de problèmes de vérification distincts plutôt que d'exécutions supplémentaires de la même expérience de compilateur.

Les 44,38 $ US couvrent les jetons de modèle et excluent le matériel. Les registres publics soutiennent un cas substantiel de construction de compilateur dans leur périmètre rapporté ; ils n'établissent pas une compatibilité C sans restriction. Pour inspecter le résultat, suivez l'[architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) jusqu'à un harnais externe, puis examinez les programmes et les sorties exacts qui définissent son jalon.
