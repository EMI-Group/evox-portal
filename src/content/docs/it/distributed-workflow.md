---
title: "Workflow Multi-GPU e Distribuito"
order: 8
section: "experimental"
---

# Workflow Multi-GPU e Distribuito

EvoX ha un supporto sperimentale per workflow distribuiti, che ti consente di eseguire qualsiasi algoritmo evolutivo normale su più GPU o anche su più macchine. Questo può accelerare significativamente il processo di ottimizzazione, specialmente per problemi che richiedono molto tempo.

## Come utilizzarlo

Per usare il workflow distribuito, devi configurare alcune cose:
1. Assicurati di aver fissato manualmente il seed del generatore di numeri casuali.
```python
torch.manual_seed(seed)
# Opzionale: imposta il seed per numpy
np.random.seed(seed)
# Opzionale: usa algoritmi deterministici
torch.use_deterministic_algorithms(True)
```
> **Importante:**
> Assicurati di impostare il seed per tutti i generatori di numeri casuali **prima** di qualsiasi operazione torch o numpy. Questo garantisce che il generatore di numeri casuali sia in uno stato noto prima che vengano eseguite operazioni.
2. Usa il comando `torch.distributed` o `torchrun` per lanciare il tuo script. Ad esempio:
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **Suggerimento:**
> `torchrun` è il modo consigliato per lanciare programmi torch distribuiti. Per maggiori informazioni, consulta la [documentazione di PyTorch](https://pytorch.org/docs/stable/elastic/run.html).
