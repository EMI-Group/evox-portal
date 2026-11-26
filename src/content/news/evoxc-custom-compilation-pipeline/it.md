---
title: "EvoX Compiler apre la pipeline alla compilazione personalizzata"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "Le novità su main accettano chiamate personalizzate, StableHLO inline e moduli modificati, dichiarando esplicitamente i limiti dei backend."
---

Un’operazione sperimentale può superare le capacità di una libreria di tensori senza richiedere di cambiare tutto il programma. Gli aggiornamenti del ramo predefinito di EvoX Compiler del 23–24 novembre 2026 consentono operazioni specifiche del compilatore, compilazione di codice intermedio modificato e backend personalizzati. Prima occorre scegliere dove eseguire l’estensione: nel compilatore, come kernel a runtime o come intero backend. [Implementazione e guida][guide]

![Una cartuccia ottica rimovibile si inserisce in una guida modulare attraversata da un raggio rosso](./cover.webp)

*Illustrazione concettuale: sostituire una fase mantenendo esplicita la pipeline circostante.*

## Scegliere il confine del lavoro personalizzato

`custom_call` emette una chiamata StableHLO con nome, risultati dichiarati e configurazione opzionale del backend. Il compilatore esterno decide se il target esiste e può essere tradotto. `inline_stablehlo` inserisce invece un frammento grezzo: gli operandi usano `%in0` e indici successivi, mentre i risultati vanno assegnati a `%out0` e agli indici successivi. Le specifiche dei risultati restano esplicite. Nomi, configurazione e frammenti sono valori statici che specializzano il grafo. [Contratto delle operazioni][ops]

Queste interfacce non registrano kernel arbitrari in IREE o PJRT. Per un kernel Python o Triton da eseguire a runtime resta pertinente la registrazione `external_call`. Per un’operazione portabile espressa con operazioni ordinarie di EvoX Compiler, si può usare un blocco con una propria decomposizione. La distinzione evita di confondere una dichiarazione al compilatore con un’implementazione a runtime.

## Modificare il programma intermedio e compilarlo

Uno sviluppatore può, per esempio, ispezionare un eseguibile con `source_text()`, modificarne lo StableHLO e passare il testo a `compile_text` con le specifiche di input e output. Si saltano tracciamento e costruzione del grafo, poi si usano le normali fasi di compilazione e caricamento. Le specifiche descrivono tuple esterne: l’esecuzione deve conservarne il contratto. Il compilatore esterno valida il modulo; accettare il testo non dimostra la correttezza numerica. [Implementazione della pipeline][pipeline]

Conservi un piccolo insieme di input e confronti i risultati con il programma originale dopo ogni modifica. Un target mancante va diagnosticato durante la legalizzazione del compilatore, senza cambiare backend silenziosamente. L’interprete NumPy e il motore CPU nativo rifiutano esplicitamente queste estensioni. Le nuove operazioni nel grafo non hanno regole automatiche di batching e differenziazione: per tali trasformazioni serve un’alternativa supportata. [Capacità e limiti][guide]

## Collegare consapevolmente un backend

Le istanze del backend rimangono ora coerenti nelle diverse fasi. La registrazione supporta sostituzione e rimozione esplicite; gli entry point consentono backend forniti da pacchetti esterni. Un backend compilatore dichiara capacità e dtype supportati e implementa compilazione e caricamento; un insieme di dtype vuoto rifiuta tutti i grafi. Moduli IREE personalizzati per compilatore e runtime si selezionano tramite opzioni o variabili d’ambiente, evitando di confondere il runtime di una build personalizzata con quello standard. [Guida ai backend][guide]

## Controllare separatamente trasferimenti e confronti numerici

Nello stesso periodo cambiano i trasferimenti Vulkan: fino a 16 MiB gli upload usano buffer coerenti mappati, oltre tale soglia un percorso di copia. Il ritorno distingue memoria host da memoria GPU semplicemente visibile all’host. Le misure registrate riguardano una sola configurazione Intel integrata/Mesa/IREE: misuri separatamente trasferimento ed esecuzione sul proprio hardware. [Implementazione dei trasferimenti][transfer]

La CPU nativa riusa inoltre lo spazio di grandi buffer e array in ingresso, riducendo le allocazioni ripetute. Le riduzioni ripartiscono output indipendenti mantenendone l’ordine di accumulo. Gli adattatori espongono anche `split_reduction_threshold` e `split_reduction_non_exact`: cambiando questa politica, controlli risultati numerici e tempi. [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

Una correzione di `power` sulla CPU nativa allinea inoltre gli esponenti al percorso di potenza in virgola mobile di NumPy. Il banco di confronto distingue controlli esatti per interi e booleani da confronti flottanti con tolleranza. Prima di adottare questa revisione sorgente, conservi gli output di riferimento, provi compilatore e dispositivo scelti e controlli le tolleranze. La [versione v0.1.1][release] descrive la pipeline originale; queste modifiche ne estendono la personalizzazione. [Correzione numerica][power]

Aggiornamento correlato · 2026-11-26: [EvoX Compiler v0.2.3: installare il backend adatto al carico di lavoro](/it/releases/evoxc-0-2-3).


[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /it/releases/evoxc-0-1-1
