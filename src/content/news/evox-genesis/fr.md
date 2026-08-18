---
title: "EvoX Genesis : un système d'IA récursif pour l'évolution autonome des logiciels sur le long terme, qui a construit un compilateur C de 250 000 lignes à partir de zéro"
pubDate: 2026-08-17
summary: "L'équipe EvoX du Département de Science des Données et Intelligence Artificielle de la Hong Kong Polytechnic University a publié EvoX Genesis, un système d'IA récursif pour l'évolution autonome des logiciels sur le long terme. Au lieu de s'appuyer sur un agent persistant pour maintenir un développement de longue durée, il laisse le monde du logiciel évoluer par lui-même : à partir d'un dépôt vide, le système a construit un compilateur C de 248 989 lignes en 123,4 heures, pour un coût total en tokens de modèle de seulement 44,38 $."
---

# EvoX Genesis : un système d'IA récursif pour l'évolution autonome des logiciels sur le long terme, qui a construit un compilateur C de 250 000 lignes à partir de zéro

![image1.png](./evox-genesis-1.png)

L'équipe EvoX du Département de Science des Données et Intelligence Artificielle de la Hong Kong Polytechnic University a publié **EvoX Genesis**, un système d'IA récursif pour l'évolution autonome des logiciels sur le long terme.

EvoX Genesis ne repose plus sur un agent persistant pour soutenir un développement de longue durée. Il laisse au contraire le monde du logiciel évoluer par lui-même.

À partir d'un dépôt vide, le système a construit un **compilateur C de 248 989 lignes** en 123,4 heures, à travers 1 019 épisodes d'agent, pour un coût en tokens de modèle de seulement **44,38 $**.

<center>

## Le codage sur le long terme : une frontière qui recule sans cesse

</center>

Le temps de travail des agents de codage est passé de courtes tâches ponctuelles à plusieurs dizaines d'heures.

OpenAI a exécuté Codex à partir d'un dépôt vide pendant environ 25 heures d'affilée, produisant environ 30 000 lignes de code.

Anthropic a mobilisé 16 agents Claude, à travers près de 2 000 sessions, environ deux semaines et près de 20 000 $ de coûts d'API, pour construire de zéro un compilateur C d'environ 100 000 lignes.

Le temps s'allonge, les agents se multiplient et les logiciels deviennent de plus en plus complexes.

Mais le centre de la recherche reste l'agent :

des modèles plus puissants, des contextes plus longs, une mémoire plus persistante, plus d'agents.

**L'équipe EvoX a retourné la question dans une autre direction :**

**Pourquoi l'agent devrait-il persister ?**

Et si ce qui devait vraiment persister, c'était le monde du logiciel dans lequel il vit ?

<center>

## 123,4 heures, 250 000 lignes

</center>

Nous avons laissé EvoX Genesis partir d'un dépôt à l'implémentation vide.

Il n'y avait qu'un seul objectif : construire un compilateur C.

123,4 heures, 1 019 épisodes d'agent, **248 989 lignes de code** et un coût en tokens de modèle de seulement **44,38 $**.

Le compilateur final a réussi 220/220 tests de c-testsuite, 32/36 cas de test LLVM et 93/93 tests de programmes aléatoires Csmith.

Aucun compilateur existant n'attendait d'être complété — **il est parti de zéro.**

![image2.png](./evox-genesis-2.png)

<center>

_Figure 1 : résultats de l'expérience du compilateur C / taille du code, temps d'exécution, épisodes d'agent, coût et résultats de tests_

</center>

<center>

_(avec le modèle DeepSeek V4 Flash)_

</center>

<center>

## Ne pas maintenir l'agent en vie — maintenir le monde du logiciel en vie

</center>

La vie d'un logiciel complexe est naturellement plus longue qu'une session d'agent.

EvoX Genesis organise le logiciel en un monde logiciel qui se déploie récursivement :

les agents de niveau supérieur décomposent les objectifs, et de nouveaux agents accomplissent le travail en positions locales ;

une fois les résultats vérifiés, ils entrent dans l'historique des versions du logiciel et deviennent la réalité du prochain cycle de développement.

Puis les agents peuvent disparaître,

et de nouveaux agents continuent à partir du monde logiciel déjà constitué.

Ce qui persiste, ce n'est pas une conversation, pas un bloc-notes sans cesse croissant, et pas un « agent maître » toujours en ligne.

Ce qui persiste, ce sont le code, la structure, les contraintes, les résultats de vérification et l'histoire déjà écrite.

**Ce qui persiste, ce n'est pas l'agent, mais le monde du logiciel.**

**Agent does not persist. Its validated consequences do.**

C'est ainsi qu'EvoX Genesis soutient l'évolution autonome des logiciels sur le long terme. Pour les utilisateurs, cela signifie aussi quelque chose de très simple :

**Vous ne construisez pas des agents — vous décrivez seulement ce que le logiciel doit devenir.**

Nul besoin de concevoir à l'avance des agents, des rôles ou des flux de travail, ni de décomposer manuellement un arbre de tâches complet.

L'utilisateur se contente de décrire l'objectif de développement en un court texte ;

la décomposition des tâches, la génération des agents, le déploiement de la récursion et la vérification des résultats — tout cela est fait par EvoX Genesis lui-même.

![image3.png](./evox-genesis-3.png)

<center>

_Figure 2 : le concept de Persistent Recursive World / les agents naissent, agissent et disparaissent ; le monde logiciel continue de se déployer_

</center>

<center>

## Les modèles peuvent changer ; le monde du logiciel continue

</center>

Cette continuité n'exige même pas d'utiliser le même modèle du début à la fin.

Dans une autre série d'expériences, un monde logiciel initialement construit par GLM 5.2 a été confié à DeepSeek V4 Flash pour poursuivre le développement.

Au final, il a réussi 1 820/1 820 des tests LLVM SingleSource conservés.

Les modèles peuvent être remplacés, les agents peuvent être remplacés — le monde du logiciel continue.

![image4.png](./evox-genesis-4.png)

<center>

_Figure 3 : l'expérience de continuation entre modèles, GLM 5.2 → DeepSeek V4 Flash_

</center>

<center>

## Partir de zéro, ou hériter de l'histoire

</center>

Construire à partir de zéro n'est qu'un bout du cycle de vie d'un logiciel ;

l'autre bout, c'est un monde logiciel qui existe depuis des années, riche de structure et d'histoire.

Nous avons appliqué EvoX Genesis à MESA — un système de calcul scientifique pour l'évolution stellaire, développé de longue date.

L'expérience portait sur 13 modules Fortran, totalisant **139 414 lignes** ;

EvoX Genesis les a refactorisés en crates Rust correspondantes, pour un coût en tokens de modèle d'environ **10,6 $**.

Un monde logiciel peut être créé à partir de rien, ou hériter de l'histoire et continuer d'évoluer.

![image5.png](./evox-genesis-5.png)

<center>

_Figure 4 : MESA Fortran → Rust, 13 modules, 139 414 lignes de code, 10,6 $_

</center>

<center>

## Les avantages de coût se composent dans le temps

</center>

Le développement logiciel de longue durée ne signifie pas que les coûts croissent linéairement.

Dans EvoX Genesis, le code vérifié, la structure et l'historique de développement s'accumulent et deviennent le socle du prochain cycle de travail. Les agents suivants n'ont pas besoin de récomprendre tout le projet à partir de zéro ; une grande partie des informations existantes peut être directement mise en cache et réutilisée, avec un taux de réussite de cache allant jusqu'à 97,4 %.

À mesure que le système tourne, l'état de développement réutilisable s'enrichit, les calculs redondants diminuent, et le coût unitaire du développement finit par baisser au fil du temps.

Ce sont des intérêts composés d'ingénierie qui s'accumulent avec le temps.

<center>

## EvoX Genesis est désormais open source

</center>

Le projet est open source, avec des packages d'installation disponibles pour Windows, macOS et Linux.

🌐 Site web :

https://genesis.evox.group/

🔗 **GitHub** :

https://github.com/EMI-Group/genesis

↓ **Téléchargements** :

**https://github.com/EMI-Group/genesis/releases**

**▤ Article :**

**https://arxiv.org/abs/2608.10450**

🌐 Groupe QQ : 297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

<center>

**Les agents s'en vont ; le monde du logiciel continue d'évoluer**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>Groupe QQ｜</strong>Evolutionary Machine Intelligence</center>

Références :

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
