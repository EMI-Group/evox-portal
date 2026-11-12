---
title: "Genesis: delegare il lavoro di sviluppo locale via MCP"
pubDate: 2026-11-12
summary: "Il ramo main di Genesis aggiunge un endpoint MCP locale per avviare attività, seguirle per ID e recuperare i risultati da un agente di programmazione."
---

Un agente di programmazione può già conoscere l’obiettivo e il percorso del progetto. Se affida il lavoro a un altro motore, deve poterlo avviare, seguire e recuperarne il risultato dalla stessa conversazione. L’11 novembre 2026 Genesis ha integrato in `main` un endpoint locale del Model Context Protocol (MCP). Gli agenti compatibili possono usare le API di attività esistenti tramite un’unica connessione. [Modifica integrata][pr]

![Due terminali sullo stesso banco si scambiano una scheda di lavoro e il relativo risultato](./genesis-local-mcp.webp)

*Illustrazione editoriale del passaggio di consegne locale tra un agente di programmazione e Genesis.*

## Collegarsi al processo Genesis che esegue il lavoro

L’endpoint Streamable HTTP `/mcp` è montato nel server Genesis in esecuzione. Il server autentica la richiesta, verifica gli argomenti e chiama l’API esistente delle attività o dello scheduler. Il lavoro continua sul server dopo la fine della richiesta HTTP. La connessione è senza stato, quindi l’ID dell’attività serve per ritrovarla.

Genesis accetta connessioni di loopback e verifica Host e Origin. Le richieste utilizzano un token bearer dal file `mcp-token` dell’istanza in esecuzione. L’host dell’agente deve supportare Streamable HTTP e poter conservare l’intestazione di autorizzazione. Genesis e la directory scrivibile del progetto devono trovarsi sulla stessa macchina. La [guida di connessione][guide] descrive come configurare un build da sorgente con la modifica. La configurazione del server pubblicato è descritta in [Genesis 0.14.1][related].

## Dare all’obiettivo il contesto necessario

Si immagini che un agente abbia individuato un difetto in un parser e debba delegare un test di regressione. Può verificare la configurazione locale con `genesis_check`, poi chiamare `genesis_start_task` con il percorso assoluto del checkout principale e un obiettivo che descriva l’input difettoso, il comportamento atteso e il test da eseguire. Genesis usa il proprio modello configurato. L’obiettivo deve quindi includere le informazioni pertinenti della conversazione del chiamante.

I nove strumenti coprono verifica della disponibilità, ricaricamento della configurazione, ricerca dei modelli, invio, elenco, stato e risultati delle attività, messaggi e annullamento. Un repository Git esistente deve avere un commit iniziale. Questo punto di accesso richiede un checkout principale con una directory `.git` e rifiuta le worktree collegate e le radici dei sottomoduli. [Requisiti delle attività e dei repository][guide]

## Riprendere il monitoraggio tramite ID

Conservi l’ID restituito al momento dell’invio. Dopo una riconnessione, chiami `genesis_get_task` con quell’ID oppure elenchi le attività recenti del progetto prima di ripetere l’invio. Lo stato espone informazioni di avanzamento limitate tratte dallo scheduler e dallo stato salvato. Nelle interrogazioni periodiche può omettere il risultato completo e usare il token di modifica per un’attesa di durata limitata.

La risposta a un messaggio conferma l’accettazione in coda. La risposta a un annullamento indica la richiesta accettata e lo stato salvato. Per stabilire l’esito, legga lo stato finale, recuperi il risultato con `genesis_get_result` ed esamini i commit e le prove di test riportate. [Osservazione e controllo delle attività][guide]

## Verificare la connessione prima di delegare

Compili la revisione pertinente e configuri il fornitore sull’istanza Genesis che eseguirà il lavoro. Segua la guida per creare un token privato e registrare nel client l’indirizzo di loopback effettivo. Apra una nuova sessione del client e chiami `genesis_check`. Può così verificare separatamente la connessione MCP e la disponibilità del modello prima di inviare un’attività. [Configurazione e verifica della connessione][guide]

[pr]: https://github.com/EMI-Group/genesis/pull/171
[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/agent-mcp.md
[related]: /it/releases/genesis-0-14-1
