---
title: "Multi-GPU- und verteilter Workflow"
order: 8
section: "experimental"
---

# Multi-GPU- und verteilter Workflow

EvoX bietet experimentelle Unterstützung für verteilte Workflows, die es Ihnen ermöglicht, normale evolutionäre Algorithmen über mehrere GPUs oder sogar mehrere Maschinen hinweg auszuführen. Dies kann den Optimierungsprozess erheblich beschleunigen, insbesondere bei zeitaufwändigen Problemen.

## Verwendung

Um den verteilten Workflow zu nutzen, müssen Sie einige Dinge einrichten:
1. Stellen Sie sicher, dass Sie den Seed des Zufallszahlengenerators manuell festgelegt haben.
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **Wichtig:**
> Stellen Sie sicher, dass Sie den Seed für alle Zufallszahlengeneratoren setzen, **bevor** irgendwelche Torch- oder Numpy-Operationen ausgeführt werden. Dies gewährleistet, dass sich der Zufallszahlengenerator in einem bekannten Zustand befindet, bevor Operationen durchgeführt werden.
2. Verwenden Sie den Befehl `torch.distributed` oder `torchrun`, um Ihr Skript zu starten. Zum Beispiel:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Tipp:**
> `torchrun` ist die empfohlene Methode, um verteilte Torch-Programme zu starten. Weitere Informationen finden Sie in der [PyTorch-Dokumentation](https://pytorch.org/docs/stable/elastic/run.html).