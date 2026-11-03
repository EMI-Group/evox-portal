---
title: "Genesis reconstruit 13 modules MESA en Rust"
pubDate: 2026-11-03
summary: "Le cas MESA de Genesis illustre la réécriture de logiciels scientifiques : 1,052 tests réussis et 10.64 dollars de frais de tokens déclarés."
---

La réécriture scientifique doit préserver le comportement numérique existant. Le dossier MESA du 7 septembre 2026 décrit la conversion de **13 modules Fortran en crates Rust**, avec l’implémentation d’origine comme référence.

Il rapporte **139,414 lignes de Fortran → 89,946 lignes de Rust**, **1,052 tests réussis** et **10.64 dollars** de frais de tokens. Le dépôt décrit des tests de référence comparés aux sorties Fortran et signale 18 tests ignorés en plus des tests réussis.

Les accélérations médianes de **1.55–6.87×** indiquées dans Evidence concernent des benchmarks, pas MESA dans son ensemble. Séparément, le tableau du README daté du 5 août rapporte **1.25×** pour la combustion à une zone, utilisée comme charge représentative de bout en bout. Ces instantanés et charges distincts ne doivent pas être confondus.

Le portage couvre les modules numériques et physiques sélectionnés, pas tout MESA ; les moteurs d’évolution stellaire et binaire sont hors périmètre. Il montre comment vérifier le comportement d’un code existant pour guider sa réécriture. Les résultats sont déclarés par le projet, sans reproduction indépendante ; les frais de tokens excluent le matériel.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
