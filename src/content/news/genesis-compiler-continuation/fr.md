---
title: "Genesis : préserver les progrès logiciels lors d'un changement de modèle"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Une reprise de compilateur explore comment code accepté, structure du projet et validations soutiennent le développement lorsque le modèle change."
---

*Mis à jour le 7 novembre 2026. Les résultats historiques conservent leur date de référence.*

Les systèmes d'IA évolutionnaire doivent préserver les progrès utiles lorsque leurs participants changent. La reprise de compilateur de Genesis examine cette exigence : un nouveau modèle peut-il poursuivre à partir du projet accepté, en utilisant son code, ses contraintes et ses tests comme base de travail ?

## Partir d’un compilateur existant

Le [dossier Evidence du 7 septembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) décrit un relais de **GLM 5.2 vers DeepSeek V4 Flash** sur la même lignée acceptée. Le nouveau modèle n’a pas reçu le contexte conversationnel précédent.

Il disposait néanmoins du code, de la structure et de l’historique accepté. L’expérience concerne la continuation d’un projet, pas la création d’un second compilateur indépendant.

## Préserver le système hérité

Un compilateur relie analyse syntaxique, analyse sémantique, représentations intermédiaires et génération de code. Une correction locale peut affecter d’autres modules : ajouter du code ne suffit pas, il faut intégrer et vérifier les régressions.

Le dépôt jcc présente son implémentation Rust, sa représentation intermédiaire, ses limites et ses outils de test. Son README décrit toutefois un autre état du développement et ne remplace pas le dossier de continuation.

## Les résultats rapportés

La profondeur récursive passe de **4 à 8**, avec **1 820/1 820 cas LLVM SingleSource retenus réussis** après le relais. Il s’agit de cet ensemble d’évaluation, pas de toute la suite LLVM.

La profondeur décrit la décomposition des tâches, pas directement la qualité. Les tests apportent l’information comportementale ; une fiabilité générale demanderait d’autres charges et des répétitions.

## Interpréter la continuité

L’enseignement pratique est de conserver ce qu’un successeur peut vérifier : code, interfaces, contraintes, modifications acceptées et procédures d’évaluation. La mémoire conversationnelle peut aider sans être l’unique support du progrès.

Commencez par la référence héritée et la liste exacte des tests. Consignez la révision validée, les exclusions et les commandes avant de comparer de nouvelles améliorations.

## Un développement qui accumule les acquis

Formation et continuation partagent [le même dépôt](https://github.com/EMI-Group/genesis-demo-jcc). Ne les comptez pas comme projets indépendants et ne cumulez pas des tests de périmètres différents. Le volume de code ajouté et le coût de continuation ne sont pas rapportés.

Ce cas rapporté par le projet transforme la continuité du développement en question d'architecture : que doit conserver un logiciel pour que d'autres agents puissent l'étendre ? Dans l'écosystème EvoX, cela relie capacité des modèles et développement cumulatif des systèmes. Le jeu de tests retenu étaye cette reprise ; une fiabilité plus générale demande d'autres évaluations.
