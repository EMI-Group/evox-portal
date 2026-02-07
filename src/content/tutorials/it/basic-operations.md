---
title: "3. Operazioni di Base"
order: 3
---

# 3. Operazioni di Base

In questo capitolo, ti guideremo nell'esecuzione della tua prima attività di ottimizzazione con EvoX, incluso come **avviare EvoX** e **inizializzare il processo di ottimizzazione**, come **configurare un progetto EvoX** (selezionando algoritmi e problemi e assemblandoli), e i **comandi di base** (o metodi) comunemente usati per controllare il processo di ottimizzazione. Attraverso un semplice esempio, imparerai l'uso di base di EvoX.

## Avvio e Inizializzazione

Dopo aver verificato l'installazione, puoi iniziare a scrivere script di ottimizzazione usando EvoX. Puoi importare EvoX in qualsiasi ambiente Python (come terminale, Jupyter Notebook, IDE, ecc.).

Per prima cosa, importiamo EvoX e i suoi moduli correlati, e inizializziamo una semplice attività di ottimizzazione. Ad esempio, useremo l'algoritmo di Ottimizzazione a Sciame di Particelle (PSO) per ottimizzare la classica funzione Ackley. La funzione Ackley è una funzione benchmark comune con un ottimo globale noto in \((0,0,\dots,0)\), rendendola adatta per la dimostrazione.
Ecco un esempio di codice EvoX minimale che dimostra come avviare ed eseguire l'ottimizzazione:

```python
import torch
from evox.algorithms import PSO                      # Importa l'algoritmo PSO
from evox.problems.numerical import Ackley           # Importa il problema di ottimizzazione Ackley
from evox.workflows import StdWorkflow, EvalMonitor  # Importa il workflow standard e il monitor

# 1. Definisci l'algoritmo di ottimizzazione e il problema
algorithm = PSO(
    pop_size=50,                    # Dimensione della popolazione di 50
    lb=-32 * torch.ones(2),         # Limite inferiore delle variabili decisionali: vettore 2D, ciascuno -32
    ub= 32 * torch.ones(2)          # Limite superiore delle variabili decisionali: vettore 2D, ciascuno 32
)
problem = Ackley()                  # Problema di ottimizzazione: funzione Ackley (dimensione predefinita corrisponde all'algoritmo)

# 2. Assembla il workflow e aggiungi un monitor per tracciare i risultati
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Inizializza il workflow
workflow.init_step()  # Inizializza lo stato interno dell'algoritmo e del problema

# 4. Esegui le iterazioni di ottimizzazione
for i in range(100):
    workflow.step()   # Avanza l'ottimizzazione di un passo

# 5. Ottieni i risultati (ad es. stampa il valore ottimale)
best_fitness = monitor.get_best_fitness() # Ottieni il miglior valore di fitness dal monitor
print("Iterazione completata, miglior valore di fitness trovato:", float(best_fitness))
```

Il codice sopra include i seguenti passaggi:
- Prima, impostiamo i parametri per l'algoritmo PSO: dimensione della popolazione di 50 e uno spazio di ricerca 2D nell'intervallo [-32, 32].
- Poi, definiamo il problema Ackley (la funzione Ackley è definita come 2D per impostazione predefinita).
- Creiamo un workflow standard `StdWorkflow` che **assembla** l'algoritmo e il problema, e passiamo un monitor `EvalMonitor` per registrare i dati del processo di ottimizzazione.
- Successivamente, completiamo il processo di inizializzazione usando `workflow.init_step()`, che inizializza automaticamente la popolazione, il seme casuale e altri stati interni.
- Poi, eseguiamo un ciclo per eseguire continuamente 100 iterazioni usando `workflow.step()`. Ogni volta che `step()` viene chiamato, l'algoritmo genera nuove soluzioni e valuta la loro fitness, avvicinandosi continuamente alla soluzione ottimale.
- Infine, usiamo il metodo `get_min_fitness()` fornito dal monitor per ottenere il miglior valore di fitness durante il processo iterativo e stamparlo.

Quando esegui questo script, vedrai l'output delle iterazioni di ottimizzazione, ad esempio:

```text
Iterazione completata, miglior valore di fitness trovato: 9.5367431640625e-07
```

Poiché non abbiamo stampato esplicitamente i risultati intermedi nel ciclo, i risultati intermedi non verranno visualizzati. Tuttavia, puoi giudicare se l'algoritmo è convergente in base al valore di fitness finale. Ad esempio, il valore ottimale della funzione Ackley è 0, e se l'output è vicino a 0, indica che PSO ha trovato una soluzione vicina all'ottimo globale. Puoi anche chiamare `print(monitor.history)` per visualizzare i dati storici registrati dal monitor o usare `monitor.plot()` per tracciare curve di convergenza (richiede supporto di visualizzazione come Plotly).

> **Nota:**
> `StdWorkflow` è un'incapsulazione del **processo di ottimizzazione standard** fornita da EvoX. Internamente implementa la logica "inizializzazione-aggiornamento iterativo" presente negli algoritmi evolutivi tradizionali e incapsula l'interazione tra l'algoritmo e il problema. Per la maggior parte delle applicazioni semplici, usare `StdWorkflow` direttamente sarà sufficiente. `EvalMonitor` è un monitor che implementa metodi come `get_best_fitness()` e `plot()` per raccogliere e visualizzare le metriche di prestazione durante il processo di ottimizzazione. I principianti possono temporaneamente intenderlo come un registro che annota i migliori risultati di ogni iterazione per analisi successive.

Nell'esempio sopra, abbiamo creato una configurazione di base per un progetto EvoX, inclusa la selezione di un algoritmo, la definizione del problema e l'assemblaggio del workflow. In generale, configurare un progetto EvoX comporta i seguenti passaggi:

1. **Seleziona/Definisci un Problema di Ottimizzazione**: Chiarisci quale problema di ottimizzazione stai cercando di risolvere. Ad esempio, se stai ottimizzando una funzione matematica, EvoX fornisce molti **problemi integrati** nel modulo `evox.problems` (ad es. funzioni classiche come Sphere, Rastrigin, Ackley) che puoi usare direttamente. Se il tuo problema non è coperto dai problemi integrati, puoi definirne uno tuo (trattato in un capitolo successivo). Quando configuri un problema, di solito devi conoscere la **dimensione delle variabili decisionali** e il loro **intervallo di valori**.

2. **Seleziona/Configura un Algoritmo di Ottimizzazione**: Scegli un algoritmo evolutivo appropriato in base al tipo di problema. EvoX fornisce un ricco set di algoritmi in `evox.algorithms`, inclusi algoritmi mono-obiettivo (come PSO, GA, CMA-ES) e algoritmi multi-obiettivo (come NSGA-II, RVEA). Dopo aver scelto l'algoritmo, dovrai generalmente impostare i parametri dell'algoritmo, come la dimensione della popolazione (`pop_size`) e parametri specifici dell'algoritmo (come la probabilità di crossover e la probabilità di mutazione in GA). La maggior parte degli algoritmi richiede l'**intervallo delle variabili** (limite inferiore `lb` e limite superiore `ub`) e la dimensione del problema per inizializzare la popolazione. Se stai usando un algoritmo multi-obiettivo, dovrai anche specificare il numero di obiettivi (`n_objs`). Gli algoritmi di EvoX spesso forniscono valori predefiniti per gli iperparametri comuni, ma i principianti dovrebbero considerare di regolare questi parametri in base all'attività per ottenere prestazioni migliori.

3. **Assembla il Workflow**: Con l'istanza dell'algoritmo e del problema pronte, devi "assemblarle" in un workflow, che rappresenta il controllo completo del processo di ottimizzazione. In EvoX, `StdWorkflow` è tipicamente usato per combinare l'algoritmo e il problema. Se vuoi monitorare il progresso dell'ottimizzazione, puoi aggiungere un monitor (come `EvalMonitor`) al workflow. Un monitor non è obbligatorio, ma può essere molto utile durante il debug e l'analisi. Assemblare il workflow di solito richiede una riga di codice, come: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inizializza**: Chiama il metodo di inizializzazione del workflow per iniziare l'ottimizzazione. L'ultima versione di EvoX fornisce un comodo metodo `StdWorkflow.init_step()` che completa il processo di inizializzazione in una sola chiamata.

5. **Esegui le Iterazioni**: Usa un ciclo per chiamare ripetutamente `workflow.step()` per far avanzare il processo evolutivo. Ogni chiamata esegue un'iterazione, includendo passaggi come "genera nuove soluzioni -> valuta -> seleziona" all'interno dell'algoritmo. Durante le iterazioni, puoi usare un monitor per osservare i risultati in tempo reale, come stampare la migliore fitness corrente ogni poche generazioni. I criteri di terminazione possono essere impostati in base alle tue esigenze — quelli comuni includono un numero fisso di generazioni (ad es. eseguire per 100 generazioni), o fermarsi quando le metriche monitorate convergono (ad es. nessun miglioramento significativo per diverse generazioni).

6. **Ottieni i Risultati**: Dopo la fine delle iterazioni, devi estrarre i risultati finali dall'algoritmo — come la migliore soluzione e il suo valore obiettivo. In EvoX, questi sono tipicamente ottenuti tramite il monitor. Ad esempio, `EvalMonitor.get_best_fitness()` restituisce il miglior valore di fitness. Per ottenere il miglior vettore soluzione, un modo è far memorizzare al problema il miglior candidato durante la valutazione, o usare l'interfaccia del monitor. Nell'implementazione standard di EvoX, `EvalMonitor` registra il miglior individuo e la fitness di ogni generazione, accessibili tramite le sue proprietà. Supponendo che `monitor.history` memorizzi la cronologia, puoi recuperare il miglior individuo dall'ultima generazione. Naturalmente, puoi anche saltare `EvalMonitor` e interrogare direttamente l'oggetto algoritmo dopo il ciclo — questo dipende dall'implementazione dell'algoritmo. Se il tuo algoritmo personalizzato implementa `get_best()` o memorizza il miglior individuo nel suo stato, puoi estrarlo direttamente. Tuttavia, poiché EvoX enfatizza le funzioni pure e la modularità, i risultati sono solitamente accessibili tramite moduli di monitoraggio.

Seguendo questi passaggi, puoi strutturare chiaramente il codice della tua attività di ottimizzazione. Per i principianti, è importante capire come il trio **algoritmo-problema-workflow** lavora insieme: l'algoritmo gestisce la generazione e il miglioramento delle soluzioni, il problema valuta la loro qualità, e il workflow li connette in un ciclo iterativo.

Successivamente, introdurremo alcuni comandi di base e chiamate di funzione disponibili in EvoX per aiutarti ad approfondire la comprensione del processo di ottimizzazione.

## Panoramica dei Comandi di Base

Quando usi EvoX, ci sono alcuni **metodi e funzioni comunemente usati** che fungono da "comandi" con cui vorrai familiarizzare:

### Metodi Relativi al Workflow

- **`StdWorkflow.init_step()`**: Inizializzazione. Questo è un comando di avvio rapido per lanciare il processo di ottimizzazione, spesso usato all'inizio di uno script. Chiama la logica di inizializzazione sia per l'algoritmo che per il problema, genera la popolazione iniziale e valuta la fitness. Dopo questo, il workflow contiene lo stato iniziale ed è pronto per l'iterazione.

- **`StdWorkflow.step()`**: Avanza di un passo nell'ottimizzazione. Ogni chiamata fa sì che l'algoritmo generi nuove soluzioni candidate basate sullo stato corrente della popolazione, le valuti e selezioni la generazione successiva. Gli utenti tipicamente chiamano questo metodo più volte all'interno di un ciclo. La funzione `step()` di solito non restituisce nulla (lo stato interno viene aggiornato all'interno del workflow), anche se versioni precedenti potrebbero restituire un nuovo stato. Per i principianti, puoi semplicemente chiamarlo senza preoccuparti del valore di ritorno.

### Metodi Relativi al Monitor

Usando `EvalMonitor` come esempio, i metodi comuni includono:

- `EvalMonitor.get_best_fitness()`: Restituisce la fitness più bassa registrata (per problemi di minimizzazione) o la fitness più alta (per problemi di massimizzazione; il monitor di solito distingue questo). Utile per conoscere il miglior risultato corrente.
- `EvalMonitor.get_history()` o `monitor.history`: Recupera la cronologia completa, come il miglior valore di ogni generazione. Utile per analizzare le tendenze di convergenza.
- `EvalMonitor.plot()`: Traccia curve di convergenza o prestazione; richiede un ambiente grafico o Notebook. Il monitor di solito usa Plotly per renderizzare i grafici, aiutandoti a valutare visivamente le prestazioni dell'algoritmo.
  Internamente, il monitor registra il numero di valutazioni e i loro risultati per ogni generazione — tipicamente non devi intervenire, basta estrarre i dati quando necessario.

### Metodi Relativi all'Algoritmo

- Metodo `Algorithm.__init__()`: Metodo di inizializzazione di un algoritmo. Le variabili sono solitamente incapsulate usando `evox.core.Mutable()` e gli iperparametri con `evox.core.Parameter()`.

- Metodo `Algorithm.step()`: In scenari specifici o quando si usano algoritmi/problemi personalizzati, potresti chiamare direttamente il metodo `step()` dell'algoritmo, che tipicamente incapsula l'intera logica iterativa dell'algoritmo.

- Metodo `Algorithm.init_step()`: Il metodo `init_step()` include la prima iterazione dell'algoritmo. Se non viene sovrascritto, chiama semplicemente il metodo `step()`. Per i casi tipici, la prima iterazione non è diversa dalle altre, quindi molti algoritmi potrebbero non aver bisogno di un `init_step()` personalizzato. Ma per algoritmi che coinvolgono la regolazione degli iperparametri, potresti dover aggiornare gli iperparametri o le variabili correlate qui.

### Controllo del Dispositivo e del Parallelismo

- Metodo `.to(device)`: Se devi cambiare dispositivo di calcolo nel tuo programma, usa il metodo `.to(device)` di PyTorch per spostare i tensori (`torch.Tensor`) su GPU/CPU (alcuni metodi PyTorch come `torch.randn` richiedono anche la specifica del dispositivo). In generale, se imposti il dispositivo usando `torch.set_default_device()` su `cuda:0` (supponendo che il tuo sistema lo supporti e che EvoX e le dipendenze siano installati correttamente — verifica con `torch.cuda.is_available()`), la maggior parte dei calcoli paralleli ad alte prestazioni di EvoX verrà eseguita automaticamente su GPU. Quando scrivi algoritmi, problemi o monitor personalizzati, se crei nuovi tensori o usi metodi PyTorch sensibili al dispositivo, si consiglia di specificare esplicitamente il `device` come `cuda:0` o usare `torch.get_default_device()` per evitare cali di prestazioni dovuti a calcoli distribuiti su dispositivi diversi.

Per i principianti, i metodi sopra descritti sono sufficienti per gestire le tipiche attività di ottimizzazione. In breve: **Inizializza problema/algoritmo -- configura il monitor -- assembla il workflow -- esegui e recupera i risultati** è il flusso di lavoro EvoX più comune. Padroneggiare questi ti permette di affrontare le attività di ottimizzazione di base usando EvoX.

Prima di passare al capitolo successivo, prova a modificare l'esempio: passa da PSO a un altro algoritmo, sostituisci la funzione Ackley con un'altra funzione di test, o usa il monitor per estrarre più informazioni — questo ti aiuterà ad apprezzare la flessibilità della configurazione dei progetti EvoX.
