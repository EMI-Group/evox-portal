---
title: "EvoX v2.0.0a1: riscritto su EvoX Compiler"
pubDate: 2026-10-30
summary: "Alpha sperimentale con una nuova API funzionale e un compilatore di grafi tensoriali espliciti. La serie stabile 1.x resta consigliata in produzione."
---

![Struttura del programma resa visibile per l’ispezione](./experimental-compiler-runtime.webp)

**EvoX v2.0.0a1** è la prima alpha di una riscrittura completa basata su [EvoX Compiler (`evoxc`)](https://github.com/EMI-Group/evoxc).

> **Versione preliminare sperimentale:** la nuova API è incompatibile con 1.x e non consente un aggiornamento diretto. In produzione resta consigliata la serie stabile 1.x. Provi l’alpha in un ambiente separato.

## Pipeline di compilazione esplicita

EvoX Compiler rende i grafi tensoriali ispezionabili e trasformabili, separando tracing, trasformazioni del grafo, lowering, compilazione ed esecuzione. Offre trasformazioni componibili come `vectorize`/`vmap`, `grad`, `jvp`, `vjp` e `batch_functions`, con backend NumPy, IREE, TVM e XLA/PJRT. StableHLO costituisce il confine comune di lowering per i backend compilati.

EvoX 2.0 non dipende più da PyTorch o JAX. NumPy è l’unica dipendenza runtime obbligatoria di EvoX Compiler; i backend compilati sono opzionali.

## Nuova API funzionale

- Gli algoritmi usano `init(config, key)` e `step(config, state, evaluate)`.
- I problemi usano `evaluate(config, state, candidates)`.
- Le configurazioni sono immutabili, lo stato tensoriale è esplicito e la casualità usa chiavi PRNG riproducibili.
- `StdWorkflow` traccia un passo evolutivo, lo compila con il backend scelto ed esegue il ciclo di ottimizzazione.

## Contenuti di questa alpha

- **32 classi di algoritmi** e **15 operatori evolutivi**.
- Benchmark numerici di base, DTLZ, CEC2022 e neuroevoluzione virtuale.
- Metriche GD, IGD e ipervolume; visualizzazione Plotly e tracce `.exv`.
- Ottimizzazione degli iperparametri lato host e rilevamento delle estensioni tramite `evox_ext`.

La release upstream riporta **552 test superati sul backend NumPy**. Questo non dimostra una copertura equivalente per i backend compilati o le GPU.

## Installazione

Richiede **Python 3.11+**. In un ambiente separato, scelga una modalità di installazione:

```bash
pip install --pre "evox==2.0.0a1"
```

Per il supporto opzionale ai compilatori:

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## Limitazioni attuali

Workflow distribuiti, Brax/MuJoCo, integrazione con le reti neurali PyTorch e kernel Triton non sono ancora stati portati. I backend compilati e l’esecuzione GPU restano sperimentali; alcuni operatori e schemi di controllo non sono supportati su tutti i backend. Monitoraggio, visualizzazione, metriche e HPO vengono eseguiti fuori dai grafi compilati. Le API potranno cambiare durante le versioni preliminari.

Segnalazioni di bug, benchmark e commenti sull’API sono benvenuti in [GitHub Issues](https://github.com/EMI-Group/evox/issues).

**Release**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
