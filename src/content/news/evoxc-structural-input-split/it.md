---
title: "EvoX Compiler separa la preparazione riutilizzabile dagli ingressi variabili"
pubDate: 2026-11-28
summary: "Nuove trasformazioni strutturali espongono un confine prepare/apply per capire cosa riutilizzare e cosa eseguire a ogni chiamata."
---

Un calcolo ripetuto mescola spesso ingressi fissi e variabili. Ricalcolare la parte fissa può sprecare risorse, ma conservare un intermedio arbitrario può cambiare silenziosamente il comportamento. EvoX Compiler main espone split_by_inputs e analyze_inputs: un passaggio strutturale divide un grafo tracciato in preparazione e applicazione con un confine di tensori ispezionabile, senza modificare l’originale. Le modifiche del 27–28 novembre rendono il riuso una decisione esplicita anziché una cache nascosta. [Implementazione e contratto][contract]

![Una pressa mantiene una lastra incisa preparata mentre fogli diversi arrivano da un alimentatore separato](./cover.webp)

*Illustrazione concettuale: preparare una volta il contributo fisso e riutilizzarlo per ingressi variabili.*

## Scegliere gli ingressi fissi

Si immagini di valutare molti tensori candidati sulle stesse referenze. Se un grafo lineare deriva prima un intermedio dalle sole referenze e poi lo combina con ogni candidato, tale derivazione può andare in prepare. Il candidato variabile entra in apply con l’albero variabile e la tupla preparata. È un esempio di struttura adatta, non un’accelerazione misurata.

La maschera fixed rispecchia il pytree d’ingresso: True fissa un tensore, False o None lo rende variabile. fixed_leaves può indicare gli indici piatti degli ingressi tensoriali. Serve esattamente un selettore. Le foglie statiche specializzano già il grafo e non attraversano il confine; una maschera non-None è rifiutata lì. Entrambe le parti richiedono ingressi tensoriali, quindi fissarli tutti o nessuno è invalido. Tuple, liste e dizionari ordinari si potano per foglia; potare parzialmente nodi registrati ad arità fissa, dataclass o namedtuple è vietato. [Selezione][split]

## Esaminare il costo del confine

Il passaggio propaga maschere di dipendenza nello SSA lineare, risale dalle uscite per eliminare operazioni morte e sceglie valori fissi necessari a operazioni miste o ritorni. Clona le operazioni in nuovi moduli. Le costanti sono copiate nella parte interessata anziché trasmesse come uscite preparate. Gli ingressi variabili inutilizzati rimangono nella firma apply.

SplitPlan espone confine, forme, tipi, byte stimati e conteggi. Una dimensione statica sconosciuta produce una stima sconosciuta. Si contano ID distinti di operazioni sorgenti: una costante copiata in entrambe le parti conta in ciascuna, ma una sola volta nell’unione usata per calcolare gli scarti. La somma non deve quindi uguagliare il numero originale. Il rapporto confronta memoria mantenuta e calcolo ripetuto senza trattare i conteggi come previsione dei tempi. [API di analisi][analysis]

## Uno snapshot con limiti espliciti

Cambiare un ingresso fisso richiede di rieseguire prepare. Nessun grafo gestisce invalidazione. Gli effetti oltre pure/read sono rifiutati: l’indipendenza dagli ingressi variabili non rende sicura una singola esecuzione. La prima versione rifiuta anche regioni annidate come cond, while_loop e scan. Collettive, callback e chiamate esterne o personalizzate richiedono altre strategie quando bloccate.

analyze_inputs usa le stesse dipendenze senza eseguire, tracciare o importare backend. Mostra divisibilità, ragione del blocco, consumatori, uscite coinvolte e costo di fissare ogni ingresso da solo quando ammesso. Si inizi qui: un confine grande o poco lavoro fisso può rendere il passaggio poco utile. Il rifiuto descrive il grafo, non giustifica la soppressione di effetti.

## Confrontare le due parti con l’originale

Si usino sorgenti con questi commit. Ottenuto uno SplitPlan, verify controlla invarianti e collegamenti. Ogni Graph attraversa lower, compile e load; build rifiuta volutamente un Graph già tracciato. prepare riceve solo argomenti fissi, apply l’albero variabile e la tupla preparata. Si confrontino più ingressi variabili con l’originale entro le tolleranze del backend, poi si modifichino i fissi ripetendo la preparazione. Preparazione, esecuzione ricorrente e memoria vanno misurate separatamente. L’[articolo sul pipeline][related] spiega le fasi circostanti.

[contract]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/CONTEXT.md
[split]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/split.py
[analysis]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/analyze.py
[related]: /it/news/evoxc-custom-compilation-pipeline
