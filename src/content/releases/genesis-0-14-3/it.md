---
title: "Genesis 0.14.3: mettere in pausa un’attività, riprendere l’intero albero di agenti"
pubDate: 2026-11-19
summary: "Checkpoint persistenti per agente collegano recupero delle attività, fasi di esecuzione visibili e concorrenza limitata degli strumenti."
---

Un lavoro di sviluppo lungo richiede più di un pulsante di riavvio: occorre conservare quali agenti erano attivi, cosa avevano appreso e quale stato dei file sia recuperabile. [Genesis 0.14.3][release], pubblicato il 19 novembre 2026, riunisce pausa e ripresa delle attività, stato persistente degli agenti, attività in tempo reale più chiara e miglioramenti a configurazione, approvazioni e distribuzione.

![Un albero meccanico ramificato si ricollega alle proprie basi ancorate](./whole-tree-resume.webp)

*Illustrazione concettuale: ripristinare un’attività significa ricollegarne i rami al rispettivo stato salvato.*

## Sospendere un’attività senza annullarla
Un’attività in esecuzione passa da `pausing` a `paused`. Gli agenti completano i gruppi di chiamate agli strumenti in corso, salvano le conversazioni e creano un commit degli alberi di lavoro prima di fermarsi. Le attività sospese restano visibili e riprendibili: non diventano completate o annullate. Alla ripresa conservano lo stesso ID.

È utile per interrompere un’implementazione multiagente tra sessioni di lavoro. Mantenga attiva la persistenza, richieda la pausa e attenda lo stato sospeso prima di considerare il lavoro consolidato. L’opzione è attiva per impostazione predefinita ed è controllabile tramite `persistent_state` in `genesis_start_task`. Le sessioni interattive non possono essere sospese e, senza persistenza, l’attività non può riprendere. L’[implementazione della versione][pause] richiede anche un record persistente dell’agente radice: i soli record figli non bastano.
## Recuperare l’albero con un confine esplicito sui file
Un archivio SQLite separato conserva conversazioni, identità di esecuzione e avanzamento dei gruppi di strumenti e sottoagenti. Alla ripresa dell’intero albero, i figli completati forniscono risultati salvati; quelli ancora attivi ripartono dai propri checkpoint e dalle proprie basi di lavoro. ID stabili mantengono queste associazioni, con un avviso e una soluzione alternativa se l’identità è occupata.

I riferimenti Git sotto `refs/genesis/agent-state` mantengono raggiungibili i commit anche dopo la rimozione dei rami di lavoro. Una pausa regolare può ricreare l’albero dal commit registrato. Dopo un’interruzione, l’[avviso di ripresa][notice] indica il checkpoint garantito: le modifiche non committate dell’esecuzione terminata non sono garantite. Se manca un checkpoint, l’avviso spiega il ritorno alla base dell’attività.

Se l’attività stava modificando file e avviando processi, controlli il commit indicato, `git status` e `job_list` prima di ripetere operazioni. Le chiamate interrotte ricevono informazioni di riparazione, non successi inventati. La versione corregge anche l’avvio duplicato di sottoagenti, il ripristino errato di sessioni interattive come attività sospese dopo un incidente e il recupero al limite dei turni.
## Vedere il lavoro che sembrava inattivo
L’ispettore e Assistant utilizzano attività in diretta e snapshot atomici di osservazione. Compressione del contesto e preparazione del turno successivo hanno fasi occupate dedicate, invece di apparire inattive. Context Memory mostra le chiamate attive come righe finali e mantiene statico il ragionamento storico. Questo aiuta a interpretare gli intervalli silenziosi distinguendo compressione e richiesta bloccata.

I permessi degli strumenti posseduti dallo scheduler limitano le chiamate concorrenti e mantengono la titolarità durante i passaggi in background. Gli avvii abbandonati sono rifiutati e la pulizia di contenimento dopo un timeout termina prima dell’arresto delle attività degli strumenti. Notifiche di completamento e verifiche dello stato del sistema operativo escono dal percorso bloccante del registro; anche la finalizzazione delle sessioni evita barriere sincrone di persistenza. Lo scrittore dei checkpoint accorpa il lavoro in coda e limita arretrati e payload per contenere la pressione sull’archivio.
## Configurazione e approvazioni più esplicite
Le API delle impostazioni guidate dallo schema supportano aggiornamenti parziali; Assistant può scoprire la configurazione e consultare i progetti in sola lettura. Finestre e notifiche di approvazione mostrano identità del richiedente, autorità e stato di esecuzione. Migliorano ambito delle notifiche, gestione del focus, richiesta dei permessi e comportamento con animazioni ridotte.

Le sessioni Assistant consapevoli del progetto includono conversazioni isolate, caricamenti e monitoraggio delle attività; l’[articolo sul workflow di progetto][workflow] ne descrive l’interazione. I comandi espliciti di inventario locale delle skill saltano i controlli dei permessi degli strumenti. Un commit automatico di riserva gestisce un passaggio di commit assente o fallito.
## Aggiornare e controllare il lavoro recuperato
Per un server headless già installato, la [guida della versione][update] documenta:
```bash
genesis update --check
genesis update
```
Il controllo termina con codice 10 se è disponibile un aggiornamento. Attenda la conclusione del lavoro attivo prima di aggiornare: lo strumento verifica l’attività del server, prepara la versione, riavvia e controlla lo stato di salute. Nella nuova versione, le attività in fase di pausa restano bloccanti per l’aggiornamento; quelle sospese sono riprendibili e non lo bloccano. La release offre pacchetti per Linux x64, Linux ARM64 e macOS ARM64.

Gli aggiornamenti del database usano ora migrazioni normali, senza una riconciliazione storica separata. I conflitti tra vecchie identità vengono riconciliati in modo additivo; stati residui o incompleti di migrazione sono rifiutati. La riparazione SQLite è solo per sviluppo. Helper di ripresa inutilizzati e un alias di completamento vengono rimossi dall’API pubblica: le integrazioni personalizzate devono verificarli.

Le dipendenze comprendono Plug 1.20.4 con la correzione di sicurezza del limite di lunghezza multipart e ReqLLM 1.31.0; hash delle dipendenze Nix e controlli preliminari sono aggiornati. Dopo l’upgrade verifichi versione e salute del server, poi provi una piccola attività persistente: pausa, verifica del checkpoint, ripresa dello stesso ID e controllo dei risultati figli e delle fasi. Consulti le [note complete][release] insieme alle diagnosi di migrazione specifiche della distribuzione.

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.3
[pause]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/task_registry/pause.ex
[notice]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/agent/resume/notice.ex
[update]: https://github.com/EMI-Group/genesis/blob/v0.14.3/docs/server-update.md
[workflow]: /it/news/genesis-assistant-project-workflows

