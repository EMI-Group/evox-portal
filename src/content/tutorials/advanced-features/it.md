---
title: "4. Funzionalità Avanzate"
order: 4
---

# 4. Funzionalità Avanzate

EvoX offre molte **funzionalità avanzate** per soddisfare esigenze più complesse. Dopo aver familiarizzato con le basi, questo capitolo introduce come personalizzare la configurazione del framework, gestire i moduli plugin opzionali e ottimizzare le prestazioni — consentendoti di estendere e regolare EvoX quando necessario.

## Configurazione Personalizzata

Le impostazioni predefinite di EvoX sono adatte alla maggior parte delle situazioni, ma a volte potresti voler personalizzare il comportamento o i parametri del framework. Ad esempio:

- **Regolazione dei Parametri dell'Algoritmo**: Oltre alla dimensione della popolazione e al numero di iterazioni di base, molti algoritmi espongono parametri avanzati. Ad esempio, CMA-ES consente la configurazione della matrice di covarianza iniziale, e NSGA-II espone parametri di distanza di affollamento. Puoi passare parametri al costruttore dell'algoritmo, ad es. `GA(crossover_prob=0.9, mutation_prob=0.1)` personalizza le probabilità di crossover e mutazione nell'Algoritmo Genetico. La regolazione di questi può affinare le prestazioni. Consulta la documentazione di EvoX per l'API di ogni algoritmo, dove sono elencati i parametri disponibili e i valori predefiniti.

- **Sostituzione dei Componenti Operatore**: Puoi sostituire gli operatori evolutivi interni (ad es. strategie di selezione o mutazione). Alcune classi di algoritmi supportano il passaggio di oggetti operatore personalizzati. Ad esempio, l'Evoluzione Differenziale (DE) può supportare operatori di mutazione personalizzati, consentendoti di fornire una funzione personalizzata o una classe `Operator`. Il design modulare di EvoX supporta questa sostituzione in stile "plugin". Questo richiede tipicamente la comprensione degli interni dell'algoritmo e non è solitamente necessario per i casi d'uso standard.

- **Impostazioni Multi-Obiettivo**: Per l'ottimizzazione multi-obiettivo, potresti dover configurare preferenze o pesi — ad esempio, impostare vettori di peso per metodi a somma pesata o regolare punti di riferimento durante l'evoluzione. Queste configurazioni sono tipicamente esposte tramite parametri nella classe del problema o dell'algoritmo. Ad esempio, `problem = DTLZ2(d=12, m=3)` definisce un problema a 12 dimensioni e 3 obiettivi. Alcuni algoritmi consentono il passaggio di vettori di riferimento personalizzati. Leggere la documentazione dell'algoritmo ti aiuta a sfruttare appieno tali impostazioni.

- **Logging e Output**: Il `EvalMonitor` predefinito registra già le metriche chiave di ottimizzazione. Se hai bisogno di informazioni extra (ad es. diversità della popolazione o fitness media per generazione), puoi personalizzare il monitor o registrare manualmente all'interno del tuo ciclo. Per attività di lunga durata, potresti voler registrare su file. Questo può essere fatto usando la libreria `logging` di Python o semplice I/O su file per aggiungere risultati per analisi successive.

In sintesi, la configurazione personalizzata significa modificare il comportamento predefinito di EvoX per un'attività specifica. Questo di solito comporta un uso più approfondito dell'API di EvoX. Tratteremo di più nella sezione **sviluppo ed estensione**. Per i principianti, ricorda: EvoX offre interfacce flessibili che consentono agli utenti esperti di regolare quasi ogni dettaglio — ma puoi anche attenerti ai valori predefiniti e ottenere risultati rapidamente.

## Gestione dei Plugin

I "plugin" qui si riferiscono a componenti opzionali o moduli di estensione in EvoX — come strumenti di visualizzazione, wrapper per ambienti di apprendimento per rinforzo e progetti correlati nell'ecosistema EvoX. La gestione dei plugin in EvoX riguarda principalmente l'**installazione e l'uso di moduli opzionali**. Ecco alcune estensioni chiave e come gestirle:

- **Plugin di Visualizzazione**: EvoX include il modulo `evox.vis_tools`, che contiene un sottomodulo `plot` per la creazione di grafici e supporta il formato di log `.exv` per flussi di dati in tempo reale. Per usare la visualizzazione, installa EvoX con l'extra `vis`: `pip install evox[vis]`. (Se non installato inizialmente, puoi installarlo successivamente o semplicemente eseguire `pip install plotly` per soddisfare le dipendenze.) Quando usi gli strumenti visivi, tipicamente chiami le funzioni di plot dopo che il monitor ha registrato i dati — ad esempio, `EvalMonitor.plot()` usa `vis_tools.plot`. Assicurarsi che questo plugin sia installato evita errori da librerie mancanti come `matplotlib`.

- **Plugin di Neuroevoluzione**: EvoX supporta ambienti di apprendimento per rinforzo (come il motore fisico Brax) e l'ottimizzazione di individui neurali (neuroevoluzione). Queste funzionalità sono raggruppate nell'estensione `neuroevolution`, installata tramite `pip install "evox[neuroevolution]"`. Questo include la libreria Google Brax, Gym e altro. Dopo l'installazione, puoi usare wrapper come `BraxProblem` in `evox.problems.neuroevolution` per trasformare ambienti RL in problemi di ottimizzazione. Strumenti come `ParamsAndVector` sono inclusi anche per appiattire i parametri dei modelli PyTorch in vettori per l'evoluzione. Nota che Brax funziona solo su Linux o Windows tramite WSL — Python nativo su Windows potrebbe funzionare solo su CPU. In breve, abilitare o disabilitare i plugin di EvoX è controllato tramite l'installazione di extra specifici.

- **Progetti Correlati**: EvoX ha progetti correlati come EvoRL (focalizzato sull'apprendimento per rinforzo evolutivo) e EvoGP (programmazione genetica accelerata da GPU). Questi condividono la filosofia di design e l'interfaccia di EvoX. Se la tua attività è fortemente orientata all'RL, potresti preferire questi framework dedicati. Gestire questi plugin significa garantire la compatibilità delle versioni e soddisfare le dipendenze. Ad esempio, EvoRL usa JAX e Brax, mentre EvoGP potrebbe richiedere librerie di alberi simbolici. Queste librerie possono solitamente coesistere senza conflitti. Pensale come strumenti complementari che possono essere chiamati dal progetto principale EvoX — o esclusi completamente per una configurazione leggera.

- **Plugin Personalizzati**: Grazie alla modularità di EvoX, puoi costruire i tuoi "plugin". Ad esempio, crea una classe `Monitor` personalizzata per tracciare metriche uniche, o una sottoclasse `Problem` personalizzata che incapsula un simulatore di terze parti. Questi estendono effettivamente le capacità di EvoX. La migliore pratica è seguire i contratti di interfaccia di EvoX — ad esempio, assicurati che il tuo `Problem` personalizzato abbia un metodo `evaluate()`, o che il tuo `Monitor` personalizzato erediti da una classe base. Una volta testato, potresti persino contribuirlo alle future release di EvoX.

Nel complesso, la gestione dei plugin in EvoX riguarda l'**estensione flessibile e il controllo delle dipendenze**. Come principiante, durante l'installazione, puoi decidere se includere le estensioni `vis` e `neuroevolution`. Se non installate inizialmente, possono essere aggiunte successivamente. Con i plugin, puoi monitorare il progresso dell'ottimizzazione più facilmente e integrare EvoX con strumenti esterni per una maggiore potenza.

## Ottimizzazione delle Prestazioni

Le prestazioni sono un punto di forza principale di EvoX. Anche usando lo stesso algoritmo, il supporto GPU di EvoX può aumentare la velocità di diversi ordini di grandezza. Tuttavia, per sfruttare appieno questo potenziale, vorrai seguire alcuni suggerimenti:

- **Usa il Parallelismo GPU**: Prima di tutto, assicurati che il tuo codice sia effettivamente in esecuzione sulla GPU. Come notato in precedenza, installa PyTorch abilitato per CUDA e sposta i dati sui dispositivi GPU. Se le cose sembrano lente, verifica con `torch.cuda.is_available()` — dovrebbe restituire `True`. Se la GPU esiste ma non viene usata, è probabile che i tensori siano stati creati sulla CPU per impostazione predefinita. Risolvi impostando esplicitamente il `device`, o assicurandoti che i tensori di input (come `lb`/`ub`) siano su CUDA. EvoX seguirà il dispositivo di questi input. Su sistemi multi-GPU, EvoX generalmente usa **una GPU per processo**. Per sfruttare più GPU, puoi eseguire più processi con GPU diverse o attendere il supporto futuro per l'esecuzione coordinata multi-GPU.

- **Valutazione Parallela**: Un collo di bottiglia chiave negli algoritmi evolutivi è la **valutazione della fitness**. Poiché le valutazioni sono spesso indipendenti, possono essere parallelizzate. EvoX raggruppa le valutazioni quando possibile — ad esempio, le valutazioni di reti neurali o funzioni polinomiali possono essere calcolate in parallelo usando la GPU. Per problemi personalizzati, evita i cicli Python — vettorizza il tuo codice di valutazione per elaborare un intero batch di candidati contemporaneamente. Questo sfrutta al massimo le capacità parallele di PyTorch. In parole semplici: fai in modo che la funzione `evaluate()` del tuo problema operi su batch — non su singole soluzioni — per un'accelerazione massiccia.

- **Compila per l'Ottimizzazione**: PyTorch 2.0 ha introdotto `torch.compile`, che compila JIT modelli/funzioni per migliorare le prestazioni. Se la tua logica di valutazione è complessa, considera di compilare prima dell'esecuzione:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Questo potrebbe migliorare significativamente le prestazioni.
  > **Nota:**
> La compilazione aggiunge overhead e non è sempre supportata da tutte le funzioni o problemi. Più adatta per attività su larga scala e di lunga durata. Su Windows, assicurati che Triton sia installato affinché `torch.compile` funzioni.

- **Regola la Dimensione della Popolazione**: Una popolazione più grande aumenta la diversità e la capacità di ricerca globale — ma aumenta anche il calcolo per generazione. Bilancia qualità e velocità regolando `pop_size`. Su GPU, puoi spesso aumentarla senza un costo temporale lineare (grazie al parallelismo). Ma una dimensione troppo grande può causare problemi di memoria. Se stai esaurendo la memoria GPU, riduci la dimensione della popolazione o la dimensione del problema, o usa FP16 per risparmiare spazio (imposta tramite `torch.set_float32_matmul_precision('medium')`).

- **Riduci l'Overhead di Python**: EvoX sposta la maggior parte del calcolo principale su `torch.Tensor`, ma i cicli scritti dall'utente o gli operatori personalizzati dovrebbero evitare eccessive operazioni a livello Python. Evita stampe frequenti (alto costo I/O), liste o conversioni di tipo dati. Mantieni il tuo codice vettorizzato/tensorizzato per sfruttare i kernel veloci C++/CUDA sottostanti e ridurre l'overhead dell'interprete Python.

- **Distribuzione Distribuita**: Per problemi ultra-grandi, considera l'esecuzione su più macchine. EvoX supporta configurazioni multi-nodo (tramite comunicazione backend e sharding). Sebbene non sia adatto ai principianti, è bene sapere che esiste. Con un cluster GPU, consulta la documentazione di EvoX per la distribuzione distribuita. Di solito, dovrai impostare variabili d'ambiente o lanciare con script speciali. L'architettura consente allo stesso codice di funzionare su configurazioni a singolo nodo o multi-nodo. Per il tuo primo tentativo, simulalo con più processi su una singola macchina.

- **Profilazione delle Prestazioni**: Per approfondire, usa strumenti come il profiler di PyTorch o `cProfile` di Python per analizzare i colli di bottiglia. Questo ti aiuta a identificare se il tempo va nella valutazione, nella selezione o in qualcos'altro — così puoi ottimizzare di conseguenza (ad es. memorizzando nella cache calcoli ripetuti). EvoX è costruito per le prestazioni, ma le attività del mondo reale possono comunque incontrare colli di bottiglia unici che necessitano di analisi.

In breve, mentre EvoX è già ottimizzato a livello architetturale, gli utenti possono ulteriormente migliorare le prestazioni **usando correttamente le GPU**, **calcolando in batch** e **regolando i parametri**. Mentre insegui la velocità, ricorda anche di mantenere la qualità dei risultati — l'equilibrio è la chiave. Man mano che acquisisci familiarità con EvoX, l'ottimizzazione delle prestazioni diventerà una seconda natura.
