---
title: "Genesis sviluppa EvoX Compiler: contratti, test dei grafi e sincronizzazione dei dispositivi"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Come Genesis ha sviluppato un compilatore di grafi tensoriali basato su fasi esplicite, verifiche di trasformazione e contratti backend, con esempi concreti tratti dai suoi test pubblici."
---

Costruire un compilatore di grafi tensoriali significa mantenere coerenti diverse implementazioni dello stesso calcolo. Una trasformazione del grafo può cambiare il layout dei tensori; un adattatore può rifiutare un'operazione; una chiamata al dispositivo può ritornare prima che il calcolo sia terminato. Il caso di EvoX Compiler di Genesis diventa utile quando tali confini vengono esaminati individualmente.

![Grafi del compilatore verificati rispetto ai test di regressione](./compiler-contract-layers.webp)

Lo [snapshot Evidence del 28 ottobre](https://genesis.evox.group/evidence/evoxc/) registra 6.789 test superati e circa 50 USD in costi per i token dei modelli. Per esaminare l'ingegneria dietro queste cifre, questo articolo utilizza anche il codice sorgente v0.1.0 accessibile pubblicamente. Lo snapshot e la release presentano totali di test differenti; gli esempi di implementazione riportati di seguito sono identificati dalla loro versione.

## Trasformare l'obiettivo in interfacce testabili

EvoX Compiler detiene il linguaggio tensoriale, il grafo EvoXIR e le interfacce di staging. I compilatori esterni ricevono la sua rappresentazione esportata e gestiscono l'ottimizzazione, lo scheduling e la generazione del codice. I suoi [contratti di pacchetto](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) documentano la direzione delle dipendenze: i tipi di valore e l'IR sostengono il tracciamento e le operazioni, mentre le trasformazioni e gli adattatori si appoggiano su questi livelli. Il pacchetto separato `evoxc_hf` consuma l'API pubblica del compilatore; il compilatore non importa l'integrazione del modello.

Questa divisione fornisce al lavoro di sviluppo locale un confine concreto. Ad esempio, una trasformazione produce un altro grafo ordinario invece di richiedere che ogni backend comprenda il `vmap` di Python. Una lacuna del backend deve diventare un errore esplicito invece di cambiare silenziosamente il percorso di esecuzione. I documenti di contesto a livello di pacchetto registrano le API e i vincoli che ogni altra attività di sviluppo deve preservare.

La pipeline pubblica è `trace → lower → compile → load → run`. Ogni fase restituisce un oggetto distinto. I [test di specifica](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) controllano gli input nelle fasi errate, rifiutano chiamate eager dirette alle definizioni dei grafi e verificano che le funzioni di utilità si espandano nella pipeline documentata. Impediscono inoltre la cattura di un tensore concreto da una closure, a meno che l'autore non lo incorpori esplicitamente. Il vantaggio pratico è che una scorciatoia apparentemente comoda non può introdurre silenziosamente un secondo set di semantiche.

Secondo il registro di Evidence, lo sviluppo è proceduto livello dopo livello, con verifiche pytest richieste prima di passare al livello successivo. Il repository fornisce contratti e test ispezionabili per questo metodo; non fornisce una sequenza archiviata completa delle decisioni degli agenti.

## Una trasformazione di popolazione verificata rispetto a due riferimenti

Una funzionalità impegnativa è `batch_functions`: combinare più programmi con firme di input/output corrispondenti in un unico grafo. Il suo contratto è più forte del semplice "il grafo combinato viene eseguito": la riga di output i deve comunque corrispondere al risultato del programma i.

I [test di integrazione v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) esercitano un esempio piccolo e leggibile. Nella stessa posizione del grafo, tre programmi eseguono `x + 1`, `x * 2` e `x - 3`. Con `switch_ops=True`, il grafo unito rappresenta le diverse operazioni tramite una selezione per riga. I test compilano tale grafo attraverso il percorso CPU di IREE e confrontano il suo output sia con l'esecuzione NumPy del grafo unito, sia con i risultati NumPy impilati delle funzioni originali, con `rtol=atol=1e-5`.

Controlli privi di compilatore ispezionano l'output StableHLO per l'operazione di selezione attesa. Un altro controllo unisce programmi identici e confronta il risultato con `vmap`, dove non dovrebbe essere necessaria alcuna selezione. Insieme, questi test sondano la preservazione del programma, l'esportazione e l'integrazione del backend, invece di utilizzare la compilazione riuscita come unica condizione di accettazione.

## Il posizionamento sui dispositivi è parte della correttezza

Un eseguibile in esecuzione su una GPU non dovrebbe accettare dati dall'host fingendo che siano già residenti sul dispositivo. I [test delle specifiche dei tensori e del posizionamento](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verificano che i dati abbiano un dispositivo fisico, che i trasferimenti siano espliciti tramite `Tensor.to(device)` e che un posizionamento non valido sollevi un `DeviceError`.

Questo è rilevante anche per la misurazione delle prestazioni. Se ogni chiamata trasferisce nuovamente i pesi del modello, un dato sulla latenza misurerebbe un carico di lavoro diverso rispetto a uno che li mantiene residenti. La [documentazione di integrazione del modello v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) separa il caricamento del checkpoint, il calcolo forward e lo staging dell'eseguibile. I parametri rimangono input espliciti del grafo, rendendo visibile il loro posizionamento.

## Una chiamata restituita non è necessariamente un lavoro completato

Il percorso residente su dispositivo di XLA può accodare il lavoro e ritornare prima del completamento. Cronometrare solo `run` porterebbe quindi a sottostimare l'esecuzione. I [test di sincronizzazione](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) controllano il ciclo di vita degli eventi: le esecuzioni accumulano handle di completamento; `synchronize()` li attende e li distrugge; una seconda sincronizzazione non esegue ulteriore lavoro di plugin.

I casi di errore sono altrettanto specifici. Se l'attesa fallisce, gli handle rimanenti devono comunque essere elaborati e deve essere sollevato il primo errore. Un plugin che non fornisce alcun evento di completamento deve innescare un errore esplicito invece di una falsa dichiarazione di completamento.

Questi test utilizzano un piccolo plugin PJRT fittizio che non esegue calcoli numerici. Verificano la semantica di sincronizzazione e la pulizia, non il throughput della GPU o l'accuratezza numerica. Tale distinzione mantiene l'evidenza del test coerente con quanto dichiarato.

## Mantenere separati il risultato storico e il risultato della release

| Record | Configurazione | Risultato riportato |
| --- | --- | --- |
| Snapshot Evidence 28 ottobre | IREE installato | 6.789 superati; 46 saltati; 3 fallimenti previsti; 0 falliti |
| Snapshot Evidence 28 ottobre | Senza compilatore | 6.367 superati; 95 saltati; 3 fallimenti previsti |
| README release v0.1.0 | Suite core e integrazione modelli, tutti gli extra elencati installati | 7.511 superati; 77 saltati; 4 fallimenti previsti; 0 falliti |

Fonti: [Verifica Evidence](https://genesis.evox.group/evidence/evoxc/#verification) e [stato della release con versione](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Queste sono esecuzioni riportate dal progetto. Le protezioni per dipendenze e hardware spiegano i percorsi non esercitati; un test CPU superato non è una convalida di ogni acceleratore.

Le 285.659 righe di testo tracciate nello snapshot di Evidence includono test, documentazione e materiale di benchmark. I suoi circa 50 USD coprono i token dei modelli, escluso l'hardware; il modello, il numero di episodi e il tempo di esecuzione attiva non sono stati riportati. L'arco temporale del repository non rappresenta un runtime autonomo continuo.

Il repository attribuisce a Genesis la produzione del suo codice, dei test e della documentazione. Il risultato concreto è un compilatore con contratti di fase ispezionabili separatamente, test di preservazione del grafo e semantica di completamento del dispositivo. Si consiglia di iniziare dal [test di integrazione della popolazione](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) per seguire una funzionalità attraverso questi confini; la [panoramica di EvoX Compiler](/news/evox-compiler) spiega la pipeline rivolta all'utente.
