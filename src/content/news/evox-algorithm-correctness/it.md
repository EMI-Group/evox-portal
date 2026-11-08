---
title: "EvoX 1.4.1: quando una piccola correzione cambia la ricerca"
pubDate: 2026-10-30
summary: "Le correzioni a SHADE, evoluzione differenziale e CMA-ES mostrano che un'infrastruttura evolutiva affidabile richiede efficienza e fedeltà agli algoritmi."
updatedDate: 2026-11-08
---

Una ricerca può concludersi correttamente seguendo però una regola di aggiornamento errata. EvoX 1.4.1, pubblicato il 30 ottobre 2026, corregge questo divario in SHADE, evoluzione differenziale e CMA-ES, ripristinando adattamento, campionamento e comportamento di esecuzione richiesti dagli algoritmi.

![Uno strumento di calibrazione allinea una curva di ricerca scura al riferimento rosso](./algorithm-behavior-calibration.webp)

*Allineare l’implementazione al comportamento previsto.*

## Il codice può funzionare ma cercare diversamente

In SHADE la memoria dei successi per F e CR non si adattava. I miglioramenti erano calcolati dopo la sostituzione della fitness e l'aritmetica con array pieni di NaN contaminava i valori selezionati. La correzione calcola i miglioramenti prima dell'aggiornamento e sceglie i successi con `torch.where`. [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

L'operatore condiviso di crossover binomiale confrontava campioni normali con una probabilità di crossover. Ora usa campionamento uniforme, coerente con quella probabilità. Correzioni correlate inizializzano anche CoDE, SaDE e SHADE uniformemente entro i limiti. Cambia ciò che viene generato, non soltanto l'assenza di crash. [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## Definizioni matematiche e vincoli di esecuzione

Le correzioni CMA-ES riguardano aggiornamento della covarianza di rango uno, costante di accumulo e restrizioni di aliasing in `torch.cond`. Quest'ultima riabilita anche un test CMA-ES disattivato. Formule e vincoli del framework richiedono verifiche distinte. [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

La versione interviene inoltre su inizializzazione e sottospazi delle strategie evolutive, selezione a torneo, trasferimenti di dispositivo PSO e ipervolume. [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## Affidabilità come infrastruttura

La correzione SHADE aggiunge un test di regressione: cinque passi del workflow, poi la verifica che la memoria di adattamento cambi e resti finita. Per confrontare versioni, registri seme, obiettivo, popolazione e budget di valutazione, quindi riesegua i riferimenti interessati. Le [note di versione](/it/releases/evox-1-4-1) guidano l’aggiornamento.
