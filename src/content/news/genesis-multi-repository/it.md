---
title: "Genesis multi-repository: un obiettivo, storie indipendenti"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 aggiunge worktree persistenti ai repository associati modificabili, chiarendo i confini di esecuzione, revisione e integrazione."
updatedDate: 2026-11-08
---

Una funzionalità può coinvolgere servizio API, applicazione client e libreria condivisa. L'obiettivo è comune, ma i repository Git possono essere distinti. Genesis 0.13.4, pubblicato il 26 settembre 2026, aggiunge worktree persistenti ai repository associati modificabili, rendendo più esplicito il confine di esecuzione.

![Tre cortili indipendenti con ingressi propri collegati da un nastro rosso](./companion-worktrees.webp)

## Dall'accesso all'isolamento del lavoro

La versione 0.11.4 introduce lettura e scrittura su repository aggiuntivi, revisioni individuali e blocchi di scrittura per quelli di sola lettura. Con 0.13.4 gli agenti lavorano in un worktree persistente per ogni repository associato modificabile, senza spostarne l'HEAD principale o disturbare l'albero di lavoro primario. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

I percorsi vengono risolti rispetto al worktree. Il contesto iniziale ne mostra la posizione e la delega tra repository la usa come base. Il luogo delle modifiche resta esplicito anche con strutture di cartelle diverse o altre attività di sviluppo in corso. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## L'integrazione si decide per repository

La versione 0.13.0 introduce schede di revisione con merge, rifiuto, controlli e stati di risoluzione separati. Una scorciatoia accetta insieme i repository ancora aperti, mantenendo visibili gli esiti individuali. Corregge inoltre le revisioni delle attività che modificano solo repository associati. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

Per una modifica API, esamini servizio, client e libreria condivisa nelle rispettive cronologie. Concordi versioni delle interfacce e ordine d’integrazione, poi verifichi il risultato combinato.

## Preparare la revisione tra repository

Prima di delegare, identifichi il worktree scrivibile di ciascun repository. Poi usi la scheda di revisione per esaminare modifiche, controlli di merge e stato di risoluzione. Il lavoro trasversale diventa una serie di decisioni concrete. La [cronologia di sviluppo](/it/news/genesis-development-history) aiuta a rintracciare i commit.
