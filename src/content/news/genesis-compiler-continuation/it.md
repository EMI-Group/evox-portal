---
title: "Passaggio di consegne del compilatore Genesis: cosa eredita il modello successivo e come viene verificata la continuità"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Un passaggio di consegne tra modelli mantiene una discendenza del compilatore accettata. Il risultato riportato e i test di regressione del compilatore pubblico mostrano ciò che può essere verificato oltre tale confine."
---

Il [record Evidence del 7 settembre 2026](https://genesis.evox.group/evidence/compiler-continuation/) descrive un passaggio di consegne del compilatore da **GLM 5.2 a DeepSeek V4 Flash**, senza trasportare il contesto conversazionale dell'agente precedente. L'albero dei sorgenti accettato e la cronologia Git sono rimasti disponibili. La questione ingegneristica riguarda ciò che il modello ricevente può ispezionare e come le modifiche successive possano essere valutate.

![Un progetto di compilatore mantenuto tra diversi set di strumenti](./compiler-model-handoff.webp)

Il record riporta **1.820/1.820 casi LLVM SingleSource mantenuti superati** dopo la continuazione e una profondità di ricorsione dei task passata da 4 a 8. Non pubblica una trascrizione per ogni correzione né il volume di codice aggiunto o il costo della continuazione. I sorgenti pubblici di jcc riportati di seguito spiegano le interfacce e i meccanismi di regressione del compilatore; il loro snapshot separato non ricostruisce l'esatta sequenza delle azioni di passaggio.

## Un compilatore ereditato ha confini che un successore deve preservare

L'[architettura jcc](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) separa il frontend, la rappresentazione intermedia tipizzata CIR, l'ottimizzatore, il backend del codice macchina, l'assembler e il driver della riga di comando. Il frontend consegna un albero sintattico verificato alla fase di lowering; le fasi successive consumano la rappresentazione risultante invece di reinterpretare il sorgente originale in modo indipendente.

Questo è rilevante quando un nuovo modello modifica un componente. Una correzione aritmetica nel lowering deve comunque soddisfare la tipizzazione CIR; una modifica alla convenzione di chiamata deve concordare con l'allocazione dei registri e l'emissione degli oggetti. Questi sono esempi delle dipendenze documentate dall'architettura, non affermazioni su particolari riparazioni effettuate durante il passaggio.

Il driver espone punti di arresto intermedi: `-E` per il preprocessamento, `-emit-jcc-ir` per CIR, `-S` per l'assembly e `-c` per l'emissione dell'oggetto. Tali artefatti aiutano a individuare quale fase sia cambiata prima di testare un eseguibile collegato.

## I controlli di regressione coprono i programmi corretti e i rifiuti intenzionali

La [guida ai test](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descrive casi di compilazione ed esecuzione che verificano lo stato di uscita e l'output, insieme a casi di fallimento della compilazione che verificano la gravità della diagnostica, il messaggio e l'intervallo del sorgente. I passaggi di ottimizzazione dispongono anche di controlli di verifica della rappresentazione.

Un successore ha quindi più di una condizione di accettazione. Generare un eseguibile è insufficiente se il suo output cambia; accettare un programma è insufficiente se la politica del linguaggio richiede di rifiutarlo. Il test della diagnostica preserva comportamenti che un benchmark basato solo sul successo ignorerebbe.

Il [README con versione](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) elenca limiti concreti come l'aritmetica `long double` parziale e i target differiti. Tali limiti sono informazioni ereditate utili: modificare un rifiuto documentato è una decisione relativa alle funzionalità, non automaticamente la correzione di una regressione.

## Cosa confronta effettivamente l'harness LLVM

Il [runner della suite LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) pubblico configura la suite con il compilatore sotto test, compila gli eseguibili e confronta il loro output con i file di riferimento. Il suo confronto diretto è basato su token di spazi bianchi: i token non numerici devono corrispondere esattamente; i token numerici utilizzano una tolleranza in virgola mobile configurabile, predefinita a 1e-4; il codice di uscita finale deve corrispondere esattamente.

Ciò illustra perché il conteggio dei test necessiti di un manifesto e di una politica di confronto. Il sottoinsieme Regression/C di 36 casi documentato dal runner rappresenta un ambito di valutazione diverso rispetto ai 1.820 casi mantenuti del record di continuazione. Lo snapshot più piccolo non può essere utilizzato per dedurre il tasso di superamento iniziale del passaggio di consegne, e sottrarre i due totali non misurerebbe il progresso.

## Mantenere il risultato del passaggio riportato collegato al suo ambito

| Voce | Cosa riporta il record di continuazione |
| --- | --- |
| Transizione del modello | GLM 5.2 → DeepSeek V4 Flash |
| Contesto conversazionale trasportato | 0 |
| Stato del progetto preservato | Discendenza del compilatore accettata |
| Profondità di ricorsione dei task | 4 → 8 |
| Valutazione finale | 1.820/1.820 casi LLVM SingleSource mantenuti |

Fonte: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Questi sono i risultati riportati dal progetto per un singolo passaggio di consegne. La profondità di ricorsione descrive la decomposizione dei task; il risultato del test fornisce l'evidenza comportamentale.

Il compilatore iniziale e i record di continuazione collegano lo stesso repository. Non devono essere conteggiati come due progetti di compilatore indipendenti, e i loro totali di test con ambiti diversi devono rimanere separati.

## Rendere ispezionabile un passaggio di consegne

Per uno sviluppatore che applica questo approccio, un pacchetto di passaggio utile consiste in una revisione accettata, comandi di build, contratti di interfaccia, il manifesto esatto della regressione e le esclusioni note. Questa è una raccomandazione pratica tratta dall'architettura e dagli harness pubblici, piuttosto che un'affermazione che un pacchetto completo di questa forma sia stato archiviato per l'esperimento.

Iniziare con una piccola modifica e confrontare i suoi artefatti intermedi, la diagnostica e il comportamento dell'eseguibile rispetto a quella revisione. La [vista della cronologia di sviluppo di Genesis](/news/genesis-development-history) fornisce il contesto correlato per seguire i contributi dopo che l'agente che li ha realizzati ha terminato il lavoro.
