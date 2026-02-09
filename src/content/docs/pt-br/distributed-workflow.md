---
title: "Fluxo de Trabalho Multi-GPU e Distribuído"
order: 8
section: "experimental"
---

# Fluxo de Trabalho Multi-GPU e Distribuído

O EvoX possui suporte experimental para fluxos de trabalho distribuídos, permitindo que você execute quaisquer algoritmos evolutivos normais em múltiplas GPUs ou até mesmo em múltiplas máquinas. Isso pode acelerar significativamente o processo de otimização, especialmente para problemas demorados.

## Como usar

Para usar o fluxo de trabalho distribuído, você precisa configurar algumas coisas:
1. Certifique-se de fixar manualmente a semente (`seed`) do gerador de números aleatórios.
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Certifique-se de definir a semente para todos os geradores de números aleatórios **antes** de quaisquer operações do `torch` ou `numpy`. Isso garante que o gerador de números aleatórios esteja em um estado conhecido antes que qualquer operação seja realizada.
2. Use o comando `torch.distributed` ou `torchrun` para iniciar seu script. Por exemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Dica:**
> `torchrun` é a maneira recomendada de iniciar programas `torch` distribuídos. Para mais informações, consulte a [documentação do PyTorch](https://pytorch.org/docs/stable/elastic/run.html).