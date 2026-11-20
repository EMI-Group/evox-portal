---
title: "Genesis convertit openJiuwen Agent Core de Python en Rust"
pubDate: 2026-11-20
updatedDate: 2026-11-20
summary: "Genesis a réimplémenté le SDK d’Agents en 30 crates Rust et 26 exemples exécutables. Le cas retrace le développement continu et la vérification des sessions, outils et workflows après migration."
---

openJiuwen Agent Core est un SDK Python pour créer des applications d’Agents : il relie appels de modèles, outils, workflows et état des sessions. Dans l’[Evidence publié le 20 novembre 2026][evidence], EvoX Genesis documente sa conversion en Rust, produisant **agent-core-rs** à partir du SDK Python v0.1.20 consulté en lecture seule.

Le résultat est un workspace de **30 crates Rust et 26 exemples exécutables**, issu d’une conversion initiale puis d’une tâche poursuivant le développement du code conservé. La question d’ingénierie porte sur les comportements préservés lors du changement de langage : restaurer les sessions, attendre l’approbation des outils et suivre la branche prévue dans les workflows.

![Illustration conceptuelle du passage de code Python à Rust avec des branches de workflow correspondantes](./contract-migration-v2.webp)

## Changer l’implémentation en préservant le contrat

Le workspace regroupe types partagés, accès aux modèles et outils, état des sessions, orchestration et points d’entrée applicatifs. Les artefacts exécutables couvrent workflows, DeepAgent, collaboration en équipe et CLI. Ces couches donnent un sens concret aux 30 crates : la conversion traverse plusieurs composantes d’une application d’Agents, avec le périmètre de chaque intégration dans la [matrice de couverture][parity].

L’[instantané 242b5b5][repo] vise les champs Card JSON, les formats d’échange avec les modèles, les sessions persistées, les références des workflows et le comportement de la CLI. Les types et traits Rust, l’exécution asynchrone avec Tokio et la sérialisation Serde remplacent les mécanismes Python. Les types partagés se situent sous leurs consommateurs ; les crates d’agrégation réexportent les API sans dupliquer leur comportement.

La compatibilité concerne le sous-ensemble implémenté. La [matrice de couverture][parity] distingue interfaces prises en charge, implémentations partielles et domaines différés : exécution distribuée, GPU/ML et certaines intégrations de fournisseurs ou services externes. Les chemins Unsupported typés renvoient une erreur explicite lorsqu’ils existent ; d’autres lacunes n’ont pas d’implémentation. Cette différence compte dans le choix d’une application à migrer.

## Une session restaurée, un outil qui attend

L’[exemple de session][session] enregistre un point de contrôle dans un stockage temporaire, crée une nouvelle session avec la même identité et la même racine de stockage, puis restaure l’état. Il franchit une frontière de stockage : garder le premier objet en mémoire ne démontrerait pas la même propriété.

Le scénario d’approbation place une barrière avant un appel d’outil simulé. Un compteur vérifie que l’outil n’a pas été exécuté pendant l’attente. Un nouvel appel avec les données d’approbation correspondantes autorise l’exécution. Un modèle scripté et un outil instrumenté rendent cet ordre observable sans identifiants de fournisseur.

L’[exemple de workflow][workflow] vérifie une autre difficulté d’intégration. Deux entrées empruntent les branches courte et longue d’une même topologie compilée, avec transmission des valeurs par références aux champs des nœuds. Relier directement deux prédécesseurs mutuellement exclusifs créerait une conjonction attendant les deux. Des composants de transfert et une activation explicite des routes permettent à chaque branche d’atteindre la fin commune. Conserver les noms des champs ne suffit donc pas à préserver l’ordonnancement.

## Deux tâches, un périmètre de coût défini

L’[annexe historique][history] décrit une conversion du 11 au 16 novembre UTC, arrêtée manuellement en conservant son résultat, puis une tâche d’évolution achevée le 19 novembre UTC. Les appels attribués à DeepSeek V4 Flash totalisent **150,024283 dollars** pour ces deux tâches. La seconde tâche reprend la révision produite par la première, montrant comment conserver une implémentation existante et poursuivre son développement au-delà des limites d’une tâche.

Leurs durées cumulées atteignent **113 heures et 42 minutes**, attentes et files comprises ; l’intervalle calendaire dépasse huit jours. Les 3 570 instances d’Agent enregistrées sont un cumul, pas un pic de concurrence. Le coût exclut l’infrastructure, le travail humain et la documentation ultérieure. Une tâche intermédiaire échouée est exclue, sa consommation étant inconnue.

L’annexe compte également 1 434 767 lignes physiques Rust, commentaires et lignes vides compris, réparties entre production, tests et exemples. Ce volume décrit l’artefact ; les vérifications comportementales déterminent ce que la réécriture préserve.

## Ce qu’établit la vérification

Le [compte rendu][parity] annonce la réussite du formatage, de Clippy, des tests hors ligne du workspace, de Rustdoc, de sept groupes de fonctionnalités et de la compilation des exemples. **24 293 désigne le nombre de fonctions de test dans les sources**, pas un total de réussites capturé lors d’une exécution. Cinq entrées ignorées sont des auxiliaires ou des sondes dépendantes de l’environnement. La tâche documentaire ultérieure n’a relancé qu’une sélection de contrôles.

Modèles scriptés, faux serveurs locaux, stockage temporaire et sockets de boucle locale éprouvent les protocoles et l’exécution. Les contrôles sont répétables sans identifiants réels ; la réussite des tâches avec de vrais modèles reste à évaluer séparément. Ces résultats sont rapportés par le projet ; nous n’avons pas réexécuté indépendamment la suite Rust.

## Des gains locaux, dans le périmètre mesuré

Le [rapport de performances][bench] compare Rust en mode release à CPython 3.11.15 sur une machine Linux à huit CPU logiques, avec cache de pages chaud. Le rendu de prompts prend **0,356 µs contre 16,37 µs**, soit environ **46×** moins de temps. Un graphe de deux nœuds sans I/O prend **7,23 µs contre 112,3 µs**, soit environ **15×**.

Les lots répétés sont normalisés par opération ; ceux de Rust sont dix fois plus grands. La forme logique du graphe correspond, mais les moteurs diffèrent. Les ratios mesurent le surcoût local du framework, hors latence modèle/réseau, démarrage à cache froid et montée en concurrence. Les mesures séparées du premier graphe Python et d’un tour d’Agent scripté Rust portent sur des tâches différentes : elles ne fournissent pas de ratio comparable de démarrage ou de mémoire.

## Partir d’un comportement à préserver

Pour évaluer une migration, les exemples de reprise, d’approbation et de routage conditionnel offrent des critères d’acceptation concrets. Vérifiez l’intégration visée dans la [matrice][parity], préparez l’environnement de compilation, puis utilisez `make verify`. La commande `cargo test --workspace --offline --no-fail-fast` inclut les crates de développement omises par un simple `cargo test`.

Le workspace est distribué sous forme de sources, avec `publish = false`. Consultez l’[Evidence complet][evidence] et l’[implémentation figée][repo]. Avec le précédent cas de [réimplémentation de MESA](/fr/news/genesis-mesa), ce dossier montre comment évaluer le redéveloppement par Genesis à travers les comportements préservés et la nouvelle implémentation.

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

