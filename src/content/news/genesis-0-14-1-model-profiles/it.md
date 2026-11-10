---
title: "Genesis 0.14.1: mantenere le scelte del modello legate al lavoro"
pubDate: 2026-11-10
summary: "I profili di account collegano modello e ragionamento in Genesis; lo sviluppo remoto passa a un server condiviso."
---

Scegliere un modello coinvolge anche account, credenziali e ragionamento. Genesis 0.14.1, pubblicato l’8 novembre 2026, trasmette questa scelta tra Settings, Projects, Assistant, scheduler e runtime, riducendo la distanza tra richiesta ed esecuzione effettiva. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![La scheda dell’account selezionato resta collegata alle opzioni del modello](./provider-account-continuity.webp)

## Un profilo, una selezione coerente

I profili canonici separano account del fornitore e modello. Selettori comuni espongono modello e ragionamento; le correzioni allo scheduler preservano scelte esplicite e configurazione completa salvata. I profili supportati aggiungono autenticazione OAuth/abbonamento, stato di accesso individuale e importazione di credenziali dalle CLI dei fornitori.

## Un server per uso locale e remoto

Lo sviluppo remoto usa ora genesis_server, come la dashboard headless. La distribuzione separata genesis_remote viene ritirata. La CLI gestisce avvio, arresto, stato e log remoti; la distribuzione si può commutare durante l’esecuzione mantenendo HTTP disponibile.

## Controllare il passaggio durante l’aggiornamento

Dopo l’aggiornamento verifichi account, modello e ragionamento in Settings, quindi un’attività con scelta esplicita. I percorsi OAuth personalizzati appartengono ai singoli profili. Esamini il server condiviso prima di riutilizzare vecchi script del demone. Le note di rilascio riportano migrazione e correzioni complete. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant: capire e gestire il lavoro in corso](/it/news/genesis-development-2026-11-07)
