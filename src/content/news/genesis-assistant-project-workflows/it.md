---
title: "Genesis Assistant: dalla conversazione all’attività di progetto"
pubDate: 2026-11-16
updatedDate: 2026-11-26
summary: "Scegli un progetto, approva un’azione concreta e segui lo sviluppo in background senza legarne la durata alla chat."
---

Chiedere una correzione a un progetto richiede un obiettivo, un’azione approvata e un modo per seguirne il risultato. Genesis Assistant collega questi passaggi nella PR #172, integrata in `main` il 15 novembre 2026. Il percorso estende la [continuità delle conversazioni][previous] al lavoro su un progetto.

![Una cartella di progetto attraversa una stazione di approvazione collegata a un laboratorio indipendente](./genesis-assistant-project-workflows.webp)

*Illustrazione concettuale: definire il progetto e approvare il lavoro prima di seguirne l’esecuzione indipendente.*

## Scegliere la destinazione prima di iniziare

Chat e controllo delle attività non richiedono più una copia di Genesis. Il riferimento al codice è facoltativo e soggetto ad approvazione. Un progetto sull’host selezionato completa i percorsi omessi senza leggere file né autorizzare sviluppo. Il cambio progetto è bloccato durante una risposta; un percorso diverso esplicito resta la destinazione mostrata. [Modifiche integrate][workflows]

La scelta è limitata al nodo e alla conversazione; una nuova conversazione sullo stesso nodo può ereditarla. Il server fornisce agli strumenti l’identità del nodo e della conversazione, anziché lasciarla inventare al modello. Se una richiesta specifica un percorso diverso, l’approvazione deve mostrare quella destinazione effettiva. È importante, per esempio, con due repository dai nomi simili: controllare il percorso prima dell’avvio evita di autorizzare il lavoro sbagliato.

## Dall’approvazione al monitoraggio dell’attività

Le undici definizioni condivise con MCP distinguono la lettura dalle modifiche. Leggere lo stato di un’attività avviene direttamente; avviare, annullare o inviare requisiti richiede un’approvazione legata a parametri strutturati immutabili. Un rifiuto o una scadenza non esegue l’azione. Per correggere un test, fornisci il contesto dell’errore, controlla destinazione e parametri proposti e approva quella precisa richiesta. Dopo l’avvio, apri il monitoraggio e la revisione del risultato invece di dedurre il successo dal solo messaggio di accettazione. [Contratto degli strumenti][workflowguide]

Gli avvii riusciti vengono seguiti automaticamente; il selettore Tasks permette di cercare attività esistenti.

## Separare il lavoro dalla risposta

Inviare un requisito aggiuntivo lo mette in coda; non dimostra che lo sviluppatore attivo lo abbia già adottato. Analogamente, **Stop reply** interrompe la risposta dopo il gruppo di strumenti in esecuzione e conserva la sessione, mentre l’attività di sviluppo continua. Le schede mostrano stati osservati, contatori e orari di aggiornamento, senza inventare percentuali. Se un aggiornamento fallisce, rimane disponibile l’ultima osservazione. Queste distinzioni aiutano a scegliere se aspettare, verificare il risultato, precisare la richiesta o chiedere l’annullamento. L’annullamento non ripristina le modifiche Git.

I riferimenti alle attività sopravvivono alla sessione, ma le conversazioni in memoria non al riavvio del server; le attività persistenti possono essere ritrovate. Prova con la PR #172 e verifica lo stato prima di ripetere un invio incerto. [Guida aggiornata][workflowguide]

## Portare i file dal dispositivo corretto

Il browser carica testo, PDF, DOCX, immagini e audio, fino a quattro file per messaggio da 15 MiB ciascuno; allegati pronti possono partire senza testo. L’ingresso secondario per percorsi server supporta il nodo locale del dashboard e non lo sostituisce a nodi remoti non supportati.

Il caricamento dal browser preleva i file dal dispositivo attualmente in uso. Leggere un percorso sul server indica un’altra posizione ed è limitato al nodo locale del dashboard. Attendi la fine del caricamento prima di cambiare contesto: cambiare conversazione o nodo annulla i trasferimenti in sospeso. Per consultare il codice Genesis, la preparazione facoltativa del riferimento sorgente richiede ancora approvazione; confrontane la versione con quella del runtime attivo. Il contesto del progetto e il riferimento al codice Genesis svolgono quindi ruoli distinti. [File e riferimento sorgente][workflowguide]

Le [modifiche del 20 novembre](/it/news/genesis-project-workbench) riuniscono navigazione per progetto, viste Git e bozze con ambito VCT in un ambiente comune.

Aggiornamento correlato · 2026-11-26: [Genesis mette in pausa l’intero albero senza completare i task figli ancora aperti](/it/news/genesis-whole-tree-pause).


[previous]: /it/news/genesis-assistant-interactive-sessions
[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
