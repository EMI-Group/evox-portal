---
title: "EvoRL: ricerca evolutiva e apprendimento per rinforzo insieme sulle GPU"
pubDate: 2025-01-14
updatedDate: 2026-11-08
summary: "EvoRL collega ricerca per popolazioni, apprendimento per rinforzo e simulazione parallela, offrendo una base sperimentale per approcci evolutivi a Physical AI."
---

Physical AI deve esplorare comportamenti diversi, verificarli attraverso l'interazione e riutilizzare l'esperienza acquisita. EvoRL porta questo ciclo nella simulazione parallela: le politiche individuali apprendono, mentre la ricerca per popolazioni esplora alternative e configurazioni di apprendimento. La relazione tra apprendimento ed evoluzione diventa così sperimentabile.

![Modelli di gambe meccaniche esplorano percorsi diversi in un ciclo di simulazione](./population-learning-loop.webp)

EvoRL è un framework di ricerca open source costruito attorno a queste domande. Basato su JAX, riunisce apprendimento per rinforzo, calcolo evolutivo e simulazione in un workflow comune per sviluppare e valutare metodi classici e ibridi. Progetto gemello di EvoX, si concentra sulla loro combinazione affinché la ricerca su popolazioni possa sfruttare le GPU moderne. [Presentazione del progetto](https://github.com/EMI-Group/evorl)

## Perché combinare evoluzione e apprendimento per rinforzo?

Consideriamo un robot che impara a camminare. Più politiche possono risolvere lo stesso compito, con andature, compromessi tra velocità e stabilità e consumi energetici diversi. Migliorare una politica lungo un solo percorso di apprendimento può lasciare inesplorate molte possibilità.

L’apprendimento per rinforzo usa i dati d’interazione per affinare le politiche. Il calcolo evolutivo mantiene un insieme di candidati, li valuta, seleziona e modifica per preservare più direzioni di ricerca. La combinazione permette di studiare un processo più ricco: gli individui migliorano attraverso l’esperienza, mentre la popolazione diffonde risultati utili.

La ricerca evolutiva può agire direttamente sui parametri delle politiche oppure regolare gli iperparametri dell’apprendimento. Sono domande diverse: quali politiche cercare e come aiutarle ad apprendere meglio?

Questa complementarità non significa che i metodi ibridi superino sempre il solo apprendimento per rinforzo. Offre più scelte progettuali da verificare; EvoRL mira a ridurne il costo di sviluppo e di calcolo.

## Il progetto centrale: una pipeline pensata per le GPU

La diversità rende interessanti i metodi a popolazione, ma aumenta anche il lavoro necessario. Ogni politica aggiuntiva può richiedere più interazioni, valutazioni e aggiornamenti dei parametri. Se queste fasi vengono ripartite tra CPU e GPU, trasferimenti ripetuti e scheduling possono diventare colli di bottiglia.

Con ambienti di simulazione GPU compatibili, EvoRL organizza interazioni, calcolo delle politiche, operazioni evolutive e aggiornamenti in una pipeline GPU end-to-end. La vettorizzazione e la compilazione just-in-time di JAX raggruppano i calcoli ripetuti e ottimizzano il grafo computazionale del passo di addestramento. [Panoramica tecnica](https://evorl.readthedocs.io/latest/)

Il parallelismo opera su tre livelli:

- **Ambienti paralleli**: una politica interagisce con più istanze dell’ambiente per raccogliere esperienza in batch.
- **Individui paralleli**: più politiche candidate della popolazione vengono valutate contemporaneamente.
- **Addestramento parallelo**: più agenti apprendono contemporaneamente, sostenendo metodi ibridi e addestramento di popolazioni.

Diventa così più semplice sperimentare con più politiche alla volta. La dimensione della popolazione deve comunque tenere conto della memoria GPU, del costo dell’ambiente e delle dimensioni della rete. [Articolo sull’architettura](https://arxiv.org/abs/2501.15129)

## Confrontare quattro famiglie di metodi nello stesso framework

EvoRL offre una base sperimentale comune per definire baseline e aggiungere successivamente nuovi meccanismi di ricerca o apprendimento.

| Famiglia | Algoritmi rappresentativi | Domanda principale |
| --- | --- | --- |
| Apprendimento per rinforzo | PPO, TD3, SAC e altri | Come migliorare una politica dai dati d’interazione? |
| Algoritmi evolutivi | OpenES, ARS, CMA-ES e altri | Come guidare la ricerca usando le valutazioni dei candidati? |
| Apprendimento per rinforzo guidato dall’evoluzione | ERL, CEM-RL e varianti | Come far cooperare ricerca evolutiva e apprendimento tramite gradiente? |
| AutoRL basato su popolazioni | PBT-PPO, PBT-SAC e altri | Come adattare le configurazioni durante l’addestramento? |

Due direzioni ibride meritano particolare attenzione.

**L’apprendimento per rinforzo guidato dall’evoluzione** collega ricerca nella popolazione e apprendimento individuale. Una popolazione può esplorare regioni diverse dello spazio dei parametri, mentre gli aggiornamenti per rinforzo migliorano i candidati. Gli algoritmi differiscono nella condivisione dell’esperienza, negli aggiornamenti individuali e nella selezione. EvoRL fornisce implementazioni per studiare queste scelte.

**L’AutoRL basato su popolazioni** esplora le configurazioni di addestramento. In PBT, per esempio, diversi individui si addestrano separatamente. In base a valutazioni periodiche, ereditano lo stato di addestramento di individui migliori e perturbano gli iperparametri per continuare l’esplorazione. Gli iperparametri possono quindi cambiare durante il processo.

Gli algoritmi e le varianti disponibili dipendono dall’implementazione corrente del repository. [Elenco degli algoritmi](https://github.com/EMI-Group/evorl#algorithms)

## Modularità: dalle idee agli esperimenti

Lo sviluppo di metodi ibridi richiede spesso molto lavoro su adattamento degli ambienti, organizzazione dei dati, valutazione e interfacce. EvoRL struttura queste responsabilità con poche astrazioni fondamentali:

- **Env** offre un’interfaccia comune per interagire con gli ambienti.
- **Agent** definisce comportamento e logica di apprendimento dell’agente.
- **SampleBatch** organizza traiettorie e campioni.
- **Workflow** definisce i passi di addestramento dell’algoritmo.
- **EC** fornisce algoritmi evolutivi e relativi operatori.

Questi moduli consentono di modificare una parte specifica dell’esperimento. È possibile sostituire il metodo di ricerca mantenendo ambiente e rete della politica, oppure confrontare l’apprendimento prima e dopo l’aggiunta di operazioni evolutive. [Documentazione del framework e delle API](https://evorl.readthedocs.io/latest/)

Un’implementazione comune facilita anche il controllo delle variabili. Allineare compiti, valutazioni e budget di calcolo aiuta a distinguere i miglioramenti algoritmici dalle differenze implementative. Il framework agevola il confronto, ma il rigore del protocollo rimane responsabilità del ricercatore.

## Che cosa significano i miglioramenti delle prestazioni?

L’articolo EvoRL confronta l’efficienza computazionale nell’ambiente Swimmer di Brax, su una macchina con due CPU Intel Xeon Gold 6132, 128 GiB di RAM e una GPU RTX 3090. Nelle configurazioni provate, OpenES raggiunge un’accelerazione massima superiore a 60× rispetto all’implementazione distribuita su CPU di RLlib; CEM-RL ottiene circa 5–9× rispetto alla propria implementazione ufficiale.

Questi risultati riguardano compiti, dimensioni delle popolazioni e baseline specifici. Non implicano gli stessi guadagni in ogni compito né una riduzione equivalente dei campioni necessari per raggiungere una ricompensa obiettivo. [Configurazione sperimentale e risultati](https://arxiv.org/html/2501.15129v1#S5)

Nella pianificazione degli esperimenti, un throughput maggiore permette di considerare più semi casuali, studi di ablazione più completi o popolazioni più grandi. Il vantaggio concreto è poter verificare più idee con il budget disponibile.

## Dal controllo robotico a nuovi compiti decisionali

EvoRL supporta Brax e MuJoCo Playground per controllo continuo, ricerca di politiche e addestramento di popolazioni. Le integrazioni sperimentali con gymnax, Jumanji e JaxMARL comprendono controllo classico, giochi, ottimizzazione combinatoria e scenari multiagente; la compatibilità va verificata per ogni configurazione. Sono supportati anche alcuni ambienti CPU: una pipeline interamente su GPU dipende quindi dalla combinazione scelta. [Ambienti supportati](https://github.com/EMI-Group/evorl#rl-environments)

Per studiare l’apprendimento per rinforzo evolutivo, può partire dagli algoritmi esistenti e modificare poi la cooperazione tra ricerca nella popolazione e apprendimento delle politiche. Per l’AutoRL, PBT offre un punto di partenza per esaminare l’effetto delle configurazioni. Se sviluppa nuovi metodi di ottimizzazione, può integrare gradualmente i propri componenti tramite le interfacce comuni.

## Avviare il primo esperimento

L’installazione attuale richiede Python 3.12 o successivo e JAX/jaxlib 0.10.0 o successivo. [EvoRL](https://github.com/EMI-Group/evorl#installation)

Segua prima la [guida all’installazione](https://evorl.readthedocs.io/latest/guide/installation.html) per configurare JAX in base all’hardware. Installi poi EvoRL dai sorgenti per ottenere script e configurazioni dell’esempio:

```bash
git clone https://github.com/EMI-Group/evorl.git
cd evorl
pip install -e .
```

Può iniziare con una baseline PPO nell’ambiente Ant di Brax:

```bash
python scripts/train.py agent=ppo env=brax/ant
```

EvoRL usa Hydra per gestire le configurazioni. Una volta verificata la baseline, può variare semi casuali, configurazioni degli algoritmi e impostazioni degli ambienti, prima di passare ai metodi ibridi o alle popolazioni. Le istruzioni complete sono nella [guida rapida](https://evorl.readthedocs.io/latest/guide/quickstart.html).

Conservi la prima esecuzione PPO come riferimento: salvi ambiente, seed, configurazione e curva prima di cambiare un componente. Per iniziare da una ricerca di popolazione più semplice, consulti il [tutorial EvoX](/it/news/evox-quickstart).
