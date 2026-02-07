---
title: "Démarrage rapide EvoX : exécutez du calcul évolutionnaire accéléré par GPU en 10 minutes"
pubDate: 2025-04-30
summary: "Un tutoriel pour débutants pour commencer le calcul évolutionnaire accéléré par GPU avec EvoX en seulement 10 minutes."
---

D'un côté, le calcul évolutionnaire est extrêmement puissant dans la recherche et l'ingénierie du monde réel, mais difficile à mettre en oeuvre. De l'autre, les capacités des GPU sont de plus en plus puissantes, mais il est difficile pour eux d'exercer leur puissance dans les tâches de calcul évolutionnaire.

Nous avons besoin d'une solution véritablement moderne : support GPU natif, architecture modulaire, interfaces claires, utilisabilité immédiate et extensibilité personnalisable. C'est EvoX -- un moteur de calcul évolutionnaire pour l'avenir.

Pour aider les utilisateurs à démarrer rapidement, l'équipe EvoX a publié le "Tutoriel pour débutants EvoX". Le tutoriel comprend 8 chapitres, couvrant tout, des bases aux applications pratiques avancées, vous guidant pas à pas pour exécuter des algorithmes évolutionnaires sur GPU.

**Ressources complètes du tutoriel**

Tutoriel en ligne en chinois :

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutoriel PDF en chinois :

Veuillez rejoindre le Groupe QQ pour l'obtenir : 297969717

Ensuite, nous allons vous guider à travers l'ensemble du processus, de l'installation à l'exécution, en seulement 10 minutes.

**Étape 1 : Configuration de l'environnement**

Ouvrez votre terminal et créez un environnement Python propre :

![代码片段1.png](/images/articles/quickstart-1.png)

Vous pouvez également utiliser votre outil préféré pour créer un environnement Python propre.

**Étape 2 : Installer PyTorch et EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Vérifiez si le GPU est disponible :

![代码片段3.png](/images/articles/quickstart-3.png)

**Étape 3 : Exécutez votre premier algorithme évolutionnaire**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

Que fait ce code ? Il compose un algorithme (PSO), un problème (Ackley) et un moniteur (EvalMonitor) via une interface standard. EvoX s'occupe de tout le parallélisme, l'accélération et la surveillance !

**Étape 4 : Tracer la courbe de convergence**

Une seule ligne suffit :

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

Vous voyez cette courbe descendante ? C'est la **trajectoire de votre algorithme évolutionnaire qui s'approche de la cible**, et **le chemin qu'il emprunte pour explorer le monde inconnu.**

**Étape 5 : Essayez d'étendre**

Si "simplement exécuter un Ackley" ne vous suffit pas, vous pouvez :

· Remplacer PSO par GA, DE, CMA-ES, NSGA-II, RVEA...
 · Remplacer Ackley par Rastrigin, Griewank, CEC2022
 · Passer à un problème multi-objectif en définissant n_objs >= 2
 · Implémenter votre propre logique avec MyProblem et MyAlgorithm
 · Se connecter à des modèles PyTorch ou des environnements d'apprentissage par renforcement (Gym, Brax, MuJoCo Playground)

Qu'il s'agisse de réglage d'hyperparamètres, de recherche d'architecture, de neuroévolution ou d'optimisation de stratégies de contrôle, EvoX gère tout cela avec facilité.

**Pourquoi choisir EvoX ?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Remerciements**

Ce tutoriel a été rédigé par **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** et **Xinyao Li**. **Beichen Huang** était responsable de la compilation, de l'édition et de la mise en ligne du tutoriel.

Nous remercions sincèrement chaque membre de la communauté EvoX. Ce sont nos efforts conjoints qui ont permis à EvoX de continuer à évoluer.

**Code open source / Ressources communautaires**

Article :

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub :

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projet amont (EvoX) :

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Groupe QQ : 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

Groupe QQ | Evolving Machine Intelligence

EvoMO est construit sur le framework EvoX. Si vous souhaitez en savoir plus sur EvoX, n'hésitez pas à consulter l'article officiel sur EvoX 1.0 publié sur notre compte public WeChat pour plus de détails.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
