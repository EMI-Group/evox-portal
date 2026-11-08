---
title: "Genesis Server: un ambiente persistente per sviluppare software"
pubDate: 2026-11-02
summary: "Dalla distribuzione headless in 0.13.11 alla continuità dopo il logout in 0.14.0, Genesis rende dashboard e agenti distribuibili indipendentemente."
updatedDate: 2026-11-08
---

Genesis 0.14.0, pubblicato il 2 novembre 2026, rileva lo stato del lingering systemd all'avvio e propone di abilitarlo. Segue la distribuzione headless introdotta in 0.13.11 il 30 ottobre. L'ambiente di esecuzione può così avere un ciclo di vita gestito separatamente dalla sessione desktop.

![Un server antracite resta acceso accanto a un paravento](./persistent-server-session.webp)

## Una distribuzione server con controlli operativi

Il pacchetto include dashboard e runtime degli agenti per Linux x64/arm64 e macOS arm64. La CLI copre servizio, avvio, arresto, stato, log, salute e versione. Lo script verifica i checksum, installa o aggiorna il pacchetto e collega l'eseguibile. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Gestire il ciclo di vita attorno all'esecuzione

Su Linux con systemd, il lingering può essere necessario per mantenere i servizi utente dopo il logout. La versione 0.14.0 verifica questa condizione, configurabile tramite `GENESIS_LINGER` o `--no-linger`. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

La versione precedente migliora anche l'avvio remoto: wrapper POSIX shell, gestione dei percorsi con spazi e motivazioni leggibili degli errori. Le correzioni della modalità server e il tempo di attività accurato semplificano la diagnosi. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Prima di lasciare il server in esecuzione

Prima di trasferire un’attività lunga sul server, ne verifichi stato, log e risposta di `/health`. Su un host systemd controlli lingering e verifichi nuovamente la disponibilità dopo la disconnessione. Questi controlli stabiliscono la base operativa; la [cronologia di sviluppo](/it/news/genesis-development-history) aiuta poi a seguire il codice prodotto.
