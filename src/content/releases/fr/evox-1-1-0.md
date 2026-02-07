---
title: "EvoX 1.1 : intégration de torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduit l'intégration complète de torch.compile (TorchDynamo), remplaçant TorchScript pour une meilleure compatibilité et performance."
---

Nous sommes ravis d'annoncer la sortie d'**EvoX 1.1**, introduisant l'**intégration complète de torch.compile (TorchDynamo)** comme compilateur backend ! Cette mise à jour remplace l'approche précédente basée sur TorchScript, rendant EvoX **plus convivial et hautement compatible avec l'écosystème Python élargi**.

En exploitant **torch.compile**, EvoX capture désormais les graphes de calcul de manière dynamique à l'exécution, éliminant le besoin de traçage manuel tout en optimisant automatiquement les performances.

**Quoi de neuf ?**

**torch.compile : une compilation plus intelligente et plus flexible**

Dans EvoX 1.1, nous adoptons pleinement **torch.compile** comme nouveau backend de compilation. Contrairement à l'approche précédente basée sur le traçage, torch.compile -- qui **utilise TorchDynamo en interne** -- intercepte l'exécution Python, extrait dynamiquement les graphes de calcul et les optimise en temps réel.

Cela signifie :

l  **Plus de traçage manuel** -- Il suffit d'appeler **torch.compile(workflow.step)**, et EvoX s'occupe du reste.

l  **Compatibilité transparente avec Python** -- Fonctionne avec les fonctions Python natives et les bibliothèques externes comme NumPy et SciPy.

l  **Meilleures performances** -- Les graphes de calcul optimisés permettent une **exécution plus rapide et une meilleure utilisation du matériel**.

l  **Conception pérenne** -- S'aligne sur la feuille de route de PyTorch, garantissant une compatibilité et des améliorations de performance à long terme.

**Pourquoi passer de TorchScript à torch.compile ?**

Dans les versions précédentes, EvoX reposait sur des **méthodes basées sur le traçage** :

l  **Avant la v1.0.0**, le **traçage JAX** était utilisé pour l'extraction des graphes de calcul.

l  **La v1.0.0** est passée à **TorchScript**, améliorant l'intégration avec PyTorch.

Cependant, ces méthodes présentaient plusieurs inconvénients :

l  **Complexité d'utilisation** -- Les utilisateurs devaient tracer manuellement les graphes et gérer un débogage complexe.

l  **Compatibilité limitée** -- Difficultés avec les workflows dynamiques et les fonctions non-PyTorch.

l  **Flexibilité restreinte** -- Les boucles, conditions et autres constructions Python n'étaient pas toujours correctement capturées.

Avec torch.compile et **TorchDynamo**, **ces problèmes appartiennent au passé**. EvoX optimise désormais de manière dynamique, prenant en charge un éventail plus large de workflows **sans aucun effort supplémentaire de la part des utilisateurs**.

**Comment EvoX 1.1 vous simplifie la vie**

l  **Plus de tracas avec le traçage** -- Tout se passe en coulisses, rendant votre code plus propre et plus facile à maintenir.

l  **Fonctionne avec votre code Python existant** -- Pas besoin de modifier votre workflow pour la compatibilité.

l  **Exécution plus rapide, meilleure mise à l'échelle** -- Profitez des dernières optimisations de PyTorch pour les GPU et TPU.

l  **Prêt pour l'avenir** -- Restez aligné avec l'évolution à long terme de PyTorch, garantissant des gains de performance continus.

**Passez à EvoX 1.1 dès maintenant !**

EvoX 1.1 est désormais officiellement disponible ! Mettez à jour dès aujourd'hui pour découvrir un workflow computationnel **plus intelligent, plus rapide et plus intuitif**.

**Obtenir EvoX 1.1** : [GitHub](https://github.com/EMI-Group/EvoX)

Des questions ou des retours ? Ouvrez une issue sur GitHub ou rejoignez notre discussion communautaire. Repoussons ensemble les limites de **l'intelligence computationnelle !**

**Code source / Communauté / Documentation**

Article : [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentation : [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Groupe QQ : 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
