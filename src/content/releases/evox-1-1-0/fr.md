---
title: "Sortie d'EvoX 1.1 : Désormais avec torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduit l'intégration complète de torch.compile (TorchDynamo), remplaçant TorchScript pour une meilleure compatibilité et performance."
---

Nous sommes ravis d'annoncer la sortie d'**EvoX 1.1**, introduisant l'**intégration complète de torch.compile (TorchDynamo)** comme compilateur backend ! Cette mise à jour remplace l'approche précédente basée sur TorchScript, rendant EvoX **plus convivial et hautement compatible avec l'écosystème Python au sens large**.

En tirant parti de **torch.compile**, EvoX capture désormais les graphes de calcul dynamiquement lors de l'exécution, éliminant le besoin de traçage manuel tout en optimisant automatiquement les performances.

**Quoi de neuf ?**

**torch.compile : Une compilation plus intelligente et plus flexible**

Dans EvoX 1.1, nous adoptons pleinement **torch.compile** comme nouveau backend de compilation. Contrairement à l'approche précédente basée sur le traçage, torch.compile — qui **utilise TorchDynamo en interne** — intercepte l'exécution Python, extrait dynamiquement les graphes de calcul et les optimise en temps réel.

Cela signifie :

- **Plus de traçage manuel** — Appelez simplement **torch.compile(workflow.step)**, et EvoX s'occupe du reste.

- **Compatibilité Python transparente** — Fonctionne avec les fonctions Python natives et les bibliothèques externes comme NumPy et SciPy.

- **Meilleures performances** — Les graphes de calcul optimisés entraînent une **exécution plus rapide et une meilleure utilisation du matériel**.

- **Conception pérenne** — S'aligne sur la feuille de route de PyTorch, garantissant une compatibilité à long terme et des améliorations de performance.

**Pourquoi passer de TorchScript à torch.compile ?**

Dans les versions précédentes, EvoX s'appuyait sur des **méthodes basées sur le traçage** :

- **Pre-1.0.0** utilisait le **traçage JAX** pour l'extraction du graphe de calcul.

- **v1.0.0** est passé à **TorchScript**, améliorant l'intégration de PyTorch.

Cependant, ces méthodes présentaient plusieurs inconvénients :

- **Complexe à utiliser** — Les utilisateurs devaient tracer manuellement les graphes et gérer un débogage complexe.

- **Compatibilité limitée** — Difficultés avec les flux de travail dynamiques et les fonctions non-PyTorch.

- **Flexibilité restreinte** — Les boucles, les conditions et autres constructions Python n'étaient pas toujours correctement capturées.

Avec torch.compile et **TorchDynamo**, **ces problèmes ont disparu**. EvoX optimise désormais dynamiquement, prenant en charge une gamme plus large de flux de travail avec **zéro effort supplémentaire de la part des utilisateurs**.

**Comment EvoX 1.1 vous facilite la vie**

- **Plus de tracas avec le traçage** — Tout se passe en coulisses, rendant votre code plus propre et plus facile à maintenir.

- **Fonctionne avec votre code Python existant** — Pas besoin de modifier votre flux de travail pour la compatibilité.

- **Exécution plus rapide, meilleure mise à l'échelle** — Bénéficiez des dernières optimisations de PyTorch pour les GPU et les TPU.

- **Prêt pour l'avenir** — Restez aligné avec l'évolution à long terme de PyTorch, assurant des gains de performance continus.

**Passez à EvoX 1.1 dès maintenant !**

EvoX 1.1 est maintenant officiellement disponible ! Mettez à jour dès aujourd'hui pour faire l'expérience d'un flux de travail informatique **plus intelligent, plus rapide et plus intuitif**.

**Obtenir EvoX 1.1** : [GitHub](https://github.com/EMI-Group/EvoX)

Des questions ou des commentaires ? Ouvrez une issue sur GitHub ou rejoignez notre discussion communautaire. Repoussons ensemble les limites de l'**intelligence computationnelle !**

**Code source / Communauté / Documentation**

Article : [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub : [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentation : [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Groupe QQ : 297969717

![4.png](./evox-1-1-0-1.png)