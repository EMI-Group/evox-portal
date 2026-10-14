---
title: "EvoX Genesis completa WASM Render in circa due giorni per 36 dollari"
pubDate: 2026-10-14
summary: "Utilizzando DeepSeek V4 Flash, EvoX Genesis ha completato WASM Render in circa due giorni con soli 36 dollari di costi del modello, diventando il primo sistema di IA al mondo a presentare un risultato per la sfida. I registri di test del team riportano 2,017/2,019 test Khronos CTS superati (99.90%), compresi tutti i 1,184/1,184 test di conformità WebGL2.0 eseguiti."
---

La capacità di portare avanti attività di lunga durata e consegnare infine un progetto ingegneristico completo sta diventando un indicatore importante delle capacità dell’IA. Terminal-Bench è uno dei benchmark rappresentativi per gli agenti di IA e si concentra su attività di programmazione e da riga di comando in ambienti terminale. Terminal-Bench Challenges porta la valutazione oltre, fino alla realizzazione da zero di progetti software completi, con una stima ufficiale dei costi superiore a 1,000 dollari USA per ciascuna sfida.

EvoX Genesis, il sistema di IA ricorsivo per l’evoluzione del software sviluppato dal team EvoX, ha utilizzato DeepSeek V4 Flash per completare la sfida WASM Render in circa **due giorni**, spendendo solo **36 dollari USA** per il modello, diventando **il primo sistema di IA al mondo a presentare un risultato per questa sfida.** I registri di test del team mostrano che ha superato 2,017/2,019 test della suite Khronos CTS (99.90%), compresi tutti i 1,184/1,184 test di conformità WebGL2.0.

## Dal codice locale a un sistema completo: dove si trovano le difficoltà?

WASM Render è una sfida dedicata ai sistemi grafici di Terminal-Bench Challenges: eseguire programmi WebGL senza browser, GPU o librerie di runtime esterne.

Questo equivale a implementare una pipeline grafica via software: interpretare i programmi shader, calcolare la grafica e mantenere coerenti numerose interfacce e variazioni di stato. Una singola funzionalità operativa è ancora ben lontana da un intero sistema che funziona in modo coordinato. Il compito richiede all’IA di mantenere l’allineamento con l’obiettivo durante più cicli di sviluppo, gestire le dipendenze tra moduli, correggere gli errori in base ai riscontri dei test e, infine, completare l’integrazione del sistema e la verifica delle regressioni.

Secondo i risultati pubblicati dal team Terminal-Bench per una prima prova di 12 ore, Devin, il prodotto di Cognition per lo sviluppo software tramite IA, abbinato a Fable 5, ha ottenuto un tasso di superamento del 20.5% nei più impegnativi test di conformità WebGL2.0. Dopo circa due giorni di sviluppo, Genesis ha portato al 100% il tasso di superamento dei test di conformità WebGL2.0 che ha eseguito.

![Risultati dei test di conformità WebGL2.0 e registri dei test Khronos CTS di Genesis](./wasm-render-results-en.png)

*Risultati dei test di conformità WebGL2.0 e registri dei test Khronos CTS di Genesis.*

Il repository pubblico dei risultati di Genesis contiene circa **130,000 righe di codice**, che coprono un compilatore del linguaggio shader GLSL, le interfacce WebGL e la gestione dello stato, la rasterizzazione software e la presentazione delle immagini. Queste implementazioni in TypeScript vengono compilate in un renderer JavaScript, collegando l’elaborazione del linguaggio, il calcolo grafico e il comportamento delle interfacce.

Il ciclo di sviluppo ha infine superato 2,017 test Khronos CTS, con circa 36 dollari USA di costi per i token del modello e un tasso di successo della cache di circa il 98%. Portare avanti e integrare un progetto di ingegneria del software di dimensioni così grandi con un costo del modello contenuto dimostra anche la capacità di Genesis di svolgere uno sviluppo di lunga durata utilizzando modelli open source economici.

## Lasciare che il progetto continui a evolvere e che gli agenti intervengano quando servono

Genesis è un sistema di IA ricorsivo per l’evoluzione del software. Gli utenti descrivono un obiettivo di sviluppo software e il sistema articola le attività intorno a esso, assegnando agenti locali dove occorre svolgere il lavoro e conservando nel progetto software il codice accettato e i risultati della validazione.

Per i progetti di grandi dimensioni, un approccio intuitivo consiste nel dare di più agli agenti: contesti più lunghi, sessioni più persistenti e una collaborazione predefinita più articolata. Genesis colloca la continuità dello sviluppo nel progetto software stesso. Gli obiettivi e i vincoli di livello superiore guidano l’intero sviluppo, mentre le attività si articolano ricorsivamente lungo la struttura del repository. Gli agenti svolgono il lavoro locale e terminano una volta completato; gli agenti successivi proseguono dal progetto che ha già preso forma.

In precedenza, Genesis era partita da un repository vuoto, aveva costruito un compilatore C composto da circa 250,000 righe di codice e aveva portato avanti lo sviluppo passando da un modello all’altro. I risultati dei test WASM Render confermano ulteriormente le capacità di Genesis di costruire e integrare autonomamente sistemi grafici complessi.

## Open source e comunità

Il team EvoX continuerà a sviluppare sistemi di IA ricorsivi per l’evoluzione del software, contribuendo ad accumulare codice, risultati di validazione ed esperienza di sviluppo nella comunità open source. Invitiamo altri sviluppatori a partecipare a un’evoluzione sostenibile del software e a costruire insieme un ecosistema aperto per lo sviluppo software.

🔗 Repository Genesis: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Articolo scientifico su Genesis: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repository dei risultati della sfida: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Progetto upstream (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Gruppo QQ: 297969717
