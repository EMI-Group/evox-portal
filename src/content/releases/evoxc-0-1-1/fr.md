---
title: "EvoX Compiler v0.1.1 : moins de préparation avant d'exécuter une population"
pubDate: 2026-10-30
summary: "La version du 30 octobre améliore le regroupement des programmes, la préparation des graphes et les erreurs des moteurs, dont un verrou XLA."
---

Rechercher des programmes fait de la compilation une partie du budget expérimental. Si chaque génération prépare longtemps ses graphes, accélérer seulement l'appareil ne suffit pas. [EvoX Compiler v0.1.1][s1], publié le 30 octobre 2026, améliore ce chemin et corrige des défaillances des moteurs. Ses [45 commits][s2] prolongent le traitement explicite introduit dans v0.1.0.

![Différentes structures de programmes réunies en groupes parallèles compacts](./cover.webp)

*Illustration conceptuelle : organiser une population de programmes avant compilation.*

## Regrouper les programmes exige un modèle de coût

La transformation `batch_functions` combine des candidats compatibles dans un graphe. La version propage la dépendance par ligne dans le graphe interne de classes et étend la recherche géométrique des groupes utilisée par `bands="auto"`. Elle distingue ainsi le travail dépendant de chaque individu et les regroupements possibles.

En programmation génétique, des programmes peuvent partager une signature d'entrée mais employer des opérations différentes. Un regroupement plat unique n'est pas forcément le moins coûteux. Les bandes offrent une autre organisation, comparée automatiquement par le modèle de coût. Le contrôle essentiel reste sémantique : la ligne i du résultat fusionné doit correspondre à l'exécution séparée du candidat i. Les tests de régression de ce contrat sont actualisés.

## Éliminer le travail répété dans la préparation

Plusieurs changements ciblent le CPU avant l'exécution : capture des positions source par parcours direct des cadres, suppression de vérifications redondantes lors de l'abaissement et suivi linéaire des utilisations avec mémorisation de l'inférence des types dans l'IR. L'export StableHLO ajoute émission groupée des constantes textuelles, cache des textes de types et répartition des opérations par table.

Ces améliorations concernent différentes étapes. Un export plus rapide ne signifie pas un noyau GPU plus rapide. Séparez traçage, transformation, abaissement, compilation et exécution stabilisée dans les mesures. Une grande population riche en constantes et un petit graphe à noyau numérique coûteux peuvent avoir des coûts dominants différents.

## Des défaillances plus faciles à diagnostiquer

L'adaptateur IREE expose désormais la limite HAL de liaisons par lancement comme un `BackendError` exploitable, distinguant une limite de ressources d'une erreur du programme numérique. XLA ne conserve plus le verrou des clients partagés pendant `PJRT_Client_Create`, corrigeant un interblocage avec un finaliseur du même thread. Un test de régression accompagne le correctif.

La prise en charge suit la matrice versionnée. NumPy fournit l'interpréteur CPU ; IREE, XLA et TVM ont des dépendances et appareils différents. L'interpréteur sert de référence avant le chemin compilé. Le [README versionné][s3] décrit ce périmètre et les transferts explicites.

## Mettre à jour avec une population représentative

Installez la base avec `pip install evoxc==0.1.1`, ou IREE avec `pip install "evoxc[iree]==0.1.1"`. Python 3.11 ou ultérieur est nécessaire. La distribution distincte `evoxc-hf` conserve son propre cycle de versions. Préservez la configuration des plugins utilisée par votre expérience.

Partez d'une population enregistrée et d'entrées fixes. Comparez les sorties fusionnées aux exécutions individuelles, puis mesurez préparation et exécution séparément. En cas d'erreur de liaison, conservez graphe et détails du moteur pour le diagnostic plutôt que de modifier silencieusement l'expérience. La [présentation v0.1.0][related] explique le traitement ; v0.1.1 rend ses étapes préparatoires et frontières plus pratiques.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /fr/releases/evoxc-0-1-0
