---
title: "Sviluppo di Genesis: un registro persistente per i progetti"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Le modifiche del 9 novembre su main collegano la navigazione a un registro VCT persistente. Identità stabile, caricamento per host e migrazione protetta chiariscono il passaggio dal locale al remoto."
---

Il percorso di un repository ha senso sulla macchina che lo possiede. Portatile e server possono avere entrambi una cartella `demo`, ma aprirne una non deve selezionare silenziosamente l'altra. Le modifiche integrate in **Genesis main il 9 novembre 2026** sostituiscono il tracciamento dei progetti recenti in Projects con un registro su database e instradano l'attivazione tramite il nodo selezionato. [Integrazione in Projects][projects]

![Cartelle di progetto in armadi separati per host con le relative etichette di registro](./project-host-registry.webp)

## Un'identità che resta alla riapertura

Il Virtual Context Tree, o VCT, associa un percorso assoluto del sistema a un punto canonico come `vct:///projects/demo`. Un mount è questa corrispondenza: punto, percorso, nome visualizzato e ultima apertura. Fornisce un'identità stabile alla navigazione senza spostare il repository né creare un montaggio del filesystem. [Implementazione del registro][store]

Registrare di nuovo lo stesso percorso normalizzato aggiorna la data mantenendo il punto. Percorsi diversi con lo stesso nome finale ricevono punti distinti, con suffissi se necessario. Se il vecchio percorso non esiste più, un nuovo percorso con nome visualizzato e nome finale del punto corrispondenti può riutilizzarlo. È una regola precisa di ricollocazione, non un'equivalenza generale tra cartelle con nomi simili. [Regole d'identità][identity]

La persistenza risiede nella tabella SQLite `vct_mounts` dello store dei task. Il processo VCT mantiene una cache di lettura: ogni modifica scrive atomicamente l'intera tabella prima di cambiare la cache. Se la persistenza fallisce, restituisce un errore e mantiene lo stato precedente. Le modifiche riuscite inviano una notifica con il nodo, collegando l'identità salvata all'aggiornamento dell'interfaccia.

Il registro ha un limite: conserva per impostazione predefinita i 100 mount più recenti ed elimina i più vecchi quando viene superato. È un registro di navigazione operativa, non un archivio illimitato di tutti i repository aperti. [Memorizzazione e capacità][store]

## Cercare e aprire usando gli stessi dati

La pagina Projects e la palette usano ora i mount registrati. Aprire o creare un progetto chiama l'interfaccia `mount_project` consapevole del nodo, quindi ricarica l'elenco. I suggerimenti cercano prima il testo nei percorsi registrati senza distinguere maiuscole e minuscole, poi aggiungono i suggerimenti di prefisso del filesystem eliminando i duplicati. Una parte di percorso familiare può quindi trovare un progetto senza ripartire dalla cartella superiore. [Modifiche alla navigazione][projects]

Il punto VCT del progetto attivo viene ricavato dai mount già caricati per la visualizzazione. Mostrare un'etichetta non registra un nuovo progetto. Dimenticare un progetto rimuove la voce dal registro, senza eliminare i file del repository. Queste distinzioni separano la navigazione dalle modifiche al lavoro stesso.

## Mantenere l'host selezionato nel percorso

Si consideri uno sviluppatore con un checkout `demo` locale e un altro su un server SSH. Selezionare l'host remoto carica il suo elenco. Durante la connessione, l'elenco resta vuoto anziché proporre progetti locali come remoti. Anche l'attivazione attende che la connessione sia pronta, evitando che una richiesta destinata al server venga eseguita sul nodo ancora locale. [Caricamento remoto e attivazione][projects]

I percorsi remoti sono interpretati secondo l'host selezionato, inclusi i percorsi assoluti POSIX e Windows supportati. L'attivazione remota è asincrona, così controlli delle directory e registrazione non bloccano LiveView. Una correzione successiva estrae correttamente il risultato del mount remoto affinché il progetto riceva il suo punto VCT. [Correzione del mount remoto][remote]

Il controllo utile è concreto: si riconnetta al server, cerchi il percorso registrato, lo apra e verifichi host selezionato e punto visualizzato. Ripeta con il checkout locale. Nomi simili non devono riempire una vista remota in attesa con il registro locale.

## Trasferire con cura i vecchi progetti

Nelle build di sviluppo che contengono il lavoro, la migrazione ricava mount VCT dalle vecchie righe `projects` utilizzabili, conserva i nomi non vuoti e gestisce le collisioni. Mantiene le 100 voci più recenti. Percorsi vuoti o relativi vengono registrati nei log e saltati. Se la vecchia tabella non è leggibile, la migrazione si interrompe e annulla la transazione, conservando tabella e righe invece di interpretare l'errore come elenco vuoto. [Protezione della migrazione e test upstream][migration]

Prima di provare una simile build su un ambiente esistente, salvi i dati dell'applicazione su ciascun host interessato. Dopo l'avvio verifichi i progetti sull'host corretto, il punto stabile alla riapertura e l'elenco dopo un riavvio. Se l'avvio segnala un errore di migrazione, conservi database e diagnostica per l'analisi anziché eliminare lo store per ottenere un elenco vuoto.

Questo lavoro rende visibile il confine del progetto al momento di scegliere dove lavorare. Per la separazione delle cronologie del codice, legga [Genesis con più repository: un obiettivo, cronologie separate](/it/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
