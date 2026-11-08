---
title: "EvoX Genesis: costruire software che possa continuare a evolvere"
pubDate: 2026-08-17
updatedDate: 2026-11-08
summary: "Genesis estende l'IA evolutiva di EvoX al software: gli agenti propongono modifiche, la validazione seleziona il lavoro accettato e il progetto conserva i progressi."
---

Genesis porta la visione di EvoX in Agentic AI, facendo del progetto software in evoluzione il risultato persistente di numerosi contributi locali. Generazione del codice, esecuzione, revisione e integrazione formano un ciclo di sviluppo. Le implementazioni accettate e le loro validazioni costituiscono la base del lavoro successivo. [Genesis](https://github.com/EMI-Group/genesis)

![Moduli sorgente assemblati in un progetto in crescita](./software-world-continuity.webp)

![image1.png](./evox-genesis-1.png)

Il team EvoX del Dipartimento di Data Science e Intelligenza Artificiale della Hong Kong Polytechnic University ha rilasciato **EvoX Genesis**, un sistema di IA ricorsivo per l'evoluzione autonoma del software a lungo termine.

EvoX Genesis non si affida più a un agente persistente per sostenere lo sviluppo su orizzonti lunghi. Lascia invece che sia il mondo software stesso a evolversi continuamente.

Partendo da un repository vuoto, il sistema ha costruito un **compilatore C di 248.989 righe** in 123,4 ore, attraverso 1.019 episodi di agente, con un costo in token del modello di soli **44,38 dollari**.

## Coding a lungo orizzonte: il confine continua a spostarsi

Il tempo di lavoro dei coding agent è passato da singole attività brevi a decine di ore.

OpenAI ha eseguito Codex da un repository vuoto per circa 25 ore consecutive, producendo circa 30K righe di codice.

Anthropic ha utilizzato 16 agenti Claude, attraverso quasi 2.000 sessioni, circa due settimane e quasi 20.000 dollari di costi API, per costruire da zero un compilatore C di circa 100K righe.

I tempi si allungano, gli agenti aumentano, il software diventa sempre più complesso.

Ma il centro della ricerca resta l'agente:

modelli più potenti, contesti più lunghi, memoria più persistente, più agenti.

**Il team EvoX ha girato la domanda in un'altra direzione:**

**Perché l'agente deve persistere?**

E se ciò che deve davvero persistere fosse il mondo software in cui vive?

## 123,4 ore, 250K righe

Abbiamo fatto partire EvoX Genesis da un repository con implementazione vuota.

C'era un solo obiettivo: costruire un compilatore C.

123,4 ore, 1.019 episodi di agente, **248.989 righe di codice** e un costo in token del modello di soli **44,38 dollari**.

Il compilatore finale ha superato 220/220 test di c-testsuite, 32/36 casi di test LLVM e 93/93 test di programmi casuali Csmith.

Nessun compilatore esistente attendeva lì di essere completato — **è partito da zero.**

![image2.png](./evox-genesis-2.png)

_Figura 1: risultati dell'esperimento del compilatore C / dimensioni del codice, tempo di esecuzione, episodi di agente, costi e risultati dei test_

_(con il modello DeepSeek V4 Flash)_

## Non tenere in vita l'agente — tenere in vita il mondo software

La vita del software complesso è naturalmente più lunga di una singola sessione di un agente.

EvoX Genesis organizza il software in un mondo software che si svolge ricorsivamente:

gli agenti di livello superiore decompongono gli obiettivi e nuovi agenti completano il lavoro in posizioni locali;

una volta verificati, i risultati entrano nella storia delle versioni del software e diventano la realtà del ciclo di sviluppo successivo.

Poi gli agenti possono scomparire,

e nuovi agenti continuano dal mondo software ormai formato.

Ciò che persiste non è una conversazione, non un blocco note in continua crescita e non un "agente master" sempre online.

Ciò che persiste è il codice, la struttura, i vincoli, i risultati della verifica e la storia già accaduta.

**Ciò che persiste non è l'agente, ma il mondo software.**

**Agent does not persist. Its validated consequences do.**

È così che EvoX Genesis sostiene l'evoluzione autonoma del software a lungo termine. Per gli utenti significa anche una cosa molto semplice:

**Non si costruiscono agenti — si descrive solo ciò che il software deve diventare.**

Non serve progettare in anticipo agenti, ruoli o flussi di lavoro, né decomporre manualmente un albero di attività completo.

L'utente deve solo descrivere l'obiettivo di sviluppo in un breve testo;

come le attività vengono decomposte, come gli agenti vengono generati, come la ricorsione si svolge e come i risultati vengono verificati — tutto questo è fatto da EvoX Genesis stesso.

![image3.png](./evox-genesis-3.png)

_Figura 2: il concetto di Persistent Recursive World / gli agenti nascono, agiscono e scompaiono; il mondo software continua a svolgersi_

## I modelli possono cambiare; il mondo software continua

Questa continuità non richiede nemmeno di usare sempre lo stesso modello.

In un altro insieme di esperimenti, un mondo software inizialmente costruito da GLM 5.2 è stato passato a DeepSeek V4 Flash per continuarne lo sviluppo.

Alla fine ha superato 1.820/1.820 dei test LLVM SingleSource conservati.

I modelli possono essere sostituiti, gli agenti possono essere sostituiti — il mondo software continua.

![image4.png](./evox-genesis-4.png)

_Figura 3: l'esperimento di continuazione tra modelli, GLM 5.2 → DeepSeek V4 Flash_

## Da zero, o ereditando la storia

Costruire da zero è solo un estremo del ciclo di vita del software;

l'altro estremo è un mondo software esistente da anni, ricco di struttura e di storia.

Abbiamo applicato EvoX Genesis a MESA — un sistema di calcolo scientifico per l'evoluzione stellare, sviluppato da molto tempo.

L'esperimento ha coinvolto 13 moduli Fortran, per un totale di **139.414 righe**;

EvoX Genesis li ha rifattorizzati nei corrispondenti crate Rust, con un costo in token del modello di circa **10,6 dollari**.

Un mondo software può essere creato dal nulla, oppure può ereditare la storia e continuare a cambiare.

![image5.png](./evox-genesis-5.png)

_Figura 4: MESA Fortran → Rust, 13 moduli, 139.414 righe di codice, 10,6 dollari_

## I vantaggi di costo si capitalizzano nel tempo

Lo sviluppo software a lungo termine non significa che i costi crescano linearmente.

In EvoX Genesis, codice verificato, struttura e storia di sviluppo si accumulano e diventano la base del lavoro successivo. Gli agenti successivi non devono capire nuovamente l'intero progetto da zero; gran parte delle informazioni esistenti può essere memorizzata in cache e riutilizzata, con un tasso di hit della cache fino al 97,4%.

Man mano che il sistema continua a funzionare, lo stato di sviluppo riutilizzabile si arricchisce, i calcoli ridondanti diminuiscono e il costo unitario dello sviluppo scende effettivamente nel tempo.

Sono interessi composti di ingegneria che si accumulano nel tempo.

## EvoX Genesis è ora open source

Il progetto è open source, con pacchetti di installazione disponibili per Windows, macOS e Linux.

🌐 Sito web:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Download**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Paper:**

**https://arxiv.org/abs/2608.10450**

🌐 Gruppo QQ: 297969717

![image7.png](./evox-genesis-7.png)

**Gli agenti se ne vanno; il mondo software continua a evolversi**

**EvoX Genesis**

Riferimenti:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).

Riparta da una revisione accettata con comandi di compilazione e test di regressione. Esamini il contributo successivo rispetto a questa base prima dell’integrazione. [Genesis: conservare i contributi degli agenti nella storia del software](/it/news/genesis-development-history)
