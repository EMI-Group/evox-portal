---
title: "Genesis costruisce EvoX Compiler: l'IA sviluppa infrastrutture evolutive"
pubDate: 2026-11-03
summary: "Il caso EvoX Compiler collega due livelli dell'ecosistema: Genesis sviluppa software, mentre il compilatore risultante sostiene trasformazione ed esecuzione dei programmi."
updatedDate: 2026-11-08
---

L'infrastruttura per l'IA evolutiva è essa stessa un importante progetto software. Il caso Genesis–EvoX Compiler collega questi livelli: un sistema di sviluppo agentico costruisce ed estende un compilatore di grafi tensoriali, mentre contratti d'interfaccia e test di regressione stabiliscono quali modifiche integrare nello sviluppo continuo.

![Strati del compilatore allineati e collegati da un’asta rossa](./compiler-contract-layers.webp)

## Responsabilità esplicite

EvoX Compiler costruisce e trasforma EvoXIR, poi esegue lowering, compilazione, caricamento ed esecuzione. I compilatori esterni ottimizzano e generano codice. NumPy è il riferimento; IREE, XLA e TVM offrono percorsi facoltativi. [EvoX Compiler](https://genesis.evox.group/evidence/evoxc/)

Le trasformazioni devono preservare il significato, i backend supportare gli operatori accettati e il runtime rispettare i dispositivi. Sono criteri più concreti della sola crescita delle righe di codice.

## Organizzazione del lavoro

Il [record del 28 ottobre 2026](https://genesis.evox.group/evidence/evoxc/) descrive documenti di contesto per pacchetto, dipendenze unidirezionali e test prima di avanzare al livello successivo. Il repository attribuisce a Genesis codice, test e documentazione.

Il lavoro è proseguito su adattatori, grafi e benchmark. Il record ricostruisce la struttura dalla cronologia, senza verificare ogni azione degli agenti. Due mesi di calendario non equivalgono a due mesi di esecuzione autonoma continua.

## Più livelli di verifica

Con IREE installato si riportano **6.789 test superati, 46 saltati e 3 fallimenti attesi**, senza fallimenti. Senza compilatori, **6.367 test superati**. Questi dati storici non vanno sostituiti con quelli di versioni successive. [GW-000005](https://genesis.evox.group/evidence/evoxc/)

L’integrazione separata `evoxc_hf` confronta output e latenza con torch/transformers. Checkpoint, precisione, backend e hardware sono parte del confronto: concordanza numerica e velocità sono proprietà diverse.

## Risultati e limiti

Le **285.659 righe di testo tracciate** includono test, documentazione e dati di benchmark. Circa **50 dollari USA** coprono soltanto i token, non l’hardware. Modello, episodi e tempo effettivo non sono riportati.

Vulkan usava Mesa lavapipe, un dispositivo software; TVM ROCm era limitato alla compilazione. Il nome di un backend non dimostra la verifica completa su ogni dispositivo. I risultati non sono stati riprodotti indipendentemente.

## Collegare evoluzione del software e infrastruttura computazionale

Parta dal [README](https://github.com/EMI-Group/evoxc/blob/main/README.md), poi colleghi le affermazioni a test e [benchmark dei modelli archiviati](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md). Consideri percorsi supportati e divari di prestazioni ancora aperti.

Per applicare il metodo, scelga una trasformazione del grafo o un percorso backend, identifichi il contratto da preservare e i test pertinenti. Registri separatamente verifiche numeriche e misure di latenza. La [panoramica di EvoX Compiler](/it/news/evox-compiler) descrive la pipeline; questo caso mostra come confini espliciti rendano lo sviluppo verificabile.
