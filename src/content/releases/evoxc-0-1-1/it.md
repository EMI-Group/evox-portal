---
title: "EvoX Compiler v0.1.1: meno preparazione prima di eseguire una popolazione"
pubDate: 2026-10-30
summary: "La versione del 30 ottobre migliora raggruppamento dei programmi, preparazione dei grafi e gestione degli errori, incluso un blocco XLA."
---

Nella ricerca di programmi anche la compilazione consuma il budget sperimentale. Se ogni generazione prepara a lungo i grafi, accelerare solo il dispositivo risolve una parte del problema. [EvoX Compiler v0.1.1][s1], pubblicato il 30 ottobre 2026, migliora tale percorso e corregge guasti dei backend. I suoi [45 commit][s2] sviluppano la pipeline esplicita di v0.1.0.

![Strutture di programmi differenti raccolte in gruppi paralleli compatti](./cover.webp)

*Illustrazione concettuale: organizzare una popolazione di programmi prima della compilazione.*

## Raggruppare programmi richiede un modello di costo

`batch_functions` combina candidati compatibili in un grafo. La versione propaga la dipendenza dalle righe nel grafo interno delle classi ed estende la ricerca geometrica dei gruppi di `bands="auto"`. Ciò aiuta a distinguere il lavoro dipendente dai singoli individui e le possibili organizzazioni.

Nella programmazione genetica, programmi con la stessa firma d'ingresso possono contenere operazioni diverse. Un unico raggruppamento piatto non è necessariamente il più economico. Le bande offrono un'altra struttura, confrontata dalla politica automatica attraverso il modello di costo. La verifica fondamentale rimane semantica: la riga i del risultato unito deve coincidere con l'esecuzione individuale del candidato i. Sono aggiornati anche i test di regressione.

## Eliminare lavoro ripetuto nella preparazione

Diverse modifiche riguardano la CPU prima dell'esecuzione: acquisizione delle posizioni sorgente con attraversamento diretto dei frame, rimozione di verifiche ridondanti nel lowering e tracciamento lineare degli utilizzi con memoizzazione dei tipi risultanti nell'IR. L'export StableHLO aggiunge emissione in blocco del testo delle costanti, cache dei tipi e dispatch delle operazioni tramite tabella.

Sono miglioramenti in fasi distinte. Un export più rapido non implica un kernel GPU più rapido. È utile misurare separatamente tracing, trasformazione, lowering, compilazione ed esecuzione a regime. Una grande popolazione ricca di costanti può avere costi diversi da un piccolo grafo con un kernel numerico oneroso.

## Diagnosticare meglio i guasti del backend

IREE espone il limite HAL dei binding per dispatch come un `BackendError` con indicazioni utili. È così più semplice distinguere un limite di risorse da un programma numerico errato. XLA non mantiene più il lock dei client condivisi durante `PJRT_Client_Create`, correggendo un deadlock con un finalizzatore dello stesso thread. È presente un test di regressione.

Il supporto segue la matrice della versione. NumPy fornisce l'interprete CPU; IREE, XLA e TVM hanno requisiti diversi. Un risultato dell'interprete è un buon riferimento prima del percorso compilato. Il [README versionato][s3] documenta i confini e il trasferimento esplicito dei dati.

## Aggiornare con una popolazione rappresentativa

La base si installa con `pip install evoxc==0.1.1`; per IREE, `pip install "evoxc[iree]==0.1.1"`. Serve Python 3.11 o successivo. La distribuzione separata `evoxc-hf` ha un ciclo di versioni indipendente. Conviene conservare la configurazione dei plugin esistenti.

Parta da una popolazione salvata e ingressi fissi, confronti l'output unito con le esecuzioni individuali e misuri preparazione ed esecuzione separatamente. In caso di errore di binding, conservi grafo e dettagli del backend invece di cambiare silenziosamente l'esperimento. La [panoramica v0.1.0][related] spiega la pipeline; v0.1.1 rende più pratiche le fasi preparatorie e i confini dei backend.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /it/releases/evoxc-0-1-0
