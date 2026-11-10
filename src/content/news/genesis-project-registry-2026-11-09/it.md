---
title: "Genesis in sviluppo: un registro persistente dei progetti"
pubDate: 2026-11-10
summary: "Le modifiche di main del 9 novembre sostituiscono i progetti recenti con un registro su database e separano scelte locali e remote."
---

Aprire un repository su un’altra macchina richiede un’identità distinta dai progetti locali. Le modifiche integrate in Genesis main il 9 novembre 2026 collegano Projects e la palette a un registro VCT su database, sostituendo l’elenco recente. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Cartelle di progetto in armadi distinti con etichette di registro corrispondenti](./project-host-registry.webp)

## Un posto registrato per ogni progetto

Apertura e creazione registrano il mount tramite l’interfaccia consapevole del nodo. La palette cerca i percorsi registrati e il progetto attivo può mostrare il punto di mount. Gli elenchi remoti provengono dall’host scelto, senza voci locali durante la connessione. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Verificare l’host prima di continuare

Nei build di sviluppo con queste modifiche, riapra un repository locale e remoto e verifichi identità e suggerimenti di percorso. Il registro serve alla navigazione; il codice segue la normale validazione del progetto.

[Genesis multi-repository: un obiettivo, storie indipendenti](/it/news/genesis-multi-repository)
