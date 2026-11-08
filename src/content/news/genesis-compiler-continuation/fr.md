---
title: "Genesis : préserver les progrès logiciels lors d'un changement de modèle"
pubDate: 2026-11-03
summary: "Une reprise de compilateur explore comment code accepté, structure du projet et validations soutiennent le développement lorsque le modèle change."
updatedDate: 2026-11-08
---

Le [dossier Evidence du 7 septembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) décrit un relais de **GLM 5.2 vers DeepSeek V4 Flash** sur la même lignée acceptée. Le nouveau modèle n’a pas reçu le contexte conversationnel précédent.

![Un pont continu relie deux surfaces de dessin différentes](./compiler-model-handoff.webp)

Il disposait néanmoins du code, de la structure et de l’historique accepté.

## Préserver le système hérité

Un compilateur relie analyse syntaxique, analyse sémantique, représentations intermédiaires et génération de code. Une correction locale peut affecter d’autres modules : ajouter du code ne suffit pas, il faut intégrer et vérifier les régressions.

Le dépôt jcc présente son implémentation Rust, sa représentation intermédiaire, ses limites et ses outils de test. Son README décrit toutefois un autre état du développement et ne remplace pas le dossier de continuation.

## Les résultats rapportés

La profondeur récursive passe de **4 à 8**, avec **1 820/1 820 cas LLVM SingleSource retenus réussis** après le relais. Il s’agit de cet ensemble d’évaluation, pas de toute la suite LLVM. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

La profondeur décrit la décomposition des tâches, pas directement la qualité. Les tests apportent l’information comportementale ; une fiabilité générale demanderait d’autres charges et des répétitions.

## Interpréter la continuité

L’enseignement pratique est de conserver ce qu’un successeur peut vérifier : code, interfaces, contraintes, modifications acceptées et procédures d’évaluation. La mémoire conversationnelle peut aider sans être l’unique support du progrès.

## Un développement qui accumule les acquis

Formation et continuation partagent [le même dépôt](https://github.com/EMI-Group/genesis-demo-jcc). Ne les comptez pas comme projets indépendants et ne cumulez pas des tests de périmètres différents. Le volume de code ajouté et le coût de continuation ne sont pas rapportés.

Un dossier de transfert utile réunit la révision acceptée, la liste des tests, les commandes et les exclusions connues. Confiez au modèle suivant une petite modification vérifiable, puis comparez-la à cette référence. La [vue de l’historique](/fr/news/genesis-development-history) explique comment suivre les contributions après la fin d’un agent.
