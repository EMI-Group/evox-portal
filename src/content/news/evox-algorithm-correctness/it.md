---
title: "EvoX 1.4.1: preservare la semantica nella ricerca parallela"
pubDate: 2026-10-30
summary: "Le correzioni a SHADE, evoluzione differenziale e CMA-ES mostrano che un'infrastruttura evolutiva affidabile richiede efficienza e fedeltà agli algoritmi."
---

EvoX 1.4.1, pubblicato il 30 ottobre 2026, corregge diversi comportamenti algoritmici e di esecuzione. Quando migliaia di candidati vengono valutati insieme, un piccolo errore può cambiare sistematicamente la ricerca. Un'infrastruttura evolutiva deve preservare l'algoritmo previsto oltre a eseguirlo efficientemente.

## Il codice può funzionare ma cercare diversamente

In SHADE la memoria dei successi per F e CR non si adattava. I miglioramenti erano calcolati dopo la sostituzione della fitness e l'aritmetica con array pieni di NaN contaminava i valori selezionati. La correzione calcola i miglioramenti prima dell'aggiornamento e sceglie i successi con `torch.where`.

L'operatore condiviso di crossover binomiale confrontava campioni normali con una probabilità di crossover. Ora usa campionamento uniforme, coerente con quella probabilità. Correzioni correlate inizializzano anche CoDE, SaDE e SHADE uniformemente entro i limiti. Cambia ciò che viene generato, non soltanto l'assenza di crash.

## Definizioni matematiche e vincoli di esecuzione

Le correzioni CMA-ES riguardano aggiornamento della covarianza di rango uno, costante di accumulo e restrizioni di aliasing in `torch.cond`. Quest'ultima riabilita anche un test CMA-ES disattivato. Formule e vincoli del framework richiedono verifiche distinte.

La versione interviene inoltre su inizializzazione e sottospazi delle strategie evolutive, selezione a torneo, trasferimenti di dispositivo PSO e ipervolume. Correzioni documentate non provano una superiorità universale su tutti i benchmark.

## Affidabilità come infrastruttura

Nel confrontare esperimenti, versione e seed vanno registrati con obiettivo, popolazione e budget di valutazione. I risultati interessati possono richiedere una nuova valutazione. Per EvoX, verificare la semantica deve procedere insieme a tensorizzazione e accelerazione, affinché il feedback sperimentale rappresenti davvero la ricerca desiderata.

[1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · [2](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3) · [3](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716) · [4](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)
