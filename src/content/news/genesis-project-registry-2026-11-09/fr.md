---
title: "Développement de Genesis : un registre persistant pour les projets"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Les changements du 9 novembre sur main relient la navigation à un registre VCT persistant. Identité stable, chargement par hôte et migration protégée clarifient le passage du local au distant."
---

Le chemin d'un dépôt n'a de sens que sur la machine qui le possède. Un portable et un serveur peuvent contenir un dossier `demo`, mais en ouvrir un ne doit pas sélectionner discrètement l'autre. Les changements intégrés à **Genesis main le 9 novembre 2026** remplacent le suivi des projets récents dans Projects par un registre en base de données et font passer l'activation par le nœud sélectionné. [Intégration dans Projects][projects]

![Des dossiers de projets restent dans des armoires distinctes par hôte avec leurs étiquettes de registre](./project-host-registry.webp)

## Une identité conservée à la réouverture

Le Virtual Context Tree, ou VCT, associe un chemin absolu du système à un point canonique tel que `vct:///projects/demo`. Un mount est cette correspondance : point, chemin, nom affiché et date de dernière ouverture. Il stabilise l'identité de navigation sans déplacer le dépôt ni créer de montage de système de fichiers. [Implémentation du registre][store]

Réenregistrer le même chemin normalisé actualise sa date et conserve son point. Des chemins différents au même nom final reçoivent des points distincts, avec suffixes si nécessaire. Si l'ancien chemin n'existe plus, un nouveau chemin dont le nom affiché et le nom final du point correspondent peut reprendre ce point. Il s'agit d'une règle précise de déplacement, pas d'une déduction générale à partir de noms ressemblants. [Règles d'identité][identity]

La persistance repose sur la table SQLite `vct_mounts` du stockage des tâches. Le processus VCT garde un cache de lecture ; chaque modification écrit atomiquement toute la table avant de changer ce cache. Un échec de persistance renvoie une erreur et conserve l'état précédent. Une modification réussie émet une notification indiquant le nœud, reliant l'identité stockée au rafraîchissement de l'interface.

Le registre est borné : il conserve par défaut les 100 mounts les plus récents et retire les plus anciens au-delà. C'est un outil de navigation quotidienne, pas une archive illimitée de tous les dépôts ouverts. [Stockage et capacité][store]

## Rechercher et ouvrir à partir du même registre

La page Projects et la palette de projets utilisent les mounts enregistrés. Ouvrir ou créer un projet appelle l'interface `mount_project` tenant compte du nœud, puis recharge la liste. Les suggestions recherchent d'abord le texte dans les chemins enregistrés sans distinguer la casse, puis ajoutent les suggestions de préfixe du système de fichiers, sans doublons. Une partie d'un chemin familier suffit ainsi à retrouver un projet enregistré sans repartir de son dossier parent. [Changements de navigation][projects]

Le point VCT du projet actif est retrouvé dans les mounts déjà chargés pour l'affichage. Afficher un libellé n'enregistre donc pas un nouveau projet. Oublier un projet retire son entrée du registre, sans supprimer ses fichiers. Ces distinctions séparent la navigation des modifications du travail lui-même.

## Garder l'hôte sélectionné dans le parcours

Prenons un développeur ayant un `demo` local et un autre sur un serveur SSH. Sélectionner l'hôte distant charge sa liste de projets. Pendant la connexion, la liste reste vide au lieu de proposer des projets locaux comme projets distants. L'activation attend également que la connexion soit prête, afin qu'une demande destinée au serveur ne s'exécute pas sur le nœud encore local. [Chargement distant et activation][projects]

Les chemins distants sont interprétés selon l'hôte choisi, y compris les chemins absolus POSIX et Windows pris en charge. L'activation distante est asynchrone pour ne pas bloquer LiveView pendant les vérifications et l'enregistrement. Un correctif ultérieur déballe correctement le résultat distant afin que le projet reçoive son point VCT. [Correctif du mount distant][remote]

La vérification utile est alors concrète : reconnectez le serveur, recherchez son chemin enregistré, ouvrez-le et vérifiez l'hôte et le point affiché. Répétez avec le dépôt local. Des noms proches ne doivent pas remplir une vue distante en attente avec le registre local.

## Reprendre délibérément les anciens projets

Dans les builds de développement contenant ce travail, la migration dérive des mounts VCT des anciennes lignes `projects` exploitables, conserve les noms non vides et traite les collisions de noms. Elle garde les 100 entrées les plus récentes. Les chemins vides ou relatifs sont journalisés et ignorés. Si l'ancienne table est illisible, la migration s'arrête et annule la transaction en conservant table et lignes, plutôt que de confondre une erreur de lecture avec une liste vide. [Protection de migration et tests amont][migration]

Avant d'essayer un tel build sur un environnement existant, sauvegardez les données de l'application sur chaque hôte concerné. Vérifiez ensuite les projets sur le bon hôte, la stabilité du point à la réouverture et la persistance après redémarrage. En cas d'erreur de migration au démarrage, conservez la base et les diagnostics pour investigation au lieu de supprimer le stockage pour obtenir une liste vide.

Ce travail rend visible la frontière du projet dès le choix du lieu de travail. Pour la séparation des historiques de code, lisez [Genesis multi-dépôts : un objectif, des historiques distincts](/fr/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
