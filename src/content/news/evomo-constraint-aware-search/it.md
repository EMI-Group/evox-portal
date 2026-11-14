---
title: "EvoMO: mantenere la fattibilità insieme a ogni candidato"
pubDate: 2026-10-30
updatedDate: 2026-11-14
summary: "Selezione con vincoli, popolazioni dispari coerenti e un percorso OSP-NSDE più efficiente rendono gli esperimenti multiobiettivo più controllabili."
---

Un buon valore obiettivo è utile soltanto se il candidato soddisfa anche i vincoli. Il 30 ottobre 2026 EvoMO ha integrato la [PR #48][s1] in main, estendendo la gestione dei vincoli e correggendo lo stato delle popolazioni. L'aggiornamento collega tre problemi pratici: quali soluzioni conservare, come mantenere allineati i loro dati e quanto costa selezionarle.

![Percorsi candidati attraversano un confine di vincolo da un varco selezionato](./cover.webp)

*Illustrazione concettuale: la fattibilità accompagna il candidato durante la selezione.*

## La fattibilità deve attraversare l'intero flusso

Un problema vincolato può restituire `(fitness, cv)`, associando obiettivi e violazioni. L'implementazione trasporta queste informazioni attraverso inizializzazione, valutazioni esplorative, accoppiamento, archivi e aggiornamento dei sopravvissuti. Le utilità comuni gestiscono violazione totale positiva, parità e forme diverse dei vincoli, mantenendo coerenti gli indici di decisioni, fitness e stato dei vincoli.

Se due candidati cambiano posizione, la fattibilità deve seguirli. In una progettazione che bilancia prestazioni e risorse entro un limite rigido, ordinare solo gli obiettivi potrebbe conservare una soluzione attraente ma non ammissibile. Lo stato dei vincoli consente a ogni algoritmo di applicare la propria regola documentata, che rimane specifica del metodo.

## Anche una popolazione dispari deve essere valida

La modifica corregge incompatibilità di forma alla prima generazione con dimensioni richieste come 51 in otto algoritmi, fra cui SparseEA, SparseEA2, DMMOEA e OSP_NSDE. Accoppiamenti e numero effettivo dei figli rimangono allineati con maschere, fitness e vincoli. È importante quando la dimensione deriva dal budget sperimentale anziché da un numero pari comodo.

Gli algoritmi sparsi e dinamici ricevono inoltre correzioni rispetto ai flussi di riferimento. DMMOEA rileva cambiamenti ambientali rivalutando un campione e aggiorna le cache di fitness e vincoli. La famiglia SparseEA mantiene insieme decisioni e maschere durante variazione e selezione. Questi dettagli determinano quale ricerca venga realmente eseguita, non soltanto se il programma termina.

## Selezione più rapida entro limiti espliciti

OSP-NSDE ordina una volta le distanze fra vicini e le aggiorna dopo le eliminazioni. Kernel Triton opzionali trasferiscono su CUDA il troncamento supportato del fronte limite. Il percorso automatico copre dispositivi compatibili, float32/float64 e popolazioni richieste fino a 128; le altre configurazioni usano PyTorch. L'ordinamento non dominato resta in PyTorch.

Per compilare, occorre inizializzare e poi usare `torch.compile(workflow.step, fullgraph=False)`. Previsione, ricerca locale e modelli a miscela conservano parti eager. Le misure locali su RTX 5060 Ti della PR usano sincronizzazione e budget fissi; i risultati complessivi mostrano che la compilazione non supera sempre l'eager ottimizzato. La scelta va fatta misurando l'intero carico.

La compilazione può anche cambiare generazione casuale e operazioni in virgola mobile: lo stesso seed non garantisce quindi la stessa traiettoria. Nel confronto CUDA ZDT3 del PR su cinque seed, l’IGD medio del percorso compilato era peggiore rispetto all’esecuzione eager. Prima di scegliere la modalità, confronti qualità e durata con lo stesso budget di valutazioni. [Confronto della qualità][s1]

## Verificare la ricerca prima di ampliarla

Sono aggiunti MaOEAHAP, NRVMOEA, HEA e GCNMOEA. I primi tre rifiutano esplicitamente tuple di vincoli. GCNMOEA considera la violazione nella sostituzione dei vicini, mentre altri componenti rimangono basati sugli obiettivi. Questi limiti vanno letti prima di trattare i metodi come intercambiabili.

Per un esperimento esistente, conviene fissare il [sorgente integrato][s2], il seme e il budget, confrontando dopo un passo obiettivi e vincoli memorizzati con una nuova valutazione. Includa una popolazione dispari e un caso vincolato, registrando separatamente fattibilità, qualità e tempo. La [panoramica della versione EvoMO][related] descrive la base pubblicata; questa evoluzione di main aggiunge il lavoro successivo su vincoli e selezione.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /it/releases/evomo-0-3-1
