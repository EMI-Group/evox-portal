---
title: "EvoX Genesis: Sviluppare un Compilatore C attraverso Fasi Ispezionabili e Gate di Regressione"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "Il caso del compilatore C segue un'implementazione vuota attraverso fasi del compilatore, diagnostica e suite di test esterne, con risultati mantenuti entro il loro ambito documentato."
---

Partire da un'implementazione vuota è un obiettivo chiaro; produrre un eseguibile che si comporti correttamente è una condizione di accettazione molto più esigente. Il caso del compilatore C di Genesis può essere esaminato attraverso le interfacce che ha costruito e i livelli di verifica che le circondano.

![Moduli sorgente assemblati in un progetto software in crescita](./software-world-continuity.webp)

Il [record Evidence del compilatore C](https://genesis.evox.group/evidence/c-compiler/) riporta **248.989 righe di Rust**, **1.019 episodi agent archiviati**, **123,4 ore** e **44,38 USD in costi per i token del modello**, utilizzando DeepSeek V4 Flash. Elenca 220/220 casi della c-testsuite, 32/36 casi LLVM valutati e 2.904/2.904 test Rust. Questi sono risultati riportati dal progetto, non una nuova riproduzione per questo articolo.

## Far transitare un primo programma attraverso ogni fase

Il compilatore pubblico, jcc, documenta una sequenza di milestone ingegneristiche: stabilire il workspace, costruire uno scheletro di compilazione end-to-end, estendere la copertura del linguaggio, aggiungere l'ottimizzazione, quindi esercitare suite esterne e build di applicazioni. La [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) definisce tali gate; essa va letta come il record di sviluppo del repository piuttosto che come una trascrizione temporale di ogni episodio di Genesis.

L'[architettura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) connette preprocessamento, analisi lessicale e sintattica, controlli semantici, lowering in CIR, ottimizzazione, generazione del codice macchina, assemblaggio degli oggetti e linking. Crate separati gestiscono tali fasi.

Questa struttura crea utili artefatti intermedi. `-E` si ferma dopo il preprocessamento; `-emit-jcc-ir` espone la CIR; `-S` emette l'assembly; `-c` produce un oggetto. Quando un programma compilato fallisce, questi confini restringono l'indagine prima di modificare l'intera pipeline.

## Preservare la semantica del C attraverso la rappresentazione intermedia

La CIR è la rappresentazione SSA tipizzata del compilatore, separata dalla LLVM IR. L'ottimizzazione trasforma la CIR in CIR; il workflow di build di debug documentato esegue il verifier dopo i passaggi. La [guida al testing](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descrive i controlli per il lowering, le rappresentazioni non valide, le riscritture, la codifica delle istruzioni e il comportamento della riga di comando.

La verifica della rappresentazione è un livello, non una prova di compilazione corretta. Una trasformazione strutturalmente valida può comunque cambiare il risultato di un programma. Per questo motivo la strategia di test compila ed esegue anche programmi C e ne confronta l'output.

Il corpus include fallimenti di compilazione intenzionali: i test controllano la gravità della diagnostica, il messaggio e lo span del sorgente. Ciò preserva il comportamento di rifiuto per input non validi insieme al comportamento di esecuzione corretta. Il [documento di conformità C11](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) del compilatore registra i costrutti supportati e la politica delle estensioni.

## Le suite esterne testano il percorso completo

L'[harness c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) fornisce un gate di test del linguaggio esterno. Il [runner LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) pilota CMake con il compilatore sotto test, compila i programmi e confronta l'esecuzione con l'output di riferimento. Il suo confronto numerico predefinito utilizza una tolleranza di 1e-4, mentre i token non numerici e lo stato di uscita devono corrispondere esattamente.

L'[harness Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) aggiunge il testing differenziale di programmi generati rispetto a un compilatore di riferimento. Nello snapshot del README ispezionato, la sua esecuzione con 100 seed riporta **93 superati, 0 falliti e 7 saltati**, con i salti attribuiti al timeout di entrambi i compilatori. Definire questo come “93/93” senza i seed saltati nasconderebbe parte del carico di lavoro.

Questi controlli rilevano diverse classi di errore: una suite di linguaggio sonda costrutti specifici, i programmi casuali esplorano le combinazioni e le build di applicazioni collegate esercitano insieme il driver, i file oggetto e le interfacce runtime.

## Mantenere il successo legato all'operazione testata

Il [README versionato](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) riporta che lz4 viene compilato e supera i suoi otto test essenziali. Descrive SQLite come analizzato e convertito (lowering) correttamente, con ulteriori lavori di verifica completi sui file registrati. L'analisi di SQLite è una milestone di integrazione utile; non equivale a superare la suite completa di test runtime di SQLite.

La stessa fonte elenca l'aritmetica `long double` parziale, piattaforme differite e gate documentati sulla politica delle estensioni. Il risultato LLVM di 32/36 deve quindi mantenere il suo sottoinsieme valutato e le relative esclusioni. Il README e la pagina Evidence presentano inoltre conteggi diversi per i test del workspace; questo articolo mantiene il totale di Evidence allegato al suo record invece di combinare gli snapshot.

## Cosa persiste tra i task di sviluppo

Il [modello di sviluppo documentato](https://genesis.evox.group/getting-started/) di Genesis utilizza la decomposizione ricorsiva dei task attorno a un progetto software. In questo caso, gli artefatti ingegneristici durevoli sono concreti: moduli sorgente, contratti di rappresentazione, output intermedi, diagnostica e harness di regressione. Un task successivo può lavorare su quegli artefatti invece di affidarsi esclusivamente alla conversazione di un predecessore.

Il [caso di continuazione del modello](/news/genesis-compiler-continuation) esamina un passaggio di consegne successivo e il suo risultato da 1.820 casi con ambito separato. La [riscrittura di MESA](/news/genesis-mesa) utilizza il comportamento numerico originale come riferimento, mentre [EvoX Compiler](/news/genesis-evoxc) controlla i grafi tensoriali e i contratti dei dispositivi. Si tratta di problemi di verifica distinti piuttosto che di esecuzioni aggiuntive dello stesso esperimento del compilatore.

44,38 USD coprono i token del modello ed escludono l'hardware. I record pubblici supportano un caso sostanziale di costruzione di un compilatore entro l'ambito riportato; non stabiliscono una compatibilità C illimitata. Per ispezionare il risultato, segua l'[architettura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) in un harness esterno, quindi esamini gli esatti programmi e output che ne definiscono il gate.
