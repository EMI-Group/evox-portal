---
title: "Workflow Multi-GPU e Distribuído"
order: 8
section: "experimental"
---

# Workflow Multi-GPU e Distribuído

O EvoX possui suporte experimental para workflows distribuídos, permitindo que você execute qualquer algoritmo evolutivo normal em múltiplas GPUs ou até mesmo em múltiplas máquinas. Isso pode acelerar significativamente o processo de otimização, especialmente para problemas que consomem muito tempo.

## Como usar

Para usar o workflow distribuído, você precisa configurar algumas coisas:
1. Certifique-se de ter fixado manualmente a semente do gerador de números aleatórios.
```python
torch.manual_seed(seed)
# Opcional: definir a semente para numpy
np.random.seed(seed)
# Opcional: usar algoritmos determinísticos
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Certifique-se de definir a semente para todos os geradores de números aleatórios **antes** de qualquer operação do torch ou numpy. Isso garante que o gerador de números aleatórios esteja em um estado conhecido antes de qualquer operação ser realizada.
2. Use o comando `torch.distributed` ou `torchrun` para iniciar seu script. Por exemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Dica:**
> `torchrun` é a forma recomendada de iniciar programas torch distribuídos. Para mais informações, consulte a [documentação do PyTorch](https://pytorch.org/docs/stable/elastic/run.html).
