---
title: "Avvio rapido EvoX: esegui il calcolo evolutivo accelerato da GPU in soli 10 minuti"
pubDate: 2025-04-30
summary: "Un tutorial per principianti per iniziare con il calcolo evolutivo accelerato da GPU usando EvoX in soli 10 minuti."
---

Da un lato, il calcolo evolutivo è estremamente potente nella ricerca e nell'ingegneria del mondo reale, ma difficile da utilizzare. Dall'altro, le capacità delle GPU sono sempre più potenti, ma è difficile sfruttarne la potenza nei compiti di calcolo evolutivo.

Abbiamo bisogno di una soluzione veramente moderna: supporto nativo per GPU, architettura modulare, interfacce chiare, utilizzabilita immediata e scalabilità personalizzabile. Questo e EvoX -- un motore di calcolo evolutivo per il futuro.

Per aiutare gli utenti a iniziare rapidamente, il team EvoX ha rilasciato il "Tutorial per principianti di EvoX". Il tutorial è composto da 8 capitoli, che coprono tutto dalle basi all'applicazione pratica avanzata, guidandoti passo dopo passo su come eseguire algoritmi evolutivi su una GPU.

## Risorse complete del tutorial

Tutorial online in cinese:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutorial PDF in cinese:

Unisciti al Gruppo QQ per ottenerlo: 297969717

Ora ti guideremo attraverso l'intero processo, dall'installazione all'esecuzione, in soli 10 minuti.

## Passo 1: Configurazione dell'ambiente

Apri il terminale e crea un ambiente Python pulito:

```bash
python -m venv .venv
source .venv/bin/activate
```

Puoi anche usare il tuo strumento preferito per creare un ambiente Python pulito.

## Passo 2: Installa PyTorch e EvoX

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
pip install "evox[vis]"
```

Verifica se la GPU è disponibile:

```python
import torch
print(torch.cuda.is_available())
```

## Passo 3: Esegui il tuo primo algoritmo evolutivo

```python
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
import torch

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2),
    ub=32 * torch.ones(2),
)
problem = Ackley()
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Best fitness:", float(monitor.get_best_fitness()))
```

Cosa fa questo codice? Compone un algoritmo (PSO), un problema (Ackley) e un monitor (EvalMonitor) tramite un'interfaccia standard. EvoX si occupa di tutto il parallelismo, l'accelerazione e il monitoraggio!

## Passo 4: Traccia la curva di convergenza

Basta una sola riga:

```python
monitor.plot()
```

![monitor_output.png](./quickstart-7.png)

Vedi quella curva discendente? Quella e la **traiettoria con cui il tuo algoritmo evolutivo si avvicina all'obiettivo**, e **il percorso che compie per esplorare il mondo sconosciuto.**

## Passo 5: Prova ad estendere

Se "eseguire solo un Ackley" non ti soddisfa, puoi:

- Sostituire PSO con GA, DE, CMA-ES, NSGA-II, RVEA...
 · Sostituire Ackley con Rastrigin, Griewank, CEC2022
 · Passare a un problema multi-obiettivo impostando n_objs >= 2
 · Implementare la tua logica personalizzata con MyProblem e MyAlgorithm
 · Collegarti a modelli PyTorch o ambienti di reinforcement learning (Gym, Brax, MuJoCo Playground)

Che si tratti di regolazione degli iperparametri, ricerca di architetture, neuroevoluzione o ottimizzazione di strategie di controllo, EvoX gestisce tutto con facilita.

## Perché scegliere EvoX?

![表格-英文.png](./quickstart-8.png "表格-英文.png")

## Ringraziamenti

Questo tutorial è stato scritto da **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** e **Xinyao Li**. **Beichen Huang** è stato responsabile della raccolta, dell'editing e della pubblicazione online del tutorial.

Ringraziamo sinceramente ogni membro della comunità EvoX. Sono i nostri sforzi congiunti che hanno permesso a EvoX di continuare a evolversi.

## Risorse

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentazione](https://evox.readthedocs.io/en/latest/)
