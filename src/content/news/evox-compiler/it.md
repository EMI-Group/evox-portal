---
title: "EvoX Compiler v0.1.0: una base computazionale per l'evoluzione dei programmi"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "EvoX Compiler separa rappresentazione, trasformazione ed esecuzione dei programmi, fornendo una base per esperimenti tra popolazioni e backend."
---

*Aggiornato il 7 novembre 2026. I risultati storici mantengono la data della rilevazione originale.*

La visione di IA evolutiva di EvoX richiede sistemi di calcolo per candidati mutevoli, inclusi programmi con strutture diverse. EvoX Compiler ne sviluppa la base: grafi espliciti rendono i programmi ispezionabili e trasformabili prima dell'esecuzione, mentre le interfacce dei backend collegano i calcoli supportati a sistemi di esecuzione differenti.

Un programma numerico non è solo il risultato: può essere necessario ispezionare il grafo, trasformarlo, confrontare backend o conservare un artefatto compilato. **EvoX Compiler (evoxc) v0.1.0**, pubblicato il 29 ottobre 2026, rende esplicite queste fasi. È un frontend e runtime Python per grafi tensoriali, con licenza Apache-2.0 e requisito Python 3.11 o successivo.

## Dalla definizione all’eseguibile

La pipeline è `trace → lower → compile → load → run`. Il tracing costruisce EvoXIR da definizione e specifiche degli input; il lowering prepara la rappresentazione del backend; la compilazione produce un artefatto, caricato sul dispositivo ed eseguito con i dati. Ogni fase restituisce un oggetto ispezionabile.

Si distinguono così grafi invalidi, operazioni non supportate e incompatibilità dei dispositivi. Grafi e artefatti compatibili possono essere salvati. I compilatori esterni gestiscono ottimizzazione, scheduling e generazione del codice; evoxc fornisce frontend e contratti tra le fasi.

## Trasformazioni per la ricerca evolutiva

`vmap`, `grad`, `jvp` e `vjp` producono grafi componibili prima dell’esecuzione. `batch_functions` riunisce funzioni candidate con specifiche di input e output corrispondenti in un grafo di popolazione.

Nella programmazione genetica, ricerca di architetture e sintesi di algoritmi, i candidati possono essere programmi diversi. Riunirli può ridurre compilazioni e invocazioni ripetute, ma il beneficio dipende da struttura e backend: non è garantito per ogni popolazione.

## Scegliere il percorso di esecuzione

NumPy è l’unica dipendenza obbligatoria e offre l’interprete CPU di riferimento. Adattatori facoltativi collegano IREE, XLA tramite un plugin PJRT fornito dall’utente e TVM tramite StableHLO. La copertura di operatori e hardware varia.

Il README della versione documenta Vulkan su Mesa lavapipe, dispositivo software, e TVM ROCm soltanto in compilazione. Input GPU e collocazione sono espliciti. Verifichi gli operatori supportati prima di spostare un grafo CPU.

## Iniziare dal riferimento

Installi la versione fissata, esegua l’esempio CPU del README, ispezioni il grafo e scelga poi un backend compilato:

```bash
pip install evoxc==0.1.0
```

L’integrazione HuggingFace è il pacchetto separato `evoxc-hf`. Il compilatore e il pacchetto di ottimizzazione EvoX hanno versioni distinte.

## La validazione nella base computazionale

Il README riporta **7.511 test superati, 77 saltati e 4 fallimenti attesi**, senza fallimenti, nell’ambiente documentato delle suite principali e d’integrazione. Non è una validazione di ogni hardware. Il repository attribuisce a Genesis codice, test e documentazione.

Consulti il [README versionato](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), la [pubblicazione](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) e [GitHub](https://github.com/EMI-Group/evoxc) per API, artefatti e sviluppi successivi.
