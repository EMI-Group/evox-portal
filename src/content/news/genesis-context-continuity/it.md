---
title: "Genesis: continuare i lavori lunghi mentre il contesto si riduce"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 collega compressione del contesto, processi in background e checkpoint con budget per sostenere attività più lunghe."
updatedDate: 2026-11-08
---

Un test può essere ancora in corso quando la conversazione dell’agente è piena. Genesis 0.13.8–0.13.10, pubblicato dal 26 al 29 ottobre 2026, separa i due cicli: comprimere il contesto di lavoro del modello mantenendo disponibili output e stato finale dei job shell distaccati.

![Contesto lungo compresso mentre le attività proseguono](./context-compression-continuity.webp)

*Comprimere il contesto di lavoro, continuare l’esecuzione.*

## Compressione secondo il budget del modello

La versione 0.13.8 introduce due fasi: riduzione dei risultati degli strumenti senza chiamare il modello, seguita da un riepilogo di checkpoint. L'attivazione dipende dalla finestra di contesto, configurabile per agente, e include un aggiornamento dello stato di esecuzione. Un indicatore mostra utilizzo e numero di compressioni. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

La versione 0.13.10 affronta il caso in cui messaggi recenti troppo grandi impediscono una riduzione sufficiente. La parte recente riceve un budget di token, le coppie chiamata/risultato restano integre e gli aggiornamenti obsoleti vengono eliminati, conservandone uno corrente. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## L'esecuzione supera un segmento di conversazione

I processi shell indipendenti in background, introdotti in 0.13.8, sopravvivono alla compressione e notificano il completamento. L'agente può consultarne l'output, elencarli o terminarli senza mantenere tutta l'operazione in una chiamata bloccante. La versione 0.13.9 corregge anche i processi rimasti nello stato di esecuzione nel backend sandbox systemd. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## Continuità attraverso uno stato osservabile

Per compilazioni o test lunghi, usi un job distaccato e ne segua stato e output dopo la compressione. Il misuratore del contesto mostra utilizzo e numero di compressioni; lo stato terminale indica completamento o fallimento. Sono segnali complementari per decidere il seguito. L’[introduzione a Genesis](/it/news/evox-genesis) descrive il flusso complessivo.
