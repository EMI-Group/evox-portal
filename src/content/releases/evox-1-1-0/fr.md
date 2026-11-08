---
title: "Sortie d'EvoX 1.1 : Désormais avec torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 remplace TorchScript par torch.compile. TorchDynamo capture les graphes de calcul pendant l’exécution Python."
---

![Structure du programme rendue visible pour inspection](./execution-graph-capture.webp)

## Mise à jour du compilateur

EvoX 1.1 remplace TorchScript par `torch.compile`. TorchDynamo capture les graphes de calcul pendant l’exécution Python.

## Compilation des workflows

Les étapes du workflow peuvent être compilées pour optimiser ensemble les opérations tensorielles prises en charge par le compilateur PyTorch.

## Compatibilité

La capture dépend des opérations et du contrôle de flux. Le code non pris en charge peut interrompre le graphe ; tous les appels aux bibliothèques Python ne sont pas compilés.

## Ressources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
