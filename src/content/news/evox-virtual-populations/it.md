---
title: "EvoX VirtualES: esplorare senza memorizzare ogni rete candidata"
pubDate: 2026-07-08
summary: "VirtualES e VirtualProblem generano perturbazioni da seed quando servono, riducendo la memoria per i parametri della popolazione nella neuroevoluzione."
---

Le modifiche di EvoX del 7–8 luglio 2026 introducono un percorso per popolazioni virtuali nella neuroevoluzione. Una popolazione convenzionale può richiedere un vettore di parametri per ogni rete candidata. VirtualES conserva invece un centro condiviso e un seed casuale per individuo, ricostruendo le perturbazioni gaussiane quando necessario. Affronta così una domanda infrastrutturale concreta: quanta diversità di candidati si può rappresentare entro un budget di memoria?

## Popolazione compatta, valutazione esplicita

Per P candidati con D parametri, memorizzare tutti i parametri richiede spazio proporzionale a P × D. Centro e seed richiedono circa D + P elementi. Il confronto riguarda soltanto la rappresentazione dei parametri: attivazioni, fitness, stato dell'ottimizzatore e buffer di valutazione occupano comunque memoria.

VirtualES passa `(center, seeds, sigma)` al workflow. VirtualProblem valuta i candidati strato per strato. Un'operazione Triton fusa combina il calcolo lineare di base con le perturbazioni di pesi e bias generate dai seed, evitando il tensore completo delle reti perturbate. La fitness guida poi l'aggiornamento del centro per la generazione successiva.

## Ambito dell'implementazione

Le perturbazioni gaussiane complete sostituiscono la precedente formulazione LoRA a basso rango. VirtualProblem supporta reti `nn.Sequential` con strati lineari e funzioni di attivazione specificate. Non è un valutatore universale per architetture arbitrarie e l'interfaccia documentata non supporta il wrapper HPO. Il percorso virtuale salta anche la valutazione distribuita e le trasformazioni delle soluzioni.

## Perché conta la rappresentazione

Il contributo è un diverso collegamento fra ricerca per popolazioni ed esecuzione. Permette di studiare compromessi di memoria senza memorizzare prima tutti i pesi candidati. Picco di memoria e throughput dipendono però da architettura, popolazione, batch e hardware: queste modifiche non dimostrano un'accelerazione universale. Per EvoX è un passo concreto verso un'esplorazione evolutiva più flessibile sul piano computazionale.

[1](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6) · [2](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921) · [3](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697) · [4](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)
