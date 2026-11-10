---
title: "Genesis conçoit EvoX Compiler : contrats, tests de graphes et synchronisation des périphériques"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Comment Genesis a développé un compilateur de graphes de tenseurs autour d'étapes explicites, de vérifications de transformation et de contrats de backend, avec des exemples concrets issus de ses tests publics."
---

Concevoir un compilateur de graphes de tenseurs implique de maintenir la cohérence entre plusieurs implémentations d'un même calcul. Une transformation de graphe peut modifier la disposition des tenseurs ; un adaptateur peut rejeter une opération ; un appel au périphérique peut rendre la main avant la fin du calcul. Le cas d'EvoX Compiler développé par Genesis devient instructif lorsque ces frontières sont examinées individuellement.

![Graphes du compilateur vérifiés par rapport aux tests de régression](./compiler-contract-layers.webp)

L'[instantané Evidence du 28 octobre](https://genesis.evox.group/evidence/evoxc/) enregistre 6 789 tests réussis et environ 50 USD de frais de jetons de modèle. Pour analyser l'ingénierie derrière ces chiffres, cet article utilise également le code source v0.1.0 accessible publiquement. L'instantané et la version publiée présentent des totaux de tests différents ; les exemples d'implémentation ci-dessous sont identifiés par leur version.

## Transformer l'objectif en interfaces testables

EvoX Compiler possède le langage de tenseurs, le graphe EvoXIR et les interfaces de mise en œuvre (staging). Les compilateurs externes reçoivent sa représentation exportée et gèrent l'optimisation, l'ordonnancement et la génération de code. Ses [contrats de paquets](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) documentent le sens des dépendances : les types de valeurs et l'IR soutiennent le traçage et les opérations, tandis que les transformations et les adaptateurs s'appuient sur ces couches. Le paquet séparé `evoxc_hf` consomme l'API publique du compilateur ; le compilateur n'importe pas l'intégration du modèle.

Cette division donne au travail de développement local une frontière concrète. Par exemple, une transformation produit un autre graphe ordinaire plutôt que d'exiger que chaque backend comprenne le `vmap` de Python. Une lacune du backend doit devenir une erreur explicite au lieu de modifier silencieusement le chemin d'exécution. Les documents de contexte au niveau des paquets enregistrent les API et les contraintes qu'une autre tâche de développement doit préserver.

Le pipeline public est `trace → lower → compile → load → run`. Chaque étape renvoie un objet distinct. Les [tests de spécification](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) vérifient les entrées d'étape incorrectes, rejettent les appels directs en mode eager aux définitions de graphes et vérifient que les fonctions de commodité se déploient selon le pipeline documenté. Ils rejettent également la capture d'un tenseur concret à partir d'une fermeture (closure), à moins que l'auteur ne l'intègre explicitement. L'avantage pratique est qu'un raccourci apparemment pratique ne peut pas introduire discrètement un second ensemble de sémantiques.

Selon le rapport Evidence, le développement a progressé couche par couche, avec des vérifications pytest requises avant de passer à la couche suivante. Le dépôt fournit des contrats et des tests inspectables pour cette méthode ; il ne fournit pas de séquence archivée complète des décisions de l'agent.

## Une transformation de population vérifiée par rapport à deux références

Une fonctionnalité exigeante est `batch_functions` : combiner plusieurs programmes ayant des signatures d'entrée/sortie correspondantes en un seul graphe. Son contrat est plus strict que « le graphe combiné s'exécute » : la ligne de sortie *i* doit toujours être égale au résultat du programme *i*.

Les [tests d'intégration v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) utilisent un exemple court et lisible. À la même position du graphe, trois programmes effectuent `x + 1`, `x * 2` et `x - 3`. Avec `switch_ops=True`, le graphe fusionné représente les différentes opérations via une sélection par ligne. Les tests compilent ce graphe via le chemin CPU d'IREE et comparent sa sortie à la fois avec l'exécution NumPy du graphe fusionné et les résultats NumPy empilés des fonctions originales, à `rtol=atol=1e-5`.

Des vérifications sans compilateur inspectent la sortie StableHLO pour y trouver l'opération de sélection attendue. Une autre vérification fusionne des programmes identiques et compare le résultat avec `vmap`, où aucune sélection ne devrait être nécessaire. Ensemble, ces tests sondent la préservation du programme, l'exportation et l'intégration du backend, plutôt que d'utiliser la réussite de la compilation comme seule condition d'acceptation.

## Le placement sur le périphérique fait partie de la correction

Un exécutable tournant sur un GPU ne doit pas accepter de données hôtes en prétendant qu'elles résident déjà sur le périphérique. Les [tests de spécification des tenseurs et du placement](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) vérifient que les données ont un périphérique physique, que les transferts sont explicites via `Tensor.to(device)`, et qu'un placement invalide lève une `DeviceError`.

Cela importe également pour la mesure des performances. Si chaque appel transfère à nouveau les poids du modèle, un chiffre de latence mesure une charge de travail différente de celle qui les maintient résidents. La [documentation d'intégration de modèle v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) sépare le chargement du point de contrôle (checkpoint), le calcul forward et la mise en œuvre de l'exécutable. Les paramètres restent des entrées de graphe explicites, rendant leur placement visible.

## Un appel retourné n'est pas nécessairement un travail terminé

Le chemin résident sur périphérique de XLA peut mettre le travail en file d'attente et rendre la main avant la fin. Chronométrer uniquement `run` sous-estimerait donc l'exécution. Les [tests de synchronisation](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) vérifient le cycle de vie des événements : les exécutions accumulent des descripteurs de complétion ; `synchronize()` les attend et les détruit ; une seconde synchronisation n'effectue aucun travail de plugin supplémentaire.

Les cas d'erreur sont tout aussi spécifiques. Si l'attente échoue, les descripteurs restants doivent tout de même être traités et la première erreur levée. Un plugin qui ne fournit aucun événement de complétion doit déclencher une erreur explicite plutôt qu'une fausse affirmation de réussite.

Ces tests utilisent un petit plugin PJRT factice qui n'effectue aucun calcul numérique. Ils vérifient la sémantique de synchronisation et le nettoyage, et non le débit du GPU ou la précision numérique. Cette distinction permet de garder les preuves du test alignées avec l'affirmation.

## Séparer le résultat historique du résultat de la version

| Enregistrement | Configuration | Résultat rapporté |
| --- | --- | --- |
| Instantané Evidence du 28 octobre | IREE installé | 6 789 réussis ; 46 ignorés ; 3 échecs attendus ; 0 échoué |
| Instantané Evidence du 28 octobre | Sans compilateur | 6 367 réussis ; 95 ignorés ; 3 échecs attendus |
| README de la version v0.1.0 | Suites Core et intégration modèle, tous extras listés installés | 7 511 réussis ; 77 ignorés ; 4 échecs attendus ; 0 échoué |

Sources : [Vérification Evidence](https://genesis.evox.group/evidence/evoxc/#verification) et [état de la version versionnée](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Il s'agit d'exécutions rapportées par le projet. Les protections liées aux dépendances et au matériel expliquent les chemins non exercés ; un test CPU réussi n'est pas une validation de chaque accélérateur.

Les 285 659 lignes de texte suivies de l'instané Evidence incluent les tests, la documentation et le matériel de benchmark. Ses environ 50 USD couvrent les jetons de modèle, hors matériel ; le modèle, le nombre d'épisodes et le temps d'exécution actif n'ont pas été rapportés. L'étendue calendaire du dépôt ne correspond pas à un temps d'exécution autonome continu.

Le dépôt attribue à Genesis la production de son code, de ses tests et de sa documentation. Le résultat concret est un compilateur avec des contrats d'étape inspectables séparément, des tests de préservation de graphe et une sémantique de complétion sur périphérique. Commencez par le [test d'intégration de population](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) pour suivre une fonctionnalité à travers ces frontières ; l'aperçu d'[EvoX Compiler](/news/evox-compiler) explique le pipeline côté utilisateur.
