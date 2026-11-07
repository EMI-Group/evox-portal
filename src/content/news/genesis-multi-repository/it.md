---
title: "Genesis multi-repository: un obiettivo, storie indipendenti"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 aggiunge worktree persistenti ai repository associati modificabili, chiarendo i confini di esecuzione, revisione e integrazione."
---

Una funzionalità può coinvolgere servizio API, applicazione client e libreria condivisa. L'obiettivo è comune, ma i repository Git possono essere distinti. Genesis 0.13.4, pubblicato il 26 settembre 2026, aggiunge worktree persistenti ai repository associati modificabili, rendendo più esplicito il confine di esecuzione.

## Dall'accesso all'isolamento del lavoro

La versione 0.11.4 introduce lettura e scrittura su repository aggiuntivi, revisioni individuali e blocchi di scrittura per quelli di sola lettura. Con 0.13.4 gli agenti lavorano in un worktree persistente per ogni repository associato modificabile, senza spostarne l'HEAD principale o disturbare l'albero di lavoro primario.

I percorsi vengono risolti rispetto al worktree. Il contesto iniziale ne mostra la posizione e la delega tra repository la usa come base. Il luogo delle modifiche resta esplicito anche con strutture di cartelle diverse o altre attività di sviluppo in corso.

## L'integrazione si decide per repository

La versione 0.13.0 introduce schede di revisione con merge, rifiuto, controlli e stati di risoluzione separati. Una scorciatoia accetta insieme i repository ancora aperti, mantenendo visibili gli esiti individuali. Corregge inoltre le revisioni delle attività che modificano solo repository associati.

Per una modifica API, servizio, client e libreria possono essere esaminati nelle rispettive storie. Interfacce compatibili e test adeguati restano necessari: un merge multi-repository non dimostra una transazione atomica né compatibilità automatica.

## Una base per sistemi più grandi

Il traguardo riguarda l'organizzazione quanto la generazione del lavoro. Genesis coordina contributi tra repository mantenendo i punti in cui l'utente li esamina e li accetta. Estende così la direzione di evoluzione del software di EvoX a sistemi composti da parti mantenute indipendentemente, con versioni accettate come base per lo sviluppo successivo.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.11.4) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
