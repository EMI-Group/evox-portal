---
title: "Genesis: conservare i progressi del software attraverso i cambi di modello"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Un passaggio di compilatore esplora come codice accettato, struttura e registri di verifica sostengano lo sviluppo quando cambia il modello."
---

*Aggiornato il 7 novembre 2026. I risultati storici mantengono la data della rilevazione originale.*

I sistemi di IA evolutiva devono preservare i progressi utili quando cambiano i partecipanti. Genesis studia questo requisito nel passaggio di un compilatore: un nuovo modello può continuare dal progetto accettato, usando codice, vincoli e test come base per altro lavoro?

## Partire da un compilatore esistente

Il [record Evidence del 7 settembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) descrive il passaggio da **GLM 5.2 a DeepSeek V4 Flash** sulla stessa linea di sviluppo accettata. Il contesto della conversazione precedente non è stato trasferito.

Codice, struttura e cronologia accettata rimanevano disponibili. È la continuazione di un progetto, non la costruzione di un secondo compilatore indipendente.

## Preservare il sistema ereditato

Un compilatore collega parsing, analisi semantica, rappresentazioni intermedie e generazione del codice. Una modifica locale può influenzare altri moduli: occorrono integrazione e controlli di regressione, oltre al nuovo codice.

Il repository jcc mostra implementazione Rust, rappresentazione intermedia, limiti funzionali e strumenti di test. Il suo README descrive però un altro momento dello sviluppo e non sostituisce il record della continuazione.

## Risultati riportati

La profondità ricorsiva passa da **4 a 8**, con **1.820/1.820 casi LLVM SingleSource mantenuti superati** dopo il passaggio. È il sottoinsieme definito per la valutazione, non l’intera suite LLVM.

La profondità indica la scomposizione del lavoro, non direttamente la qualità. Sono i test a fornire evidenza comportamentale; per una conclusione generale servirebbero altri carichi e ripetizioni.

## Interpretare la continuità

La lezione pratica è conservare ciò che il successore può verificare: codice, interfacce, vincoli, modifiche accettate e procedure di valutazione. La memoria della conversazione può aiutare senza essere l’unico supporto dei progressi.

Parta dalla baseline ereditata e dall’elenco esatto dei test. Registri revisione validata, esclusioni e comandi prima di confrontare miglioramenti successivi.

## Uno sviluppo che accumula risultati

Formazione e continuazione condividono [lo stesso repository](https://github.com/EMI-Group/genesis-demo-jcc). Non vanno contate come progetti indipendenti né sommate valutazioni di ambito diverso. Codice aggiunto e costo della continuazione non sono riportati.

Questo caso riportato dal progetto trasforma la continuità dello sviluppo in una domanda architetturale: cosa deve conservare un progetto perché altri agenti possano estenderlo? Nell'ecosistema EvoX, ciò collega capacità dei modelli e sviluppo cumulativo dei sistemi. I test mantenuti sostengono questo passaggio; un'affidabilità più ampia richiede ulteriori valutazioni.
