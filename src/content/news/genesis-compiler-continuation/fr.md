---
title: "Genesis poursuit le développement d’un compilateur après un changement de modèle"
pubDate: 2026-11-03
summary: "Le cas de continuation de Genesis rapporte 1,820/1,820 tests LLVM SingleSource retenus réussis après le passage de GLM 5.2 à DeepSeek V4 Flash."
---

Un projet peut-il progresser après un changement de modèle ? Le dossier Compiler Continuation, daté du 7 septembre 2026, décrit une reprise à partir du dépôt accepté du compilateur, sans transférer le contexte conversationnel de l’Agent précédent.

Le dossier rapporte un passage de **GLM 5.2 à DeepSeek V4 Flash**, avec une profondeur de récursion passant de **4 à 8**. La continuation a réussi **1,820/1,820 tests LLVM SingleSource retenus**. Ce résultat porte sur un ensemble défini, et non sur toute la suite LLVM.

Le code accepté et l’historique du projet servent de base aux travaux suivants : c’est ainsi que Genesis assure la continuité. La création du compilateur et sa continuation partagent un dépôt ; elles ne constituent pas deux projets indépendants.

Cette rétrospective suit le dossier Evidence. Les résultats sont déclarés par le projet, sans reproduction indépendante ; le coût de continuation et le volume de code ajouté ne sont pas renseignés. Le README de la branche par défaut décrit un autre instantané d’évaluation : ses chiffres ne doivent pas être fusionnés avec ceux de cette continuation.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
