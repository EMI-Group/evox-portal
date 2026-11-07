---
title: "Genesis WASM Render: dalla generazione locale di codice alla costruzione di sistemi"
pubDate: 2026-10-15
updatedDate: 2026-11-07
summary: "Il renderer software di Genesis studia come interfacce, test e modifiche accettate coordinino la costruzione di una pipeline grafica completa."
---

*Aggiornato il 7 novembre 2026. I risultati storici mantengono la data della rilevazione originale.*

Costruire un sistema software richiede che le modifiche locali utili rimangano compatibili mentre il progetto cresce. Genesis affronta questa sfida con WASM Render, collegando Agentic AI nell'ecosistema EvoX alla costruzione di sistemi: elaborazione degli shader, rendering e comportamento delle API devono formare un insieme coerente.

La documentazione pubblica di Genesis descrive un renderer software TypeScript sviluppato con DeepSeek V4 Flash. Riporta 2.017/2.019 casi Khronos CTS superati, inclusi 1.184/1.184 casi WebGL2 nell'insieme valutato. I circa 36 USD coprono solo i token, non l'hardware. Le 65,9 ore tra il primo e l'ultimo commit degli agenti sono un intervallo del repository, non una misura del tempo di attività degli agenti.

[Genesis Evidence](https://genesis.evox.group/evidence/tbench-wasm/)

## Dal codice locale a un sistema completo: dove si trovano le difficoltà?

WASM Render è una sfida dedicata ai sistemi grafici di Terminal-Bench Challenges: eseguire programmi WebGL senza browser, GPU o librerie di runtime esterne.

Questo equivale a implementare una pipeline grafica via software: interpretare i programmi shader, calcolare la grafica e mantenere coerenti numerose interfacce e variazioni di stato. Una singola funzionalità operativa è ancora ben lontana da un intero sistema che funziona in modo coordinato. Il compito richiede all’IA di mantenere l’allineamento con l’obiettivo durante più cicli di sviluppo, gestire le dipendenze tra moduli, correggere gli errori in base ai riscontri dei test e, infine, completare l’integrazione del sistema e la verifica delle regressioni.

La prova iniziale di 12 ore e questa esecuzione hanno budget di sviluppo diversi: i tassi di successo non costituiscono una classifica controllata. L'archivio Evidence riporta inoltre 16/38 casi visivi three.js alla soglia rigorosa dello 0,1% e 13/16 casi Babylon.js, entrambi sottoinsiemi selezionati. La conformità delle API non dimostra quindi una compatibilità grafica completa.

![Risultati dei test di conformità WebGL2.0 e registri dei test Khronos CTS di Genesis](./wasm-render-results-en.png)

*Risultati dei test di conformità WebGL2.0 e registri dei test Khronos CTS di Genesis.*

L'archivio conta 135.165 righe di testo tracciate, inclusi renderer.js generato, codice di terze parti, un lockfile e documentazione; non sono tutte sorgenti del renderer. Il progetto descrive una delle prime consegne autonome, senza una classifica pubblicata dagli organizzatori. I risultati sono dichiarati dal progetto e non riprodotti indipendentemente.

Il ciclo di sviluppo ha infine superato 2,017 test Khronos CTS, con circa 36 dollari USA di costi per i token del modello e un tasso di successo della cache di circa il 98%. Portare avanti e integrare un progetto di ingegneria del software di dimensioni così grandi con un costo del modello contenuto dimostra anche la capacità di Genesis di svolgere uno sviluppo di lunga durata utilizzando modelli open source economici.

## Lasciare che il progetto continui a evolvere e che gli agenti intervengano quando servono

Genesis è un sistema di IA ricorsivo per l’evoluzione del software. Gli utenti descrivono un obiettivo di sviluppo software e il sistema articola le attività intorno a esso, assegnando agenti locali dove occorre svolgere il lavoro e conservando nel progetto software il codice accettato e i risultati della validazione.

Per i progetti di grandi dimensioni, un approccio intuitivo consiste nel dare di più agli agenti: contesti più lunghi, sessioni più persistenti e una collaborazione predefinita più articolata. Genesis colloca la continuità dello sviluppo nel progetto software stesso. Gli obiettivi e i vincoli di livello superiore guidano l’intero sviluppo, mentre le attività si articolano ricorsivamente lungo la struttura del repository. Gli agenti svolgono il lavoro locale e terminano una volta completato; gli agenti successivi proseguono dal progetto che ha già preso forma.

In precedenza, Genesis era partita da un repository vuoto, aveva costruito un compilatore C composto da circa 250,000 righe di codice e aveva portato avanti lo sviluppo passando da un modello all’altro. I risultati dei test WASM Render confermano ulteriormente le capacità di Genesis di costruire e integrare autonomamente sistemi grafici complessi.

## Sistemi aperti che continuano a evolvere

Il valore open source di questo caso sta nel rendere ispezionabile la costruzione: interfacce, implementazioni e verifiche restano disponibili per il lavoro successivo. Avanza così la direzione EvoX di software che accumula modifiche utili tra compiti degli agenti, valutando il progresso attraverso il comportamento del sistema integrato.

🔗 Repository Genesis: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Articolo scientifico su Genesis: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repository dei risultati della sfida: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Progetto upstream (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Gruppo QQ: 297969717
