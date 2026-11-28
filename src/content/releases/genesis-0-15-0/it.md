---
title: "Genesis v0.15.0: continuità del progetto, dall’accesso al recupero"
pubDate: 2026-11-28
summary: "Workbench unificato, accesso ChatGPT nel browser e pausa dell’intero albero arrivano con revisioni più chiare e configurazione più sicura."
---

Genesis v0.15.0 è stato pubblicato il 27 novembre 2026. Riunisce le recenti modifiche a workbench, account e recupero dei task. Il vantaggio è la continuità: scegliere host e progetto, configurare il modello, seguire lo sviluppo e tornare al lavoro incompleto senza confondere una risposta in chat con un task concluso. Cambiano anche revisione, job in background e contesto: l’aggiornamento supera il rinnovamento visivo. [Note complete][release]

![Un banco meccanico collega un registro di progetto, una chiave e una struttura ramificata sospesa](./cover.webp)

*Illustrazione concettuale: identità, contesto e lavoro recuperabile condividono un punto di controllo.*

## Tenere espliciti progetto e host

Il workbench unisce panoramica, ispezione degli agenti per task, editor condiviso e opzioni integrate. Progetti recenti e navigazione nelle cartelle agevolano la scelta. I workspace VCT raggruppano progetti con un selettore dei membri. Prima di lavorare va scelto un membro concreto: il gruppo non ha una directory di esecuzione. Source Control mostra cronologia e differenze. Schede di anteprima o fissate, mantenimento con clic centrale, cambio Alt+Arrow e menu di overflow rendono la barra l’unico elenco delle viste aperte.

Nel passaggio tra libreria e applicazione, bozza, modello e repository devono ancora identificare il task voluto. Le bozze per progetto ripristinano campi non testuali dopo il caricamento asincrono. Ricerca e filtri della cronologia conservano l’ambito; posizioni di revisione e filtri dei task sopravvivono ai cambi di nodo. Un’attivazione tardiva non chiude più la palette né devia una scelta esplicita dalla panoramica. [Contesto del workbench][workbench]

## Configurare l’account e confermare il modello

Sign in with ChatGPT nel browser è condiviso da dashboard, procedure guidate, benvenuto e CLI. Gli host remoti possono incollare manualmente l’URL di reindirizzamento; uscire o chiudere annulla il flusso. Gli account esistenti possono avviare l’accesso da Settings. L’autenticazione aggiorna lo snapshot della configurazione e il selettore dei modelli. Le procedure offrono livelli di ragionamento canonici e orari predefiniti. off_peak_holidays usa un calendario statico di festività e giornate lavorative compensative cinesi per 2025–2027, non un servizio mondiale.

Gli account personalizzati usano OpenAI Chat Completions; le richieste ChatGPT in abbonamento includono header di attribuzione dell’uso e identità della cache dei prompt. Keenable è un motore di ricerca facoltativo senza chiave. Si ricontrollino instradamento e orari. Un account salvato parzialmente torna al modello predefinito con avviso invece di far cadere lo scheduler. Settings rifiuta il salvataggio se cambia l’identità locale del nodo: occorre ricaricarne il contesto. Le chiavi vengono oscurate nei log e Git verifica l’appartenenza al progetto. [Flusso account][accounts]

## Pausare senza completare i figli incompleti

La pausa congela l’intero albero e lo riprende con le stesse identità, sostituendo il precedente drenaggio. Con persistenza attiva, i checkpoint conservano attese dei genitori e lavoro dei figli; pausa pulita e recupero interrotto restano distinti. Review mostra fallimento, annullamento e assenza di rapporto, nasconde azioni inapplicabili e propone di preparare un task successivo. Il filtro needs-review rende reperibili tali esiti. [Meccanismo di pausa][pause]

I job ricevono ID brevi base36 globalmente unici, log per task e nomi di registro privi di collisioni. La conservazione protegge i proprietari attivi e mantiene marcatori di rimozione invece di ID inspiegabilmente sconosciuti; è corretta anche la crescita della memoria del registro. Gli agenti eseguono commit automatici quando il passo principale fallisce e la coautoria abilitata raggiunge i merge. Prima di accettare il risultato restano da controllare stato e modifiche del repository.

## Aggiornare e verificare i percorsi utilizzati

CONTEXT.md acquisisce ambiti Shared/Local: gli antenati contribuiscono solo Shared, il nodo assegnato vede l’intero file. Lettura e modifica mirate e commit consolidati tengono le note locali fuori dai prompt estranei. Sono corretti stato al rimontaggio durante streaming, strumenti duplicati, controlli archivio e cronologia ripiegata, fusi orari e caricamenti remoti persi. Phoenix, LiveView, Bandit, idna, jsv e dipendenze correlate includono correzioni di sicurezza. Densità e bersagli tattili sono uniformati; spariscono vecchie animazioni d’ingresso e lista laterale ridondante. Desktop supporta una barra del titolo senza cornice opzionale con controlli per piattaforma.

Si scelga l’asset desktop v0.15.0 del proprio sistema. Il server headless supporta Linux x64/ARM64 e macOS ARM64. Le installazioni esistenti possono usare `genesis update --check`, poi `genesis update`, che installa l’aggiornamento disponibile e riavvia. Si conservi la directory dati configurata e si consultino le istruzioni versionate. Dopo, si verifichino versione attiva, aggiornamento account/modello, una bozza di progetto e un piccolo ciclo pausa/ripresa, controllando esito della revisione e log. [Installazione versionata][guide]

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.15.0
[guide]: https://github.com/EMI-Group/genesis/blob/v0.15.0/README.md
[workbench]: /it/news/genesis-project-workbench
[accounts]: /it/news/genesis-provider-account-setup
[pause]: /it/news/genesis-whole-tree-pause
