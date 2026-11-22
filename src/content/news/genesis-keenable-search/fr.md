---
title: "Genesis ajoute une recherche facultative sans clé API"
pubDate: 2026-11-22
summary: "L’adaptateur Keenable active explicitement la recherche publique tout en conservant l’accès par clé et le fournisseur par défaut."
---

Une recherche menée par un Agent peut s’arrêter avant la première requête si elle exige un identifiant supplémentaire. La PR #174 de Genesis, fusionnée dans `main` le 19 novembre 2026, ajoute **Keenable**, fournisseur facultatif dont l’endpoint public fonctionne sans clé API configurée. Le comportement par défaut des installations existantes demeure. [Adaptateur fusionné][pr]

![Une entrée de bibliothèque ouverte mène à quelques documents référencés](./cover.webp)

*Illustration conceptuelle : une voie publique facultative vers la recherche Web.*

## Activer explicitement la voie publique

Dans `[tools.search]`, définissez `enabled = true` et `provider = "keenable"`. Sans clé, l’adaptateur envoie requête et limite de résultats à l’endpoint public avec `X-Keenable-Title: Genesis`, sans `X-API-Key`. Ajouter `KEENABLE_API_KEY` au stockage des identifiants sélectionne l’accès par clé. [Construction des requêtes][adapter]

L’implémentation modifie les deux contrôles nécessaires : le fournisseur sélectionné capable de fonctionner sans clé peut activer l’outil de recherche de l’Agent, et l’exécution ne le rejette plus pour cette seule absence. Les fournisseurs exigeant des identifiants conservent leurs contrôles.

## Lire les résultats avec leurs limites

Pour réunir des références documentaires, cela retire une étape de configuration. L’adaptateur transforme titres, URL et texte `snippet` dans le format de résultats existant. Il respecte `max_results` ; Keenable n’a pas d’équivalent à `search_depth`, donc cette option est ignorée. [Correspondance des réponses][adapter]

La voie publique est limitée par adresse IP. La PR rapporte des tests de construction, d’analyse et d’activation de l’outil, dont une exécution simulée, mais aucun appel réel à l’API Keenable. Après activation, lancez une petite requête depuis l’hôte d’exécution et inspectez sources et erreurs éventuelles avant une recherche plus vaste. [Vérifications enregistrées][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
