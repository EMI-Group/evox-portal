---
title: "Genesis e MESA: Tracciare le differenze numeriche attraverso una riscrittura da Fortran a Rust"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "La precisione dell'interpolazione, gli jacobiani analitici e i benchmark con input corrispondenti mostrano come tredici moduli MESA siano stati ricostruiti e verificati in Rust."
---

La riscrittura di un software scientifico può produrre risposte plausibili pur cambiando il percorso numerico che le ha generate. Il caso MESA di Genesis offre verifiche concrete per questo problema: output Fortran originali, differenze in virgola mobile spiegate, contatori dei passi del risolutore e benchmark che confrontano carichi di lavoro corrispondenti.

![Fortran and Rust outputs compared under a magnifying glass](./mesa-numerical-continuity.webp)

*Illustrazione concettuale: una nuova implementazione verificata rispetto al comportamento numerico esistente.*

Il [record di Evidence](https://genesis.evox.group/evidence/mesa/) riporta tredici moduli riprogettati, 139.414 righe di Fortran e 89.946 righe di Rust. I dettagli ingegneristici riportati di seguito provengono dalla [revisione del repository 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), i cui benchmark documentati sono datati 5 agosto 2026. Tali risultati dei benchmark mantengono le proprie definizioni di carico di lavoro e tempistiche.

## Ricostruire una catena di dipendenze, non tredici traduzioni isolate

Il workspace segue la catena che va da costanti, utility e matematica attraverso matrici, interpolazione e risolutori numerici fino a chimica, tassi, perdite di neutrini, reti di reazione, equazione di stato e opacità. Ogni modulo originale ha un crate Rust corrispondente. Il [manifest del workspace](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) rende esplicite tali relazioni tra i pacchetti.

Ciò significa che un task di rete di reazione dipende dal fatto che le routine numeriche e i dati fisici siano utilizzabili insieme. Le API pubbliche e i documenti di contesto per directory forniscono il contratto di integrazione. La [panoramica del repository](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) descrive struct, metodi e valori `Result` di Rust, con i nomi Fortran originali mantenuti nella documentazione laddove utili per il controllo incrociato.

L'implementazione include risolutori Rust anziché chiamare LAPACK o BLAS tramite FFI. L'ambito rimane lo stack numerico e fisico selezionato: i motori completi di evoluzione stellare e binaria, il mix EOS completo e altri componenti elencati sono al di fuori del porting.

## Perché una discrepanza nel golden-output non è stata risolta con una singola tolleranza ampia

Il [test golden di interpolazione bidimensionale](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) ricostruisce la griglia originale 31 per 35 e i punti di valutazione. Distingue i valori che corrispondono esattamente da quelli che necessitano di una tolleranza documentata.

L'indagine del test registra una discrepanza rivelatrice. Alcuni temporanei dell'interpolazione di Hermite nel Fortran originale erano implicitamente `REAL(4)`: precisione singola all'interno di un calcolo altrimenti a precisione superiore. Il porting Rust utilizza `f64`. I commenti al codice sorgente riportano che una trascrizione Fortran esplicitamente a doppia precisione corrispondeva al risultato Rust, mentre il percorso originale a precisione mista riproduceva il vecchio golden output.

La maggiore differenza relativa registrata per quei valori di interpolazione è stata di circa 3,05e-8, con una tolleranza relativa di 1e-7. Altre quantità mantengono confronti esatti o tolleranze molto più strette. Si tratta di una distinzione ingegneristica utile: il test conserva l'origine di una differenza numerica invece di permettere a ogni risultato di derivare sotto un'unica soglia globale. Il blocco di test `_sg` a precisione singola rimane al di fuori del porting.

## La rete di reazione necessitava del percorso delle derivate oltre a quello dei valori

Le [note di sviluppo della rete di reazione](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) descrivono il lavoro sullo jacobiano analitico approx21, le derivate utilizzate dal risolutore stiff. Le misurazioni prima/dopo registrate mostrano il checksum avvicinarsi a Fortran e i contatori di integrazione raggiungere una corrispondenza esatta.

Per il carico di lavoro del benchmark documentato, entrambe le implementazioni hanno raggiunto **199 passi: 198 accettati e 1 rifiutato**, con **8.889 valutazioni della funzione e 199 valutazioni dello jacobiano**. Questi contatori aiutano a rilevare un'esecuzione apparentemente più veloce che ha semplicemente intrapreso un percorso del risolutore differente.

È rimasta una differenza residua nel checksum di circa 3,1e-9. L'[helper del benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) la attribuisce al percorso dei valori Fortran che utilizza la precisione quadrupla mentre Rust utilizza f64. L'harness utilizza quindi una tolleranza relativa del checksum documentata di 1e-8; richiedere 1e-9 segnala deliberatamente questo carico di lavoro. La corrispondenza dei contatori dei passi supporta il confronto, mentre la differenza nel percorso dei valori rimane esplicita.

## I test di integrazione verificano anche che i moduli siano effettivamente connessi

Un [test di integrazione a zona singola](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) separato esegue il burner con un provider di gas ideale e con un provider di tabelle EOS attraverso l'interfaccia pubblica `BurnEosInfo`. Si aspetta che i due calcoli differiscano, controlla la conservazione e gli output finiti, e verifica che le chiamate EOS siano uguali alla somma delle valutazioni della funzione e dello jacobiano.

Questo è un test di cablaggio con un confine fisico specifico: la temperatura di combustione supera il massimo della tabella disponibile, quindi il lookup EOS si blocca sulla riga superiore. Dimostra che il provider influenza il calcolo; non è la validazione di una EOS stellare completa ad alta temperatura. Anche i suoi conteggi dei passi appartengono a questo test separato, non al benchmark sopra citato.

## Confrontare lo stesso lavoro prima di riportare un aumento di velocità

La [specifica del carico di lavoro](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fissa input, dimensioni, parametri del risolutore e definizioni dei checksum per entrambi i linguaggi. Ad esempio, il benchmark di interpolazione valuta due milioni di punti deterministici sulla stessa griglia; il setup è esterno a quel ciclo cronometrato.

L'[orchestratore del benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) legge i tempi interni del driver e i checksum, li confronta e scrive un report. La tabella del 5 agosto nel README utilizza le mediane di 15 esecuzioni vincolate alle CPU 0–3, confrontando gfortran `-O3 -march=native` con il profilo release di Rust.

| Carico di lavoro selezionato | Fortran | Rust | Speedup riportato |
| --- | --- | --- | --- |
| Due milioni di valutazioni bicubiche | 0,162522 s | 0,090700 s | 1,79× |
| Diecimila risoluzioni di Newton | 0,057918 s | 0,009029 s | 6,41× |
| Proxy di combustione approx21 a zona singola | 0,303473 s | 0,243294 s | 1,25× |

Fonte: [tabella dei benchmark versionata](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). La pagina di Evidence riporta separatamente un intervallo mediano di 1,55–6,87×. Questi record non stabiliscono uno speedup universale e il proxy a zona singola non misura una simulazione stellare completa.

## Seguire gli entry point dei test e dei benchmark

Il repository riporta **1.052 superati, 0 falliti e 18 ignorati**. Il suo README identifica il set ignorato come i benchmark e la combustione lenta a durata completa. In un ambiente Rust e Fortran preparato, gli entry point documentati sono:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Questi sono comandi documentati nel sorgente, non una nuova riproduzione eseguita per questo articolo. Il costo di 10,64 USD del record di Evidence copre solo i token del modello; il modello, il conteggio degli episodi e il tempo reale (wall time) non sono stati riportati.

Per una prima ispezione utile, leggere il test golden di interpolazione insieme ai suoi confronti con l'output originale, quindi seguire il contratto di input del benchmark. Tale percorso rende la riscrittura valutabile attraverso specifici comportamenti numerici e lavoro misurato.
