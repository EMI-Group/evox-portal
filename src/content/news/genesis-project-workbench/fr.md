---
title: "Genesis réunit projets, conversations et Git dans un même espace de travail"
pubDate: 2026-11-22
summary: "Les brouillons propres à chaque projet et les espaces VCT conservent le contexte du bon dépôt et du bon nœud lors des changements de tâche."
---

Passer d’une conversation à une tâche de développement puis aux modifications Git ne devrait pas obliger à reconstruire le contexte du projet. La PR #175 de Genesis, fusionnée dans `main` le 20 novembre 2026, introduit un espace de travail LiveView avec navigation par projet, onglets, historiques des tâches et conversations, panneau Git et réglages sur place. Les changements associés aux espaces VCT et à la portée des brouillons permettent de conserver l’identité du projet entre ces vues. [Intégration fusionnée][pr]

![Des tiroirs de projets distincts conservent leurs notes et outils sur un même établi](./cover.webp)

*Illustration conceptuelle : chaque projet conserve son contexte de travail.*

## Consulter le projet au même endroit

Cet espace rapproche navigation et vues de travail. Vous pouvez revenir à un projet, consulter ses tâches ou conversations, puis examiner les modifications Git sans repartir de zéro à chaque vue. L’intégration conserve le sélecteur d’espaces VCT, la configuration des comptes et la pause/reprise des tâches. Elle restaure aussi le contexte d’approbation après reconnexion. Ces améliorations prolongent le [flux de tâches Assistant précédent][previous] ; ses approbations structurées déterminent toujours l’action autorisée. [Intégration][pr]

Prenons un développeur alternant entre une bibliothèque et l’application qui l’utilise. Le brouillon destiné à la bibliothèque doit y rester lorsqu’il ouvre l’onglet de l’application. Une opération Git doit viser le serveur et le dépôt du projet sélectionné. Les modifications fusionnées vérifient l’appartenance du projet avant ces opérations et conservent le nœud sélectionné si la connexion est indisponible, sans rediriger l’opération vers l’hôte du tableau de bord.

## L’identité d’un brouillon dépasse le chemin

Le module partagé `DraftScope` définit un brouillon du navigateur par `{node, token}`. Un projet déjà monté dans le Virtual Context Tree utilise son point `vct:///projects/<name>` ; sinon, son chemin absolu système sert de repli. Le point est prioritaire lorsque les deux existent. Ainsi, plusieurs écritures du chemin d’un même projet monté retrouvent un seul brouillon, tandis que deux points VCT portant sur le même chemin restent distincts. [Implémentation][scope]

La clé de stockage du navigateur associe le nœud à ce jeton. Une correction ultérieure récupère le brouillon indexé par chemin lorsque le point VCT devient disponible, couvrant le passage du choix d’un répertoire à l’enregistrement du projet. Il s’agit de continuité du brouillon dans le navigateur, distincte de la persistance des tâches et d’une garantie de restauration durable des conversations après redémarrage du serveur. [Récupération du brouillon][adopt]

Pour un projet distant, le chemin doit aussi être conservé tel quel : le tableau de bord ne doit pas le normaliser selon le système de fichiers de l’hôte du navigateur. Avant d’envoyer un brouillon restauré, vérifiez nœud, dépôt et modèle, surtout après un changement entre projets locaux et distants.

## Les espaces regroupent les projets ; les tâches exigent un répertoire

VCT possède désormais un niveau de regroupement à `vct:///workspaces/<name>`. Un espace comporte une liste ordonnée de membres et une description facultative. Les membres désignent des points de montage de projets ou des chemins système ; les espaces ne s’imbriquent pas. La palette Projects et le sélecteur Assistant peuvent afficher ces groupes, dont les API en lecture seule permettent d’inspecter les membres. [Interface opérateur][workspace]

Un groupe n’a pas son propre répertoire d’exécution. `DraftScope.path/1` ne renvoie donc aucun chemin pour une sélection limitée à un espace, et l’admission des tâches refuse les points VCT comme chemins d’exécution. Pour la bibliothèque et son application, regroupez les deux afin de les parcourir ensemble, puis choisissez le membre concret qui recevra la tâche. Un espace ne transforme pas tous ses membres en cibles implicites d’écriture.

Depuis les sources, `mix vct.workspace list` et `mix vct.workspace show <name>` inspectent les groupes. La commande `create` documentée accepte plusieurs arguments `--member` et un `--data-dir` facultatif ; utilisez le répertoire de données de l’instance Genesis visée. L’inspection signale les membres manquants au lieu de les omettre. Consultez le contrat de commande avant de modifier un groupe.

## Vérifier le passage entre les vues

La PR rapporte des vérifications dans le navigateur pour créer et terminer une tâche, envoyer au clavier et afficher le flux Assistant, ainsi que consulter la configuration des comptes. Elle signale aussi un dépassement de délai lors d’une requête Assistant limitée à un projet. Pour un travail long, l’acceptation d’une demande et l’observation de son résultat restent deux événements différents. [Vérifications][pr]

Sur une compilation contenant ces changements, essayez deux projets avec des brouillons différents, reconnectez le nœud sélectionné et ouvrez le panneau Git du projet voulu. Vérifiez que le brouillon revient au bon projet et que l’approbation désigne toujours la cible réelle. Suivez ensuite l’état enregistré de la tâche : un onglet restauré ne prouve pas que le travail de fond est terminé.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[previous]: /fr/news/genesis-assistant-project-workflows
[scope]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_dash/lib/evo_dash_web/live/draft_scope.ex
[adopt]: https://github.com/EMI-Group/genesis/commit/a0f7b141ed448590030f6d36de951bbb1ca3673e
[workspace]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/mix/tasks/vct.workspace.ex
