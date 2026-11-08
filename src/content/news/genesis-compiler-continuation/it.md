---
title: "Genesis: conservare i progressi del software attraverso i cambi di modello"
pubDate: 2026-11-03
summary: "Un passaggio di compilatore esplora come codice accettato, struttura e registri di verifica sostengano lo sviluppo quando cambia il modello."
updatedDate: 2026-11-08
---

Il [record Evidence del 7 settembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) descrive il passaggio da **GLM 5.2 a DeepSeek V4 Flash** sulla stessa linea di sviluppo accettata. Il contesto della conversazione precedente non è stato trasferito.

![Un ponte continuo attraversa due diverse superfici da disegno](./compiler-model-handoff.webp)

Codice, struttura e cronologia accettata rimanevano disponibili.

## Preservare il sistema ereditato

Un compilatore collega parsing, analisi semantica, rappresentazioni intermedie e generazione del codice. Una modifica locale può influenzare altri moduli: occorrono integrazione e controlli di regressione, oltre al nuovo codice.

Il repository jcc mostra implementazione Rust, rappresentazione intermedia, limiti funzionali e strumenti di test. Il suo README descrive però un altro momento dello sviluppo e non sostituisce il record della continuazione.

## Risultati riportati

La profondità ricorsiva passa da **4 a 8**, con **1.820/1.820 casi LLVM SingleSource mantenuti superati** dopo il passaggio. È il sottoinsieme definito per la valutazione, non l’intera suite LLVM. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

La profondità indica la scomposizione del lavoro, non direttamente la qualità. Sono i test a fornire evidenza comportamentale; per una conclusione generale servirebbero altri carichi e ripetizioni.

## Interpretare la continuità

La lezione pratica è conservare ciò che il successore può verificare: codice, interfacce, vincoli, modifiche accettate e procedure di valutazione. La memoria della conversazione può aiutare senza essere l’unico supporto dei progressi.

## Uno sviluppo che accumula risultati

Formazione e continuazione condividono [lo stesso repository](https://github.com/EMI-Group/genesis-demo-jcc). Non vanno contate come progetti indipendenti né sommate valutazioni di ambito diverso. Codice aggiunto e costo della continuazione non sono riportati.

Un passaggio di consegne utile raccoglie revisione accettata, elenco dei test, comandi ed esclusioni note. Affidi al modello successivo una piccola modifica verificabile e la confronti con la base. La [vista della cronologia](/it/news/genesis-development-history) spiega come seguire i contributi dopo la conclusione di un agente.
