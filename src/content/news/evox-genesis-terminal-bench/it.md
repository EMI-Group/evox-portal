---
title: "EvoX Genesis completa e invia la sfida WASM Render di Terminal-Bench per 36 dollari"
pubDate: 2026-09-10
summary: "Il team EvoX ha utilizzato Genesis per completare e inviare la sfida WASM Render all'interno di Terminal-Bench Challenges, con un costo dei modelli registrato di 36 dollari per l'esecuzione — ben al di sotto delle oltre 1.000 dollari per sfida dichiarate da Terminal-Bench. Alla data di pubblicazione, Genesis potrebbe essere il primo sistema autonomo a riferire pubblicamente il completamento e l'invio di un risultato di una Terminal-Bench Challenge."
---

![EvoX Genesis completa e invia la sfida WASM Render di Terminal-Bench](./evox-genesis-terminal-bench-hero.png)

Il team EvoX ha utilizzato Genesis per completare e inviare la sfida WASM Render all'interno di Terminal-Bench Challenges, con un **costo dei modelli registrato di 36 dollari** per l'esecuzione.

Alla data di pubblicazione, **Genesis potrebbe essere il primo sistema autonomo a riferire pubblicamente il completamento e l'invio di un risultato di una Terminal-Bench Challenge**.

## WASM Render: costruire da zero un intero stack software WebGL

WASM Render chiede di implementare un renderer software puro in JavaScript/WASM che fornisca le API WebGL 1.0 e 2.0 a progetti Node.js. L'ambiente di destinazione non può dipendere da un browser, da una GPU, da binding C++ nativi o da librerie esterne.

Secondo le specifiche della sfida, la soluzione deve coprire un compilatore GLSL, la rasterizzazione dei triangoli e l'intera superficie delle API WebGL. Terminal-Bench definisce l'ambito di verifica in 2.071 test Khronos CTS, insieme a suite di regressione visiva per three.js e Babylon.js. Questo descrive l'obiettivo di accettazione della sfida; non significa che la submission di Genesis abbia già superato una valutazione ufficiale di Terminal-Bench.

Molti benchmark per agenti di programmazione valutano un singolo bug fix o una funzionalità localizzata. WASM Render è diversa: il lavoro si estende su un ampio insieme di moduli interdipendenti e l'intera codebase deve rimanere coerente attraverso l'implementazione, l'integrazione e la validazione continue.

Attività di questo tipo espongono i problemi centrali dello sviluppo di lungo orizzonte: le modifiche locali restano coerenti con l'architettura complessiva? Le decisioni iniziali vengono ereditate correttamente dal lavoro successivo? Le evidenze di validazione possono guidare in modo affidabile la fase successiva? Terminal-Bench Challenges amplia l'unità di valutazione a un progetto software completo proprio per osservare queste capacità.

![Terminal-Bench Challenges rispetto ad attività di programmazione di orizzonte più breve](./evox-genesis-terminal-bench-comparison.jpg)

## Come Genesis sostiene lo sviluppo di lungo orizzonte

Genesis non si affida a un singolo agente persistente o a un contesto in continua crescita per conservare l'intero stato di sviluppo. È il progetto software stesso a costituire il «mondo» persistente: la versione accettata del software registra lo stato attuale, mentre i percorsi del repository definiscono dove si trova un agente e di cosa è responsabile.

Agenti a vita limitata si dispiegano ricorsivamente attorno alla struttura del repository. Entro ambiti delimitati, implementano, ispezionano e validano le modifiche candidate. Gli output degli agenti nascono come proposte; solo il codice accettato e le evidenze di validazione entrano nella storia del progetto e diventano ereditabili dagli agenti successivi.

Per un progetto di sistemi come WASM Render, ciò consente a ogni agente di affrontare un problema mirato e delimitato, mentre compilatore, pipeline di rendering, gestione dello stato e lavoro di compatibilità continuano a evolversi attraverso una storia condivisa di codice e validazione.

Genesis ha completato la sfida WASM Render con soli 36 dollari, ben al di sotto delle oltre 1.000 dollari per sfida dichiarate da Terminal-Bench.

Anche i nostri test interni non formali indicano che Genesis riesce a lavorare efficacemente su codebase di circa 100.000 righe. Con codebase da un milione di righe o più abbiamo meno esperienza, ma i tentativi finora sono proceduti senza intoppi.

🌐 Sito web del progetto:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 Gruppo QQ: 297969717

![Codice QR del gruppo QQ](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>Gruppo QQ｜</strong>Evolutionary Machine Intelligence</center>
