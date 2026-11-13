---
title: "EvoRL: conservare ogni scrittura, leggere un record per passo di addestramento"
pubDate: 2026-11-13
summary: "La registrazione JSONL locale conserva metadati e scritture delle metriche, quindi unisce i passi ripetuti durante la lettura senza SDK di tracciamento."
---

Un’iterazione di addestramento può produrre più osservazioni: una perdita, un ritorno di valutazione e poi una metrica corretta. Considerare ogni scrittura come una nuova iterazione disallinea l’esperimento; eliminare i passi ripetuti fa perdere informazioni. EvoRL, il framework per apprendimento per rinforzo ed evolutivo, ha aggiunto la [registrazione JSONL locale][change] a `main` il 12 novembre 2026. Una [revisione dei nomi dei file][fix] è seguita il 13 novembre, ora di Pechino. Le modifiche offrono la cronologia originale delle scritture e una vista separata, allineata per passo, per l’analisi.

![Fogli originali dell’esperimento conservati accanto a un archivio raggruppato per passi di osservazione](./jsonl-recording-cover.webp)

*Illustrazione concettuale: conservare le singole osservazioni e organizzarne la vista unificata per passo.*

## Un file locale con il contesto dell’esperimento

Selezionando `recorders=[log,jsonl]` si salvano metriche leggibili dalla macchina accanto ai normali log, senza aggiungere un SDK di tracciamento. La [guida introduttiva versionata][guide] descrive la configurazione condivisa dagli script di addestramento: il backend JSONL riceve progetto, nome dell’esecuzione, configurazione risolta, tag, percorso di uscita e gruppo facoltativo.

L’inizializzazione scrive questo contesto nell’intestazione dei metadati. Ogni scrittura successiva aggiunge un oggetto JSON con l’intero `step` fornito e i `data` annidati, quindi svuota il buffer del file. Il file grezzo mantiene l’ordine di arrivo, anche per passi fuori ordine e scritture ripetute. Trasferendo la directory di uscita a una macchina di analisi distinta, configurazione e osservazioni viaggiano insieme in un artefatto locale leggibile.

## Unire durante la lettura, non durante la registrazione

`load_jsonl_records(path)`, esportata da `evorl.recorders`, legge l’intero dataset e restituisce una lista ordinata per passo. Unisce ricorsivamente i dizionari dello stesso passo: le scritture successive sostituiscono i valori in conflitto, lasciando intatte le metriche non menzionate. Gli array vengono sostituiti integralmente; anche un `null` successivo sostituisce il valore precedente. L’intestazione facoltativa della prima riga viene saltata, non inserita nella lista delle metriche.

Si considerino perdita di addestramento e ritorno di valutazione scritti separatamente al passo 10, seguiti da una correzione della perdita. Il file grezzo mantiene tutte e tre le scritture. Il record caricato contiene l’ultima perdita e il ritorno di valutazione. Un record del passo 8 arrivato dopo viene ordinato prima del 10. Nelle curve di apprendimento l’identità dell’iterazione deriva quindi da `step`, non dalla posizione della riga o dal numero di chiamate di logging.

## Cosa conserva la serializzazione

[Implementazione e test di regressione][change] coprono valori NumPy, JAX e pandas. Array e Series diventano liste. I DataFrame conservano colonne e dati delle righe, ma non l’indice. NaN, infinito e valori mancanti di pandas diventano JSON `null`. Se l’indice identifica i campioni, lo trasformi in una colonna esplicita prima della registrazione: è una conseguenza diretta della rappresentazione salvata.

Le righe malformate o incomplete generano un errore con file e numero di riga. Il caricatore non scarta silenziosamente un ultimo record troncato. Carica l’intero dataset in memoria: occorre pianificare la memoria di analisi in base alla dimensione accumulata del file. Una metrica applicativa chiamata `step` resta dentro `data`, distinta dal campo esterno dell’iterazione.

## Una destinazione diversa per ogni esecuzione

La revisione condivide `sanitize_filename` tra JSONL e i file di log creati dagli script. Sostituisce `/` con `_`: `MetaWorld/Hammer-v3` diventa `MetaWorld_Hammer-v3`. Gli altri caratteri restano invariati e i metadati conservano il nome originale. Le estensioni sono rispettivamente `.jsonl` e `.log`. Questa regola sostituisce la codifica percentuale del primo commit; normalizzare il nome non ne garantisce l’unicità.

Reinizializzare lo stesso percorso JSONL ne sovrascrive il contenuto. Usi una directory o un nome diverso per ogni esecuzione, soprattutto quando i nomi differiscono soltanto per barra e trattino basso. Parta dalla configurazione indicata su una copia dei sorgenti contenente entrambi i commit, poi verifichi intestazione, fusione dei passi ripetuti e destinazione con un piccolo esperimento prima di uno lungo. Il [precedente articolo EvoRL][related] descrive gradienti, dispositivi e forme delle metriche; questo aggiornamento rende più semplice conservare e riesaminare localmente tali osservazioni.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /it/news/evorl-jax-training-consistency
