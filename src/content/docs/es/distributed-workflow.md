---
title: "Flujo de Trabajo Multi-GPU y Distribuido"
order: 8
section: "experimental"
---

# Flujo de Trabajo Multi-GPU y Distribuido

EvoX tiene soporte experimental para flujos de trabajo distribuidos, permitiendole ejecutar cualquier algoritmo evolutivo normal a traves de multiples GPUs o incluso multiples maquinas. Esto puede acelerar significativamente el proceso de optimizacion, especialmente para problemas que consumen mucho tiempo.

## Como usar

Para usar el flujo de trabajo distribuido, necesita configurar algunas cosas:
1. Asegurese de haber fijado manualmente la semilla del generador de numeros aleatorios.
```python
torch.manual_seed(seed)
# Opcional: establecer la semilla para numpy
np.random.seed(seed)
# Opcional: usar algoritmos deterministicos
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Asegurese de establecer la semilla para todos los generadores de numeros aleatorios **antes** de cualquier operacion de torch o numpy. Esto garantiza que el generador de numeros aleatorios este en un estado conocido antes de que se realice cualquier operacion.
2. Use el comando `torch.distributed` o `torchrun` para lanzar su script. Por ejemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Consejo:**
> `torchrun` es la forma recomendada de lanzar programas distribuidos de torch. Para mas informacion, consulte la [documentacion de PyTorch](https://pytorch.org/docs/stable/elastic/run.html).
