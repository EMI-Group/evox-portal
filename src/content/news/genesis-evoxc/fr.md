---
title: "EvoX Compiler : une pile explicite de graphes de tenseurs construite avec Genesis"
pubDate: 2026-11-03
summary: "Le cas EvoX Compiler de Genesis présente un compilateur et un runtime Python pour graphes de tenseurs, avec NumPy, IREE, XLA et TVM."
---

EvoX Compiler (evoxc) fait du graphe de calcul un objet inspectable. Son frontend construit et transforme EvoXIR ; des étapes explicites assurent l’abaissement, la compilation, le chargement et l’exécution. NumPy est la seule dépendance obligatoire ; les compilateurs externes assurent l’optimisation et la génération de code.

L’instantané Evidence du **28 octobre 2026** documente quatre voies : **NumPy, IREE, XLA et TVM**. Le dépôt attribue à Genesis la production du code, des tests et des documents. Le cas suit la construction initiale puis le développement continu des interfaces et des backends.

Avec IREE installé, l’instantané rapporte **6,789 tests réussis, 46 ignorés et 3 échecs attendus**, sans échec. Ce sont des chiffres historiques, pas les totaux actuels. Les **285,659 lignes de texte suivies** incluent tests, données de benchmark et documentation, et ne mesurent pas le seul compilateur. Les frais de tokens sont estimés à **50 dollars**, hors matériel.

La validation dépend de la configuration : Vulkan utilisait un périphérique logiciel, tandis que ROCm via TVM n’était validé qu’à la compilation. Ces résultats sont déclarés par le projet, sans reproduction indépendante. Le pipeline explicite et les rapports de benchmark du dépôt offrent un point de départ aux développeurs.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
