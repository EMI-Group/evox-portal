---
title: "EvoNAS: prima di cercare una rete migliore, rendere utile il confronto"
pubDate: 2026-11-14
summary: "Condividere i pesi riduce il costo della ricerca, ma può alterare la classifica. EvoNAS collega addestramento e valutazione per guidare la scelta successiva."
---

Una rete può vincere durante la ricerca e deludere dopo un addestramento indipendente. Nella ricerca evolutiva, ogni generazione usa le valutazioni precedenti per scegliere cosa conservare: una classifica distorta può quindi spingere una ricerca più lunga nella direzione sbagliata. EvoNAS collega apprendimento della super-rete, valutazione dei candidati e compromesso tra accuratezza e costo di calcolo.

![Illustrazione concettuale: cornici a forma di rete osservano la stessa strada e un sottile contorno geometrico.](./evonas-editorial.webp)

## La ricerca dipende dalla qualità delle valutazioni

Addestrare ogni candidato separatamente sarebbe oneroso. Condividere i pesi evita di ricominciare, ma lega anche gli apprendimenti. La struttura più favorita dai parametri condivisi non è necessariamente la migliore dopo un addestramento autonomo. Poiché la selezione forma la generazione successiva, un confronto distorto può cambiare l’intera ricerca.

Una super-rete condivide i parametri tra architetture. Le prestazioni con i pesi ereditati, però, non riflettono necessariamente il potenziale del candidato. Lo studio presentato il 20 marzo 2026 propone una super-rete ibrida VSS–ViT e CA-DDKD, che allinea le rappresentazioni nei domini spaziale e delle frequenze. PST estende gradualmente l’addestramento dalle configurazioni grandi a quelle compatte.

Riconoscere un edificio non equivale a individuarne con precisione il contorno. Nella profondità e nella segmentazione contano anche una ringhiera sottile, uno spigolo o il confine con lo sfondo. CA-DDKD usa vincoli basati sulla trasformata discreta del coseno per aiutare a preservare questi dettagli geometrici. La posizione spaziale e le variazioni che definiscono bordi e texture si completano.

La strategia di addestramento diventa così parte del metodo di ricerca. Rappresentazioni condivise migliori offrono confronti più utili; aumentare soltanto i candidati non corregge una classifica inaffidabile.

## Confrontare secondo i vincoli

Nella stima della profondità si può accettare un compromesso di accuratezza per rispettare un limite di latenza. La ricerca multiobiettivo offre più alternative. DMMPE valuta più modelli usando un pool di risorse GPU e pianificazione asincrona. La scelta richiede hardware, dati e protocollo di misura pertinenti.

I candidati devono essere misurati in condizioni hardware e di esecuzione comparabili. La configurazione di ricerca definisce ciò che sembra promettente; il riaddestramento rivela ciò che la struttura scelta può apprendere. Collegare queste fasi riporta al problema di classifica affrontato da EvoNAS.

## Prima di avviare un esperimento

Il percorso comprende preaddestramento su ImageNet-1k, affinamento PST sui dati di destinazione, ricerca evolutiva e riaddestramento della sottorete scelta. La guida copre KITTI e NYU Depth v2 per la profondità, COCO per il rilevamento e ADE20K per la segmentazione. Seguire un solo dataset attraverso percorsi, configurazioni e obiettivi permette di collegare il punteggio di ricerca al modello finale.

Il README indica ancora come imminente il download della super-rete preaddestrata necessaria. Prima di iniziare, verifichi la disponibilità dei pesi e abbini il wheel Mamba SSM all’ambiente Python, CUDA e PyTorch documentato.

[Codice e installazione](https://github.com/EMI-Group/evonas/blob/e4f6866e8092545b2b9b28f3fe0162e038e34f3c/README.md) · [Articolo scientifico](https://arxiv.org/abs/2603.19563v1)

[EvoX](/it/libs)
