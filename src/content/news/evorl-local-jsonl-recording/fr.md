---
title: "EvoRL : conserver chaque écriture, lire un enregistrement par étape"
pubDate: 2026-11-13
summary: "L’enregistrement JSONL local conserve les métadonnées et les écritures de métriques, puis fusionne les étapes répétées sans SDK de suivi."
---

Une itération d’apprentissage peut produire plusieurs observations : une perte, un retour d’évaluation, puis une métrique corrigée. Assimiler chaque écriture à une nouvelle itération désaligne l’expérience ; supprimer les étapes répétées fait perdre de l’information. EvoRL, framework d’apprentissage par renforcement et d’apprentissage évolutionnaire, a ajouté [l’enregistrement JSONL local][change] à `main` le 12 novembre 2026. Un [ajustement des noms de fichiers][fix] a suivi le 13 novembre, heure de Pékin. Ces changements séparent l’historique des écritures de la vue alignée par étape utilisée pour l’analyse.

![Feuilles d’observations brutes conservées à côté d’archives regroupées par étape](./jsonl-recording-cover.webp)

*Illustration conceptuelle : conserver chaque observation et organiser leur vue fusionnée par étape d’apprentissage.*

## Un fichier local avec le contexte de l’expérience

Le choix `recorders=[log,jsonl]` sauvegarde des métriques lisibles par machine à côté des journaux ordinaires, sans ajouter de SDK de suivi. Le [guide de démarrage versionné][guide] décrit la configuration commune aux scripts d’apprentissage : le backend JSONL reçoit le projet, le nom d’exécution, la configuration résolue, les étiquettes, le chemin de sortie et le groupe facultatif.

L’initialisation écrit ce contexte dans un en-tête de métadonnées. Chaque écriture ajoute ensuite un objet JSON contenant l’entier `step` fourni et les données imbriquées `data`, puis vide le tampon du fichier. Le fichier brut conserve l’ordre d’arrivée, y compris les étapes désordonnées et les écritures répétées. Lors du transfert du répertoire de sortie vers une machine d’analyse distincte, configuration et observations voyagent ensemble dans un fichier local lisible.

## Fusionner à la lecture, pas à l’enregistrement

La fonction `load_jsonl_records(path)`, exportée par `evorl.recorders`, lit tout le jeu de données et renvoie une liste triée par étape. Elle fusionne récursivement les dictionnaires d’une même étape : les écritures ultérieures remplacent les valeurs en conflit, sans toucher aux métriques non mentionnées. Les tableaux sont remplacés intégralement ; un `null` ultérieur remplace aussi la valeur précédente. L’en-tête facultatif de première ligne est ignoré, et non intégré à la liste des métriques.

Supposons que la perte d’apprentissage et le retour d’évaluation soient écrits séparément à l’étape 10, puis que la perte soit corrigée. Le fichier brut garde les trois écritures. L’enregistrement chargé contient la dernière perte et le retour d’évaluation. Une étape 8 arrivée ensuite sera triée avant l’étape 10. Pour tracer les courbes d’apprentissage, l’identité de l’itération vient donc de `step`, non de la position de la ligne ni du nombre d’appels de journalisation.

## Ce qui survit à la sérialisation

[L’implémentation et les tests de régression][change] couvrent les valeurs NumPy, JAX et pandas. Les tableaux et Series deviennent des listes. Les DataFrames conservent colonnes et données des lignes, mais pas leur index. NaN, les infinis et les valeurs manquantes pandas deviennent JSON `null`. Si l’index identifie les échantillons, transformez-le en colonne explicite avant l’enregistrement : cette précaution découle du format effectivement conservé.

Les lignes malformées ou incomplètes provoquent une erreur indiquant le fichier et le numéro de ligne. Le chargeur ne supprime pas silencieusement un dernier enregistrement tronqué. Il charge l’ensemble des données en mémoire : prévoyez la mémoire d’analyse selon la taille cumulée du fichier. Une métrique applicative nommée `step` reste dans `data`, distincte du champ d’itération externe.

## Une destination distincte pour chaque exécution

L’ajustement partage `sanitize_filename` entre JSONL et les journaux créés par les scripts. Il remplace `/` par `_` : `MetaWorld/Hammer-v3` devient `MetaWorld_Hammer-v3`. Les autres caractères restent inchangés ; les métadonnées gardent le nom original. Les extensions `.jsonl` et `.log` séparent les fichiers. Cette règle remplace l’encodage en pourcentage du premier commit ; normaliser un nom ne garantit pas son unicité.

Réinitialiser le même chemin JSONL écrase son contenu. Utilisez un répertoire ou un nom distinct par exécution, surtout si les noms ne diffèrent que par une barre oblique ou un soulignement. Sur une copie des sources contenant les deux commits, commencez avec la configuration ci-dessus, puis vérifiez l’en-tête, la fusion des étapes répétées et la destination d’une petite expérience avant une exécution longue. Le [précédent article EvoRL][related] explique les gradients, les dispositifs de calcul et les formes des métriques ; cette mise à jour facilite la conservation et la réanalyse locale de ces observations.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /fr/news/evorl-jax-training-consistency
