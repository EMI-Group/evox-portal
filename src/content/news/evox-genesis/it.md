---
title: "EvoX Genesis: un sistema di IA evolutivo ricorsivo che ha costruito da zero un compilatore C di 250.000 righe"
pubDate: 2026-08-17
summary: "Il team EvoX del Dipartimento di Data Science e Intelligenza Artificiale della Hong Kong Polytechnic University ha rilasciato EvoX Genesis, un sistema di IA evolutivo ricorsivo. Invece di affidarsi a un agente persistente per sostenere lo sviluppo su orizzonti temporali lunghi, lascia che sia il mondo software stesso a evolversi continuamente: partendo da un repository vuoto, il sistema ha costruito un compilatore C di 248.989 righe in 123,4 ore, con un costo complessivo in token del modello di soli 44,38 dollari."
---

# EvoX Genesis: un sistema di IA evolutivo ricorsivo che ha costruito da zero un compilatore C di 250.000 righe

![image1.png](./evox-genesis-1.png)

Il team EvoX del Dipartimento di Data Science e Intelligenza Artificiale della Hong Kong Polytechnic University ha rilasciato **EvoX Genesis**, un sistema di IA evolutivo ricorsivo.

EvoX Genesis non si affida più a un agente persistente per sostenere lo sviluppo su orizzonti temporali lunghi. Al contrario, lascia che sia il mondo software stesso a evolversi continuamente.

Partendo da un repository vuoto, il sistema ha costruito un **compilatore C di 248.989 righe** in 123,4 ore, attraverso 1.019 episodi di agente, con un costo in token del modello di soli **44,38 dollari**.

## Long-horizon coding: il confine continua a spostarsi

Il tempo di lavoro degli agenti di coding è cresciuto da singole attività brevi a decine di ore.

OpenAI ha eseguito Codex partendo da un repository vuoto per circa 25 ore consecutive, producendo all'incirca 30.000 righe di codice.

Anthropic ha utilizzato 16 agenti Claude, attraverso quasi 2.000 sessioni, circa due settimane e quasi 20.000 dollari di costi API, per costruire da zero un compilatore C di circa 100.000 righe.

I tempi continuano ad allungarsi, gli agenti a moltiplicarsi e il software a farsi sempre più complesso.

Ma il centro della ricerca resta l'agente:

modelli più potenti, contesti più lunghi, memoria più persistente, più agenti.

**Il team EvoX ha rivolto la domanda in un'altra direzione:**

**Perché l'agente deve persistere?**

E se ciò che deve davvero persistere fosse il mondo software in cui vive?

## 123,4 ore, 250.000 righe

Abbiamo fatto partire EvoX Genesis da un repository con un'implementazione vuota.

C'era un solo obiettivo: costruire un compilatore C.

123,4 ore, 1.019 episodi di agente, **248.989 righe di codice** e un costo in token del modello di soli **44,38 dollari**.

Il compilatore finale ha superato 220/220 test di c-testsuite, 32/36 casi di test LLVM e 93/93 test di programmi randomizzati Csmith.

Non c'era alcun compilatore esistente ad attenderne il completamento — **è partito da zero.**

![image2.png](./evox-genesis-2.png)

_Figura 1: risultati dell'esperimento sul compilatore C / dimensione del codice, tempo di esecuzione, episodi di agente, costi e risultati dei test_

_(utilizzando il modello DeepSeek V4 Flash)_

## Non mantenere in vita l'agente — mantenere in vita il mondo software

La vita di un software complesso è naturalmente più lunga di una singola sessione di agente.

EvoX Genesis organizza il software in un mondo software che si sviluppa ricorsivamente:

gli agenti di livello superiore decompongono gli obiettivi e nuovi agenti completano il lavoro in posizioni locali;

una volta verificati, i risultati entrano nella storia delle versioni del software e diventano la realtà su cui si sviluppa il ciclo successivo.

A quel punto gli agenti possono scomparire,

e nuovi agenti continuano a partire dal mondo software che ha già preso forma.

Ciò che persiste non è una conversazione, non uno scratchpad in continua crescita e nemmeno un «agente master» sempre online.

Ciò che persiste è il codice, la struttura, i vincoli, i risultati della verifica e la storia che si è già svolta.

**Ciò che persiste non è l'agente, ma il mondo software.**

**L'agente non persiste. Persistono le sue conseguenze validate.**

Questa è l'evoluzione autonoma ricorsiva di EvoX Genesis. Per gli utenti significa anche una cosa molto semplice:

**Non si costruiscono agenti — si descrive soltanto ciò che si vuole che il software diventi.**

Non è necessario progettare in anticipo agenti, ruoli o workflow, né scomporre manualmente un albero di attività completo.

All'utente basta descrivere l'obiettivo di sviluppo del software in un breve testo;

come le attività vengono decomposte, come vengono generati gli agenti, come si sviluppa la ricorsione e come vengono verificati i risultati — tutto questo è fatto da EvoX Genesis stesso.

![image3.png](./evox-genesis-3.png)

_Figura 2: il concetto di Persistent Recursive World / gli agenti nascono, agiscono e scompaiono; il mondo software continua a svilupparsi_

## I modelli possono cambiare; il mondo software continua

Questa continuità non richiede nemmeno di utilizzare sempre lo stesso modello.

In un altro insieme di esperimenti, un mondo software inizialmente costruito da GLM 5.2 è stato affidato a DeepSeek V4 Flash per continuarne lo sviluppo.

Alla fine ha superato 1.820/1.820 dei test LLVM SingleSource conservati.

I modelli possono essere sostituiti, gli agenti possono essere sostituiti — il mondo software continua.

![image4.png](./evox-genesis-4.png)

_Figura 3: l'esperimento di continuazione tra modelli diversi, GLM 5.2 → DeepSeek V4 Flash_

## Partire da zero, o ereditare la storia

Costruire da zero è solo un'estremità del ciclo di vita del software;

l'altra è un mondo software esistente da anni, ricco di struttura e di storia.

Abbiamo applicato EvoX Genesis a MESA — un sistema di calcolo scientifico per l'evoluzione stellare sviluppato da molto tempo.

L'esperimento ha coinvolto 13 moduli Fortran, per un totale di **139.414 righe**;

EvoX Genesis li ha riscritti nei corrispondenti crates Rust, con un costo in token del modello di circa **10,6 dollari**.

Un mondo software può essere creato dal nulla, oppure può ereditare la storia e continuare a trasformarsi.

![image5.png](./evox-genesis-5.png)

_Figura 4: MESA Fortran → Rust, 13 moduli, 139.414 righe di codice, 10,6 dollari_

## I vantaggi di costo si accumulano nel tempo

Lo sviluppo software su orizzonti temporali lunghi non significa che i costi crescano linearmente senza sosta.

In EvoX Genesis, il codice verificato, la struttura e la storia dello sviluppo si accumulano continuamente e diventano la base per il ciclo di lavoro successivo. Gli agenti successivi non devono capire nuovamente l'intero progetto da zero; gran parte delle informazioni esistenti può essere memorizzata in cache e riutilizzata direttamente, con un tasso di hit della cache fino al 97,4%.

Man mano che il sistema continua a funzionare, lo stato di sviluppo riutilizzabile diventa più ricco, il calcolo ridondante diminuisce e il costo unitario dello sviluppo scende effettivamente nel tempo.

Si tratta di un interesse composto ingegneristico che si accumula nel tempo.

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

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

**Gli agenti se ne vanno; il mondo software continua a evolversi**

**EvoX Genesis**

![image8.png](./evox-genesis-8.png)

Riferimenti:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
