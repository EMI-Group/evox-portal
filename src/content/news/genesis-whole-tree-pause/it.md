---
title: "Genesis mette in pausa l’intero albero senza completare i task figli ancora aperti"
pubDate: 2026-11-26
summary: "Uno snapshot coordinato conserva attese dei genitori, identità dei figli e checkpoint dei worktree, poi riprende lo stesso task con un percorso normale o di riparazione."
---

Un task di sviluppo può attendere diversi agenti figli quando il proprietario preme Pausa. Dichiarare conclusi i loro batch soltanto per fermarsi cambierebbe il lavoro da preservare. Le modifiche Genesis su main del 25 novembre 2026 introducono uno snapshot coordinato dell’intero albero: i genitori conservano la posizione d’attesa, i figli identità e checkpoint, e la ripresa ricostruisce le relazioni sotto lo stesso ID del task. [Progetto e implementazione dello snapshot][design]

![Una scultura mobile ramificata mantenuta in posizione da un telaio di sostegno](./cover.webp)

*Illustrazione concettuale: preservare ogni ramo incompiuto prima di riprendere l’intera struttura.*

## Una fase del ciclo di vita, non un freno globale

La pausa globale dello scheduler blocca l’ammissione di nuovo lavoro, ma non porta un singolo task attivo a uno stato di riposo persistente. Il protocollo del task passa da pausing a paused, preservando il contesto del risultato e lasciando vuoto il timestamp di fine. L’annullamento rimane un’azione separata e prevale se arriva durante la pausa. Le sessioni interattive non rientrano nel protocollo. [Integrazione nel registro][registry]

Per esempio, un agente che coordina un parser e la sua suite di test può attendere due figli. La pausa deve conservare quell’attesa senza inventare risultati completati. Il coordinatore contrassegna i membri attivi del task, rimuove le richieste in coda per slot di modelli e strumenti e ferma i genitori in attesa del batch di sottoagenti. Ogni agente si arresta al confine di un turno dopo il batch di strumenti, oppure nella posizione d’attesa già raggiunta. [Coordinatore del congelamento][coordinator]

## Salvare il lavoro prima di recuperare le risorse

Prima di fermarsi, un agente chiude i job in background, crea un checkpoint del worktree, conserva il marcatore persistente degli strumenti pendenti e scrive lo stato. I commit dei checkpoint sono ancorati per non perderli quando i worktree vengono recuperati. Lo snapshot registra se l’agente era al confine di un turno, in attesa di figli o dentro un batch interrotto. La pausa comunica il proprio esito, senza dichiarare riuscito un figlio incompleto né integrarne il lavoro. [Percorso di congelamento dell’agente][agent]

L’attesa ha un limite. Il valore predefinito documentato concede 120 secondi per la quiescenza e altri 10 secondi di tolleranza per il congelamento forzato. Una pausa clean richiede che ogni agente dimostri un arresto persistente non interrotto. Se il tempo scade o manca la prova, il task registra una pausa dirty. Questa distinzione descrive lo stato salvato e non promette di annullare effetti esterni arbitrari.

## Ricostruire la collaborazione esistente

La ripresa reinserisce in coda lo stesso task con le opzioni persistite. Serve una riga radice persistente: le sole righe dei figli non bastano e un archivio di stato illeggibile produce un errore esplicito. Il piano di ripristino ricostruisce identità, topologia e posizioni. Un figlio completato fornisce il risultato salvato, uno ancora attivo riparte con la propria identità e il checkpoint, mentre uno congelato prima della registrazione può partire dalla specifica di chiamata originale. Il genitore continua ad attendere risultati reali. [Percorso di scongelamento][thaw]

Un batch congelato correttamente viene ripristinato senza la riparazione degli strumenti pendenti usata per il lavoro interrotto. Uno snapshot dirty applica la riparazione e un avviso di ripresa, distinguendo il lavoro certamente completato dall’esecuzione incerta. Un checkpoint non dimostrabile non deve essere adottato in silenzio come checkpoint pulito di un figlio. Al riavvio o alla riconciliazione dei lease, un task running o pausing con persistenza e riga radice duratura diventa paused di tipo dirty; un task non riprendibile mantiene il fallimento per scadenza del lease.

## Provare una pausa e una ripresa prima di affidarsi al meccanismo

Si utilizzi una build dai sorgenti con questi commit e persistenza dello stato degli agenti attiva. Si metta in pausa un task con figli attivi, si attenda lo stato paused, poi si riprenda controllando identità del task, relazioni dei figli e lavoro salvato. Eventuali avvisi dirty vanno esaminati prima di continuare operazioni esterne. Senza persistenza la pausa è rifiutata; il recupero è limitato ai checkpoint duraturi. Il [workflow precedente][related] spiega il contesto di progetto e approvazione; questa modifica definisce come preservare l’esecuzione incompiuta.

Aggiornamento correlato · 2026-11-28: [Genesis v0.15.0: continuità del progetto, dall’accesso al recupero](/it/releases/genesis-0-15-0).

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /it/news/genesis-assistant-project-workflows
