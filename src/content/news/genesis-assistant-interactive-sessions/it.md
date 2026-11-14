---
title: "Genesis Assistant: riprendere una conversazione in attesa"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "Il ramo main di Genesis mantiene le conversazioni di Assistant in sessioni interattive e mostra codice esatto e nodo di destinazione nella finestra di approvazione."
---

Chi sviluppa può chiedere a Genesis Assistant di esaminare un’attività non riuscita, passare alla revisione delle modifiche e tornare con una domanda. Per farlo occorre ritrovare la conversazione e conservarne il contesto. Le modifiche integrate in Genesis `main` dal 10 al 12 novembre 2026 mantengono la sessione interattiva per la durata della conversazione e spostano l’elenco nella barra laterale del pannello. [Guida di Assistant][guide]

![Una persona torna a una conversazione contrassegnata e controlla un’azione proposta](./genesis-assistant-interactive-sessions.webp)

*Illustrazione editoriale della ripresa di una conversazione con Assistant e del controllo di un’azione proposta.*

## Tornare a una conversazione in attesa

Apra **Conversations** sotto **Active Tasks**. L’elenco mostra le sessioni attive del nodo selezionato insieme alle conversazioni salvate nella cache locale. Gli stati distinguono attesa di input, esecuzione e chiusura. Selezionando una conversazione si apre `/assistant?session=<agent_id>`. I vecchi link `/help` reindirizzano a `/assistant` conservando i parametri di query. [Modifica del percorso][route]

Dopo uno scambio, la sessione può liberare lo slot di esecuzione e tenere il contesto e la worktree. Un altro messaggio riprende la stessa sessione dell’agente e la stessa identità della cache dei prompt. **New chat** apre una conversazione separata e lascia la precedente nell’elenco. Le conversazioni chiuse possono rimanere nella cronologia. [Implementazione delle sessioni][session]

## Esaminare l’attività prima di decidere

Si consideri un’attività di test non riuscita. Chieda ad Assistant di leggere stato, errore e risultato sul nodo che sta visualizzando. Apra la pagina di revisione, confronti il diff con l’errore e torni tramite **Conversations** per fare una domanda più specifica. La conversazione conserva il contesto. Su un’istanza locale, scarichi il sorgente Genesis quando richiesto affinché Assistant possa consultarlo.

Per ritentare, chieda ad Assistant di proporre una nuova attività usando la precedente come contesto. L’ispezione usa il livello di lettura, mentre l’avvio richiede una chiamata di scrittura. La decisione riguarda quella specifica chiamata sul nodo selezionato. [Ispezione e livelli di esecuzione][guide]

## Controllare la scrittura senza perdere il punto

Una barra fissa tra conversazione e campo di inserimento indica le richieste in attesa. **Review** apre una finestra con una richiesta alla volta. Verifichi il codice esatto e la destinazione, poi scelga **Allow once** o **Deny**. Le richieste di livello `sudo` presentano un avviso evidente perché eseguono Elixir nativo con l’identità del server Genesis.

La finestra ora mostra il nodo di destinazione indicato dal runtime e gli avvisi associati alla richiesta. Se ci sono più richieste, si possono esaminare in sequenza. Una richiesta ripristinata può essere mostrata finché resta in attesa. La posizione della conversazione e del campo di inserimento resta stabile al variare della barra. [Modifiche all’approvazione][approval]

## Verificare il risultato nell’attività

Dopo l’approvazione della scrittura, controlli l’attività creata e il suo stato. Se la risposta si interrompe o la scrittura scade, verifichi lo stato attuale prima di riprovare. In un build con queste modifiche, inizi da un’ispezione in sola lettura, cambi pagina e torni tramite **Conversations** per una domanda successiva. La [precedente panoramica di Assistant][related] descrive gli strumenti su cui si basa questo flusso. [Guida attuale][guide]

## Conservare la risposta finale quando termina la sessione

Aggiornamento del 14 novembre: le modifiche integrate in `main` il 13 novembre trasmettono uno snapshot finale autorevole ad Assistant e all’ispettore dell’agente selezionato. Trascrizione e stato terminale sono applicati insieme; notifiche tardive non riaprono la conversazione chiusa. Se il passaggio non è disponibile, resta visibile l’ultimo testo coerente in cache, senza una lettura separata della cronologia. L’ispettore può conservare i dettagli di agenti terminati fuori dall’albero attivo. Su una build contenente la modifica, mantenga selezionata la conversazione fino al completamento e verifichi che testo finale e stato concordino prima di ripetere il lavoro. [Implementazione del passaggio finale][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /it/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
