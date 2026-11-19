---
title: "Genesis 0.14.3 : mettre une tâche en pause, reprendre tout son arbre d’agents"
pubDate: 2026-11-19
summary: "Les points de contrôle persistants par agent relient la reprise des tâches, les phases visibles et une concurrence des outils bornée."
---

Un travail de développement long exige plus qu’un bouton de redémarrage : il faut conserver les agents actifs, leurs acquis et l’état des fichiers réellement récupérable. [Genesis 0.14.3][release], publié le 19 novembre 2026, réunit pause et reprise par tâche, état persistant des agents, activité en direct plus claire et améliorations de configuration, d’approbation et de déploiement.

![Un arbre mécanique ramifié se reconnecte à ses bases ancrées individuellement](./whole-tree-resume.webp)

*Illustration conceptuelle : restaurer une tâche, c’est reconnecter ses branches à leur propre état sauvegardé.*

## Suspendre une tâche sans l’annuler
Une tâche en cours passe de `pausing` à `paused`. Ses agents terminent les lots d’outils en cours, enregistrent leurs conversations et créent un commit de leurs arbres de travail avant de s’arrêter. La tâche reste visible et peut reprendre ; elle n’est ni terminée ni annulée. La reprise conserve le même identifiant de tâche.

Cela permet d’interrompre une implémentation multi-agent entre deux séances. Gardez la persistance activée, demandez la pause et attendez l’état suspendu avant de considérer le travail comme stabilisé. Activée par défaut, cette option se règle aussi via `persistent_state` dans `genesis_start_task`. Les sessions interactives ne peuvent pas être suspendues et une tâche sans persistance ne peut pas reprendre. L’[implémentation versionnée][pause] exige également un enregistrement durable de l’agent racine : les seuls enregistrements enfants ne suffisent pas.
## Restaurer l’arbre avec une limite explicite sur les fichiers
Un stockage SQLite séparé conserve conversations, identités d’exécution et progression des lots d’outils et de sous-agents. À la reprise de l’arbre, les enfants terminés fournissent leurs résultats sauvegardés ; ceux qui travaillaient repartent de leurs propres points de contrôle et bases de travail. Les identifiants stables maintiennent ces associations, avec un avertissement et un recours de secours si une identité est occupée.

Les références Git sous `refs/genesis/agent-state` maintiennent les commits accessibles après récupération des branches de travail. Une pause propre permet de recréer l’arbre depuis le commit de pause enregistré. Après interruption, l’[avis de reprise][notice] indique le point garanti : les modifications non commitées de l’exécution arrêtée ne sont pas garanties. Sans point de contrôle, il explique le retour à la base de la tâche.

Si la tâche modifiait des fichiers et lançait des travaux, examinez le commit indiqué, `git status` et `job_list` avant de répéter les opérations. Les appels interrompus reçoivent des informations de réparation, pas des succès inventés. Cette version corrige aussi la création de sous-agents en double, la restauration erronée de sessions interactives comme tâches suspendues après incident et la récupération à la limite de tours.
## Voir ce qui semblait inactif
L’inspecteur et Assistant utilisent désormais l’activité en direct et des instantanés de surveillance atomiques. La compression du contexte et la préparation du tour suivant ont leurs propres phases occupées. Context Memory affiche les appels actifs en fin de liste, tout en gardant le raisonnement historique statique. Une période silencieuse devient plus facile à comprendre : compression et requête bloquée ne se confondent plus.

Les permis d’outils détenus par l’ordonnanceur bornent les appels concurrents et conservent leur propriété lors des transferts en arrière-plan. Les lancements abandonnés sont refusés ; le nettoyage de confinement après dépassement du délai se termine avant l’arrêt des tâches d’outils. Notifications de fin et sondes d’état du système quittent le chemin bloquant du registre ; la finalisation des sessions évite aussi les barrières synchrones de persistance. L’écriture des points de contrôle regroupe les travaux en attente et limite file et charge utile pour contenir la pression du stockage.
## Configuration et approbations plus explicites
Les API de paramètres fondées sur un schéma permettent les mises à jour partielles. Assistant peut découvrir la configuration et consulter les projets en lecture seule. Dialogues et notifications d’approbation exposent identité du demandeur, autorité et état d’exécution. Portée des notifications, gestion du focus, demande de permission et réduction des animations sont améliorées.

Les sessions Assistant liées au projet apportent également conversations isolées, téléversements et suivi des tâches ; l’[article sur ce workflow][workflow] détaille ces interactions. Les commandes explicites d’inventaire local des skills contournent les vérifications de permission des outils, et un commit automatique de secours intervient si l’étape de commit de l’agent manque ou échoue.
## Mettre à jour puis vérifier la reprise
Pour une installation existante du serveur sans interface native, le [guide versionné][update] documente :
```bash
genesis update --check
genesis update
```
La vérification renvoie le code 10 si une mise à jour existe. Laissez finir le travail actif avant l’opération ; l’outil vérifie l’activité, prépare la version, redémarre et contrôle la santé du serveur. Dans la nouvelle version, une tâche en cours de pause bloque encore la mise à jour, tandis qu’une tâche suspendue reste reprenable sans la bloquer. La publication fournit les paquets Linux x64, Linux ARM64 et macOS ARM64.

Les bases passent désormais par les migrations normales plutôt que par une réconciliation historique séparée. Les conflits d’identités anciennes sont réconciliés de façon additive ; les états résiduels ou incomplets sont refusés. La réparation SQLite est réservée au développement. Des assistants de reprise inutilisés et un alias de complétion quittent l’API publique : les intégrations personnalisées doivent examiner ces retraits.

Les dépendances comprennent Plug 1.20.4 et son correctif de sécurité sur la limite de longueur multipart, ainsi que ReqLLM 1.31.0 ; les empreintes Nix et contrôles préalables sont actualisés. Après mise à jour, vérifiez version et santé, puis essayez une petite tâche persistante : pause, contrôle du checkpoint, reprise de la même tâche, inspection des résultats enfants et des phases affichées. Consultez les [notes complètes][release] avec les diagnostics de migration propres au déploiement.

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.3
[pause]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/task_registry/pause.ex
[notice]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/agent/resume/notice.ex
[update]: https://github.com/EMI-Group/genesis/blob/v0.14.3/docs/server-update.md
[workflow]: /fr/news/genesis-assistant-project-workflows

