---
title: "Sviluppo di Genesis: Assistant e server remoto condiviso"
pubDate: 2026-11-07
summary: "Il ramo main introduce una chat operativa, un server remoto condiviso e una gestione più semplice dei processi in background."
---

Le modifiche integrate nel ramo `main` di Genesis dal 4 al 7 novembre 2026 migliorano le operazioni quotidiane.

Genesis Assistant diventa una chat operativa nella dashboard: può esaminare attività e capacità del sistema e richiedere operazioni o modifiche alla configurazione. I livelli read/write/sudo distinguono le consultazioni dalle operazioni che richiedono l’approvazione del codice esatto; sudo ha una scheda separata. Consulti la [guida Assistant][assistant] per i limiti.

Lo sviluppo remoto condivide ora un’unica istanza server con la dashboard HTTP. `genesis remote stop` disattiva la distribuzione remota lasciando HTTP attivo. I processi in background ricevono identificatori brevi come `bash-1`; `job_output` può omettere `job_id` quando l’agente chiamante possiede un solo processo.

Nelle build di sviluppo, il percorso personalizzato del file di credenziali OAuth appartiene ora ai singoli profili di modello (`[[llm.models]]`), anziché all’impostazione globale `[llm] oauth_file`.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

