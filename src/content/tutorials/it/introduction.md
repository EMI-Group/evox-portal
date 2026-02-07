---
title: "1. Introduzione"
order: 1
---

# 1. Introduzione

## Cos'è EvoX?

EvoX è una libreria open-source per il calcolo evolutivo, utilizzata principalmente per risolvere vari problemi di ottimizzazione complessi. Il calcolo evolutivo è una categoria di algoritmi che simulano l'evoluzione naturale per cercare soluzioni ottimali, tra cui Algoritmi Genetici (GA), Strategie Evolutive (ES), Ottimizzazione a Sciame di Particelle (PSO), ecc.

I framework evolutivi tradizionali sono spesso limitati dalle risorse computazionali e dai modelli di programmazione, rendendoli inefficienti per problemi su larga scala. EvoX supera queste sfide combinando **accelerazione GPU** e **calcolo distribuito**, offrendo una soluzione efficiente e scalabile che consente agli utenti di trovare soluzioni migliori più rapidamente in spazi di ricerca complessi.

## Caratteristiche Principali di EvoX

- **Architettura Modulare**: EvoX suddivide il processo di ottimizzazione in moduli indipendenti: Algoritmo, Problema, Monitor e Workflow. Gli utenti non devono preoccuparsi delle implementazioni parallele a basso livello — EvoX sfrutta automaticamente l'hardware per migliorare le prestazioni.
- **Esecuzione Distribuita**: EvoX supporta l'esecuzione distribuita su più GPU e persino su più nodi. Lo stesso codice può essere eseguito su una singola macchina o scalato su un cluster GPU con poco o nessun sforzo aggiuntivo di programmazione parallela. Ciò significa che le tue attività di ottimizzazione possono facilmente scalare da un laptop a un ambiente server cluster.
- **Interfaccia di Programmazione Funzionale**: EvoX fornisce un'interfaccia di programmazione funzionale che si allinea strettamente ai modelli matematici. Gli algoritmi principali sono implementati come funzioni pure senza effetti collaterali, semplificando la parallelizzazione e il debug. Gli utenti devono solo implementare le funzioni richieste come definito dal framework, senza gestire manualmente stati algoritmici complessi.
- **Visualizzazione e Monitoraggio**: EvoX include ricchi strumenti di visualizzazione e moduli di monitoraggio per tracciare il processo evolutivo in tempo reale. Utilizza un formato dati dedicato `.exv` per lo streaming efficiente e la registrazione dei dati di ottimizzazione e fornisce moduli di visualizzazione intuitivi per tracciare curve di convergenza e altro. Questi strumenti offrono agli utenti una comprensione intuitiva delle prestazioni dell'algoritmo e dello stato di convergenza.
- **Ampie Librerie di Algoritmi e Problemi**: EvoX include oltre 50 algoritmi evolutivi mono-obiettivo e multi-obiettivo e oltre 100 problemi di ottimizzazione benchmark. Che si tratti di ottimizzazione classica di funzioni, sfide ingegneristiche complesse o attività di machine learning come l'ottimizzazione degli iperparametri (HPO) e la neuroevoluzione, EvoX fornisce algoritmi e interfacce per problemi pronti all'uso.

## Casi d'Uso

Grazie alle caratteristiche sopra descritte, EvoX è particolarmente adatto ai seguenti scenari:

- **Ottimizzazione di Parametri su Larga Scala**: Per problemi ad alta dimensionalità con ampi spazi di ricerca, il calcolo parallelo basato su GPU e gli algoritmi efficienti di EvoX possono ridurre significativamente i tempi di risoluzione. Esempi includono l'ottimizzazione dei pesi delle reti neurali o la progettazione di parametri di sistemi complessi — EvoX può accelerare il processo.
- **Ottimizzazione Multi-Obiettivo**: Quando è necessario ottimizzare simultaneamente più obiettivi (spesso in conflitto) — come bilanciare costo e prestazioni nella progettazione ingegneristica — EvoX include una varietà di algoritmi evolutivi multi-obiettivo (come NSGA-II, RVEA, ecc.) per cercare l'insieme Pareto-ottimale.
- **Ottimizzazione degli Iperparametri (HPO)**: La ricerca delle migliori combinazioni di iperparametri per i modelli di machine learning può richiedere molto tempo. EvoX consente l'uso di strategie evolutive per cercare efficientemente configurazioni di iperparametri, trovando spesso soluzioni migliori più velocemente rispetto alla ricerca a griglia o casuale.
- **Apprendimento per Rinforzo e Neuroevoluzione**: EvoX supporta nativamente ambienti di apprendimento per rinforzo (come OpenAI Gym e Google Brax) e dataset di deep learning (come CIFAR-10). Ciò consente agli utenti di addestrare politiche di controllo o architetture di reti neurali utilizzando algoritmi evolutivi (cioè neuroevoluzione) — ad esempio, utilizzando algoritmi genetici per ottimizzare i parametri delle politiche RL.
- **Ricerca Accademica e Applicazioni Ingegneristiche**: Per i ricercatori in algoritmi evolutivi, EvoX offre una piattaforma altamente flessibile per implementare e testare nuovi metodi. Per attività di ottimizzazione ingegneristica (come la regolazione dei parametri di processi industriali o l'aggiustamento di sistemi di controllo), EvoX fornisce un risolutore ad alte prestazioni che può ottenere soluzioni quasi ottimali in tempi ragionevoli.

In sintesi, EvoX è adatto a qualsiasi attività di ottimizzazione che **richieda l'esplorazione rapida di un ampio spazio di soluzioni**, purché l'attività possa essere massivamente parallelizzata su GPU. Che tu sia un ricercatore di IA o uno sviluppatore ingegneristico che affronta problemi di ottimizzazione complessi, EvoX è uno strumento potente per migliorare la tua efficienza di risoluzione.

> **Suggerimento:**
> EvoX può funzionare su molti dispositivi GPU, incluse GPU NVIDIA e GPU AMD, o anche la GPU del tuo Mac.
