---
title: "Genesis 0.14.1: mantenere la scelta del modello lungo tutto il lavoro"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Profili di modelli per account, autenticazione in abbonamento e server remoto condiviso: i meccanismi di Genesis 0.14.1 e i controlli da effettuare durante l'aggiornamento."
---

Scegliere un modello significa anche scegliere l'account che paga, le credenziali e le impostazioni di ragionamento trasmesse al task. **Genesis 0.14.1, pubblicato ufficialmente l'8 novembre 2026**, mantiene coerente questa identità tra Settings, Projects, Assistant, scheduler e runtime. La versione unifica inoltre l'esecuzione remota sul server headless e amplia il controllo dell'ispezione a runtime. [Note di rilascio complete][release]

![La scheda dell'account selezionato resta collegata alle relative scelte di modello](./provider-account-continuity.webp)

## Configurare un account, scegliere con precisione per il task

Un provider profile contiene autenticazione, endpoint, concorrenza e pianificazioni. L'inventario di modelli annidato elenca quelli disponibili nell'account, con eventuali impostazioni specifiche di generazione e ragionamento. La selezione del task contiene un'identità priva di credenziali: ID del profilo, ID del modello e livello di ragionamento facoltativo. Una scelta concreta blocca l'identità nell'esecuzione successiva; **Auto** affida la scelta alle regole configurate.

Per esempio, due modelli di un account di lavoro condividono gli slot concorrenti e il backoff dopo i limiti di frequenza. Aggiungere un modello non crea un altro pool di quota. Un account personale può avere credenziali e orari differenti. Per API keys distinte occorrono anche nomi delle credenziali distinti, oltre a ID di profilo diversi. [Configurazione e regole di selezione][profiles]

Ogni modello selezionabile richiede una voce in `[[llm.providers.models]]`; `default_model` da solo non basta. Il livello di ragionamento predefinito è separato dall'elenco dei livelli supportati. Nel dashboard, un elenco non vuoto senza un valore predefinito risolto seleziona il primo livello; una chiamata all'API interna che omette il livello può omettere il parametro. Dopo un cambio di profilo, ricontrolli modello e livello.

La versione corregge la perdita delle selezioni esplicite tra task, agente e sistema, i pool di fallback dello scheduler e gli snapshot incompleti che potevano provocare `:model_spec_schema_unavailable`. Le impostazioni archiviate sono ora sicure per JSON e nascondono le credenziali. Le correzioni riguardano sia nuovi task sia il riutilizzo della configurazione salvata.

## Il login in abbonamento segue la configurazione dell'account

I profili supportati ricevono autenticazione OAuth/in abbonamento e stato di accesso individuale. Genesis importa i file di login delle CLI dei fornitori in un file gestito letto da ReqLLM. `openai_codex` è esclusivamente OAuth; i profili Anthropic in abbonamento usano `auth_mode = "oauth"`. La guida versionata parte da `codex login` o dall'accesso alla CLI Claude sul nodo che utilizzerà l'account. [Configurazione dell'abbonamento][oauth]

Il file gestito predefinito è `auth.json`, accanto a `config.toml`. Un `oauth_file` personalizzato appartiene al provider profile; la chiave globale `[llm] oauth_file` è rimossa. I nuovi file hanno permessi `0600` e l'importazione è atomica. Il file contiene una voce per provider: ID di profilo diversi non isolano da soli più accessi in abbonamento.

Per il lavoro remoto controlli lo stato sul nodo remoto. Se il login del fornitore esiste ma la destinazione gestita è di sola lettura, indichi nel profilo un percorso privato scrivibile: ripetere il login non corregge la destinazione. Gli OAuth tokens forniti solo dall'ambiente non possono aggiornarsi automaticamente. I nuovi messaggi di stato distinguono questi casi.

## Un server per esecuzione remota e dashboard

La distribuzione separata `genesis_remote` è ritirata. Comandi remoti e bootstrap usano `genesis_server`, con HTTP sempre disponibile ed Erlang distribution attivabile a runtime mediante un protocollo di file avviato da SIGHUP. La CLI espone `genesis remote start`, `stop`, `status` e `logs`. [Server e installazione][readme]

Per chi mantiene il dashboard sul portatile ed esegue su un host SSH, cambia la gestione del servizio: occorre rivedere gli script che nominano la vecchia distribuzione e gestire il server condiviso. La versione supporta anche test di progetti remoti e ripresa dei test al momento della chiamata. Il server HTTP headless ascolta localhost per impostazione predefinita, senza autenticazione integrata; l'accesso remoto documentato usa un tunnel SSH.

## Riprendere le interazioni durante esecuzioni lunghe

Il valutatore Elixir a livelli con mediazione aggiunge l'approvazione del codice esatto e un'approvazione recuperabile nella chat. L'output viene troncato al budget residuo invece di fallire. Sono inclusi una breve finestra di recupero dopo il limite di turni, risposte finali senza tool, ID di job sequenziali più brevi e identità di cache del prompt stabili per esecuzione dell'agente nelle chiamate GPT OpenAI/Codex. Il dashboard riceve un pannello di capsule unificato e controlli comuni di task e modello. [Cambiamenti e correzioni][release]

## Aggiornare con la configurazione sotto controllo

1. Scarichi gli installer o gli archivi server di [v0.14.1][release] per la piattaforma prevista. Salvi una copia della configurazione prima di cambiare gli account. Il vecchio `[[llm.models]]` resta un input compatibile; i provider profiles canonici hanno precedenza e un salvataggio esplicito in Settings/config esegue la migrazione.
2. In **Settings → LLM → Provider profiles**, controlli autenticazione, inventario annidato, ragionamento predefinito e `oauth_file` personalizzato. Le credenziali devono essere disponibili al processo che esegue il task, anche sul server remoto.
3. Dopo il riavvio del server headless usi `genesis status`, poi controlli una selezione esplicita profilo/modello/livello, Auto e la connessione remota effettiva. Riveda i vecchi script daemon prima di riutilizzarli. Questi controlli derivano dai cambiamenti documentati.

Per il flusso operativo sui task in corso, continui con [Genesis Assistant: una visione più chiara del lavoro in esecuzione](/it/news/genesis-development-2026-11-07).

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
