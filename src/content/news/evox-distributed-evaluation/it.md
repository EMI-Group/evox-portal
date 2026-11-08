---
title: "EvoX: distribuire la valutazione, riunire il feedback della ricerca"
pubDate: 2025-04-23
summary: "Il workflow distribuito sperimentale di EvoX ripartisce la valutazione dei candidati e raccoglie la fitness, estendendo la ricerca oltre un solo dispositivo."
updatedDate: 2026-11-08
---

Quando valutare i candidati domina il costo della ricerca, distribuire quel lavoro può consentire esperimenti più ampi. La guida sperimentale EvoX del 23 aprile 2025 spiega il percorso introdotto a marzo: suddividere la popolazione tra processi, poi raccogliere la fitness prima dell’aggiornamento dell’algoritmo.

![Un vassoio di popolazione si divide in tre recipienti di valutazione e confluisce in una fila ordinata di feedback](./distributed-evaluation-feedback.webp)

*Valutazioni separate, feedback comune alla popolazione.*

## Distribuire la valutazione, riunire il feedback

StdWorkflow riceve opzioni di esecuzione distribuita. La popolazione viene divisa lungo la dimensione dei candidati secondo il rango dei processi. Ognuno valuta la propria parte; le fitness vengono raccolte e concatenate prima di tornare all'aggiornamento dell'algoritmo. [StdWorkflow](https://github.com/EMI-Group/evox/commit/388f0be9eb0ce01610a7ce60eb8050578a996dfb)

È una valutazione distribuita in un workflow coordinato, diversa dall'avviare ricerche indipendenti e confrontarne le risposte finali. Simulazioni o funzioni obiettivo costose sono applicazioni plausibili, purché gestiscano i batch assegnati e l'ambiente sia configurato correttamente.

## Riproducibilità come parte della configurazione

La guida richiede attenzione ai seed prima delle operazioni Torch o NumPy e descrive l'avvio con torch.distributed o torchrun. L'implementazione isola lo stato del generatore casuale durante la valutazione. Un'inizializzazione coerente mantiene stati di ricerca compatibili mentre si valutano candidati diversi. [2025-04-23](https://github.com/EMI-Group/evox/commit/510452f70e30adeedebdaa4fc6e348a75d649643)

## Misurare l'intera generazione

Confronti il riferimento a processo singolo e l’esecuzione distribuita mantenendo obiettivo, seme e budget di popolazione. Misuri una generazione completa, comunicazione inclusa, e verifichi la corrispondenza d’ordine tra candidati e fitness. La [guida iniziale](/it/news/evox-quickstart) presenta il workflow da stabilire prima di aggiungere dispositivi.
