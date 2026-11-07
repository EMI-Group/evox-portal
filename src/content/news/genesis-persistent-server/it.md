---
title: "Genesis Server: un ambiente persistente per sviluppare software"
pubDate: 2026-11-02
summary: "Dalla distribuzione headless in 0.13.11 alla continuità dopo il logout in 0.14.0, Genesis rende dashboard e agenti distribuibili indipendentemente."
---

Genesis 0.14.0, pubblicato il 2 novembre 2026, rileva lo stato del lingering systemd all'avvio e propone di abilitarlo. Segue la distribuzione headless introdotta in 0.13.11 il 30 ottobre. L'ambiente di esecuzione può così avere un ciclo di vita gestito separatamente dalla sessione desktop.

## Una distribuzione server con controlli operativi

Il pacchetto include dashboard e runtime degli agenti per Linux x64/arm64 e macOS arm64. La CLI copre servizio, avvio, arresto, stato, log, salute e versione. Lo script verifica i checksum, installa o aggiorna il pacchetto e collega l'eseguibile.

Queste interfacce consentono di gestire un processo persistente. L'endpoint di salute restituisce stato, versione e tempo di attività; i log mostrano il comportamento del servizio. Un processo sano non dimostra però che le modifiche di un agente siano corrette o che il progetto superi i test. Stato del runtime e validazione del software restano responsabilità distinte.

## Gestire il ciclo di vita attorno all'esecuzione

Su Linux con systemd, il lingering può essere necessario per mantenere i servizi utente dopo il logout. La versione 0.14.0 verifica questa condizione, configurabile tramite GENESIS_LINGER o --no-linger. È una funzione specifica della piattaforma, non una promessa di comportamento identico su ogni sistema operativo.

La versione precedente migliora anche l'avvio remoto: wrapper POSIX shell, gestione dei percorsi con spazi e motivazioni leggibili degli errori. Le correzioni della modalità server e il tempo di attività accurato semplificano la diagnosi.

## La distribuzione è parte dello sviluppo

Per attività prolungate, scegliere la macchina di esecuzione è parte del flusso di lavoro. Il server offre un componente distribuibile con controlli espliciti del ciclo di vita. Estende Genesis oltre il solo desktop e rafforza il lato operativo dell'infrastruttura EvoX, senza sostituire revisione, validazione o scelta dei risultati da accettare.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)
