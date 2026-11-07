---
title: "Genesis construit EvoX Compiler : l'IA développe l'infrastructure évolutionnaire"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Le cas EvoX Compiler relie deux capacités de l'écosystème : Genesis développe le logiciel, et le compilateur obtenu soutient transformation et exécution des programmes."
---

*Mis à jour le 7 novembre 2026. Les résultats historiques conservent leur date de référence.*

L'infrastructure nécessaire à l'IA évolutionnaire est elle-même un projet logiciel important. Le cas Genesis–EvoX Compiler relie ces niveaux : un système de développement agentique construit et étend un compilateur de graphes tensoriels, tandis que les contrats d'interface et les tests de régression déterminent les changements intégrés à son développement continu.

## Des responsabilités explicites

EvoX Compiler construit et transforme EvoXIR, puis procède à l’abaissement, la compilation, le chargement et l’exécution. Les compilateurs externes optimisent et génèrent le code. NumPy sert de référence ; IREE, XLA et TVM sont optionnels.

Les transformations doivent préserver le sens, les backends traiter les opérations acceptées et le runtime respecter les périphériques. Ces contrats donnent des critères plus concrets qu’un volume de code.

## Organisation du développement

Le [dossier du 28 octobre 2026](https://genesis.evox.group/evidence/evoxc/) décrit des documents de contexte par paquet, des dépendances à sens unique et des tests avant chaque nouvelle couche. Le dépôt attribue à Genesis code, tests et documentation.

Le travail s’est poursuivi sur les adaptateurs, les graphes et les benchmarks. Le dossier reconstruit une structure à partir de l’historique ; il n’audite pas chaque action d’agent. Deux mois calendaires ne signifient pas deux mois d’exécution autonome continue.

## Plusieurs niveaux de validation

Avec IREE installé, le dossier rapporte **6 789 réussites, 46 tests ignorés et 3 échecs attendus**, sans échec. Sans compilateur, **6 367 tests réussissent**. Il faut conserver ces valeurs historiques plutôt que leur substituer celles d’une publication ultérieure.

L’intégration séparée `evoxc_hf` compare sorties et latences à torch/transformers. Checkpoints, précision, backend et matériel doivent accompagner ces comparaisons : accord numérique et rapidité sont distincts.

## Résultats et limites

Les **285 659 lignes de texte suivies** comprennent tests, documentation et données de benchmark. Les quelque **50 dollars US** concernent les tokens, hors matériel. Modèle, nombre d’épisodes et temps d’exécution ne sont pas indiqués.

Vulkan utilisait Mesa lavapipe, un périphérique logiciel ; TVM ROCm était limité à la compilation. Un nom de backend ne prouve pas la validation complète sur tout matériel. Les résultats restent déclarés par le projet, sans reproduction indépendante.

## Relier évolution logicielle et infrastructure de calcul

Partez du [README](https://github.com/EMI-Group/evoxc/blob/main/README.md), puis reliez les affirmations aux tests et aux [benchmarks de modèles archivés](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md). Examinez les chemins disponibles et les écarts de performance non résolus.

Le [dépôt EvoX Compiler](https://github.com/EMI-Group/evoxc) illustre le lien entre développement assisté par IA et infrastructure de calcul. Genesis contribue à un système dont les représentations explicites et les voies d'exécution peuvent soutenir de nouvelles expériences évolutionnaires. Interfaces, tests et mesures conservés rendent ce développement vérifiable.
