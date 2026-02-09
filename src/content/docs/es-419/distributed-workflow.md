---
title: "Flujo de trabajo distribuido y multi-GPU"
order: 8
section: "experimental"
---

# Flujo de trabajo distribuido y multi-GPU

EvoX cuenta con soporte experimental para flujos de trabajo distribuidos, lo que permite ejecutar cualquier algoritmo evolutivo normal en múltiples GPUs o incluso en varias máquinas. Esto puede acelerar significativamente el proceso de optimización, especialmente para problemas que consumen mucho tiempo.

## Cómo usarlo

Para utilizar el flujo de trabajo distribuido, es necesario configurar algunos elementos:
1. Asegúrate de fijar manualmente la semilla del generador de números aleatorios.
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Asegúrate de establecer la semilla para todos los generadores de números aleatorios **antes** de cualquier operación de `torch` o `numpy`. Esto garantiza que el generador de números aleatorios esté en un estado conocido antes de que se realice cualquier operación.
2. Utiliza el comando `torch.distributed` o `torchrun` para lanzar tu script. Por ejemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Consejo:**
> `torchrun` es la forma recomendada de lanzar programas de `torch` distribuidos. Para más información, consulta la [documentación de PyTorch](https://pytorch.org/docs/stable/elastic/run.html).