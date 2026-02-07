---
title: "Workflow Multi-GPU e Distribuído"
order: 8
section: "experimental"
---

# Workflow Multi-GPU e Distribuído

O EvoX tem suporte experimental para workflows distribuídos, permitindo-lhe executar qualquer algoritmo evolutivo normal em múltiplas GPUs ou até em múltiplas máquinas. Isto pode acelerar significativamente o processo de otimização, especialmente para problemas que consomem muito tempo.

## Como utilizar

Para utilizar o workflow distribuído, precisa de configurar algumas coisas:
1. Certifique-se de que fixou manualmente a semente do gerador de números aleatórios.
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Certifique-se de definir a semente para todos os geradores de números aleatórios **antes** de quaisquer operações torch ou numpy. Isto garante que o gerador de números aleatórios está num estado conhecido antes de quaisquer operações serem realizadas.
2. Utilize o comando `torch.distributed` ou `torchrun` para lançar o seu script. Por exemplo:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Dica:**
> `torchrun` é a forma recomendada de lançar programas torch distribuídos. Para mais informações, consulte a [documentação do PyTorch](https://pytorch.org/docs/stable/elastic/run.html).
