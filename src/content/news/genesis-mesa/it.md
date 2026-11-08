---
title: "Genesis e MESA: riscrivere il codice, preservare il comportamento numerico"
pubDate: 2026-11-03
updatedDate: 2026-11-08
summary: "Tredici moduli MESA diventano un workspace Rust. Test di riferimento e un proxy di combustione a zona singola mostrano come verificare la continuità numerica."
---

Riscrivere software scientifico richiede di tramandare più degli algoritmi. La nuova implementazione deve conservare il comportamento numerico da cui dipendono i calcoli successivi. Nel caso MESA di Genesis, tredici moduli Fortran sono stati ricostruiti come crate Rust usando gli output originali come riferimento. L’aspetto interessante è come questa continuità diventa verificabile.

![Risultati Fortran e Rust confrontati con una lente](./mesa-numerical-continuity.webp)

*Illustrazione concettuale: nuova implementazione, riferimento numerico condiviso.*

## Tredici moduli in una catena numerica connessa

Il [record del 7 settembre 2026](https://genesis.evox.group/evidence/mesa/) riguarda **13 moduli**, da **139.414 righe Fortran a 89.946 righe Rust**. Sono dimensioni dello snapshot, non conteggi del solo codice di libreria.

Il port include interpolazione, solutori, reti di reazioni, equazione di stato e opacità. Non sostituisce tutto MESA: motori di evoluzione stellare e binaria e altri componenti documentati restano esclusi.

## Verificare il calcolo, non solo la compilazione

Ogni modulo corrisponde a una crate con interfacce e vincoli documentati. I golden test confrontano gli output Fortran; i test d’integrazione verificano le interazioni.

L’equivalenza numerica richiede tolleranze e carichi precisi. Uno scalare uguale può nascondere un percorso diverso del solutore: il repository registra anche i passi d’integrazione del proxy di combustione a una zona. È più informativo di una compilazione riuscita.

## Che cosa contiene il resoconto dei test

Il repository riporta **1.052 test superati, nessun fallimento e 18 test ignorati**, inclusi benchmark e una lenta combustione a durata completa. Evidence indica **10,64 dollari di costo dei token del modello**, hardware escluso; modello, numero di episodi e tempo trascorso non sono specificati.

Sono risultati riportati dalla fonte per una singola esecuzione, senza riproduzione indipendente. Il perimetro documentato di moduli e carichi offre un punto di partenza concreto per esaminarli.

## Due istantanee, accelerazioni diverse

[Evidence](https://genesis.evox.group/evidence/mesa/) riporta accelerazioni mediane di **1,55–6,87×**. La tabella README del 5 agosto usa mediane di 15 esecuzioni e indica **1,25×** per il proxy end-to-end di combustione a una zona. [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)

Per il proxy di combustione a zona singola, il README registra in entrambe le implementazioni **199 passi d’integrazione, 198 accettati e 1 rifiutato**. Confrontare questo comportamento insieme alle tolleranze di output rende la misura temporale più significativa rispetto a calcoli con percorsi numerici differenti.

## Riprodurre un carico prima di ampliare il perimetro

Il [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md) elenca toolchain, compilazione, test e benchmark. Preparato l’ambiente:

```bash
cargo test --workspace
```

Scelga un carico pertinente e ne esamini output di riferimento, tolleranze e driver nel [repository della ricostruzione MESA](https://github.com/EMI-Group/genesis-demo-mesa-rs). La [presentazione di Genesis](/it/news/evox-genesis) fornisce il contesto dello sviluppo agentico; questo caso offre un modo concreto per verificare se la riscrittura conserva il comportamento necessario.
