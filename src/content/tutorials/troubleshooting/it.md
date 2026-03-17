---
title: "6. Risoluzione dei Problemi e Ottimizzazione"
order: 6
---

# 6. Risoluzione dei Problemi e Ottimizzazione

Quando usi EvoX, potresti incontrare problemi o voler affinare i tuoi algoritmi. Questo capitolo descrive i problemi comuni e le soluzioni, insieme a strategie di debug e suggerimenti per l'ottimizzazione delle prestazioni per aiutarti a risolvere i problemi e ottimizzare la tua esperienza.

---

## 6.1 Problemi Comuni e Soluzioni

Ecco alcuni problemi frequentemente riscontrati e come affrontarli:

**(1) Errori di Installazione o Importazione**:

- **Sintomo**: Errore durante l'esecuzione di `import evox`.
- **Soluzione**:
  - **Verifica l'installazione**: Esegui `pip show evox` per verificare. Se non è installato, controlla il tuo ambiente virtuale e reinstalla.
  - **Dipendenze mancanti**: Se vedi `ModuleNotFoundError: No module named 'torch'`, installa PyTorch come descritto nel Capitolo 2.
  - **Incompatibilità CUDA**: Assicurati che la versione di PyTorch corrisponda ai driver CUDA installati.

**(2) GPU Non Utilizzata**:

- **Sintomo**: EvoX funziona su CPU invece che su GPU.
- **Soluzione**:
  - Verifica con `torch.cuda.is_available()`. Se `False`, reinstalla un PyTorch compatibile con GPU e controlla l'installazione CUDA.
  - Se `True` ma EvoX usa ancora la CPU, assicurati che i tuoi tensori siano spostati su GPU (vedi Capitolo 3 per la configurazione).

**(3) Memoria Esaurita (RAM/VRAM)**:

- **Sintomo**: Vedi `OutOfMemoryError`.
- **Soluzione**:
  - Riduci la dimensione della popolazione, la dimensione del problema o la frequenza di valutazione.
  - Usa float16 (mezza precisione) o suddivisione della valutazione in batch.
  - Disattiva le modalità debug/deterministiche in PyTorch.
  - Memorizza solo le statistiche invece dei fronti di Pareto completi (per multi-obiettivo).
  - L'aggiornamento dell'hardware è la soluzione definitiva per i colli di bottiglia della memoria.

**(4) Stagnazione della Convergenza**:

- **Sintomo**: L'algoritmo si blocca in un ottimo locale.
- **Soluzione**:
  - Aumenta la diversità della popolazione (ad es. tasso di mutazione più alto).
  - Prova algoritmi o parametri diversi.
  - Assicurati che la funzione obiettivo sia ben definita (non troppo rumorosa o piatta).
  - Esegui più prove e scegli la migliore — EvoX rende facili le esecuzioni parallele.

**(5) Risultati di Ottimizzazione Scarsi**:

- **Sintomo**: I risultati finali sono al di sotto delle aspettative.
- **Soluzione**:
  - **Verifica la definizione del problema**: Assicurati che la fitness sia calcolata correttamente (ad es. segni, scala).
  - **Adeguatezza dell'algoritmo**: Prova altri o regola gli iperparametri.
  - **Usa le curve di convergenza**:
    - Linea piatta precoce -> convergenza prematura.
    - Oscillante -> casualità troppo alta.
  - Regola le impostazioni dell'algoritmo e analizza il comportamento nel tempo.

**(6) Conflitti di Backend (JAX vs PyTorch)**:

- **Sintomo**: Hai installato accidentalmente la versione JAX di EvoX mentre usi esempi PyTorch.
- **Soluzione**: Il `pip install evox` predefinito ti dà la versione PyTorch. Se hai installato una versione JAX, reinstalla usando le istruzioni PyTorch (vedi Capitolo 2). Le funzionalità JAX sono documentate separatamente.

**(7) Incompatibilità di Versione**:

- **Sintomo**: Le chiamate API non corrispondono alla versione installata.
- **Soluzione**:
  - Gli aggiornamenti di EvoX possono cambiare i nomi dei metodi (ad es. `ask/tell` -> `step`).
  - Usa l'ultima versione stabile e consulta la sua documentazione.
  - Adatta il codice per allinearlo alla tua versione di EvoX o considera l'aggiornamento.

---

## 6.2 Suggerimenti per il Debug

Il debug degli algoritmi evolutivi può essere complicato a causa della loro natura stocastica. Ecco suggerimenti pratici:

**(1) Usa Test su Piccola Scala**:

- Riduci la dimensione della popolazione e il conteggio delle iterazioni per semplificare il debug.
- Esempio: `pop_size=5`, `iterations=20`.
- Rende più facile tracciare il comportamento della popolazione e isolare i problemi.

**(2) Inserisci Istruzioni di Stampa**:

- Stampa la fitness della popolazione, i migliori individui e i valori intermedi.
- Per tensori grandi, stampa le forme o usa `.tolist()` per quelli più piccoli.
- Ti aiuta a capire la convergenza e gli effetti degli operatori.

**(3) Usa Breakpoint dell'IDE**:

- Usa PyCharm o VS Code per impostare breakpoint all'interno di `step()` dell'algoritmo o della logica di valutazione.
- Ispeziona i valori delle variabili, i contenuti dei tensori o le transizioni di stato.
- Fai attenzione con tensori grandi — limita ciò che ispezioni per evitare crash.

**(4) Test Unitari dei Componenti Personalizzati**:

- Testa le funzioni di crossover/mutazione separatamente.
- Usa input sintetici per validare le forme di output e la logica prima dell'integrazione completa.

**(5) Profila l'Esecuzione**:

- Usa `torch.autograd.profiler.profile` o `time.time()` per misurare i tempi dei passi.
- Ti aiuta a localizzare colli di bottiglia o cicli infiniti.
- Identifica se i rallentamenti sono nella valutazione o nella logica dell'algoritmo.

**(6) Registra l'Output su File**:

- Scrivi i log su file `.csv` per esecuzioni lunghe.
- Includi la migliore fitness per generazione, statistiche di diversità, ecc.
- Utile quando i crash impediscono di vedere l'output della console.

Nel complesso, il debug dei progetti EvoX richiede un equilibrio tra verifiche di correttezza e analisi dei risultati. Concentrati prima sull'assicurarti che l'algoritmo funzioni correttamente, poi ottimizza la sua efficacia.

---

## 6.3 Guida all'Ottimizzazione delle Prestazioni

Questi suggerimenti ti aiutano a ottenere più velocità e qualità da EvoX:

**(1) Scalabilità Progressiva**:

- **Inizia in piccolo**: Testa la logica con input piccoli.
- **Scala gradualmente** e osserva come aumenta il tempo di esecuzione.
- **Identifica le inefficienze** se la scalabilità è non lineare (ad es. 10x popolazione -> >10x tempo).

**(2) Monitora l'Utilizzo dell'Hardware**:

- Usa `nvidia-smi` per la GPU, `htop` per la CPU.
- Un utilizzo GPU elevato (>50%) è ideale.
- Un basso utilizzo GPU può significare che i dati non sono sulla GPU o che trasferimenti frequenti CPU-GPU rallentano le cose.

**(3) Regola il Parallelismo**:

- Imposta i thread CPU: `torch.set_num_threads(n)`.
- Evita la sovrascrizione se usi strumenti di valutazione multi-thread.
- Per la GPU, ottimizza i thread del `DataLoader` se usi ambienti batch o dataset.

**(4) Sfrutta la Valutazione Batch**:

- La valutazione batch è più veloce della valutazione per singolo individuo.
- Vettorizza sempre `Problem.evaluate()` per elaborare intere popolazioni.

**(5) Riduci l'Overhead di Python**:

- Sposta la logica pesante all'interno di `Algorithm` o `Problem`, evita codice Python complesso nel ciclo principale.
- Usa `workflow.step()` per la maggior parte delle operazioni.
- Minimizza la diagnostica per generazione se rallenta le esecuzioni.

**(6) Regola la Scelta dell'Algoritmo**:

- Prova CMA-ES, GA, PSO, RVEA, ecc. — nessun singolo algoritmo è il migliore per tutti i problemi.
- Un algoritmo che converge più velocemente può risparmiare più tempo rispetto alla micro-ottimizzazione di uno che converge lentamente.

L'ottimizzazione delle prestazioni è iterativa. Con pazienza, puoi passare da ore di esecuzione a minuti. EvoX ti offre molte "manopole" — usale saggiamente per bilanciare velocità e qualità della soluzione.
