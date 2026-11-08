---
title: "Introduzione a EvoX: il primo workflow evolutivo"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "Un esperimento completo con EvoX 1.4.1 per capire come problemi, popolazioni, valutazione ed esecuzione formino un workflow riutilizzabile."
---

Il tutorial minimizza Ackley in due dimensioni con PSO, verifica il dispositivo e visualizza la cronologia. È per **EvoX 1.4.1 con PyTorch**, non per l’API sperimentale 2.x. Il piccolo problema serve a capire il workflow, non a misurare le prestazioni GPU.

![Particelle candidate esplorano un paesaggio di ricerca](./first-search-workflow.webp)

## Preparare un ambiente isolato

Utilizzi Python 3.10 o successivo. Crei un ambiente virtuale e lo attivi con il comando adatto alla shell.

```bash
python -m venv .venv
```

Su macOS/Linux:

```bash
source .venv/bin/activate
```

Su Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## Installare i pacchetti corretti

Scelga il comando per sistema e hardware nell’[installatore ufficiale PyTorch](https://pytorch.org/get-started/locally/). CUDA richiede un driver supportato; installare EvoX non garantisce la disponibilità della GPU. Installi poi la versione indicata:

```bash
python -m pip install "evox[vis]==1.4.1"
```

## Eseguire un esperimento completo

Salvi il codice come script Python. Se disponibile seleziona CUDA, altrimenti CPU, mostra la scelta e mantiene stato e monitoraggio sul dispositivo. Un seme fisso aiuta a ripetere l’esperimento, ma dispositivi e versioni diversi possono produrre risultati diversi.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## Comprendere e visualizzare il risultato

PSO mantiene i candidati, Ackley li valuta, StdWorkflow collega i componenti ed EvalMonitor registra i progressi. Valori inferiori sono migliori; l’ottimo teorico è zero nell’origine. Non è garantito un punteggio finale fisso.

Esegua il comando seguente dopo la ricerca nello stesso processo. Le dipendenze di visualizzazione sono incluse. L’immagine viene dal tutorial originale e non garantisce l’output di questo seme.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## Estendere l’esperimento con criterio

Modifichi una variabile alla volta: dimensione, popolazione o seme. Un problema personalizzato deve restituire un valore per candidato. Il multiobiettivo richiede anche algoritmo, forma dei risultati e monitor compatibili.

Per i tempi, separi compilazione e riscaldamento dall’esecuzione stabile, sincronizzi CUDA e confronti lo stesso budget di valutazioni. Piccoli compiti possono essere più veloci su CPU. Esamini la compilazione dopo aver verificato la baseline.

## Risorse e ringraziamenti

Il tutorial originale è stato scritto da Boqing Xu, Xinmeng Yu, Bowen Zheng e Xinyao Li, e curato e pubblicato da Beichen Huang. La figura riepilogativa è mantenuta sotto.

![EvoX overview](./quickstart-8.png)

Per l’esempio usi il [codice versionato](https://github.com/EMI-Group/evox/tree/v1.4.1); per approfondire, la [documentazione](https://evox.readthedocs.io/en/latest/). Verifichi la versione prima di copiare API più recenti.

Prima di estendere l’esempio, salvi insieme versioni dei pacchetti, dispositivo, seed e fitness migliore. Cambi una sola impostazione e ripeta lo stesso budget. La [spiegazione di EvoMO](/it/news/gpu-accelerated-emo) introduce le ulteriori scelte per obiettivi in conflitto.
