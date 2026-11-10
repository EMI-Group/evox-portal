---
title: "Genesis et MESA : Tracer les différences numériques à travers une réécriture de Fortran vers Rust"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "La précision de l'interpolation, les Jacobiens analytiques et des benchmarks aux entrées appariées montrent comment treize modules MESA ont été reconstruits et vérifiés en Rust."
---

La réécriture d'un logiciel scientifique peut produire des réponses plausibles tout en modifiant le chemin numérique qui les a générées. Le cas MESA de Genesis offre des vérifications concrètes pour ce problème : sorties Fortran originales, différences de virgule flottante expliquées, compteurs d'étapes du solveur et benchmarks comparant des charges de travail identiques.

![Sorties Fortran et Rust comparées à la loupe](./mesa-numerical-continuity.webp)

*Illustration conceptuelle : une nouvelle implémentation vérifiée par rapport au comportement numérique existant.*

Le registre [Evidence](https://genesis.evox.group/evidence/mesa/) fait état de treize modules redéveloppés, 139 414 lignes de Fortran et 89 946 lignes de Rust. Les détails d'ingénierie ci-dessous proviennent de la [révision 2ad071e du dépôt](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), dont les benchmarks documentés sont datés du 5 août 2026. Ces résultats de benchmark conservent leurs propres définitions de charge de travail et de chronométrage.

## Reconstruire une chaîne de dépendances, pas treize traductions isolées

L'espace de travail suit la chaîne allant des constantes, utilitaires et mathématiques aux matrices, à l'interpolation et aux solveurs numériques, jusqu'à la chimie, aux taux, aux pertes de neutrinos, aux réseaux de réactions, à l'équation d'état et à l'opacité. Chaque module d'origine possède une crate Rust correspondante. Le [manifeste de l'espace de travail](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) rend ces relations entre paquets explicites.

Cela signifie qu'une tâche de réseau de réactions dépend de la capacité des routines numériques et des données physiques à être utilisées ensemble. Les API publiques et les documents de contexte par répertoire fournissent le contrat d'intégration. L'[aperçu du dépôt](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) décrit les structures, méthodes et valeurs `Result` de Rust, en conservant les noms Fortran originaux dans la documentation lorsque cela est utile pour une vérification croisée.

L'implémentation inclut des solveurs Rust plutôt que d'appeler LAPACK ou BLAS via FFI. Le périmètre reste la pile numérique et physique sélectionnée : les moteurs complets d'évolution stellaire et binaire, le mélange EOS complet et d'autres composants listés sont en dehors du portage.

## Pourquoi un écart de sortie de référence n'a pas été résolu par une simple tolérance large

Le [test de référence d'interpolation bidimensionnelle](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) reconstruit la grille originale de 31 par 35 et les points d'évaluation. Il distingue les valeurs qui correspondent exactement de celles qui nécessitent une tolérance documentée.

L'investigation du test rapporte une divergence révélatrice. Certaines variables temporaires d'interpolation d'Hermite en Fortran original étaient implicitement en `REAL(4)` : de la simple précision au sein d'un calcul par ailleurs en plus haute précision. Le portage Rust utilise `f64`. Les commentaires du code source indiquent qu'une transcription Fortran explicitement en double précision correspondait au résultat Rust, tandis que le chemin original en précision mixte reproduisait l'ancienne sortie de référence.

La plus grande différence relative enregistrée pour ces valeurs d'interpolation était d'environ 3,05e-8, avec une tolérance relative de 1e-7. D'autres quantités conservent des comparaisons exactes ou des tolérances beaucoup plus serrées. Il s'agit d'une distinction technique utile : le test conserve l'origine d'une différence numérique au lieu de laisser chaque résultat dériver sous un seuil global unique. Le bloc de test `_sg` en simple précision reste en dehors du portage.

## Le réseau de réactions nécessitait le chemin des dérivées autant que celui des valeurs

Les [notes de développement du réseau de réactions](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) décrivent le travail sur le Jacobien analytique approx21, les dérivées utilisées par le solveur rigide (stiff). Leurs mesures avant/après montrent que la somme de contrôle se rapproche de Fortran et que les compteurs d'intégration atteignent une correspondance exacte.

Pour la charge de travail du benchmark documenté, les deux implémentations ont atteint **199 étapes : 198 acceptées et 1 rejetée**, avec **8 889 évaluations de fonction et 199 évaluations de Jacobien**. Ces compteurs aident à détecter une exécution apparemment plus rapide qui aurait simplement emprunté un chemin de résolution différent.

Une différence résiduelle de somme de contrôle d'environ 3,1e-9 subsistait. L'[assistant de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) l'attribue au fait que le chemin de valeur Fortran utilise la quadruple précision alors que Rust utilise f64. Le banc d'essai utilise donc une tolérance de somme de contrôle relative documentée de 1e-8 ; demander 1e-9 signale délibérément cette charge de travail. La correspondance des compteurs d'étapes soutient la comparaison, tandis que la différence du chemin de valeur reste explicite.

## Les tests d'intégration vérifient également que les modules sont réellement connectés

Un [test d'intégration à une zone](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) distinct exécute le brûleur avec un fournisseur de gaz parfait et avec un fournisseur de table EOS via l'interface publique `BurnEosInfo`. Il s'attend à ce que les deux calculs diffèrent, vérifie la conservation et les sorties finies, et vérifie que les appels EOS égalent la somme des évaluations de la fonction et du Jacobien.

Il s'agit d'un test de câblage avec une limite physique spécifique : la température de combustion dépasse le maximum de la table disponible, de sorte que la recherche EOS se bloque sur sa ligne supérieure. Cela démontre que le fournisseur affecte le calcul ; il ne s'agit pas de la validation d'une EOS stellaire complète à haute température. Ses comptes d'étapes appartiennent également à ce test séparé, et non au benchmark ci-dessus.

## Comparer le même travail avant de rapporter un gain de vitesse

La [spécification de la charge de travail](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fixe les entrées, les tailles, les paramètres du solveur et les définitions de somme de contrôle pour les deux langages. Par exemple, le benchmark d'interpolation évalue deux millions de points déterministes sur la même grille ; la configuration est en dehors de cette boucle chronométrée.

L'[orchestrateur de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) lit les chronométrages internes du pilote et les sommes de contrôle, les compare et rédige un rapport. Le tableau du 5 août du README utilise les médianes de 15 exécutions épinglées sur les processeurs 0–3, comparant gfortran `-O3 -march=native` avec le profil release de Rust.

| Charge de travail sélectionnée | Fortran | Rust | Gain de vitesse rapporté |
| --- | --- | --- | --- |
| Deux millions d'évaluations bicubiques | 0,162522 s | 0,090700 s | 1,79× |
| Dix mille résolutions de Newton | 0,057918 s | 0,009029 s | 6,41× |
| Proxy de combustion approx21 à une zone | 0,303473 s | 0,243294 s | 1,25× |

Source : [tableau de benchmark versionné](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). La page Evidence rapporte séparément une plage médiane de 1,55–6,87×. Ces enregistrements n'établissent pas un gain de vitesse universel, et le proxy à une zone ne mesure pas une simulation stellaire complète.

## Suivre les points d'entrée des tests et des benchmarks

Le dépôt rapporte **1 052 réussis, 0 échoués et 18 ignorés**. Son README identifie l'ensemble ignoré comme étant les benchmarks et la combustion complète de longue durée. Dans un environnement Rust et Fortran préparé, les points d'entrée documentés sont :

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Ce sont des commandes documentées dans les sources, et non une nouvelle reproduction effectuée pour cet article. Le montant de 10,64 $ US du registre Evidence ne couvre que les jetons du modèle ; le modèle, le nombre d'épisodes et le temps réel n'ont pas été rapportés.

Pour une première inspection utile, lisez le test de référence d'interpolation parallèlement à ses comparaisons de sorties originales, puis suivez le contrat d'entrée du benchmark. Ce chemin rend la réécriture évaluable à travers un comportement numérique spécifique et un travail mesuré.
