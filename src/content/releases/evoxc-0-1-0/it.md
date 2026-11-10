---
title: "EvoX Compiler v0.1.0: ispezionare il programma prima di eseguirlo"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "Grafi espliciti, trasformazioni componibili e fasi separate consentono di ispezionare i programmi candidati e valutarli insieme."
---

Quando i candidati di una ricerca sono programmi, esaminare solo il risultato finale lascia nascosta gran parte dell’esperimento. EvoX Compiler rende ispezionabile il programma stesso: si può conservarne il grafo, trasformarlo e scegliere un backend attraverso fasi distinte e visibili.

![Struttura del programma resa visibile per l’ispezione](./evoxc-visible-stages.webp)

*Illustrazione concettuale: la struttura del programma emerge tra definizione ed esecuzione.*

**EvoX Compiler (evoxc) v0.1.0** è stato pubblicato il 29 ottobre 2026. Il frontend e runtime Python per grafi di tensori richiede Python 3.11 o successivo e usa la licenza Apache-2.0. [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## Dalla definizione a un eseguibile ispezionabile

La pipeline è `trace → lower → compile → load → run`. Il tracing costruisce EvoXIR da definizione e specifiche degli input; il lowering prepara la rappresentazione del backend; la compilazione produce un artefatto, caricato sul dispositivo ed eseguito con i dati. Ogni fase restituisce un oggetto ispezionabile.

Si distinguono così grafi invalidi, operazioni non supportate e incompatibilità dei dispositivi. Grafi e artefatti compatibili possono essere salvati. I compilatori esterni gestiscono ottimizzazione, scheduling e generazione del codice; evoxc fornisce frontend e contratti tra le fasi.

## Riunire una popolazione di programmi in un grafo

`vmap`, `grad`, `jvp` e `vjp` producono grafi componibili prima dell’esecuzione. [`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) riunisce funzioni candidate con specifiche di input e output corrispondenti in un grafo di popolazione.

Nella programmazione genetica, ricerca di architetture e sintesi di algoritmi, i candidati possono essere programmi diversi. Riunirli può ridurre compilazioni e invocazioni ripetute, ma il beneficio dipende da struttura e backend: non è garantito per ogni popolazione.

## Scegliere il backend per le operazioni necessarie

NumPy è l’unica dipendenza obbligatoria e offre l’interprete CPU di riferimento. Adattatori facoltativi collegano IREE, XLA tramite un plugin PJRT fornito dall’utente e TVM tramite StableHLO. La copertura di operatori e hardware varia.

Il README della versione documenta Vulkan su Mesa lavapipe, dispositivo software, e TVM ROCm soltanto in compilazione. Input GPU e collocazione sono espliciti. Verifichi gli operatori supportati prima di spostare un grafo CPU.

## Partire dalla CPU, poi trasferire il grafo

Installi la versione fissata, esegua l’esempio CPU del README, ispezioni il grafo e scelga poi un backend compilato:

```bash
pip install evoxc==0.1.0
```

L’integrazione HuggingFace si installa separatamente come `evoxc-hf`, con una distribuzione e un ciclo di aggiornamento propri.

## Leggere la validazione insieme al suo ambiente

Con le dipendenze opzionali documentate, il README della versione riporta **7.511 test superati, 77 saltati e 4 fallimenti attesi**, senza fallimenti inattesi, nelle suite principali e d’integrazione. I test saltati includono condizioni di hardware e dipendenze. Il repository attribuisce codice, test e documentazione a Genesis.

Consulti il [README versionato](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), la [pubblicazione](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) e [GitHub](https://github.com/EMI-Group/evoxc) per API, artefatti e sviluppi successivi.

Il percorso di sviluppo agentico è descritto in [Genesis ed EvoX Compiler](/it/news/genesis-evoxc). Per il Suo esperimento, conservi un grafo di riferimento e ispezioni ogni trasformazione prima di confrontare i backend.
