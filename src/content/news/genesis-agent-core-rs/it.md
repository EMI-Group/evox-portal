---
title: "Genesis porta openJiuwen in Rust e verifica i contratti degli Agent"
pubDate: 2026-11-20
summary: "Il nuovo Evidence agent-core-rs documenta 30 crate Rust, esempi di ripristino e approvazione e 150,02 dollari di costi del modello per due attività."
---

Cambiare il linguaggio di un SDK per Agent va oltre la traduzione delle funzioni. Le sessioni salvate devono ripristinarsi, gli strumenti attendere l’approvazione e i workflow seguire il ramo previsto. Il [nuovo Evidence pubblicato da Genesis il 20 novembre 2026][evidence] rende concreti questi comportamenti con **agent-core-rs**, una riscrittura Rust di openJiuwen agent-core.

Usando il Python SDK v0.1.20 come riferimento in sola lettura, EvoX Genesis ha prodotto **30 crate Rust e 26 esempi eseguibili**. Il resoconto comprende la conversione iniziale e lo sviluppo successivo del codice conservato. Il contributo principale è il collegamento verificabile tra obiettivi di compatibilità, esempi eseguibili e registrazioni delle verifiche.

![Illustrazione concettuale della conversione di codice Python in Rust con rami di workflow corrispondenti](./contract-migration-v2.webp)

## Cambiare implementazione preservando il contratto

Lo [snapshot 242b5b5][repo] mira a preservare campi Card JSON, formati di comunicazione dei modelli, sessioni persistenti, riferimenti dei workflow e comportamento della CLI. Tipi e trait Rust, esecuzione asincrona con Tokio e serializzazione Serde sostituiscono i meccanismi Python. I tipi condivisi stanno sotto i loro utilizzatori; i crate aggregatori riesportano le API senza duplicarne il comportamento.

La compatibilità riguarda il sottoinsieme implementato. La [matrice di copertura][parity] distingue interfacce supportate, implementazioni parziali e aree rinviate: esecuzione distribuita, GPU/ML e alcune integrazioni con fornitori o servizi esterni. Dove esiste un percorso Unsupported tipizzato, viene restituito un errore esplicito; altre lacune non hanno implementazione. La distinzione conta nella scelta dell’applicazione da migrare.

## Una sessione ripristinata e uno strumento in attesa

L’[esempio di sessione][session] salva un checkpoint in una directory temporanea, crea una nuova sessione con la stessa identità e radice di archiviazione e ripristina lo stato. La verifica attraversa un confine di persistenza: mantenere il primo oggetto in memoria non dimostrerebbe la stessa proprietà.

Lo scenario di approvazione introduce un blocco prima di una chiamata simulata a uno strumento. Un contatore verifica che lo strumento non sia stato eseguito durante l’attesa. Una nuova invocazione con i dati di approvazione corretti permette l’esecuzione. Un modello scriptato e uno strumento strumentato rendono osservabile l’ordine senza credenziali del fornitore.

L’[esempio di workflow][workflow] controlla un altro problema d’integrazione. Due input percorrono i rami breve e lungo della stessa topologia compilata, passando valori tramite riferimenti ai campi dei nodi. Collegare direttamente due predecessori mutuamente esclusivi creerebbe una congiunzione in attesa di entrambi. Componenti di inoltro e attivazione esplicita dei percorsi consentono a ciascun ramo di raggiungere la fine comune. Conservare i nomi dei campi non basta a preservare la pianificazione.

## Due attività con un perimetro di costo definito

L’[appendice storica][history] documenta la conversione iniziale dall’11 al 16 novembre UTC, fermata manualmente conservandone il risultato, e un’attività di evoluzione completata il 19 novembre UTC. Le chiamate attribuite a DeepSeek V4 Flash ammontano a **150,024283 dollari** per le due attività.

I tempi trascorsi sommano **113 ore e 42 minuti**, comprese attese e code; l’intervallo di calendario supera otto giorni. Le 3.570 istanze Agent registrate sono cumulative, non il picco di concorrenza. Il costo esclude infrastruttura, lavoro umano e documentazione successiva. Anche un’attività intermedia fallita è esclusa perché il consumo è sconosciuto.

L’appendice conta 1.434.767 righe fisiche Rust, inclusi commenti e righe vuote, tra codice di produzione, test ed esempi. Il dato descrive la dimensione dell’artefatto; sono le verifiche comportamentali a stabilire cosa preserva la riscrittura.

## Cosa dimostra la verifica

Il [resoconto delle verifiche][parity] riporta il superamento di formattazione, Clippy, test offline del workspace, Rustdoc, sette gruppi di feature e compilazione degli esempi. **24.293 è il numero di funzioni di test nel sorgente**, non il totale di test superati acquisito durante un’esecuzione. Cinque voci ignorate sono ausiliari o sonde dipendenti dall’ambiente. La successiva attività documentale ha rieseguito solo controlli selezionati.

Modelli scriptati, server locali simulati, storage temporaneo e socket di loopback verificano protocolli e comportamento runtime. Consentono controlli ripetibili senza credenziali reali; il successo dei compiti con modelli reali resta una valutazione separata. Sono risultati dichiarati dal progetto: non abbiamo rieseguito indipendentemente la suite Rust.

## Operazioni locali più veloci, nel carico misurato

Il [rapporto di benchmark][bench] confronta una build Rust release con CPython 3.11.15 su un host Linux a otto CPU logiche, con cache delle pagine calda. Il rendering dei prompt richiede **0,356 µs contro 16,37 µs**, circa **46×** più rapido. Un grafo a due nodi senza I/O richiede **7,23 µs contro 112,3 µs**, circa **15×**.

I batch ripetuti vengono normalizzati per operazione; quelli Rust sono dieci volte più grandi. La forma logica del grafo coincide, ma i motori differiscono. I rapporti descrivono l’overhead locale del framework, escludendo latenza di modello/rete, avvio a cache fredda e scalabilità concorrente. Le misure separate del primo grafo Python e di un turno Agent scriptato Rust eseguono lavori diversi e non forniscono rapporti equivalenti di avvio o memoria.

## Partire da un comportamento da preservare

Per valutare una migrazione, checkpoint, approvazione e routing condizionale offrono criteri concreti di accettazione. Verifichi l’integrazione prevista nella [matrice][parity], prepari l’ambiente di compilazione e utilizzi `make verify`. `cargo test --workspace --offline --no-fail-fast` include i crate di sviluppo omessi da un semplice `cargo test`.

Il workspace è distribuito come sorgente, con `publish = false`. Sono disponibili l’[Evidence completo][evidence] e l’[implementazione fissata][repo]. Insieme alla precedente [riscrittura di MESA](/it/news/genesis-mesa), il caso mostra come valutare Genesis attraverso i comportamenti preservati oltre che la nuova implementazione.

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

