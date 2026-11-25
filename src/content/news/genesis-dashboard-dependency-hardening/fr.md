---
title: "Genesis renforce les dépendances de son tableau de bord"
pubDate: 2026-11-25
summary: "La branche main actualise Phoenix, LiveView, Bandit et jsv ; les déploiements depuis les sources nécessitent une reconstruction."
---

Le 23 novembre 2026, Genesis a actualisé quatre dépendances sur `main`. Cette maintenance concerne l’infrastructure web commune qui donne accès à l’espace de travail. Pour les équipes compilant Genesis depuis les sources, l’élément déterminant est l’ensemble des dépendances ayant servi à construire le service exécuté. [Mise à jour][lock]

![Une pièce de remplacement renforce le mécanisme d’une serrure](./cover.webp)

*Illustration conceptuelle : entretenir les composants protégeant une entrée commune.*

## Les changements sous l’interface

La déclaration des dépendances associe la mise à jour de Phoenix à des corrections de plantages du suivi de présence et de la diffusion, et le minimum LiveView à une correction des hooks d’initialisation de session ignorés lorsque la requête de connexion omet son URL. Elle décrit aussi le renforcement des validations HTTP/2 de Bandit. Ce sont les motifs consignés par les mainteneurs de Genesis ; le commit ne détermine pas l’exposition d’un déploiement particulier. [Exigences][pins]

Le fichier de verrouillage passe Phoenix de 1.8.16 à 1.8.17, LiveView de 1.2.13 à 1.2.15, Bandit de 1.14.1 à 1.15.0 et jsv de 0.28.0 à 0.28.1. Le minimum déclaré de LiveView est 1.2.14, mais la compilation verrouillée utilise 1.2.15. Une modification Nix recalcule le hachage des dépendances pour ce fichier. [Versions verrouillées][lock] · [Modification Nix][nix]

## Vérifier la compilation réellement déployée

Une équipe auto-hébergée peut, par exemple, actualiser ses sources tout en exécutant un ancien binaire. Utilisez une révision contenant ces commits, puis reconstruisez et redéployez selon la procédure d’installation du projet. Vérifiez le `mix.lock` de la compilation, conservez le hachage Nix correspondant si nécessaire et contrôlez l’accès au tableau de bord ainsi que la reconnexion en direct. Actualiser le répertoire source ne remplace pas le service exécuté. [Guide d’installation][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md
