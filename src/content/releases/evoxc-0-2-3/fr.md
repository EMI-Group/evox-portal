---
title: "EvoX Compiler v0.2.3 : installer le backend adapté à votre charge de travail"
pubDate: 2026-11-26
summary: "La série 0.2 apporte IREE 3.13, la découverte automatique des plugins XLA et des corrections numériques ; v0.2.3 fournit les artefacts de distribution vérifiés."
---

EvoX Compiler v0.2.3 a été publié le 25 novembre 2026 UTC, avec des wheels Python et une archive source. Sa courte note GitHub renvoie à la comparaison entre v0.2.2 et v0.2.3 ; le journal versionné décrit les changements substantiels de la série 0.2 et les réparations de packaging qui aboutissent à cette distribution. Pour migrer depuis 0.1, il faut surtout choisir le couple compilateur/runtime, sélectionner le périphérique physique et reprendre les vérifications numériques pertinentes. [Publication][release] · [Journal des modifications][changes]

![Un adaptateur détrompé aligné sur son connecteur, à côté d’un colis contrôlé](./cover.webp)

*Illustration conceptuelle : une distribution utilisable doit correspondre à son environnement d’exécution.*

## Garder compilateur et runtime compatibles

L’option IREE exige désormais un compilateur et un runtime de version au moins 3.13.0 et inférieure à 3.14. Les artefacts compilés dépendent des versions : un fichier produit avec un autre couple ne se charge pas nécessairement tel quel. Le projet amont a revalidé llvm-cpu et ROCm/HIP sur AMD Instinct MI300X avec ROCm 7.1, y compris des boucles et scans qui échouaient avec d’anciennes versions d’IREE. Ces vérifications ne couvrent pas automatiquement CUDA, l’exécution multi-rank ni tous les benchmarks de modèles. [Dépendances versionnées][requirements] · [Journal des modifications][changes]

L’adaptateur contrôle aussi le rapatriement vers l’hôte au lieu de se reposer aveuglément sur le raccourci du runtime. Cela compte lorsqu’un calcul réussit mais que la récupération de ses résultats échoue. La mémoire hôte peut conserver un chemin mappé ; les buffers du périphérique nécessitent un transfert explicite. Intégrez le temps de transfert à la charge applicative, en le distinguant du temps du noyau.

## Découvrir le plugin XLA, puis choisir son périphérique

L’enregistrement XLA ne sonde plus un plugin sans options avant que l’appelant puisse fournir son chemin. La découverte examine l’option explicite, sa variable d’environnement, les emplacements connus et les paquets de plugins JAX installés, sans importer JAX lui-même. La disponibilité est contrôlée à la compilation et au chargement, lorsque les options sont connues. Les fonctions de construction transmettent aussi les options résolues au chargement, corrigeant le cas où la compilation trouvait le plugin mais où le chargement perdait sa configuration. [Guide des backends][guide]

Un plugin ROCm doit servir un périphérique ROCm, et un plugin CUDA un périphérique CUDA. Fournir un plugin GPU tout en gardant le CPU par défaut est refusé. Pour une expérience GPU, choisissez le périphérique correspondant et déplacez explicitement les tenseurs. Vérifiez l’emplacement des sorties avant leur copie vers l’hôte. Un échec XLA vide également les emplacements de pointeurs de sortie en cache pour éviter leur réutilisation périmée lors d’un appel ultérieur.

## Vérifier la sémantique avant de comparer la vitesse

L’interpréteur de référence NumPy met en cache les plans de dispatch, libère les valeurs intermédiaires mortes à leur dernière utilisation et partage une instance immuable du périphérique hôte. Cela réduit la préparation et les allocations sans changer la manière publique d’appeler les opérations. Les mesures TensorNEAT du journal concernent des charges précises, pas un facteur d’accélération universel.

L’opération de reste compilée suit désormais NumPy floormod : le résultat prend le signe du diviseur. Les entrées négatives constituent donc un bon test de migration. Conservez des entrées fixes et les sorties de référence, puis comparez interpréteur et compilateur avec des tolérances adaptées aux types. Les réparations de packaging acceptent le répertoire de bibliothèques partagées embarqué par maturin et placent à plat les distributions testées, résolvant des échecs qui bloquaient leur publication. [Corrections enregistrées][changes]

## Mettre à niveau dans un environnement propre

Python 3.11 ou ultérieur est requis. Installez avec pip le wheel 0.2.3 choisi parmi les assets de la publication : des wheels Linux, macOS et Windows ainsi qu’une archive source sont proposés. Pour IREE, utilisez `pip install "evoxc[iree]==0.2.3"`, puis vérifiez les deux dépendances IREE. La distribution séparée evoxc-hf conserve sa propre version. Exécutez `pip check`, inspectez la version installée et reprenez un graphe représentatif, un reste négatif et un aller-retour de périphérique avant de migrer une charge plus importante. [Guide d’installation][guide]

Pour les transformations de graphes, opérations personnalisées et étapes explicites de compilation autour de ces backends, consultez l’article sur la [compilation personnalisée][related] avec la documentation de cette publication.

[release]: https://github.com/EMI-Group/evoxc/releases/tag/v0.2.3
[changes]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/CHANGELOG.md
[requirements]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/pyproject.toml
[guide]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/README.md
[related]: /fr/news/evoxc-custom-compilation-pipeline
