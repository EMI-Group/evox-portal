---
title: "Genesis et MESA : réécrire le code, préserver le comportement numérique"
pubDate: 2026-11-03
updatedDate: 2026-11-08
summary: "Treize modules MESA deviennent un workspace Rust. Les tests de référence et un proxy de combustion à une zone montrent comment le projet vérifie la continuité numérique."
---

Réécrire un logiciel scientifique exige de transmettre plus que des algorithmes : il faut préserver le comportement numérique dont dépendent les calculs suivants. Dans le cas MESA de Genesis, treize modules Fortran ont été redéveloppés en crates Rust, avec les sorties originales comme références. L’intérêt réside dans la manière de rendre cette continuité vérifiable.

![Une sculpture stellaire en couches surplombe deux anneaux de matériaux différents aux contours concordants](./mesa-numerical-continuity.webp)

*Illustration conceptuelle : une nouvelle implémentation, une référence numérique commune.*

## Treize modules dans une chaîne numérique connectée

Le [dossier du 7 septembre 2026](https://genesis.evox.group/evidence/mesa/) couvre **13 modules**, de **139 414 lignes Fortran à 89 946 lignes Rust**. Ces tailles de snapshot ne correspondent pas au seul code de bibliothèque.

Le port comprend interpolation, solveurs, réseaux de réactions, équation d’état et opacité. Il ne remplace pas tout MESA : moteurs d’évolution stellaire et binaire et autres composants documentés restent hors périmètre.

## Vérifier le calcul, pas seulement la compilation

Chaque module correspond à une crate avec interfaces et contraintes documentées. Les tests de référence comparent les sorties Fortran ; les tests d’intégration vérifient les interactions.

L’équivalence numérique exige une tolérance et une charge précises. Un scalaire identique peut masquer un chemin de résolution différent : le dépôt suit aussi les étapes d’intégration du proxy de combustion à une zone. Cela va au-delà d’une compilation réussie.

## Ce que contient le bilan des tests

Le dépôt rapporte **1 052 tests réussis, aucun échec et 18 tests ignorés**, dont des benchmarks et une combustion longue sur toute la durée. Le registre Evidence indique **10,64 dollars de frais de tokens du modèle**, hors matériel ; modèle, nombre d’épisodes et temps écoulé ne sont pas renseignés.

Ces résultats sont rapportés par la source pour une seule exécution, sans reproduction indépendante. Le périmètre documenté des modules et des charges constitue le point de départ pour les examiner.

## Deux instantanés, des accélérations différentes

[Evidence](https://genesis.evox.group/evidence/mesa/) rapporte **1,55–6,87× de gain médian**. Le tableau du README daté du 5 août utilise des médianes de 15 exécutions et donne **1,25×** pour le proxy de combustion à une zone de bout en bout. [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)

Pour le proxy de combustion à une zone, le README relève **199 pas d’intégration, 198 acceptés et 1 rejeté** dans les deux implémentations. Comparer ce déroulement et les tolérances de sortie éclaire mieux l’accélération que chronométrer des calculs suivant des chemins numériques différents.

## Reproduire une charge avant d’élargir le périmètre

Le [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md) précise outils, compilation, tests et pilotes de benchmark. Après préparation de l’environnement :

```bash
cargo test --workspace
```

Choisissez une charge pertinente et examinez ses sorties de référence, tolérances et pilotes dans le [dépôt MESA redéveloppé](https://github.com/EMI-Group/genesis-demo-mesa-rs). La [présentation de Genesis](/fr/news/evox-genesis) donne le contexte du développement agentique ; ce cas fournit une méthode concrète pour vérifier que la réécriture conserve le comportement nécessaire.
