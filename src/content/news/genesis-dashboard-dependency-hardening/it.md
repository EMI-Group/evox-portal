---
title: "Genesis rafforza le dipendenze della dashboard"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main aggiorna Phoenix, LiveView, Bandit e jsv; le installazioni dai sorgenti richiedono una nuova compilazione."
---

Il 23 novembre 2026 Genesis ha aggiornato quattro dipendenze su `main`. La manutenzione riguarda l’infrastruttura web condivisa che permette di accedere all’ambiente di lavoro. Per chi compila Genesis dai sorgenti, conta l’insieme delle dipendenze usato per costruire il servizio in esecuzione. [Aggiornamento][lock]

![Un componente sostitutivo rinforza il meccanismo di una serratura](./cover.webp)

*Illustrazione concettuale: manutenzione dei componenti che proteggono un ingresso condiviso.*

## Cosa cambia sotto l’interfaccia

La dichiarazione delle dipendenze associa Phoenix a correzioni dei crash nel tracciamento delle presenze e nella distribuzione broadcast, e il minimo LiveView a una correzione degli hook di inizializzazione della sessione saltati quando la richiesta di connessione omette l’URL. Descrive inoltre le verifiche e il rafforzamento HTTP/2 di Bandit. Sono le motivazioni registrate dai manutentori di Genesis; il commit non stabilisce l’esposizione di una specifica installazione. [Requisiti][pins]

Il lockfile porta Phoenix da 1.8.16 a 1.8.17, LiveView da 1.2.13 a 1.2.15, Bandit da 1.14.1 a 1.15.0 e jsv da 0.28.0 a 0.28.1. Il minimo dichiarato di LiveView è 1.2.14, mentre la build bloccata usa 1.2.15. Una modifica Nix ricalcola l’hash delle dipendenze. [Versioni][lock] · [Modifica Nix][nix]

## Verificare la build effettivamente distribuita

Un team che gestisce il proprio server può, per esempio, aggiornare i sorgenti continuando a eseguire un vecchio binario. Usi una revisione contenente questi commit e ricompili e ridistribuisca l’applicazione secondo la procedura del progetto. Verifichi il `mix.lock` della build, mantenga l’hash Nix corrispondente ove applicabile e controlli l’accesso alla dashboard e la riconnessione in tempo reale. Aggiornare soltanto la directory sorgente non sostituisce il servizio attivo. [Guida all’installazione][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

La manutenzione del 25 novembre 2026 porta anche `db_connection` a 2.10.3. Il codice collega questo minimo di sicurezza a strutture stream contraffatte che raggiungono l’opzione di logging. Aggiorna inoltre dipendenze Markdown native e hash Nix. Ricompili con lockfile e definizioni Nix corrispondenti. [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
