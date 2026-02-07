---
title: "Flujo de Trabajo Multi-GPU y Distribuido"
order: 8
section: "experimental"
---

# Flujo de Trabajo Multi-GPU y Distribuido

EvoX tiene soporte experimental para flujos de trabajo distribuidos, permitiendote ejecutar cualquier algoritmo evolutivo normal a traves de multiples GPUs o incluso multiples maquinas. Esto puede acelerar significativamente el proceso de optimizacion, especialmente para problemas que consumen mucho tiempo.

## Como usar

Para usar el flujo de trabajo distribuido, necesitas configurar algunas cosas:
1. Asegurate de haber fijado manualmente la semilla del generador de numeros aleatorios.
```python
torch.manual_seed(seed)
# Opcional: establecer la semilla para numpy
np.random.seed(seed)
# Opcional: usar algoritmos deterministicos
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Asegurate de establecer la semilla para todos los generadores de numeros aleatorios **antes** de cualquier operacion de torch o numpy. Esto asegura que el generador de numeros aleatorios este en un estado conocido antes de que se realice cualquier operacion.
2. Usa el comando `torch.distributed` o `torchrun` para lanzar tu script. Por ejemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... argumentos del script de entrenamiento...)
```
> **Consejo:**
> `torchrun` es la forma recomendada de lanzar programas distribuidos de torch. Para mas informacion, consulta la [documentacion de PyTorch](https://pytorch.org/docs/stable/elastic/run.html).
