---
title: "Passage de relais du compilateur Genesis : ce dont le modèle suivant hérite et comment la continuité est vérifiée"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Un passage de relais entre modèles conserve une lignée de compilateur acceptée. Le résultat rapporté et les harnais de régression du compilateur public montrent ce qui peut être vérifié à travers cette frontière."
---

Le [registre Evidence du 7 septembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) décrit un passage de relais de compilateur de **GLM 5.2 à DeepSeek V4 Flash**, sans transporter le contexte conversationnel de l'agent précédent. L'arborescence source acceptée et la lignée Git sont restées disponibles. La question d'ingénierie est de savoir ce que le modèle récepteur peut inspecter et comment les modifications ultérieures peuvent être évaluées.

![Un projet de compilateur conservé entre différents ensembles d'outils](./compiler-model-handoff.webp)

Le registre rapporte que **1 820/1 820 cas LLVM SingleSource conservés ont réussi** après la continuation, et que la profondeur de récursion des tâches est passée de 4 à 8. Il ne publie pas de transcription par correction, ni le volume de code ajouté ou le coût de la continuation. Les sources jcc publiques ci-dessous expliquent les interfaces et les mécanismes de régression du compilateur ; leur instantané distinct ne reconstruit pas la séquence exacte des actions de passage de relais.

## Un compilateur hérité possède des frontières qu'un successeur doit préserver

L'[architecture jcc](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) sépare le frontend, la représentation intermédiaire typée CIR, l'optimiseur, le backend de code machine, l'assembleur et le pilote en ligne de commande. Le frontend transmet un arbre syntaxique vérifié à la phase de lowering ; les étapes ultérieures consomment la représentation résultante plutôt que de réinterpréter la source originale de manière indépendante.

Cela importe lorsqu'un nouveau modèle modifie un composant. Une correction arithmétique lors du lowering doit toujours satisfaire le typage CIR ; un changement de convention d'appel doit s'accorder avec l'allocation de registres et l'émission d'objets. Ce sont des exemples de dépendances documentées par l'architecture, et non des affirmations sur des réparations particulières lors du passage de relais.

Le pilote expose des points d'arrêt intermédiaires : `-E` pour le prétraitement, `-emit-jcc-ir` pour le CIR, `-S` pour l'assemblage et `-c` pour l'émission d'objets. Ces artefacts aident à localiser quelle étape a changé avant de tester un exécutable lié.

## Les vérifications de régression couvrent les programmes réussis et les rejets délibérés

Le [guide de test](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) décrit des cas de compilation et d'exécution qui vérifient le code de sortie et les résultats, ainsi que des cas d'échec de compilation qui vérifient la sévérité du diagnostic, le message et la plage source. Les passes d'optimisation disposent également de vérifications de validation de la représentation.

Un successeur a donc plus d'une condition d'acceptation. Générer un exécutable est insuffisant si sa sortie change ; accepter un programme est insuffisant si la politique du langage exige son rejet. Le test des diagnostics préserve des comportements qu'un benchmark limité aux succès ignorerait.

Le [README versionné](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) liste des limites concrètes telles que l'arithmétique `long double` partielle et les cibles différées. Ces limites sont des informations héritées utiles : modifier un rejet documenté est une décision de fonctionnalité, et non automatiquement une correction de régression.

## Ce que le harnais LLVM compare réellement

Le [lanceur LLVM-suite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) public configure la suite avec le compilateur testé, construit les exécutables et compare leur sortie avec des fichiers de référence. Sa comparaison directe est basée sur les jetons d'espacement : les jetons non numériques doivent correspondre exactement ; les jetons numériques utilisent une tolérance de virgule flottante configurable, par défaut à 1e-4 ; le code de sortie final doit correspondre exactement.

Ceci illustre pourquoi un décompte de tests nécessite un manifeste et une politique de comparaison. Le sous-ensemble Regression/C de 36 cas documenté du lanceur constitue un périmètre d'évaluation différent des 1 820 cas conservés du registre de continuation. L'instantané plus restreint ne peut être utilisé pour déduire le taux de réussite initial du passage de relais, et soustraire les deux totaux ne permettrait pas de mesurer les progrès.

## Maintenir le résultat du passage de relais rattaché à son périmètre

| Élément | Ce que le registre de continuation rapporte |
| --- | --- |
| Transition de modèle | GLM 5.2 → DeepSeek V4 Flash |
| Contexte conversationnel transporté | 0 |
| État du projet préservé | Lignée du compilateur acceptée |
| Profondeur de récursion des tâches | 4 → 8 |
| Évaluation finale | 1 820/1 820 cas LLVM SingleSource conservés |

Source : [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Ce sont des résultats rapportés par le projet pour un passage de relais. La profondeur de récursion décrit la décomposition des tâches ; le résultat du test fournit la preuve comportementale.

Le compilateur initial et les registres de continuation pointent vers le même dépôt. Ils ne doivent pas être comptabilisés comme deux projets de compilateur indépendants, et leurs totaux de tests aux périmètres différents doivent rester séparés.

## Rendre un passage de relais inspectable

Pour un développeur appliquant cette approche, un ensemble de passage de relais utile se compose d'une révision acceptée, des commandes de construction, des contrats d'interface, du manifeste de régression exact et des exclusions connues. Il s'agit d'une recommandation pratique tirée de l'architecture et des harnais publics, plutôt que d'une affirmation selon laquelle un ensemble complet de cette forme a été archivé pour l'expérience.

Commencez par une modification mineure et comparez ses artefacts intermédiaires, ses diagnostics et le comportement de l'exécutable par rapport à cette révision. La [vue de l'historique de développement Genesis](/news/genesis-development-history) fournit un contexte connexe pour suivre les contributions après que l'agent qui les a réalisées a terminé sa tâche.
