---
title: "EvoMO : conserver la faisabilité de chaque candidat"
pubDate: 2026-10-30
summary: "La sélection sous contraintes, la cohérence des populations impaires et le chemin OSP-NSDE amélioré facilitent le contrôle des expériences multiobjectifs."
---

Une bonne valeur d'objectif n'est utile que si le candidat respecte aussi les contraintes. Le 30 octobre 2026, EvoMO a intégré la [PR #48][s1] dans main, étendant la gestion des contraintes et corrigeant le suivi des populations. Trois questions se rejoignent : quelles solutions conserver, comment maintenir la correspondance de leurs états et combien coûte la sélection.

![Des trajectoires candidates franchissent une contrainte par une ouverture sélectionnée](./cover.webp)

*Illustration conceptuelle : la faisabilité accompagne le candidat pendant la sélection.*

## Préserver la faisabilité dans tout le traitement

Un problème contraint peut renvoyer `(fitness, cv)`, associant objectifs et violations. L'implémentation transporte ces informations à travers initialisation, sondes, reproduction, archives et remplacement des survivants. Les utilitaires communs traitent la violation totale positive, les égalités et les différentes formes de contraintes, tout en alignant les indices des décisions, aptitudes et états de contrainte.

Si deux candidats échangent leur position pendant la sélection, leur faisabilité doit les suivre. Dans une conception conciliant performance et ressources sous une limite stricte, trier seulement les objectifs pourrait retenir une solution séduisante mais irréalisable. L'état de contrainte permet à chaque algorithme d'appliquer sa règle documentée, qui reste propre à la méthode.

## Une population impaire doit rester valide

La modification corrige les incompatibilités de formes dès la première génération avec des populations demandées de 51 individus, notamment dans SparseEA, SparseEA2, DMMOEA et OSP_NSDE, parmi huit algorithmes. Appariement parental et nombre de descendants restent cohérents avec masques, aptitudes et contraintes. Cela compte lorsque la taille découle du budget expérimental plutôt que d'un nombre pair commode.

Les méthodes parcimonieuses et dynamiques reçoivent aussi des corrections de leur déroulement de référence. DMMOEA détecte les changements d'environnement en réévaluant un échantillon et actualise les caches d'aptitude et de contraintes. La famille SparseEA conserve la correspondance entre décisions et masques pendant variation et sélection. Ces détails déterminent la recherche réellement exécutée, au-delà de la simple réussite du programme.

## Accélérer la sélection dans un périmètre explicite

OSP-NSDE trie une fois les distances voisines et les actualise après les suppressions. Des noyaux Triton optionnels déplacent la troncature du front limite sur CUDA. Le chemin automatique couvre les appareils compatibles, float32/float64 et les populations demandées jusqu'à 128 ; les autres configurations utilisent PyTorch. Le classement non dominé reste sous PyTorch.

Pour compiler, initialisez d'abord puis utilisez `torch.compile(workflow.step, fullgraph=False)`. Prédiction, recherche locale et mélanges conservent des parties eager. Les mesures locales sur RTX 5060 Ti rapportées dans la PR utilisent synchronisation et budgets fixes ; les résultats complets montrent aussi que la compilation ne dépasse pas toujours l'exécution eager optimisée. Mesurez l'ensemble du travail pour choisir.

## Vérifier la recherche avant de l'agrandir

Quatre algorithmes publics sont ajoutés : MaOEAHAP, NRVMOEA, HEA et GCNMOEA. Les trois premiers refusent explicitement les tuples de contraintes. GCNMOEA utilise leur violation dans le remplacement du voisinage, tandis que d'autres composants restent fondés sur les objectifs. Consultez ces limites avant de considérer les méthodes comme interchangeables.

Pour une expérience existante, fixez la [source intégrée][s2], la graine et le budget, puis comparez objectifs et contraintes stockés à une nouvelle évaluation après un pas. Incluez une population impaire et un cas contraint. Consignez séparément faisabilité, qualité et temps. La [présentation de version EvoMO][related] fournit la base publiée ; cette évolution de main apporte les améliorations suivantes.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /fr/releases/evomo-0-3-1
