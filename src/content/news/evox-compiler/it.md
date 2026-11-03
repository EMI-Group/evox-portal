---
title: "EvoX Compiler v0.1.0: grafi tensoriali espliciti e più backend"
pubDate: 2026-10-29
summary: "La prima versione di EvoX Compiler porta in Python grafi ispezionabili, trasformazioni componibili e percorsi NumPy, IREE, XLA e TVM."
---

**EvoX Compiler (evoxc) v0.1.0 è stato pubblicato il 29 ottobre 2026.** È un compilatore e runtime Python per grafi tensoriali, destinato a chi desidera ispezionare, trasformare, salvare ed eseguire il programma stesso. Usa la licenza Apache-2.0 e richiede Python 3.11 o successivo.

## Un programma ispezionabile

evoxc espone ogni fase con `trace → lower → compile → load → run`. Il frontend rappresenta i calcoli in EvoXIR ed esporta StableHLO per compilatori esterni, responsabili di ottimizzazione e generazione del codice. Grafi e artefatti intermedi restano disponibili per ispezione e persistenza.

Le trasformazioni includono `vmap`, `grad`, `jvp` e `vjp`. Per ricerca di architetture neurali, programmazione genetica e sintesi di algoritmi, `batch_functions` può unire candidati con specifiche di ingresso/uscita corrispondenti in un grafo. La cache esplicita di compilazione supporta carichi che generano ripetutamente programmi statici.

## Quattro percorsi di esecuzione

NumPy è l’unica dipendenza obbligatoria e fornisce l’interprete CPU predefinito. Adattatori opzionali collegano il grafo a IREE, XLA tramite un plugin PJRT fornito dall’utente e TVM. Backend e dispositivo si scelgono esplicitamente; la copertura dipende dall’adattatore. La versione documenta Vulkan su Mesa lavapipe e ROCm con TVM solo in compilazione.

Il README riporta **7,511 test superati, 77 saltati, 4 fallimenti attesi e 0 fallimenti** nelle suite del core e di `evoxc_hf`, con IREE, TVM e torch installati. Sono risultati dichiarati dal progetto per tale configurazione. Il repository attribuisce a EvoX Genesis la produzione di codice, test e documentazione.

## Per iniziare

Può installare questa versione con il comando seguente. Gli adattatori opzionali sono descritti nel README della versione; l’integrazione HuggingFace è distribuita separatamente come `evoxc-hf`.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
