---
title: "Genesis: continuare lo sviluppo oltre la finestra di contesto"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 collega compressione del contesto, processi in background e checkpoint con budget per sostenere attività più lunghe."
---

Una compilazione lunga, un risultato voluminoso di uno strumento e una conversazione crescente esercitano pressioni diverse sullo sviluppo con AI. Genesis 0.13.10, pubblicato il 29 ottobre 2026, prosegue i cambiamenti di 0.13.8 separando l'esecuzione in corso dalla conversazione limitata disponibile al modello. La continuità dell'infrastruttura EvoX richiede di gestire entrambe.

## Compressione secondo il budget del modello

La versione 0.13.8 introduce due fasi: riduzione dei risultati degli strumenti senza chiamare il modello, seguita da un riepilogo di checkpoint. L'attivazione dipende dalla finestra di contesto, configurabile per agente, e include un aggiornamento dello stato di esecuzione. Un indicatore mostra utilizzo e numero di compressioni.

La versione 0.13.10 affronta il caso in cui messaggi recenti troppo grandi impediscono una riduzione sufficiente. La parte recente riceve un budget di token, le coppie chiamata/risultato restano integre e gli aggiornamenti obsoleti vengono eliminati, conservandone uno corrente. L'obiettivo è un contesto utilizzabile, non una memoria senza perdita.

## L'esecuzione supera un segmento di conversazione

I processi shell indipendenti in background, introdotti in 0.13.8, sopravvivono alla compressione e notificano il completamento. L'agente può consultarne l'output, elencarli o terminarli senza mantenere tutta l'operazione in una chiamata bloccante. La versione 0.13.9 corregge anche i processi rimasti nello stato di esecuzione nel backend sandbox systemd.

## Continuità attraverso uno stato osservabile

Un test prolungato richiede un ciclo di vita di esecuzione, stato e output indipendente dal riepilogo della conversazione. Gli aggiornamenti rendono esplicita questa separazione. Non garantiscono il completamento di ogni attività né la conservazione di ogni dettaglio. Offrono una base più verificabile per continuare con un contesto finito.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)
