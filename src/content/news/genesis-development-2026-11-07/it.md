---
title: "Genesis Assistant: capire e gestire il lavoro in corso"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Esaminare le attività, capire la capacità del sistema e agire in un’unica conversazione. Le modifiche recenti al ramo main semplificano anche servizi remoti, processi in background e credenziali dei modelli."
---

Un’attività di sviluppo lunga continua a porre domande dopo l’avvio: quale lavoro è ancora attivo, perché un’attività è fallita e come proseguire? Le modifiche integrate in `main` dal 4 al 7 novembre 2026 portano queste domande nella conversazione Assistant della dashboard Genesis, migliorando anche i servizi sottostanti.

![Uno sviluppatore controlla attività in corso e in pausa](./genesis-assistant-task-flows.webp)

*Una conversazione, più flussi di lavoro: un’illustrazione editoriale dell’idea centrale di questo aggiornamento.*

## Partire dall’attività per scegliere l’azione

Genesis Assistant può leggere codice e documentazione di Genesis, esaminare attività e verificare la capacità attuale dello scheduler. Può chiedergli di analizzare stato, errore e risultato di un’attività fallita, quindi richiedere un passo successivo, come riprendere un lavoro precedente. La conversazione collega spiegazioni e operazioni sul nodo attualmente visualizzato.

La [guida Assistant][assistant] offre esempi concreti: elencare il lavoro in corso, verificare gli slot disponibili dei modelli o sospendere la pianificazione durante un merge. Il lavoro già avviato prosegue durante la pausa. Le impostazioni temporanee di esecuzione restano separate dalla configurazione salvata: una modifica della sessione non diventa implicitamente un valore predefinito permanente.

La consultazione usa il livello `read`. Le modifiche usano `write`, con approvazione del codice esatto; `sudo` dispone di una scheda separata. L’azione proposta diventa visibile quando una domanda si trasforma in un’operazione.

## Un server, due modalità di connessione

Lo sviluppo remoto e la dashboard HTTP condividono ora una sola istanza server. In precedenza, i comandi remoti avviavano un’istanza separata dedicata alla distribuzione. Con il [server condiviso][remote], `genesis remote stop` disattiva la distribuzione remota lasciando accessibile la dashboard HTTP. Disconnettere lo sviluppo remoto non richiede più di arrestare questo servizio HTTP comune.

## Dettagli che rendono il lavoro più facile da seguire

I [processi in background][jobs] ricevono identificatori brevi come `bash-1`. Se l’agente chiamante possiede un solo processo, `job_output` lo individua senza `job_id`; se sono diversi, restituisce identificatori, stati ed etichette per scegliere quello corretto.

I [percorsi personalizzati dei file di credenziali OAuth][oauth] appartengono ora ai singoli profili sotto `[[llm.models]]`, al posto dell’impostazione globale `[llm] oauth_file`. Ogni percorso può essere gestito accanto al modello che lo usa.

Queste modifiche rendono più chiari i punti di contatto con il lavoro in corso: un’attività da esaminare, un’azione da approvare e uno stato del servizio più facile da seguire. Consulti l’[introduzione a Genesis][intro] per il sistema nel suo insieme e la [guida Assistant][assistant] per le operazioni specifiche.

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /it/news/evox-genesis

