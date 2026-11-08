---
title: "EvoX VirtualES: più candidati, meno pesi da memorizzare"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "Un centro condiviso e semi casuali per candidato consentono a VirtualES di ricostruire le perturbazioni su richiesta, cambiando il budget di memoria della ricerca."
---

Una popolazione più ampia di reti neurali richiede normalmente più copie dei pesi. Le modifiche EvoX del 7–8 luglio 2026 seguono un’altra strada: VirtualES conserva un centro di parametri condiviso e un seme casuale per candidato, ricostruendo le differenze durante la valutazione. Quanta diversità di ricerca può trovare spazio prima che i parametri esauriscano la memoria?

![Una forma solida condivisa, semi rossi e varianti trasparenti rappresentano una popolazione virtuale](./virtuales-shared-center.webp)

*Illustrazione concettuale: un centro condiviso, molti candidati ricostruibili.*

## Memorizzare la ricetta del candidato

Per P candidati con D parametri ciascuno, la memoria esplicita cresce come P × D. La rappresentazione con centro e semi usa circa D + P elementi. Il confronto riguarda i parametri della popolazione; attivazioni, stato dell’ottimizzatore e buffer di valutazione contribuiscono comunque al totale. [Implementazione di VirtualES](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

VirtualES passa `(center, seeds, sigma)` al workflow. VirtualProblem valuta ogni strato con un’operazione Triton fusa che combina il calcolo lineare di base con perturbazioni dei pesi e dei bias generate dai semi. La fitness guida poi l’aggiornamento del centro. Le perturbazioni gaussiane complete sostituiscono la precedente formulazione LoRA a basso rango. [Implementazione della valutazione](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## Mantenere distinto il feedback di ogni candidato

Il punto di partenza supportato è una rete `nn.Sequential` con strati lineari e attivazioni documentate. Imposti la funzione di perdita su `reduction='none'`: VirtualProblem potrà aggregare separatamente le perdite dei candidati. Una perdita scalare verrebbe estesa a tutta la popolazione, cancellando la distinzione. Questa piccola scelta d’interfaccia incide sulla ricerca.

Il percorso virtuale salta la valutazione distribuita e le trasformazioni delle soluzioni; VirtualProblem esclude anche il wrapper HPO. Verifichi questi confini prima di adattare un esperimento. [Integrazione nel workflow](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## Misurare le possibilità della rappresentazione

Parta da una rete supportata e vari la popolazione, registrando picco di memoria, tempo di valutazione e fitness con un budget di valutazione fisso. Potrà distinguere il risparmio di memoria dal costo di rigenerare il rumore e trattare le attivazioni. Le modifiche di luglio includono una [correzione di compilazione Triton](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef) per la funzione ausiliaria del rumore.

La [guida iniziale](/it/news/evox-quickstart) introduce la struttura degli esperimenti EvoX. VirtualES permette poi di verificare una domanda concreta: come cambia l’esperimento con una popolazione maggiore, quando memorizzare tutti i pesi non è più un prerequisito?
